import { VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { ParameterType } from "../providers/Common";

export interface ParameterProps {
    isActive: boolean;
    type: ParameterType;
    value?: string;
}
function Parameter({ isActive, type }: ParameterProps) {
    let value = type.defaultValue || type.minValue;

    return (
        <VSCodeTextField
            value={`${value === undefined ? "" : value}`}
            className="mb-10"
            placeholder="Disabled">
            {type.displayName}
        </VSCodeTextField>
    );
}

export default Parameter;
