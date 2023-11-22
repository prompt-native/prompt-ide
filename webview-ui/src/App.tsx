import {
    VSCodeDivider,
    VSCodeDropdown,
    VSCodeOption,
    VSCodeProgressRing,
    VSCodeRadio,
    VSCodeRadioGroup,
} from "@vscode/webview-ui-toolkit/react";
import { useEffect, useState } from "react";
import "./App.css";
import "./codicon.css";
import ChatEditor from "./components/ChatEditor";
import CompletionEditor from "./components/CompletionEditor";
import Parameter from "./components/Parameter";
import { InterfaceType, ModelType, ParameterType } from "./providers/Common";
import { MINIMAX_MODELS } from "./providers/Minimax";
import { GPT3_5_MODELS } from "./providers/OpenAI";
import { validateChatSchema } from "./utilities/Schema";

enum EditorMode {
    chat = "chat",
    completion = "completion",
}

enum DocumentState {
    PENDING,
    EMPTY,
    UPDATED,
    ERROR,
}

const MODEL_GROUPS: { [key: string]: ModelType[] } = {
    "GPT3.5": GPT3_5_MODELS,
    "Minimax": MINIMAX_MODELS,
};

function App() {
    const [mode, setMode] = useState<EditorMode>(EditorMode.chat);
    const [group, setGroup] = useState("GPT3.5");
    const [models, setModels] = useState<ModelType[]>([]);
    const [model, setModel] = useState<ModelType | null>(null);
    const [documentState, setDocumentState] = useState<DocumentState>(DocumentState.PENDING);
    const [errors, setErrors] = useState<string[]>([]);
    const [document, setDocument] = useState<string>("");

    const messageListener = (event: MessageEvent<any>) => {
        const message = event.data;

        console.log("Received event:", message);
        if (message.type == "update") {
            const text = message.text;
            setDocument(text);
            if (text == "") {
                setDocumentState(DocumentState.EMPTY);
            } else {
                try {
                    const parsedJson = JSON.parse(text);
                    const errors = validateChatSchema(parsedJson);
                    if (errors) {
                        setErrors(errors);
                        setDocumentState(DocumentState.ERROR);
                    } else setDocumentState(DocumentState.UPDATED);
                } catch (error) {
                    setErrors([`Error: ${error} while parsing: ${text}`]);
                    setDocumentState(DocumentState.ERROR);
                }
            }
        }
    };
    useEffect(() => {
        window.addEventListener("message", messageListener);
        return () => {
            window.removeEventListener("message", messageListener);
        };
    }, []);

    useEffect(() => {
        const allModels = MODEL_GROUPS[group] || [];
        const interfaceType = mode == EditorMode.chat ? InterfaceType.CHAT : InterfaceType.COMPLETE;
        const availableModes = allModels.filter((m) => m.interfaceType == interfaceType);
        setModels(availableModes);
        if (availableModes.length > 0) {
            setModel(availableModes[0]);
        } else {
            setModel(null);
        }
    }, [mode, group]);

    let parameters: ParameterType[] = [];
    if (model != null) {
        if (typeof model.parameters == "function") {
            parameters = model.parameters();
        } else {
            parameters = model.parameters;
        }
    }

    const renderSidebar = () => (
        <div className="sidebar">
            <label slot="label">Type</label>
            <VSCodeRadioGroup
                value={mode}
                className="mb-10"
                onChange={(e) => setMode((e.target as HTMLInputElement).value as EditorMode)}>
                {Object.keys(EditorMode).map((t) => (
                    <VSCodeRadio value={t} key={t}>
                        {t}
                    </VSCodeRadio>
                ))}
            </VSCodeRadioGroup>
            <label slot="label">Group</label>
            <VSCodeDropdown
                className="button mb-10"
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
            <VSCodeDropdown className="button mb-10" position="below" value={model?.name || ""}>
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
            {parameters.map((p) => (
                <Parameter key={p.name} type={p} isActive />
            ))}
        </div>
    );

    if (documentState == DocumentState.PENDING) {
        return (
            <main className="flex flex-column align-center">
                <p>Loading document...</p>
                <VSCodeProgressRing />
            </main>
        );
    } else if (documentState == DocumentState.ERROR) {
        return (
            <main className="flex flex-column align-center">
                <p>
                    Failed to validate the schema, please fix the json content manually and try
                    again.
                </p>
                {errors.map((error) => (
                    <p style={{ color: "red" }}>{error}</p>
                ))}
            </main>
        );
    }
    return (
        <main>
            <div className="main-content">
                {mode == EditorMode.chat && <ChatEditor />}
                {mode == EditorMode.completion && <CompletionEditor />}
            </div>
            {renderSidebar()}
        </main>
    );
}

export default App;
