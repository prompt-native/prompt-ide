import {
    VSCodeButton,
    VSCodeDivider,
    VSCodeDropdown,
    VSCodeOption,
    VSCodeRadio,
    VSCodeRadioGroup,
    VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import { useEffect, useState } from "react";
import "./App.css";
import "./codicon.css";
import ChatEditor from "./components/ChatEditor";
import CompletionEditor from "./components/CompletionEditor";
import { InterfaceType, ModelType } from "./providers/Common";
import { MINIMAX_MODELS } from "./providers/Minimax";
import { GPT3_5_MODELS } from "./providers/OpenAI";

enum EditorMode {
    chat = "chat",
    completion = "completion",
}

const MODEL_GROUPS: { [key: string]: ModelType[] } = {
    "GPT3.5": GPT3_5_MODELS,
    "Minimax": MINIMAX_MODELS,
};

function App() {
    const [mode, setMode] = useState<EditorMode>(EditorMode.chat);
    const [group, setGroup] = useState("GPT3.5");
    const [models, setModels] = useState<ModelType[]>([]);
    const [model, setModel] = useState<string>("");

    useEffect(() => {
        const allModels = MODEL_GROUPS[group] || [];
        const interfaceType = mode == EditorMode.chat ? InterfaceType.CHAT : InterfaceType.COMPLETE;
        const availableModes = allModels.filter((m) => m.interfaceType == interfaceType);
        setModels(availableModes);
        if (availableModes.length > 0) setModel(availableModes[0].name);
        else {
            setModel("");
        }
    }, [mode, group]);

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
                <label slot="label">Group</label>
                <VSCodeDropdown
                    className="button"
                    position="below"
                    value={group}
                    onChange={(e) => setGroup((e.target as HTMLInputElement).value)}>
                    {Object.keys(MODEL_GROUPS).map((t) => (
                        <VSCodeOption value={t} key={t}>
                            {t}
                        </VSCodeOption>
                    ))}
                </VSCodeDropdown>
                <label slot="label">Model</label>
                <VSCodeDropdown className="button" position="below">
                    {models.map((t) => (
                        <VSCodeOption value={t.name} key={t.name}>
                            {t.name}
                        </VSCodeOption>
                    ))}
                    {models.length == 0 && (
                        <VSCodeOption value="" key="">
                            (No available model in this mode)
                        </VSCodeOption>
                    )}
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
