import { ChatPrompt, Message, Parameter } from "prompt-schema";
import { GptChatRequest, GptResponseBody } from "./GptApi";

describe("conver prompt to GPT request", () => {
    test("should return valid request if chat prompt is valid", () => {
        const prompt = new ChatPrompt("chat@0.1", "gpt-3.5-turbo-0613", [
            new Message("user", undefined, "Hello!"),
        ]);
        const request = GptChatRequest.fromPrompt(prompt);
        expect(request).toBeDefined();
        expect(request.model).toBe("gpt-3.5-turbo-0613");
        expect(request.messages).toHaveLength(1);
        expect(request.messages[0].role).toBe("user");
        expect(request.messages[0].content).toBe("Hello!");
    });

    test("should add parameters if parameter is defined", () => {
        const prompt = new ChatPrompt(
            "gpt-3.5-turbo-0613",
            "abab5.5-chat",
            [new Message("user", undefined, "Hello!")],
            [new Parameter("temperature", 0.5)]
        );
        const request = GptChatRequest.fromPrompt(prompt);
        expect(request.temperature).toBe(0.5);
    });
});

describe("convert response to GptResponseBody", () => {
    test("should return response if request succeed", () => {
        const text = `
        {
            "id": "chatcmpl-123",
            "object": "chat.completion",
            "created": 1677652288,
            "model": "gpt-3.5-turbo-0613",
            "system_fingerprint": "fp_44709d6fcb",
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": "\\n\\nHello there, how may I assist you today?"
                    },
                    "logprobs": null,
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": 9,
                "completion_tokens": 12,
                "total_tokens": 21
            }
        }`;
        const response = GptResponseBody.fromJson(JSON.parse(text));
        expect(response).toBeDefined();
        expect(response.id).toBe("chatcmpl-123");
        expect(response.created).toBe(1677652288);
        expect(response.choices).toHaveLength(1);
        expect(response.choices[0].finish_reason).toBe("stop");
        expect(response.choices[0].message.role).toBe("assistant");
        expect(response.choices[0].message.content).toBe(
            "\n\nHello there, how may I assist you today?"
        );
    });
});
