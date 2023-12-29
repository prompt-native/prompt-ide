import {
    VSCodeButton,
    VSCodeCheckbox,
    VSCodeDataGrid,
    VSCodeDataGridCell,
    VSCodeDataGridRow,
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
            <VSCodePanels activeid={activeTab} onChange={(e: any) => onTabActive(e.detail.id)}>
                <VSCodePanelTab id="tab-result">RESULT</VSCodePanelTab>
                <VSCodePanelTab id="tab-variables">VARIABLES</VSCodePanelTab>
                <VSCodePanelTab id="tab-context">CONTEXT</VSCodePanelTab>
                <VSCodePanelTab id="tab-samples">SAMPLES</VSCodePanelTab>
                <VSCodePanelTab id="tab-history">HISTORY</VSCodePanelTab>
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
                <VSCodePanelView id="view-samples" className="flex flex-column">
                    <Examples
                        items={prompt.examples || []}
                        onMessageChanged={onExampleChanged}
                        onMessageDeleted={onExampleDeleted}
                        onMessageInserted={onExampleInserted}
                    />
                </VSCodePanelView>
                <VSCodePanelView id="view-history" className="flex-column">
                    <VSCodeCheckbox>Capture history automatically</VSCodeCheckbox>
                    <VSCodeDataGrid gridTemplateColumns="100px 1fr 100px">
                        <VSCodeDataGridRow row-type="header">
                            <VSCodeDataGridCell cell-type="columnheader" grid-column="1">
                                Role
                            </VSCodeDataGridCell>
                            <VSCodeDataGridCell cell-type="columnheader" grid-column="2">
                                Content
                            </VSCodeDataGridCell>
                            <VSCodeDataGridCell cell-type="columnheader" grid-column="3">
                                Operation
                            </VSCodeDataGridCell>
                        </VSCodeDataGridRow>
                        <VSCodeDataGridRow>
                            <VSCodeDataGridCell grid-column="1">User</VSCodeDataGridCell>
                            <VSCodeDataGridCell grid-column="2">你是谁</VSCodeDataGridCell>
                            <VSCodeDataGridCell grid-column="3">
                                <VSCodeButton
                                    appearance="icon"
                                    aria-label="Confirm"
                                    className="danger">
                                    <span className="codicon codicon-close"></span>
                                </VSCodeButton>
                            </VSCodeDataGridCell>
                        </VSCodeDataGridRow>
                        <VSCodeDataGridRow>
                            <VSCodeDataGridCell grid-column="1">Assistant</VSCodeDataGridCell>
                            <VSCodeDataGridCell grid-column="2">
                                我是MM智能助理，是由MiniMax自研的一款大型语言模型，没有调用其他产品的接口.你可以向我提问任何你想了解的问题，我会尽我所能为你解答。
                            </VSCodeDataGridCell>
                            <VSCodeDataGridCell grid-column="3">
                                <VSCodeButton
                                    appearance="icon"
                                    aria-label="Confirm"
                                    className="danger">
                                    <span className="codicon codicon-close"></span>
                                </VSCodeButton>
                            </VSCodeDataGridCell>
                        </VSCodeDataGridRow>
                    </VSCodeDataGrid>
                </VSCodePanelView>
            </VSCodePanels>
        </div>
    );
}

export default ChatEditor;
