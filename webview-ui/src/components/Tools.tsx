import {
    VSCodeButton,
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import { ReactElement, ReactNode, useState } from "react";
import Collapse from "./Collapse";

function Tools() {
    return (
        <VSCodePanels activeid="tab-4" aria-label="With Active Tab">
            <VSCodePanelTab id="tab-1">RESULT</VSCodePanelTab>
            <VSCodePanelTab id="tab-2">PROBLEMS</VSCodePanelTab>
            <VSCodePanelTab id="tab-3">OUTPUT</VSCodePanelTab>
            <VSCodePanelView id="view-1">Problems content.</VSCodePanelView>
            <VSCodePanelView id="view-2">Output content.</VSCodePanelView>
            <VSCodePanelView id="view-3">Debug content.</VSCodePanelView>
        </VSCodePanels>
    );
}

export default Tools;
