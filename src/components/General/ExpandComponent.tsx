import { useRef, useState } from "react";
import "./ExpandComponent.css";

interface ExpandComponentProps {
    headerText: string;
    children?: JSX.Element;
}

function ExpandComponent(props: ExpandComponentProps) {

    const [guideToggle, setGuideToggle] = useState<boolean>(false);

    const ref = useRef<HTMLDivElement>(null);
    const expandScrollHeight = ref.current instanceof HTMLDivElement ? ref.current.scrollHeight : 0;

    return (
            <div className="expandContainer">
                <div className="omoriBox expandToggle" onClick={()=>setGuideToggle(!guideToggle)}>
                    <div className="expandHeader">
                        {props.headerText}
                    </div>
                    <div className="expandContentContainer" >
                        <div ref={ref} className="expandContent" style={{height:(guideToggle ? expandScrollHeight : 0)}}>
                            {props.children}               
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default ExpandComponent;

