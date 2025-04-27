import "./CheckBox.css";

interface CheckBoxProps {
    text: string;
    checked: boolean;
    setChecked: (checked: boolean)=>void;
}

function CheckBox(props: CheckBoxProps) {

    return (
        <div className="checkBox" onClick={()=>props.setChecked(!props.checked)}>
            {
                props.checked
                ?
                "☑"
                :
                "☐"
            }
            {
                props.text
            }
        </div>
    );
}

export default CheckBox;