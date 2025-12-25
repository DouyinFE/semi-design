import { BASE_CLASS_PREFIX } from '../base/constants';
import type { AppConfig, MLCEngineConfig } from './interface';

const cssClasses = {
    PREFIX: `${BASE_CLASS_PREFIX}-browser-ai`,
} as const;

const strings = {} as const;

const numbers = {} as const;

// 默认模型库 URL 前缀和版本（参考 web-llm 的默认值）
export const modelLibURLPrefix = 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/';
export const modelVersion = 'v0_2_80';

// 默认模型 ID
export const DEFAULT_MODEL_ID = 'Qwen3-1.7B-q4f32_1-MLC';

// 默认模型配置（参考实现中的配置）
export const DEFAULT_MODEL_RECORD = {
    model: 'https://modelscope.cn/models/mlc-ai/Qwen3-1.7B-q4f32_1-MLC',
    model_id: DEFAULT_MODEL_ID,
    model_lib: modelLibURLPrefix + modelVersion + '/Qwen3-1.7B-q4f32_1-ctx4k_cs1k-webgpu.wasm',
    vram_required_MB: 2635.44,
    low_resource_required: true,
    overrides: {
        context_window_size: 80960,
    },
};

// 默认 AppConfig
export const DEFAULT_APP_CONFIG: AppConfig = {
    useIndexedDBCache: true,
    model_list: [DEFAULT_MODEL_RECORD],
};

// 默认 EngineConfig
export const DEFAULT_ENGINE_CONFIG: MLCEngineConfig = {
    appConfig: DEFAULT_APP_CONFIG,
};

export { cssClasses, strings, numbers };

