import {
    VSCodeTextArea, VSCodeTextField,
    VSCodeLink
} from "@vscode/webview-ui-toolkit/react";

import { useState } from "react";


function StructuredInputRow() {
    const [editing, setEditing] = useState(false);

    const renderNameEditor = () => {
        return (
            <div className="title-with-actions">
                <VSCodeTextField className="title-input" />
                <VSCodeLink onClick={() => setEditing(false)}>OK</VSCodeLink>
                <VSCodeLink onClick={() => setEditing(false)}>Cancel</VSCodeLink>
            </div>
        );
    }
    return (
        <div className="input-row">
            {editing && renderNameEditor()}
            {!editing && (
                <div className="title-with-actions">
                    <span className="label">INPUT</span>
                    <VSCodeLink onClick={() => setEditing(true)}>Change name</VSCodeLink>
                </div>
            )}
            <VSCodeTextArea
                className="input-value"
                resize="vertical"
                rows={1}
                placeholder="This is the prompt that you will ask LLM">
            </VSCodeTextArea>
        </div>
    );
}

export default StructuredInputRow;
