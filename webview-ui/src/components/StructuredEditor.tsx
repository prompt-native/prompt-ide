import {
    VSCodeTextArea, VSCodeLink,
    VSCodeDivider
} from "@vscode/webview-ui-toolkit/react";
import './StructuredEditor.css';
import StructuredInputRow from "./StructuredInputRow";


function StructuredEditor() {
    const rowData = [
        { cell1: "INPUT1", cell2: "INPUT2", cell3: "OUTPUT", cell4: "Cell Data" },
        { cell1: "INPUT2", cell2: "Cell Data", cell3: "Cell Data", cell4: "Cell Data" },
        { cell1: "OUTPUT", cell2: "Cell Data", cell3: "Cell Data", cell4: "Cell Data" },
    ];

    return (
        <div className="main-content">
            <span className="label">Structured</span>
            <VSCodeTextArea
                className="col"
                resize="vertical"
                rows={5}
                placeholder="This is the prompt that you will ask LLM">
            </VSCodeTextArea>
            <div className="title-with-actions">
                <span className="label">Examples</span>
                <VSCodeLink>Add example</VSCodeLink>
            </div>
            <VSCodeDivider />
            <div className="title-with-actions">
                <span className="label">Test</span>
                <VSCodeLink>Add field</VSCodeLink>
                <VSCodeLink>Add to example</VSCodeLink>
            </div>
            <VSCodeDivider />
            <StructuredInputRow />
            <StructuredInputRow />
        </div>
    );
}

export default StructuredEditor;
