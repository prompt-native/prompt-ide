import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { FunctionCall, Message } from "prompt-schema";
import Highlight from "react-highlight";

interface MessageProps {
    index: number;
    message: Message;
    onMessageChanged: (index: number, message: Message) => void;
    onMessageDeleted?: (index: number) => void;
    onMessageInserted?: (index: number) => void;
    rows?: number;
    selected?: boolean;
    setSelected?: () => void;
}

function capitalizeFirstChar(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function MessageItem({
    index,
    message,
    onMessageChanged,
    onMessageDeleted,
    onMessageInserted,
    rows,
    selected,
    setSelected,
}: MessageProps) {
    const onNextRole = () => {
        if (message.role == "user")
            onMessageChanged(index, new Message("assistant", undefined, message.content));
        else if (message.role == "assistant")
            onMessageChanged(index, new Message("user", undefined, message.content));
        else if (message.role == "function")
            onMessageChanged(index, new Message("user", undefined, ""));
    };

    const onSwitchToFunction = () => {
        onMessageChanged(index, new Message("function", "hello_function", "{}"));
    };

    const onContentChanged = (text: string) => {
        onMessageChanged(index, { ...message, content: text });
    };

    const onNameChanged = (name: string | undefined) => {
        onMessageChanged(index, { ...message, name: name });
    };

    const onSwitchToFunctionCall = () => {
        onMessageChanged(index, {
            ...message,
            content: undefined,
            function_calls: [new FunctionCall("hello_function", "{}")],
        });
    };

    const onSwitchToContent = () => {
        onMessageChanged(index, { ...message, content: "", function_calls: undefined });
    };

    const reanderActions = () => {
        return (
            <div>
                {message.role == "user" && (
                    <VSCodeButton appearance="icon" onClick={() => onNameChanged("user")}>
                        <span className={`codicon codicon-tag`}></span>
                    </VSCodeButton>
                )}
                {message.role == "user" && (
                    <VSCodeButton appearance="icon" onClick={() => onNameChanged(undefined)}>
                        <span className={`codicon codicon-clear-all`}></span>
                    </VSCodeButton>
                )}
                {message.role == "assistant" && (
                    <VSCodeButton appearance="icon" onClick={() => onSwitchToFunctionCall()}>
                        <span className={`codicon codicon-bracket-dot`}></span>
                    </VSCodeButton>
                )}
                {message.role == "assistant" && (
                    <VSCodeButton appearance="icon" onClick={() => onSwitchToFunction()}>
                        <span className={`codicon codicon-call-incoming`}></span>
                    </VSCodeButton>
                )}
                {message.role == "assistant" && (
                    <VSCodeButton appearance="icon" onClick={() => onSwitchToContent()}>
                        <span className={`codicon codicon-clear-all`}></span>
                    </VSCodeButton>
                )}
                {onMessageInserted && (
                    <VSCodeButton appearance="icon" onClick={() => onMessageInserted(index)}>
                        <span className={`codicon codicon-insert`}></span>
                    </VSCodeButton>
                )}
                {onMessageDeleted && (
                    <VSCodeButton appearance="icon" onClick={() => onMessageDeleted(index)}>
                        <span className={`codicon codicon-close danger`}></span>
                    </VSCodeButton>
                )}
            </div>
        );
    };

    const contentBuilder = (content: string, isJson: boolean) => {
        if (!isJson) return <div>{content}</div>;
        return <Highlight className="json no-margin">{content}</Highlight>;
    };

    return (
        <div
            onClick={setSelected}
            className={`flex justify-space-between ph-10 lato ${selected ? "selected" : ""}`}>
            <div className="mr-10">
                <div className={`${message.role}-avatar avatar fixed-48 rounded`} />
            </div>
            <div className="fill flex flex-column align-start justify-start">
                <div className="bold vs-forground mb-10 flex flex-row justify-space-between">
                    <div>{capitalizeFirstChar(message.name || message.role)}</div>
                    {selected && reanderActions()}
                </div>
                {message.content && contentBuilder(message.content, message.role == "function")}
                {message.function_calls &&
                    message.function_calls.map((f) => (
                        <>
                            <div className="mb-10 flex align-center italic">
                                <span className={`codicon codicon-live-share mr-10 default`}></span>
                                {f.name}
                            </div>
                            {contentBuilder(f.arguments, true)}
                        </>
                    ))}
            </div>
        </div>
    );
}

export default MessageItem;
