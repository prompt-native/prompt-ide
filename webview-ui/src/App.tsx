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

const onPromptChanged = (new_prompt: ChatPrompt | CompletionPrompt) => {
    vscode.postMessage({
        command: "prompt-sync",
        text: new_prompt,
    });
};

function App() {
    const [prompt, setPrompt] = useState<ChatPrompt | CompletionPrompt | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

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

    const mode = prompt instanceof ChatPrompt ? "chat" : "completion";
    return (
        <main className="flex flex-row justify-space-between">
            {mode == "chat" && <ChatEditor prompt={prompt as ChatPrompt} />}
            {mode == "completion" && <CompletionEditor prompt={prompt as CompletionPrompt} />}
            <Sidebar prompt={prompt} onPromptChanged={onPromptChanged}></Sidebar>
        </main>
    );
}

export default App;
