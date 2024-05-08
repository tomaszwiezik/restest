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
