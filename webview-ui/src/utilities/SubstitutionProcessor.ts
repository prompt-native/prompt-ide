import { ChatPrompt, CompletionPrompt, Message } from "prompt-schema";

const VARIABLE_REGEX = /\$\([a-zA-Z_][a-zA-Z_0-9]*\)/g;

export default class SubstitutionProcessor {
    constructor(private binding: Map<string, string>) {}

    public static parseVariables(prompt: string): string[] {
        const matches = prompt.match(VARIABLE_REGEX);
        if (matches) {
            return [...new Set(matches)];
        } else return [];
    }

    public static parseChatVariables(messages: Message[]): string[] {
        const variables = messages
            .filter((message) => message.content)
            .map((message) => this.parseVariables(message.content || ""))
            .flat();
        return [...new Set(variables)];
    }

    public substitute(text: string): string {
        const variables = SubstitutionProcessor.parseVariables(text);
        let content = text;
        variables.forEach((variable) => {
            const value = this.binding.get(variable) || "";
            content = content.replaceAll(variable, value);
        });
        return content;
    }

    public substituteCompletion(prompt: CompletionPrompt): CompletionPrompt {
        return { ...prompt, prompt: this.substitute(prompt.prompt) };
    }

    public substituteChat(prompt: ChatPrompt): ChatPrompt {
        return {
            ...prompt,
            context: prompt.context && this.substitute(prompt.context),
            messages: prompt.messages.map(this.substituteMessage.bind(this)),
            examples: prompt.examples && prompt.examples.map(this.substituteMessage.bind(this)),
        };
    }

    private substituteMessage(message: Message): Message {
        return { ...message, content: message.content && this.substitute(message.content) };
    }
}
