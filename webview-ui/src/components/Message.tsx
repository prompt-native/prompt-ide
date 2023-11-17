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

function Message() {
    return (
        <div className="flex flex-row align-center">
            <label>USER</label>
            <div className="flex flex-row fill">
                <VSCodeTextArea
                    className="input fill"
                    resize="vertical"
                    value="MM智能助理是一款由MiniMax自研的，没有调用其他产品的接口的大型语言模型。MiniMax是一家中国科技公司，一直致力于进行大模型相关的研究。\nMM智能助理是一款由MiniMax自研的，没有调用其他产品的接口的大型语言模型。MiniMax是一家中国科技公司，一直致力于进行大模型相关的研究。"
                    placeholder="Enter your prompt here"></VSCodeTextArea>
            </div>
            <div>
                <VSCodeButton appearance="icon" aria-label="Confirm" className="danger">
                    <span className="codicon codicon-close"></span>
                </VSCodeButton>
            </div>
        </div>
    );
}

export default Message;
