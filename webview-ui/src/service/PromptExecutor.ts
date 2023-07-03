import { Chat, Completion, GoogleExecutor } from "prompt-runtime";
import { VscodeLogger } from "../App";


export async function execute(prompt: Chat | Completion): Promise<string> {
    const executor = new GoogleExecutor("ya29.a0AbVbY6PyVwN7zq0jbje9kORkyX_D2edFDHYUjUgA22LMKWz2RRMrZZoI_poT7oM0scjR4WF9IuI-wWmMT16HTNBd7Z5CJK496FytofzPNxFSXvnPovk5EI5791pzZW510LMSKmJL4OJKG5AfKF927VXgtz4qadBj_UfnDVopzadnM4eDy9nyGti4gkSS1iDsc7pDErzmUQLMbaNnWrAcQutTdoBF9CECbMKBpXAwyKAn4eeFrrxSlrZ-0vW45N2uaZXNtUMfhIBdEZ9VwrIhZ4JVkSg-SNZz3fRXCX6yoR9FWz66PZwKMEVn452fM7sp1NZ3mEPJmnCruhZWPhNYKu7RIiGIrKKz0wGhFST8itL-Vo9e51EuwDpsuRS9L7raaMYLE1FhXmzgo6cY80UJFlFQUwaCgYKAewSARISFQFWKvPltcO_2WWelds3TMzN4kyxJw0417", new VscodeLogger());
    const result = await executor.execute(prompt);
    console.log(result);
    if (!result.success) {
        return "";
    }
    return result.content;
}