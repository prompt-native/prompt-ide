import { VSCodeButton, VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { Message } from "prompt-schema";

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
    }
    return "question";
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

    return (
        <div className="flex flex-column mb-10">
            <div className="title flex flex-row align-center">
                <VSCodeButton appearance="icon" onClick={onTypeChanged}>
                    <span className={`codicon codicon-${icon}`}></span>
                </VSCodeButton>
                <span className="label fill">{message.role}</span>
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

            <VSCodeTextArea
                className="input fill"
                resize="vertical"
                rows={rows || 1}
                value={message.content}
                onChange={(e) => onContentChanged((e.target as HTMLInputElement).value)}
                placeholder="Enter your prompt here"></VSCodeTextArea>
        </div>
    );
}

export default MessageItem;
