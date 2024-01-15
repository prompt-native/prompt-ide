/**
 * see:
 * https://platform.openai.com/docs/api-reference
 * https://learn.microsoft.com/en-us/azure/ai-services/openai/reference
 */

import { Message } from "prompt-schema";

export class Choice {
    constructor(
        public content: string | Message[],
        public index: number,
        public finishReason: string
    ) {}
}

export default class Result {
    constructor(public id: string, public created: number, public choices: Choice[]) {}
}
