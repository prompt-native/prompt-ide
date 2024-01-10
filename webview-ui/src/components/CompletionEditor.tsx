import {
    VSCodeButton,
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeProgressRing,
    VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import { CompletionPrompt } from "prompt-schema";
import { useState } from "react";
import Result from "../providers/Result";
import { showError } from "../utilities/Message";
import { parseVariables } from "../utilities/PromptHelper";
import Variables, { VariableBinding } from "./Variables";

interface CompletionEditorProps {
    prompt: CompletionPrompt;
    onPromptChanged: (prompt: CompletionPrompt) => void;
    activeTab?: string;
    onTabActive: (id: string) => void;
    onVariableBinded: (name: string, value: string) => void;
    executePrompt: (prompt: CompletionPrompt) => Promise<Result>;
}

function CompletionEditor({
    prompt,
    onPromptChanged,
    activeTab,
    onTabActive,
    onVariableBinded,
    executePrompt,
}: CompletionEditorProps) {
    const [executing, setExecuting] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [result, setResult] = useState<null | Result>(null);

    const variables = parseVariables(prompt.prompt).map((v) => new VariableBinding(v, ""));
    const onTextChanged = (text: string) => {
        if (text != prompt.prompt) {
            onPromptChanged({ ...prompt, prompt: text });
        }
    };

    const onTabChange = (e: any) => {
        if (e.detail && e.detail.id) onTabActive(e.detail.id);
    };

    const onSubmit = async () => {
        if (prompt.prompt === "") {
            showError("Please input prompt");
            return;
        }
        try {
            setExecuting(true);
            const result = await executePrompt(prompt);
        } catch (err) {
            setError(`${err}`);
        } finally {
            setExecuting(false);
        }
    };

    return (
        <div className="flex-grow flex-column pl-10 pr-10">
            <div className="flex flex-column mt-10">
                <VSCodeTextArea
                    className="input mb-10"
                    resize="vertical"
                    rows={10}
                    value={prompt.prompt}
                    onChange={(e) => onTextChanged((e.target as HTMLInputElement).value)}
                    placeholder="Enter your prompt here"></VSCodeTextArea>
                <div className="flex">
                    <VSCodeButton
                        className="button fixed-100"
                        disabled={executing}
                        onClick={onSubmit}>
                        Submit
                    </VSCodeButton>
                    {executing && <VSCodeProgressRing />}
                </div>
            </div>
            <VSCodePanels activeid={activeTab} onChange={onTabChange}>
                <VSCodePanelTab id="tab-result">RESULT</VSCodePanelTab>
                <VSCodePanelTab id="tab-variables">VARIABLES</VSCodePanelTab>
                <VSCodePanelView id="view-result" className="no-padding">
                    {!error && !result && <p>No result yet, click submit to execute the prompt.</p>}
                    {error && <p className="danger pre-line">{error}</p>}
                </VSCodePanelView>
                <VSCodePanelView id="view-variables" className="no-padding">
                    <Variables
                        variables={variables}
                        onVariableBinded={onVariableBinded}></Variables>
                </VSCodePanelView>
            </VSCodePanels>
        </div>
    );
}

export default CompletionEditor;
