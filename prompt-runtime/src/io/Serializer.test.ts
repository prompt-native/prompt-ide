import { YamlCompletionSerializer } from "./Serializer";
import { readFileSync } from 'fs';
import { join } from 'path';
import { Type } from "../domain/Prompt";

export function syncReadFile(filename: string): string {
    const result = readFileSync(join(__dirname, filename), 'utf-8');
    return result;
}

describe('parse completion', () => {
    test('parse plain completion', () => {
        const serializer = new YamlCompletionSerializer();
        const prompt = serializer.deserialize(syncReadFile("../test/completion-1.yaml"));
        expect(prompt.type).toBe(Type.completion);
        expect(prompt.model.vendor).toBe("google");
        expect(prompt.model.model).toBe("text-bison");
        expect(prompt.prompt).toBe("What's your name?\n"); //TODO: does this need to be trimed?
        expect(prompt.parameters).toHaveLength(1);
        expect(prompt.parameters[0].name).toBe("temperature");
        expect(prompt.parameters[0].value).toBe(0.5);
        expect(prompt.examples).toBeUndefined();
    });

    test('parse structured completion', () => {
        const serializer = new YamlCompletionSerializer();
        const prompt = serializer.deserialize(syncReadFile("../test/completion-2.yaml"));
        expect(prompt.type).toBe(Type.completion);
        expect(prompt.model.vendor).toBe("google");
        expect(prompt.model.model).toBe("text-bison");
        expect(prompt.prompt).toBe("Give me translations, follow the format in my examples:\n"); //TODO: does this need to be trimed?
        expect(prompt.parameters).toHaveLength(1);
        expect(prompt.parameters[0].name).toBe("temperature");
        expect(prompt.parameters[0].value).toBe(0.5);
        expect(prompt.examples).toBeDefined();
        expect(prompt.examples.fields).toStrictEqual(["input", "output"]);
        expect(prompt.examples.values).toHaveLength(2);
        expect(prompt.examples.values[0].values).toStrictEqual(["China", "China-中国"]);
        expect(prompt.examples.test.values).toStrictEqual(["Japan"]);
    });
});