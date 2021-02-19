import React, {useState} from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import {BiCloset} from 'react-icons/bi'
import './Content.scss'



const Content = () => {
    const [uid, uIdSet] = useState(undefined)
    const [itemSaved, itemSavedSet] = useState(false) 
    const [closetList, closetListSet] = useState(undefined)

    chrome.storage.local.get(["uId"], res => {
        uIdSet(res.uId)
    })

    chrome.storage.local.get(["closet"], res => {
        closetListSet(res.closet)
    })


    const handleSaveItem = () => {
        let payload = {
            action: "save-item"
        }
        chrome.runtime.sendMessage(payload, (reply) => {
            console.log("sent save-item", reply)
        })
        itemSavedSet(true)
    }

    // if(uid === undefined ){
    //     return(
    //        <div>Nothing here</div>
    //     )
    // }else if(uid === "empty"){
    //     return(
    //         <div id="request-signin">Please Sign in</div>
    //     )
    // }else{
        return(
            <div id="landing-button">
                {
                    !itemSaved ? 
                    <IconButton id="closet-button">
                        <BiCloset/>
                    </IconButton>
                    :
                    <Button  id="save-button" onClick={handleSaveItem} > 
                        Save Item
                    </Button>
                }
                <img id="cart-icon" src={itemSaved ? "https://extension-static-image-hosting-rexfriends.s3.amazonaws.com/injection-cart-check.png" : "https://extension-static-image-hosting-rexfriends.s3.amazonaws.com/injection-cart-nocheck.png"} alt="itemsavedicon"/>    
            </div>
        )
       
    // }


    
    
}

export default Content