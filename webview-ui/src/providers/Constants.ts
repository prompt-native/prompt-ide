import { ModelType } from "./Common";
import { MINIMAX_MODELS } from "./Minimax";
import { GPT3_5_MODELS } from "./OpenAI";

const MODEL_GROUPS: { [key: string]: ModelType[] } = {
    GPT_3: GPT3_5_MODELS,
    MINIMAX: MINIMAX_MODELS,
};

export function findModel(engine: string): [string, ModelType] {
    for (const group of Object.keys(MODEL_GROUPS)) {
        const candidates = MODEL_GROUPS[group].filter((m) => m.name === engine);
        console.log(candidates);
        if (candidates.length > 1) {
            throw new Error(`Multiple models with the same name detected: ${engine}`);
        }
        if (candidates.length === 1) {
            return [group, candidates[0]];
        }
    }

    throw new Error(`Engine not supported: ${engine}`);
}

export { MODEL_GROUPS };
