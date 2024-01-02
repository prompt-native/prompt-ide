import { Function } from "prompt-schema";
import Collapse from "./Collapse";

interface FunctionItemProps {
    index: number;
    functionDefination: Function;
    onMessageChanged: (index: number, role: string, content: string) => void;
    onMessageDeleted?: (index: number) => void;
    onMessageInserted?: (index: number) => void;
    rows?: number;
}

function getIcon(role: string): string {
    switch (role) {
        case "user":
            return "feedback";
        case "assistant":
            return "robot";
    }
    return "question";
}
function FunctionItem({
    index,
    functionDefination,
    onMessageChanged,
    onMessageDeleted,
    onMessageInserted,
    rows,
}: FunctionItemProps) {
    const params = functionDefination.parameters?.map((p) => p.name).join(", ") || "";
    const methodName = `${functionDefination.name}(${params})`;
    return (
        <Collapse
            children={
                <div className="flex flex-column mb-10">
                    {functionDefination.description && <p>{functionDefination.description}</p>}

                    {functionDefination.parameters && (
                        <div className="flex flex-column">
                            {functionDefination.parameters?.map((param) => (
                                <div key={JSON.stringify(param)}>
                                    {param.required && <span className="danger">*</span>}
                                    <strong>{param.name}</strong>
                                    {param.enums && <span>[{param.enums.join(", ")}]</span>}
                                    {param.description && (
                                        <>
                                            <span>:</span>
                                            <span className="ml-10">{param.description}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            }
            title={methodName}
        />
    );
}

export default FunctionItem;
