import {
    VSCodeButton,
    VSCodeDivider, VSCodeTextArea
} from "@vscode/webview-ui-toolkit/react";

import { CompletionProps } from "../../App";
import StructuredColumn from "./StructuredColumn";
import { Completion } from "prompt-runtime";

function copyPrompt(data: Completion): Completion {
    const newPrompt = { ...data } as typeof data;
    // see https://stackoverflow.com/questions/51591335/typescript-spead-operator-on-object-with-method
    Object.setPrototypeOf(newPrompt, Object.getPrototypeOf(data));
    return newPrompt;

}
function StructuredEditor({ data, onPromptChanged }: CompletionProps) {
    const updatePrompt = (text: string) => {
        onPromptChanged({ ...data, prompt: text } as typeof data);
    };

    const addField = () => {
        const fieldName = `input${data.examples!.length}`;
        const newPrompt = copyPrompt(data);
        newPrompt.addColumn(fieldName);
        onPromptChanged(newPrompt);
    };

    const removeInputField = (i: number) => {
        const newPrompt = copyPrompt(data);
        newPrompt.removeColumn(i);
        onPromptChanged(newPrompt);
    };

    const addExample = () => {
        const newPrompt = copyPrompt(data);
        newPrompt.addExamples([...Array(data.examples!.length)]);
        onPromptChanged(newPrompt);
    };

    const removeExample = (i: number) => {
        const newPrompt = copyPrompt(data);
        newPrompt.removeExample(i);
        onPromptChanged(newPrompt);
    };

    const changeFieldLabel = (field: number, label: string) => {
        const newPrompt = copyPrompt(data);
        newPrompt.examples![field].name = label;
        onPromptChanged(newPrompt);
    }

    const totalExamples = Math.max(...data.examples!.map(example => example.values.length));

    const renderExample = (i: number) => {
        return (
            <>
                {data.examples!.map((field, fieldIndex) => <StructuredColumn
                    label={field.name}
                    labelEditable={false}
                    isOutput={false}
                    value={field.values[i] || ""} />)}
                <VSCodeButton appearance="icon"
                    aria-label="Confirm"
                    style={{ color: 'red' }}
                    disabled={data.examples!.length > 3}
                    onClick={() => removeExample(i)}>
                    <span className="codicon codicon-remove"></span>
                </VSCodeButton>
            </>
        );
    };

    const renderTest = () => {
        return data.examples!.map((field, i) => <StructuredColumn
            label={field.name}
            labelEditable={true}
            removable={data.examples!.length > 2 && i !== data.examples!.length - 1}
            onRemove={() => removeInputField(i)}
            isOutput={i === data.examples!.length - 1}
            onLabelChange={(label) => changeFieldLabel(i, label)}
            value={field.test || ""} />);
    };

    return (
        <div className="main-content">
            <span className="label">Context</span>
            <VSCodeTextArea
                className="input"
                resize="vertical"
                rows={3}
                value={data.prompt}
                onChange={(e) => updatePrompt((e.target as HTMLInputElement).value)}
                placeholder="Enter your prompt here">
            </VSCodeTextArea>
            <VSCodeDivider />
            <div className="title-with-actions">
                <span className="label">Examples</span>
                <VSCodeButton appearance="icon" aria-label="Confirm" onClick={addExample}>
                    <span className="codicon codicon-add"></span>
                </VSCodeButton>
            </div>
            {([...Array(totalExamples)]).map((x, i) => renderExample(i))}
            <VSCodeDivider />
            <div className="title-with-actions">
                <span className="label">Test</span>
                <VSCodeButton appearance="icon"
                    aria-label="Confirm"
                    disabled={data.examples!.length > 3}
                    onClick={addField}>
                    <span className="codicon codicon-add"></span>
                </VSCodeButton>
            </div>
            {renderTest()}
        </div>
    );
}

export default StructuredEditor;
