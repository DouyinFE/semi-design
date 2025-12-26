import { BASE_CLASS_PREFIX } from '../base/constants';
import type { AppConfig, MLCEngineConfig } from './interface';

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-client-ai`,
} as const;

const strings = {} as const;

const numbers = {} as const;

// ============================================
// 国外配置（使用 Hugging Face + GitHub Raw）
// ============================================

// Qwen3-1.7B 模型配置 - 国外
export const Qwen3_1_7B_RECORD = {
    model: 'https://huggingface.co/mlc-ai/Qwen3-1.7B-q4f32_1-MLC',
    model_id: 'Qwen3-1.7B-q4f32_1-MLC',
    model_lib: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_80/Qwen3-1.7B-q4f32_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 2635.44,
    low_resource_required: true,
    overrides: {
        context_window_size: 40960,
    },
};

// Qwen3-1.7B 引擎配置 - 国外
export const Qwen3_1_7B_ENGINE_CONFIG: MLCEngineConfig = {
    appConfig: {
        useIndexedDBCache: true,
        model_list: [Qwen3_1_7B_RECORD],
    } as AppConfig,
};

// ============================================
// 中国配置（使用 ModelScope + jsDelivr CDN）
// ============================================

// Qwen3-1.7B 模型配置 - 中国
export const Qwen3_1_7B_RECORD_CN = {
    model: 'https://modelscope.cn/models/mlc-ai/Qwen3-1.7B-q4f32_1-MLC',
    model_id: 'Qwen3-1.7B-q4f32_1-MLC',
    model_lib: 'https://cdn.jsdelivr.net/gh/mlc-ai/binary-mlc-llm-libs@main/web-llm-models/v0_2_80/Qwen3-1.7B-q4f32_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 2635.44,
    low_resource_required: true,
    overrides: {
        context_window_size: 40960,
    },
};

// Qwen3-1.7B 引擎配置 - 中国
export const Qwen3_1_7B_ENGINE_CONFIG_CN: MLCEngineConfig = {
    appConfig: {
        useIndexedDBCache: true,
        model_list: [Qwen3_1_7B_RECORD_CN],
    } as AppConfig,
};

export { cssClasses, strings, numbers };
