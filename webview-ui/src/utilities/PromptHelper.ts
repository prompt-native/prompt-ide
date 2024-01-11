import { Message, Prompt } from "prompt-schema";

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

export function getParameter(prompt: Prompt, name: string): any {
    const candidates = prompt.parameters?.filter((p) => p.name === name);
    if (!candidates || candidates.length == 0) return undefined;
    if (candidates.length > 1) throw new Error(`Ambiguous parameter detected: ${name}`);
    return candidates[0].value;
}

export function getParameterAsString(prompt: Prompt, name: string): string | undefined {
    const p = getParameter(prompt, name);
    if (!p) return undefined;
    return p as string;
}
export function getParameterAsNumber(prompt: Prompt, name: string): number | undefined {
    const p = getParameter(prompt, name);
    if (!p) return undefined;
    return p as number;
}

export function getParameterAsBoolean(prompt: Prompt, name: string): boolean | undefined {
    const p = getParameter(prompt, name);
    if (!p) return undefined;
    return p as boolean;
}
