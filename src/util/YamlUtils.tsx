import { Document, Pair, Scalar, YAMLMap } from "yaml";
import { MessageList, ParsedMessage } from "../pages/DialoguePage";

/*
function getAttributeInternal(map: YAMLMap, attrName: string): unknown {
    const attr = map.items.find(item => (item.key instanceof Scalar) && ((typeof item.key.value) == "string") && item.key.value == attrName);
    if(attr == null) return null;
    if(!(attr.value instanceof Scalar)) return null;
    return attr.value.value ?? null;
    return null;
}
*/

function getMessageAttribute(document: Document.Parsed, messageId: string, attrName: string): unknown {
    const attrScalar = document.getIn([messageId, attrName])
    return attrScalar;
}

export function getMessageString(document: Document.Parsed, messageId: string, attrName: string): string | null {
    const attr = getMessageAttribute(document, messageId, attrName);
    if(typeof attr != "string") return null;
    return attr;
}
export function getMessageBool(document: Document.Parsed, messageId: string, attrName: string): boolean | null {
    const attr = getMessageAttribute(document, messageId, attrName);
    if(typeof attr != "boolean") return null;
    return attr;
}

export function setMessageAttribute(document: Document.Parsed, messageId: string, attrName: string, value: unknown) {
    document.setIn([messageId, attrName], value);
}


// File has been parsed before
function parseMessage(document: Document.Parsed, messageId: string): ParsedMessage | null {
    const originalText = getMessageString(document, messageId, "originalText");
    if(originalText == null) return null;
    const sitelenLasina = getMessageString(document, messageId, "sitelenLasina");
    if(sitelenLasina == null) return null;
    const spText = getMessageString(document, messageId, "text");
    if(spText == null) return null;
    
    const message: ParsedMessage = {messageId: messageId, originalText, sitelenLasina: sitelenLasina, spText};
    return message;
}

// File has the original format (first time parsing)
function parseMessageOriginal(document: Document.Parsed, messageId: string): ParsedMessage | null {
    const originalText = getMessageString(document, messageId, "text");
    if(originalText == null) return null;
    const sitelenLasina = ""
    const spText = "";
    if(spText == null) return null;
    
    const message: ParsedMessage = {messageId, originalText, sitelenLasina: sitelenLasina, spText};
    return message;
}

export function getMessages(document: Document.Parsed): MessageList | null {
    if (!(document.contents instanceof YAMLMap) || document.contents == null) {
        return null;  
    }
    const messageList: MessageList = {};
    document.contents.items
    .map(item => {
        if(!(item instanceof Pair)) return null;
        if(!(item.key instanceof Scalar)) return null; 
        const messageId = item.key.value;
        if(typeof messageId != "string") return null;
        if(!(item.value instanceof YAMLMap)) return null;
        const parsedBool = getMessageBool(document, messageId , "parsed");
        const message = !parsedBool ? parseMessageOriginal(document, messageId) : parseMessage(document, messageId);
        return message;
    })
    .filter(item => item != null)
    .forEach(message => {
        messageList[message.messageId] = message;
    });
    
    return messageList;
}