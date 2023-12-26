import { ChatPrompt, CompletionPrompt } from "prompt-schema";
import {
    DEFAULT_CHAT_ENGINE,
    DEFAULT_COMPLETION_ENGINE,
    SCHEMA_VERSION,
} from "../config/Constants";
import { InterfaceType } from "../providers/Common";

export function createDefaultPrompt(type: InterfaceType): ChatPrompt | CompletionPrompt {
    switch (type) {
        case InterfaceType.CHAT:
            return new ChatPrompt(`chat@${SCHEMA_VERSION}`, DEFAULT_CHAT_ENGINE, []);
        case InterfaceType.COMPLETE:
            return new CompletionPrompt(
                `completion@${SCHEMA_VERSION}`,
                DEFAULT_COMPLETION_ENGINE,
                ""
            );
    }
}
