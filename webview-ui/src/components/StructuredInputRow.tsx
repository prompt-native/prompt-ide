import {
    VSCodeTextField,
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
            <VSCodeTextField className="field-name" value="input" />
            <VSCodeTextField className="field-value" value="output" />
        </div>
    );
}

export default StructuredInputRow;
