import {
    VSCodeButton,
    VSCodeCheckbox,
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
import { ReactElement, ReactNode, useState } from "react";
import Tools from "./Tools";
import Message from "./Message";

function ChatEditor() {
    return (
        <div className="main-content">
            <div className="flex flex-column editor">
                <VSCodeTextArea
                    className="input"
                    resize="vertical"
                    rows={10}
                    placeholder="Enter your prompt here"></VSCodeTextArea>
            </div>
            <VSCodePanels activeid="tab-4" aria-label="With Active Tab">
                <VSCodePanelTab id="tab-result">RESULT</VSCodePanelTab>
                <VSCodePanelTab id="tab-context">CONTEXT</VSCodePanelTab>
                <VSCodePanelTab id="tab-samples">SAMPLES</VSCodePanelTab>
                <VSCodePanelTab id="tab-history">HISTORY</VSCodePanelTab>
                <VSCodePanelView id="view-result"></VSCodePanelView>
                <VSCodePanelView id="view-context">
                    <VSCodeTextArea
                        className="input fill"
                        resize="vertical"
                        rows={2}
                        placeholder="Context"></VSCodeTextArea>
                </VSCodePanelView>
                <VSCodePanelView id="view-samples">Output content.</VSCodePanelView>
                <VSCodePanelView id="view-history">
                    <div className="flex flex-column fill">
                        <VSCodeCheckbox>Capture histories automatically</VSCodeCheckbox>
                        <div className="flex flex-column fill">
                            <Message />
                            <Message />
                            <Message />
                        </div>
                    </div>
                </VSCodePanelView>
            </VSCodePanels>
        </div>
    );
}

export default ChatEditor;
