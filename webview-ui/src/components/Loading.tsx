import { VSCodeProgressRing } from "@vscode/webview-ui-toolkit/react";

function Loading() {
    return (
        <main className="flex flex-column align-center fill justify-center">
            <p>Loading document...</p>
            <VSCodeProgressRing />
        </main>
    );
}

export default Loading;
