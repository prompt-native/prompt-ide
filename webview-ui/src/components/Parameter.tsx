import { VSCodeLink, VSCodeTextArea, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { ParameterType } from "../providers/Common";

export interface ParameterProps {
    isActive: boolean;
    type: ParameterType;
    value?: string;
    multiLine?: boolean;
    disabled?: boolean;
}
function Parameter({ isActive, type, multiLine, disabled }: ParameterProps) {
    if (disabled) {
        return (
            <div className="flex justify-space-between">
                <label>{type.name}</label>
                <VSCodeLink href="#">Enable</VSCodeLink>
            </div>
        );
    }

    let value = type.defaultValue || type.minValue;
    let icon;
    if (type.type == "array") icon = "symbol-array";
    else if (type.type == "boolean") icon = "activate-breakpoints";
    else if (type.type == "string") icon = "symbol-string";
    else if (type.type == "number") icon = "arrow-both";
    const title = (
        <div className="flex justify-space-between">
            {type.displayName}
            <VSCodeLink href="#">Remove</VSCodeLink>
        </div>
    );
    if (multiLine) {
        return (
            <>
                <VSCodeTextArea resize="vertical" rows={4} initialValue={value as string}>
                    {title}
                </VSCodeTextArea>
            </>
        );
    } else {
        return (
            <VSCodeTextField
                value={`${value === undefined ? "" : value}`}
                className="mb-10"
                placeholder="Disabled">
                {title}
                <span slot="end" className={`codicon codicon-${icon}`}></span>
            </VSCodeTextField>
        );
    }
}

export default Parameter;
