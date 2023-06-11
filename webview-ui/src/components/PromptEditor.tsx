import { vscode } from "../utilities/vscode";
import {
    VSCodeButton, VSCodeDropdown,
    VSCodeOption
} from "@vscode/webview-ui-toolkit/react";
import { useState } from "react";
import CompletionEditor, { EditorMode } from "../components/CompletionEditor";
import Topbar from "./Topbar";
import ChatEditor from "./ChatEditor";
import { CreateType, Vendor } from "../config/models";

function PromptEditor() {
    const [editorType, setEditorType] = useState(CreateType.Chat);
    const [vendor, setVendor] = useState(Vendor.Google);
    const [model, setModel] = useState("");
    const [editorMode, setEditorMode] = useState(EditorMode.FreeFormat);

    function handleHowdyClick() {
        vscode.postMessage({
            command: "hello",
            text: "Hey there partner! 🤠",
        });
    }

    return (
        <main className="main-container">
            <div className="main-content">
                <Topbar type={editorType} vendor={vendor} model={model}
                    onTypeSelected={t => setEditorType(t)}
                    onVendorSelected={v => setVendor(v)}
                    onModelSelected={m => setModel(m)}
                />
                {editorType == CreateType.Chat &&
                    <ChatEditor mode={editorMode} />
                }
                {editorType == CreateType.Completion &&
                    <CompletionEditor mode={editorMode} />
                }

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
            </div>

        </main>
    );
}

export default PromptEditor;
