import { useRef, useState } from "react";
import "./WritePage.css";
import useTextBox from "../TextBox/TextBox";

function WritePage() {

    const {sitelenLasina, sitelenPona, errorText, onTextChange} = useTextBox({initialSitelenLasina: ""});
    const [clipboardConfirm, setClipboardConfirm] = useState("");
    const [clipboardError, setClipboardError] = useState(false);
    const [copyHover, setCopyHover] = useState(false);
    const [guideToggle, setGuideToggle] = useState(false);

    const guideRef = useRef<HTMLDivElement>(null);
    const guideScrollHeight = guideRef.current instanceof HTMLDivElement ? guideRef.current.scrollHeight : 0;

    const saveText = ()=> {
        if(errorText != "") {
            setClipboardError(true);
            setClipboardConfirm("Couldn't save to clipboard: Parse error");
            return;
        }
        navigator.clipboard.writeText(sitelenPona).then(() => {
            setClipboardError(false);
            setClipboardConfirm("Text saved to clipboard");
         }).catch(err => {
            setClipboardError(true);
            if(err instanceof Error){
                setClipboardConfirm("Couldn't save to clipboard: " + err.message);
            } else {
                setClipboardConfirm("Couldn't save to clipboard");
            }
         });
    }

    return (
        <div className="writePageContainer">
            <div className="guideContainer">
                <div className="omoriBox guideToggle" onClick={()=>setGuideToggle(!guideToggle)}>
                    <div className="guideHeader">
                        GUIDE
                    </div>
                    <div className="guideTextContainer" >
                        <div ref={guideRef} className="guide" style={{height:(guideToggle ? guideScrollHeight : 0)}}>
                            Toki pona words will be converted to sitelen pona
                            <br />
                            <br/>
                            Text between /* and */ will be left as-is:
                            <br />
                            /*\kel*/ mi wawa a =&gt; \kel㈴㉵㈀
                            <br />
                            <br />
                            "[]" will create a cartouche:
                            <br />
                            jan [jelo utala ni : pana ·] =&gt; ㈑㐦㈒㉱㉁㊊㉌㊉㐓
                            <br />
                            <br />
                            "pi[" will start a long pi:
                            <br />
                            jan pi[pona mute] =&gt; ㈑㑒㉔㈼
                            <br />
                            <br />
                            "_" will create a space with the width of a single character:
                            <br />
                            toki a _ seme li lon =&gt; ㉬㈀ㇱ㉙㈧㈬
                            <br />
                            <br />
                            Some characters have variations:
                            <br />
                            ni ni1 ni2 ni3 ni4 ni5 ni6 ni7: ㉁㐀㐁㐂㐃㐄㐅㐆
                            <br />
                            te toki a to _ te1 toki a to1 =&gt; ㊋㉬㈀㊌ㇱ㊍㉬㈀㊎
                                                    
                        </div>
                    </div>
                </div>
            </div>

            <textarea 
            className="sitelenLasinaWrite" 
            value={sitelenLasina} 
            onChange={e=>onTextChange(e.target.value)}/>
            <div className="spTextBoxWrite omoriBox ">
                {sitelenPona}
            </div>
            {
                errorText 
                ?
                <div className="errorMessage" >{errorText}</div>
                :
                null
            }
            <button 
            onMouseEnter={()=>setCopyHover(true)} 
            onMouseLeave={()=>setCopyHover(false)} 
            onClick={()=> saveText()}
            className={"saveDialogueBox omoriBox " + (copyHover ? "selectHand" : "")}> 
                COPY TO CLIPBOARD
            </button>
            {
                clipboardConfirm 
                ?
                <div className={clipboardError ? "errorMessage" : ""} >{clipboardConfirm}</div>
                :
                null
            }
        </div>
    )
}

export default WritePage;