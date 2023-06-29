import { Chat, Completion, GoogleExecutor } from "prompt-runtime";
import { VscodeLogger } from "../App";


export async function execute(prompt: Chat | Completion): Promise<string> {
    const executor = new GoogleExecutor("ya29.a0AbVbY6MiXfA1qmc23JKWcc-lIKZqqZG7vqHVP5MAW2Gtw3Z51GUQ7bxiAVIVCZGmK9su6CbIdWwbBs3__tTGgo3CCXiQwGfeaKyd_aq77MrsV5ac7s6kwdLnad14o6_9WidkpbmuUjue9DCN8maJvVjVwVz4ECOOShRd-xniVnLYeVSCHr3hql-2CM6IhBX5w8PJELb0Oih5A95az_RWzSZEvvGsaSDzPfIfdkVMCn4UeFxCgjPZnO4vmWXkVF_OEg9E_wfD-0-dXRETbjLwUIXmxjijmgMGtS_sE-LBqqixCbiyxImpyiwOTZkxQvuPobjWk2gbibJZZu0DKmj54Y_o2y0SFjtqJBMG5nFvPFPN8UVWVR8K53kHjlkPGWnucB4C6MfsqSvPhfD6H8RbRhZo7rYaCgYKAU8SARISFQFWKvPl8IPXYunl_svyEppSrewL4w0418", new VscodeLogger());
    const result = await executor.execute(prompt);
    if (!result.success) {
        return "";
    }
    return result.content;
}