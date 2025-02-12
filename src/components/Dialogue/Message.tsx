import "./Message.css";
import TextEdit from "../General/TextEdit";

export interface MessageProps {
    originalText: string;
    initialSitelenLasina: string;
    onEdit: (textLasina: string)=>void;
}

function Message({originalText, initialSitelenLasina, onEdit}: MessageProps) {
    
    return (
        <div className="omoriBox">
            <TextEdit
            originalText={originalText}
            initialSitelenLasina={initialSitelenLasina}
            onTextChange={text=>onEdit(text)}
            />
        </div>
    )
}

export default Message;