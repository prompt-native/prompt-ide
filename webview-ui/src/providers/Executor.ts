import { CompletionPrompt } from "prompt-schema";
import { OpenAIExecutor } from "./OpenAI";
import Result from "./Result";

export interface PromptExecutor {
    executeCompletion(prompt: CompletionPrompt): Promise<Result>;
}

export class PromptExecutionDelegate implements PromptExecutor {
    private openAiExecutor: OpenAIExecutor;
    constructor(private openAIApiKey: string) {
        this.openAiExecutor = new OpenAIExecutor(openAIApiKey);
    }

    async executeCompletion(prompt: CompletionPrompt): Promise<Result> {
        return this.openAiExecutor.executeCompletion(prompt);
    }
}
