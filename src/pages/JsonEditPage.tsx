import { useState } from "react";
import FilePicker, { FilePickerFile } from "../components/FilePicker/FilePicker";
import SaveButton from "../components/General/SaveButton";
import { JsonEditState, JsonEntryEdit } from "../components/Json/JsonEditState";
import JsonEntryComponent from "../components/Json/JsonEntryComponent";
import { downloadFile } from "../util/SaveFile";
import { encodeSP } from "../util/ParserSP";
import ExpandComponent from "../components/General/ExpandComponent";
import CheckBox from "../components/General/CheckBox";

export interface JsonEditProps {
    state: JsonEditState
}


function toEntryEditOriginal(obj: Record<string, any>): JsonEntryEdit | null {

    const originalName = (typeof obj["name"] == "string" ? obj["name"] : undefined);
    if (originalName == undefined || originalName == "") return null;

    const id = (typeof obj["id"] == "number" ? obj["id"] : undefined);
    if (id === undefined) return null;

    const originalDesc = (typeof obj["description"] == "string" ? obj["description"] : undefined);

    return {
        id,
        originalName,
        name: "",
        originalDesc,
        desc: "",
    };
}

function toEntryEditParsed(obj: Record<string, any>): JsonEntryEdit | null {
    const originalName = (typeof obj["originalName"] == "string" ? obj["originalName"] : undefined);
    if (originalName == undefined || originalName == "") return null;

    const id = (typeof obj["id"] == "number" ? obj["id"] : undefined);
    if (id === undefined) return null;

    const name = (typeof obj["nameLasina"] == "string" ? obj["nameLasina"] : "");

    const originalDesc = (typeof obj["originalDescription"] == "string" ? obj["originalDescription"] : undefined);
    const desc = (typeof obj["descriptionLasina"] == "string" ? obj["descriptionLasina"] : undefined);

    return {
        id,
        originalName,
        name,
        originalDesc,
        desc,
    };
}

function toEntryEdit(obj: unknown): JsonEntryEdit | null {
    if (typeof obj != "object" || obj == null) return null;

    if (("parsed" in obj) && obj["parsed"] == true) {
        return toEntryEditParsed(obj);
    }
    else {
        return toEntryEditOriginal(obj);
    }
}


