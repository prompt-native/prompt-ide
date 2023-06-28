import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { ReactElement, ReactNode, useState } from "react";

export interface CollapseProps {
    children: ReactNode,
    title: string,
    isCollapsed?: boolean,
    renderActions?: () => ReactElement,
}

function Collapse({ children, title, isCollapsed, renderActions }: CollapseProps) {
    const [collapsed, setCollapsed] = useState(isCollapsed || false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div className="vertical-flex card">
            <div className="title">
                <VSCodeButton appearance="icon" onClick={toggleCollapsed}>
                    <span className={`codicon codicon-chevron-${collapsed ? "right" : "down"}`}></span>
                </VSCodeButton>
                <span className="label fill">{title}</span>
                {(renderActions && !collapsed) && renderActions()}
            </div>
            {!collapsed &&
                <div className="horizontal-flex">
                    {children}
                </div>
            }
        </div>
    );
}

export default Collapse;
