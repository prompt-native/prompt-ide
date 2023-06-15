import { useEffect, useState } from "react";
import "./App.css";
import "./codicon.css";
import ChatEditor from "./components/ChatEditor";
import CompletionEditor from "./components/CompletionEditor";
import ModelSelection from "./components/ModelSelection";
import { CreateType, Vendor } from "./config/models";
import { Prompt } from "./domain/Prompt";
import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { vscode } from "./utilities/vscode";

enum EditorType {
    Completion = "completion",
    Chat = "chat",
}

function App() {
    const [editorType, setEditorType] = useState(CreateType.Completion);
    const [vendor, setVendor] = useState(Vendor.Google);
    const [model, setModel] = useState("");
    const [prompt, setPrompt] = useState(new Prompt(""));

    const messageListener = (event: MessageEvent<any>) => {
        const message = event.data;

        console.log('Received event:', event);
        if (message.command === 'initialize' || message.command === 'text_updated') {
            const xmlText = message.text;
            setPrompt(new Prompt(xmlText));
        }
    };

    useEffect(() => {
        window.addEventListener('message', messageListener);
        return () => {
            window.removeEventListener('message', messageListener);
        };
    }, []);

    const onTextChanged = (text: string) => {
        vscode.postMessage({
            command: "text_edited",
            text: text,
        });
    };

    return (
        <main>
            <VSCodeTextArea value={prompt.xml} onChange={(e) => onTextChanged((e.target as HTMLInputElement).value)} />
            {editorType == CreateType.Chat &&
                <ChatEditor />
            }
            {editorType == CreateType.Completion &&
                <CompletionEditor />
            }
            <ModelSelection type={editorType} vendor={vendor} model={model}
                onTypeSelected={t => setEditorType(t)}
                onVendorSelected={v => setVendor(v)}
                onModelSelected={m => setModel(m)}
            />
        </main>
    );
}

export default App;
