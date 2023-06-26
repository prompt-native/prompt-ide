
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

export class ExampleColumn {
    constructor(
        public name: string,
        public values: string[],
        public test?: string,
    ) { }
}

export class Completion extends Prompt {
    prompt: string;
    examples?: ExampleColumn[];

    constructor(model: Model, prompt: string, parameters?: Parameter[], examples?: ExampleColumn[]) {
        super(Type.completion, model, parameters);
        this.prompt = prompt;
        this.examples = examples;
    }

    toChat(): Chat {
        const chat = new Chat(this.model, undefined, this.parameters, this.prompt);
        return chat;
    }

    toStructured() {
        if (!this.examples) {
            this.examples = [
                new ExampleColumn("input", []),
                new ExampleColumn("output", [])];
        }
    }

    getExampleCount(): number {
        if (this.examples) {
            return this.examples[0].values.length;
        }
        return 0;
    }

    addColumn(name: string) {
        const output = this.examples.pop();
        this.examples.push(new ExampleColumn(name, []));
        this.examples.push(output);
    }

    removeColumn(index: number) {
        this.examples.splice(index, 1);
    }

    setExamples(index: number, values: string[]) {
        if (values.length !== this.examples.length) {
            throw new Error("Columns not match");
        }
        for (let i = 0; i < this.examples.length; i++) {
            this.examples[i].values[index] = values[i];
        }
    }

    addExamples(values: string[]) {
        if (values.length !== this.examples.length) {
            throw new Error("Columns not match");
        }
        const count = this.getExampleCount();

        for (let i = 0; i < this.examples.length; i++) {
            this.examples[i].values[count] = values[i];
        }
    }

    setTest(values: string[]) {
        if (values.length !== this.examples.length - 1) {
            throw new Error("Columns not match");
        }
        for (let i = 0; i < this.examples.length - 1; i++) {
            this.examples[i].test = values[i];
        }
    }

    removeExample(index: number) {
        for (let i = 0; i < this.examples.length; i++) {
            this.examples[i].values.slice(index, 1);
        }
    }

    updateExample(index: number, values: string[]) {
        if (values.length !== this.examples.length) {
            throw new Error("Columns not match");
        }
        for (let i = 0; i < this.examples.length; i++) {
            this.examples[i].values[index] = values[i];
        }
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
