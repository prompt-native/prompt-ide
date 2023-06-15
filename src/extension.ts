'use strict';

import * as vscode from 'vscode';

import { PromptExplorer } from './prompt/promptExplorer';
import { PromptEditorProvider } from './promptEditor';
import { PromptEditorPanel } from './panels/PromptEditorPanel';

export function activate(context: vscode.ExtensionContext) {
    const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
        ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

    // Samples of `window.registerTreeDataProvider`
    const promptProvider = new PromptExplorer(rootPath);
    context.subscriptions.push(vscode.window.registerTreeDataProvider('nodeDependencies', promptProvider));
    context.subscriptions.push(vscode.commands.registerCommand('prompt-studio.helloWorld', () => vscode.window.showInformationMessage(`Success!`)));
    context.subscriptions.push(vscode.commands.registerCommand('prompt-studio.preview', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document.uri;
            PromptEditorPanel.render(context.extensionUri, document);
        } else {
            vscode.window.showInformationMessage(`No open document found`);
        }

    }));
    context.subscriptions.push(PromptEditorProvider.register(context));
}
