import {
    ChatPrompt,
    CompletionPrompt,
    Function,
    FunctionParameter,
    Message,
    Parameter,
    Prompt,
} from "prompt-schema";
import {
    DEFAULT_CHAT_ENGINE,
    DEFAULT_COMPLETION_ENGINE,
    SCHEMA_VERSION,
} from "../config/Constants";
import { EngineType, InterfaceType, ParameterType } from "../providers/EngineProvider";
import { findModel } from "./PromptLoader";

export function createDefaultPrompt(type: InterfaceType): ChatPrompt | CompletionPrompt {
    switch (type) {
        case InterfaceType.CHAT:
            return new ChatPrompt(`chat@${SCHEMA_VERSION}`, DEFAULT_CHAT_ENGINE, [
                new Message("user", undefined, ""),
            ]);
        case InterfaceType.COMPLETION:
            return new CompletionPrompt(
                `completion@${SCHEMA_VERSION}`,
                DEFAULT_COMPLETION_ENGINE,
                ""
            );
    }
}

export function resetModel(prompt: Prompt, engine: string): Prompt {
    const [group, model] = findModel(engine);
    // reserve compatible parameters

    const parameterTypes = getModelParameters(model);
    const parameters = prompt.parameters?.filter(
        (p) => parameterTypes.filter((t) => t.name == p.name).length > 0
    );

    return { ...prompt, engine: engine, parameters: parameters };
}

export function removeParameter(prompt: Prompt, name: string): Prompt {
    const parameters = prompt.parameters?.filter((p) => p.name != name);
    return { ...prompt, parameters: parameters };
}

export function getModelParameters(model: EngineType): ParameterType[] {
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

export function changeMessage(prompt: ChatPrompt, index: number, message: Message): ChatPrompt {
    prompt.messages[index] = message;
    return { ...prompt };
}

export function removeMessage(prompt: ChatPrompt, index: number): ChatPrompt {
    prompt.messages.splice(index, 1);
    return { ...prompt, messages: prompt.messages };
}

export function insertMessage(prompt: ChatPrompt, index: number): ChatPrompt {
    let message;
    if (index > prompt.messages.length - 1) {
        message = new Message("user", undefined, "");
    } else {
        const role = prompt.messages[index].role == "user" ? "assistant" : "user";
        message = new Message(role, undefined, "");
    }

    prompt.messages.splice(index + 1, 0, message);
    return { ...prompt, messages: prompt.messages };
}

export function setContext(prompt: ChatPrompt, context?: string): ChatPrompt {
    return { ...prompt, context: context };
}

export function changeExample(prompt: ChatPrompt, index: number, message: Message): ChatPrompt {
    // fixme: range check
    prompt.examples![index] = message;
    return { ...prompt };
}

export function removeExample(prompt: ChatPrompt, index: number): ChatPrompt {
    const examples = prompt.examples || [];
    examples.splice(index, 1);
    return { ...prompt, examples: examples.length == 0 ? undefined : examples };
}

export function insertExample(prompt: ChatPrompt, index: number): ChatPrompt {
    let role = "user";
    if (prompt.examples) role = prompt.examples![index].role == "user" ? "assistant" : "user";
    const message = new Message(role, undefined, "");
    const examples = prompt.examples || [];
    examples.splice(index + 1, 0, message);
    return { ...prompt, examples: examples };
}

export function insertFunction(prompt: ChatPrompt, index: number): ChatPrompt {
    const f = new Function("get_current_weather", "Get the current weather", [
        new FunctionParameter(
            "location",
            "string",
            true,
            "The city and state, e.g. San Francisco, CA"
        ),
        new FunctionParameter(
            "format",
            "string",
            true,
            "The temperature unit to use. Infer this from the users location.",
            ["celsius", "fahrenheit"]
        ),
    ]);
    const functions = prompt.functions || [];
    functions.splice(index + 1, 0, f);
    return { ...prompt, functions: functions };
}
