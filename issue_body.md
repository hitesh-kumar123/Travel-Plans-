In `client/src/pages/NotFound.js`, there is a "Contact Support" button that links to `/contact`. However, in `client/src/App.js`, there is no route defined for `/contact`. This results in a continuous loop of 404 pages when clicking the button. Please either add a Contact page and route, or remove/update the link in `NotFound.js`.

assign me this issue under gssoc26
