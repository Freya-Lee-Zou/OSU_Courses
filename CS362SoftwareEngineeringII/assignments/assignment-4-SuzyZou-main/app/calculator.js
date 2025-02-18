/*
 * Update the navbar and run the calculator when the DOM is first loaded.
 */
updateNavbar()
runCalculator()

function runCalculator() {
    /*
     * This maps the text of the calculator operator keys to actual arithmetic
     * functions.
     */
    const CalculatorOperations = {
        '÷': (prevValue, nextValue) => prevValue / nextValue,
        '×': (prevValue, nextValue) => prevValue * nextValue,
        '+': (prevValue, nextValue) => prevValue + nextValue,
        '−': (prevValue, nextValue) => prevValue - nextValue,
        '=': (prevValue, nextValue) => nextValue,
    }

    const textDisplay = document.getElementById("text-display")
    const digitKeys = document.getElementsByClassName("digit-keys")[0]
    const operatorKeys = document.getElementsByClassName("operator-keys")[0]
    const clearKey = document.getElementsByClassName("key-clear")[0]
    const oldRomanKey = document.getElementsByClassName("key-old")[0]
    const modernRomanKey = document.getElementsByClassName("key-modern")[0]
    const romanNumeralModeDisplay = document.getElementById("roman-mode-display")

    let displayValue = "0"
    let displayText = "0"
    let operator = null
    let value = null
    let waitingForOperand = false
    let modernRomanMode = false
    let history = loadHistory()
    let historyItem = null

    /*
     * Returns true if the displayed value is non-zero and false otherwise.
     */
    function displayIsNonZero() {
        return displayValue !== "0"
    }

    /*
     * Adapts the calculator to display the current value of `displayValue`.
     */
    async function updateDisplay() {
        clearKey.textContent = displayIsNonZero() ? "C" : "AC"
        oldRomanKey.disabled = modernRomanMode ? false : true
        modernRomanKey.disabled = modernRomanMode ? true : false
        romanNumeralModeDisplay.textContent = modernRomanMode ? "modern" : "old"

        try {
            textDisplay.textContent = displayText = modernRomanMode ? (
                await convertToModernRoman(displayValue)
            ) : (
                convertToOldRoman(displayValue)
            )
        } catch (e) {
            /*
             * If something went wrong displaying the Roman numeral, let the user know
             * the cause.
             */
            const msg = e instanceof RangeError ? (
                "That number is too big!  Only numbers between 1-3999 can be displayed."
            ) : (
                "Something went wrong computing the Roman numeral.  Sorry!\n\n" + e
            )
            alert(msg);
            clearAll()
        }
    }

    /*
     * Append a digit to the display.
     */
    function addDigit(digit) {
        if (waitingForOperand) {
            displayValue = digit
            waitingForOperand = false
        } else {
            displayValue = displayValue === "0" ? digit : displayValue + digit
        }

        /*
         * Typing always toggles the calculator back to "old" Roman numeral
         * mode.
         */
        modernRomanMode = false

        updateDisplay()
    }

    /*
     * If the user is logged in, write the current history item into the
     * history.
     */
    function writeHistoryItem() {
        history.push(historyItem)

        /*
         * Store a maximum of 16 history items.
         */
        if (history.length > 16) {
            history.pop()
        }

        const isLoggedIn = window.localStorage.getItem("token")
        if (isLoggedIn) {
            window.localStorage.setItem("history", JSON.stringify(history))
        }
    }

    /*
     * Performs an operation when an operator key is pressed.
     */
    function performOperation(nextOperator) {
        const inputValue = parseFloat(displayValue)
        const inputText = displayText

        if (value === null) {
            value = inputValue
            historyItem = { calc: displayText, result: displayText }
        } else if (operator) {
            const currentValue = value || 0
            let newValue = CalculatorOperations[operator](currentValue, inputValue)

            /*
             * Truncate the current value so it can be easily converted into
             * Roman numerals and set it to a minimum value of 0.
             */
            newValue = Math.trunc(newValue)
            newValue = Math.max(0, newValue)

            value = newValue
            displayValue = String(newValue)

            updateDisplay()

            /*
             * Update the calculation being tracked for entry into the history.
             */
            if (operator === "=") {
                historyItem = { calc: displayText, result: displayText }
            } else {
                historyItem = {
                    calc: `${historyItem.calc} ${operator} ${inputText}`,
                    result: displayText
                }
            }
        }

        waitingForOperand = true
        operator = nextOperator

        if (operator === "=") {
            writeHistoryItem()
        }
      }

      /*
       * Clears the displayed value.
       */
      function clearDisplay() {
          displayValue = "0"
          updateDisplay()
      }

      /*
       * Clears the display as well as any accumulated computation.
       */
      function clearAll() {
          value = null
          displayValue = "0"
          displayText = "0"
          operator = null
          waitingForOperand = false
          historyItem = null
          updateDisplay()
      }

    /*
     * Add a listener to handle clicks on the digit keys.  When a digit key is
     * pressed, append the corresponding digit to the displayed value.
     */
    digitKeys.addEventListener("click", function (event) {
        const digitKey = event.target
        if (digitKey.nodeName.toLowerCase() === "button") {
            const digit = digitKey.textContent.trim()
            addDigit(digit)
        }
    })

    /*
     * Add a listener to handle clicks on operator keys.  Perform the
     * corresponding operation.
     */
    operatorKeys.addEventListener("click", function (event) {
        const operatorKey = event.target
        if (operatorKey.nodeName.toLowerCase() === "button") {
            const operator = operatorKey.textContent.trim()
            performOperation(operator)
        }
    })

    /*
     * Add a listener to handle clicks on the "clear" key.
     */
    clearKey.addEventListener("click", function () {
        if (displayIsNonZero()) {
            clearDisplay()
        } else {
            clearAll()
        }
    })

    /*
     * Add a listener to handle clicks on the "old" key, which toggles the
     * display to display "old" Roman numerals.
     */
    oldRomanKey.addEventListener("click", function () {
        modernRomanMode = false
        updateDisplay()
    })

    /*
     * Add a listener to handle clicks on the "modern" key, which toggles the
     * display to display "modern" Roman numerals.
     */
    modernRomanKey.addEventListener("click", function () {
        modernRomanMode = true
        updateDisplay()
    })

    updateDisplay()
}

