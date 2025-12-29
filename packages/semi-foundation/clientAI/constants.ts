import { BASE_CLASS_PREFIX } from '../base/constants';
import type { AppConfig, MLCEngineConfig } from './interface';

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-client-ai`,
    WRAPPER: `${BASE_CLASS_PREFIX}-client-ai-wrapper`,
    LOADING: `${BASE_CLASS_PREFIX}-client-ai-loading`,
    LOADING_CONTENT: `${BASE_CLASS_PREFIX}-client-ai-loading-content`,
    LOADING_TEXT: `${BASE_CLASS_PREFIX}-client-ai-loading-text`,
    ERROR: `${BASE_CLASS_PREFIX}-client-ai-error`,
    CONTENT: `${BASE_CLASS_PREFIX}-client-ai-content`,
    DIALOGUE_WRAPPER: `${BASE_CLASS_PREFIX}-client-ai-dialogue-wrapper`,
    INPUT_WRAPPER: `${BASE_CLASS_PREFIX}-client-ai-input-wrapper`,
    INPUT_EDIT: `${BASE_CLASS_PREFIX}-client-ai-input-edit`,
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

// Qwen3-4B 模型配置 - 国外
export const Qwen3_4B_RECORD = {
    model: 'https://huggingface.co/mlc-ai/Qwen3-4B-q4f32_1-MLC',
    model_id: 'Qwen3-4B-q4f32_1-MLC',
    model_lib: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_80/Qwen3-4B-q4f32_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 6000,
    low_resource_required: false,
    overrides: {
        context_window_size: 40960,
    },
};

// Qwen3-4B 引擎配置 - 国外
export const Qwen3_4B_ENGINE_CONFIG: MLCEngineConfig = {
    appConfig: {
        useIndexedDBCache: true,
        model_list: [Qwen3_4B_RECORD],
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

// Qwen3-4B 模型配置 - 中国
export const Qwen3_4B_RECORD_CN = {
    model: 'https://modelscope.cn/models/mlc-ai/Qwen3-4B-q4f32_1-MLC',
    model_id: 'Qwen3-4B-q4f32_1-MLC',
    model_lib: 'https://cdn.jsdelivr.net/gh/mlc-ai/binary-mlc-llm-libs@main/web-llm-models/v0_2_80/Qwen3-4B-q4f32_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 6000,
    low_resource_required: false,
    overrides: {
        context_window_size: 40960,
    },
};

// Qwen3-4B 引擎配置 - 中国
export const Qwen3_4B_ENGINE_CONFIG_CN: MLCEngineConfig = {
    appConfig: {
        useIndexedDBCache: true,
        model_list: [Qwen3_4B_RECORD_CN],
    } as AppConfig,
};

export { cssClasses, strings, numbers };
