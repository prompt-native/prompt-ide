import hljs from "highlight.js";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/default.css";
import { Message } from "prompt-schema";
import { useEffect, useRef, useState } from "react";
import Highlight from "react-highlight";

hljs.registerLanguage("json", json);

interface MessageProps {
    index: number;
    message: Message;
    onMessageChanged: (index: number, message: Message) => void;
    onMessageDeleted?: (index: number) => void;
    onMessageInserted?: (index: number) => void;
    rows?: number;
}

function capitalizeFirstChar(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function MessageEdit({ index, message }: MessageProps) {
    const [editing, setEditing] = useState(false);
    const textAreaRef = useRef<HTMLInputElement>(null);
    const [height, setHeight] = useState<"auto" | number>("auto");

    useEffect(() => {
        if (editing && textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [editing, textAreaRef.current]);

    /**
        vscode-light - Light themes.
        vscode-dark - Dark themes.
        vscode-high-contrast - High contrast themes.
     */
    console.log(document.body.className);

    const contentBuilder = (content: string, isJson: boolean) => {
        if (!isJson) return <div>{content}</div>;
        return <Highlight className="json no-margin">{content}</Highlight>;
    };
    return (
        <div className="flex justify-space-between ph-10 lato">
            <div className="mr-10">
                <div className={`${message.role}-avatar avatar fixed-48 rounded`} />
            </div>
            <div className="fill flex flex-column align-start justify-start">
                <div className="bold vs-forground mb-10">
                    {capitalizeFirstChar(message.name || message.role)}
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

export default MessageEdit;
