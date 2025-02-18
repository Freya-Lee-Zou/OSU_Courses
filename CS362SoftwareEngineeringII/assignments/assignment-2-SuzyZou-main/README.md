[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/4vNpQsYp)
# Assignment 2
**Due by 11:59pm on Monday, 5/1/2023** <br/>
**Demo due by 11:59pm on Monday, 5/15/2023**

In this assignment you will use the [Jest testing framework](https://jestjs.io/) write unit tests for some functions used to verify user input during the user signup process.  The parts of the assignment are outlined below.

## 1. Write unit tests for an email verification function

In `lib/verifyEmail.js`, you'll find a function called `verifyEmail()` that is used to verify that a user enters a valid email address during the user signup process for an app.  Take some time to read the code for this function and to read its documentation, so you understand what it does.

Your first task here is to use Jest to implement unit tests to validate the `verifyEmail()` function.  To begin with, you'll need to install Jest as a dependency of this project.  Then, it's up to you to decide how many and what kind of tests to implement.  Designing good unit tests is part of the assignment.  Make sure the tests you implement here satisfy the requirements listed below.

## 2. Write unit tests for a password verification function

In `lib/verifyPassword.js`, you'll find a function called `verifyPassword()` which is used to verify that the password entered by a user during the user signup process satisfies certain criteria.  Again, take some time to read the code for this function and to read its documentation, so you understand what it does.

Your next task for the assignment is to implement unit tests to validate the `verifyPassword()` function.  As before, it's up to you to decide how many and what kind of tests to implement.  The tests you implement here must satisfy the criteria listed below.

Note that `verifyPassword()` is a more complex function than `verifyEmail()`, so you'll likely need to implement more tests to validate it.

## 3. Use test-driven development to implement a Roman numeral converter

Your last task for this assignment will involve using test-driven development (TDD) to implement a new feature.  Specifically, you'll use TDD to implement a Roman numeral converter that takes standard Arabic numbers (e.g. 3, 8, 64, 207, 2023, etc.) as input and converts those numbers to Roman numerals.  This conversion will be based on the following table of Arabic number and Roman numeral equivalents.

| Arabic | Roman numeral |
| ------ | ------------- |
| 1      | I             |
| 5      | V             |
| 10     | X             |
| 50     | L             |
| 100    | C             |
| 1000   | M             |

**For this part of the assignment, you only need to convert to "old" Roman numerals.**  "Old" Roman numerals are based solely on addition.  Specifically, in the "old" Roman numeral system you'll implement, every number is "built" only through the addition of smaller component "digits".  For example, in the "old" Roman numeral system the Arabic number 1 is represented as "I", 2 is represented as "II" (i.e. 1 + 1), 4 is represented as "IIII" (i.e. 1 + 1 + 1 + 1), 9 is represented as "VIIII" (5 + 1 + 1 + 1 + 1), and so forth.  This is unlike modern Roman numerals, which incorporate subtraction (e.g. "IV" is 5 - 1 = 4 in modern Roman numerals).

For this part of the assignment, following the TDD process is important!  **Specifically, to demonstrate that you used TDD to implement this feature, you *must* make a Git commit after each *phase* of the TDD cycle.**  In other words, you must commit after implementing a test in the "red" phase, then again after making the test pass in the "green" phase, then again after cleaning up your code in the "refactor" phase (if you do any refactoring), then again after the next "red" phase, etc.  **Much of your grade for this part of the assignment will be based on how successfully you followed TDD, and your commit history will be the only way to assess that.**

Here are the specific requirements for this part of the assignment:
  * You must implement a converter that takes an Arabic number as input and outputs the corresponding "old" Roman numeral.  It is up to you to design the interface for this converter.
  * You must follow TDD to implement your converter.
  * You must make a Git commit after each *phase* of the TDD cycle to demonstrate that you followed TDD.
  * Each Git commit message should begin with a label indicating which TDD phase the commit represents.
    * E.g. "TDD Red: ..." or "TDD Green: ..." or "TDD Refactor: ..."
  * The valid range of inputs for your converter should be 1-3999.  Numbers outside that range should be considered invalid inputs.

## Requirements for unit tests implemented for this assignment

The unit tests you implement for this assignment must satisfy these criteria:
  * They should thoroughly cover reasonable possible inputs to the function being tested.
  * They should thoroughly cover the boundary cases of the function.  It's up to you do analyze the function to figure out what its boundary cases are.
  * They should have descriptive names, and they should be clear and concise (i.e. they should be trivially understandable).
  * They should be behavior-driven, not method-driven.
  * They should follow the arrange-act-assert (AAA) pattern.
  * They should avoid antipatterns, like excess DRYness and the use of logic in the tests.

## Submission

We'll be using GitHub Classroom for this assignment, and you will submit your assignment via GitHub.  Make sure your completed files are committed and pushed by the assignment's deadline to the main branch of the GitHub repo that was created for you by GitHub Classroom.  A good way to check whether your files are safely submitted is to look at the main branch your assignment repo on the github.com website (i.e. https://github.com/osu-cs362-sp23/assignment-2-YourGitHubUsername/).  If your changes show up there, you can consider your files submitted.

## Grading criteria

This assignment is worth 100 points total.  This is broken down as follows.  A more detailed rubric for the assignment is available on Canvas.

* 25 points: Submission contains complete unit tests for `verifyEmail()`.
  * 5 points: Unit tests are correctly set up using Jest and execute to completion.
  * 5 points: Unit tests provide broad coverage of *valid* inputs to `verifyEmail()`.
  * 5 points: Unit tests provide broad coverage of boundary cases and *invalid* inputs to `verifyEmail()`.
  * 10 points: Unit tests follow testing best practices listed above.
    * Tests should have descriptive names, be clear and concise, be behavior-driven, follow the AAA pattern, and avoid anti-patterns.
    * Tests must pass!

* 35 points: Submission contains complete unit tests for `verifyPassword()`.
  * 5 points: Unit tests are correctly set up using Jest and execute to completion.
  * 10 points: Unit tests provide broad coverage of *valid* inputs to `verifyPassword()`.
  * 10 points: Unit tests provide broad coverage of boundary cases and *invalid* inputs to `verifyPassword()`.
    * Tests must pass!
  * 10 points: Unit tests follow testing best practices listed above.
    * Tests should have descriptive names, be clear and concise, be behavior-driven, follow the AAA pattern, and avoid anti-patterns.
    * Tests must pass!

* 40 points: Submission successfully uses TDD to implement "old" Roman numeral converter.
  * 15 points: Submission correctly follows TDD.
    * This will be verified based on whether the submission contains a Git commit for every *phase* of the TDD cycle.
    * There should be a commit for each "red" phase, a commit for each "green" phase, and a commit for each "refactor" phase.
    * Commit messages should indicate which phase the commit corresponds to, e.g. "TDD Red: This is my commit message."
  * 10 points: Unit tests follow testing best practices listed above.
    * Tests should have descriptive names, be clear and concise, be behavior-driven, follow the AAA pattern, and avoid anti-patterns.
    * Tests must pass!
  * 10 points: Submission contains a correctly implemented "old" Roman numeral converter.
    * See Section 3 above for details.
  * 5 points: Unit tests provide broad coverage of boundary cases and invalid inputs.
