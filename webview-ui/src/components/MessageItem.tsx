import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { Message } from "prompt-schema";
import ContentEdit from "./ContentEdit";

interface MessageProps {
    messageIndex: number;
    message: Message;
    onMessageChanged?: (index: number, message: Message) => void;
    onMessageDeleted?: (index: number) => void;
    onMessageInserted?: (index: number) => void;
    rows?: number;
    selected?: boolean;
    onClick?: () => void;
}

function capitalizeFirstChar(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function MessageItem({
    messageIndex,
    message,
    onMessageChanged,
    onMessageDeleted,
    onMessageInserted,
    rows,
    selected,
    onClick,
}: MessageProps) {
    const onNextRole = () => {
        if (message.role == "user")
            onMessageChanged &&
                onMessageChanged(
                    messageIndex,
                    new Message("assistant", undefined, message.content)
                );
        else if (message.role == "assistant")
            onMessageChanged &&
                onMessageChanged(messageIndex, new Message("user", undefined, message.content));
    };

    const onContentChanged = (text: string) => {
        onMessageChanged && onMessageChanged(messageIndex, { ...message, content: text });
    };

    const onFunctionCallChanged = (functionCallIndex: number, name: string, args: string) => {
        const updated = { ...message };
        updated.function_calls![functionCallIndex].name = name;
        updated.function_calls![functionCallIndex].arguments = args;
        onMessageChanged && onMessageChanged(messageIndex, updated);
    };

    const reanderActions = () => {
        return (
            <div className="flex align-start">
                {onMessageInserted && (
                    <VSCodeButton appearance="icon" onClick={() => onMessageInserted(messageIndex)}>
                        <span className={`codicon codicon-insert`}></span>
                    </VSCodeButton>
                )}
                {onMessageDeleted && (
                    <VSCodeButton appearance="icon" onClick={() => onMessageDeleted(messageIndex)}>
                        <span className={`codicon codicon-close danger`}></span>
                    </VSCodeButton>
                )}
            </div>
        );
    };

    return (
        <div
            onClick={onClick}
            className={`flex justify-space-between ph-10 lato ${selected ? "selected" : ""}`}>
            <div className="mr-10">
                <div
                    className={`${message.role}-avatar avatar fixed-48 rounded`}
                    onDoubleClick={onNextRole}
                />
            </div>
            <div className="fill flex flex-column align-start justify-start">
                <div className="bold vs-forground fixed-height-32 flex flex-row justify-space-between">
                    <div>{capitalizeFirstChar(message.name || message.role)}</div>
                    {selected && reanderActions()}
                </div>
                {message.content && (
                    <ContentEdit
                        content={message.content}
                        onContentChanged={onContentChanged}
                        isJson={message.role == "function"}
                    />
                )}
                {!message.content && !message.function_calls && (
                    <ContentEdit
                        content={""}
                        edit
                        onContentChanged={onContentChanged}
                        isJson={message.role == "function"}
                    />
                )}
                {message.function_calls &&
                    message.function_calls.map((f, index) => (
                        <>
                            <div className="mb-10 flex align-center italic">
                                <span className={`codicon codicon-live-share mr-10 default`}></span>
                                {f.name}
                            </div>
                            <ContentEdit
                                content={f.arguments}
                                onContentChanged={(args) =>
                                    onFunctionCallChanged(index, f.name, args)
                                }
                                isJson
                            />
                        </>
                    ))}
            </div>
        </div>
    );
}

export default MessageItem;
