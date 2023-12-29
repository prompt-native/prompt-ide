import {
    VSCodeButton,
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import { ChatPrompt, Message } from "prompt-schema";
import { parseChatVariables } from "../utilities/PromptHelper";
import {
    changeExample,
    changeMessage,
    insertExample,
    insertMessage,
    removeExample,
    removeMessage,
    setContext,
} from "../utilities/PromptUpdator";
import Examples from "./Examples";
import Messages from "./Messages";
import Variables, { VariableBinding } from "./Variables";

interface ChatEditorProps {
    prompt: ChatPrompt;
    onPromptChanged: (prompt: ChatPrompt) => void;
    activeTab?: string;
    onTabActive: (id: string) => void;
    onVariableBinded: (name: string, value: string) => void;
}

function ChatEditor({
    prompt,
    onPromptChanged,
    activeTab,
    onTabActive,
    onVariableBinded,
}: ChatEditorProps) {
    const onMessageChanged = (index: number, role: string, content: string) => {
        const newPrompt = changeMessage(prompt, index, new Message(role, undefined, content));
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

    const onExampleChanged = (index: number, role: string, content: string) => {
        const newPrompt = changeExample(prompt, index, new Message(role, undefined, content));
        onPromptChanged(newPrompt as typeof prompt);
    };

    const onTabChange = (e: any) => {
        if (e.detail && e.detail.id) onTabActive(e.detail.id);
    };

    const variables = parseChatVariables(prompt.messages).map((v) => new VariableBinding(v, ""));

    return (
        <div className="flex-grow flex-column pl-10 pr-10">
            <div className="flex flex-column">
                <Messages
                    items={prompt.messages || []}
                    onMessageChanged={onMessageChanged}
                    onMessageDeleted={onMessageDeleted}
                    onMessageInserted={onMessageInserted}
                />
                <VSCodeButton className="button">Submit</VSCodeButton>
            </div>
            <VSCodePanels activeid={activeTab} onChange={onTabChange}>
                <VSCodePanelTab id="tab-result">RESULT</VSCodePanelTab>
                <VSCodePanelTab id="tab-variables">VARIABLES</VSCodePanelTab>
                <VSCodePanelTab id="tab-context">CONTEXT</VSCodePanelTab>
                <VSCodePanelTab id="tab-samples">SAMPLES</VSCodePanelTab>
                <VSCodePanelView id="view-result">
                    <p>No result yet, click submit to execute the prompt.</p>
                </VSCodePanelView>
                <VSCodePanelView id="view-variables">
                    <Variables
                        variables={variables}
                        onVariableBinded={onVariableBinded}></Variables>
                </VSCodePanelView>
                <VSCodePanelView id="view-context">
                    <VSCodeTextArea
                        className="input fill"
                        resize="vertical"
                        rows={4}
                        value={prompt.context || ""}
                        onChange={(e) => onContextChanged((e.target as HTMLInputElement).value)}
                        placeholder="Set the persona, background, etc of the dialogue"></VSCodeTextArea>
                </VSCodePanelView>
                <VSCodePanelView id="view-samples" className="flex-column">
                    <Examples
                        items={prompt.examples || []}
                        onMessageChanged={onExampleChanged}
                        onMessageDeleted={onExampleDeleted}
                        onMessageInserted={onExampleInserted}
                    />
                </VSCodePanelView>
            </VSCodePanels>
        </div>
    );
}

export default ChatEditor;
