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
            url: "https://rexfriends.com"
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
    // console.log("storage has changed for: ", response)
    if(response.uId){
        chrome.tabs.query({active: true, currentWindow: true}, function (arrayOfTabs) {
            chrome.tabs.reload(arrayOfTabs[0].id);});
        if(response.uId.oldValue === "empty"){
        // setting up seed data
            chrome.storage.local.set(
                {
                    currentItem: {
                        imgUrl: "https://images-na.ssl-images-amazon.com/images/I/81KkSJ5eotL._AC_SL1500_.jpg",
                        itemURL: "https://www.amazon.com/T-fal-Ultimate-Anodized-Nonstick-Dishwasher/dp/B004WULC3I?ref_=Oct_DLandingS_D_91f9fae8_60&smid=ATVPDKIKX0DER",
                        itemName: "T-fal Nonstick Dishwasher Safe Cookware Lid Fry Pan, 10-Inch, Black",
                        itemNotes: "Great for eggs",
                        id: 32,
                        closets:  [
                            23, 24, 25, 28 // save for later 2021 2020 summer
                        ],
                        feedbacks: [
                            {friend_id: 1, feedback: "I'm not really into it", review: "meh"},
                            {friend_id: 2, feedback: "LOVE IT!", review: "good"},
                            {friend_id: 5, feedback: "This looks disgusting... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi posuere, risus eget tincidunt luctus, nisi nisl tristique ex, ultrices laoreet nibh tortor nec est.", review: "bad"},
                            {friend_id: 4, sent: "waiting", time_sent: "2021-02-05T19:50:29+00:00"}                        
                        ]
                    },
                    friends: [
                        {name: "John", img: "", id: 1},
                        {name: "Dave", img: "", id: 2},
                        {name: "Lisa", img: "", id: 3},
                        {name: "Susan", img: "", id: 4},
                        {name: "Lauren", img: "", id: 5},
                        {name: "John2", img: "", id: 6},
                        {name: "Dave2", img: "", id: 7},
                        {name: "Lisa2", img: "", id: 8},
                        {name: "Susan3", img: "", id: 9},
                        {name: "Laure4", img: "", id: 10},
                        {name: "John2", img: "", id: 11},
                        {name: "Dave2213", img: "", id: 12},
                        {name: "Lisa22", img: "", id: 13},
                    ],
                    closet:  [
                        {name: "Save for later", count: 20, id: 23},
                        {name: "2021", count: 3, id: 24},
                        {name: "2020", count: 2,  id: 25},
                        {name: "back to school", count: 4, id: 26},
                        {name: "fieldtrip", count: 7, id: 27},
                        {name: "summer", count: 8, id: 28},
                        {name: "Item", count: 10, id: 29},
                        {name: "winter collection",  count: 12, id: 30},
                        {name: "Maybe when i drop some lbs", count: 2, id: 31},
                        {name:"Spongebob fit", count: 5, id: 32}
                    ],
                    closetPreview: [
                        {id: 23, items: [
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8ea7b758/images/d_08/170154C_D_08X1.jpg?sw=406",
                                id: 30
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw7962a4e5/images/a_107/171247C_A_107X1.jpg?sw=964",
                                id: 31
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw4ab3cf5a/images/a_107/170585C_A_107X1.jpg?sw=2000",
                                id: 32
                            }
                        ]},
                        {id: 24, items: [
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8ea7b758/images/d_08/170154C_D_08X1.jpg?sw=406",
                                id: 30
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw7962a4e5/images/a_107/171247C_A_107X1.jpg?sw=964",
                                id: 31
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw4ab3cf5a/images/a_107/170585C_A_107X1.jpg?sw=2000",
                                id: 32
                            }
                        ]},
                        {id: 25, items: [
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8ea7b758/images/d_08/170154C_D_08X1.jpg?sw=406",
                                id: 30
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw7962a4e5/images/a_107/171247C_A_107X1.jpg?sw=964",
                                id: 31
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw4ab3cf5a/images/a_107/170585C_A_107X1.jpg?sw=2000",
                                id: 32
                            }
                        ]},
                        {id: 26, items: [
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8ea7b758/images/d_08/170154C_D_08X1.jpg?sw=406",
                                id: 30
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw7962a4e5/images/a_107/171247C_A_107X1.jpg?sw=964",
                                id: 31
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw4ab3cf5a/images/a_107/170585C_A_107X1.jpg?sw=2000",
                                id: 32
                            }
                        ]},
                        {id: 27, items: [
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8ea7b758/images/d_08/170154C_D_08X1.jpg?sw=406",
                                id: 30
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw7962a4e5/images/a_107/171247C_A_107X1.jpg?sw=964",
                                id: 31
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw4ab3cf5a/images/a_107/170585C_A_107X1.jpg?sw=2000",
                                id: 32
                            }
                        ]},
                        {id: 28, items: [
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8ea7b758/images/d_08/170154C_D_08X1.jpg?sw=406",
                                id: 30
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw7962a4e5/images/a_107/171247C_A_107X1.jpg?sw=964",
                                id: 31
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw4ab3cf5a/images/a_107/170585C_A_107X1.jpg?sw=2000",
                                id: 32
                            }
                        ]},
                        {id: 29, items: [
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8ea7b758/images/d_08/170154C_D_08X1.jpg?sw=406",
                                id: 30
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw7962a4e5/images/a_107/171247C_A_107X1.jpg?sw=964",
                                id: 31
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw4ab3cf5a/images/a_107/170585C_A_107X1.jpg?sw=2000",
                                id: 32
                            }
                        ]},
                        {id: 30, items: [
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8ea7b758/images/d_08/170154C_D_08X1.jpg?sw=406",
                                id: 30
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw7962a4e5/images/a_107/171247C_A_107X1.jpg?sw=964",
                                id: 31
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw4ab3cf5a/images/a_107/170585C_A_107X1.jpg?sw=2000",
                                id: 32
                            }
                        ]},
                        {id: 31, items: [
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8ea7b758/images/d_08/170154C_D_08X1.jpg?sw=406",
                                id: 30
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw7962a4e5/images/a_107/171247C_A_107X1.jpg?sw=964",
                                id: 31
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw4ab3cf5a/images/a_107/170585C_A_107X1.jpg?sw=2000",
                                id: 32
                            }
                        ]},
                        {id: 32, items: [
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw8ea7b758/images/d_08/170154C_D_08X1.jpg?sw=406",
                                id: 30
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw7962a4e5/images/a_107/171247C_A_107X1.jpg?sw=964",
                                id: 31
                            },
                            {
                                img: "https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw4ab3cf5a/images/a_107/170585C_A_107X1.jpg?sw=2000",
                                id: 32
                            }
                        ]}
                    ],
                    homepage: {
                        title: "This is the homepage!",
                        affiliateLinks: [
                            {
                                name: "Walmart",
                                link: "https://www.walmart.com/",
                                logo: "https://www.powellandmahoney.com/wp-content/uploads/2017/03/retailers-walmart-logo-1.png"
                            },
                            {
                                name: "Urban Outfitters",
                                link: "https://www.urbanoutfitters.com/",
                                logo: "https://www.finelinetech.com/wp-content/uploads/URBAN-OUTFITTERS-logo-for-home-page.png"
                            },
                            {
                                name: "Macy's",
                                link: "https://www.macys.com/",
                                logo: "https://cdn.mos.cms.futurecdn.net/kPTwCmCKYJUwGbDbRZr9MX.png"
                            },
                            {
                                name: "Converse",
                                link: "https://www.converse.com/",
                                logo: "https://cdn.mos.cms.futurecdn.net/h28ZaxtM5kqAGb7587qns-320-80.jpg"
                            },
                            {
                                name: "Amazon",
                                link: "https://www.amazon.com/",
                                logo: "http://media.corporate-ir.net/media_files/IROL/17/176060/Oct18/Amazon%20logo.PNG"
                            },
                            {
                                name: "Macy's",
                                link: "https://www.macys.com/",
                                logo: "https://cdn.mos.cms.futurecdn.net/kPTwCmCKYJUwGbDbRZr9MX.png"
                            },
                            {
                                name: "Converse",
                                link: "https://www.converse.com/",
                                logo: "https://cdn.mos.cms.futurecdn.net/h28ZaxtM5kqAGb7587qns-320-80.jpg"
                            },
                            {
                                name: "Amazon",
                                link: "https://www.amazon.com/",
                                logo: "http://media.corporate-ir.net/media_files/IROL/17/176060/Oct18/Amazon%20logo.PNG"
                            },
                            {
                                name: "Macy's",
                                link: "https://www.macys.com/",
                                logo: "https://cdn.mos.cms.futurecdn.net/kPTwCmCKYJUwGbDbRZr9MX.png"
                            },
                            {
                                name: "Converse",
                                link: "https://www.converse.com/",
                                logo: "https://cdn.mos.cms.futurecdn.net/h28ZaxtM5kqAGb7587qns-320-80.jpg"
                            }
                        ]
                    }
                }
            )
            // Actual fetch
            // fetch(URL + "/api/save-rex?uid=" + response.uId)
        }
    }
})

