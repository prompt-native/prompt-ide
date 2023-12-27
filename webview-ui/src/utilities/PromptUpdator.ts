import { ChatPrompt, CompletionPrompt, Parameter, Prompt } from "prompt-schema";
import {
    DEFAULT_CHAT_ENGINE,
    DEFAULT_COMPLETION_ENGINE,
    SCHEMA_VERSION,
} from "../config/Constants";
import { InterfaceType, ModelType, ParameterType } from "../providers/Common";
import { findModel } from "./PromptLoader";

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

export function resetModel(prompt: Prompt, engine: string): Prompt {
    prompt.engine = engine;
    prompt.parameters = undefined;
    return { ...prompt, engine: engine, parameters: undefined };
}

export function removeParameter(prompt: Prompt, name: string): Prompt {
    const parameters = prompt.parameters?.filter((p) => p.name != name);
    return { ...prompt, parameters: parameters };
}

export function getModelParameters(model: ModelType): ParameterType[] {
    if (typeof model.parameters == "function") {
        return model.parameters();
    } else {
        return model.parameters;
    }
}

export function enableParameter(prompt: Prompt, name: string): Prompt {
    const [group, model] = findModel(prompt.engine);
    const parameters = prompt.parameters || [];
    const parameterTypes = getModelParameters(model).filter((p) => p.name == name);
    if (parameterTypes.length != 1)
        throw new Error("Parameter not supported or duplicated:" + name);
    const parameterType = parameterTypes[0];
    let initValue: number | string | boolean = "";
    if (parameterType.type == "number")
        initValue = parameterType.defaultValue || parameterType.minValue || 0;
    else if (parameterType.type == "string") initValue = parameterType.defaultValue || "";
    else if (parameterType.type == "boolean") initValue = parameterType.defaultValue || false;
    // fixme: support array type
    else if (parameterType.type == "array") initValue = parameterType.defaultValue || "";

    return { ...prompt, parameters: [...parameters, new Parameter(name, initValue)] };
}
