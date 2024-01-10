/**
 * see:
 * https://platform.openai.com/docs/api-reference
 * https://learn.microsoft.com/en-us/azure/ai-services/openai/reference
 */

export class Choice {
    constructor(public text: string, public index: number, public finishReason: string) {}
}

export default class Result {
    constructor(public id: string, public created: number, public choices: Choice[]) {}
    static fromJSON(json: any): Result {
        const choices = json.choices.map(
            (choiceJSON: any) =>
                new Choice(choiceJSON.text, choiceJSON.index, choiceJSON.finishReason)
        );

        return new Result(json.id, json.created, choices);
    }
}
