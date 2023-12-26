import { ModelType } from "../providers/Common";
import { MINIMAX_MODELS } from "../providers/Minimax";
import { GPT3_5_MODELS } from "../providers/OpenAI";

export const MODEL_GROUPS: { [key: string]: ModelType[] } = {
    "GPT3.5": GPT3_5_MODELS,
    "Minimax": MINIMAX_MODELS,
};

export const SCHEMA_VERSION = "0.1";
export const DEFAULT_CHAT_ENGINE = "gpt-3.5-turbo";
export const DEFAULT_COMPLETION_ENGINE = "text-davinci-003";
