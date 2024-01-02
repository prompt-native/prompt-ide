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

function getIcon(role: string): string {
    switch (role) {
        case "user":
            return "feedback";
        case "assistant":
            return "robot";
        case "function":
            return "bracket-dot";
    }
    return "question";
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
    const icon = getIcon(message.role);

    const onTypeChanged = () => {
        const nextType = message.role == "user" ? "assistant" : "user";

        onMessageChanged(index, new Message(nextType, undefined, message.content));
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
            functionCall: new FunctionCall("hello_function", { name: "world" }),
        });
    };

    const onSwitchToContent = () => {
        onMessageChanged(index, { ...message, content: "", functionCall: undefined });
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
                    <VSCodeButton appearance="icon" onClick={() => onSwitchToFunctionCall()}>
                        <span className={`codicon codicon-call-outgoing`}></span>
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
        if (message.functionCall) {
            return (
                <MessageBase
                    icon={"call-outgoing danger"}
                    title={"assistant"}
                    onNextType={onTypeChanged}
                    renderActions={() => reanderActions()}>
                    <>
                        <VSCodeTextField className="mb-10" value={message.functionCall.name}>
                            {"function name"}
                        </VSCodeTextField>
                        {message.functionCall.functionArguments &&
                            textArea(
                                onContentChanged,
                                "function arguments",
                                JSON.stringify(message.functionCall.functionArguments),
                                rows
                            )}
                    </>
                </MessageBase>
            );
        }
        // fixme: should content and function_call appear together?
        return (
            <MessageBase
                icon={"robot info"}
                title={"assistant"}
                onNextType={onTypeChanged}
                renderActions={() => reanderActions()}>
                {textArea(onContentChanged, message.name, message.content, rows)}
            </MessageBase>
        );
    }
    const contentTitle = message.role == "function" ? "function result" : "content";
    return (
        <MessageBase
            icon={"call-incoming default"}
            title={message.role}
            onNextType={onTypeChanged}
            renderActions={() => reanderActions()}>
            <>
                {message.name && (
                    <VSCodeTextField className="mb-10" value={message.name}>
                        {`${message.role} name`}
                    </VSCodeTextField>
                )}
                {textArea(onContentChanged, contentTitle, message.content, rows)}
            </>
        </MessageBase>
    );
}

export default MessageItem;
