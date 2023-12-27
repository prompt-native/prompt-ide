export function parseVariables(prompt: string): string[] {
    const matches = prompt.match(/\$\([a-zA-Z_][a-zA-Z_0-9]*\)/g);
    if (matches) {
        return [...new Set(matches)];
    } else return [];
}
