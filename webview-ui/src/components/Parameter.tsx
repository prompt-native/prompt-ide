import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { ParameterType } from "../providers/Common";

export interface ParameterProps {
    isActive: boolean;
    type: ParameterType;
    value?: string;
}
function Parameter({ isActive, type }: ParameterProps) {
    let value = type.defaultValue || type.minValue;
    let icon;
    if (type.type == "array") icon = "symbol-array";
    else if (type.type == "boolean") icon = "activate-breakpoints";
    else if (type.type == "string") icon = "symbol-string";
    else if (type.type == "number") icon = "arrow-both";
    return (
        <VSCodeTextField
            value={`${value === undefined ? "" : value}`}
            className="mb-10"
            placeholder="Disabled">
            {type.displayName}
            <span slot="end" className={`codicon codicon-${icon}`}></span>
        </VSCodeTextField>
    );
}

export default Parameter;
