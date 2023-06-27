import {
    VSCodeDropdown,
    VSCodeOption
} from "@vscode/webview-ui-toolkit/react";
import './ModelSelection.css';
import { Vendor, getModels } from "../config/models";
import { Type } from "prompt-runtime";

interface ModelSelection {
    type: Type,
    vendor: Vendor,
    model: string,
    onTypeSelected: (type: Type) => any,
    onVendorSelected: (vendor: Vendor) => any,
    onModelSelected: (model: string) => any,
}

function ModelSelection({ type, vendor, model,
    onTypeSelected, onVendorSelected, onModelSelected }: ModelSelection) {
    return (
        <div className="selection-bar">
            <VSCodeDropdown className="button" position="below"
                value={type}
                onChange={(e) => onTypeSelected((e.target as HTMLInputElement).value as Type)}>
                {Object.values(Type).map(t => <VSCodeOption key={t}>{t}</VSCodeOption>)}
            </VSCodeDropdown>
            <VSCodeDropdown className="button" position="below"
                value={vendor}
                onChange={(e) => onVendorSelected((e.target as HTMLInputElement).value as Vendor)}>
                {Object.values(Vendor).map(v => <VSCodeOption key={v}>{v}</VSCodeOption>)}
            </VSCodeDropdown>
            <VSCodeDropdown className="button" position="below"
                value={model}
                onChange={(e) => onModelSelected((e.target as HTMLInputElement).value)}>
                {getModels(type, vendor).map(name => <VSCodeOption key={name}>{name}</VSCodeOption>)}
            </VSCodeDropdown>
        </div>
    );
}

export default ModelSelection;
