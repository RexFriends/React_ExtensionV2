import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import '../../assets/img/128.png';

console.log('This is the background page.');
console.log('Put the background scripts here.');

// const Prod_URL = "http://rexfriendsserver-env.eba-xpijkhn3.us-east-1.elasticbeanstalk.com";
const URL = "http://127.0.0.1:5000";

chrome.runtime.onInstalled.addListener( response => {
    console.log("runtime install: ", response)
    // redirect user to website on install
    chrome.tabs.create(
        {
            active: true,
            url: "https://google.com"
        }
    )
    // these clear all stoarge, not sure if neccessary for prod
    chrome.storage.sync.clear()
    chrome.storage.local.clear()
    // this sets all storage
    chrome.storage.local.set(
        {
            uId: "empty", 
            page: 1,
            user: {
                first_name: "Joe",
                last_name: "Schmo" 
            }
        }
    )
});

// This listens to state changes and can trigger functions here
chrome.storage.onChanged.addListener( response => {
    
    if(response.uId){
        chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
            chrome.tabs.reload(arrayOfTabs[0].id);});
        // makes a fetch call to the for extension dashboard on login
        if(response.uId.oldValue === "empty"){
            fetch(URL + "/api/extension_dashboard?uid=" + response.uId.newValue )
                .then(res => res.json())
                .then(json => {console.log("extension_dashboard", json)
                chrome.storage.local.set(json)
            })
        }
    }
})

// Runs code from content.js that is async & may be affected by page change
chrome.runtime.onMessage.addListener((msg, sender_info, reply)=> {
    if(msg.action === "login-signup"){
        let payload = {
            "firstname": msg.firstname,
            "lastname": msg.lastname,
            "email": msg.email,
            "phone": msg.phone,
            "uid": msg.uid
        }
        console.log("fetch request to login-signup", payload)
        fetch(URL + "/api/signupweb",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(
            res => res.json()
        ).then(
            json => console.log("signupweb fetch result:", json)
        )
        return
    }

    if(msg.action === "custom-signin"){
        let payload = {
            "uid": msg.uid,
            "email": msg.email
        }
        console.log("fetch request to custom-signin", payload)
        fetch(URL + "/api/webdashboard?uid=" + msg.uid,{
            method: "POST",
            headers:{   
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            
        }).then(res => res.json())
        .then(json => console.log("custom-signin fetch result:",json))

        return
    }
    // finished
    if(msg.action === "save-item"){
        chrome.tabs.captureVisibleTab(sender_info.tab.windowId, {}, function(image){
            chrome.storage.local.get(['uId'], function(result){
                if(result.uId !== "empty"){
                    let payload = {
                        "URL": sender_info.url,
                        "ImagePNG": image,
                    }   
                    console.log("fetch request to /api/save-rex:", payload)
                    fetch(URL + "/api/save-rex?uid=" + result.uId,{
                        method: "POST",
                        headers:{   
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload),
                        
                    })
                    .then(response => response.json())
                    .then(json => {
                        if(json.currentItem){
                            chrome.storage.local.set({currentItem: json.currentItem})
                        }                
                    })
                    
                }
            })
        })
       return
    }
    // finished
    if(msg.action === "add closet-item"){
        let payload = {
            "closet_id": msg.closet_id,
            "product_id": msg.item_id,
            "new_state": true
        }
        console.log("fetch request to add closet item:", msg)
        fetch(URL + "/api/item_closet_change?uid=" + msg.uid,{
            method: "POST",
            headers:{   
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            
        })
        .then(response => response.json())
        .then(json => console.log("add closet item fetch result:", json))

        chrome.storage.local.get(["currentItem"], res =>{
            let currentItem =  res.currentItem
            currentItem.closets.push(msg.closet_id)
            chrome.storage.local.set({currentItem})
        })
        return
    }
    // finished
    if(msg.action === "remove closet-item"){
        let payload = {
            "closet_id": msg.closet_id,
            "product_id": msg.item_id,
            "new_state": false
        }
        console.log("fetch request to remove closet item:", msg)
        fetch(URL + "/api/item_closet_change?uid=" + msg.uid,{
            method: "POST",
            headers:{   
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            
        }).then(response => response.json())
        .then(json => console.log("remove closet item fetch result:", json))

        chrome.storage.local.get(["currentItem"], res =>{
            let currentItem =  res.currentItem
            let tempCloset =  currentItem.closets.filter( x => x !== msg.closet_id)
            currentItem.closets = tempCloset
            chrome.storage.local.set({currentItem})
        })
        return
    }

    if(msg.action === "add to-new-closet"){
        let payload = {
            "closet_name": msg.closet_name,
            "product_id": msg.item_id
        }
        console.log("add item to new closet", payload)
        fetch(URL + "/api/new_closet_with_item?uid=" + msg.uid,{
            method: "POST",
            headers:{   
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            
        })
        .then(response => response.json())
        .then(json => console.log("add item to new closet fetch result:", json))
    }
});

