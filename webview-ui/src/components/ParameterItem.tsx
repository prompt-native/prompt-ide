import { VSCodeLink, VSCodeTextArea, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { ParameterType } from "../providers/EngineProvider";

export interface ParameterItemProps {
    type: ParameterType;
    value: string;
    multiLine?: boolean;
    disabled?: boolean;
    onRemove?: () => void;
    onEnable?: () => void;
    onChange?: (value: string) => void;
}

function ParameterItem({
    onRemove,
    onEnable,
    onChange,
    value,
    type,
    multiLine,
    disabled,
}: ParameterItemProps) {
    if (disabled) {
        return (
            <div className="flex justify-space-between">
                <label>{type.name}</label>
                <VSCodeLink href="#" onClick={onEnable}>
                    Enable
                </VSCodeLink>
            </div>
        );
    }

    let icon;
    if (type.type == "array") icon = "symbol-array";
    else if (type.type == "boolean") icon = "activate-breakpoints";
    else if (type.type == "string") icon = "symbol-string";
    else if (type.type == "number") icon = "arrow-both";
    const title = (
        <div className="flex justify-space-between">
            {type.displayName}
            <VSCodeLink href="#" onClick={onRemove}>
                Remove
            </VSCodeLink>
        </div>
    );
    if (multiLine) {
        return (
            <>
                <VSCodeTextArea
                    resize="vertical"
                    rows={4}
                    value={value}
                    onChange={(e) => onChange && onChange((e.target as HTMLInputElement).value)}>
                    {title}
                </VSCodeTextArea>
            </>
        );
    } else {
        return (
            <VSCodeTextField
                value={value}
                className="mb-10"
                placeholder=""
                onChange={(e) => onChange && onChange((e.target as HTMLInputElement).value)}>
                {title}
                <span slot="end" className={`codicon codicon-${icon}`}></span>
            </VSCodeTextField>
        );
    }
}

export default ParameterItem;