// Runs code from content.js that is async & may be affected by page change
chrome.runtime.onMessage.addListener((msg, sender_info, reply)=> {


    // Signs user up/logs user in
    if(msg.action === "login-signup"){
        console.log("login-signup in background:", msg, sender_info)
        let payload = {
            "firstname": msg.firstname,
            "lastname": msg.lastname,
            "email": msg.email,
            "phone": msg.phone,
            "uid": msg.uid
        }
        console.log("payload to api", payload)
        // fetch(URL + "/api/signupweb",{
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(data)
        // }).then(
        //     res => res.json()
        // ).then(
        //     json => console.log(json)
        // )
    }

    // custom signin
    if(msg.action === "custom-signin"){
        console.log("custom sing-in in background:", msg, sender_info)
        let payload = {
            "uid": msg.uid,
            "email": msg.email
        }
        console.log("pay load to api", payload)
    }
    // Saves item to db
    if(msg.action === "save-item"){
        chrome.tabs.captureVisibleTab(sender_info.tab.windowId, {}, function(image){
            chrome.storage.local.get(['uId'], function(result){
                if(result.uId !== "empty"){
                    console.log("sender info", sender_info)
                    let payload = {
                        "URL": sender_info.url,
                        "ImagePNG": image,
                    }   
                    console.log("sending save item payload:", payload, result.uId)
                    fetch(URL + "/api/save-rex?uid=" + result.uId,{
                        method: "POST",
                        headers:{   
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(payload),
                        
                    }).then(response => response.json())
                    .then(json => console.log(json))
                    
                }
            })
        })
       
    }

    // Opens rexfriends dashboard on user open
    if(msg === "options"){
        chrome.tabs.create(
            {
                active: true,
                url: "https://rexfriends.com"
            }
        )
    }
});