/**
 * This function converts an Arabic number into the corresponding "old" Roman
 * numeral.  Old Roman numerals are based only on addition.  For example, the
 * Arabic number 9 is "VIIII" in old Roman numerals (it's "IX" in modern Roman
 * numerals).
 *
 * @param {string} input A numeric value representing the Arabic number to
 *   convert to old Roman numerals.
 *
 * @returns {string} Returns a string containing the old Roman numeral
 *   conversion for the specified input value.
 */
function convertToOldRoman(input) {
    input = parseInt(input)
    if (input === 0) {
        return "0"
    }
    if (input < 1 || input > 3999) {
        throw RangeError("Input must be in range 1-3999")
    }

    /*
     * This table represents the conversions between Roman digits and Arabic
     * values.
     */
    const conversionTable = {
        "M": 1000,
        "C": 100,
        "L": 50,
        "X": 10,
        "V": 5,
        "I": 1
    }

    /*
     * Cycle through Roman digits from greatest (M) to least (I).  For each
     * digit, subtract the corresponding Arabic value from the input number
     * as many times as possible, adding an instance of the current Roman
     * to the resultint translation for each subtraction.
     */
    const romanDigits = Object.keys(conversionTable)
    let currRomanIdx = 0
    let result = ""
    while (input > 0 && currRomanIdx < romanDigits.length) {
        const currRomanDigit = romanDigits[currRomanIdx]
        const currArabicValue = conversionTable[currRomanDigit]
        while (input >= currArabicValue) {
            result += currRomanDigit
            input -= currArabicValue
        }
        currRomanIdx++
    }
    return result
}

/**
 * This function converts an Arabic number into the corresponding "modern"
 * Roman numeral.  Modern roman numerals are the ones we're all familiar with.
 *
 * @param {string} input A numeric value representing the Arabic number to
 *   convert to modern Roman numerals.
 *
 * @returns {string} Returns a promise that resolves to a string containing
 *   the modern Roman numeral conversion for the specified input value.
 */
async function convertToModernRoman(input) {
    if (input === "0") {
        return "0"
    }
    const response = await fetch(
        `https://romans.justyy.workers.dev/api/romans/?n=${input}`
    )
    const data = await response.json()
    if (data.error) {
        throw new Error(data.error)
    }
    return data.result
}

/*
 * This function updates which links are displayed in the navbar based on
 * whether or not a user is "registered" and whether or not they are
 * "logged in".
 */
function updateNavbar() {
    const historyNavItem = document.getElementsByClassName("nav-history")[0]
    const loginNavItem = document.getElementsByClassName("nav-login")[0]
    const logoutNavItem = document.getElementsByClassName("nav-logout")[0]
    const registerNavItem = document.getElementsByClassName("nav-register")[0]
    const unregisterNavItem = document.getElementsByClassName("nav-unregister")[0]

    const isRegistered = window.localStorage.getItem("user")
    const isLoggedIn = window.localStorage.getItem("token")
    if (isRegistered) {
        registerNavItem.remove()
        if (isLoggedIn) {
            loginNavItem.remove()
        } else {
            unregisterNavItem.remove()
            historyNavItem.remove()
            logoutNavItem.remove()
        }
    } else {
        unregisterNavItem.remove()
        historyNavItem.remove()
        loginNavItem.remove()
        logoutNavItem.remove()
    }
}

/*
 * Loads the user's calculation history and returns it if they are logged in.
 */
function loadHistory() {
    const isLoggedIn = window.localStorage.getItem("token")
    if (isLoggedIn) {
        const historyJson = window.localStorage.getItem("history")
        return historyJson && JSON.parse(historyJson) || []
    } else {
        return []
    }
}
