import { VSCodeButton, VSCodeTextArea, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { FunctionCall, Message } from "prompt-schema";
import MessageBase from "./MessageBase";

interface MessageProps {
    index: number;
    message: Message;
    onMessageChanged: (index: number, message: Message) => void;
    onMessageDeleted?: (index: number) => void;
    onMessageInserted?: (index: number) => void;
    rows?: number;
}

function textArea(onChange: (t: string) => void, name?: string, content?: string, rows?: number) {
    return (
        <VSCodeTextArea
            className="input fill"
            resize="vertical"
            rows={rows || 1}
            value={content || ""}
            onChange={(e) => onChange((e.target as HTMLInputElement).value)}
            placeholder="Enter your prompt here">
            {name}
        </VSCodeTextArea>
    );
}

function MessageItem({
    index,
    message,
    onMessageChanged,
    onMessageDeleted,
    onMessageInserted,
    rows,
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
            <>
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
            </>
        );
    };

    if (message.role == "assistant") {
        if (message.function_calls) {
            return (
                <MessageBase
                    icon={"call-outgoing danger"}
                    title={message.role.toUpperCase()}
                    onNextType={onNextRole}
                    renderActions={() => reanderActions()}>
                    {message.function_calls.map((functionCall: FunctionCall, index) => (
                        <>
                            <VSCodeTextField className="mb-10" value={functionCall.name}>
                                {"function name"}
                            </VSCodeTextField>
                            {functionCall.arguments &&
                                textArea(
                                    onContentChanged,
                                    "function arguments",
                                    functionCall.arguments,
                                    rows
                                )}
                        </>
                    ))}
                </MessageBase>
            );
        }
        // fixme: should content and function_call appear together?
        return (
            <MessageBase
                icon={"robot info"}
                title={message.role.toUpperCase()}
                onNextType={onNextRole}
                renderActions={() => reanderActions()}>
                {textArea(onContentChanged, message.name, message.content, rows)}
            </MessageBase>
        );
    }

    let contentTitle = "";
    if (message.role == "function") contentTitle = "function result";
    else if (message.name) contentTitle = "content";

    const icon = message.role == "user" ? "feedback" : "call-incoming default";
    return (
        <MessageBase
            icon={icon}
            title={message.role.toUpperCase()}
            onNextType={onNextRole}
            renderActions={() => reanderActions()}>
            <>
                {message.name && (
                    <VSCodeTextField
                        className="mb-10"
                        value={message.name}
                        onChange={(e) => onNameChanged((e.target as HTMLInputElement).value)}>
                        {`${message.role} name`}
                    </VSCodeTextField>
                )}
                {textArea(onContentChanged, contentTitle, message.content, rows)}
            </>
        </MessageBase>
    );
}

export default MessageItem;
