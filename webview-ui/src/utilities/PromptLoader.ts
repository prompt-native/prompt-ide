import { ChatPrompt, CompletionPrompt, parsePrompt } from "prompt-schema";
import { MODEL_GROUPS } from "../config/Constants";
import { EngineType, InterfaceType } from "../providers/EngineProvider";
import { GPT3_5_MODELS } from "../providers/GptAdaptor";

export function getAvailableModels(group: string, type: InterfaceType): EngineType[] {
    return MODEL_GROUPS[group].filter((m) => m.id.interfaceType === type);
}

export function getAvailableGroups(type: InterfaceType): string[] {
    return Object.keys(MODEL_GROUPS).filter((group) => getAvailableModels(group, type).length > 0);
}

export function findModel(engine: string): [string, EngineType] {
    for (const group of Object.keys(MODEL_GROUPS)) {
        const candidates = MODEL_GROUPS[group].filter((m) => m.id.name === engine);
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
        return new ChatPrompt(
            "chat@0.1",
            GPT3_5_MODELS.filter((m) => m.id.interfaceType == InterfaceType.CHAT)[0].id.name,
            []
        );
    } else {
        const prompt = parsePrompt(text);
        const [g, m] = findModel(prompt.engine);
        const interfaceType = prompt.version.startsWith("chat@")
            ? InterfaceType.CHAT
            : InterfaceType.COMPLETION;
        if (m.id.interfaceType != interfaceType)
            throw new Error(`Model ${m.id.name} does not support mode ${interfaceType}`);
        return prompt;
    }
}
