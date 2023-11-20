import {
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";

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
            <VSCodePanels activeid="tab-4" aria-label="With Active Tab">
                <VSCodePanelTab id="tab-result">RESULT</VSCodePanelTab>
                <VSCodePanelTab id="tab-variables">VARIABLES</VSCodePanelTab>
                <VSCodePanelView id="view-result">
                    <p>No result yet, click submit to execute the prompt.</p>
                </VSCodePanelView>
                <VSCodePanelView id="view-variables">
                    <p>No variables yet.</p>
                </VSCodePanelView>
            </VSCodePanels>
        </div>
    );
}

export default CompletionEditor;
