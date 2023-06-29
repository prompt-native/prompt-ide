import { useEffect, useState } from "react";
import "./App.css";
import "./codicon.css";
import { Vendor, getModels } from 'prompt-runtime';
import { vscode } from "./utilities/vscode";
import { Chat, Completion, Model, Type, PromptToYaml } from 'prompt-runtime';
import { ExampleColumn } from "prompt-runtime/lib/domain/Prompt";
import ChatEditor from "./components/chat/ChatEditor";
import { VSCodeButton, VSCodeDivider, VSCodeDropdown, VSCodeOption, VSCodeRadio, VSCodeRadioGroup, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import FreeEditor from "./components/completion/FreeEditor";
import StructuredEditor from "./components/completion/StructuredEditor";
import { PATAMETERS, ParameterDef } from "prompt-runtime/lib/config/Config";

export interface CompletionProps {
    data: Completion,
    onPromptChanged: (data: Completion) => any;
}

export interface ChatProps {
    data: Chat,
    onPromptChanged: (data: Chat) => any;
}

function App() {
    const [prompt, setPrompt] = useState<Chat | Completion>(
        new Completion(new Model(Vendor.Google, "code-bison"), "Hello world!", [], [
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

    const changeType = (type: Type) => {
        if (type !== prompt.type) {
            let newPrompt: Completion | Chat;
            if (type == Type.chat) {
                newPrompt = Completion.toChat(prompt as Completion);
            } else if (type == Type.completion) {
                newPrompt = Chat.toCompletion(prompt as Chat);
            } else {
                throw new Error("Unsupported prompt type");
            }
            onPromptChanged(newPrompt);
        }
    };

    const changeVendor = (vendor: Vendor) => {
        const models = getModels(prompt.type, vendor);
        onPromptChanged({
            ...prompt, model: {
                vendor,
                model: models.length > 0 ? models[0] : "",
            }
        });
    };

    const changeModel = (model: string) => {
        onPromptChanged({
            ...prompt, model: {
                vendor: prompt.model.vendor,
                model,
            }
        });
    };

    const switchToStructured = () => {
        onPromptChanged(Completion.toStructured(prompt as Completion));
    };

    const switchToFreeFormat = () => {
        onPromptChanged(Completion.toFreeFormat(prompt as Completion));
    };

    useEffect(() => {
        window.addEventListener('message', messageListener);
        return () => {
            window.removeEventListener('message', messageListener);
        };
    }, []);

    const isStructuredMode = prompt.type == Type.completion && prompt.examples;
    const isFreeMode = prompt.type == Type.completion && !prompt.examples;

    const models = getModels(prompt.type, prompt.model.vendor as Vendor);
    const parameters = PATAMETERS[prompt.model.model];

    console.log(parameters);

    const renderParameter = (parameter: ParameterDef) => {
        const existingParameter = prompt.parameters?.find(p => p.name === parameter.name);
        const value = existingParameter?.value || parameter.defaultValue;

        return (
            <VSCodeTextField key={`${prompt.model.model}-${parameter.name}`} value={`${value}`}>
                {parameter.displayName}
                <span slot="end" className="codicon codicon-text-size"></span>
            </VSCodeTextField>
        );
    };

    return (
        <main>
            {prompt.type == Type.chat &&
                <ChatEditor data={prompt as Chat} onPromptChanged={onPromptChanged} />
            }
            {isStructuredMode &&
                <StructuredEditor data={prompt as Completion} onPromptChanged={onPromptChanged} />
            }
            {isFreeMode &&
                <FreeEditor data={prompt as Completion} onPromptChanged={onPromptChanged} />
            }
            <div className="sidebar">
                <VSCodeRadioGroup
                    value={prompt.type}
                    onChange={(e) => changeType((e.target as HTMLInputElement).value as Type)}>
                    <label slot="label">Prompt Type</label>
                    {Object.keys(Type).map(t => <VSCodeRadio value={t} key={t} >{t}</VSCodeRadio>)}
                </VSCodeRadioGroup>
                <VSCodeDivider />
                <label slot="label">Provider</label>
                <VSCodeDropdown className="button" position="below"
                    value={prompt.model.vendor}
                    onChange={(e) => changeVendor((e.target as HTMLInputElement).value as Vendor)}
                >
                    {Object.values(Vendor).map(t => <VSCodeOption key={t} value={t}>{t}</VSCodeOption>)}
                </VSCodeDropdown>

                <label slot="label">Model</label>
                {models.length > 0 &&
                    <VSCodeDropdown className="button" position="below"
                        value={prompt.model.model}
                        onChange={(e) => changeModel((e.target as HTMLInputElement).value as Vendor)}>
                        {models.map(model =>
                            <VSCodeOption key={model}>{model}</VSCodeOption>)}
                    </VSCodeDropdown>
                }
                {models.length == 0 && <span className="danger">No model available!</span>}

                <VSCodeDivider />
                {parameters.map(p => renderParameter(p))}

                <VSCodeDivider />
                <VSCodeButton className="button">Submit</VSCodeButton>
                {isFreeMode &&
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
