import { useState } from "react";
import "./DialoguePage.css";
import FilePicker, { FilePickerFile } from "../components/FilePicker/FilePicker";
import { parseDocument, YAMLMap, Document } from 'yaml'
import { getMessages } from "../util/YamlUtils";
import Message from "../components/Dialogue/Message";
import { encodeSP } from "../util/ParserSP";
import SaveButton from "../components/General/SaveButton";
import { downloadFile } from "../util/SaveFile";


export interface MessageEdits {
    [Key: string]: string;
}
export interface ParsedYaml {
    fileName: string,
    document: Document.Parsed
}

export interface ParsedMessage {
    messageId: string;
    originalText: string;
    sitelenLasina: string;
    spText: string;
}

export interface MessageList {
    [Key: string]: ParsedMessage;
}

export interface DialogueState {
    file: ParsedYaml | null;
    messages: MessageList;
    setFile: (file: ParsedYaml | null) => void;
    setMessages: (messages: MessageList) => void;
}

export interface DialogueProps {
    state: DialogueState
}

function DialoguePage(props: DialogueProps) {
    const file = props.state.file;
    const messages = props.state.messages;
    const setFile = props.state.setFile;
    const setMessages = props.state.setMessages;
    const [saveErrorText, setSaveErrorText] = useState<string>("");

    const saveDialogue = () => {
        if (!file) return;
        const yamlDocument = file.document;
        if (document == null) return;
        const contents = file.document.contents;
        if (contents == null || !(contents instanceof YAMLMap)) return;

        try {
            Object.values(messages).forEach(message => {
                if (message.sitelenLasina == "") return;
                yamlDocument.setIn([message.messageId, "sitelenLasina"], message.sitelenLasina);
                yamlDocument.setIn([message.messageId, "text"], encodeSP(message.sitelenLasina));
                yamlDocument.setIn([message.messageId, "originalText"], message.originalText);
                yamlDocument.setIn([message.messageId, "parsed"], true);
            })
        } catch (error) {
            if (error instanceof Error) { console.log(error.message) }
            setSaveErrorText("Couldn't save dialogue file: One or more messages have a parsing error")
            return;
        }
        downloadFile(file?.fileName, yamlDocument.toString({ lineWidth: 0, minContentWidth: 0 }));
    }

    const fileChanged = (newFile: FilePickerFile | null) => {
        if (newFile == null) {
            setMessages({});
            setFile(null);
            return;
        }
        const document = parseDocument(newFile.content);
        if (!(document.contents instanceof YAMLMap) || document.contents == null) {
            setMessages({});
            setFile(null);
            return;
        }

        setFile({ fileName: newFile.name, document });
        const parsedMessages = getMessages(document) ?? {};
        setMessages(parsedMessages);
    }

    function editMessage(text: string, messageId: string) {
        const newMessages = Object.assign({}, messages);
        newMessages[messageId].sitelenLasina = text;
        setMessages(newMessages);
    }
    return <>
        <FilePicker
            text="LOAD DIALOGUE FILE"
            accept=".yaml"
            fileName={file?.fileName ?? null}
            onFileChanged={fileChanged}></FilePicker>
        {
            Object.values(messages).map(message =>
                <Message
                    key={message.messageId + file?.fileName}
                    initialSitelenLasina={message.sitelenLasina}
                    originalText={message.originalText}
                    onEdit={(textLasina) => { editMessage(textLasina, message.messageId) }}
                />
            )
        }

        <SaveButton text="SAVE FILE"
            onClick={() => saveDialogue()}
            errorText={saveErrorText}
            show={Object.keys(messages).length != 0}
            />
    </>
}

export default DialoguePage;