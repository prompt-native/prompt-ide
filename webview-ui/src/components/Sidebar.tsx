import {
    VSCodeButton,
    VSCodeDivider,
    VSCodeDropdown,
    VSCodeOption,
    VSCodeRadio,
    VSCodeRadioGroup,
    VSCodeTextField,
} from "@vscode/webview-ui-toolkit/react";
import { ReactElement, ReactNode, useState } from "react";

function Sidebar() {
    return (
        <div className="sidebar">
            <label slot="label">Type</label>
            <VSCodeRadioGroup>
                <VSCodeRadio>Completion</VSCodeRadio>
                <VSCodeRadio>Chat</VSCodeRadio>
            </VSCodeRadioGroup>
            <label slot="label">Engine</label>
            <VSCodeDropdown className="button" position="below">
                <VSCodeOption>text-bison@001</VSCodeOption>
                <VSCodeOption>minimax5.5</VSCodeOption>
            </VSCodeDropdown>
            <VSCodeDivider />
            <VSCodeTextField value="0.1">
                Temperature
                <span slot="end" className="codicon codicon-text-size"></span>
            </VSCodeTextField>
            <VSCodeTextField value="0.95">
                Top P<span slot="end" className="codicon codicon-text-size"></span>
            </VSCodeTextField>
            <VSCodeTextField value="1024">
                Max Tokens
                <span slot="end" className="codicon codicon-text-size"></span>
            </VSCodeTextField>
            <VSCodeDivider />
            <VSCodeButton className="button">Submit</VSCodeButton>
        </div>
    );
}

export default Sidebar;
