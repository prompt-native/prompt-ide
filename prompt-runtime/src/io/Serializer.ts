import YAML from 'yaml';
import { Prompt, Completion, Parameter, Model, StructuredExamples, StructuredExample } from '../domain/Prompt';

export interface Serializer<T extends Prompt> {
    deserialize(text: string): T;
    serialize(obj: T): string;
}

export class YamlCompletionSerializer implements Serializer<Completion> {
    deserialize(text: string): Completion {
        const obj = YAML.parse(text);
        const type = this.requireString(obj, "type");
        const vendor = this.requireString(obj, "vendor");
        const model = this.requireString(obj, "model");
        const prompt = this.requireString(obj, "prompt");
        const parameters = this.parseParameters(obj);
        const examples = this.parseStructuredExamples(obj);

        return new Completion(new Model(vendor, model), prompt, parameters, examples);
    }

    serialize(obj: Completion): string {
        return YAML.stringify(obj);
    }

    private parseStructuredExamples(obj: any): StructuredExamples | undefined {
        const examples = obj["examples"];
        if (examples === undefined || examples === null) {
            return undefined;
        }
        const fields = this.requireStringArray(examples, "fields");
        const test = this.requireStringArray(examples, "test");
        const rows = this.requireArray(examples, "rows").map(row => {
            const values = this.requireStringArray(row, "values");
            return new StructuredExample(values);
        });

        return new StructuredExamples(fields, rows, test);
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
