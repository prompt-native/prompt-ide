import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { ReactNode, useState } from "react";

export interface CollapseProps {
    children: ReactNode;
    title: string;
    isCollapsed?: boolean;
}

function Collapse({ children, title, isCollapsed }: CollapseProps) {
    const [collapsed, setCollapsed] = useState(isCollapsed || false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return (
        <div>
            <div className="title flex flex-row align-center">
                <VSCodeButton appearance="icon" onClick={toggleCollapsed}>
                    <span
                        className={`codicon codicon-chevron-${
                            collapsed ? "right" : "down"
                        }`}></span>
                </VSCodeButton>
                <span className="label fill">{title}</span>
            </div>
            {!collapsed && <div className="horizontal-flex">{children}</div>}
        </div>
    );
}

export default Collapse;
