import {
    VSCodeButton,
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import { ReactElement, ReactNode, useState } from "react";
import Tools from "./Tools";

function CompletionEditor() {
    return (
        <div className="main-content">
            <div className="flex flex-column editor">
                <VSCodeTextArea
                    className="input"
                    resize="vertical"
                    rows={10}
                    placeholder="Enter your prompt here"></VSCodeTextArea>
            </div>
            <Tools />
        </div>
    );
}

export default CompletionEditor;
