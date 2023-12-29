import { Message } from "prompt-schema";
import MessageItem from "./MessageItem";

interface MessagesProps {
    items: Message[];
    onMessageChanged: (index: number, role: string, content: string) => void;
    onMessageDeleted?: (index: number) => void;
    onMessageInserted?: (index: number) => void;
}

function Messages({ items, onMessageChanged, onMessageDeleted, onMessageInserted }: MessagesProps) {
    return (
        <>
            {items.map((message, index) => {
                return (
                    <MessageItem
                        key={index}
                        index={index}
                        message={message}
                        onMessageChanged={onMessageChanged}
                        onMessageDeleted={items.length > 1 ? onMessageDeleted : undefined}
                        onMessageInserted={onMessageInserted}
                    />
                );
            })}
        </>
    );
}

export default Messages;