/// TODO!!!
/// Use a json editing UI component from a library
/// Probably easier and much more useful
function JsonEditPage({ state }: JsonEditProps) {

    const [saveErrorText, setSaveErrorText] = useState<string>("");
    const [exportErrorText, setExportErrorText] = useState<string>("");
    const [combineChecked, setCombineChecked] = useState<boolean>(false);

    function fileChanged(newFile: FilePickerFile | null) {
        if (newFile == null) return;
        const fileContent = JSON.parse(newFile.content);
        if (!Array.isArray(fileContent)) return;

        const entryEdits = fileContent
            .map((entry) => toEntryEdit(entry))
            .filter(entry => entry != null);

        state.setFile({ fileName: newFile.name, contents: fileContent })
        state.setEdits(entryEdits);
    }

    function saveFile() {
        if (!state.file) return;
        const newFile = Array.from(state.file.contents);

        try {
            state.edits.forEach(edit => {
                const entry = newFile
                    .filter(entry => entry != null && typeof entry == "object")
                    .find(entry => entry["id"] == edit.id);
                if (entry == undefined) return;

                entry["originalName"] = edit.originalName;
                entry["originalDescription"] = edit.originalDesc;
                entry["nameLasina"] = edit.name;
                entry["descriptionLasina"] = edit.desc;
                entry["parsed"] = true;
            });
        } catch (error) {
            if (error instanceof Error) { console.log(error.message) }
            setSaveErrorText("Couldn't save dialogue file: One or more messages have a parsing error")
            return;
        }

        const oldFileName = state.file.fileName;
        const newFileName = oldFileName.endsWith(".save")
            ?
            oldFileName
            :
            oldFileName + ".save";

        downloadFile(newFileName, JSON.stringify(newFile, null, 2));
        setExportErrorText("");
    }

    function exportFile() {
        if (!state.file) return;
        const newFile = Array.from(state.file.contents);

        try {
            state.edits.forEach(edit => {
                const entry = newFile
                    .filter(entry => entry != null && typeof entry == "object")
                    .find(entry => entry["id"] == edit.id);
                if (entry == undefined) return;

                entry["originalName"] = undefined;
                entry["originalDescription"] = undefined;
                entry["nameLasina"] = undefined;
                entry["descriptionLasina"] = undefined;
                entry["parsed"] = undefined;

                if (edit.name == "") {
                    entry["name"] = edit.originalName;
                } else {
                    entry["name"] = encodeSP(edit.name);
                }
                if (!edit.desc) {
                    entry["description"] = edit.originalDesc;
                } else {
                    entry["description"] = encodeSP(edit.desc);
                }

            });
        } catch (error) {
            if (error instanceof Error) { console.log(error.message) }
            setExportErrorText("Couldn't save dialogue file: One or more messages have a parsing error")
            return;
        }
        const oldFileName = state.file.fileName;
        const newFileName = oldFileName.endsWith(".save")
            ?
            oldFileName.slice(0, oldFileName.length - ".save".length)
            :
            oldFileName;

        downloadFile(newFileName, JSON.stringify(newFile, null, 2));
        setExportErrorText("");
    }

    function editEntry(edit: JsonEntryEdit, index: number) {
        if (state.file == null) return;
        const newEdits = Array.from(state.edits)
        if (combineChecked) {
            newEdits
                .filter(entry => entry.originalName == edit.originalName)
                .map(entry => newEdits.indexOf(entry))
                .forEach(index => {
                    newEdits[index].name = edit.name;
                    newEdits[index].desc = edit.desc;
                });

        } else {
            newEdits[index] = edit;
        }

        state.setEdits(newEdits);
    }

    function updateFile(file: FilePickerFile | null) {
        if (state.file == null) return;
        if (file == null) return;
        const fileContent = JSON.parse(file.content);
        if (!Array.isArray(fileContent)) return;

        state.setFile({ fileName: state.file.fileName, contents: fileContent })
    }
    return (
        <div>
            <ExpandComponent
                headerText="GUIDE"
            >
                <div>
                    You can load these files from the project's data folder:
                    <br />
                    Actors.json, Weapons.json, Armors.json, Skills.json, Items.json, Enemies.json
                    <br />
                    Once loaded, you can edit the name and description of every entry.
                    <br />
                    <br />
                    Using the "EXPORT" button will leave only the sitelen pona text. RPGMaker won't load the file otherwise.
                    <br />
                    The "SAVE" button will save both the sitelen lasina and the original text, but it must be exported to be usable by RPGMaker.
                    <br />
                    <span style={{ color: "red" }}>-- SAVING seems to be broken at the moment. For now just export and discard the original name/desc --</span>
                    <br />
                    If you've changed anything from RPGMaker (for example, edited a skill's script), you can load these changes into your save
                    by clicking the "UPDATE" button and selecting the changed file (must be the same kind of file!)
                    <br />
                    This will load the selected file and apply the currently loaded names and descriptions
                    (don't forget to save/export after)
                    <br />
                    <br />
                    Checking "Combine entries with the same name" will hide repeated entries with the same name and will let you edit all of them at once.
                </div>
            </ExpandComponent>
            <FilePicker accept=".json,.json.save"
                onFileChanged={fileChanged}
                text="LOAD JSON FILE"
                fileName={state.file?.fileName ?? null} />
            <CheckBox checked={combineChecked} setChecked={setCombineChecked} text="Combine entries with the same name" />
            {
                (state.edits ?? [])
                    .filter((entry, index) => {
                        if (!combineChecked) return true;
                        return state.edits.findIndex(findEntry => findEntry.originalName == entry.originalName) == index;
                    })
                    .map((entry, index) =>
                        <JsonEntryComponent
                            data={entry}
                            edit={(edit) => editEntry(edit, index)}
                            key={entry.id + (state.file?.fileName ?? "")}
                        />
                    )
            }

            <FilePicker
                text="UPDATE"
                onFileChanged={updateFile}
                accept=".json"
                fileName={state.file?.fileName ?? null}
                show={(state.edits ?? []).length != 0}
                showFilename={false} />
            <SaveButton
                text="SAVE FILE"
                onClick={() => saveFile()}
                errorText={saveErrorText}
                show={(state.edits ?? []).length != 0} />
            <SaveButton
                text="EXPORT"
                onClick={() => exportFile()}
                errorText={exportErrorText}
                show={(state.edits ?? []).length != 0} />
        </div>

    );
}

export default JsonEditPage;