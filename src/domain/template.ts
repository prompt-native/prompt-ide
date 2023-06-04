
/**
 * Ref: https://developers.generativeai.google/guide/prompt_best_practices
 */
namespace PromptStudio {
    export interface Placeholder {
        name: string;
        required?: boolean | true;
        description: string;
        example?: string;
    }

    export interface TextTemplate {
        text: string;
        placeholders?: Placeholder[];
    }

    export interface ControlOptions {
        name: string;
        value: string | number;
    }

    export interface Model {
        type: string;
        options?: ControlOptions[];
    }

    export interface Message {
        input: string;
        output: string;
    }

    export interface Prompt {
        input: TextTemplate;
        examples?: Message[];
        context?: Message[];
        model: Model;
    }
}