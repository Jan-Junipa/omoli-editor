import TextEdit from "../General/TextEdit";
import useTextBox from "../TextBox/TextBox";
import { JsonEntryEdit } from "./JsonEditState";
import "./JsonEntryComponent.css";


interface JsonEntryProps {
    data: JsonEntryEdit;
    edit: (data: JsonEntryEdit) => void;
}

function JsonEntryComponent(props: JsonEntryProps) {
    const textBoxName = useTextBox({ initialSitelenLasina: props.data.name });
    const textBoxDescription = useTextBox({ initialSitelenLasina: props.data.desc ?? "" });

    function onNameChange(text: string) {
        textBoxName.onTextChange(text);
        props.edit({
            id: props.data.id,
            originalName: props.data.originalName,
            name: text,
            originalDesc: props.data.originalDesc,
            desc: props.data.desc
        });
    }
    function onDescriptionChange(text: string) {
        textBoxDescription.onTextChange(text);
        props.edit({
            id: props.data.id,
            originalName: props.data.originalName,
            name: props.data.name,
            originalDesc: props.data.originalDesc,
            desc: text
        });
    }

    return (
        props.data.originalDesc 
        ?
            <div className="omoriBox">
                <TextEdit
                    originalText={props.data.originalName}
                    initialSitelenLasina={props.data.name}
                    onTextChange={text => onNameChange(text)}
                    key="name"
                />
                <TextEdit
                    originalText={props.data.originalDesc ?? ""}
                    initialSitelenLasina={props.data.desc ?? ""}
                    onTextChange={text => onDescriptionChange(text)}
                    key="desc"
                />
            </div>
            :
            <div className="omoriBox">
                <TextEdit
                    originalText={props.data.originalName}
                    initialSitelenLasina={props.data.name}
                    onTextChange={text => onNameChange(text)}
                    key="nameNoDesc"
                />
            </div>

    );
}

export default JsonEntryComponent;