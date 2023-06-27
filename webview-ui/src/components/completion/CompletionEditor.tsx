import {
    VSCodeButton,
    VSCodeDivider,
    VSCodeDropdown,
    VSCodeLink,
    VSCodeOption, VSCodeTextArea
} from "@vscode/webview-ui-toolkit/react";

import { vscode } from "../../utilities/vscode";
import { useState } from "react";
import './CompletionEditor.css';
import { Completion } from 'prompt-runtime';
import StructuredInputRow from "./StructuredInputRow";

export enum EditorMode {
    FreeFormat = "Free Format",
    Structured = "Structured",
}

export interface CompletionProps {
    data: Completion,
    onPromptChanged: (data: Completion) => any;
}

function CompletionEditor({ data, onPromptChanged }: CompletionProps) {
    const [editorMode, setEditorMode] = useState(data.examples ? EditorMode.Structured : EditorMode.FreeFormat);

    function handleHowdyClick() {
        vscode.postMessage({
            command: "hello",
            text: "Hey there partner! 🤠",
        });
    }

    const readerToolbar = () => (
        <div className="toolbar">
            <div className="button-group">
                <VSCodeButton className="button" onClick={handleHowdyClick}>Submit</VSCodeButton>
            </div>
            <VSCodeDropdown position="below"
                value={editorMode}
                onChange={(e) => setEditorMode((e.target as HTMLInputElement).value as EditorMode)}>
                {Object.values(EditorMode).map(t => <VSCodeOption>{t}</VSCodeOption>)}
            </VSCodeDropdown>
        </div>
    );

    const updatePrompt = (text: string) => {
        onPromptChanged({ ...data, prompt: text } as typeof data);
    };

    const renderFreeEditor = () => (
        <div className="main-content">
            <span className="label">Input</span>
            <VSCodeTextArea
                className="input"
                resize="vertical"
                rows={20}
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

    const renderStructured = () => (
        <div className="main-content">
            <span className="label">Context</span>
            <VSCodeTextArea
                resize="vertical"
                rows={2}
                value={data.prompt}
                onChange={(e) => updatePrompt((e.target as HTMLInputElement).value)}
                placeholder="This is the prompt that you will ask LLM">
            </VSCodeTextArea>
            <div className="title-with-actions">
                <span className="label">Examples</span>
                <VSCodeLink onClick={() => { }}>Add example</VSCodeLink>
                {1 < 3 &&
                    <VSCodeLink onClick={() => { }}>Add field</VSCodeLink>}
            </div>
            <VSCodeDivider />
            <div className="title-with-actions">
                <span className="label">Test</span>
                <VSCodeLink onClick={() => { }}>Add field</VSCodeLink>
                <VSCodeLink>Add to example</VSCodeLink>
            </div>
            {data.examples?.map(column => {
                <StructuredInputRow
                    name={"input"}
                    value={""}
                    onNameChanged={(name) => { }}
                    onValueChanged={(value) => { }} />
            })}
        </div>
    );

    return (
        <>
            {editorMode == EditorMode.FreeFormat && renderFreeEditor()}
            {editorMode == EditorMode.Structured && renderStructured()}
        </>
    );
}

export default CompletionEditor;
