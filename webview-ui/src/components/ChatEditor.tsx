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

function ChatEditor() {
    return (
        <div className="main-content">
            chat
            <Tools />
        </div>
    );
}

export default ChatEditor;
