import { Type } from "../domain/Prompt";

export enum Vendor {
    OpenAI = "openai",
    Google = "google",
    Minimax = "minimax",
};

export class ModelDef {
    constructor(
        public name: string,
        public vendor: Vendor,
        public supportedTypes: Type[]) {
    }
}

export class ParameterDef {
    constructor(
        public name: string,
        public displayName: string,
        public description: string,
        public type: "string" | "number",
        public defaultValue?: string | number,
        public required?: boolean,
    ) {
    }
}

export const ALL_MODELS = [
    new ModelDef("gpt-3.5", Vendor.OpenAI, [Type.chat, Type.completion]),
    new ModelDef("text-bison", Vendor.Google, [Type.completion]),
    new ModelDef("chat-bison", Vendor.Google, [Type.chat]),
    new ModelDef("code-bison", Vendor.Google, [Type.completion]),
    new ModelDef("codechat-bison", Vendor.Google, [Type.chat]),
    new ModelDef("code-gecko", Vendor.Google, [Type.completion]),
    new ModelDef("abab4", Vendor.Minimax, [Type.chat]),
    new ModelDef("abab5", Vendor.Minimax, [Type.chat]),
];

export const PATAMETERS: Record<string, ParameterDef[]> = {
    "gpt-3.5": [
        new ParameterDef("temperature", "Temperature", "What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make theoutput more random, while lower values like 0.2 will make it more focused and deterministic.", "number", 1),
        new ParameterDef("top_p", "Top P", "An alternative to sampling with temperature, called nucleus sampling, where the modelconsiders the results of the tokens with top_p probability mass. So 0.1 means only the tokenscomprising the top 10% probability mass are considered.", "number", 0.5),
        new ParameterDef("max_tokens", "Temperature", "The maximum number of tokens to generate in the completion.", "number", 0.5),
        new ParameterDef("presence_penalty", "Presence Penalty", "umber between -2.0 and 2.0. Positive values penalize new tokens based on whether theyappear in the text so far, increasing the model's likelihood to talk about new topics.", "number", 0.5),
        new ParameterDef("frequency_penalty", "Frequency Penalty", "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existingfrequency in the text so far, decreasing the model's likelihood to repeat the same lineverbatim.", "number", 0),
    ],
    "text-bison": [
        new ParameterDef("temperature", "Temperature", "Controls the randomness of the output. Values can range over [0.0,1.0], inclusive. A value closer to 1.0 will produce responses that are more varied, while a value closer to 0.0 will typically result in less surprising responses from the model. This value specifies default to be used by the backend while making the call to the model.", "number", 1),
        new ParameterDef("topP", "Top P", "For Nucleus sampling. Nucleus sampling considers the smallest set of tokens whose probability sum is at least topP. This value specifies default to be used by the backend while making the call to the model.", "number", 0.8),
        new ParameterDef("topK", "Top K", "For Top-k sampling. Top-k sampling considers the set of topK most probable tokens. This value specifies default to be used by the backend while making the call to the model.", "number", 40),
        new ParameterDef("maxOutputTokens", "Max Output Tokens", "The maximum number of tokens to include in a candidate. If unset, this will default to 64.", "number", 64),
    ],
    "code-bison": [
        new ParameterDef("temperature", "Temperature", "Controls the randomness of the output. Values can range over [0.0,1.0], inclusive. A value closer to 1.0 will produce responses that are more varied, while a value closer to 0.0 will typically result in less surprising responses from the model. This value specifies default to be used by the backend while making the call to the model.", "number", 1),
        new ParameterDef("maxOutputTokens", "Max Output Tokens", "The maximum number of tokens to include in a candidate. If unset, this will default to 64.", "number", 64),
    ],
    "code-gecko": [
        new ParameterDef("temperature", "Temperature", "Controls the randomness of the output. Values can range over [0.0,1.0], inclusive. A value closer to 1.0 will produce responses that are more varied, while a value closer to 0.0 will typically result in less surprising responses from the model. This value specifies default to be used by the backend while making the call to the model.", "number", 1),
        new ParameterDef("maxOutputTokens", "Max Output Tokens", "The maximum number of tokens to include in a candidate. If unset, this will default to 64.", "number", 64),
    ],
    "chat-bison": [
        new ParameterDef("temperature", "Temperature", "Controls the randomness of the output. Values can range over [0.0,1.0], inclusive. A value closer to 1.0 will produce responses that are more varied, while a value closer to 0.0 will typically result in less surprising responses from the model. This value specifies default to be used by the backend while making the call to the model.", "number", 1),
        new ParameterDef("topP", "Top P", "For Nucleus sampling. Nucleus sampling considers the smallest set of tokens whose probability sum is at least topP. This value specifies default to be used by the backend while making the call to the model.", "number", 0.8),
        new ParameterDef("topK", "Top K", "For Top-k sampling. Top-k sampling considers the set of topK most probable tokens. This value specifies default to be used by the backend while making the call to the model.", "number", 40),
        new ParameterDef("maxOutputTokens", "Max Output Tokens", "The maximum number of tokens to include in a candidate. If unset, this will default to 64.", "number", 64),
    ],
    "codechat-bison": [
        new ParameterDef("temperature", "Temperature", "Controls the randomness of the output. Values can range over [0.0,1.0], inclusive. A value closer to 1.0 will produce responses that are more varied, while a value closer to 0.0 will typically result in less surprising responses from the model. This value specifies default to be used by the backend while making the call to the model.", "number", 1),
        new ParameterDef("maxOutputTokens", "Max Output Tokens", "The maximum number of tokens to include in a candidate. If unset, this will default to 64.", "number", 64),
    ],
};

type VendorStrings = keyof typeof Vendor;

export function getModels(type: Type, vendor: Vendor): string[] {
    return ALL_MODELS.filter(model => model.vendor == vendor && model.supportedTypes.includes(type))
        .map(def => def.name);
}
