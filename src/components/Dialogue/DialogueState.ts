import { useState } from "react";
import { MessageList, ParsedYaml } from "../../pages/DialoguePage";

function useDialogueState() {
    const [file, setFile] = useState<ParsedYaml | null>(null);
    const [messages, setMessages] = useState<MessageList>({});
    return {
        file,
        messages,
        setFile,
        setMessages
    };
}

export default useDialogueState;