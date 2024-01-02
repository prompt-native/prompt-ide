import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { ReactNode } from "react";

interface MessageBaseProps {
    icon: string;
    title: string;
    renderActions: () => ReactNode;
    children: ReactNode;
    onNextType: () => void;
}

function MessageBase({ icon, title, renderActions, children, onNextType }: MessageBaseProps) {
    return (
        <div className="flex flex-column mb-10">
            <div className="title flex flex-row align-center">
                <VSCodeButton appearance="icon" onClick={onNextType}>
                    <span className={`codicon codicon-${icon}`}></span>
                </VSCodeButton>
                <span className="label fill">{title}</span>
                {renderActions()}
            </div>
            {children}
        </div>
    );
}

export default MessageBase;
