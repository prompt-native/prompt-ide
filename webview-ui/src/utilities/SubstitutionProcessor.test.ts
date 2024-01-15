import { ChatPrompt, CompletionPrompt, Message } from "prompt-schema";
import SubstitutionProcessor from "./SubstitutionProcessor";

describe("parse variables", () => {
    test("shoud return variable names if variable is included", () => {
        expect(SubstitutionProcessor.parseVariables("Hello $(name)")).toStrictEqual(["$(name)"]);
        expect(SubstitutionProcessor.parseVariables("Hello $(name) $(msg)")).toStrictEqual([
            "$(name)",
            "$(msg)",
        ]);
    });

    test("shoud return unique names if variable occurs multiple times", () => {
        expect(
            SubstitutionProcessor.parseVariables("Hello $(name), nice to meet you $(name)")
        ).toStrictEqual(["$(name)"]);
    });
});

describe("substitute variables of completion prompt", () => {
    test("shoud return substituted prompt if variable found", () => {
        const map = new Map<string, string>();
        map.set("$(name)", "Riguz");
        const processor = new SubstitutionProcessor(map);
        const result = processor.substituteCompletion(
            new CompletionPrompt("completion@0.1", "text-some", "Hello $(name) Nice to meet you!")
        );

        expect(result.prompt).toBe("Hello Riguz Nice to meet you!");
    });

    test("shoud replace variable with empty if variable not binded", () => {
        const map = new Map<string, string>();
        map.set("$(name)", "Riguz");
        const processor = new SubstitutionProcessor(map);
        const result = processor.substituteCompletion(
            new CompletionPrompt("completion@0.1", "text-some", "Hello $(name) $(msg)!")
        );

        expect(result.prompt).toBe("Hello Riguz !");
    });
});

describe("substitute variables of chat prompt", () => {
    test("shoud return substituted prompt if variable found", () => {
        const map = new Map<string, string>();
        map.set("$(name)", "Riguz");
        const processor = new SubstitutionProcessor(map);
        const result = processor.substituteChat(
            new ChatPrompt("chat@0.1", "text-some", [
                new Message("user", undefined, "Hello $(name) Nice to meet you!"),
            ])
        );

        expect(result.messages[0].content).toBe("Hello Riguz Nice to meet you!");
    });

    test("shoud return substituted prompt if variable found in context", () => {
        const map = new Map<string, string>();
        map.set("$(role)", "Doctor");
        const processor = new SubstitutionProcessor(map);
        const result = processor.substituteChat(
            new ChatPrompt(
                "chat@0.1",
                "text-some",
                [new Message("user", undefined, "Hello $(name) Nice to meet you!")],
                undefined,
                "Assume you a $(role)"
            )
        );

        expect(result.context).toBe("Assume you a Doctor");
    });

    test("shoud return substituted prompt if variable found in examples", () => {
        const map = new Map<string, string>();
        map.set("$(name)", "Riguz");
        const processor = new SubstitutionProcessor(map);
        const result = processor.substituteChat(
            new ChatPrompt(
                "chat@0.1",
                "text-some",
                [new Message("user", undefined, "Hello $(name) Nice to meet you!")],
                undefined,
                undefined,
                [new Message("user", undefined, "Hi $(name) Nice to meet you!")]
            )
        );

        expect(result.examples![0].content).toBe("Hi Riguz Nice to meet you!");
    });
});
