import { useEffect, useState } from "react";
import "./App.css";
import "./codicon.css";
import { Vendor } from "./config/models";
import { vscode } from "./utilities/vscode";
import { Chat, Completion, Model, Type, PromptToYaml } from 'prompt-runtime';
import { ExampleColumn } from "prompt-runtime/lib/domain/Prompt";
import ChatEditor from "./components/ChatEditor";
import { VSCodeButton, VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import FreeEditor from "./components/completion/FreeEditor";
import StructuredEditor from "./components/completion/StructuredEditor";

export interface CompletionProps {
    data: Completion,
    onPromptChanged: (data: Completion) => any;
}

function App() {
    const [vendor, setVendor] = useState(Vendor.Google);
    const [model, setModel] = useState("text-bison");
    const [prompt, setPrompt] = useState<Chat | Completion>(
        new Completion(new Model(model, vendor), "Hello world!", [], [
            new ExampleColumn("input", ["a"], "x"),
            new ExampleColumn("output", ["b"])
        ]));

    const serializer = new PromptToYaml();
    const onPromptChanged = (new_prompt: Completion | Chat) => {
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

    const onCreateTypeChange = (type: Type) => {
        if (type !== prompt.type) {
            let newPrompt: Completion | Chat;
            if (type == Type.chat) {
                newPrompt = (prompt as Completion).toChat();
            } else if (type == Type.completion) {
                newPrompt = (prompt as Chat).toCompletion();
            } else {
                throw new Error("Unsupported prompt type");
            }
            onPromptChanged(newPrompt);
        }
    };

    const switchToStructured = () => {
        const p = { ...prompt } as Completion;
        p.examples = [new ExampleColumn("input", ["a", "b"], "x"), new ExampleColumn("output", ["c", "d"])];
        onPromptChanged(p);
    };

    const switchToFreeFormat = () => {
        const p = { ...prompt } as Completion;
        p.examples = undefined;
        onPromptChanged(p);
    };

    useEffect(() => {
        window.addEventListener('message', messageListener);
        return () => {
            window.removeEventListener('message', messageListener);
        };
    }, []);

    const isStructuredMode = prompt.type == Type.completion && prompt.examples;
    const isFreeMode = prompt.type == Type.completion && !prompt.examples;

    return (
        <main>
            <div className="content">
                {prompt.type == Type.chat &&
                    <ChatEditor />
                }
                {isStructuredMode &&
                    <StructuredEditor data={prompt as Completion} onPromptChanged={onPromptChanged} />
                }
                {isFreeMode &&
                    <FreeEditor data={prompt as Completion} onPromptChanged={onPromptChanged} />
                }
            </div>
            <div className="sidebar">
                <VSCodeRadioGroup>
                    <label slot="label">Mode</label>
                    <VSCodeRadio>Chat</VSCodeRadio>
                    <VSCodeRadio>Completion</VSCodeRadio>
                    <VSCodeRadio>Image</VSCodeRadio>
                </VSCodeRadioGroup>
                <VSCodeDivider />
                <label slot="label">Provider</label>
                <VSCodeDropdown className="button" position="below">
                    <VSCodeOption>Google</VSCodeOption>
                    <VSCodeOption>OpenAI</VSCodeOption>
                </VSCodeDropdown>

                <label slot="label">Model</label>
                <VSCodeDropdown className="button" position="below">
                    <VSCodeOption>text-bison</VSCodeOption>
                    <VSCodeOption>code-bison</VSCodeOption>
                </VSCodeDropdown>
                <VSCodeDivider />
                <VSCodeTextField>
                    Temperature
                    <span slot="end" className="codicon codicon-text-size"></span>
                </VSCodeTextField>
                <VSCodeTextField>
                    Maximum Length
                    <span slot="end" className="codicon codicon-text-size"></span>
                </VSCodeTextField>
                <VSCodeTextField>
                    Frequency penalty
                    <span slot="end" className="codicon codicon-text-size"></span>
                </VSCodeTextField>
                <VSCodeTextField>
                    Frequency penalty
                    <span slot="end" className="codicon codicon-text-size"></span>
                </VSCodeTextField>
                <VSCodeDivider />
                <VSCodeButton className="button">Submit</VSCodeButton>
                {!isStructuredMode &&
                    <VSCodeButton className="button"
                        appearance="secondary"
                        onClick={switchToStructured}>Switch to structured</VSCodeButton>
                }
                {isStructuredMode &&
                    <VSCodeButton className="button"
                        appearance="secondary"
                        onClick={switchToFreeFormat}>Switch to free format</VSCodeButton>
                }
            </div>
        </main>
    );
}

export default App;
