/**
 * This function verifies whether an email address is a valid email address.
 * It does not verify that an email address exists but only whether it matches
 * the correct structure of an email address.  Note that a simplified email
 * address structure is used here, and not all email addresses that are valid
 * under RFC 5322 (https://datatracker.ietf.org/doc/html/rfc5322) will be
 * considered valid by this function.  Most typical email addresses will pass,
 * though.
 *
 * @param email An email address
 *
 * @returns {boolean} Returns true if the email address is valid and false
 *     otherwise.
 */
module.exports = function verifyEmail(email) {
    /*
     * Short-circuit checks if password is not a string
     */
    if (!email || typeof email !== "string") {
        return false
    }

    /*
     * This is a regular expression for verifying most email addresses.  It's
     * from Regular Expressions Cookbook by Jan Goyvaerts and Steven Levithan:
     *
     * https://www.oreilly.com/library/view/regular-expressions-cookbook/9781449327453/ch04s01.html
     */
    const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[a-z0-9-]+\.)+[a-z]{2,6}$/i

    return emailRegex.test(email)
}
