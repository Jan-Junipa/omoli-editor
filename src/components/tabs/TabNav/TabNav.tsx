import { useState } from "react";
import Tab from "../Tab/Tab";
import DialoguePage from "../../pages/DialoguePage";
import  "./TabNav.css";
import WIPPage from "../../pages/WIPPage";
import WritePage from "../../pages/WritePage";
import useDialogueState from "../../Dialogue/DialogueState";

interface TabAttributes {
    text: string,
    component: JSX.Element,
}



function TabNav() {
    const [selectedTab, selectTab] = useState(0);
    const dialogueState = useDialogueState();

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
            text: "WEAPONS",
            component: <WIPPage/>
        },
        {
            text: "CHARMS",
            component: <WIPPage/>
        },
        {
            text: "SKILLS",
            component: <WIPPage/>
        }
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