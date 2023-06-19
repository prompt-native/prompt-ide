import { useEffect, useState } from "react";
import "./App.css";
import "./codicon.css";
import ChatEditor from "./components/ChatEditor";
import CompletionEditor from "./components/CompletionEditor";
import ModelSelection from "./components/ModelSelection";
import { CreateType, Vendor } from "./config/models";
import { vscode } from "./utilities/vscode";
import { Completion, Model, YamlCompletionSerializer } from 'prompt-runtime';

enum EditorType {
    Completion = "completion",
    Chat = "chat",
}

function App() {
    const serializer = new YamlCompletionSerializer();

    const [editorType, setEditorType] = useState(CreateType.Completion);
    const [vendor, setVendor] = useState(Vendor.Google);
    const [model, setModel] = useState("");

    const [prompt, setPrompt] = useState(new Completion(new Model(model, vendor), "Hello world!"));
    const onPromptChanged = (new_prompt: Completion) => {
        setPrompt(new_prompt);

        vscode.postMessage({
            command: "text_edited",
            text: serializer.serialize(new_prompt),
        });
    };

    const messageListener = (event: MessageEvent<any>) => {
        const message = event.data;

        console.log('Received event:', event);
        if (message.command === 'initialize' || message.command === 'text_updated') {
            const text = message.text;
            const p = serializer.deserialize(text);
            setPrompt(p);
        }
    };

    useEffect(() => {
        window.addEventListener('message', messageListener);
        return () => {
            window.removeEventListener('message', messageListener);
        };
    }, []);

    return (
        <main>
            {editorType == CreateType.Chat &&
                <ChatEditor />
            }
            {editorType == CreateType.Completion &&
                <CompletionEditor data={prompt} onPromptChanged={onPromptChanged} />
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
