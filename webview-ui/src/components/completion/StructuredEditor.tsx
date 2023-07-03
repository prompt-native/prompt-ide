import {
    VSCodeButton,
    VSCodeDivider, VSCodeTextArea
} from "@vscode/webview-ui-toolkit/react";

import { CompletionProps } from "../../App";
import StructuredColumn from "./StructuredColumn";
import { Completion } from "prompt-runtime";
import Collapse from "../Collapse";

function copyPrompt(data: Completion): Completion {
    const newPrompt = { ...data } as typeof data;
    // see https://stackoverflow.com/questions/51591335/typescript-spead-operator-on-object-with-method
    Object.setPrototypeOf(newPrompt, Object.getPrototypeOf(data));
    return newPrompt;

}
function StructuredEditor({ data, output, onPromptChanged }: CompletionProps) {
    const updatePrompt = (text: string) => {
        onPromptChanged({ ...data, prompt: text } as typeof data);
    };

    const addField = () => {
        const fieldName = `input${data.examples!.length}`;
        onPromptChanged(Completion.addColumn(data, fieldName));
    };

    const removeInputField = (i: number) => {
        onPromptChanged(Completion.removeColumn(data, i));
    };

    const addExample = () => {
        onPromptChanged(Completion.addExample(data));
    };

    const removeExample = (i: number) => {
        const p = Completion.removeExample(data, i);
        console.log(p);
        onPromptChanged(p);
    };

    const changeExample = (i: number, column: number, value: string) => {
        onPromptChanged(Completion.updateExampleColumn(data, i, column, value));
    };

    const changeFieldLabel = (field: number, label: string) => {
        const newPrompt = copyPrompt(data);
        newPrompt.examples![field].name = label;
        onPromptChanged(newPrompt);
    }

    const totalExamples = Math.max(...data.examples!.map(example => example.values.length));

    const renderExample = (i: number) => {
        return (
            <div className="horizontal-flex" key={`example-${i}`}>
                <div className="fill">
                    {data.examples!.map((field, fieldIndex) => <StructuredColumn
                        label={field.name}
                        labelEditable={false}
                        isOutput={false}
                        onChange={(text) => changeExample(i, fieldIndex, text)}
                        value={field.values[i] || ""} />)}
                    <VSCodeDivider />
                </div>
                <VSCodeButton appearance="icon"
                    aria-label="Confirm"
                    className="danger"
                    disabled={data.examples!.length > 3}
                    onClick={() => removeExample(i)}>
                    <span className="codicon codicon-close"></span>
                </VSCodeButton>
            </div>
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
            value={i === data.examples!.length - 1 ? (output || '') : (field.test || "")} />);
    };

    return (
        <div className="main-content">
            <Collapse title="Context">
                <VSCodeTextArea
                    className="input fill"
                    resize="vertical"
                    rows={3}
                    value={data.prompt}
                    onChange={(e) => updatePrompt((e.target as HTMLInputElement).value)}
                    placeholder="Enter your prompt here">
                </VSCodeTextArea>
            </Collapse>

            <Collapse title="Examples"
                renderActions={() =>
                    <VSCodeButton appearance="icon" aria-label="Confirm" onClick={addExample}>
                        <span className="codicon codicon-add"></span>
                    </VSCodeButton>}>
                <div className="fill">
                    {([...Array(totalExamples)]).map((x, i) => renderExample(i))}
                </div>
            </Collapse>

            <Collapse title="Test"
                renderActions={() =>
                    <VSCodeButton appearance="icon"
                        aria-label="Confirm"
                        disabled={data.examples!.length > 3}
                        onClick={addField}>
                        <span className="codicon codicon-add"></span>
                    </VSCodeButton>}>
                <div className="fill">
                    {renderTest()}
                </div>
            </Collapse>
        </div>
    );
}

export default StructuredEditor;
