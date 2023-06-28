import StructuredColumn from "../completion/StructuredColumn";
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';

export interface ConversationRowProps {
    removable?: boolean,
    hasOutput?: boolean,
}

function ConversationRow({ removable, hasOutput }: ConversationRowProps) {
    return (
        <div className="horizontal-flex">
            <div className="fill">
                <StructuredColumn label="USER" value="" />
                <StructuredColumn label="AI" value="" isOutput={hasOutput} />
            </div>
            {removable &&
                <VSCodeButton appearance="icon">
                    <span className="codicon codicon-close" style={{ color: 'red' }}></span>
                </VSCodeButton>
            }
        </div>
    );
}

export default ConversationRow;
