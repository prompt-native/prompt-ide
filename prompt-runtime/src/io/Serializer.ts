import YAML from 'yaml';
import { Completion, Parameter, Model, Chat, Type, Conversation, ExampleColumn } from '../domain/Prompt';

export class PromptToYaml {
    deserialize(text: string): Completion | Chat {
        const obj = YAML.parse(text);
        const type = this.requireString(obj, "type");
        const typeEnum = Type[type as keyof Type];

        const modelObj = this.requireNonNull(obj, "model");
        const vendor = this.requireString(modelObj, "vendor");
        const model = this.requireString(modelObj, "model");
        const parameters = this.parseParameters(obj);

        if (typeEnum === Type.completion) {
            const prompt = this.requireString(obj, "prompt");
            const examples = this.parseStructuredExamples(obj);
            return new Completion(new Model(vendor, model), prompt, parameters, examples);
        } else if (typeEnum === Type.chat) {
            const examples = this.parseExamples(obj);
            const messages = this.parseMessages(obj);
            const context = obj["context"];

            return new Chat(new Model(vendor, model), messages, parameters, context, examples);
        } else {
            throw new Error("Unsupported prompt type");
        }
    }

    serialize(obj: Completion | Chat): string {
        return YAML.stringify(obj);
    }

    private parseExamples(obj: any): Conversation[] | undefined {
        const examples = obj["examples"];
        if (examples === undefined || examples === null) {
            return undefined;
        }
        return this.requireArray(obj, "examples").map(row => {
            const input = this.requireString(row, "input");
            const output = this.requireString(row, "output");

            return new Conversation(input, output);
        });
    }

    private parseMessages(obj: any): Conversation[] {
        return this.requireArray(obj, "messages").map(row => {
            const input = this.requireString(row, "input");
            const output = row["output"];

            return new Conversation(input, output);
        });
    }

    private parseStructuredExamples(obj: any): ExampleColumn[] | undefined {
        const structured = obj["examples"];
        if (structured === undefined || structured === null) {
            return undefined;
        }

        const columns = this.requireArray(obj, "examples").map(item => {
            const name = this.requireNonNull(item, "name");
            const values = this.requireStringArray(item, "values");
            const test = item["test"];
            return new ExampleColumn(name, values, test);
        });

        return columns;
    }

    private parseParameters(obj: any): Parameter[] {
        const arr = this.requireArray(obj, "parameters");
        return arr.map(p => this.parseParameter(p));
    }

    private parseParameter(obj: any): Parameter {

        if (obj === undefined || obj === null) {
            throw new Error(`Parameter must not be empty`);
        }
        const name = this.requireString(obj, "name");
        const value = this.requireNonNull(obj, "value");

        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return new Parameter(name, value);
        } else {
            throw new Error(`Parameter value must be string or number`);
        }
    }
    private requireString(obj: any, field: string): string {
        const value = this.requireNonNull(obj, field);
        if (typeof value !== 'string') {
            throw new Error(`Field ${field} is not expected to string`);
        }
        return value as string;
    }

    private requireArray(obj: any, field: string): object[] {
        const value = this.requireNonNull(obj, field);
        if (!Array.isArray(value)) {
            throw new Error(`Parameters must be array`);
        }
        return value as object[];
    }

    private requireStringArray(obj: any, field: string): string[] {
        const arr = this.requireArray(obj, field);
        return arr.map(item => {
            if (typeof item !== 'string') {
                throw new Error(`Expected array item to be string`);
            }
            return item as string;
        });
    }

    private requireNonNull(obj: any, field: string): any {
        const value = obj[field];
        if (value === undefined || value === null) {
            throw new Error(`Field ${field} is not expected to be empty`);
        }

        return value;
    }
}
