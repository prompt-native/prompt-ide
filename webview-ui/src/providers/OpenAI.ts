import { ChatPrompt, CompletionPrompt } from "prompt-schema";
import { appendOutput } from "../utilities/Message";
import { getParameterAsNumber, getParameterAsString } from "../utilities/PromptHelper";
import EngineProvider, { EngineId, EngineType, ParameterType } from "./EngineProvider";
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

class CompletionRequest {
    model: string;
    prompt: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    n?: number;
    logprobs?: number;
    suffix?: string;
    stop?: string;
    presence_penalty?: number;
    frequency_penalty?: number;

    constructor({
        model,
        prompt,
        max_tokens,
        temperature,
        top_p,
        n,
        logprobs,
        suffix,
        stop,
        presence_penalty,
        frequency_penalty,
    }: {
        model: string;
        prompt: string;
        max_tokens?: number;
        temperature?: number;
        top_p?: number;
        n?: number;
        logprobs?: number;
        suffix?: string;
        stop?: string;
        presence_penalty?: number;
        frequency_penalty?: number;
    }) {
        this.model = model;
        this.prompt = prompt;
        this.max_tokens = max_tokens;
        this.temperature = temperature;
        this.top_p = top_p;
        this.n = n;
        this.logprobs = logprobs;
        this.suffix = suffix;
        this.stop = stop;
        this.presence_penalty = presence_penalty;
        this.frequency_penalty = frequency_penalty;
    }
}

const OPENAI_URL = "https://api.openai.com/v1/completions";

function fromJSON(json: any): Result {
    const choices = json.choices.map(
        (choiceJSON: any) => new Choice(choiceJSON.text, choiceJSON.index, choiceJSON.finishReason)
    );

    return new Result(json.id, json.created, choices);
}

export class OpenAIExecutor implements EngineProvider {
    getEngines(): EngineType[] {
        return [...GPT_BASE_MODELS, ...GPT3_5_MODELS];
    }

    constructor(private apiKey: string) {}
    private assembleRequest(prompt: CompletionPrompt): CompletionRequest {
        // FIXME: variable substitution
        return new CompletionRequest({
            model: prompt.engine,
            prompt: prompt.prompt,
            max_tokens: getParameterAsNumber(prompt, "max_tokens"),
            temperature: getParameterAsNumber(prompt, "temperature"),
            top_p: getParameterAsNumber(prompt, "top_p"),
            n: getParameterAsNumber(prompt, "n"),
            logprobs: getParameterAsNumber(prompt, "logprobs"),
            presence_penalty: getParameterAsNumber(prompt, "presence_penalty"),
            frequency_penalty: getParameterAsNumber(prompt, "frequency_penalty"),
            suffix: getParameterAsString(prompt, "suffix"),
            stop: getParameterAsString(prompt, "stop"),
        });
    }
    executeChat(prompt: ChatPrompt): Promise<Result> {
        throw new Error("Method not implemented.");
    }

    async executeCompletion(prompt: CompletionPrompt): Promise<Result> {
        const request = this.assembleRequest(prompt);
        const body = JSON.stringify(request);
        appendOutput(`-> POST ${OPENAI_URL}\n${body}`);
        return fetch(OPENAI_URL, {
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
            .then((data) => fromJSON(data));
    }
}
function formatHeaders(headers: Headers) {
    throw new Error("Function not implemented.");
}
