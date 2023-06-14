import {
    VSCodeButton,
    VSCodeDivider,
    VSCodeDropdown,
    VSCodeOption, VSCodeTextArea
} from "@vscode/webview-ui-toolkit/react";

import StructuredEditor from "./StructuredEditor";
import { vscode } from "../utilities/vscode";
import { useState } from "react";
import './CompletionEditor.css';
import ModelControl from "./ModelControl";

export enum EditorMode {
    FreeFormat = "Free Format",
    Structured = "Structured",
}

function CompletionEditor() {
    const [editorMode, setEditorMode] = useState(EditorMode.FreeFormat);

    function handleHowdyClick() {
        vscode.postMessage({
            command: "hello",
            text: "Hey there partner! 🤠",
        });
    }

    const renderFreeEditor = () => (
        <>
            <span className="label">Input</span>
            <VSCodeTextArea
                className="input"
                resize="vertical"
                rows={10}
                placeholder="Enter your prompt here">
            </VSCodeTextArea>
        </>
    );

    return (
        <div className="main-content">
            {editorMode == EditorMode.FreeFormat && renderFreeEditor()}
            {editorMode == EditorMode.Structured && <StructuredEditor />}
            <div className="toolbar">
                <div className="button-group">
                    <VSCodeButton className="button" onClick={handleHowdyClick}>Submit</VSCodeButton>
                    <VSCodeButton className="button" appearance="secondary" onClick={handleHowdyClick}>Preview</VSCodeButton>
                    <VSCodeButton className="button" appearance="secondary" onClick={handleHowdyClick}>Clear</VSCodeButton>
                </div>
                <VSCodeDropdown position="below"
                    value={editorMode}
                    onChange={(e) => setEditorMode((e.target as HTMLInputElement).value as EditorMode)}>
                    {Object.values(EditorMode).map(t => <VSCodeOption>{t}</VSCodeOption>)}
                </VSCodeDropdown>
            </div>
            <ModelControl />
            <VSCodeDivider />
            <span className="label">Output</span>
            <VSCodeTextArea
                className="output"
                readOnly
                value="12345"
                placeholder="Output from LLM">
            </VSCodeTextArea>
        </div>
    );
}

export default CompletionEditor;
