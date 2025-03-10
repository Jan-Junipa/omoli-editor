export const lasinaToSpDict: {[id: string]: string} = {
    "a":"㈀",
    "akesi":"㈁",
    "ala":"㈂",
    "alasa":"㈃",
    "ale":"㈄",
    "anpa":"㈅",
    "ante":"㈆",
    "anu":"㈇",
    "awen":"㈈",
    "e":"㈉",
    "en":"㈊",
    "esun":"㈋",
    "ijo":"㈌",
    "ike":"㈍",
    "ilo":"㈎",
    "insa":"㈏",
    "jaki":"㈐",
    "jan":"㈑",
    "jelo":"㈒",
    "jo":"㈓",
    "kala":"㈔",
    "kalama":"㈕",
    "kama":"㈖",
    "kasi":"㈗",
    "ken":"㈘",
    "kepeken":"㈙",
    "kili":"㈚",
    "kiwen":"㈛",
    "ko":"㈜",
    "kon":"㈝",
    "kule":"㈞",
    "kulupu":"㈟",
    "kute":"㈠",
    "la":"㈡",
    "lape":"㈢",
    "laso":"㈣",
    "lawa":"㈤",
    "len":"㈥",
    "lete":"㈦",
    "li":"㈧",
    "lili":"㈨",
    "linja":"㈩",
    "lipu":"㈪",
    "loje":"㈫",
    "lon":"㈬",
    "luka":"㈭",
    "lukin":"㈮",
    "lupa":"㈯",
    "ma":"㈰",
    "mama":"㈱",
    "mani":"㈲",
    "meli":"㈳",
    "mi":"㈴",
    "mije":"㈵",
    "moku":"㈶",
    "moli":"㈷",
    "monsi":"㈸",
    "mu":"㈹",
    "mun":"㈺",
    "musi":"㈻",
    "mute":"㈼",
    "nanpa":"㈽",
    "nasa":"㈾",
    "nasin":"㈿",
    "nena":"㉀",
    "ni":"㉁",
    "nimi":"㉂",
    "noka":"㉃",
    "o":"㉄",
    "olin":"㉅",
    "ona":"㉆",
    "open":"㉇",
    "pakala":"㉈",
    "pali":"㉉",
    "palisa":"㉊",
    "pan":"㉋",
    "pana":"㉌",
    "pi":"㉍",
    "pilin":"㉎",
    "pimeja":"㉏",
    "pini":"㉐",
    "pipi":"㉑",
    "poka":"㉒",
    "poki":"㉓",
    "pona":"㉔",
    "pu":"㉕",
    "sama":"㉖",
    "seli":"㉗",
    "selo":"㉘",
    "seme":"㉙",
    "sewi":"㉚",
    "sijelo":"㉛",
    "sike":"㉜",
    "sin":"㉝",
    "sina":"㉞",
    "sinpin":"㉟",
    "sitelen":"㉠",
    "sona":"㉡",
    "soweli":"㉢",
    "suli":"㉣",
    "suno":"㉤",
    "supa":"㉥",
    "suwi":"㉦",
    "tan":"㉧",
    "taso":"㉨",
    "tawa":"㉩",
    "telo":"㉪",
    "tenpo":"㉫",
    "toki":"㉬",
    "tomo":"㉭",
    "tu":"㉮",
    "unpa":"㉯",
    "uta":"㉰",
    "utala":"㉱",
    "walo":"㉲",
    "wan":"㉳",
    "waso":"㉴",
    "wawa":"㉵",
    "weka":"㉶",
    "wile":"㉷",
    "namako":"㉸",
    "kin":"㉹",
    "oko":"㉺",
    "kipisi":"㉻",
    "leko":"㉼",
    "monsuta":"㉽",
    "tonsi":"㉾",
    "jasima":"㉿",
    "kijetesantakalu":"㊀",
    "soko":"㊁",
    "meso":"㊂",
    "epiku":"㊃",
    "lanpan":"㊄",
    "n":"㊅",
    "mesikeke":"㊆",
    "ku":"㊇",
    "majuna":"㊈",
    "·":"㊉",
    ":":"㊊",
    "ni1":"㐀",
    "ni2":"㐁",
    "ni3":"㐂",
    "ni4":"㐃",
    "ni5":"㐄",
    "ni6":"㐅",
    "ni7":"㐆",
    "te":"㊋",
    "to":"㊌",
    "te1":"㊍",
    "to1":"㊎",
    "soto":"㊐",
    "teje":"㊑",
    "misikeke":"㊆"
};

const cartoucheSpacing = "㐓";

const cartouches = ["","㐡","㐢","㐣","㐤","㐥","㐦","㐧","㐨","㐩","㐪","㐫","㐬","㐭","㐮","㐯"];

const longPi = ["","㑑","㑒","㑓","㑔","㑕","㑖","㑗","㑘","㑙","㑚","㑛","㑜","㑝","㑞","㑟"];

interface CharStream {
    next: ()=>string;
    peek: ()=>string;
    eof: ()=>boolean;
    error: (msg: string)=>void;
}

