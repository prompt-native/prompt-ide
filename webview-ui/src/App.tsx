import { vscode } from "./utilities/vscode";
import {
    VSCodeButton,
    VSCodeDivider,
    VSCodeDropdown,
    VSCodeOption,
    VSCodeProgressRing,
    VSCodeRadio,
    VSCodeRadioGroup,
    VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import "./App.css";
import "./codicon.css";
import { useState, useEffect } from "react";
import CompletionEditor from "./components/CompletionEditor";
import Sidebar from "./components/Sidebar";
import ChatEditor from "./components/ChatEditor";

enum EditorMode {
    chat = "chat",
    completion = "completion",
}

function App() {
    const [mode, setMode] = useState<EditorMode>(EditorMode.chat);
    return (
        <main>
            <div className="main-content">
                {mode == EditorMode.chat && <ChatEditor />}
                {mode == EditorMode.completion && <CompletionEditor />}
            </div>
            <div className="sidebar">
                <label slot="label">Type</label>
                <VSCodeRadioGroup
                    value={mode}
                    onChange={(e) => setMode((e.target as HTMLInputElement).value as EditorMode)}>
                    {Object.keys(EditorMode).map((t) => (
                        <VSCodeRadio value={t} key={t}>
                            {t}
                        </VSCodeRadio>
                    ))}
                </VSCodeRadioGroup>
                <label slot="label">Engine</label>
                <VSCodeDropdown className="button" position="below">
                    <VSCodeOption>text-bison@001</VSCodeOption>
                    <VSCodeOption>minimax5.5</VSCodeOption>
                </VSCodeDropdown>
                <VSCodeDivider />
                <VSCodeTextField value="0.1">
                    Temperature
                    <span slot="end" className="codicon codicon-text-size"></span>
                </VSCodeTextField>
                <VSCodeTextField value="0.95">
                    Top P<span slot="end" className="codicon codicon-text-size"></span>
                </VSCodeTextField>
                <VSCodeTextField value="1024">
                    Max Tokens
                    <span slot="end" className="codicon codicon-text-size"></span>
                </VSCodeTextField>
                <VSCodeDivider />
                <VSCodeButton className="button">Submit</VSCodeButton>
            </div>
        </main>
    );
}

export default App;
