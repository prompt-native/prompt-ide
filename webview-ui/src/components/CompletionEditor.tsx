import {
    VSCodeButton,
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import { CompletionPrompt } from "prompt-schema";
import { parseVariables } from "../utilities/PromptHelper";
import Variables, { VariableBinding } from "./Variables";

interface CompletionEditorProps {
    prompt: CompletionPrompt;
    onPromptChanged: (prompt: CompletionPrompt) => void;
    activeTab?: string;
    onTabActive: (id: string) => void;
    onVariableBinded: (name: string, value: string) => void;
}

function CompletionEditor({
    prompt,
    onPromptChanged,
    activeTab,
    onTabActive,
    onVariableBinded,
}: CompletionEditorProps) {
    const variables = parseVariables(prompt.prompt).map((v) => new VariableBinding(v, ""));
    const onTextChanged = (text: string) => {
        if (text != prompt.prompt) {
            onPromptChanged({ ...prompt, prompt: text });
        }
    };

    return (
        <div className="flex-grow flex-column pl-10 pr-10">
            <div className="flex flex-column">
                <VSCodeTextArea
                    className="input"
                    resize="vertical"
                    rows={10}
                    value={prompt.prompt}
                    onChange={(e) => onTextChanged((e.target as HTMLInputElement).value)}
                    placeholder="Enter your prompt here"></VSCodeTextArea>
                <VSCodeButton className="button">Submit</VSCodeButton>
            </div>
            <VSCodePanels activeid={activeTab} onChange={(e: any) => onTabActive(e.detail.id)}>
                <VSCodePanelTab id="tab-result">RESULT</VSCodePanelTab>
                <VSCodePanelTab id="tab-variables">VARIABLES</VSCodePanelTab>
                <VSCodePanelView id="view-result">
                    <p>No result yet, click submit to execute the prompt.</p>
                </VSCodePanelView>
                <VSCodePanelView id="view-variables">
                    <Variables
                        variables={variables}
                        onVariableBinded={onVariableBinded}></Variables>
                </VSCodePanelView>
            </VSCodePanels>
        </div>
    );
}

export default CompletionEditor;