function CreateCharStream(input: string): CharStream {
    let position = 0, line = 1, col = 0;
    
    return {
        next: next,
        peek: peek,
        eof: eof,
        error: error
    };

    function next() {
        const ch = input.charAt(position++);
        if(ch == "\n"){
            line++; 
            col = 0;
        }  else {
            col++;
        };
        return ch;
    }

    function peek() {
        return input.charAt(position);
    }
    function eof() {
        return peek() == "";
    }
    function error(msg: string) {
        throw new Error(msg + "(at line " + line + " col " + col + ")");
    }
}

interface Token {
    type: string;
    value: string;
}

function Lexer(input: CharStream) {
    let current:Token| null = null;
    
    const singleCharToken = "[]_"

    return {
        next: next,
        peek: peek,
        eof: eof,
        error: input.error
    }

    function readNext() {
        readWhile(isWhitespace);
        if(input.eof()) return null;
        const ch = input.peek();
        if(ch == "\n") return readNewLine();
        if(ch == "/") return readEscaped();
        if(isSingleCharToken(ch)) return readSingleCharToken();
        //if(ch == "[") return readCartouche();
        //if(ch == "\\") return readEscaped()
        if(isTokiPona(ch)) {
            return readTokiPona();
        }
        input.error("unexpected character " + ch);
    }

    function isWhitespace(ch: string) {
        return " ".indexOf(ch) >= 0;
    }

    function isSingleCharToken(ch: string) {
        return singleCharToken.indexOf(ch) >= 0;
    }

    function isTokiPona(ch: string) {
        return /[a-z1-9·:]/i.test(ch);
    }

    function readWhile(predicate: (ch: string)=>boolean) {
        let str = "";
        while(!input.eof() && predicate(input.peek())) {
            str += input.next();
        }
        return str;
    }

    function readNewLine() {
        return {type: "newLine", value: input.next()};
    }


    function readSingleCharToken() {
        const ch = input.next();
        let type;
        switch(ch) {
            case "[":
                type = "groupStart";
                break;
            case "]":
                type = "groupEnd";
                break;
            case "_":
                type = "space";
                break;
            default:
                input.error("Logic error: Unexpected single character token");
                return; 
        }
        return {type: type, value: ch};
    }

    function readTokiPona() {
        let str = "";
        while(!input.eof()){
            const peekStr = str + input.peek()
            if(peekStr == "pi[") {
                input.next();
                return {type: "groupStart",value: peekStr}; 
            }
            if(!isTokiPona(input.peek())) {
                const sitelenPona = lasinaToSpDict[str];
                if(sitelenPona) {
                    return {type: "sitelenPona", value: sitelenPona};
                } else {
                    input.error("\"" + str + "\" is not a valid toki pona word");
                }
            }
            str += input.next();
        }
        const sitelenPona = lasinaToSpDict[str];
        if(sitelenPona) {
            return {type: "sitelenPona", value: sitelenPona};
        } else {
            input.error("\"" + str + "\" is not a valid toki pona word");
        }
    }

    function readEscaped() {
        input.next(); // read /
        if(input.peek() != "*") {
            input.error("escape sequence incomplete");
            return;
        } 
        input.next(); // read *

        let lastChar;
        let currChar;
        let str = "";
        while(!input.eof()) {
            lastChar = input.next();
            currChar = input.peek();
            if(lastChar == "*" && currChar == "/") {
                input.next();
                return {type: "escaped", value: str}
            }
            str += lastChar;
        }
        input.error("escape not closed"); 
    }

    function peek() {
        return current || (current = (readNext() ?? null));
    }

    function next() {
        const token = current;
        current = null;
        return token || readNext();
    }

    function eof() {
        return peek() == null;
    }
    
}

interface ParseGroup {
    start: Token;
    content: string[];
}

export function encodeSP(text: string): string {
    const lexer = Lexer(CreateCharStream(text));
    const tokens: Token[] = [];
    while(!lexer.eof()) {
        const next = lexer.next();
        if(next) tokens.push(next);
    }

    let outputText = "";
    const stack: ParseGroup[] = [];
    for(let i = 0; i<tokens.length; i++) {
        const currToken = tokens[i];
        switch(currToken.type) {
            case "groupStart":
                stack.push({
                    start: currToken,
                    content: []
                });    
                break;
            case "groupEnd": {

                const currentGroup = stack.pop();
                if(!currentGroup) throw Error("");
                const groupSize = currentGroup.content.length;
                if(currentGroup.start.value == "["){
                    const cartoucheChar = cartouches[Math.max(groupSize,1)];
                    outputText += cartoucheChar;
                    currentGroup.content.forEach(element => {
                        outputText += element;
                    });
                    outputText += cartoucheSpacing;
                } else if(currentGroup.start.value == "pi["){
                    const piChar = longPi[Math.max(groupSize,1)];
                    outputText += piChar;
                    currentGroup.content.forEach(element => {
                        outputText += element;
                    });
                }
            }
                break;
            case "escaped":
                outputText += currToken.value;
                break;
            case "newLine":
                outputText += "\n";
                break;
            case "space":
                outputText += "ㇱ"; // sitelen pona spacing character
                break;
            case "sitelenPona":
                if(stack.length != 0){
                    stack[stack.length - 1].content.push(currToken.value);
                } else {
                    outputText += currToken.value;
                }
        }
    }
    return outputText;
}