import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";

function variable(name: string) {
    return (
        <div className="flex flex-column fill">
            <VSCodeTextArea
                className="input fill mb-10 "
                resize="vertical"
                rows={2}
                placeholder="Enter variable value here">
                {name}
            </VSCodeTextArea>
        </div>
    );
}
function Variables() {
    return (
        <div className="flex flex-column fill">
            {variable("input")}
            {variable("context")}
        </div>
    );
}

export default Variables;
