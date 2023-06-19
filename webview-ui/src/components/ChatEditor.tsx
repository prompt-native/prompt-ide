import {
    VSCodeDivider,
    VSCodeTextArea
} from "@vscode/webview-ui-toolkit/react";
import ToolButtons from "./ToolButtons";
import './ChatEditor.css';
import ConversationRow from "./ConversationRow";

function ChatEditor() {
    return (
        <div className="main-content">
            <span className="label">Context</span>
            <VSCodeTextArea
                className="context"
                rows={2}
                placeholder="Enter your context here">
            </VSCodeTextArea>
            <VSCodeDivider />
            <span className="label">Examples</span>
            <ConversationRow />
            <VSCodeDivider />
            <div className="history">

            </div>
            <span className="label">User</span>
            <VSCodeTextArea
                className="context"
                rows={2}
                placeholder="Enter your question here">
            </VSCodeTextArea>
            <ToolButtons />

            <VSCodeDivider />
        </div>
    );
}

export default ChatEditor;
