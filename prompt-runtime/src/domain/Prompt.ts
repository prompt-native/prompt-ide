
export enum Type {
    completion = "completion",
    chat = "chat",
    image = "image"
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

    static changeParameter(prompt: Chat | Completion, name: string, value: string | number): Chat | Completion {
        const params = prompt.parameters?.filter((p) => p.name !== name) || [];
        params.push(new Parameter(name, value));
        return {
            ...prompt, parameters: params
        } as typeof prompt;
    }

    static removeParameter(prompt: Chat | Completion, name: string): Chat | Completion {
        const params = prompt.parameters?.filter((p) => p.name !== name);
        return {
            ...prompt, parameters: params.length === 0 ? undefined : params
        } as typeof prompt;
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

    static toChat(completion: Completion): Chat {
        const chat = new Chat(completion.model, undefined, completion.parameters, completion.prompt);
        return chat;
    }

    static toStructured(completion: Completion): Completion {
        return {
            ...completion, examples: completion.examples || [
                new ExampleColumn("input", []),
                new ExampleColumn("output", [])]
        } as Completion;
    }

    static toFreeFormat(completion: Completion): Completion {
        // todo: join examples as prompt
        return {
            ...completion, examples: undefined,
        } as Completion;
    }

    static getExampleCount(completion: Completion): number {
        if (completion.examples && completion.examples.length > 0) {
            return completion.examples[0].values.length;
        }
        return 0;
    }

    private static ensureIsStructured(completion: Completion) {
        if (!completion.examples) {
            throw new Error("Completion is not structured!");
        }
    }

    static addColumn(completion: Completion, name: string): Completion {
        this.ensureIsStructured(completion);
        const copy = { ...completion } as Completion;
        const output = copy.examples.pop();
        copy.examples.push(new ExampleColumn(name, []));
        copy.examples.push(output);
        return copy;
    }

    static removeColumn(completion: Completion, index: number): Completion {
        this.ensureIsStructured(completion);
        const copy = { ...completion } as Completion;
        copy.examples.splice(index, 1);
        return copy;
    }

    static setExamples(completion: Completion, index: number, values: string[]) {
        this.ensureIsStructured(completion);
        const copy = { ...completion } as Completion;

        if (values.length !== copy.examples.length) {
            throw new Error("Columns not match");
        }
        for (let i = 0; i < copy.examples.length; i++) {
            copy.examples[i].values[index] = values[i];
        }
        return copy;
    }

    static addExample(completion: Completion): Completion {
        this.ensureIsStructured(completion);
        const copy = { ...completion } as Completion;

        const count = this.getExampleCount(copy);

        for (let i = 0; i < copy.examples.length; i++) {
            copy.examples[i].values[count] = "";
        }
        return copy;
    }

    static setTest(completion: Completion, values: string[]) {
        this.ensureIsStructured(completion);
        const copy = { ...completion } as Completion;

        if (values.length !== copy.examples.length - 1) {
            throw new Error("Columns not match");
        }
        for (let i = 0; i < copy.examples.length - 1; i++) {
            copy.examples[i].test = values[i];
        }

        return copy;
    }

    static removeExample(completion: Completion, index: number) {
        this.ensureIsStructured(completion);
        const copy = { ...completion } as Completion;

        for (let i = 0; i < copy.examples.length; i++) {
            copy.examples[i].values.slice(index, 1);
        }

        return copy;
    }

    static updateExample(completion: Completion, index: number, values: string[]) {
        this.ensureIsStructured(completion);
        const copy = { ...completion } as Completion;

        if (values.length !== copy.examples.length) {
            throw new Error("Columns not match");
        }
        for (let i = 0; i < copy.examples.length; i++) {
            copy.examples[i].values[index] = values[i];
        }

        return copy;
    }

    static normalize(completion: Completion): Completion {
        const copy = { ...completion } as Completion;
        if (copy.examples) {
            const examplesCount = this.getExampleCount(copy);
            for (let i = 0; i < examplesCount; i++) {
                copy.examples.forEach(column => {
                    column.values[i] = column.values[i] || "";
                });
            }
        }
        return copy;
    }

    static getFinalPrompt(completion: Completion): string {
        let prompt = completion.prompt;
        if (completion.examples) {
            prompt += "\n\n";
            for (let i = 0; i < this.getExampleCount(completion); i++) {
                completion.examples.forEach(column => {
                    prompt += `${column.name}: ${column.values[i] || ''}\n`;
                });
                prompt += '\n';
            }
        }
        for (let i = 0; i < this.getExampleCount(completion); i++) {
            completion.examples.forEach(column => {
                prompt += `${column.name}: ${column.test || ''}\n`;
            });
        }
        return prompt;
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

    static toCompletion(chat: Chat): Completion {
        let prompt = chat.context || '';
        if (chat.messages && chat.messages.length > 0) {
            prompt += '\n' + chat.messages[0].input;
        }
        const completion = new Completion(chat.model, prompt, chat.parameters);
        return completion;
    }
}
