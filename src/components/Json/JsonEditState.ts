import { useState } from "react";

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
    const [file, setFile] = useState<JsonFile | null>(null);
    const [edits, setEdits] = useState<JsonEntryEdit[]>([]);

    return {
        file,
        edits,
        setFile,
        setEdits
    };
}

export default useJsonFileState;