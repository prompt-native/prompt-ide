import { ChatPrompt, CompletionPrompt, Prompt } from "prompt-schema";
import {
    DEFAULT_CHAT_ENGINE,
    DEFAULT_COMPLETION_ENGINE,
    SCHEMA_VERSION,
} from "../config/Constants";
import { InterfaceType, ModelType } from "../providers/Common";

export function createDefaultPrompt(type: InterfaceType): ChatPrompt | CompletionPrompt {
    switch (type) {
        case InterfaceType.CHAT:
            return new ChatPrompt(`chat@${SCHEMA_VERSION}`, DEFAULT_CHAT_ENGINE, []);
        case InterfaceType.COMPLETION:
            return new CompletionPrompt(
                `completion@${SCHEMA_VERSION}`,
                DEFAULT_COMPLETION_ENGINE,
                ""
            );
    }
}

export function resetModel(prompt: Prompt, model: ModelType): Prompt {
    prompt.engine = model.name;
    prompt.parameters = undefined;
    return { ...prompt, engine: model.name, parameters: undefined };
}
