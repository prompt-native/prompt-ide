
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

export class StructuredExample {
    constructor(
        public values: string[]
    ) { }
}

export class StructuredExamples {
    constructor(
        public fields: string[],
        public rows: StructuredExample[],
        public test: string[],
    ) { }
}

export class Completion extends Prompt {
    prompt: string;
    examples?: StructuredExamples;

    constructor(model: Model, prompt: string, parameters?: Parameter[], examples?: StructuredExamples) {
        super(Type.completion, model, parameters);
        this.prompt = prompt;
        this.examples = examples;
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
}
