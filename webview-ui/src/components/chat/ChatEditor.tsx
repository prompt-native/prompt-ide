import {
    VSCodeButton,
    VSCodeDivider,
    VSCodeTextArea
} from "@vscode/webview-ui-toolkit/react";
import { ChatProps } from "../../App";
import ConversationRow from "./ConversationRow";
import Collapse from "../Collapse";
import { Chat } from "prompt-runtime";

function ChatEditor({ data, onPromptChanged }: ChatProps) {
    const addExample = () => {
        onPromptChanged(Chat.addExample(data));
    };

    const removeExample = (index: number) => {
        onPromptChanged(Chat.removeExample(data, index));
    }

    const removeMessage = (index: number) => {
        onPromptChanged(Chat.removeMessage(data, index));
    }

    const setExample = (index: number, input: string, output: string) => {
        onPromptChanged(Chat.setExample(data, index, input, output));
    }

    const setMessage = (index: number, input: string, output?: string) => {
        onPromptChanged(Chat.setMessage(data, index, input, output));
    }

    const addMessage = () => {
        onPromptChanged(Chat.addMessage(data));
    };

    return (
        <div className="main-content">
            <Collapse title="Context">
                <VSCodeTextArea
                    className="input fill"
                    resize="vertical"
                    rows={3}
                    value={data.context || ""}
                    onChange={(e) => onPromptChanged(Chat.setContext(data, (e.target as HTMLInputElement).value))}
                    placeholder="Enter your prompt here">
                </VSCodeTextArea>
            </Collapse>

            <Collapse title="Examples"
                renderActions={() =>
                    <VSCodeButton appearance="icon" aria-label="Confirm" onClick={addExample}>
                        <span className="codicon codicon-add"></span>
                    </VSCodeButton>}>
                <div className="fill">
                    {data.examples?.map((x, i) =>
                        <div key={`example${i}`} >
                            <ConversationRow
                                removable
                                input={x.input}
                                output={x.output || ''}
                                onInputChange={(text) => setExample(i, text, x.output || '')}
                                onOutputChange={(text) => setExample(i, x.input, text)}
                                onRemove={() => removeExample(i)}
                            />
                            <VSCodeDivider />
                        </div>
                    )}
                </div>
            </Collapse>
            <Collapse title="Coversation"
                renderActions={() =>
                    <VSCodeButton appearance="icon" aria-label="Confirm" onClick={addMessage}>
                        <span className="codicon codicon-add"></span>
                    </VSCodeButton>}>
                <div className="fill">
                    {data.messages.map((x, i) => <div key={`item-${i}`}>
                        <ConversationRow
                            input={x.input}
                            removable={data.messages.length > 1}
                            hasOutput={i === data.messages.length - 1}
                            output={x.output || ''}
                            onInputChange={(text) => setMessage(i, text, x.output || '')}
                            onOutputChange={(text) => setMessage(i, x.input, text)}
                            onRemove={() => removeMessage(i)}
                        />
                        <VSCodeDivider />
                    </div>)}
                </div>
            </Collapse>
        </div>
    );
}

export default ChatEditor;
