import Ajv from "ajv";
import { CHAT_SCHEMA } from "../schema/ChatSchema";
import { COMPLETION_SCHEMA } from "../schema/CompletionSchama";

const ajv = new Ajv({ strict: false });
const chatValidator = ajv.compile(CHAT_SCHEMA);
const completionValidator = ajv.compile(COMPLETION_SCHEMA);

export function validateChatSchema(data: any): undefined | string[] {
    if (chatValidator(data)) {
        return undefined;
    } else {
        const errorMessages = chatValidator.errors!.map((error) => {
            let message = `Error at ${error.instancePath}: ${error.message}`;
            return message;
        });
        return errorMessages;
    }
}
