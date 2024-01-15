import { ChatPrompt, CompletionPrompt } from "prompt-schema";
import { appendOutput } from "../utilities/Message";
import EngineProvider, { EngineId, EngineType, ParameterType } from "./EngineProvider";
import { CCPRequestBody, MinimaxCcpClient } from "./MinimaxCcpApi";
import Result, { Choice } from "./Result";

const DEFAULT_TEMPERATURE: ParameterType = {
    name: "temperature",
    displayName: "Temperature",
    type: "number",
    defaultValue: 0.9,
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
    defaultValue: 512,
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

export const MINIMAX_MODELS: EngineType[] = [
    {
        id: EngineId.chat("abab5.5-chat"),
        parameters: () => getParamaters(16384),
    },
];

export class MinimaxAdaptor implements EngineProvider {
    private client: MinimaxCcpClient;
    constructor(private groupId: string, private apiKey: string) {
        this.client = new MinimaxCcpClient(groupId, apiKey, appendOutput);
    }
    getEngines(): EngineType[] {
        return MINIMAX_MODELS;
    }

    public executeCompletion(prompt: CompletionPrompt): Promise<Result> {
        throw new Error("Completion is not supported by this provider.");
    }

    public async executeChat(prompt: ChatPrompt): Promise<Result> {
        const request = CCPRequestBody.fromPrompt(prompt);
        const response = await this.client.chatcompletion_pro(request);
        if (response.base_resp.status_code !== 0)
            throw new Error(`Minimax response error with msg=${response.base_resp.status_msg}`);
        return new Result(
            response.id,
            response.created,
            response.choices.map(
                (c, i) =>
                    new Choice(
                        c.messages.map((m) => m.toMessage()),
                        i,
                        c.finish_reason
                    )
            )
        );
    }
}
