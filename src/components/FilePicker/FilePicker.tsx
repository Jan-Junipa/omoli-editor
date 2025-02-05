import { ChangeEventHandler, useState } from "react";
import "./FilePicker.css";

export interface FilePickerFile {
    name: string;
    content: string;
}

interface FilePickerProps {
    accept: string;
    text: string;
    onFileChanged: (file: FilePickerFile | null)=>void;
    onMouseEnter?: ()=>void;
    onMouseLeave?: ()=>void;

}

function FilePicker(props: FilePickerProps) {

    const [fileName, setFileName] = useState<string |null>(null);
    const [hover, setHover] = useState<boolean>(false);

    const onFileChanged:ChangeEventHandler = event => {
        const target: HTMLInputElement = (event.target as HTMLInputElement);
        if(target.files == null) return;
        
        if(target.files?.length == 0) {
            props.onFileChanged(null)
            return;
        }

        const file:File = target.files[0];

        const reader = new FileReader();
        reader.readAsText(file,'UTF-8');
        
        reader.onload = readerEvent => {
            if(readerEvent.target == null) return;
            const content = readerEvent.target.result;
            if(content == null) {
                props.onFileChanged(null);
                return;
            }
            props.onFileChanged({name: file.name, content: content as string})
            setFileName(file.name);
        }
    }

    return (
    <>
            <label 
            className={"omoriBoxSmall fileInput " + (hover ? "selectHand" : "")} 
            htmlFor="dialogueFileInput"
            onMouseEnter={()=>setHover(true)}
            onMouseLeave={()=>setHover(false)}> {props.text} </label>
            <input onChange={onFileChanged} type="file" accept={props.accept} name="dialogueFileInput" id="dialogueFileInput" />
            {fileName ? <p>{fileName}</p> : null}
    </>
    );
}

export default FilePicker;