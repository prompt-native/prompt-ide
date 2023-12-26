import {
    VSCodeDropdown,
    VSCodeOption,
    VSCodeRadio,
    VSCodeRadioGroup,
} from "@vscode/webview-ui-toolkit/react";
import { ChatPrompt, CompletionPrompt } from "prompt-schema";
import { MODEL_GROUPS } from "../config/Constants";
import { InterfaceType, ParameterType } from "../providers/Common";
import { findModel, getAvailableModels } from "../utilities/PromptLoader";
import { createDefaultPrompt, resetModel } from "../utilities/PromptUpdator";
import Collapse from "./Collapse";
import Parameter from "./Parameter";

interface SidebarProps {
    prompt: ChatPrompt | CompletionPrompt;
    onPromptChanged: (prompt: ChatPrompt | CompletionPrompt) => void;
}

function getMode(type: InterfaceType): string {
    if (type == InterfaceType.CHAT) return "chat";
    if (type == InterfaceType.COMPLETION) return "completion";
    throw new Error("Unsupported type" + type);
}
function Sidebar({ prompt, onPromptChanged }: SidebarProps) {
    const [group, model] = findModel(prompt.engine);
    const availableModels = getAvailableModels(group, model.interfaceType);
    const type = model.interfaceType;

    let parameters: ParameterType[] = [];
    if (model != null) {
        if (typeof model.parameters == "function") {
            parameters = model.parameters();
        } else {
            parameters = model.parameters;
        }
    }

    const changeType = (type: string) => {
        if (type == "chat") prompt = createDefaultPrompt(InterfaceType.CHAT);
        else if (type == "completion") prompt = createDefaultPrompt(InterfaceType.COMPLETION);
        onPromptChanged(prompt);
    };

    const changeGroup = (group: string) => {
        const availableModels = getAvailableModels(group, type);
        const model = availableModels[0];
        const newPrompt = resetModel(prompt, model);
        onPromptChanged(newPrompt as typeof prompt);
    };

    return (
        <div className="ml-10 pr-10 flex-shrink-0 y-scroll-auto full-height width-200 flex flex-column">
            <label>Type</label>
            <VSCodeRadioGroup
                value={getMode(type)}
                className="mb-10"
                onChange={(e) => changeType((e.target as HTMLInputElement).value)}>
                <VSCodeRadio value="chat">Chat</VSCodeRadio>
                <VSCodeRadio value="completion">Completion</VSCodeRadio>
            </VSCodeRadioGroup>
            <label>Group</label>
            <VSCodeDropdown
                className="button mb-10"
                position="below"
                value={group}
                onChange={(e) => changeGroup((e.target as HTMLInputElement).value)}>
                {Object.keys(MODEL_GROUPS).map((t) => (
                    <VSCodeOption value={t} key={t}>
                        {t}
                    </VSCodeOption>
                ))}
            </VSCodeDropdown>
            <label>Model</label>
            <VSCodeDropdown className="button mb-10" position="below" value={model?.name || ""}>
                {availableModels.map((t) => (
                    <VSCodeOption value={t.name} key={t.name}>
                        {t.name}
                    </VSCodeOption>
                ))}
                {availableModels.length == 0 && (
                    <VSCodeOption value="" key="">
                        (No available model in this mode)
                    </VSCodeOption>
                )}
            </VSCodeDropdown>
            {parameters.map((p) => (
                <Parameter
                    key={p.name}
                    type={p}
                    isActive
                    multiLine={(p.maxLength && p.maxLength > 100) || false}
                />
            ))}
            <Collapse
                title="Other parameters"
                children={parameters.map((p) => (
                    <Parameter
                        key={p.name}
                        type={p}
                        isActive
                        disabled
                        multiLine={(p.maxLength && p.maxLength > 100) || false}
                    />
                ))}></Collapse>
        </div>
    );
}

export default Sidebar;
