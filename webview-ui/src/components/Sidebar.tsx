import {
    VSCodeDropdown,
    VSCodeOption,
    VSCodeRadio,
    VSCodeRadioGroup,
} from "@vscode/webview-ui-toolkit/react";
import { ChatPrompt, CompletionPrompt } from "prompt-schema";
import { useEffect, useState } from "react";
import { InterfaceType, ModelType, ParameterType } from "../providers/Common";
import { MINIMAX_MODELS } from "../providers/Minimax";
import { GPT3_5_MODELS } from "../providers/OpenAI";
import Collapse from "./Collapse";
import Parameter from "./Parameter";

interface SidebarProps {
    prompt: ChatPrompt | CompletionPrompt;
    onPromptChanged: (prompt: ChatPrompt | CompletionPrompt) => void;
}

const MODEL_GROUPS: { [key: string]: ModelType[] } = {
    "GPT3.5": GPT3_5_MODELS,
    "Minimax": MINIMAX_MODELS,
};

function Sidebar({ prompt, onPromptChanged }: SidebarProps) {
    const [group, setGroup] = useState("GPT3.5");
    const [models, setModels] = useState<ModelType[]>([]);
    const [model, setModel] = useState<ModelType | null>(null);

    useEffect(() => {
        const allModels = MODEL_GROUPS[group] || [];
        const interfaceType =
            prompt instanceof ChatPrompt ? InterfaceType.CHAT : InterfaceType.COMPLETE;
        const availableModels = allModels.filter((m) => m.interfaceType == interfaceType);
        setModels(availableModels);
        const matchedModels = availableModels.filter((m) => m.name == prompt.engine);

        if (matchedModels.length > 0) {
            setModel(matchedModels[0]);
        } else {
            setModel(availableModels[0]);
            prompt.engine = availableModels[0].name;
            onPromptChanged(prompt);
        }
    }, [prompt, group]);

    let parameters: ParameterType[] = [];
    if (model != null) {
        if (typeof model.parameters == "function") {
            parameters = model.parameters();
        } else {
            parameters = model.parameters;
        }
    }

    const mode = prompt instanceof ChatPrompt ? "chat" : "completion";
    return (
        <div className="ml-10 pr-10 flex-shrink-0 y-scroll-auto full-height width-200 flex flex-column">
            <label>Type</label>
            <VSCodeRadioGroup
                value={mode}
                className="mb-10"
                //onChange={(e) => setMode((e.target as HTMLInputElement).value as EditorMode)}
            >
                <VSCodeRadio value="chat">Chat</VSCodeRadio>
                <VSCodeRadio value="completion">Completion</VSCodeRadio>
            </VSCodeRadioGroup>
            <label>Group</label>
            <VSCodeDropdown
                className="button mb-10"
                position="below"
                value={group}
                onChange={(e) => setGroup((e.target as HTMLInputElement).value)}>
                {Object.keys(MODEL_GROUPS).map((t) => (
                    <VSCodeOption value={t} key={t}>
                        {t}
                    </VSCodeOption>
                ))}
            </VSCodeDropdown>
            <label>Model</label>
            <VSCodeDropdown className="button mb-10" position="below" value={model?.name || ""}>
                {models.map((t) => (
                    <VSCodeOption value={t.name} key={t.name}>
                        {t.name}
                    </VSCodeOption>
                ))}
                {models.length == 0 && (
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
