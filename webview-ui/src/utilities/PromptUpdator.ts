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

export function findParameterType(engine: string, name: String): ParameterType {
    const [group, model] = findModel(engine);
    const parameterTypes = getModelParameters(model).filter((p) => p.name == name);
    if (parameterTypes.length != 1)
        throw new Error("Parameter not supported or duplicated:" + name);
    return parameterTypes[0];
}

export function enableParameter(prompt: Prompt, name: string): Prompt {
    const parameters = prompt.parameters || [];
    const parameterType = findParameterType(prompt.engine, name);
    let initValue: number | string | boolean = "";
    if (parameterType.type == "number")
        initValue = parameterType.defaultValue || parameterType.minValue || 0;
    else if (parameterType.type == "string") initValue = parameterType.defaultValue || "";
    else if (parameterType.type == "boolean") initValue = parameterType.defaultValue || false;
    // fixme: support array type
    else if (parameterType.type == "array") initValue = parameterType.defaultValue || "";

    return { ...prompt, parameters: [...parameters, new Parameter(name, initValue)] };
}

export function changeParameter(prompt: Prompt, name: string, valueStr: string): Prompt {
    const parameterType = findParameterType(prompt.engine, name);
    const parameters = prompt.parameters || [];
    const excluded = parameters.filter((p) => p.name != name);

    let value: number | string | boolean = "";
    if (parameterType.type == "number") {
        if (valueStr.includes(".")) value = parseFloat(valueStr);
        else value = parseInt(valueStr);
    } else if (parameterType.type == "string") value = valueStr;
    else if (parameterType.type == "boolean") value = Boolean(valueStr);
    // fixme: support array type
    else if (parameterType.type == "array") value = valueStr;

    return { ...prompt, parameters: [...excluded, new Parameter(name, value)] };
}
