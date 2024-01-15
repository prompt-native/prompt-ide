import { ChatPrompt, Message } from "prompt-schema";
import { CCPRequestBody } from "./CCPBuilder";

describe("convert prompt to CCP request body", () => {
    test("should return valid message if prompt is valid", () => {
        const prompt = new ChatPrompt("chat@0.1", "abab5.5-chat", [
            new Message("user", undefined, "Hello!"),
        ]);
        const ccpRequest = CCPRequestBody.fromPrompt(prompt);
        expect(ccpRequest).not.toBe(null);
        expect(ccpRequest.model).toBe("abab5.5-chat");
        expect(ccpRequest.bot_setting).toHaveLength(1);
        expect(ccpRequest.bot_setting[0].bot_name).toBe("Assistant");
        expect(ccpRequest.bot_setting[0].content).toBe(
            "MM智能助理是一款由MiniMax自研的，没有调用其他产品的接口的大型语言模型。MiniMax是一家中国科技公司，一直致力于进行大模型相关的研究。"
        );
    });
});
