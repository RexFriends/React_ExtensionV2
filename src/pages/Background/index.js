import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import '../../assets/img/128.png';
import APIURL from '../../assets/url';

chrome.runtime.onInstalled.addListener((response) => {
  //* redirect user to website on install
  chrome.tabs.create({
    active: true,
    url: 'https://rexfriends.com',
  });
  //* these clears & sets default storage on install
  chrome.storage.sync.clear();
  chrome.storage.local.clear();
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
//*  Refreshes the contentscript page when the browser url is changed
//? Currently this information is not used for anything, but we could have it automatically sent to webscarped on laod
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    chrome.storage.local.set({ uri: changeInfo.url });
  }
});

//* This listens to state changes and can trigger functions here
chrome.storage.onChanged.addListener((response) => {
  if (response.uId) {
    //* refreshes window on user login to display proper injection
    setTimeout(() => chrome.tabs.reload(), 500);

    //* runs if the user is authorized by firebase
    if (
      response.uId.oldValue === 'empty' &&
      response.uId.hasOwnProperty('newValue')
    ) {
      fetch(APIURL + '/api/extension_dashboard?uid=' + response.uId.newValue)
        .then((res) => res.json())
        .then((json) => {
          //* This means the user account is new & we have to recall this route after the user is created because the new user data needs to be constructed in the db
          if (json.hasOwnProperty('Unauthorized Access')) {
            const runInitialUserFetch = () => {
              fetch(
                APIURL + '/api/extension_dashboard?uid=' + response.uId.newValue
              )
                .then((res) => res.json())
                .then((json) => {
                  chrome.storage.local.set(json);
                });
              fetch(APIURL + '/api/get_notif?uid=' + response.uId.newValue)
                .then((res) => res.json())
                .then((json) => {
                  let notifications = json.notifications;
                  chrome.storage.local.set({ notifications });
                });
            };
            setTimeout(() => runInitialUserFetch(), 1000);
            return;
          }
          chrome.storage.local.set(json);
        });
    }
  }
});

