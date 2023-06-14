import {
    VSCodeTextField
} from "@vscode/webview-ui-toolkit/react";

import { useState } from "react";

function StructuredInputRow() {
    const [editing, setEditing] = useState(false);

    return (
        <div className="input-row">
            <VSCodeTextField className="field-name" value="input" />
            <VSCodeTextField className="field-value" value="output" />
        </div>
    );
}

export default StructuredInputRow;
