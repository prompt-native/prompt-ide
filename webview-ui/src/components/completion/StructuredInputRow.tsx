import {
    VSCodeButton,
    VSCodeTextField
} from "@vscode/webview-ui-toolkit/react";


interface StructuredInputProps {
    value: string,
    name: string,
    valueDisabled?: boolean,
    onNameChanged: (name: string) => any;
    onValueChanged: (value: string) => any;
    onRemove?: () => any;
}
function StructuredInputRow({ name, value, valueDisabled, onNameChanged, onValueChanged, onRemove }: StructuredInputProps) {
    return (
        <div className="input-row">
            {onRemove &&
                <VSCodeButton appearance="icon">
                    <span className="codicon codicon-close" style={{ color: 'red' }}></span>
                </VSCodeButton>
            }
            <VSCodeTextField className="field-name"
                value={name}
                onChange={(e) => onNameChanged((e.target as HTMLInputElement).value)} />
            <VSCodeTextField className="field-value"
                value={value}
                readOnly={valueDisabled || false}
                onChange={(e) => onValueChanged((e.target as HTMLInputElement).value)} />
        </div>
    );
}

export default StructuredInputRow;
