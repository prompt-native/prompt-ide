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
    name: "tokens_to_generate",
    displayName: "Maximum length",
    type: "number",
    minValue: 1,
    maxValue: 4096,
};

const DEFAULT_SKIP_INFO_MASK: ParameterType = {
    name: "skip_info_mask",
    displayName: "Skip info mask",
    type: "boolean",
    defaultValue: false,
};

const getParamaters = (maxTokens: number): ParameterType[] => {
    return [
        DEFAULT_TEMPERATURE,
        DEFAULT_TOP_P,
        { ...DEFAULT_MAX_TOKENS, maxValue: maxTokens },
        DEFAULT_SKIP_INFO_MASK,
    ];
};

export const MINIMAX_MODELS: ModelType[] = [
    {
        name: "abab5.5-chat",
        interfaceType: InterfaceType.CHAT,
        parameters: () => getParamaters(16384),
    },
];
