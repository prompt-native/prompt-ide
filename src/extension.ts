import { commands, ExtensionContext } from "vscode";
import { PromptEditor } from "./PromptEditor";

export function activate(context: ExtensionContext) {
    // Create the show hello world command
    const showHelloWorldCommand = commands.registerCommand("prompt-ide.preview", () => {
        PromptEditor.render(context.extensionUri);
    });

    // Add command to the extension context
    context.subscriptions.push(showHelloWorldCommand);
}
