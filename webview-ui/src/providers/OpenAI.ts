import { InterfaceType, ModelType, ParameterType } from "./Common";

const DEFAULT_TEMPERATURE: ParameterType = {
    name: "temperature",
    displayName: "Temperature",
    type: "number",
    minValue: 0,
    maxValue: 2,
};

const DEFAULT_TOP_P: ParameterType = {
    name: "top_p",
    displayName: "Top P",
    type: "number",
    minValue: 0,
    maxValue: 1,
};

const DEFAULT_MAX_TOKENS: ParameterType = {
    name: "max_tokens",
    displayName: "Maximum length",
    type: "number",
    minValue: 1,
    maxValue: 4096,
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
};

const DEFAULT_PRESENCE_PENALTY: ParameterType = {
    name: "presence_penalty",
    displayName: "Presence penalty",
    type: "number",
    minValue: 0,
    maxValue: 2,
};

const OPENAI_PARAMETERS = [
    DEFAULT_TEMPERATURE,
    DEFAULT_TOP_P,
    DEFAULT_MAX_TOKENS,
    DEFAULT_FREQUENCY_PENALTY,
    DEFAULT_PRESENCE_PENALTY,
    DEFAULT_STOP_SEQUENCES,
];

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

export const GPT3_5_MODELS: ModelType[] = [
    {
        name: "text-davinci-003",
        interfaceType: InterfaceType.COMPLETE,
        parameters: () => getParamaters(4000),
        description:
            "Can do language tasks with better quality and consistency than the curie, babbage, or ada models. Will be deprecated on Jan 4th 2024.",
    },
    {
        name: "gpt-3.5-turbo-instruct",
        interfaceType: InterfaceType.COMPLETE,
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
