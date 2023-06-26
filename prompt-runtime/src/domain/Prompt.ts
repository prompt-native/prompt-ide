
export enum Type {
    completion = "completion",
    chat = "chat",
}

export class Parameter {
    constructor(
        public name: string,
        public value: string | number | boolean,
    ) { }
}

export class Conversation {
    constructor(
        public input: string,
        public output?: string
    ) { }
}

export class Model {
    constructor(
        public vendor: string,
        public model: string,
    ) { }
}

export class Prompt {
    type: Type = Type.completion;
    model: Model;
    parameters?: Parameter[];
    output?: string;

    constructor(type: Type, model: Model, parameters?: Parameter[]) {
        this.type = type;
        this.model = model;
        this.parameters = parameters;
    }
}

export class StructuredExampleBuilder {
    private _labels: Record<string, string>;
    private _test: Record<string, string>;
    private _examples: Record<string, string>[];

    constructor() {
        this._labels = {};
        this._test = { "input1": "" };
        this._examples = [];
    }

    addField() {
        const key = `input${Object.keys(this._test).length + 1}`;
        this._test[key] = "";
        this._examples.forEach(example => {
            example[key] = "";
        });
    }

    deleteField(name: string) {
        delete this._test[name];
        this._examples.forEach(example => {
            delete example[name];
        });
    }

    addExample() {
        let example = {};
        for (let key in this._test) {
            example[key] = "";
        }
        example["output"] = "";
        this._examples.push(example);
    }

    setExample(index: number, key: string, value: string) {
        if (index >= this._examples.length) {
            throw new Error("Index out of range");
        }
        this._examples[index][key] = value;
    }

    setTest(name: string, value: string) {
        if (!(name in this._test)) {
            throw new Error("Field not found");
        }
        this._test[name] = value;
    }

    setLabel(name: string, label: string) {
        if (!(name in this._test)) {
            throw new Error("Field not found");
        }
        this._labels[name] = label;
    }

    removeLabel(name: string) {
        if (!(name in this._test)) {
            throw new Error("Field not found");
        }
        delete this._labels[name];
    }

    toStructuredExamples() {
        let test: Record<string, string> = {};
        let examples: Record<string, string>[] = [];
        let labels: Record<string, string> = {};

        let keyMapping: Record<string, string> = {};
        let count = 1;
        let keys = Object.keys(this._test);
        keys.sort();

        keys.forEach(key => {
            const newKey = Object.keys(this._test).length === 1 ? "input" : `input${count}`;
            keyMapping[key] = newKey;
            test[newKey] = this._test[key];
            count += 1;
        });

        for (let key in this._labels) {
            const newKey = keyMapping[key];
            labels[newKey] = this._labels[key];
        }

        examples = this._examples.map(item => {
            let example: Record<string, string> = {};
            for (let key in item) {
                const newKey = keyMapping[key] || key;
                example[newKey] = item[key];
            }
            return example;
        });

        if (Object.keys(labels).length === 0) {
            labels = undefined;
        }

        return new StructuredExamples(examples, test, labels);
    }

}

export class StructuredExamples {
    constructor(
        public examples: Record<string, string>[],
        public test: Record<string, string>,
        public labels?: Record<string, string>,
    ) { }
}

export class Completion extends Prompt {
    prompt: string;
    structured?: StructuredExamples;

    constructor(model: Model, prompt: string, parameters?: Parameter[], examples?: StructuredExamples) {
        super(Type.completion, model, parameters);
        this.prompt = prompt;
        this.structured = examples;
    }

    toChat(): Chat {
        const chat = new Chat(this.model, undefined, this.parameters, this.prompt);
        return chat;
    }
}

export class Chat extends Prompt {
    context?: string;
    examples?: Conversation[];
    messages: Conversation[];

    constructor(model: Model, messages: Conversation[], parameters?: Parameter[], context?: string, examples?: Conversation[]) {
        super(Type.chat, model, parameters);
        this.messages = messages;
        this.context = context;
        this.examples = examples;
    }

    toCompletion(): Completion {
        let prompt = this.context || '';
        if (this.messages && this.messages.length > 0) {
            prompt += '\n' + this.messages[0].input;
        }
        const completion = new Completion(this.model, prompt, this.parameters);
        return completion;
    }
}
