import {
    VSCodeTextArea
} from "@vscode/webview-ui-toolkit/react";

import StructuredEditor from "./StructuredEditor";

export enum EditorMode {
    FreeFormat = "free",
    Structured = "structured",
}

interface CompletionEditorProps {
    mode: EditorMode,
}

function CompletionEditor({ mode }: CompletionEditorProps) {
    if (mode == EditorMode.FreeFormat) {
        return (
            <>
                <p className="label">Prompt</p>
                <VSCodeTextArea
                    className="col"
                    resize="vertical"
                    rows={15}
                    placeholder="This is the prompt that you will ask LLM">
                </VSCodeTextArea>
            </>
        );
    }
    return <StructuredEditor />;
}

export default CompletionEditor;
