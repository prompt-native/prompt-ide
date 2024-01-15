import { Message } from "prompt-schema";
import { useState } from "react";
import MessageItem from "./MessageItem";

interface MessagesProps {
    items: Message[];
    onMessageChanged?: (index: number, message: Message) => void;
    onMessageDeleted?: (index: number) => void;
    onMessageInserted?: (index: number) => void;
}

function Messages({ items, onMessageChanged, onMessageDeleted, onMessageInserted }: MessagesProps) {
    const [activeIndex, setActiveIndex] = useState<number>(-1);

    return (
        <>
            {items.map((message, index) => {
                return (
                    <MessageItem
                        selected={activeIndex === index}
                        onClick={() => setActiveIndex(index)}
                        key={index}
                        messageIndex={index}
                        message={message}
                        onMessageChanged={onMessageChanged}
                        onMessageDeleted={items.length > 1 ? onMessageDeleted : undefined}
                        onMessageInserted={onMessageInserted}
                        rows={items.length == 1 && items[0].role == "user" ? 10 : undefined}
                    />
                );
            })}
        </>
    );
}

export default Messages;
