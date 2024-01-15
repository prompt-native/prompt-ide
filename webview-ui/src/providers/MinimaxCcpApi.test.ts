import { ChatPrompt, Message, Parameter } from "prompt-schema";
import { CCPRequestBody, CCPResponseBody } from "./MinimaxCcpApi";

describe("conver prompt to CCPRequestBody", () => {
    test("should return valid request if prompt is valid", () => {
        const prompt = new ChatPrompt("chat@0.1", "abab5.5-chat", [
            new Message("user", undefined, "Hello!"),
        ]);
        const ccpRequest = CCPRequestBody.fromPrompt(prompt);
        expect(ccpRequest).toBeDefined();
        expect(ccpRequest.model).toBe("abab5.5-chat");
        expect(ccpRequest.bot_setting).toHaveLength(1);
        expect(ccpRequest.bot_setting[0].bot_name).toBe("Assistant");
        expect(ccpRequest.bot_setting[0].content).toBe(
            "MM智能助理是一款由MiniMax自研的，没有调用其他产品的接口的大型语言模型。MiniMax是一家中国科技公司，一直致力于进行大模型相关的研究。"
        );
        expect(ccpRequest.reply_constraints).toBeDefined();
        expect(ccpRequest.reply_constraints.sender_name).toBe("Assistant");
        expect(ccpRequest.reply_constraints.sender_type).toBe("BOT");
        expect(ccpRequest.messages).toHaveLength(1);
        expect(ccpRequest.messages[0].sender_name).toBe("User");
        expect(ccpRequest.messages[0].sender_type).toBe("USER");
        expect(ccpRequest.messages[0].text).toBe("Hello!");
    });

    test("should add parameters if parameter is defined", () => {
        const prompt = new ChatPrompt(
            "chat@0.1",
            "abab5.5-chat",
            [new Message("user", undefined, "Hello!")],
            [new Parameter("temperature", 0.5)]
        );
        const ccpRequest = CCPRequestBody.fromPrompt(prompt);
        expect(ccpRequest).toBeDefined();
        expect(ccpRequest.temperature).toBe(0.5);
    });
});

describe("convert response to CCPResponseBody", () => {
    test("should return response if request succeed", () => {
        const text = `
        {
            "created": 1689738159,
            "model": "abab5.5-chat",
            "reply": "Who am I?",
            "choices": [
                {
                    "finish_reason": "stop",
                    "messages": [
                        {
                            "sender_type": "BOT",
                            "sender_name": "MM智能助理",
                            "text": "Who am I?"
                        }
                    ]
                }
            ],
            "usage": {
                "total_tokens": 191
            },
            "input_sensitive": false,
            "output_sensitive": false,
            "id": "01068eae26a39a3a39b7bb56cfbe4266",
            "base_resp": {
                "status_code": 0,
                "status_msg": ""
            }
        }`;
        const ccpResponse = CCPResponseBody.fromJson(JSON.parse(text));
        expect(ccpResponse).toBeDefined();
        expect(ccpResponse.base_resp.status_code).toBe(0);
        expect(ccpResponse.base_resp.status_msg).toBe("");
        expect(ccpResponse.id).toBe("01068eae26a39a3a39b7bb56cfbe4266");
        expect(ccpResponse.created).toBe(1689738159);
        expect(ccpResponse.reply).toBe("Who am I?");
        expect(ccpResponse.choices).toHaveLength(1);
        expect(ccpResponse.choices[0].finish_reason).toBe("stop");
        expect(ccpResponse.choices[0].messages).toHaveLength(1);
        expect(ccpResponse.choices[0].messages[0].sender_name).toBe("MM智能助理");
        expect(ccpResponse.choices[0].messages[0].sender_type).toBe("BOT");
        expect(ccpResponse.choices[0].messages[0].text).toBe("Who am I?");
    });
});
