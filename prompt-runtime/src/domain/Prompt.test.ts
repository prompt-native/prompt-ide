import { StructuredExampleBuilder } from "./Prompt";

describe('build structued examples', () => {
    test('init example', () => {
        let builder = new StructuredExampleBuilder();
        const result = builder.toStructuredExamples();
        expect(result.labels).toBe(undefined);
        expect(result.test).toStrictEqual({ "input": "" });
        expect(result.examples).toStrictEqual([]);
    });

    test('add field', () => {
        let builder = new StructuredExampleBuilder();
        builder.addField();
        const result = builder.toStructuredExamples();
        expect(result.labels).toBe(undefined);
        expect(result.test).toStrictEqual({ "input1": "", "input2": "" });
        expect(result.examples).toStrictEqual([]);
    });

    test('add field with value', () => {
        let builder = new StructuredExampleBuilder();
        builder.setTest("input1", "abc");
        builder.addField();
        builder.addField();
        const result = builder.toStructuredExamples();
        expect(result.labels).toBe(undefined);
        expect(result.test).toStrictEqual({ "input1": "abc", "input2": "", "input3": "" });
        expect(result.examples).toStrictEqual([]);
    });

    test('add exampple', () => {
        let builder = new StructuredExampleBuilder();
        builder.addExample();
        builder.setExample(0, "input1", "abc");
        const result = builder.toStructuredExamples();
        expect(result.labels).toBe(undefined);
        expect(result.examples.length).toBe(1);
        expect(result.examples[0]).toStrictEqual({ "input": "abc", "output": "" });
    });

    test('add exampple and then add field', () => {
        let builder = new StructuredExampleBuilder();
        builder.addExample();
        builder.addField();
        builder.setExample(0, "input1", "abc");
        builder.setExample(0, "output", "xyz");
        const result = builder.toStructuredExamples();
        expect(result.labels).toBe(undefined);
        expect(result.examples.length).toBe(1);
        expect(result.examples[0]).toStrictEqual({ "input1": "abc", "input2": "", "output": "xyz" });
    });
});