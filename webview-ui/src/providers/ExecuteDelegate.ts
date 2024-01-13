import { ChatPrompt, CompletionPrompt, Prompt } from "prompt-schema";
import { Configuration } from "../App";
import { appendOutput } from "../utilities/Message";
import EngineProvider, { EngineId, EngineType, InterfaceType } from "./EngineProvider";
import { MinimaxAdaptor } from "./Minimax";
import { OpenAIExecutor } from "./OpenAI";
import Result from "./Result";

export default class ExecuteDelegate implements EngineProvider {
    private registeredExecutors: Map<string, EngineProvider> = new Map();

    constructor({ openaiKey, minimaxKey, minimaxGroupId }: Configuration) {
        if (openaiKey) {
            const openaiExecutor = new OpenAIExecutor(openaiKey);
            this.register(openaiExecutor);
        } else {
            appendOutput("openaiApiKey not configured, open ai executor is disabled.");
        }
        if (minimaxKey && minimaxGroupId) {
            const minimaxExecutor = new MinimaxAdaptor(minimaxGroupId, minimaxKey);
            this.register(minimaxExecutor);
        } else {
            appendOutput(
                "minimaxApiKey or minimaxGroupId not configured, minimax executor is disabled."
            );
        }
    }

    private register(provider: EngineProvider) {
        provider.getEngines().forEach((engine) => {
            const key = engine.id.asString();
            if (this.registeredExecutors.get(key))
                throw new Error(`Executor ${key} already registered, this must be a bug `);
            this.registeredExecutors.set(key, provider);
        });
    }

    getEngines(): EngineType[] {
        throw new Error("Method not implemented.");
    }

    private getExecutor(prompt: Prompt, type: InterfaceType): EngineProvider {
        const id =
            type == InterfaceType.CHAT
                ? EngineId.chat(prompt.engine)
                : EngineId.completion(prompt.engine);
        const executor = this.registeredExecutors.get(id.asString());

        if (!executor) {
            console.log("registered executors", this.registeredExecutors);
            throw new Error(
                "Engine not configured, please configure it first. You can set OPENAI_KEY to enable OPENAI executor, please check the extension settings for more details."
            );
        }

        return executor;
    }
    async executeChat(prompt: ChatPrompt): Promise<Result> {
        const executor = this.getExecutor(prompt, InterfaceType.CHAT);
        return executor.executeChat(prompt);
    }

    async executeCompletion(prompt: CompletionPrompt): Promise<Result> {
        const executor = this.getExecutor(prompt, InterfaceType.COMPLETION);
        return executor.executeCompletion(prompt);
    }
}
