import { useState } from "react";
import Tab from "../Tab/Tab";
import DialoguePage from "../../../pages/DialoguePage";
import  "./TabNav.css";
import WritePage from "../../../pages/WritePage";
import useDialogueState from "../../Dialogue/DialogueState";
import JsonEditPage from "../../../pages/JsonEditPage";
import useJsonFileState from "../../Json/JsonEditState";
import NameInputGen from "../../../pages/NameInputGenPage";

interface TabAttributes {
    text: string,
    component: JSX.Element,
}



function TabNav() {
    const [selectedTab, selectTab] = useState(0);
    const dialogueState = useDialogueState();
    const jsonFileState = useJsonFileState();


    const TABS: TabAttributes[] = [
        {
            text: 'WRITE',
            component: <WritePage/>
        },
        {
            text: 'DIALOGUE',
            component: <DialoguePage state={dialogueState} />
        },
        {
            text: "DATA",
            component: <JsonEditPage state={jsonFileState} />
        },
        {
            text: "NAME INPUT",
            component: <NameInputGen />
        },
    ]
    return (
    <div>
        <div className={"navTabs omoriBox"}>
            {
            TABS.map((elem, index) => 
                <Tab 
                text={elem.text} 
                onClick={()=>{selectTab(index)}}
                selected={selectedTab==index}
                key={index}/>
                )
            }
        </div>
    {TABS[selectedTab].component}
    </div>
    );
}

export default TabNav;