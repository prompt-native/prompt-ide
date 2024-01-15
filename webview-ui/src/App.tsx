import { ChatPrompt, CompletionPrompt, Prompt } from "prompt-schema";
import { useCallback, useEffect, useState } from "react";
import "./App.css";
import "./codicon.css";
import ChatEditor from "./components/ChatEditor";
import CompletionEditor from "./components/CompletionEditor";
import Error from "./components/Error";
import Loading from "./components/Loading";
import Sidebar from "./components/Sidebar";
import ExecuteDelegate from "./providers/ExecuteDelegate";
import Result from "./providers/Result";
import { showError, syncPrompt } from "./utilities/Message";
import { loadPrompt } from "./utilities/PromptLoader";

export class Configuration {
    constructor(
        public openaiKey?: string,
        public minimaxKey?: string,
        public minimaxGroupId?: string
    ) {}
}

function App() {
    const [prompt, setPrompt] = useState<ChatPrompt | CompletionPrompt | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState("");
    const [variableBinding, setVariableBinding] = useState<Map<string, string>>(
        new Map<string, string>()
    );
    const [configuration, setConfiguration] = useState<Configuration | {}>({});

    const onPromptChanged = (newPrompt: ChatPrompt | CompletionPrompt) => {
        syncPrompt(newPrompt);
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
        } else if (message.type == "configuration") {
            const text = message.text;
            try {
                const config = JSON.parse(text);
                setConfiguration(config);
            } catch (error) {
                showError(`${error}`);
            }
        }
    };

    const executePrompt = useCallback(
        (prompt: Prompt): Promise<Result> => {
            const deleagate = new ExecuteDelegate(configuration);
            if (prompt.version.startsWith("chat@"))
                return deleagate.executeChat(prompt as ChatPrompt, variableBinding);
            else if (prompt.version.startsWith("completion@"))
                return deleagate.executeCompletion(prompt as CompletionPrompt, variableBinding);
            else return Promise.reject("Unsupported prompt type");
        },
        [configuration, variableBinding]
    );

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

    console.log(prompt);
    const mode = prompt.version.split("@")[0];
    return (
        <main className="flex flex-row justify-space-between">
            {mode == "chat" && (
                <ChatEditor
                    executePrompt={executePrompt}
                    prompt={prompt as ChatPrompt}
                    onPromptChanged={onPromptChanged}
                    activeTab={activeTab}
                    onTabActive={setActiveTab}
                    onVariableBinded={(name, value) => {
                        const binding = new Map<string, string>([
                            ...variableBinding,
                            [name, value],
                        ]);
                        setVariableBinding(binding);
                    }}
                />
            )}
            {mode == "completion" && (
                <CompletionEditor
                    executePrompt={executePrompt}
                    prompt={prompt as CompletionPrompt}
                    onPromptChanged={onPromptChanged}
                    activeTab={activeTab}
                    onTabActive={setActiveTab}
                    onVariableBinded={(name, value) => {
                        const binding = new Map<string, string>([
                            ...variableBinding,
                            [name, value],
                        ]);
                        setVariableBinding(binding);
                    }}
                />
            )}
            <Sidebar prompt={prompt} onPromptChanged={onPromptChanged}></Sidebar>
        </main>
    );
}

export default App;
