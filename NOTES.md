## Challenges
(Note: This is no longer the case after migrating from `https://try.smilecdr.com/baseR4/Patient` to `https://hapi.fhir.org/baseR4/Patient`)
- The required endpoint does not allow me to make CORS requests in the browser.
- Curl and Insomnia requests work as expected.
- Preflight requests were triggered with just the presense of additional headers.
- To circumvent the CORS issue, a browser extension was used called "[Moesif Origin & CORS Changer](https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc)"

## Needed Improvements
- Readability
- More thorough unit tests and possibly some integration tests
- Employ a state management lib like redux or mobx
- Lazy loading pages and images
- More color and interactivity (tried to do page transitions, but not well enough)
- Better organization of css and or use of dynamic (React) styling patterns
- ~~Refactor components into their own files~~ More organization
- One of the libraries uses a deprecated feature `findDOMNode` and leaves an ugly error in the console as a result
    - Removed `<React.StrictMode />` from `index.js`

## Development Resources
- https://ant.design/
- https://smilecdr.com/docs/realtime_export/using_fhirpath.html
- https://hl7.org/fhirpath
- https://hl7.github.io/fhirpath.js/
- https://reactrouterdotcom.fly.dev/docs/en/v6/getting-started/overview
- https://validator.fhir.org/
- https://www.hl7.org/fhir/questionnaireresponse-example-f201-lifelines.json.html
- https://www.hl7.org/fhir/validation.html
- https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
- https://confluence.hl7.org/display/FHIR/Public+FHIR+Validation+Services