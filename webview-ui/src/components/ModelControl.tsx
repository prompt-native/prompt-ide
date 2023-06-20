import { VSCodeButton, VSCodeDropdown, VSCodeLink, VSCodeOption, VSCodeTag, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";

import './ModelControl.css';
import { Completion, Parameter } from "prompt-runtime";
import { useState } from "react";

interface ModelControlProps {
    data: Completion,
    onPromptChanged: (data: Completion) => any;
}

function ModelControl({ data, onPromptChanged }: ModelControlProps) {
    console.log('rendering...', data);

    const [addingParameter, setAddingParameter] = useState(false);
    const [parameterName, setParameterName] = useState("temperature");
    const [parameterValue, setParameterValue] = useState("");
    const [error, setError] = useState("");
    const onConfirm = () => {
        if (parameterName !== '' && parameterValue !== '') {
            const parameters = data.parameters?.filter(item => item.name != parameterName) || [];
            parameters.push(new Parameter(parameterName, parameterValue));
            let copy = { ...data, parameters } as Completion;

            onPromptChanged(copy);
            setAddingParameter(false);
            setError("");
        } else {
            setError("Invalid parameter value");
        }
    };

    const onCancel = () => {
        setAddingParameter(false);
    };

    const onDelete = (name: string) => {
        let parameters = data.parameters?.filter(item => item.name != name) || [];
        onPromptChanged({ ...data, parameters } as Completion);
    }

    return (
        <>
            <div className="arguments">
                {data.parameters?.map(parameter => {
                    return <VSCodeTag className="argument-value" key={parameter.name}>
                        {`${parameter.name}=${parameter.value}`}
                        <VSCodeButton appearance="icon">
                            <span slot="start" className="codicon codicon-close" onClick={() => onDelete(parameter.name)}></span>
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
                        <VSCodeOption>temperature</VSCodeOption>
                        <VSCodeOption>top_k</VSCodeOption>
                    </VSCodeDropdown>
                    <VSCodeTextField className="value-input"
                        value={parameterValue}
                        onChange={(e) => setParameterValue((e.target as HTMLInputElement).value)}
                    />
                    <VSCodeButton className="button" appearance="primary" onClick={onConfirm}>OK</VSCodeButton>
                    <VSCodeButton className="button" appearance="secondary" onClick={onCancel}>Cancel</VSCodeButton>
                    {error != '' && <small style={{ color: 'red', marginLeft: 10 }}>{error}</small>}
                </div>
            }
        </>
    );
}

export default ModelControl;
