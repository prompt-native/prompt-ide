import { ChatPrompt, CompletionPrompt, Message } from "prompt-schema";
import { appendOutput, formatHeaders } from "../utilities/Message";
import EngineProvider, { EngineId, EngineType, ParameterType } from "./EngineProvider";
import {
    GPT_CHAT_URL,
    GPT_COMPLETION_URL,
    GptChatRequest,
    GptCompletionRequest,
    GptResponseBody,
    getResult,
} from "./GptApi";
import Result, { Choice } from "./Result";

const DEFAULT_SYSTEM: ParameterType = {
    name: "system",
    displayName: "System",
    description: "",
    type: "string",
    maxLength: 2048,
    defaultValue: "You'r a helpful assistant.",
};

const DEFAULT_TEMPERATURE: ParameterType = {
    name: "temperature",
    displayName: "Temperature",
    description:
        "The sampling temperature, between 0 and 1. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic. If set to 0, the model will use log probability to automatically increase the temperature until certain thresholds are hit.",
    type: "number",
    minValue: 0,
    maxValue: 2,
    defaultValue: 1,
};

const DEFAULT_TOP_P: ParameterType = {
    name: "top_p",
    displayName: "Top P",
    type: "number",
    minValue: 0,
    maxValue: 1,
    defaultValue: 1,
};

const DEFAULT_MAX_TOKENS: ParameterType = {
    name: "max_tokens",
    displayName: "Maximum length",
    type: "number",
    minValue: 1,
    maxValue: 4096,
    defaultValue: 512,
};

const DEFAULT_STOP_SEQUENCES: ParameterType = {
    name: "stop",
    displayName: "Stop sequences",
    type: "array",
};

const DEFAULT_FREQUENCY_PENALTY: ParameterType = {
    name: "frequency_penalty",
    displayName: "Frequency penalty",
    type: "number",
    minValue: 0,
    maxValue: 2,
    defaultValue: 0,
};

const DEFAULT_PRESENCE_PENALTY: ParameterType = {
    name: "presence_penalty",
    displayName: "Presence penalty",
    type: "number",
    minValue: 0,
    maxValue: 2,
    defaultValue: 0,
};

const getParamaters = (maxTokens: number): ParameterType[] => {
    return [
        DEFAULT_TEMPERATURE,
        DEFAULT_TOP_P,
        DEFAULT_FREQUENCY_PENALTY,
        DEFAULT_PRESENCE_PENALTY,
        DEFAULT_STOP_SEQUENCES,
        { ...DEFAULT_MAX_TOKENS, maxValue: maxTokens },
    ];
};

export const GPT_BASE_MODELS: EngineType[] = [
    {
        id: EngineId.completion("babbage-002"),
        parameters: () => getParamaters(4000),
        description: "Replacement for the GPT-3 ada and babbage base models.",
    },
    {
        id: EngineId.completion("davinci-002"),
        parameters: () => getParamaters(4000),
        description: "Replacement for the GPT-3 curie and davinci base models.",
    },
];
export const GPT3_5_MODELS: EngineType[] = [
    {
        id: EngineId.completion("gpt-3.5-turbo-instruct"),
        parameters: () => getParamaters(4096),
        description:
            "Similar capabilities as text-davinci-003 but compatible with legacy Completions endpoint and not Chat Completions.",
    },
    {
        id: EngineId.chat("gpt-3.5-turbo-instruct-0914"),
        parameters: () => getParamaters(4096),
        description:
            "Similar capabilities as text-davinci-003 but compatible with legacy Completions endpoint and not Chat Completions.",
    },
    {
        id: EngineId.chat("gpt-3.5-turbo"),
        parameters: () => getParamaters(4096),
        description:
            "Currently points to gpt-3.5-turbo-0613. Will point to gpt-3.5-turbo-1106 starting Dec 11, 2023. ",
    },
    {
        id: EngineId.chat("gpt-3.5-turbo-1106"),
        parameters: () => getParamaters(4096),
        description:
            "The latest GPT-3.5 Turbo model with improved instruction following, JSON mode, reproducible outputs, parallel function calling, and more. Returns a maximum of 4,096 output tokens.",
    },
    {
        id: EngineId.chat("gpt-3.5-turbo-16k"),
        parameters: () => getParamaters(16384),
        description:
            "Currently points to gpt-3.5-turbo-0613. Will point to gpt-3.5-turbo-1106 starting Dec 11, 2023. ",
    },
];

export class GptAdaptor implements EngineProvider {
    getEngines(): EngineType[] {
        return [...GPT_BASE_MODELS, ...GPT3_5_MODELS];
    }

    constructor(private apiKey: string) {}

    executeChat(prompt: ChatPrompt): Promise<Result> {
        const request = GptChatRequest.fromPrompt(prompt);
        const body = JSON.stringify(request);
        appendOutput(`-> POST ${GPT_CHAT_URL}\n${body}`);
        return fetch(GPT_CHAT_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`,
            },
            body,
        })
            .then((response) => {
                appendOutput(
                    `-> Got response: ${response.status}\n${formatHeaders(response.headers)}`
                );
                if (!response.ok) {
                    return response.json().then((errorBody: any) => {
                        throw new Error(`HTTP ${response.status}:\n${errorBody.error.message}`);
                    });
                }
                return response.json();
            })
            .then((data) => {
                appendOutput(JSON.stringify(data));
                const response = GptResponseBody.fromJson(data);
                return new Result(
                    response.id,
                    response.created,
                    response.choices.map(
                        (c, i) =>
                            new Choice(
                                [new Message(c.message.role, undefined, c.message.content)],
                                i,
                                c.finish_reason
                            )
                    )
                );
            });
    }

    async executeCompletion(prompt: CompletionPrompt): Promise<Result> {
        const request = GptCompletionRequest.fromPrompt(prompt);
        const body = JSON.stringify(request);
        appendOutput(`-> POST ${GPT_COMPLETION_URL}\n${body}`);
        return fetch(GPT_COMPLETION_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`,
            },
            body,
        })
            .then((response) => {
                appendOutput(
                    `-> Got response: ${response.status}\n${formatHeaders(response.headers)}`
                );
                if (!response.ok) {
                    return response.json().then((errorBody: any) => {
                        throw new Error(`HTTP ${response.status}:\n${errorBody.error.message}`);
                    });
                }
                return response.json();
            })
            .then((data) => {
                appendOutput(JSON.stringify(data));
                return data;
            })
            .then((data) => getResult(data));
    }
}
