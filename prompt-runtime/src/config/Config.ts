import { Type } from "../domain/Prompt";

export enum Vendor {
    OpenAI = "openai",
    Google = "google",
    Minimax = "minimax",
};

export class ModelDef {
    constructor(
        public name: string,
        public vendor: Vendor,
        public supportedTypes: Type[]) {
    }
}

export const AllModels = [
    new ModelDef("gpt-3.5", Vendor.OpenAI, [Type.chat, Type.completion]),
    new ModelDef("text-bison", Vendor.Google, [Type.completion]),
    new ModelDef("chat-bison", Vendor.Google, [Type.chat]),
    new ModelDef("code-bison", Vendor.Google, [Type.completion]),
    new ModelDef("codechat-bison", Vendor.Google, [Type.chat]),
    new ModelDef("code-gecko", Vendor.Google, [Type.completion]),
    new ModelDef("abab4", Vendor.Minimax, [Type.chat]),
    new ModelDef("abab5", Vendor.Minimax, [Type.chat]),
];

type VendorStrings = keyof typeof Vendor;

export function getModels(type: Type, vendor: Vendor): string[] {
    return AllModels.filter(model => model.vendor == vendor && model.supportedTypes.includes(type))
        .map(def => def.name);
}
