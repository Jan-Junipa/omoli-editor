import { useState } from "react";
import "./SaveButton.css";

interface SaveButtonProps {
    text: string;
    show?: boolean;
    errorText?: string;
    onClick: ()=>void;
}

function SaveButton(props: SaveButtonProps) {
    const [saveHover, setSaveHover] = useState<boolean>(false);
    return (
        <>
        {
            props.show
            ? 
            <button 
            onMouseEnter={()=>setSaveHover(true)} 
            onMouseLeave={()=>setSaveHover(false)} 
            onClick={()=> props.onClick()}
            className={"saveDialogueBox omoriBox " + (saveHover ? "selectHand" : "")}> 
                {props.text}
            </button>
            : 
            null 
        }
        {
            props.errorText 
            ?
            <div className="errorMessage"> {props.errorText} </div>
            :
            null
        }
        </>
    );
}

export default SaveButton;