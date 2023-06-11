import { VSCodeButton, VSCodeDropdown, VSCodeOption } from "@vscode/webview-ui-toolkit/react";
import { useState } from "react";
import "./App.css";
import ChatEditor from "./components/ChatEditor";
import CompletionEditor, { EditorMode } from "./components/CompletionEditor";
import Topbar from "./components/Topbar";
import { CreateType, Vendor } from "./config/models";
import { vscode } from "./utilities/vscode";

enum EditorType {
    Completion = "completion",
    Chat = "chat",
}

function App() {
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
        <main>
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
        </main>
    );
}

export default App;
