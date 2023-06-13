import {
    VSCodeButton,
    VSCodeDivider,
    VSCodeDropdown,
    VSCodeOption,
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeTextArea
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

    return (
        <div className="main-content">
            <span className="label">Input</span>
            <VSCodeTextArea
                className="input"
                resize="vertical"
                rows={10}
                placeholder="Enter your prompt here">
            </VSCodeTextArea>
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


    if (editorMode == EditorMode.FreeFormat) {
        return (
            <VSCodePanels className="main-content" aria-label="Default">
                <VSCodePanelTab id="tab-prompt">Prompt</VSCodePanelTab>
                <VSCodePanelTab id="tab-context">Context</VSCodePanelTab>
                <VSCodePanelTab id="tab-examples">Examples</VSCodePanelTab>
                <VSCodePanelView id="view-prompt" className="content">
                    <span className="label">Input</span>
                    <VSCodeTextArea
                        className="col"
                        resize="vertical"
                        rows={1}
                        placeholder="Enter your prompt here">
                    </VSCodeTextArea>
                    <span className="label">Output</span>
                    <VSCodeTextArea
                        className="col"
                        resize="vertical"
                        readOnly
                        rows={1}
                        value="12345"
                        placeholder="Output from LLM">
                    </VSCodeTextArea>
                </VSCodePanelView>
                <VSCodePanelView id="view-context">
                    <div >
                        <span className="label">Prompt</span>
                        <VSCodeTextArea
                            className="col"
                            resize="vertical"
                            rows={5}
                            placeholder="This is the prompt that you will ask LLM">
                        </VSCodeTextArea>
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
                        <span className="label">Output</span>
                        <VSCodeTextArea
                            className="output"
                            resize="vertical"
                            readOnly
                            rows={10}
                            placeholder="This is the prompt that you will ask LLM">
                        </VSCodeTextArea>
                    </div>
                </VSCodePanelView>
                <VSCodePanelView id="view-examples">

                </VSCodePanelView>
            </VSCodePanels>

        );
    }
    return <StructuredEditor />;
}

export default CompletionEditor;
