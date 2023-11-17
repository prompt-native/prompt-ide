export class Parameter {
    constructor(public name: string, public value: string | number | boolean) {}
}

export class FunctionCall {
    constructor(public name: string, public functionArguments: any) {}
}

export class FunctionParameter {
    constructor(
        public name: string,
        public type: string,
        public required?: boolean,
        public description?: string,
        public enums?: string[]
    ) {}
}

export class Function {
    constructor(
        public name: string,
        public description?: string,
        public parameters?: FunctionParameter[]
    ) {}
}

export class Message {
    constructor(
        public role: string,
        public name?: string,
        public content?: string,
        public functionCall?: FunctionCall
    ) {}
}

export class Prompt {
    constructor(public version: string, public engine: string, public parameters?: Parameter[]) {}
}

export class CompletionPrompt extends Prompt {
    prompt: string;
    constructor(version: string, engine: string, prompt: string, parameters?: Parameter[]) {
        super(version, engine, parameters);
        this.prompt = prompt;
    }
}

export class ChatPrompt extends Prompt {
    context?: string;
    examples?: Message[];
    messages: Message[];
    functions?: Function[];

    constructor(
        version: string,
        engine: string,
        messages: Message[],
        parameters?: Parameter[],
        context?: string,
        examples?: Message[],
        functions?: Function[]
    ) {
        super(version, engine, parameters);
        this.messages = messages;
        this.context = context;
        this.examples = examples;
        this.functions = functions;
    }
}
