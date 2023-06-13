import {
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeTextArea
} from "@vscode/webview-ui-toolkit/react";


function ChatEditor() {
    return (
        <div className="main-content">
            <VSCodePanels aria-label="Default">
                <VSCodePanelTab id="tab-prompt">Prompt</VSCodePanelTab>
                <VSCodePanelTab id="tab-context">Context</VSCodePanelTab>
                <VSCodePanelTab id="tab-examples">Examples</VSCodePanelTab>
                <VSCodePanelView id="view-prompt" className="content">
                    <span className="label">Input</span>
                    <VSCodeTextArea
                        className="col"
                        resize="vertical"
                        rows={1}
                        placeholder="Enter your prompt here">
                    </VSCodeTextArea>
                    <span className="label">Output</span>
                    <VSCodeTextArea
                        className="col"
                        resize="vertical"
                        readOnly
                        rows={1}
                        value="12345"
                        placeholder="Output from LLM">
                    </VSCodeTextArea>
                </VSCodePanelView>
                <VSCodePanelView id="view-context">
                    <VSCodeTextArea
                        className="col"
                        resize="vertical"
                        rows={3}
                        placeholder="You can provide additional context">
                    </VSCodeTextArea>
                </VSCodePanelView>
                <VSCodePanelView id="view-examples">

                </VSCodePanelView>
            </VSCodePanels>
        </div>
    );
}

export default ChatEditor;
