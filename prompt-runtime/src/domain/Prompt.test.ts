import { Completion, ExampleColumn, Model } from "./Prompt";

describe('build structued examples', () => {
    test('init example', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?");

        expect(result.examples).toBeUndefined();
        expect(result.getExampleCount()).toBe(0);

        result.toStructured();
        expect(result.getExampleCount()).toBe(0);
        expect(result.examples).toStrictEqual([new ExampleColumn("input", []), new ExampleColumn("output", [])]);
    });

    test('add field', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input", []), new ExampleColumn("output", [])]);
        result.addColumn("test");
        expect(result.examples).toBeDefined();
        expect(result.getExampleCount()).toBe(0);
        expect(result.examples).toStrictEqual([new ExampleColumn("input", []), new ExampleColumn("test", []), new ExampleColumn("output", [])]);
    });

    test('add field with value', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", ["a"]), new ExampleColumn("output", ["b"])]);
        result.addColumn("input2");
        expect(result.examples).toBeDefined();
        expect(result.getExampleCount()).toBe(1);
        expect(result.examples).toStrictEqual([new ExampleColumn("input1", ["a"]), new ExampleColumn("input2", []), new ExampleColumn("output", ["b"])]);
    });

    test('set example', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", ["a"]), new ExampleColumn("output", ["b"])]);
        result.setExamples(0, ["c", "d"]);
        expect(result.examples).toBeDefined();
        expect(result.getExampleCount()).toBe(1);
        expect(result.examples).toStrictEqual([new ExampleColumn("input1", ["c"]), new ExampleColumn("output", ["d"])]);
    });

    test('add exampple', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", ["a"]), new ExampleColumn("output", ["b"])]);
        result.addExamples(["c", "d"]);
        expect(result.examples).toBeDefined();
        expect(result.getExampleCount()).toBe(2);
        expect(result.examples).toStrictEqual([new ExampleColumn("input1", ["a", "c"]), new ExampleColumn("output", ["b", "d"])]);
    });

    test('remove exampple', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", []), new ExampleColumn("output", [])]);
        result.removeExample(0);
        expect(result.examples).toBeDefined();
        expect(result.getExampleCount()).toBe(0);
    });

    test('remove column', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", ["a"]), new ExampleColumn("output", ["b"])]);
        result.removeColumn(0);
        console.log(result.examples);
        expect(result.examples).toBeDefined();
        expect(result.examples?.length).toBe(1);
        expect(result.examples).toStrictEqual([new ExampleColumn("output", ["b"])]);
    });


    test('set test', () => {
        let result = new Completion(new Model("google", "bard"), "who are you?", [], [new ExampleColumn("input1", ["a"]), new ExampleColumn("output", ["b"])]);
        result.setTest(["x"]);
        expect(result.examples).toStrictEqual([new ExampleColumn("input1", ["a"], "x"), new ExampleColumn("output", ["b"])]);
    });
});