import useTextBox from "../TextBox/TextBox";
import "./TextEdit.css";

interface TextEditProps {
    originalText: string;
    initialSitelenLasina: string;
    containerClass?: string;
    textInputClass?: string;
    onTextChange: (text: string)=>void;
}

function TextEdit(props: TextEditProps) {
    const textBox = useTextBox({initialSitelenLasina: props.initialSitelenLasina});

    
    function onTextEvent(text: string) {
        textBox.onTextChange(text);
        props.onTextChange(text);
    }

    return(

    <div className={"textBoxContainer " + (props.containerClass ?? "")}>
        <div className="textBoxOriginal">
            {props.originalText}
        </div>
        <div className="newTextContainer">
            <div className="textBoxLasinaContainer">
                <textarea 
                className={"textBoxLasinaInput " +  (props.textInputClass ?? "")}
                value={textBox.sitelenLasina}
                onChange={e=>onTextEvent(e.target.value)}/>
            </div>
            <div className="textBoxSitelenPona omoriBox">
                {textBox.sitelenPona}
            </div>
        </div>
        <div className="textBoxErrorMessage">
                {textBox.errorText}
        </div>
    </div>
        )
}

export default TextEdit;