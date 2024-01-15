import { ChatPrompt, Message } from "prompt-schema";
import { getParameterAsBoolean, getParameterAsNumber } from "../utilities/PromptHelper";

export class CCPMessage {
    constructor(public sender_type: string, public sender_name: string, public text: string) {}

    public toMessage(): Message {
        return new Message(this.convertRole(), this.sender_name, this.text);
    }

    private convertRole(): string {
        switch (this.sender_type) {
            case "USER":
                return "user";
            case "BOT":
                return "assistant";
            case "FUNCTION":
                return "function";
            default:
                throw new Error("Unknown sender_type:" + this.sender_type);
        }
    }
}

export class CCPBotSetting {
    constructor(public bot_name: string, public content: string) {}
}

export class CCPReplyConstraint {
    constructor(public sender_type: string, public sender_name: string) {}
}

export class CCPRequestBody {
    public tokens_to_generate?: number;
    public temperature?: number;
    public top_p?: number;
    public mask_sensitive_info?: boolean;
    constructor(
        public model: string,
        public messages: CCPMessage[],
        public bot_setting: CCPBotSetting[],
        public reply_constraints: CCPReplyConstraint,
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

    public static fromPrompt(prompt: ChatPrompt): CCPRequestBody {
        // FIXME: allow users to customize it
        const botSetting = new CCPBotSetting(
            "Assistant",
            prompt.context ||
                "MM智能助理是一款由MiniMax自研的，没有调用其他产品的接口的大型语言模型。MiniMax是一家中国科技公司，一直致力于进行大模型相关的研究。"
        );
        const replyConstraint = new CCPReplyConstraint("BOT", botSetting.bot_name);
        const messages = prompt.messages.map((m) => {
            // FIXME: support other types
            if (m.role == "user") return new CCPMessage("USER", m.name || "User", m.content || "");
            else if (m.role == "assistant" && m.content)
                return new CCPMessage("BOT", botSetting.bot_name, m.content);
            else throw new Error("Unsupported message");
        });
        // FIXME: variable substitution
        return new CCPRequestBody(prompt.engine, messages, [botSetting], replyConstraint, {
            tokens_to_generate: getParameterAsNumber(prompt, "tokens_to_generate"),
            temperature: getParameterAsNumber(prompt, "temperature"),
            top_p: getParameterAsNumber(prompt, "top_p"),
            mask_sensitive_info: getParameterAsBoolean(prompt, "mask_sensitive_info"),
        });
    }
}

export class CCPStatus {
    constructor(public status_code: number, public status_msg: string) {}
}

export class CCPChoice {
    constructor(public finish_reason: string, public messages: CCPMessage[]) {}
}

export class CCPUsage {
    constructor(public total_tokens: number) {}
}
export class CCPResponseBody {
    constructor(
        public id: string,
        public created: number,
        public base_resp: CCPStatus,
        public reply: string,
        public choices: CCPChoice[],
        public usage: CCPUsage
    ) {}

    public static fromJson(json: any): CCPResponseBody {
        const base_resp = new CCPStatus(json.base_resp.status_code, json.base_resp.status_msg);
        const choices = json.choices.map((choice: any) => {
            return new CCPChoice(
                choice.finish_reason,
                choice.messages.map(
                    (m: any) => new CCPMessage(m.sender_type, m.sender_name, m.text)
                )
            );
        });
        const usage = new CCPUsage(json.usage.total_tokens);

        return new CCPResponseBody(json.id, json.created, base_resp, json.reply, choices, usage);
    }
}
