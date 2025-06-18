import { useEffect, useState } from "react";
import { MessageList, ParsedYaml } from "../../pages/DialoguePage";
import { parseDocument } from "yaml";

function useDialogueState() {
    const [file, setFile] = useState<ParsedYaml | null>((): ParsedYaml | null => {
        const fileRaw = JSON.parse(localStorage.getItem("dialogueFile") ?? "null");
        if (!fileRaw) return null;
        if(!fileRaw.document) return null;
        if(!fileRaw.fileName) return null;
        
        const document = parseDocument(fileRaw.document);
        return {fileName: fileRaw.fileName, document};
    });
    const [messages, setMessages] = useState<MessageList>(() => {
        const messages = JSON.parse(localStorage.getItem("dialogueMessages") ?? "null");
        if (messages == null) return {};
        return messages;
    });

    useEffect(() => {
        if (file) {
            localStorage.setItem("dialogueFile", 
                JSON.stringify({ 
                    fileName: file.fileName, 
                    document: file?.document.toString({ lineWidth: 0, minContentWidth: 0})
                }));
        } else {
            localStorage.setItem("dialogueFile", "");
        }
    }, [file]);

useEffect(() => {
    localStorage.setItem("dialogueMessages", JSON.stringify(messages));
}, [messages]);

return {
    file,
    messages,
    setFile,
    setMessages
};
}

export default useDialogueState;