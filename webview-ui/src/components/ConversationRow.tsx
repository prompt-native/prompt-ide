import {
    VSCodeTextField
} from "@vscode/webview-ui-toolkit/react";
import './ConversationRow.css';

function ConversationRow() {
    return (
        <>
            <div className="input-row">
                <span className="label field-name">User</span>
                <VSCodeTextField className="field-value" value="output" />
            </div>
            <div className="input-row">
                <span className="label field-name">AI</span>
                <VSCodeTextField className="field-value" value="output" />
            </div>
        </>
    );
}

export default ConversationRow;
