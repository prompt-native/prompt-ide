'use strict';

import * as vscode from 'vscode';

import { PromptExplorer } from './prompt/promptExplorer';

export function activate(context: vscode.ExtensionContext) {
    const rootPath = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
        ? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

    // Samples of `window.registerTreeDataProvider`
    const promptProvider = new PromptExplorer(rootPath);
    context.subscriptions.push(vscode.window.registerTreeDataProvider('nodeDependencies', promptProvider));
    context.subscriptions.push(vscode.commands.registerCommand('prompt-studio.helloWorld', () => vscode.window.showInformationMessage(`Success!`)));
    context.subscriptions.push(vscode.commands.registerCommand('prompt-studio.preview', () => {
        let panel = vscode.window.createWebviewPanel(
            'myWebview', // 标识符，需要唯一
            'My Webview', // 标题
            vscode.ViewColumn.Two, // 第一列
            {}
        );
        // 设置HTML内容
        panel.webview.html = getWebviewContent();
    }));

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