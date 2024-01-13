import { ChatPrompt, CompletionPrompt } from "prompt-schema";
import { appendOutput, formatHeaders } from "../utilities/Message";
import { getParameterAsBoolean, getParameterAsNumber } from "../utilities/PromptHelper";
import EngineProvider, { EngineId, EngineType, ParameterType } from "./EngineProvider";
import Result from "./Result";

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

class Message {
    constructor(public sender_type: string, public sender_name: string, public text: string) {}
}

class BotSetting {
    constructor(public bot_name: string, public content: string) {}
}

class ReplyConstraint {
    constructor(public sender_type: string, public sender_name: string) {}
}
class CCPRequestBody {
    public tokens_to_generate?: number;
    public temperature?: number;
    public top_p?: number;
    public mask_sensitive_info?: boolean;
    constructor(
        public model: string,
        public messages: Message[],
        public bot_setting: BotSetting[],
        public reply_constraints: ReplyConstraint[],
        {
            tokens_to_generate,
            temperature,
            top_p,
            mask_sensitive_info,
        }: {
            tokens_to_generate?: number;
            temperature?: number;
            top_p?: number;
            mask_sensitive_info?: boolean;
        }
    ) {
        this.tokens_to_generate = tokens_to_generate;
        this.temperature = temperature;
        this.top_p = top_p;
        this.mask_sensitive_info = mask_sensitive_info;
    }
}

class Status {
    constructor(public status_code: number, public status_msg: string) {}
}
class CCPResponseBody {
    constructor(public base_resp: Status) {}
}

export class MinimaxAdaptor implements EngineProvider {
    constructor(private groupId: string, private apiKey: string) {}
    getEngines(): EngineType[] {
        return MINIMAX_MODELS;
    }

    private assembleRequest(prompt: ChatPrompt): CCPRequestBody {
        // FIXME: variable substitution
        return new CCPRequestBody(prompt.engine, [], [], [], {
            tokens_to_generate: getParameterAsNumber(prompt, "tokens_to_generate"),
            temperature: getParameterAsNumber(prompt, "temperature"),
            top_p: getParameterAsNumber(prompt, "top_p"),
            mask_sensitive_info: getParameterAsBoolean(prompt, "mask_sensitive_info"),
        });
    }

    executeCompletion(prompt: CompletionPrompt): Promise<Result> {
        throw new Error("Completion is not supported by this provider.");
    }

    executeChat(prompt: ChatPrompt): Promise<Result> {
        const requestUrl = `https://api.minimax.chat/v1/text/chatcompletion_pro?GroupId=${this.groupId}`;
        const request = this.assembleRequest(prompt);
        const body = JSON.stringify(request);
        appendOutput(`-> POST ${requestUrl}\n${body}`);

        return fetch(requestUrl, {
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
            .then((data) => Result.fromJSON(data));
    }
}
