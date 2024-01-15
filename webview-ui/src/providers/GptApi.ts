import { ChatPrompt, CompletionPrompt, Message } from "prompt-schema";
import { getParameterAsNumber, getParameterAsString } from "../utilities/PromptHelper";
import Result, { Choice } from "./Result";

interface GptParams {
    model: string;
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    n?: number;
    logprobs?: number;
    suffix?: string;
    stop?: string;
    presence_penalty?: number;
    frequency_penalty?: number;
}

class GptMessage {
    role: "system" | "user" | "assistant";
    content: string;

    constructor(role: "system" | "user" | "assistant", content: string) {
        this.role = role;
        this.content = content;
    }
}

type GptCompletionParams = GptParams & {
    prompt: string;
};

type GptChatParams = GptParams & {
    messages: GptMessage[];
};

abstract class BaseAIRequest {
    model: string;
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
        max_tokens,
        temperature,
        top_p,
        n,
        logprobs,
        suffix,
        stop,
        presence_penalty,
        frequency_penalty,
    }: GptParams) {
        this.model = model;
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

export class GptCompletionRequest extends BaseAIRequest {
    prompt: string;

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
    }: GptCompletionParams) {
        super({
            model,
            max_tokens,
            temperature,
            top_p,
            n,
            logprobs,
            suffix,
            stop,
            presence_penalty,
            frequency_penalty,
        });
        this.prompt = prompt;
    }

    public static fromPrompt(prompt: CompletionPrompt): GptCompletionRequest {
        // FIXME: variable substitution
        return new GptCompletionRequest({
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
}

export class GptChatRequest extends BaseAIRequest {
    messages: GptMessage[];

    constructor({
        model,
        messages,
        max_tokens,
        temperature,
        top_p,
        n,
        logprobs,
        suffix,
        stop,
        presence_penalty,
        frequency_penalty,
    }: GptChatParams) {
        super({
            model,
            max_tokens,
            temperature,
            top_p,
            n,
            logprobs,
            suffix,
            stop,
            presence_penalty,
            frequency_penalty,
        });
        this.messages = messages;
    }

    public static fromPrompt(prompt: ChatPrompt): GptChatRequest {
        const system = prompt.context ? [new GptMessage("system", prompt.context)] : [];
        const convert = (message: Message): GptMessage => {
            if (message.role == "user" || message.role == "assistant")
                return new GptMessage(message.role, message.content || "");
            throw new Error("Unsupported gpt message type" + message.role);
        };
        const examples = prompt.examples?.map(convert);
        const messages = prompt.messages?.map(convert) || [];

        // FIXME: variable substitution
        return new GptChatRequest({
            model: prompt.engine,
            messages: [...system, ...(examples || []), ...(messages || [])],
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
}

export class GptChoice {
    constructor(public index: number, public finish_reason: string, public message: GptMessage) {}
}

export class GptUsage {
    constructor(
        public total_tokens: number,
        public prompt_tokens: number,
        public completion_tokens: number
    ) {}
}

export class GptResponseBody {
    constructor(
        public id: string,
        public created: number,
        public system_fingerprint: string,
        public choices: GptChoice[],
        public usage: GptUsage
    ) {}

    public static fromJson(json: any): GptResponseBody {
        const choices = json.choices.map((choice: any) => {
            return new GptChoice(
                choice.index,
                choice.finish_reason,
                new GptMessage(choice.message.role, choice.message.content)
            );
        });
        const usage = new GptUsage(
            json.usage.total_tokens,
            json.prompt_tokens,
            json.completion_tokens
        );

        return new GptResponseBody(json.id, json.created, json.system_fingerprint, choices, usage);
    }
}

export const GPT_COMPLETION_URL = "https://api.openai.com/v1/completions";
export const GPT_CHAT_URL = "https://api.openai.com/v1/chat/completions";

export function getResult(json: any): Result {
    const choices = json.choices.map(
        (choiceJSON: any) => new Choice(choiceJSON.text, choiceJSON.index, choiceJSON.finishReason)
    );

    return new Result(json.id, json.created, choices);
}
