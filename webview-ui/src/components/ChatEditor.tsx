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
import { changeMessage, insertMessage, removeMessage } from "../utilities/PromptUpdator";
import MessageItem from "./MessageItem";
import Variables from "./Variables";

interface ChatEditorProps {
    prompt: ChatPrompt;
    onPromptChanged: (prompt: ChatPrompt) => void;
}

function ChatEditor({ prompt, onPromptChanged }: ChatEditorProps) {
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

    return (
        <div className="flex-grow flex-column pl-10 pr-10">
            <div className="flex flex-column">
                {prompt.messages.map((message, index) => {
                    return (
                        <MessageItem
                            key={index}
                            index={index}
                            message={message}
                            onMessageChanged={onMessageChanged}
                            onMessageDeleted={onMessageDeleted}
                            onMessageInserted={onMessageInserted}
                        />
                    );
                })}
                <VSCodeButton className="button">Submit</VSCodeButton>
            </div>
            <VSCodePanels activeid="tab-4" aria-label="With Active Tab">
                <VSCodePanelTab id="tab-result">RESULT</VSCodePanelTab>
                <VSCodePanelTab id="tab-variables">VARIABLES</VSCodePanelTab>
                <VSCodePanelTab id="tab-context">CONTEXT</VSCodePanelTab>
                <VSCodePanelTab id="tab-samples">SAMPLES</VSCodePanelTab>
                <VSCodePanelTab id="tab-history">HISTORY</VSCodePanelTab>
                <VSCodePanelView id="view-result">
                    <p>No result yet, click submit to execute the prompt.</p>
                </VSCodePanelView>
                <VSCodePanelView id="view-variables">
                    <Variables variables={[]} onVariableBinded={(name, value) => {}}></Variables>
                </VSCodePanelView>
                <VSCodePanelView id="view-context">
                    <VSCodeTextArea
                        className="input fill"
                        resize="vertical"
                        rows={4}
                        placeholder="Set the persona, background, etc of the dialogue"></VSCodeTextArea>
                </VSCodePanelView>
                <VSCodePanelView id="view-samples">Output content.</VSCodePanelView>
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
