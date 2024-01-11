import { CompletionPrompt } from "prompt-schema";
import { OpenAIExecutor } from "./OpenAI";
import Result from "./Result";

export interface PromptExecutor {
    executeCompletion(prompt: CompletionPrompt): Promise<Result>;
}

export class PromptExecutionDelegate implements PromptExecutor {
    private openAiExecutor: OpenAIExecutor | undefined;
    constructor(private openAIApiKey?: string) {
        this.openAiExecutor = openAIApiKey ? new OpenAIExecutor(openAIApiKey) : undefined;
    }

    async executeCompletion(prompt: CompletionPrompt): Promise<Result> {
        if (this.openAiExecutor) return this.openAiExecutor.executeCompletion(prompt);
        else throw new Error("OPENAI_KEY not configured, please configure it in vscode settings");
    }
}
