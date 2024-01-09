import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { Message } from "prompt-schema";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import userImg from "../user.png";

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
    return (
        <div className="flex justify-space-between ph-10 lato">
            <div className="mr-10">
                <img src={userImg} className="fixed-48 rounded" />
            </div>
            <div className="fill flex flex-column align-start justify-start">
                <div className="bold">Jack </div>
                <div>{message.content}</div>
            </div>
        </div>
    );
}

export default MessageEdit;
