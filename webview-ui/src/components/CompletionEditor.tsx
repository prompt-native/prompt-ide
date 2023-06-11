import {
    VSCodeTextArea
} from "@vscode/webview-ui-toolkit/react";

import StructuredEditor from "./StructuredEditor";

export enum EditorMode {
    FreeFormat = "Free Format",
    Structured = "Structured",
}

interface CompletionEditorProps {
    mode: EditorMode,
}

function CompletionEditor({ mode }: CompletionEditorProps) {
    if (mode == EditorMode.FreeFormat) {
        return (
            <div className="main-content">
                <span className="label">Prompt</span>
                <VSCodeTextArea
                    className="col"
                    resize="vertical"
                    rows={15}
                    placeholder="This is the prompt that you will ask LLM">
                </VSCodeTextArea>
            </div>
        );
    }
    return <StructuredEditor />;
}

export default CompletionEditor;
