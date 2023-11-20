import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";

interface MessageProps {
    content: string;
}
const MIN_TEXTAREA_HEIGHT = 14;

function Message({ content }: MessageProps) {
    return (
        <div className="flex flex-row">
            <label className="mr-10">USER</label>
            <div className="flex flex-row fill">
                {content}
                {/* <VSCodeTextArea
                    // @ts-ignore
                    itemRef={textareaRef}
                    style={{
                        minHeight: MIN_TEXTAREA_HEIGHT,
                        resize: "none",
                    }}
                    value={value}
                    onChange={(e) => setValue((e.target as HTMLInputElement).value)}
                    placeholder="Enter your prompt here"></VSCodeTextArea> */}
            </div>
            <div>
                <VSCodeButton appearance="icon" aria-label="Confirm" className="danger">
                    <span className="codicon codicon-close"></span>
                </VSCodeButton>
            </div>
        </div>
    );
}

export default Message;
