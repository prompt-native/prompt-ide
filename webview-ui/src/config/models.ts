export enum Vendor {
    OpenAI = "OpenAI",
    Google = "Google",
    Minimax = "Minimax",
};

export enum CreateType {
    Completion = "Completion",
    Chat = "Chat",
    Embedding = "Embedding",
}

export class Model {
    constructor(
        public name: string,
        public vendor: Vendor,
        public supportedTypes: CreateType[]) {
    }
}

export const AllModels = [
    new Model("gpt-3.5", Vendor.OpenAI, [CreateType.Chat, CreateType.Completion]),
    new Model("text-bison", Vendor.Google, [CreateType.Completion]),
    new Model("chat-bison", Vendor.Google, [CreateType.Chat]),
    new Model("code-bison", Vendor.Google, [CreateType.Completion]),
    new Model("codechat-bison", Vendor.Google, [CreateType.Chat]),
    new Model("textembedding-gecko", Vendor.Google, [CreateType.Embedding]),
    new Model("code-gecko", Vendor.Google, [CreateType.Completion]),
    new Model("abab4", Vendor.Minimax, [CreateType.Chat]),
    new Model("abab5", Vendor.Minimax, [CreateType.Chat]),
];

type VendorStrings = keyof typeof Vendor;

export function getModels(type: CreateType, vendor: Vendor): Model[] {
    return AllModels.filter(model => model.vendor == vendor && model.supportedTypes.includes(type));
}
