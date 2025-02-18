/**
 * This function verifies whether a password satisfies the following criteria:
 *   * Contains at least 8 characters
 *   * Contains at least one lowercase letter
 *   * Contains at least one uppercase letter
 *   * Contains at least one numerical digit
 *   * Contains at least one of the following symbols: !@#$%^&*
 *   * Does not contain invalid characters (spaces and other symbols not listed
 *     above)
 *
 * @param password The password to be validated
 *
 * @returns Returns an object with the following fields, all boolean valued:
 *     pass - true if the password passes overall verification
 *     lowercase - true if the password contains at least one lowercase letter
 *     uppercase - true if the password contains at least one uppercase letter
 *     digit - true if the password contains at least one digit
 *     symbol - true if the password contains at least one valid symbol
 *     noInvalid - true if the password doesn't contain invalid symbols/spaces
 */
module.exports = function verifyPassword(password) {
    /*
     * Short-circuit checks if password is not a string
     */
    if(!password || typeof password !== "string") {
        return { pass: false }
    }

    /*
     * Perform individual verification checks.
     */
    const checks = {
        length: _containsAtLeast8Chars(password),
        lowercase: _containsOneLowercase(password),
        uppercase: _containsOneUppercase(password),
        digit: _containsOneDigit(password),
        symbol: _containsOneSymbol(password),
        noInvalid: _containsNoInvalidChars(password)
    }

    /*
     * Determine overall verification result based on individual checks.
     */
    const pass = (
        checks.length &&
        checks.lowercase &&
        checks.uppercase &&
        checks.digit &&
        checks.symbol &&
        checks.noInvalid
    )

    return { ...checks, pass: pass }
}

function _containsAtLeast8Chars(password) {
    return password && password.length >= 8
}

function _containsOneLowercase(password) {
    const regex = /[a-z]/
    return regex.test(password)
}

function _containsOneUppercase(password) {
    const regex = /[A-Z]/
    return regex.test(password)
}

function _containsOneDigit(password) {
    const regex = /[0-9]/
    return regex.test(password)
}

function _containsOneSymbol(password) {
    const regex = /[!@#$%^&*]/
    return regex.test(password)
}

function _containsNoInvalidChars(password) {
    const regex = /[^a-zA-Z0-9!@#$%^&*]/
    return !regex.test(password)
}
