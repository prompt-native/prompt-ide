import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";

import { CompletionProps } from "../../App";
import Collapse from "../Collapse";

function FreeEditor({ data, onPromptChanged }: CompletionProps) {
    const updatePrompt = (text: string) => {
        onPromptChanged({ ...data, prompt: text } as typeof data);
    };

    return (
        <div className="main-content">
            <Collapse title="Context">
                <VSCodeTextArea
                    className="input fill"
                    resize="vertical"
                    rows={10}
                    value={data.prompt}
                    onChange={(e) => updatePrompt((e.target as HTMLInputElement).value)}
                    placeholder="Enter your prompt here">
                </VSCodeTextArea>
            </Collapse>
            <Collapse title="Output">
                <VSCodeTextArea
                    className="output fill"
                    readOnly
                    placeholder="Output from LLM">
                </VSCodeTextArea>
            </Collapse>

        </div>
    );
}

export default FreeEditor;
