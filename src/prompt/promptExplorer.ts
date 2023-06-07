import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { PromptNode } from '../treeView/promptNode';
import { ProviderResult } from 'vscode';

export class PromptExplorer implements vscode.TreeDataProvider<PromptNode> {

    private _onDidChangeTreeData: vscode.EventEmitter<PromptNode | undefined | void> = new vscode.EventEmitter<PromptNode | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<PromptNode | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private workspaceRoot: string | undefined) {
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: PromptNode): vscode.TreeItem {
        return element;
    }

    async getChildren(element?: PromptNode): Promise<PromptNode[]> {
        if (element) {
            return element.getChildren();
        } else {
            return this._findPrompts();
        }
    }

    async _findPrompts(): Promise<PromptNode[]> {
        const xmls = await vscode.workspace.findFiles('**/*.xml');


        return Promise.resolve([PromptNode.categoryNode("a/b/c"), PromptNode.promptNode("prompt1")]);
    }
}
