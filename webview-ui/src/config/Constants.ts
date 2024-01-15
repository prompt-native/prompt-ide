import { EngineType } from "../providers/EngineProvider";
import { MINIMAX_MODELS } from "../providers/MinimaxAdaptor";
import { GPT3_5_MODELS, GPT_BASE_MODELS } from "../providers/OpenAIAdaptor";

export const MODEL_GROUPS: { [key: string]: EngineType[] } = {
    "GPTbase": GPT_BASE_MODELS,
    "GPT3.5": GPT3_5_MODELS,
    "Minimax": MINIMAX_MODELS,
};

export const SCHEMA_VERSION = "0.1";
export const DEFAULT_CHAT_ENGINE = "gpt-3.5-turbo";
export const DEFAULT_COMPLETION_ENGINE = "gpt-3.5-turbo-instruct";
