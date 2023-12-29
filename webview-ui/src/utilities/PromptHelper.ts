import { Message } from "prompt-schema";

export function parseVariables(prompt: string): string[] {
    const matches = prompt.match(/\$\([a-zA-Z_][a-zA-Z_0-9]*\)/g);
    if (matches) {
        return [...new Set(matches)];
    } else return [];
}

export function parseChatVariables(messages: Message[]): string[] {
    const variables = messages
        .filter((message) => message.content)
        .map((message) => parseVariables(message.content || ""))
        .flat();
    return [...new Set(variables)];
}
