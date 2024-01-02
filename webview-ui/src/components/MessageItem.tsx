import { VSCodeTextArea, VSCodeTextField } from "@vscode/webview-ui-toolkit/react";
import { Message } from "prompt-schema";
import MessageBase from "./MessageBase";

interface MessageProps {
    index: number;
    message: Message;
    onMessageChanged: (index: number, role: string, content: string) => void;
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
        onMessageChanged(index, nextType, message.content || "");
    };

    const onContentChanged = (text: string) => {
        onMessageChanged(index, message.role, text);
    };

    if (message.role == "user") {
        return (
            <MessageBase
                icon={"feedback"}
                title={"user"}
                onNextType={onTypeChanged}
                renderActions={() => <></>}>
                {textArea(onContentChanged, message.name, message.content, rows)}
            </MessageBase>
        );
    } else if (message.role == "assistant") {
        // fixme: should content and function_call appear together?
        console.log(message);
        if (message.content) {
            return (
                <MessageBase
                    icon={"robot"}
                    title={"assistant"}
                    onNextType={onTypeChanged}
                    renderActions={() => <></>}>
                    {textArea(onContentChanged, message.name, message.content, rows)}
                </MessageBase>
            );
        } else if (message.functionCall) {
            return (
                <MessageBase
                    icon={"robot"}
                    title={"assistant"}
                    onNextType={onTypeChanged}
                    renderActions={() => <></>}>
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
    } else if (message.role == "function") {
        return (
            <MessageBase
                icon={"robot"}
                title={"function"}
                onNextType={onTypeChanged}
                renderActions={() => <></>}>
                <>
                    <VSCodeTextField className="mb-10" value={message.name}>
                        {"function name"}
                    </VSCodeTextField>
                    {textArea(onContentChanged, "function result", message.content, rows)}
                </>
            </MessageBase>
        );
    }
    throw new Error("Unknown role:" + message.role);
}

export default MessageItem;
