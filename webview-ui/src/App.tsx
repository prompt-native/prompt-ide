import "./App.css";
import PromptEditor from "./components/PromptEditor";

enum EditorType {
    Completion = "completion",
    Chat = "chat",
}

function App() {
    return (
        <PromptEditor />
    );
}

export default App;
