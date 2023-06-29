import { Chat, Completion, GoogleExecutor } from "prompt-runtime";
import { VscodeLogger } from "../App";


export async function execute(prompt: Chat | Completion): Promise<string> {
    const executor = new GoogleExecutor("ya29.a0AbVbY6Pd4_6s8Wt8KQxgMG5SvB0h_Q9-B3u_9GNux7rhmgmlwmoQ58Ldwxdt1dxn9jLIntHbR4V7jWf8ajQEywuFVuNF0jCEpKsO0YefRJUeZJHbRu8gg9WjSr-xzAe716Z_jb1dsZ4FA7dFtZ9AAB9ITtEHLv8-jpuwgqTVbGOCcOlVbhWA107B7Rw9ifG27Rza6XRodPD0wfban9OB6VSBlUQhBQVekHx_9agXka0a3LQDoMhztPfQf4_DIxhEfE3rH560yqtscIqREVURTUZ4p48V87QS8ZZckruaqYcwSeRWTvUnsqH98PL-QhF-AfYVo5WRM6pwus-sgd0hdS5xlSbWwAMzbM0sAiJF8QdHTg9ztcA2W0tgrO7M4SJYiRB1h7Y7do34fML6pKmRSC0I81kaCgYKAdESARISFQFWKvPlsq5GeIqHromdXZvZrz_j2Q0418", new VscodeLogger());
    const result = await executor.execute(prompt);
    if (!result.success) {
        return "";
    }
    return result.content;
}