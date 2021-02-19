import { printLine } from './modules/print';
import React from 'react';
import { render } from 'react-dom';
import Content from './Content';


console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');
printLine("Using the 'printLine' function from the Print Module");





let container = document.body
const element = document.createElement("div")
const shadownRoot = element.attachShadow({mode: "open"})
const content = document.createElement("div")
content.id = 'rex-content-injection'
shadownRoot.append(content)
container.append(shadownRoot)


render(<Content />, window.document.querySelector('#rex-content-injection'));