import { useState } from "react";
import "./DialoguePage.css";
import FilePicker, { FilePickerFile } from "../FilePicker/FilePicker";
import { parseDocument, YAMLMap, Document } from 'yaml'
import { getMessages } from "../../util/YamlUtils";
import Message from "../Dialogue/Message";
import { encodeSP } from "../../util/ParserSP";


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
    setFile: (file: ParsedYaml | null)=>void;
    setMessages: (messages: MessageList)=>void;
}

export interface DialogueProps {
    state: DialogueState
}

function DialoguePage(props: DialogueProps) {
    const file = props.state.file;
    const messages = props.state.messages;
    const setFile = props.state.setFile;
    const setMessages = props.state.setMessages;

    //const [file, setFile] = useState<ParsedYaml | null>(null);
    //const [messages, setMessages] = useState<MessageList>({});+
    const [saveHover, setSaveHover] = useState<boolean>(false);
    const [saveErrorText, setSaveErrorText] = useState<string>("");
    
    const saveDialogue = ()=>{
        if(!file) return;
        const yamlDocument = file.document;
        if(document == null) return;
        const contents = file.document.contents;
        if(contents == null || !(contents instanceof YAMLMap) ) return;
        
        try{
           Object.values(messages).forEach(message=>{
                if(message.sitelenLasina == "") return;
                yamlDocument.setIn([message.messageId, "sitelenLasina"], message.sitelenLasina);
                yamlDocument.setIn([message.messageId, "text"], encodeSP(message.sitelenLasina));
                yamlDocument.setIn([message.messageId, "originalText"], message.originalText);
                yamlDocument.setIn([message.messageId, "parsed"], true);
           })
        }catch(error) {
            if(error instanceof Error){console.log(error.message)}
            setSaveErrorText("Couldn't save dialogue file: One or more messages have a parsing error")
            return;
        }
        
        const element = document.createElement('a');
        
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(yamlDocument.toString({lineWidth:0, minContentWidth: 0})));
        element.setAttribute('download', file?.fileName);
        
        element.style.display = 'none';
        document.body.appendChild(element);
        
        element.click();
        
        document.body.removeChild(element);
        
    }

    const fileChanged = (newFile: FilePickerFile | null) => {
        if(newFile == null){
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

        setFile({fileName: newFile.name, document});
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
        onFileChanged={fileChanged}></FilePicker>
        {
        Object.values(messages).map(message => {
            
            return(
            <Message 
            key={message.messageId + file?.fileName} 
            initialSitelenLasina={message.sitelenLasina} 
            originalText={message.originalText}
            onEdit={(textLasina)=>{editMessage(textLasina, message.messageId)}}
            />)}
        )}
        {
            Object.keys(messages).length == 0 
            ? 
            null 
            : 
            <button 
            onMouseEnter={()=>setSaveHover(true)} 
            onMouseLeave={()=>setSaveHover(false)} 
            onClick={()=> saveDialogue()}
            className={"saveDialogueBox omoriBox " + (saveHover ? "selectHand" : "")}> 
                SAVE FILE 
            </button>
        }
        {
            saveErrorText 
            ?
            <div className="errorMessage"> {saveErrorText} </div>
            :
            null
        }
        
    </>
}

export default DialoguePage;