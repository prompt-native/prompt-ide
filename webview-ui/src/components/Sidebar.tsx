import {
    VSCodeDropdown,
    VSCodeOption,
    VSCodeRadio,
    VSCodeRadioGroup,
} from "@vscode/webview-ui-toolkit/react";
import { ChatPrompt, CompletionPrompt, Parameter } from "prompt-schema";
import { InterfaceType, ModelType, ParameterType } from "../providers/Common";
import { findModel, getAvailableGroups, getAvailableModels } from "../utilities/PromptLoader";
import {
    changeParameter,
    createDefaultPrompt,
    enableParameter,
    getModelParameters,
    removeParameter,
    resetModel,
} from "../utilities/PromptUpdator";
import Collapse from "./Collapse";
import ParameterItem from "./ParameterItem";

interface SidebarProps {
    prompt: ChatPrompt | CompletionPrompt;
    onPromptChanged: (prompt: ChatPrompt | CompletionPrompt) => void;
}

function getMode(type: InterfaceType): string {
    if (type == InterfaceType.CHAT) return "chat";
    if (type == InterfaceType.COMPLETION) return "completion";
    throw new Error("Unsupported type" + type);
}

class ParameterProps {
    constructor(public type: ParameterType, public value?: Parameter) {}
}

function buildParameterProps(model: ModelType, parameters: Parameter[]): ParameterProps[] {
    let availableParameters: ParameterType[] = getModelParameters(model);
    return availableParameters.map((p) => {
        const value = parameters.filter((v) => p.name == v.name);
        if (value.length > 1) throw new Error("Duplicated parameter:" + p.name);
        return new ParameterProps(p, value.length == 1 ? value[0] : undefined);
    });
}

function Sidebar({ prompt, onPromptChanged }: SidebarProps) {
    const [group, model] = findModel(prompt.engine);
    const groups = getAvailableGroups(model.interfaceType);
    const availableModels = getAvailableModels(group, model.interfaceType);
    const type = model.interfaceType;
    const mode = getMode(type);

    const parameterProps = buildParameterProps(model, prompt.parameters || []);
    console.log(parameterProps);

    const onTypeChanged = (selectedMode: string) => {
        if (selectedMode != mode) {
            if (selectedMode == "chat") prompt = createDefaultPrompt(InterfaceType.CHAT);
            else if (selectedMode == "completion")
                prompt = createDefaultPrompt(InterfaceType.COMPLETION);
            onPromptChanged(prompt);
        }
    };

    const onGroupChanged = (selectedGroup: string) => {
        if (selectedGroup != group) {
            const availableModels = getAvailableModels(selectedGroup, type);
            const model = availableModels[0];
            const newPrompt = resetModel(prompt, model.name);
            onPromptChanged(newPrompt as typeof prompt);
        }
    };

    const onParameterRemoved = (name: string) => {
        const newPrompt = removeParameter(prompt, name);
        onPromptChanged(newPrompt as typeof prompt);
    };

    const onParameterEnabled = (name: string) => {
        const newPrompt = enableParameter(prompt, name);
        onPromptChanged(newPrompt as typeof prompt);
    };

    const onParameterChanged = (name: string, value: string) => {
        const newPrompt = changeParameter(prompt, name, value);
        onPromptChanged(newPrompt as typeof prompt);
    };

    return (
        <div className="ml-10 pr-10 flex-shrink-0 y-scroll-auto full-height width-200 flex flex-column">
            <label>Type</label>
            <VSCodeRadioGroup
                value={mode}
                className="mb-10"
                onChange={(e) => onTypeChanged((e.target as HTMLInputElement).value)}>
                <VSCodeRadio value="chat">Chat</VSCodeRadio>
                <VSCodeRadio value="completion">Completion</VSCodeRadio>
            </VSCodeRadioGroup>
            <label>Group</label>
            <VSCodeDropdown
                className="button mb-10"
                position="below"
                value={group}
                onChange={(e) => onGroupChanged((e.target as HTMLInputElement).value)}>
                {groups.map((t) => (
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
            {parameterProps
                .filter((p) => p.value != undefined)
                .map((p) => (
                    <ParameterItem
                        key={p.type.name}
                        type={p.type}
                        value={`${p.value?.value}`}
                        onChange={(value: string) => onParameterChanged(p.type.name, value)}
                        onRemove={() => onParameterRemoved(p.type.name)}
                        multiLine={(p.type.maxLength && p.type.maxLength > 100) || false}
                    />
                ))}
            <Collapse
                title="Parameters"
                children={parameterProps
                    .filter((p) => !p.value)
                    .map((p) => (
                        <ParameterItem
                            key={p.type.name}
                            type={p.type}
                            value=""
                            disabled
                            onEnable={() => onParameterEnabled(p.type.name)}
                            multiLine={(p.type.maxLength && p.type.maxLength > 100) || false}
                        />
                    ))}></Collapse>
        </div>
    );
}

export default Sidebar;
