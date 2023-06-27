import {
    VSCodeButton, VSCodeDropdown,
    VSCodeOption
} from "@vscode/webview-ui-toolkit/react";
import { EditorMode } from "./completion/CompletionEditor";
import { useState } from "react";

function ToolButtons() {
    const [editorMode, setEditorMode] = useState(EditorMode.FreeFormat);

    return (
        <div className="toolbar">
            <div className="button-group">
                <VSCodeButton className="button">Submit</VSCodeButton>
                <VSCodeButton className="button" appearance="secondary">Preview</VSCodeButton>
                <VSCodeButton className="button" appearance="secondary">Clear</VSCodeButton>
            </div>
            <VSCodeDropdown position="below"
                value={editorMode}
                onChange={(e) => setEditorMode((e.target as HTMLInputElement).value as EditorMode)}>
                {Object.values(EditorMode).map(t => <VSCodeOption>{t}</VSCodeOption>)}
            </VSCodeDropdown>
        </div>
    );
}

export default ToolButtons;