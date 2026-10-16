#include <cmath>
#include "kernel_operator.h"
/*
 * AddRmsNormBias Kernel — Ascend C Direct Invocation
 * This file is #included — do NOT add main(), #pragma once, or include guards.
 *
 * 融合算子: out = rms_norm(x + residual, gamma, eps) + bias
 *   Step1: y = x + residual
 *   Step2: z = y / sqrt(mean(y^2) + eps) * gamma
 *   Step3: out = z + bias
 *
 * 精度策略: 归约(sum of squares)与 rsqrt 一律在 fp32 中完成,
 *           最终归一化与偏置加法在原类型 T 中完成, 兼顾精度与性能.
 */

using namespace AscendC;

// 每块 tile 的元素数 (fp32 下 8KB/缓冲, fp16 下 4KB/缓冲)
constexpr int32_t TILE_ELEM = 2048;

template <typename T>
__global__ __vector__ void add_rms_norm_bias_custom(
    const T* __restrict__ x,
    const T* __restrict__ residual,
    const T* __restrict__ gamma,
    const T* __restrict__ bias,
    T* __restrict__ output,
    const int64_t totalRows,
    const int32_t D,
    const float epsilon)
{
    TPipe pipe;

    // 32 字节对齐的元素数
    constexpr int32_t ELEM_PER_32B = 32 / sizeof(T);
    // tile 向上对齐到 32 字节
    const int32_t alignedTile =
        ((TILE_ELEM + ELEM_PER_32B - 1) / ELEM_PER_32B) * ELEM_PER_32B;
    // fp32 缓冲对齐 (8 个 float = 32 字节)
    const int32_t fp32AlignedTile = ((TILE_ELEM + 7) / 8) * 8;

    // ---- T 类型队列 ----
    TQue<QuePosition::VECIN, 2> xQue, resQue, gammaQue, biasQue, yQue;
    TQue<QuePosition::VECIN, 2> invRmsTQue;     // 存放转换后的 inv_rms (T)
    TQue<QuePosition::VECOUT, 2> outQue;

    // ---- fp32 归约队列 ----
    TQue<QuePosition::VECIN, 2> fp32YQue, fp32SqQue, fp32SumQue, fp32RmsQue, fp32TmpQue;

    pipe.InitBuffer(xQue, alignedTile * sizeof(T));
    pipe.InitBuffer(resQue, alignedTile * sizeof(T));
    pipe.InitBuffer(gammaQue, alignedTile * sizeof(T));
    pipe.InitBuffer(biasQue, alignedTile * sizeof(T));
    pipe.InitBuffer(yQue, alignedTile * sizeof(T));
    pipe.InitBuffer(invRmsTQue, alignedTile * sizeof(T));
    pipe.InitBuffer(outQue, alignedTile * sizeof(T));

    pipe.InitBuffer(fp32YQue, fp32AlignedTile * sizeof(float));
    pipe.InitBuffer(fp32SqQue, fp32AlignedTile * sizeof(float));
    pipe.InitBuffer(fp32SumQue, fp32AlignedTile * sizeof(float));
    pipe.InitBuffer(fp32RmsQue, fp32AlignedTile * sizeof(float));
    pipe.InitBuffer(fp32TmpQue, fp32AlignedTile * sizeof(float));

    const int32_t blockId = GetBlockIdx();
    const int32_t blockNum = GetBlockNum();
    const float invDf = 1.0f / static_cast<float>(D);

    for (int64_t row = blockId; row < totalRows; row += blockNum) {
        const int64_t base = row * D;

        // ============ Pass 1: 在 fp32 中计算 sum(y^2) ============
        LocalTensor<float> runningSum = fp32SumQue.AllocTensor<float>();
        Duplicate(runningSum, 0.0f, fp32AlignedTile);

        for (int32_t d = 0; d < D; d += TILE_ELEM) {
            const int32_t tileLen = (D - d < TILE_ELEM) ? (D - d) : TILE_ELEM;
            const int32_t alignedLen =
                ((tileLen + ELEM_PER_32B - 1) / ELEM_PER_32B) * ELEM_PER_32B;

            DataCopyPad(xQue, (GM_ADDR)(x + base + d), alignedTile * sizeof(T), tileLen * sizeof(T), 0);
            DataCopyPad(resQue, (GM_ADDR)(residual + base + d), alignedTile * sizeof(T), tileLen * sizeof(T), 0);

            LocalTensor<T> xLocal = xQue.AllocTensor<T>();
            LocalTensor<T> resLocal = resQue.AllocTensor<T>();
            LocalTensor<T> yLocal = yQue.AllocTensor<T>();
            LocalTensor<float> fp32Y = fp32YQue.AllocTensor<float>();
            LocalTensor<float> fp32Sq = fp32SqQue.AllocTensor<float>();
            LocalTensor<float> partialSum = fp32RmsQue.AllocTensor<float>();
            LocalTensor<float> partialVec = fp32TmpQue.AllocTensor<float>();

            // y = x + residual
            Add(yLocal, xLocal, resLocal, alignedLen);
            // 转为 fp32 保证平方和累加精度
            Cast(fp32Y, yLocal, alignedLen);
            // sq = y^2
            Mul(fp32Sq, fp32Y, fp32Y, alignedLen);
            // 本 tile 部分和
            Sum(partialSum, fp32Sq, alignedLen);
            // 广播 partialSum[0] 后累加
            Broadcast(partialVec, partialSum, alignedLen, 0);
            Add(runningSum, runningSum, partialVec, alignedLen);
        }

        // ===== 计算 inv_rms = rsqrt(sum(y^2)/D + eps), 结果在 fp32 向量中 =====
        LocalTensor<float> rmsBroadcast = fp32SqQue.AllocTensor<float>();
        LocalTensor<float> invRmsFp32 = fp32RmsQue.AllocTensor<float>();

        Broadcast(rmsBroadcast, runningSum, fp32AlignedTile, 0);
        Mul(rmsBroadcast, rmsBroadcast, invDf, fp32AlignedTile);  // mean
        Add(rmsBroadcast, rmsBroadcast, epsilon, fp32AlignedTile); // var
        Rsqrt(invRmsFp32, rmsBroadcast, fp32AlignedTile);          // inv_rms

        // 将 inv_rms 转为 T 以便与 y(T) 运算
        LocalTensor<T> invRmsT = invRmsTQue.AllocTensor<T>();
        Cast(invRmsT, invRmsFp32, alignedTile);

        // ============ Pass 2: out = (x+residual) * inv_rms * gamma + bias ============
        for (int32_t d = 0; d < D; d += TILE_ELEM) {
            const int32_t tileLen = (D - d < TILE_ELEM) ? (D - d) : TILE_ELEM;
            const int32_t alignedLen =
                ((tileLen + ELEM_PER_32B - 1) / ELEM_PER_32B) * ELEM_PER_32B;

            DataCopy(xQue, (GM_ADDR)(x + base + d), tileLen * sizeof(T));
            DataCopy(resQue, (GM_ADDR)(residual + base + d), tileLen * sizeof(T));
            DataCopy(gammaQue, (GM_ADDR)(gamma + d), tileLen * sizeof(T));
            DataCopy(biasQue, (GM_ADDR)(bias + d), tileLen * sizeof(T));

            LocalTensor<T> xLocal = xQue.AllocTensor<T>();
            LocalTensor<T> resLocal = resQue.AllocTensor<T>();
            LocalTensor<T> gammaLocal = gammaQue.AllocTensor<T>();
            LocalTensor<T> biasLocal = biasQue.AllocTensor<T>();
            LocalTensor<T> yLocal = yQue.AllocTensor<T>();
            LocalTensor<T> outLocal = outQue.AllocTensor<T>();

            Add(yLocal, xLocal, resLocal, alignedLen);                 // y
            Mul(outLocal, yLocal, invRmsT, alignedLen);                // y * inv_rms
            Mul(outLocal, outLocal, gammaLocal, alignedLen);           // * gamma
            Add(outLocal, outLocal, biasLocal, alignedLen);            // + bias

            outQue.EnQue(outLocal);
            DataCopy((GM_ADDR)(output + base + d), outQue, tileLen * sizeof(T));
        }
    }
}

