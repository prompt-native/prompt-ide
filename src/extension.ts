import * as vscode from "vscode";

import { Uri } from "vscode";
import { PromptEditor } from "./PromptEditor";
import { PromptExplorer } from "./prompt/promptExplorer";

export function activate(context: vscode.ExtensionContext) {
    const rootPath =
        vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
            ? vscode.workspace.workspaceFolders[0].uri.fsPath
            : undefined;
    const promptProvider = new PromptExplorer(rootPath);
    context.subscriptions.push(
        vscode.window.registerTreeDataProvider("promptIde.explorer", promptProvider)
    );

    const createPromptCommand = vscode.commands.registerCommand("promptIde.createPrompt", () => {
        // see: https://github.com/microsoft/vscode/issues/93441
        const fileName = "untitled-1.prompt";
        const newUri = Uri.file(fileName).with({ scheme: "untitled", path: fileName });
        vscode.commands.executeCommand("vscode.openWith", newUri, PromptEditor.viewType);
    });

    const refreshPromptsCommand = vscode.commands.registerCommand(
        "promptIde.refreshPrompts",
        () => {
            promptProvider.refresh();
        }
    );
    const openTextCommand = vscode.commands.registerCommand("promptIde.openText", () => {
        vscode.commands.executeCommand("workbench.action.reopenTextEditor");
    });

    context.subscriptions.push(PromptEditor.register(context));
    context.subscriptions.push(createPromptCommand);
    context.subscriptions.push(refreshPromptsCommand);
    context.subscriptions.push(openTextCommand);
}
