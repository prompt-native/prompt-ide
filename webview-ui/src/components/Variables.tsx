import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";

function variable(name: string) {
    return (
        <div className="flex flex-column fill">
            <VSCodeTextArea
                className="input fill mb-10 "
                resize="vertical"
                rows={2}
                placeholder="Enter variable value here">
                {name}
            </VSCodeTextArea>
        </div>
    );
}

export class VariableBinding {
    constructor(public name: string, public value: string) {}
}

interface VariablesProps {
    variables: VariableBinding[];
    onVariableBinded: (name: string, value: string) => void;
}

function Variables({ variables, onVariableBinded }: VariablesProps) {
    return (
        <div className="flex flex-column fill">
            {variables.map((v) => (
                <div className="flex flex-column fill" key={v.name}>
                    <VSCodeTextArea
                        className="input fill mb-10 "
                        resize="vertical"
                        rows={1}
                        placeholder="Enter variable value here"
                        onChange={(e) =>
                            onVariableBinded(v.name, (e.target as HTMLInputElement).value)
                        }>
                        {v.name}
                    </VSCodeTextArea>
                </div>
            ))}
        </div>
    );
}

export default Variables;
