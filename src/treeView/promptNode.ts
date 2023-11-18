
import * as path from 'path';
import * as vscode from 'vscode';

export enum PromptNodeType {
    DIR = "dir",
    PROMPT = "prompt",
}

export class PromptNode extends vscode.TreeItem {
    private constructor(
        public readonly type: PromptNodeType,
        private readonly category: string,
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly iconPath = {
            light: path.join(__filename, '..', '..', '..', 'resources', 'light', 'dependency.svg'),
            dark: path.join(__filename, '..', '..', '..', 'resources', 'dark', 'dependency.svg')
        },
    ) {
        super(label, collapsibleState);
        this.tooltip = `this is ${this.label}`;
    }

    static categoryNode(name: string): PromptNode {
        return new PromptNode(PromptNodeType.DIR, "", name, vscode.TreeItemCollapsibleState.Expanded);
    }

    static promptNode(name: string): PromptNode {
        return new PromptNode(PromptNodeType.PROMPT, "", name, vscode.TreeItemCollapsibleState.None);
    }

    async getChildren(): Promise<PromptNode[]> {
        return [];
    }
}
