import {
    VSCodeButton,
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import { ReactElement, ReactNode, useState } from "react";
import Collapse from "./Collapse";
import Tools from "./Tools";

function CompletionEditor() {
    return (
        <div className="main-content">
            <VSCodeTextArea
                className="input"
                resize="vertical"
                rows={10}
                placeholder="Enter your prompt here"></VSCodeTextArea>
            <Tools />
        </div>
    );
}

export default CompletionEditor;
