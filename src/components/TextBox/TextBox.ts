import { useState } from "react";
import { encodeSP } from "../../util/ParserSP";

interface TextBoxParams {
    initialSitelenLasina: string;
    //initialSitelenPona: string;
    //onTextChange: (text: string)=>void;
}

function useTextBox(parameters: TextBoxParams) {
    
    const [sitelenLasina, setSitelenLasina] = useState(parameters.initialSitelenLasina);
    const [errorText, setErrorText] = useState("");
    const [sitelenPona, setSitelenPona] = useState<string>(()=>(tryEncodeSitelenPona(sitelenLasina) ?? ""));
    
    function tryEncodeSitelenPona(text: string): string | null{
        try{
            const sp = encodeSP(text);
            setErrorText("");
            return sp;
        }catch(error){
            if(!(error instanceof Error) || error == null) throw error;
            setErrorText(error.message ?? "");
            return null;
        }
    }
    
    function onTextChange(text: string) {
        setSitelenLasina(text);
        setSitelenPona(tryEncodeSitelenPona(text) ?? sitelenPona);
    }
    
    const out = {
        sitelenLasina: sitelenLasina,
        sitelenPona: sitelenPona,
        errorText: errorText,
        onTextChange: onTextChange,
    };

    return out;

}

export default useTextBox;