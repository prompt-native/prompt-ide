import {
    VSCodeButton,
    VSCodeTextField
} from "@vscode/webview-ui-toolkit/react";


export interface StructuredColumnProps {
    removable?: boolean,
    labelEditable?: boolean,
    isOutput?: boolean,
    label: string,
    value: string,
    onRemove?: () => any,
    onChange?: (text: string) => any,
    onLabelChange?: (text: string) => any,
}

function StructuredColumn({ removable, labelEditable, isOutput, label, value, onRemove, onChange, onLabelChange }: StructuredColumnProps) {
    return (
        <div className="structured-row">

            {labelEditable &&
                <VSCodeTextField className="field-name"
                    onChange={(e) => onLabelChange!((e.target as HTMLInputElement).value)}
                    value={label}></VSCodeTextField>
            }
            {!labelEditable &&
                <span className="field-name">{label}</span>
            }
            {removable &&
                <VSCodeButton appearance="icon" onClick={onRemove}>
                    <span className="codicon codicon-close" style={{ color: 'red' }}></span>
                </VSCodeButton>
            }
            <VSCodeTextField
                className="field-value"
                readOnly={isOutput}
                onChange={(e) => onChange!((e.target as HTMLInputElement).value)}
                placeholder={isOutput ? "LLM response will be generated here" : undefined}
                value={value}></VSCodeTextField>
        </div>
    );
}

export default StructuredColumn;
