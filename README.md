Gulp file for React
===================

Gulp setup specifically tailored for React. Includes:

* Browsersync
* JSX files automatically babelled
* import React from 'react' - will include React in the JS file, no need for separate script tags in HTML
* JS is minified by default, for quicker development, use gulp --devmode
* JS automatically linted using eslint
* Less compilation, HTML minification

Use of Gulp
------------  

There is a `gulpfile.js` within this repository to make development much quicker. All you need to do is:

* Install Node (http://nodejs.org) & Gulp (https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md)
* Run `npm run setup`

This will install all the dependencies found in `package.json` (The `node_modules` folder that is generated when you run this command should be created on a case-by-case basis and not pushed to a repository), and run the local server through the `gulp` command.

This will open up a tab in your browser, running a server at `localhost:3000` (unless you have set up a proxy server address - details on how to change this are in the `gulpfile.js` file).


### BrowserSync
  
The main component of this Gulp setup is BrowserSync. This plugin provides the following advantages for development:  
* Simultaneous page scrolling for all devices connected to the same link  
* Clicking links or populating form fields on one device will duplicate this behaviour on all other linked devices  
* A dashboard at `localhost:3001` where you can send commands to all connected devices, perform actions and do network throttle testing.

