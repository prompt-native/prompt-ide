'use strict';

import * as vscode from 'vscode';

import { PromptExplorer } from './prompt/promptExplorer';
import { CatScratchEditorProvider } from './catScratchEditor';

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
            const uri = editor.document.uri;
            vscode.commands.executeCommand(
                "vscode.openWith",
                uri,
                CatScratchEditorProvider.viewType,
                vscode.ViewColumn.Two
            );
        } else {
            vscode.window.showInformationMessage(`No open document found`);
        }
        
    }));
    context.subscriptions.push(CatScratchEditorProvider.register(context));
}

function getWebviewContent() {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Hello Webview</title>
    </head>
    <body>
        <h1>Hello Webview!</h1>
    </body>
    </html>
    `;
}