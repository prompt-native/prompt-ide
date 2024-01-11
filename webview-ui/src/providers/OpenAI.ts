import { CompletionPrompt } from "prompt-schema";
import { InterfaceType, ModelType, ParameterType } from "./Common";
import { PromptExecutor } from "./Executor";
import Result from "./Result";

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

export const GPT_BASE_MODELS: ModelType[] = [
    {
        name: "babbage-002",
        interfaceType: InterfaceType.COMPLETION,
        parameters: () => getParamaters(4000),
        description: "Replacement for the GPT-3 ada and babbage base models.",
    },
    {
        name: "davinci-002",
        interfaceType: InterfaceType.COMPLETION,
        parameters: () => getParamaters(4000),
        description: "Replacement for the GPT-3 curie and davinci base models.",
    },
];
export const GPT3_5_MODELS: ModelType[] = [
    {
        name: "gpt-3.5-turbo-instruct",
        interfaceType: InterfaceType.COMPLETION,
        parameters: () => getParamaters(4096),
        description:
            "Similar capabilities as text-davinci-003 but compatible with legacy Completions endpoint and not Chat Completions.",
    },
    {
        name: "gpt-3.5-turbo-instruct-0914",
        interfaceType: InterfaceType.COMPLETION,
        parameters: () => getParamaters(4096),
        description:
            "Similar capabilities as text-davinci-003 but compatible with legacy Completions endpoint and not Chat Completions.",
    },
    {
        name: "gpt-3.5-turbo",
        interfaceType: InterfaceType.CHAT,
        parameters: () => getParamaters(4096),
        description:
            "Currently points to gpt-3.5-turbo-0613. Will point to gpt-3.5-turbo-1106 starting Dec 11, 2023. ",
    },
    {
        name: "gpt-3.5-turbo-1106",
        interfaceType: InterfaceType.CHAT,
        parameters: () => getParamaters(4096),
        description:
            "The latest GPT-3.5 Turbo model with improved instruction following, JSON mode, reproducible outputs, parallel function calling, and more. Returns a maximum of 4,096 output tokens.",
    },
    {
        name: "gpt-3.5-turbo-16k",
        interfaceType: InterfaceType.CHAT,
        parameters: () => getParamaters(16384),
        description:
            "Currently points to gpt-3.5-turbo-0613. Will point to gpt-3.5-turbo-1106 starting Dec 11, 2023. ",
    },
];

class CompletionRequest {
    constructor(
        public model: string,
        public prompt: string,
        public max_tokens?: number,
        public temperature?: number,
        public top_p?: number,
        public n?: number,
        public logprobs?: number,
        public suffix?: string,
        public stop?: string,
        public presence_penalty?: number,
        public frequency_penalty?: number
    ) {}
}

export class OpenAIExecutor implements PromptExecutor {
    constructor(private apiKey: string) {}
    async executeCompletion(prompt: CompletionPrompt): Promise<Result> {
        const request = new CompletionRequest(prompt.engine, prompt.prompt);
        return fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(request),
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then((errorBody: any) => {
                        throw new Error(`HTTP ${response.status}:\n${errorBody.error.message}`);
                    });
                }
                return response.json();
            })
            .then((data) => Result.fromJSON(data));
    }
}
