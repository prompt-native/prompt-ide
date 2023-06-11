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

function ChatEditor({ mode }: CompletionEditorProps) {
    if (mode == EditorMode.FreeFormat) {
        return (
            <>
                <p className="label">Prompt</p>
                <VSCodeTextArea
                    className="col"
                    resize="vertical"
                    rows={15}
                    placeholder="Chat">
                </VSCodeTextArea>
            </>
        );
    }
    return <StructuredEditor />;
}

export default ChatEditor;
