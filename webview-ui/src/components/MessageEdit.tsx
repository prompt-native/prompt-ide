import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import hljs from "highlight.js";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/default.css";
import { Message } from "prompt-schema";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
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

function MessageEdit({ index, message }: MessageProps) {
    const [editing, setEditing] = useState(false);
    const textAreaRef = useRef<HTMLInputElement>(null);
    const [height, setHeight] = useState<"auto" | number>("auto");

    useEffect(() => {
        if (editing && textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [editing, textAreaRef.current]);

    function adjustHeight() {
        if (textAreaRef.current) {
            const shadowRoot = textAreaRef.current.shadowRoot;
            if (shadowRoot) {
                const shadowTextArea = shadowRoot.querySelector("textarea");
                if (shadowTextArea) {
                    const h = shadowTextArea.scrollHeight;
                    setHeight(h);
                    console.log("set", `${h}`);
                }
            }
        }
    }

    useLayoutEffect(adjustHeight, []);

    /**
        vscode-light - Light themes.
        vscode-dark - Dark themes.
        vscode-high-contrast - High contrast themes.
     */
    console.log(document.body.className);
    if (editing)
        return (
            <div className="flex">
                <div>User</div>
                <VSCodeTextArea
                    rows={3}
                    className="fill"
                    // @ts-ignore
                    ref={textAreaRef}
                    onChange={() => adjustHeight()}
                    autoFocus
                    //onBlur={() => setEditing(false)}
                    initialValue={message.content || ""}
                />
            </div>
        );
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
                <div className="bold vs-forground mb-10">{message.role} </div>
                {message.content && contentBuilder(message.content, message.role == "function")}
                {message.function_calls &&
                    contentBuilder(message.function_calls![0].arguments, true)}
            </div>
        </div>
    );
}

export default MessageEdit;
