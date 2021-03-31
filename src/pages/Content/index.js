import React from 'react';
import { render } from 'react-dom';
import Content from './Content';

let container = document.body;
const element = document.createElement('div');
const shadownRoot = element.attachShadow({ mode: 'open' });
const content = document.createElement('div');
content.id = 'rex-content-injection';
shadownRoot.append(content);
container.append(shadownRoot);

async function isInjectionAllowed(url) {
  let server = 'https://server.rexfriends.com';
  const response = await fetch(server + '/api/get-blacklist-sites');
  const json = await response.json();

  // url = url.substring(7, 40);
  url = url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
  for (var i = 0; i <= json.list.length; i++) {
    if (url.includes(json.list[i])) {
      return false;
    }
  }
  return true;
}

chrome.storage.local.get(['showInjection'], (res) => {
  if (res.showInjection === true) {
    isInjectionAllowed(window.location.toString()).then((res) => {
      console.log('Rex Allowed?', res);
      if (res === true) {
        render(
          <Content />,
          window.document.querySelector('#rex-content-injection')
        );
      }
    });
  }
});
