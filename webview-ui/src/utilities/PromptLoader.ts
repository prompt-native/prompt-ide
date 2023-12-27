import { ChatPrompt, CompletionPrompt, parsePrompt } from "prompt-schema";
import { MODEL_GROUPS } from "../config/Constants";
import { InterfaceType, ModelType } from "../providers/Common";
import { GPT3_5_MODELS } from "../providers/OpenAI";

export function getAvailableModels(group: string, type: InterfaceType): ModelType[] {
    return MODEL_GROUPS[group].filter((m) => m.interfaceType === type);
}

export function getAvailableGroups(type: InterfaceType): string[] {
    return Object.keys(MODEL_GROUPS).filter((group) => getAvailableModels(group, type).length > 0);
}

export function findModel(engine: string): [string, ModelType] {
    for (const group of Object.keys(MODEL_GROUPS)) {
        const candidates = MODEL_GROUPS[group].filter((m) => m.name === engine);
        if (candidates.length > 1) {
            throw new Error(`Multiple models with the same name detected: ${engine}`);
        }
        if (candidates.length === 1) {
            return [group, candidates[0]];
        }
    }

    throw new Error(`Engine not supported: ${engine}`);
}

export function loadPrompt(text: string): ChatPrompt | CompletionPrompt {
    if (text == "") {
        return new ChatPrompt("chat@0.1", GPT3_5_MODELS[0].name, []);
    } else {
        const prompt = parsePrompt(text);
        const [g, m] = findModel(prompt.engine);
        const interfaceType =
            prompt instanceof ChatPrompt ? InterfaceType.CHAT : InterfaceType.COMPLETION;
        if (m.interfaceType != interfaceType)
            throw new Error(`Model ${m.name} does not support ${interfaceType} mode`);
        return prompt;
    }
}
