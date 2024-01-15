import {
    VSCodeButton,
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeProgressRing,
    VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import { ChatPrompt, Message } from "prompt-schema";
import { useState } from "react";
import Result from "../providers/Result";
import { showError } from "../utilities/Message";
import { parseChatVariables } from "../utilities/PromptHelper";
import {
    changeExample,
    changeMessage,
    insertExample,
    insertFunction,
    insertMessage,
    removeExample,
    removeMessage,
    setContext,
} from "../utilities/PromptUpdator";
import Examples from "./Examples";
import Functions from "./Functions";
import Messages from "./Messages";
import Variables, { VariableBinding } from "./Variables";

interface ChatEditorProps {
    prompt: ChatPrompt;
    onPromptChanged: (prompt: ChatPrompt) => void;
    activeTab?: string;
    onTabActive: (id: string) => void;
    onVariableBinded: (name: string, value: string) => void;
    executePrompt: (prompt: ChatPrompt) => Promise<Result>;
}

function ChatEditor({
    prompt,
    onPromptChanged,
    activeTab,
    onTabActive,
    onVariableBinded,
    executePrompt,
}: ChatEditorProps) {
    const [executing, setExecuting] = useState<boolean>(false);
    const [error, setError] = useState<null | string>(null);
    const [result, setResult] = useState<null | Result>();

    const onMessageChanged = (index: number, message: Message) => {
        const newPrompt = changeMessage(prompt, index, message);
        onPromptChanged(newPrompt as typeof prompt);
    };

    const onMessageDeleted = (index: number) => {
        const newPrompt = removeMessage(prompt, index);
        onPromptChanged(newPrompt as typeof prompt);
    };

    const onMessageInserted = (index: number) => {
        const newPrompt = insertMessage(prompt, index);
        onPromptChanged(newPrompt as typeof prompt);
    };

    const onContextChanged = (text: string) => {
        const newPrompt = setContext(prompt, text == "" ? undefined : text);
        onPromptChanged(newPrompt as typeof prompt);
    };

    const onExampleDeleted = (index: number) => {
        const newPrompt = removeExample(prompt, index);
        onPromptChanged(newPrompt as typeof prompt);
    };

    const onExampleInserted = (index: number) => {
        const newPrompt = insertExample(prompt, index);
        onPromptChanged(newPrompt as typeof prompt);
    };

    const onExampleChanged = (index: number, message: Message) => {
        const newPrompt = changeExample(prompt, index, message);
        onPromptChanged(newPrompt as typeof prompt);
    };

    const onFunctionInserted = (index: number) => {
        const newPrompt = insertFunction(prompt, index);
        onPromptChanged(newPrompt as typeof prompt);
    };

    const onTabChange = (e: any) => {
        if (e.detail && e.detail.id) onTabActive(e.detail.id);
    };

    const onSubmit = async () => {
        if (prompt.messages.length == 0) {
            showError("Please add messages first");
            return;
        }
        try {
            setExecuting(true);
            const result = await executePrompt(prompt);
            setResult(result);
            setError(null);
        } catch (err) {
            console.log(err);
            setError(`${err}`);
        } finally {
            setExecuting(false);
        }
    };

    const renderResult = () => {
        if (executing)
            return (
                <div className="padding-10 flex flex-column align-center fill">
                    <VSCodeProgressRing />
                    <p>Requesting...</p>
                </div>
            );
        if (!error && !result) return <p>No result yet, click submit to execute the prompt.</p>;
        if (error) return <p className="danger pre-line">{error}</p>;
        return (
            <div className="mt-10 fill">
                <Messages items={(result?.choices[0].content as Message[]) || []} />
            </div>
        );
    };

    const variables = parseChatVariables(prompt.messages).map((v) => new VariableBinding(v, ""));
    const noMessages = !prompt.messages || prompt.messages.length == 0;

    return (
        <div className="flex-grow flex-column pl-10 pr-10">
            <div className="flex flex-column">
                {noMessages && (
                    <div className="flex  flex-column align-center">
                        <p>No messages found</p>
                        <VSCodeButton className="button mt-10" onClick={() => onMessageInserted(0)}>
                            <span className="codicon codicon-plus"></span>
                            Create message
                        </VSCodeButton>
                    </div>
                )}
                <Messages
                    items={prompt.messages || []}
                    onMessageChanged={onMessageChanged}
                    onMessageDeleted={onMessageDeleted}
                    onMessageInserted={onMessageInserted}
                />
                <VSCodeButton className="button mt-10" disabled={executing} onClick={onSubmit}>
                    Submit
                </VSCodeButton>
            </div>
            <VSCodePanels activeid={activeTab} onChange={onTabChange}>
                <VSCodePanelTab id="tab-result">RESULT</VSCodePanelTab>
                <VSCodePanelTab id="tab-variables">VARIABLES</VSCodePanelTab>
                <VSCodePanelTab id="tab-context">CONTEXT</VSCodePanelTab>
                <VSCodePanelTab id="tab-samples">SAMPLES</VSCodePanelTab>
                <VSCodePanelTab id="tab-functions">FUNCTIONS</VSCodePanelTab>
                <VSCodePanelView id="view-result" className="no-padding">
                    {renderResult()}
                </VSCodePanelView>
                <VSCodePanelView id="view-variables" className="no-padding">
                    <Variables
                        variables={variables}
                        onVariableBinded={onVariableBinded}></Variables>
                </VSCodePanelView>
                <VSCodePanelView id="view-context" className="no-padding">
                    <VSCodeTextArea
                        className="input fill"
                        resize="vertical"
                        rows={4}
                        value={prompt.context || ""}
                        onChange={(e) => onContextChanged((e.target as HTMLInputElement).value)}
                        placeholder="Set the persona, background, etc of the dialogue"></VSCodeTextArea>
                </VSCodePanelView>
                <VSCodePanelView id="view-samples" className="flex-column no-padding">
                    <Examples
                        items={prompt.examples || []}
                        onMessageChanged={onExampleChanged}
                        onMessageDeleted={onExampleDeleted}
                        onMessageInserted={onExampleInserted}
                    />
                </VSCodePanelView>
                <VSCodePanelView id="view-functions" className="flex-column no-padding">
                    <Functions
                        items={prompt.functions || []}
                        onMessageChanged={onExampleChanged}
                        onMessageDeleted={onExampleDeleted}
                        onFunctionInserted={onFunctionInserted}
                    />
                </VSCodePanelView>
            </VSCodePanels>
        </div>
    );
}

export default ChatEditor;
