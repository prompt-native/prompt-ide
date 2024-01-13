import { ChatPrompt, CompletionPrompt } from "prompt-schema";
import { vscode } from "./vscode";

export function syncPrompt(newPrompt: ChatPrompt | CompletionPrompt) {
    vscode.postMessage({
        type: "sync",
        text: JSON.stringify(newPrompt, null, 2),
    });
}

export function showError(info: string) {
    vscode.postMessage({
        type: "error",
        text: info,
    });
}

export function appendOutput(info: string) {
    vscode.postMessage({
        type: "output",
        text: info,
    });
}

export function formatHeaders(headers: Headers): string {
    let formattedHeaders = "";

    headers.forEach((value, name) => {
        formattedHeaders += `${name}: ${value}\n`;
    });

    return formattedHeaders;
}
