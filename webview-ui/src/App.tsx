import { ChatPrompt, CompletionPrompt, parsePrompt } from "prompt-schema";
import { useEffect, useState } from "react";
import "./App.css";
import "./codicon.css";
import ChatEditor from "./components/ChatEditor";
import CompletionEditor from "./components/CompletionEditor";
import Error from "./components/Error";
import Loading from "./components/Loading";
import Sidebar from "./components/Sidebar";
import { InterfaceType, ModelType, ParameterType } from "./providers/Common";
import { MINIMAX_MODELS } from "./providers/Minimax";
import { GPT3_5_MODELS } from "./providers/OpenAI";

const MODEL_GROUPS: { [key: string]: ModelType[] } = {
    "GPT3.5": GPT3_5_MODELS,
    "Minimax": MINIMAX_MODELS,
};

function App() {
    const [group, setGroup] = useState("GPT3.5");
    const [models, setModels] = useState<ModelType[]>([]);
    const [model, setModel] = useState<ModelType | null>(null);
    const [prompt, setPrompt] = useState<ChatPrompt | CompletionPrompt | null>(null);
    const [errors, setErrors] = useState<string[]>([]);

    const messageListener = (event: MessageEvent<any>) => {
        const message = event.data;

        console.log("Received event:", message);
        if (message.type == "update") {
            const text = message.text;
            if (text == "") {
                setPrompt(new ChatPrompt("chat@0.1", GPT3_5_MODELS[0].name, []));
            } else {
                try {
                    const prompt = parsePrompt(text);
                    setErrors([]);
                    setPrompt(prompt);
                } catch (error) {
                    setErrors([`Error: ${error} while parsing: ${text}`]);
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
        const interfaceType =
            prompt instanceof ChatPrompt ? InterfaceType.CHAT : InterfaceType.COMPLETE;
        const availableModes = allModels.filter((m) => m.interfaceType == interfaceType);
        setModels(availableModes);
        if (availableModes.length > 0) {
            setModel(availableModes[0]);
        } else {
            setModel(null);
        }
    }, [prompt, group]);

    let parameters: ParameterType[] = [];
    if (model != null) {
        if (typeof model.parameters == "function") {
            parameters = model.parameters();
        } else {
            parameters = model.parameters;
        }
    }

    if (prompt == null) {
        return <Loading />;
    } else if (errors.length > 0) {
        return <Error errors={errors} />;
    }

    const mode = prompt instanceof ChatPrompt ? "chat" : "completion";
    return (
        <main className="flex flex-row justify-space-between">
            {mode == "chat" && <ChatEditor prompt={prompt as ChatPrompt} />}
            {mode == "completion" && <CompletionEditor prompt={prompt as CompletionPrompt} />}
            <Sidebar prompt={prompt} onPromptChanged={(v) => {}}></Sidebar>
        </main>
    );
}

export default App;
