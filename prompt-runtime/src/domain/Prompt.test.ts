import { Completion, ExampleColumn, Model, Parameter, Prompt } from "./Prompt";
import { Vendor } from "../config/Config";

describe('get prompts', () => {
    test('add param', () => {
        let c = new Completion(new Model(Vendor.Google, "text-bison"),
            "Please translate in the following format:",
            [
                new Parameter("temperature", 0.2),
                new Parameter("maxOutputTokens", 256),
                new Parameter("topP", 0.8),
                new Parameter("topK", 40)
            ],
            [
                new ExampleColumn("input", ["English"], "Chinese"),
                new ExampleColumn("output", ["English - 英国"])
            ]);
        const result = Completion.getFinalPrompt(c);
        expect(result).toStrictEqual(`Please translate in the following format:

input: English
output: English - 英国

input: Chinese
output: 
`);
    });
});

describe('modify params', () => {
    test('add param', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?");
        result = Prompt.changeParameter(result, "top_p", 0.1) as typeof result;
        expect(result.parameters).toStrictEqual([new Parameter("top_p", 0.1)]);
    });

    test('update param', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?");
        result = Prompt.changeParameter(result, "top_p", 0.1) as typeof result;
        result = Prompt.changeParameter(result, "top_p", 0.2) as typeof result;
        expect(result.parameters).toStrictEqual([new Parameter("top_p", 0.2)]);
    });

    test('delete param', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?");
        result = Prompt.changeParameter(result, "top_p", 0.1) as typeof result;
        result = Prompt.removeParameter(result, "top_p") as typeof result;
        expect(result.parameters).toBe(undefined);
    });
});

describe('build structued examples', () => {
    test('init example', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?");

        expect(result.examples).toBeUndefined();
        expect(Completion.getExampleCount(result)).toBe(0);

        result = Completion.toStructured(result);
        expect(Completion.getExampleCount(result)).toBe(0);
        expect(result.examples).toStrictEqual([new ExampleColumn("input", []), new ExampleColumn("output", [])]);
    });

    test('add field', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input", []), new ExampleColumn("output", [])]);
        result = Completion.addColumn(result, "test");
        expect(result.examples).toBeDefined();
        expect(Completion.getExampleCount(result)).toBe(0);
        expect(result.examples).toStrictEqual([new ExampleColumn("input", []), new ExampleColumn("test", []), new ExampleColumn("output", [])]);
    });

    test('add field with value', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", ["a"]), new ExampleColumn("output", ["b"])]);
        result = Completion.addColumn(result, "input2");
        expect(result.examples).toBeDefined();
        expect(Completion.getExampleCount(result)).toBe(1);
        expect(result.examples).toStrictEqual([new ExampleColumn("input1", ["a"]), new ExampleColumn("input2", []), new ExampleColumn("output", ["b"])]);
    });

    test('set example', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", ["a"]), new ExampleColumn("output", ["b"])]);
        result = Completion.setExamples(result, 0, ["c", "d"]);
        expect(result.examples).toBeDefined();
        expect(Completion.getExampleCount(result)).toBe(1);
        expect(result.examples).toStrictEqual([new ExampleColumn("input1", ["c"]), new ExampleColumn("output", ["d"])]);
    });

    test('add exampple', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", ["a"]), new ExampleColumn("output", ["b"])]);
        result = Completion.addExample(result);
        expect(result.examples).toBeDefined();
        expect(Completion.getExampleCount(result)).toBe(2);
        expect(result.examples).toStrictEqual([new ExampleColumn("input1", ["a", ""]), new ExampleColumn("output", ["b", ""])]);
    });

    test('remove exampple', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", []), new ExampleColumn("output", [])]);
        result = Completion.removeExample(result, 0);
        expect(result.examples).toBeDefined();
        expect(Completion.getExampleCount(result)).toBe(0);
    });

    test('remove column', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", ["a"]), new ExampleColumn("output", ["b"])]);
        result = Completion.removeColumn(result, 0);
        console.log(result.examples);
        expect(result.examples).toBeDefined();
        expect(result.examples?.length).toBe(1);
        expect(result.examples).toStrictEqual([new ExampleColumn("output", ["b"])]);
    });


    test('set test', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", ["a"]), new ExampleColumn("output", ["b"])]);
        result = Completion.setTest(result, ["x"]);
        expect(result.examples).toStrictEqual([new ExampleColumn("input1", ["a"], "x"), new ExampleColumn("output", ["b"])]);
    });

    test('normalize completion examples', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [],
            [new ExampleColumn("input1", ["a", "b", ""], "x"), new ExampleColumn("output", ["b", "c"])]);
        result = Completion.normalize(result);
        expect(result.examples).toStrictEqual([new ExampleColumn("input1", ["a", "b", ""], "x"), new ExampleColumn("output", ["b", "c", ""])]);
    });
});