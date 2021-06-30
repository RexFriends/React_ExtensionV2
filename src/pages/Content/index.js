import React from 'react';
import { render } from 'react-dom';

// import Content from './v1components/Content';
import ContentMain from './v2components/ContentMain';
import ContentUser from './v2components/ContentUser';

let container = document.body;
const injectionHost = document.createElement('div');
container.appendChild(injectionHost);

const injection = document.createElement('div');
injectionHost.appendChild(injection);
const content = document.createElement('div');
content.id = 'rex-content-injection';
injection.appendChild(content);

async function isInjectionAllowed(url) {
  let server = 'https://server.rexfriends.com';
  const response = await fetch(`${server}/api/scrape-product?url=${url}`);
  const json = await response.json();

  if (json.Success) return true;

  console.error(json.Error);
  return false;
}

chrome.storage.local.get(null, (res) => {
  console.log('content script', res);
  isInjectionAllowed(window.location.toString()).then((isAllowed) => {
    console.log('Rex Allowed?', isAllowed);
    if (isAllowed) {
      if (res.showInjection === true) {
        if (res.uId === 'empty') {
          console.log('no user signed in');
          render(<ContentMain />, content);
        } else {
          console.log('user signed in UID:', res.uId);
          render(<ContentUser />, content);
        }
      }
    }
  });
});

// Bellow listener needs to listen for changes made by background/index.js (617-618)
// specifically to decide whether or not  the user is logged in.
// If user is logged in, we don't render <ContentMain/>
// Instead, we create a new component to render for users that already exist, <ContentUser/>

//?BONUS:
// This is also where we can receive data about whether or not the user is a first time user
// We can render a Tutorialized component that overlays the main user
chrome.storage.onChanged.addListener((response) => {
  console.log('response from chrome listener', response);
});
