import {
    VSCodeDivider, VSCodeTextArea
} from "@vscode/webview-ui-toolkit/react";

import { CompletionProps } from "../../App";

function FreeEditor({ data, onPromptChanged }: CompletionProps) {
    const updatePrompt = (text: string) => {
        onPromptChanged({ ...data, prompt: text } as typeof data);
    };

    return (
        <div className="main-content">
            <span className="label">Prompt</span>
            <VSCodeTextArea
                className="input"
                resize="vertical"
                rows={10}
                value={data.prompt}
                onChange={(e) => updatePrompt((e.target as HTMLInputElement).value)}
                placeholder="Enter your prompt here">
            </VSCodeTextArea>
            <VSCodeDivider />
            <span className="label">Output</span>
            <VSCodeTextArea
                className="output"
                readOnly
                placeholder="Output from LLM">
            </VSCodeTextArea>
        </div>
    );
}

export default FreeEditor;
