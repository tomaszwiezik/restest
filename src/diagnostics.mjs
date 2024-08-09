/*
* (C) Tomasz Wiezik
* Version: 1.0.0
*/

export class Assert {

    static areEqual = (expected, actual, message) => Assert.#run(expected == actual, `expected = ${expected}, actual = ${actual}`, message);
    static areNotEqual = (notExpected, actual, message) => Assert.#run(notExpected != actual, `notExpected = ${notExpected}, actual = ${actual}`, message);
    static isFalse = (condition, message) => Assert.#run(!condition, '', message);
    static isTrue = (condition, message) => Assert.#run(condition, '', message);

    static #run(condition, errorMessage, message) {
        try {
            if (!condition) {
                message = message ? `(${message})` : '';
                throw new Error(`Assertion failed, ${errorMessage} ${message}`);
            }
        }
        catch(e) {
            console.error(e);
            process.exit(1);
        }
    }

}


export class Doc {
	
	static summary = (text) => Doc.#write('SUMMARY:\n--------', text, '| ');
	static text = (text) => Doc.#write('', text, '| ');
	static todo = (text) => console.log(`TODO: ${text}`);
	
	static #write(header, text, prepend) {
		if (header) console.log(header);
		const lines = Doc.#removeLeadingAndTrailingEmptyLines(text.split(`\n`));
		if (prepend) console.log(prepend);
		for (let i = 0; i < lines.length; i++) {
			if (lines[i].startsWith('\t')) lines[i] = lines[i].replace('\t', '');
			console.log(prepend + lines[i]);
		}
		if (prepend) console.log(prepend);
		if (header) console.log('');
		if (header) console.log('');
	}
	
	static #removeLeadingAndTrailingEmptyLines(lines) {
		const cleanedLines = [];
		let firstNonEmptyLineIndex = 0;
		let lastNonEmptyLineIndex = lines.length - 1;
		for (let i = 0; i < lines.length; i++) {
			if (lines[i] == '') {
				firstNonEmptyLineIndex = i + 1;
			}
			else {
				break;
			}
		}
		for (let i = lines.length - 1; i >= 0; i--) {
			if (lines[i] == '') {
				lastNonEmptyLineIndex = i - 1;
			}
			else {
				break;
			}
		}
		for (let i = firstNonEmptyLineIndex; i <= lastNonEmptyLineIndex; i++) {
			cleanedLines.push(lines[i]);
		}
		return cleanedLines;
	}
}