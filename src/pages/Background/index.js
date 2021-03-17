import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import '../../assets/img/128.png';
import URL from '../../assets/url';

console.log('This is the background page.');

chrome.runtime.onInstalled.addListener((response) => {
  // console.log('runtime install: ', response);
  // redirect user to website on install
  chrome.tabs.create({
    active: true,
    url: 'https://google.com',
  });
  // these clear all stoarge, not sure if neccessary for prod
  chrome.storage.sync.clear();
  chrome.storage.local.clear();
  // this sets all storage
  chrome.storage.local.set({
    uId: 'empty',
    page: 0,
    user: {
      first_name: 'Loading',
      last_name: 'User',
    },
    showInjection: true,
  });
});
// Refreshes the contentscript page when the browser url is changed
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    chrome.storage.local.set({ uri: changeInfo.url });
  }
});

// This listens to state changes and can trigger functions here
chrome.storage.onChanged.addListener((response) => {
  if (response.uId) {
    chrome.tabs.query(
      { active: true, currentWindow: true },
      function (arrayOfTabs) {
        chrome.tabs.reload(arrayOfTabs[0].id);
      }
    );
    // makes a fetch call to the for extension dashboard on login

    if (response.uId.oldValue === 'empty') {
      let startTime = new Date();
      console.log('making fetch request for dashboard load');

      fetch(URL + '/api/extension_dashboard?uid=' + response.uId.newValue)
        .then((res) => res.json())
        .then((json) => {
          let endTime = new Date();
          console.log('extension_dashboard', json);
          console.log(
            'time passed for initial load:',
            Math.round((endTime - startTime) / 1000),
            'seconds'
          );
          chrome.storage.local.set(json);
        });
    }
  }
});

