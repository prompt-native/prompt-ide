import {
    VSCodeCheckbox,
    VSCodePanelTab,
    VSCodePanelView,
    VSCodePanels,
    VSCodeTextArea,
} from "@vscode/webview-ui-toolkit/react";
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
                            <Message content="你是谁" />
                            <Message content="我是MM智能助理，是由MiniMax自研的一款大型语言模型，没有调用其他产品的接口.你可以向我提问任何你想了解的问题，我会尽我所能为你解答。" />
                        </div>
                    </div>
                </VSCodePanelView>
            </VSCodePanels>
        </div>
    );
}

export default ChatEditor;
