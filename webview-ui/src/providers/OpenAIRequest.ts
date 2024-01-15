import Result, { Choice } from "./Result";

export class OpenAICompletionRequest {
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

export const OPENAI_URL = "https://api.openai.com/v1/completions";

export function getResult(json: any): Result {
    const choices = json.choices.map(
        (choiceJSON: any) => new Choice(choiceJSON.text, choiceJSON.index, choiceJSON.finishReason)
    );

    return new Result(json.id, json.created, choices);
}