// Runs code from content.js that is async & may be affected by page change
chrome.runtime.onMessage.addListener((msg, sender_info, reply) => {
  if (msg.action === 'login-signup') {
    let payload = {
      firstname: msg.firstname,
      lastname: msg.lastname,
      email: msg.email,
      phone: msg.phone,
      uid: msg.uid,
    };
    // console.log('fetch request to login-signup', payload);
    fetch(URL + '/api/signupweb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((json) => console.log('signupweb fetch result:', json));
    return;
  }
  // this fetch call may not be neccessary
  if (msg.action === 'custom-signin') {
    let payload = {
      uid: msg.uid,
      email: msg.email,
    };
    // console.log('fetch request to custom-signin', payload);
    fetch(URL + '/api/webdashboard?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((json) => console.log('custom-signin fetch result:', json));

    return;
  }
  // finished
  if (msg.action === 'save-item') {
    chrome.tabs.captureVisibleTab(sender_info.tab.windowId, function (image) {
      chrome.storage.local.get(['uId'], function (result) {
        if (result.uId !== 'empty') {
          let payload = {
            URL: msg.uri ? msg.uri : sender_info.url,
            ImagePNG: image,
          };
          // console.log('fetch request to /api/save-rex:', payload);
          fetch(URL + '/api/save-rex?uid=' + result.uId, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })
            .then((response) => response.json())
            .then((json) => {
              // console.log('this is the currentItem First fetch', json);
              if (json.success === false) {
                chrome.storage.local.set({ closet_save_error: json.reason });
              }
              // make a second fetch after 3 seconds for web scraper data
              if (json.currentItem) {
                let current_item = json.currentItem;
                chrome.storage.local.set({ current_item });
              }
            });
        }
      });
    });
    return;
  }
  // finished
  if (msg.action === 'add closet-item') {
    let payload = {
      closet_id: msg.closet_id,
      product_id: msg.item_id,
      new_state: true,
    };
    // console.log('fetch request to add closet item:', msg);
    fetch(URL + '/api/item_closet_change?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => console.log('add closet item fetch result:', json));

    chrome.storage.local.get(['current_item'], (res) => {
      let current_item = res.current_item;
      current_item.closets.push(msg.closet_id);
      chrome.storage.local.set({ current_item });
    });
    return;
  }
  // finished
  if (msg.action === 'remove closet-item') {
    let payload = {
      closet_id: msg.closet_id,
      product_id: msg.item_id,
      new_state: false,
    };
    // console.log('fetch request to remove closet item:', msg);
    fetch(URL + '/api/item_closet_change?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => console.log('remove closet item fetch result:', json));

    chrome.storage.local.get(['current_item'], (res) => {
      // console.log('update closets *remove', res);
      let current_item = res.current_item;
      let tempCloset = current_item.closets.filter((x) => x !== msg.closet_id);
      current_item.closets = tempCloset;
      chrome.storage.local.set({ current_item });
    });
    return;
  }
  // finished
  if (msg.action === 'add to-new-closet') {
    let payload = {
      closet_name: msg.closet_name,
      product_id: msg.item_id,
    };
    // console.log('add item to new closet', payload);
    fetch(URL + '/api/new_closet_with_item?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => {
        let closet = msg.closets;
        closet.push(json.new_closet);
        chrome.storage.local.set({ closet });

        chrome.storage.local.get(['current_item'], (res) => {
          let current_item = res.current_item;
          current_item.closets.push(json.new_closet.id);
          chrome.storage.local.set({ current_item });
        });
      });
  }
  //
  if (msg.action === 'get_currentItem') {
    // console.log('update current item', msg);
    fetch(URL + `/api/get_item/${msg.currentItemId}?uid=` + msg.uid)
      .then((res) => res.json())
      .then((json) => {
        let current_item = json.current_item;
        chrome.storage.local.set({ current_item });
      });
    // .catch((err) => console.log('this is an error', err));
  }
  //
  if (msg.action === 'copy_link') {
    let payload = {
      listing_id: msg.listing_id,
    };
    // console.log('copy link', payload);
    fetch(URL + '/api/copy_feedback_link?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.text())
      .then((link) => {
        let current_copy = { copy_link: link };
        chrome.storage.local.set({ current_copy });
      })

      .catch((err) => {
        console.log('err', err);
      });
  }

  if (msg.action === 'add_friend_number') {
    let payload = {
      phonenumber: msg.phonenumber,
    };
    console.log('payload', payload);
    fetch(URL + '/api/addfriendnumber?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log('result', json);
        if (json.success === true) {
          fetch(URL + '/api/getfriends?uid=' + msg.uid)
            .then((res) => res.json())
            .then((json) => {
              let friends = json.contacts;
              let feedbackNotif = {
                variant: 'good',
                message: 'Success!!',
              };
              chrome.storage.local.set({ friends });
              chrome.storage.local.set({ feedbackNotif });
            });
        } else {
          let feedbackNotif = {
            variant: 'bad',
            message: json.reason,
          };
          chrome.storage.local.set({ feedbackNotif });
        }
      });
  }

  // finished
  if (msg.action === 'update preview') {
    chrome.storage.local.get(['uId'], (res) => {
      // let startTime = new Date();
      // console.log('making fetch request for dashboard load');
      fetch(URL + '/api/closet_preview?uid=' + res.uId)
        .then((res) => res.json())
        .then((json) => {
          let endTime = new Date();
          // console.log('extension_dashboard', json);
          // console.log(
          //   'time passed for initial load:',
          //   Math.round((endTime - startTime) / 1000),
          //   'seconds'
          // );
          // console.log('closet_preview', json);
          let closet_preview = json.closet_preview;
          chrome.storage.local.set({ closet_preview });
        });
    });
  }
  if (msg.action === 'send rex') {
    let payload = {
      contact_id: msg.contact_id,
      product_id: msg.product_id,
    };
    fetch(URL + '/api/send_rex?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        let feedbackNotif = '';
        if (json.success === true) {
          feedbackNotif = {
            variant: 'good',
            message: 'Request Sent!',
          };
          chrome.storage.local.set({ feedbackNotif });
        } else {
          feedbackNotif = {
            variant: 'bad',
            message: 'User Opted Out :(',
          };
          chrome.storage.local.set({ feedbackNotif });
        }
      });
  }
  if (msg.action === 'change nickname') {
    let payload = {
      contact_id: msg.contact_id,
      nickname: msg.new_nickname,
    };
    fetch(URL + '/api/editfriendnumber?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        if (json.success === true) {
          fetch(URL + '/api/getfriends?uid=' + msg.uid)
            .then((res) => res.json())
            .then((json) => {
              let friends = json.contacts;
              let feedbackNotif = {
                variant: 'good',
                message: 'Success!!',
              };
              chrome.storage.local.set({ friends });
              chrome.storage.local.set({ feedbackNotif });
            });
        }
      });
  }
  if (msg.action === 'send friend request') {
    let payload = {
      username: msg.username,
    };
    fetch(URL + '/api/get-user-from-username?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.text())
      .then((json) => {
        console.log(json);
        let feedbackNotif = '';
        if (json.Success === true) {
          feedbackNotif = {
            variant: 'good',
            message: 'Request Sent!',
          };
          chrome.storage.local.set({ feedbackNotif });
        } else {
          feedbackNotif = {
            variant: 'bad',
            message: 'Does Not Exist',
          };
          chrome.storage.local.set({ feedbackNotif });
        }
      });
  }
});
