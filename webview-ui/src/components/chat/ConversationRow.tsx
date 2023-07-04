import StructuredColumn from "../completion/StructuredColumn";
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';

export interface ConversationRowProps {
    input: string,
    output: string,
    onInputChange: (text: string) => any,
    onOutputChange: (text: string) => any,
    onRemove?: () => any,
    removable?: boolean,
    hasOutput?: boolean,
}

function ConversationRow({ input, output, onInputChange, onOutputChange, onRemove, removable, hasOutput }: ConversationRowProps) {
    return (
        <div className="horizontal-flex">
            <div className="fill">
                <StructuredColumn label="USER" value={input}
                    onChange={onInputChange} />
                <StructuredColumn label="AI"
                    value={output}
                    onChange={onOutputChange}
                    isOutput={hasOutput} />
            </div>
            {removable &&
                <VSCodeButton appearance="icon" onClick={() => onRemove!()}>
                    <span className="codicon codicon-close" style={{ color: 'red' }}></span>
                </VSCodeButton>
            }
        </div>
    );
}

export default ConversationRow;
