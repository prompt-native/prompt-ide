import * as vscode from "vscode";

import { PromptEditor } from "./PromptEditor";
import { PromptExplorer } from "./prompt/promptExplorer";

export function activate(context: vscode.ExtensionContext) {
    const rootPath =
        vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : undefined;
    const promptProvider = new PromptExplorer(rootPath);
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider("promptExplorer", promptProvider)
    );
    const createPromptCommand = vscode.commands.registerCommand("promptIde.createPrompt", () => {
        PromptEditor.render(context.extensionUri);
    });

    context.subscriptions.push(createPromptCommand);
}
