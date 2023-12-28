import { ChatPrompt, CompletionPrompt } from "prompt-schema";
import { useEffect, useState } from "react";
import "./App.css";
import "./codicon.css";
import ChatEditor from "./components/ChatEditor";
import CompletionEditor from "./components/CompletionEditor";
import Error from "./components/Error";
import Loading from "./components/Loading";
import Sidebar from "./components/Sidebar";
import { loadPrompt } from "./utilities/PromptLoader";
import { vscode } from "./utilities/vscode";

function App() {
    const [prompt, setPrompt] = useState<ChatPrompt | CompletionPrompt | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState("");
    const [variableBinding, setVariableBinding] = useState({});

    const onPromptChanged = (newPrompt: ChatPrompt | CompletionPrompt) => {
        vscode.postMessage({
            type: "sync",
            text: JSON.stringify(newPrompt, null, 2),
        });
        setPrompt(newPrompt);
    };

    const messageListener = (event: MessageEvent<any>) => {
        const message = event.data;

        console.log("Received event:", message);
        if (message.type == "update") {
            const text = message.text;
            try {
                const prompt = loadPrompt(text);
                setErrors([]);
                setPrompt(prompt);
            } catch (error) {
                console.error(error);
                setErrors([`${error}`]);
            }
        }
    };

    useEffect(() => {
        window.addEventListener("message", messageListener);
        return () => {
            window.removeEventListener("message", messageListener);
        };
    }, []);

    if (errors.length > 0) {
        return <Error errors={errors} />;
    }
    if (prompt == null) {
        return <Loading />;
    }

    const mode = prompt.version.split("@")[0];
    return (
        <main className="flex flex-row justify-space-between">
            {mode == "chat" && <ChatEditor prompt={prompt as ChatPrompt} />}
            {mode == "completion" && (
                <CompletionEditor
                    prompt={prompt as CompletionPrompt}
                    onPromptChanged={onPromptChanged}
                    activeTab={activeTab}
                    onTabActive={setActiveTab}
                    onVariableBinded={(name, value) =>
                        setVariableBinding({ ...variableBinding, [name]: value })
                    }
                />
            )}
            <Sidebar prompt={prompt} onPromptChanged={onPromptChanged}></Sidebar>
        </main>
    );
}

export default App;
