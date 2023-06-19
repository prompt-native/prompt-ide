import { VSCodeButton, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeTag, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import './ModelControl.css';
import { Completion, Parameter } from "prompt-runtime";
import { useState } from "react";

interface ModelControlProps {
    data: Completion,
    onPromptChanged: (data: Completion) => any;
}

function ModelControl({ data, onPromptChanged }: ModelControlProps) {
    const [addingParameter, setAddingParameter] = useState(false);
    const [parameterName, setParameterName] = useState("");
    const [parameterValue, setParameterValue] = useState("");
    const onConfirm = () => {
        console.log(parameterName, parameterValue);
        if (parameterName !== '' && parameterValue !== '') {
            let copy = data;
            if (!copy.parameters) {
                copy.parameters = [];
            }
            copy.parameters.push(new Parameter(parameterName, parameterValue));
            onPromptChanged(copy);
            setAddingParameter(false);
        }
    };
    const onCancel = () => {
        setAddingParameter(false);
    };
    console.log('~~~', data);
    return (
        <>
            <div className="arguments">
                {data.parameters?.map(parameter => {
                    return <VSCodeTag className="argument-value" key={parameter.name}>
                        {`${parameter.name}=${parameter.value}`}
                        <VSCodeButton appearance="icon">
                            <span slot="start" className="codicon codicon-close"></span>
                        </VSCodeButton>
                    </VSCodeTag>;
                })
                }
                {!addingParameter && <VSCodeLink onClick={() => setAddingParameter(true)}>Add parameter</VSCodeLink>}
            </div>
            {addingParameter &&
                <div className="model-control">
                    <VSCodeDropdown position="below"
                        value={parameterName}
                        onChange={(e) => {
                            setParameterName((e.target as HTMLInputElement).value)
                        }}>
                        <VSCodeOption>Temperature</VSCodeOption>
                    </VSCodeDropdown>
                    <VSCodeTextField className="value-input"
                        value={parameterValue}
                        onChange={(e) => setParameterValue((e.target as HTMLInputElement).value)}
                    />
                    <VSCodeButton className="button" appearance="primary" onClick={onConfirm}>OK</VSCodeButton>
                    <VSCodeButton className="button" appearance="secondary" onClick={onCancel}>Cancel</VSCodeButton>
                </div>
            }
        </>
    );
}

export default ModelControl;
