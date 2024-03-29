# Smile CDR Coding Test

This project is a skeleton project for querying data from the [Smile CDR Test Server](https://try.smilecdr.com/baseR4/Patient)

### Getting Started:

* [x] Take a few minutes to familiarize yourself with the [FHIR Standard](http://hl7.org/fhir/) for health data exchange. In particular, you might want to read the [Executive Summary](http://hl7.org/fhir/summary.html) and the [Developer Introduction](http://hl7.org/fhir/overview-dev.html)

* [x] Use whatever library & framework you're most comfortable with.
  
* [x] Create your own GitHub project and copy the contents of this repository into your own project.

* [x] **Please, do not fork this repo.** Create your own private GitHub repository to do your work in.

### Basic Tasks:

* [x] Create a patient view with patients fetched from `https://try.smilecdr.com/baseR4/Patient`. The patients should be sorted by name & birthdate (if a birthdate is in the record). 

* [x] Display the first & last names, birthdate, address, gender & phone number.
 
* [x] Ensure the table is responsive. Ensure there is proper error handling for missing elements in the data.

* [x] Time the request. Output the time on the footer of the page in a human readable format.

* [x] Add a search function to the page. Add two inputs to your view - one for first name, and one for last name.  Make an API call to `https://try.smilecdr.com/baseR4/Patient?given=<userinput>&family=<userinput>` that searches for a `Patient` based on the names passed in. Replace `<userinput>` with the data from the inputs. If only one name is entered in the inputs, modify the query to only use either the first or last name entered.

* [x] Add a function to reset the search results in the table.

* [x] Apply validation to the inputs - the boxes cannot contain non-alphabetic characters.

* [x] Commit your work.

### Intermediate Tasks:

* [x] Generate a questionnaire view. In the view, _dynamically_ generate a form and capture the answer for the following questions :- 

    -    Do you have allergies? **Radio Button (True, False)**
    -    What is your gender? **Select (Male, Female, Other)**
    -    What is your date of birth? **Datepicker**
    -    What is your country of birth? **Textbox**
    -    What is your marital status? **Select (Married, Single, Divorced)**
    -    Do you smoke? **Radio Button (True, False)**
    -    Do you drink alchohol? **Radio Button (True, False)**

* [x] Display the results of the form based on submit at the bottom of the page. 

* [x] Commit your work.

* [x] **Bonus :-** If dynamic form is generated using the [`questionnaire.json` file](assets/questionnaire.json)  in the `assets` folder. The form should have validation applied to each input. 

* [x] **Bonus :-** Using the results from the form, generate a [`QuestionnaireResponse`](https://www.hl7.org/fhir/questionnaireresponse.html). The `QuestionnaireResponse` should follow the structure outlined in the [Resource Content Section](https://www.hl7.org/fhir/questionnaireresponse.html#resource)