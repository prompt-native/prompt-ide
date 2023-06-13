import { VSCodeButton, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeTag, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import './ModelControl.css';

function ModelControl() {
    return (
        <>

            <div className="arguments">
                <VSCodeTag className="argument-value">
                    temperature=0.9
                    <VSCodeButton appearance="icon">
                        <span slot="start" className="codicon codicon-close"></span>
                    </VSCodeButton>
                </VSCodeTag>
                <VSCodeLink>Add argument</VSCodeLink>
            </div>
            <div className="model-control">
                <VSCodeDropdown position="below">
                    <VSCodeOption>Temperature</VSCodeOption>
                </VSCodeDropdown>
                <VSCodeTextField className="value-input" />
                <VSCodeButton className="button" appearance="primary">OK</VSCodeButton>
                <VSCodeButton className="button" appearance="secondary">Cancel</VSCodeButton>
            </div>
        </>

    );
}

export default ModelControl;
