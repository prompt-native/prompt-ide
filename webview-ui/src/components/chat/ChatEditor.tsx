import {
    VSCodeTextArea
} from "@vscode/webview-ui-toolkit/react";
import { ChatProps } from "../../App";
import ConversationRow from "./ConversationRow";
import Collapse from "../Collapse";

function ChatEditor({ data, onPromptChanged }: ChatProps) {
    return (
        <div className="main-content">
            <Collapse title="Context">
                <VSCodeTextArea
                    className="input fill"
                    resize="vertical"
                    rows={3}
                    value={data.context || ""}
                    onChange={(e) => console.log((e.target as HTMLInputElement).value)}
                    placeholder="Enter your prompt here">
                </VSCodeTextArea>
            </Collapse>

            <Collapse title="Examples">
                <div className="fill">
                    <ConversationRow removable />
                </div>
            </Collapse>

            <Collapse title="Conversation">
                <div className="fill">
                    <ConversationRow hasOutput />
                </div>
            </Collapse>
        </div>
    );
}

export default ChatEditor;
