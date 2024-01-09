import { VSCodeTextArea } from "@vscode/webview-ui-toolkit/react";
import { useEffect, useRef, useState } from "react";
import Highlight from "react-highlight";

interface ContentEditProps {
    content: string;
    rows?: number;
    isJson?: boolean;
    onContentChanged: (text: string) => void;
}
function ContentEdit({ content, rows, onContentChanged, isJson }: ContentEditProps) {
    const [editing, setEditing] = useState(false);
    const textAreaRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        /* 
            see: https://github.com/microsoft/vscode-webview-ui-toolkit/issues/381 
        */
        if (editing && textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [editing, textAreaRef.current]);

    if (editing) {
        return (
            <VSCodeTextArea
                rows={rows || 2}
                // @ts-ignore
                ref={textAreaRef}
                className="fill"
                onBlur={() => setEditing(false)}
                onChange={(e) => onContentChanged((e.target as HTMLInputElement).value)}
                initialValue={content || ""}
            />
        );
    } else {
        return (
            <div onDoubleClick={() => setEditing(true)} className="pre-line">
                {isJson ? <Highlight className="json no-margin">{content}</Highlight> : content}
            </div>
        );
    }
}

export default ContentEdit;
