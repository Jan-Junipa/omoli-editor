import { lasinaToSpDict } from "../util/ParserSP";

function generateNameArrays() {
    const wordsPerLine = 6;
    //const lineLength = 14
    const lineEnd = ["{bksp} {nimiDefault}", "", "", "㊉ ㊊ {larrow} {rarrow} {confirm}"];
    const lineEndLengths = lineEnd.map(str => str.split(" ").filter(str => str != "").length);
    const filteredWords = "ni1 ni2 ni3 ni4 ni5 ni6 ni7 te te1 to to1".split(" ");

    const letters = "aeijklmnopstuw";
    const letterArray = letters.split("");

    const letterKeyboards = letterArray.map(letter => {
        const letterKeyboardName = "nimi" + letter.toUpperCase();
        let letterKeyboard = letterKeyboardName + ": [\n";

        let lines: string[][] = [];
        let currLine = 0;
        Object.entries(lasinaToSpDict)
            .filter(entry => entry[0].startsWith(letter))
            .filter(entry => !filteredWords.includes(entry[0]))
            .sort((entry1, entry2) => entry1[0].localeCompare(entry2[0]))
            .forEach(entry => {
                if (lines[currLine] == undefined) lines[currLine] = [];
                if (lines[currLine].length >= wordsPerLine) currLine++;
                if (lines[currLine] == undefined) lines[currLine] = [];


                lines[currLine].push(entry[1]);
                //console.log(lines);
            })
        const missingLines = 4 - lines.length;
        for (let i = 0; i < missingLines; i++) {
            lines.push([]);
        }
        let maxLineLength = 0;
        lines.forEach((line, lineIndex) => {
            if (line.length + lineEndLengths[lineIndex] > maxLineLength) {
                maxLineLength = line.length + lineEndLengths[lineIndex];
            }
        })

        lines = lines
            .map((line, lineIndex) => {
                const newLine: string[] = [];
                newLine.push(...line);
                const spaceCount = (maxLineLength - lineEndLengths[lineIndex] - line.length);
                //const endSpaces = spaced
                const spaces = "{space} ".repeat(spaceCount).trimEnd().split(" ");
                newLine.push(...spaces);
                newLine.push(...lineEnd[lineIndex].split(" "));
                return newLine.filter(word => word != "");
            });
        lines.forEach(line => {
            letterKeyboard += ("\"");
            letterKeyboard += line.join(" ");
            letterKeyboard += "\",\n";
        });
        letterKeyboard += "],\n"
        return letterKeyboard;

    });
    return letterKeyboards.join("");
}

function NameInputGen() {
    const nameArrays = generateNameArrays();
    return (
        <>
            This page generates the code for the player name input screen
            <br></br>
            <textarea style={{ fontFamily: "omoriSitelen", fontSize: "1em" }}
            defaultValue={nameArrays}></textarea>
        </>
    );
}

export default NameInputGen;