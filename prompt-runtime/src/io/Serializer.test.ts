import { YamlSerializer } from "./Serializer";
import { readFileSync } from 'fs';
import { join } from 'path';
import { Chat, Completion, Model, Parameter, StructuredExample, StructuredExamples, Type } from "../domain/Prompt";

function syncReadFile(filename: string): string {
    const result = readFileSync(join(__dirname, filename), 'utf-8');
    return result;
}

describe('parse completion', () => {
    test('should return plain completion prompt', () => {
        const serializer = new YamlSerializer();
        const prompt = serializer.deserialize(syncReadFile("../test/completion-1.yaml")) as Completion;
        expect(prompt.type).toBe(Type.completion);
        expect(prompt.model.vendor).toBe("google");
        expect(prompt.model.model).toBe("text-bison");
        expect(prompt.prompt).toBe("What's your name?\n"); //TODO: does this need to be trimed?
        expect(prompt.parameters).toHaveLength(1);
        expect(prompt.parameters[0].name).toBe("temperature");
        expect(prompt.parameters[0].value).toBe(0.5);
        expect(prompt.examples).toBeUndefined();
    });

    test('should return structured completion', () => {
        const serializer = new YamlSerializer();
        const prompt = serializer.deserialize(syncReadFile("../test/completion-2.yaml")) as Completion;
        expect(prompt.type).toBe(Type.completion);
        expect(prompt.model.vendor).toBe("google");
        expect(prompt.model.model).toBe("text-bison");
        expect(prompt.prompt).toBe("Give me translations, follow the format in my examples:\n"); //TODO: does this need to be trimed?
        expect(prompt.parameters).toHaveLength(1);
        expect(prompt.parameters[0].name).toBe("temperature");
        expect(prompt.parameters[0].value).toBe(0.5);
        expect(prompt.examples).toBeDefined();
        expect(prompt.examples.fields).toStrictEqual(["input", "output"]);
        expect(prompt.examples.rows).toHaveLength(2);
        expect(prompt.examples.rows[0].values).toStrictEqual(["China", "China-中国"]);
        expect(prompt.examples.test).toStrictEqual(["Japan"]);
    });

    test('should return chat prompt', () => {
        const serializer = new YamlSerializer();
        const prompt = serializer.deserialize(syncReadFile("../test/chat-1.yaml")) as Chat;
        expect(prompt.parameters).toHaveLength(1);
        expect(prompt.parameters[0].name).toBe("temperature");
        expect(prompt.parameters[0].value).toBe(0.5);
        expect(prompt.examples).toBeDefined();
        expect(prompt.examples).toHaveLength(1);
        expect(prompt.examples[0].input).toBe("China");
        expect(prompt.examples[0].output).toBe("China(中国)");
        expect(prompt.messages).toBeDefined();
        expect(prompt.messages).toHaveLength(1);
        expect(prompt.messages[0].input).toBe("Japan");
        expect(prompt.messages[0].output).toBeUndefined();
    });
});

describe('serialize completion', () => {
    test('serialize plain completion', () => {
        const serializer = new YamlSerializer();
        const c = new Completion(new Model("google", "text-bison"),
            "What's your name?", [new Parameter("top_k", 0.95)]);
        const prompt = serializer.serialize(c);
        expect(prompt).toBe(syncReadFile("../test/completion-expected-1.yaml"));
    });

    test('serialize structured completion', () => {
        const serializer = new YamlSerializer();
        const c = new Completion(new Model("google", "text-bison"),
            "What's your name?", [new Parameter("top_k", 0.95)],
            new StructuredExamples(["input1", "input2", "output"], [new StructuredExample(["a", "b", "c"])],
                ["x", "y"]));
        const prompt = serializer.serialize(c);
        expect(prompt).toBe(syncReadFile("../test/completion-expected-2.yaml"));
    });
});