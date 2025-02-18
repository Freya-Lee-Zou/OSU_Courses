[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/GA38QIL0)
[![Open in Codespaces](https://classroom.github.com/assets/launch-codespace-7f7980b617ed060a017424585567c406b6ee15c891e84e1186181d67ecf80aa0.svg)](https://classroom.github.com/open-in-codespaces?assignment_repo_id=11167229)
# Assignment 4
**Due by 11:59pm on Tuesday, 5/30/2023** <br/>
**Demo due by 11:59pm on Friday, 6/16/2023**

In this assignment you will use Cypress to write end-to-end tests for a complete application.  The application and testing requirements are described below.  **There are some special considerations for running the assignment code and tests for this assignment that are also listed below.**  Make sure you read these before proceeding with the assignment.

Make sure you start off by installing the dependencies listed in `package.json` by running:
```
npm install
```
You'll also need to install and set up [Cypress](https://www.cypress.io/) and the [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro) in the way we discussed in lecture.

## Assignment requirements

In this assignment, you will implement end-to-end tests for a Roman numeral calculator application.  This calculator works like a regular pocket calculator, allowing you to perform simple arithmetic operations.  However, unlike most calculators, this calculator displays numbers only in Roman numerals (plus "0").

The application itself is implemented in the `app/` directory, and instructions for how to run it are included in the section below.  I would encourage you to start off by running the application and playing around with it to familiarize yourself with the way it works.

For this assignment, you must use Cypress to test the application flows described below.  Follow the link to see a video depicting an example of each of these flows.

### Perform a simple calculation ([video](./videos/unregisteredCalculation.mp4))

Write a Cypress test that performs a simple calculation and verifies that the results are correct.  This test will take place completely on the app's home page (i.e. the URL path `"/"`).  You should perform this test *before* registering a user.

### Perform a calculation and convert to "modern" Roman ([video](./videos/convertToModern.mp4))

Write a Cypress test that performs a calculation in "old" Roman numeral mode (the default) and then clicks the "mdrn" button to convert to "modern" Roman numerals.  This test will use the same web API as the one we used in assignment 3 to perform the conversion to "modern" Roman numerals.  In an end-to-end test, we don't want to mock this service like we did for our integration tests.  This test will take place completely on the app's home page (i.e. the URL path `"/"`).

### Register a user ([video](./videos/registerUser.mp4))

Write a Cypress test that starts on the app's home page (i.e. the URL path `"/"`) and registers a new user by clicking on the "Register" link at the top of the app, typing a valid email address and password into the registration form, and then clicking the "Register" button.  If registration is successful, the app will automatically redirect you back to the app's home page, where the navbar should be updated to contain a "Login" link instead of the "Register" link.  In your test, assert that the redirect takes place and that the navbar is updated to verify that registration was successful.

### Successful login ([video](./videos/successfulLogin.mp4))

Write a separate Cypress test that logs a user into the app.  Because Cypress isolates tests by default, the user that was registered previously will no longer exist, so you'll have to begin the test by registering a user, starting at the app's home page (i.e. the URL path `"/"`).  You do not have to make assertions to verify that registration succeeded in this test.

After the user is registered, proceed by clicking on the "Login" link at the top of the app, and then submitting *the same* credentials you provided during the registration step.  If login is successful, the app will automatically redirect you back to the app's home page, where the navbar should be updated to contain three links ("History", "Logout", and "Unregister").  In your test, assert that the redirect takes place and that the navbar is updated to verify that login was successful.

### Calculation history ([video](./videos/historyRecorded.mp4))

Write a separate Cypress test that verifies that a logged-in user's calculation history is successfully recorded.  Specifically, once a user is logged in, each calculation they make will be recorded every time they click the "=" key, and that history can be viewed on the app's "History" page.

Because Cypress isolates tests by default, the user that was previously registered and logged in will no longer exist, so you'll have to begin the test by registering a user and then logging that user in, starting at the app's home page (i.e. the URL path `"/"`).  You do not have to make assertions to verify that registration or login succeeded in this test.

Then, verify that the user's calculation history is correctly recorded by performing a few calculations (making sure to hit the "=" key a few times) and then clicking the "History" link in the navbar.  The test should make assertions on the "History" page to verify that the history displayed there correctly represents the calculations performed.

### Successful logout ([video](./videos/successfulLogout.mp4))

Write a separate Cypress test that verifies that a logged-in user can successfully logout.  Because Cypress isolates tests by default, the user that was previously registered and logged in will no longer exist, so you'll have to begin the test by registering a user and then logging that user in, starting at the app's home page (i.e. the URL path `"/"`).  You do not have to make assertions to verify that registration or login succeeded in this test.

Then, verify that the logout functionality works correctly by clicking the "Logout" link in the navbar.  This will navigate to the "Logout" page, which will log the user out and then automatically (and very quickly) redirect back to the app's home page, where the navbar should be updated to contain only a "Login" link.  Write assertions to verify that this happens correctly.

## Test requirements

The tests you write for this assignment should satisfy the following requirements:

  * As always, we want to avoid incorporating implementation details into our tests to the extent possible.  Use the [Cypress Testing Library](https://testing-library.com/docs/cypress-testing-library/intro), as covered in lecture, to help accomplish this.

  * We want end-to-end tests to match a real execution environment as much as possible.  For this reason, you should *not* use doubles in any of the tests for this assignment.

  * Your tests should assume the application server is already started.  Make sure the server is running before starting your tests (more on starting the application server in the next section).

## Running the application and tests for this assignment

**⛔️⛔️⛔️Cypress DOES NOT run on the ENGR servers, so you will need to run tests somewhere else for this assignment!!⛔️⛔️⛔️**  I'd strongly developing and running tests on your local machine (e.g. directly on your laptop or desktop) for this assignment.  However, I've also set up GitHub Codespaces for this assignment, and you can use a Codespace for your runtime environment if you'd like.  See below for details on how to set up and use a Codespace for this assignment.

Here are a few other tips about running the application and tests for this assignment:

  * Cypress works best when the application code being tested is being run on a server, so the application for this assignment is set up to be served instead of opening HTML files directly in your browser.  You can start the application server using the command `npm start`.  When the application server is running, it will print out a URL you can use to visit the app in your browser (e.g. `http://localhost:3000`).

  * In class, we will use the command `cypress open` to open Cypress itself.  We will then be able to set up and run tests for our application directly within Cypress.  Because Cypress is a graphical application, you won't be able to use `cypress open` if you're working in a GitHub Codespace.  Instead, you'll have to manually set up your tests (e.g. creating `cypress.config.js` and the `cypress/` directory yourself, following the examples from lecture) and use the command `cypress run` to run them in "headless" mode, which will run the tests without opening any GUI windows.

## Running code in GitHub Codespaces

For this assignment, I've enabled a feature called [GitHub Codespaces](https://docs.github.com/en/codespaces/) that will provide you with a private online environment where you can develop and test your code for the assignment.  This environment will be centered around a browser-based version of the [VS Code](https://code.visualstudio.com/) editor.  You can access the Codespace by clicking "Create codespace on main" under the "Code" button in your assignment repository on GitHub:

![Image of GitHub Codespaces button](https://www.dropbox.com/s/wvijvh130fjuud5/Screen%20Shot%202022-05-24%20at%2011.17.58%20AM.png?raw=true)

You may use this browser-based editor as much or as little as you like, and in general, I encourage you to stick with whatever development setup already works best for you (i.e. your preferred editor running on your preferred development machine).

The reason I'm providing the Codespace is to provide an environment where you can run Cypress if you're not comfortable running on your local machine.  To be able to use Cypress in the this Codespace, you'll need to make sure its dependencies are installed in the Codespace.  You can do this by running the following two commands in the Codespace terminal:
```
sudo apt-get update
sudo apt-get --yes install libgtk2.0-0 libgtk-3-0 libgbm-dev  \
    libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2     \
    libxtst6 xauth xvfb
```
Note that during the course of the execution of these two commands, you will be prompted with some questions you'll need to answer.

You'll also need to make sure a browser is installed in the Codespace for Cypress to use to run its tests.  For example, you can install Firefox like this after running the two commands above:
```
sudo apt-get --yes install firefox
```

You can access the Codespace terminal through the menu of the browser-based version of VS Code associated with the Codespace:

![Image of Codespace terminal access](https://www.dropbox.com/s/nqebudssjvcwyw5/Screen%20Shot%202022-05-24%20at%2011.45.34%20AM.png?raw=true)

Inside this terminal, you should be able to run your code as described above.

If you're editing outside the browser-based version of VS Code associated with your Codespace, and you want to test your code inside the Codespace, you'll need to make sure you use Git to pull your most recent commit(s) into the Codespace.  You can do this through the browser-based VS Code's Git integration:

![Image of VS Code Git pull command](https://www.dropbox.com/s/d4rlv954af0q6r4/Screen%20Shot%202022-05-24%20at%2011.37.23%20AM.png?raw=true)

## Submission

We'll be using GitHub Classroom for this assignment, and you will submit your assignment via GitHub.  Make sure your completed files are committed and pushed by the assignment's deadline to the main branch of the GitHub repo that was created for you by GitHub Classroom.  A good way to check whether your files are safely submitted is to look at the main branch your assignment repo on the github.com website (i.e. https://github.com/osu-cs362-sp23/assignment-4-YourGitHubUsername/).  If your changes show up there, you can consider your files submitted.

## Grading criteria

This assignment is worth 100 points total.  This is broken down as follows.  A more detailed rubric for the assignment is available on Canvas.

* 70 points: Submission includes correct implementations of all the tests outlined in the assignment description above.
  * 10 points: Submission includes a test that correctly verifies that a simple calculation can be performed within the app's calculator
  * 10 points: Submission includes a test that correctly verifies that conversion to "modern" Roman numerals works correctly
  * 10 points: Submission includes a test that correctly verifies that a user can successfully register for the app
  * 10 points: Submission includes a test that correctly verifies that a registered can successfully log in to the app
  * 20 points: Submission includes a test that correctly verifies that a logged-in user's calculation history is recorded
  * 10 points: Submission includes a test that correctly verifies that a logged-in user can log out

* 10 points: All tests satisfy the requirements outlined above in the section "Test requirements"

* 10 points: Submission correctly configures Cypress to connect to the running application server

* 10 points: All tests defined in the submission run correctly within Cypress and pass
