import { VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import { Message } from "prompt-schema";
import MessageItem from "./MessageItem";

interface ExamplesProps {
    items: Message[];
    onMessageChanged: (index: number, role: string, content: string) => void;
    onMessageDeleted: (index: number) => void;
    onMessageInserted: (index: number) => void;
}

function Examples({ items, onMessageChanged, onMessageDeleted, onMessageInserted }: ExamplesProps) {
    if (items.length == 0)
        return (
            <div>
                <p>You can add examples for few-shot prompting.</p>
                <VSCodeLink href="#" onClick={() => onMessageInserted(0)}>
                    Add example
                </VSCodeLink>
            </div>
        );
    return (
        <>
            {items.map((message, index) => {
                return (
                    <MessageItem
                        key={index}
                        index={index}
                        message={message}
                        onMessageChanged={onMessageChanged}
                        onMessageDeleted={onMessageDeleted}
                        onMessageInserted={onMessageInserted}
                    />
                );
            })}
        </>
    );
}

export default Examples;
