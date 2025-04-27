import "./Tab.css";
interface TabProps {
    text: string;
    selected: boolean;
    onClick: ()=>void;
}

function Tab(props: TabProps) {
    const className = "tabText" + (props.selected ? " selectHand" : "");
    return (
        <span onClick={()=>props.onClick()}
            className={className}>
                {props.text}
        </span>
    );
}

export default Tab;