import {
    VSCodeDropdown,
    VSCodeOption
} from "@vscode/webview-ui-toolkit/react";
import './Topbar.css';
import { CreateType, Vendor, getModels } from "../config/models";

interface ModelSelection {
    type: CreateType,
    vendor: Vendor,
    model: string,
    onTypeSelected: (type: CreateType) => any,
    onVendorSelected: (vendor: Vendor) => any,
    onModelSelected: (model: string) => any,
}

function Topbar({ type, vendor, model,
    onTypeSelected, onVendorSelected, onModelSelected }: ModelSelection) {
    return (
        <div className="topbar">
            <span className="label">Type</span>
            <VSCodeDropdown className="button" position="below"
                value={type}
                onChange={(e) => onTypeSelected((e.target as HTMLInputElement).value as CreateType)}>
                {Object.values(CreateType).map(t => <VSCodeOption>{t}</VSCodeOption>)}
            </VSCodeDropdown>
            <span className="label">LLM Provider</span>
            <VSCodeDropdown className="button" position="below"
                value={vendor}
                onChange={(e) => onVendorSelected((e.target as HTMLInputElement).value as Vendor)}>
                {Object.values(Vendor).map(v => <VSCodeOption>{v}</VSCodeOption>)}
            </VSCodeDropdown>
            <span className="label">Model</span>
            <VSCodeDropdown className="button" position="below"
                value={model}
                onChange={(e) => onModelSelected((e.target as HTMLInputElement).value)}>
                {getModels(type, vendor).map(m => <VSCodeOption>{m.name}</VSCodeOption>)}
            </VSCodeDropdown>
        </div>
    );
}

export default Topbar;
