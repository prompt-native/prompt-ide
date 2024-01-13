import { ChatPrompt, CompletionPrompt } from "prompt-schema";
import Result from "./Result";

export enum InterfaceType {
    CHAT = "chat",
    COMPLETION = "completion",
}

export class EngineId {
    constructor(public name: string, public interfaceType: InterfaceType) {}

    public static chat(name: string): EngineId {
        return new EngineId(name, InterfaceType.CHAT);
    }

    public static completion(name: string): EngineId {
        return new EngineId(name, InterfaceType.COMPLETION);
    }

    public asString(): string {
        return `${this.name}-${this.interfaceType}`;
    }
}

export interface EngineType {
    id: EngineId;
    description?: string;
    parameters: ParameterType[] | (() => ParameterType[]);
}

export interface ParameterType {
    name: string;
    displayName: string;
    type: "number" | "string" | "boolean" | "array";
    defaultValue?: string | number | boolean;
    isRequired?: boolean;
    description?: string;
    minValue?: number;
    maxValue?: number;
    isMinValueExclusive?: boolean;
    isMaxValueExclusive?: boolean;
    maxLength?: number;
}

export default interface EngineProvider {
    getEngines(): EngineType[];
    executeCompletion(prompt: CompletionPrompt): Promise<Result>;
    executeChat(prompt: ChatPrompt): Promise<Result>;
}