// 根据 dtype 派发并启动 kernel
extern "C" void run_kernel(
    GM_ADDR x, const TensorGroupInfo& info_x,
    GM_ADDR residual, const TensorGroupInfo& info_residual,
    GM_ADDR gamma, const TensorGroupInfo& info_gamma,
    GM_ADDR bias, const TensorGroupInfo& info_bias,
    GM_ADDR output, const TensorGroupInfo& info_output,
    int64_t availableCoreNum, aclrtStream stream,
    float epsilon)
{
    const TensorInfo& ti = info_x.tensors[0];
    const int32_t dtype = ti.dtype;
    const int64_t numDims = ti.numDims;

    // 总元素数与最后一维 D
    int64_t totalElems = 1;
    for (int64_t i = 0; i < numDims; ++i) {
        totalElems *= ti.shape[i];
    }
    const int32_t D = static_cast<int32_t>(ti.shape[numDims - 1]);
    const int64_t totalRows = totalElems / D;

    // block 数 = min(可用核心数, 总行数), 至少 1
    int64_t blockNum = availableCoreNum;
    if (blockNum > totalRows) {
        blockNum = totalRows;
    }
    if (blockNum <= 0) {
        blockNum = 1;
    }

    if (dtype == 0) {
        // fp32
        add_rms_norm_bias_custom<float>
            <<<blockNum, nullptr, stream>>>(
                reinterpret_cast<const float*>(x),
                reinterpret_cast<const float*>(residual),
                reinterpret_cast<const float*>(gamma),
                reinterpret_cast<const float*>(bias),
                reinterpret_cast<float*>(output),
                totalRows, D, epsilon);
    } else if (dtype == 1) {
        // fp16
        add_rms_norm_bias_custom<half>
            <<<blockNum, nullptr, stream>>>(
                reinterpret_cast<const half*>(x),
                reinterpret_cast<const half*>(residual),
                reinterpret_cast<const half*>(gamma),
                reinterpret_cast<const half*>(bias),
                reinterpret_cast<half*>(output),
                totalRows, D, epsilon);
    } else if (dtype == 2) {
        // bf16
        add_rms_norm_bias_custom<bfloat16_t>
            <<<blockNum, nullptr, stream>>>(
                reinterpret_cast<const bfloat16_t*>(x),
                reinterpret_cast<const bfloat16_t*>(residual),
                reinterpret_cast<const bfloat16_t*>(gamma),
                reinterpret_cast<const bfloat16_t*>(bias),
                reinterpret_cast<bfloat16_t*>(output),
                totalRows, D, epsilon);
    }
}
