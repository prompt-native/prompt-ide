import { Chat, Completion, GoogleExecutor } from "prompt-runtime";
import { VscodeLogger } from "../App";


export async function execute(prompt: Chat | Completion): Promise<string> {
    const executor = new GoogleExecutor("ya29.a0AbVbY6MMkMyG2fyzOf0QiNi0L0asTl0Bos66FjB7QuvFF7koGFmTDJD_Sx8sDYYrvewGX1BUckvlvEMa6fM63eHRjZeviV8NHW_65bt7jE29RuA290AcTBfK_MTdIbVsw15VYLkxqqV5K9fV1WL8Ocot9rF__GzBXxsIBvWSLrV9zzMZIUrpcf126MP9MMaGMMBHA4aAWv5Jw183UuurxZj82LAFUShCX9hxDAE10jx-Q39SFTv4IURIO0iznSr7t5t95kwvd8X2IaIZ2qxoP5h4XA0jFW6EmmLS86R3Wix687g7MA4PF3LSdN4K1O31eXU5Y1_uT0OI1W4UdbTpV1sBYOLhk91kOHSELB1LEftAvUn4t19fVaIen4thjnYbUWStZ_pqunyX2b0AkcZ5NDZn1aQaCgYKAc8SARISFQFWKvPlagMqjf-hUugDlteLdKQjiw0418", new VscodeLogger());
    const result = await executor.execute(prompt);
    console.log(result);
    if (!result.success) {
        return "";
    }
    return result.content;
}