import "./Message.css";
import useTextBox from "../TextBox/TextBox";

export interface MessageProps {
    originalText: string;
    initialSitelenLasina: string;
    onEdit: (textLasina: string)=>void;
}

function Message({originalText, initialSitelenLasina, onEdit}: MessageProps) {
    const {sitelenLasina, sitelenPona, errorText, onTextChange} = useTextBox({initialSitelenLasina});
    
    function onTextEvent(text: string) {
        onTextChange(text);
        onEdit(text);
    }

    return (
        <div className="messageContainer">
            <div className="originalTextBox">
                {originalText}
            </div>
            <div className="newTextContainer">
                <div className="lasinaTextBox">
                    <textarea 
                    className="lasinaTextInput" value={sitelenLasina} onChange={e=>onTextEvent(e.target.value)}></textarea>
                </div>
                <div className="spTextBox omoriBox">
                    {sitelenPona}
                </div>
            </div>
            <div className="messageErrorTextBox">
                    {errorText}
                </div>
        </div>
    )
}

export default Message;