//* These are all listening to either content or popup to make fetch calls & state changes. (Kind of like redux dispatch)
chrome.runtime.onMessage.addListener((msg, sender_info, reply) => {
  //* console logs in background js
  if (msg.action === 'log') {
    console.log(msg.msg, msg.log);
  }

  //* Creates new account / logs user in if using Google/FB OAuth
  if (msg.action === 'login-signup') {
    let payload = {
      firstname: msg.firstname,
      lastname: msg.lastname,
      email: msg.email,
      phone: msg.phone,
      uid: msg.uid,
    };
    fetch(APIURL + '/api/signupweb', {
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
  //* Screenshots & saves product/page
  if (msg.action === 'save-item') {
    chrome.tabs.captureVisibleTab(sender_info.tab.windowId, function (image) {
      chrome.storage.local.get(['uId'], function (result) {
        if (result.uId !== 'empty') {
          let payload = {
            URL: msg.uri ? msg.uri : sender_info.url,
            ImagePNG: image,
          };
          fetch(APIURL + '/api/save-rex?uid=' + result.uId, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          })
            .then((response) => response.json())
            .then((json) => {
              if (json.success === false) {
                console.log(json);
                chrome.storage.local.set({ closet_save_error: json.reason });
              }
              if (json.currentItem) {
                let current_item = json.currentItem;
                chrome.storage.local.set({ current_item });
              }
            })
            .catch(() => console.log('save-rex error'));
        }
      });
    });
    return;
  }
  //* Adds item to closet
  if (msg.action === 'add closet-item') {
    let payload = {
      closet_id: msg.closet_id,
      product_id: msg.item_id,
      new_state: true,
    };
    fetch(APIURL + '/api/item_closet_change?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => {
        chrome.storage.local.get(['current_item'], (res) => {
          // ? console.log('remove closet item fetch result:', json)
          let current_item = res.current_item;
          current_item.closets.push(msg.closet_id);
          chrome.storage.local.set({ current_item });
        });
      })
      .catch(() => console.log('add-to-closet error'));

    return;
  }
  //* Remove item from closet
  if (msg.action === 'remove closet-item') {
    let payload = {
      closet_id: msg.closet_id,
      product_id: msg.item_id,
      new_state: false,
    };
    fetch(APIURL + '/api/item_closet_change?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => {
        // ? console.log('remove closet item fetch result:', json)
        chrome.storage.local.get(['current_item'], (res) => {
          let current_item = res.current_item;
          let tempCloset = current_item.closets.filter(
            (x) => x !== msg.closet_id
          );
          current_item.closets = tempCloset;
          chrome.storage.local.set({ current_item });
        });
      })
      .catch(() => console.log('remove-from-closet error'));

    return;
  }
  //* Creates a new item & adds it to the closet
  if (msg.action === 'add to-new-closet') {
    let payload = {
      closet_name: msg.closet_name,
      product_id: msg.item_id,
    };
    fetch(APIURL + '/api/new_closet_with_item?uid=' + msg.uid, {
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
      })
      .catch(() => console.log('add-to-new-closet error'));
  }
  //* Gets the latest saved item
  if (msg.action === 'get_currentItem') {
    if (msg.currentItemId !== undefined) {
      fetch(
        APIURL + `/api/product?uid=${msg.uid}&product_id=${msg.currentItemId}`
      )
        .then((res) => res.json())
        .then((json) => {
          let current_item = json.product;
          chrome.storage.local.set({ current_item });
        })
        .catch(() => console.log('get-current-item error'));
      return;
    }
    //? console.log('There is no item');
  }
  //* Creates a copy link url for the user to share
  if (msg.action === 'copy_link') {
    let payload = {
      listing_id: msg.listing_id,
    };
    fetch(APIURL + '/api/copy_feedback_link?uid=' + msg.uid, {
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
      .catch(() => console.log('copy-link error'));
  }
  //* Adds a friends phone number. will return whether or not it's successful
  if (msg.action === 'add_friend_number') {
    let payload = {
      phonenumber: msg.phonenumber,
    };
    fetch(APIURL + '/api/addfriendnumber?uid=' + msg.uid, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.success === true) {
          fetch(APIURL + '/api/getfriends?uid=' + msg.uid)
            .then((res) => res.json())
            .then((json) => {
              let friends = json.contacts;
              let feedbackNotif = {
                variant: 'good',
                message: 'Success!!',
              };
              chrome.storage.local.set({ friends });
              chrome.storage.local.set({ feedbackNotif });
            })
            .catch(() => console.log('add-friend-number pt2 error'));
        } else {
          let feedbackNotif = {
            variant: 'bad',
            message: json.reason,
          };
          chrome.storage.local.set({ feedbackNotif });
        }
      })
      .catch(() => console.log('add-friend-number pt1 error'));
  }
  //* Updates the closet preview page
  if (msg.action === 'update preview') {
    if (msg.uid) {
      let uId = msg.uid;
      chrome.storage.local.set({ uId });
      fetch(APIURL + '/api/closet_preview?uid=' + msg.uid)
        .then((res) => res.json())
        .then((json) => {
          let closet_preview = json.closet_preview;
          chrome.storage.local.set({ closet_preview });
        })
        .catch(() => console.log('update-preview error'));
    }
  }
  //* Sends a rex to a friend
  if (msg.action === 'send rex') {
    let payload = {
      contact_id: msg.contact_id,
      product_id: msg.product_id,
    };
    fetch(APIURL + '/api/send_rex?uid=' + msg.uid, {
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
            message: json.reason,
          };
          chrome.storage.local.set({ feedbackNotif });
        }
      })
      .catch(() => console.log('send-rex error'));
  }
  //* Change nickname of friend
  if (msg.action === 'change nickname') {
    let payload = {
      contact_id: msg.contact_id,
      nickname: msg.new_nickname,
    };
    fetch(APIURL + '/api/editfriendnumber?uid=' + msg.uid, {
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
          fetch(APIURL + '/api/getfriends?uid=' + msg.uid)
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
      })
      .catch(() => 'edit-friend-name error');
  }
  //* Send friend request (currently not being used)
  if (msg.action === 'send friend request') {
    let payload = {
      username: msg.username,
    };
    fetch(APIURL + '/api/get-user-from-username?uid=' + msg.uid, {
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
      })
      .catch(() => console.log('send-friend-request error'));
  }
  //* Update notifications
  if (msg.action === 'update notification') {
    chrome.storage.local.get('uId', (res) => {
      if (res.uId !== 'empty') {
        fetch(APIURL + '/api/get_notif?uid=' + res.uId)
          .then((res) => res.json())
          .then((json) => {
            let notifications = json.notifications;
            chrome.storage.local.set({ notifications });
          })
          .catch(() => console.log('update-notification error'));
      }
    });
  }
});
