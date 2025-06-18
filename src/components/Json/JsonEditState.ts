import { useEffect, useState } from "react";

export type JsonEntry = Record<string, any>;

export interface JsonFile {
    contents: JsonEntry[];
    fileName: string;
}

export interface JsonEntryEdit {
    id: number;
    originalName: string;
    name: string;
    originalDesc?: string;
    desc?: string;
}

export interface JsonEditState {
    file: JsonFile | null;
    edits: JsonEntryEdit[];
    setFile: (file: JsonFile | null)=>void;
    setEdits: (edits: JsonEntryEdit[])=>void; 
}

function useJsonFileState(): JsonEditState {
    
    const [file, setFile] = useState<JsonFile | null>(()=>{
        const file = JSON.parse(localStorage.getItem("jsonFile") ?? "null");
        if(!file) return null;
        return file;
    });

    const [edits, setEdits] = useState<JsonEntryEdit[]>(()=>{
        const changedEdits = JSON.parse(localStorage.getItem("jsonEdits") ?? "null") ?? [];
        return changedEdits;
    });

    useEffect(()=>{
        if(file) {
           localStorage.setItem("jsonFile", JSON.stringify(file));
        } else {
            localStorage.removeItem("jsonFile");
        }
    },[file]);

    useEffect(()=>{
        localStorage.setItem("jsonEdits", JSON.stringify(edits));
    }, [edits]);

    return {
        file,
        edits,
        setFile,
        setEdits
    };
}

export default useJsonFileState;