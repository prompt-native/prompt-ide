import { useEffect, useState } from "react";
import "./App.css";
import "./codicon.css";
import ChatEditor from "./components/ChatEditor";
import CompletionEditor from "./components/CompletionEditor";
import ModelSelection from "./components/ModelSelection";
import { CreateType, Vendor } from "./config/models";

enum EditorType {
    Completion = "completion",
    Chat = "chat",
}

function App() {
    const [editorType, setEditorType] = useState(CreateType.Completion);
    const [vendor, setVendor] = useState(Vendor.Google);
    const [model, setModel] = useState("");

    const messageListener = (event: MessageEvent<any>) => {
        const message = event.data;

        if (message.command === 'initialize') {
            const xmlText = message.text;
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
