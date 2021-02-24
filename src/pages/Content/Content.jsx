import React, {useState, useEffect} from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import {BiCloset} from 'react-icons/bi'
import {AiOutlineShareAlt, AiOutlineClose} from 'react-icons/ai'
import {IoMdAdd} from 'react-icons/io'
import './Content.scss'
import CircularProgress from '@material-ui/core/CircularProgress'
import Checkbox from '@material-ui/core/Checkbox'
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Icon } from '@material-ui/core'
import TextField from '@material-ui/core/TextField'

const useStyles = makeStyles({
    root: {
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    icon: {
      borderRadius: 3,
      width: 16,
      height: 16,
      boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
      backgroundColor: '#f5f8fa',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
      '$root.Mui-focusVisible &': {
        outline: '2px auto rgba(19,124,189,.6)',
        outlineOffset: 2,
      },
      'input:hover ~ &': {
        backgroundColor: '#ebf1f5',
      },
      'input:disabled ~ &': {
        boxShadow: 'none',
        background: 'rgba(206,217,224,.5)',
      },
    },
    checkedIcon: {
      backgroundColor: '#137cbd',
      backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
      '&:before': {
        display: 'block',
        width: 16,
        height: 16,
        backgroundImage:
          "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
          " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
          "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
        content: '""',
      },
      'input:hover ~ &': {
        backgroundColor: '#106ba3',
      },
    },
  });

const Content = () => {
    const [uid, uidSet] = useState(undefined)
    const [itemSaved, itemSavedSet] = useState(false) 
    const [closetList, closetListSet] = useState(undefined)
    const [currentItem, currentItemSet] = useState(undefined)
    const [currentItemClosets, currentItemClosetsSet] = useState([])
    const [showCloset, showClosetSet] = useState(false)
    const [showShare, showShareSet] = useState(false)
    const [showNewClosetField, showNewClosetFieldSet] = useState(false)
    const [newClosetText, newClosetTextSet] = useState("")
    const [closetSaveError, closetSaveErrorSet] = useState(undefined)
    const classes = useStyles();

    chrome.storage.onChanged.addListener( response => {
        if (response.closet){
            closetListSet(response.closet.newValue)
            if(response.closet.newValue && response.closet.oldValue){
                if(response.closet.newValue.length > response.closet.oldValue.length){
                    let newClosetId = response.closet.newValue[response.closet.newValue.length - 1].id
                    currentItemClosetsSet([...currentItemClosets,newClosetId])
                }
            }
            
        }
        if(response.closet_save_error){
            console.log("error closet", response.closet_save_error)
            if(response.closet_save_error.newValue){
                closetSaveErrorSet(response.closet_save_error.newValue)
                chrome.storage.local.set({closet_save_error: undefined})
            }
        }
    })

    useEffect(() => {
        chrome.storage.local.get(["uId", "closet"], res => {
            uidSet(res.uId)
            closetListSet(res.closet)
        })
        return () => {
            
        }
    }, [])
   
    const handleSaveItem = () => {
        let payload = {
            action: "save-item"
        }
        chrome.runtime.sendMessage(payload, (reply) => {
            console.log("sent save-item")
        })
        itemSavedSet("loading")
        setTimeout(() => itemSavedSet("saved"), 1000)

    }

    const handleManageCloset = () => {
        showCloset ? 
        showClosetSet(false)
        :
        chrome.storage.local.get(null, res => {
            currentItemSet(res.currentItem)
            currentItemClosetsSet(res.currentItem.closets)
            showClosetSet(true)
        })
    }

    const handleCheck = (closet_id) => {
        let tempCurrent = currentItemClosets
        let payload = {
            closet_id: closet_id,
            item_id: currentItem.id,
            uid: uid
        }
        if(currentItemClosets.includes(closet_id)){
            tempCurrent = tempCurrent.filter(id => id !== closet_id)
            payload.action =  "remove closet-item"
        }else{
            payload.action = "add closet-item"
            tempCurrent = [closet_id, ...tempCurrent]
        }
        chrome.runtime.sendMessage(payload, (reply) => {
            console.log(payload.action)
        })
        currentItemClosetsSet(tempCurrent)
    }

    const handleNewCloset = () => {
        let payload = {
            action: "add to-new-closet",
            closet_name: newClosetText, // closet id
            item_id: currentItem.id, // item id
            uid: uid,
            closets: closetList
        }
        chrome.runtime.sendMessage(payload, (reply) => {
            console.log(payload.action)
        }) 
        showNewClosetFieldSet(false)
    }

    const handleManageShare = () => {
        showShareSet(!showShare)
    }


    if(uid === "empty" ){
        return(
            <div id="request-signin">Login through the extension to start using rex!</div>
        )
    }else{
        return(
            <div id="landing-button">
                {
                    itemSaved === "saved" &&  
                    <>
                        {
                            showCloset &&
                                <div id="itemcloset-list">
                                    
                                    {
                                        showNewClosetField ? 
                                        <div id="new-closet-field">
                                            <input id="textfield" placeholder="Closet Name" autoComplete="off" maxLength="15" value={newClosetText} onChange={(e)=>newClosetTextSet(e.target.value)}/>
                                            <IconButton onClick={handleNewCloset} size="small" id="icon">
                                                <IoMdAdd/>
                                            </IconButton>
                                        </div>
                                        : <Button id="new-closet" onClick={()=>showNewClosetFieldSet(true)}>New Closet</Button>
                                    }
                                        
                                 
                                    {
                                        closetList.map(
                                            (closet, i) => 
                                            <div id="closet-item" key={i}>
                                                <Checkbox 
                                                className={classes.root}
                                                color="default"
                                                checked={
                                                    currentItemClosets.includes(closet.id) 
                                                }
                                                checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
                                                icon={<span className={classes.icon} />}
                                                inputProps={{ 'aria-label': 'decorative checkbox' }}
                                                onClick={()=>handleCheck(closet.id)}
                                                /> 
                                                <div id="closet-name">{closet.name}</div>
                                            </div>
                                        )
                                    }
                                </div>
                        }
                        <div id="saved-item-options">
                        {showCloset ?
                            <IconButton id="closet-button" onClick={handleManageCloset} size="small">
                                <AiOutlineClose/>
                            </IconButton>
                            :
                            <IconButton id="closet-button" onClick={handleManageCloset} size="small">
                                <BiCloset/>
                            </IconButton>
                        }
                        {showShare ?
                            <IconButton id="closet-button" onClick={handleManageShare} size="small">
                                <AiOutlineClose/>
                            </IconButton>
                            :
                            <IconButton id="closet-button" onClick={handleManageShare} size="small">
                                <AiOutlineShareAlt/>
                            </IconButton>
                        }
                        </div>
                        <img id="cart-icon" src="https://extension-static-image-hosting-rexfriends.s3.amazonaws.com/injection-cart-check.png" alt="itemsavedicon"/>    
                    </>
                }
                {
                    itemSaved === "loading" &&
                    <>
                        <CircularProgress id="loading" size={16} thickness={5}/>
                        <img id="cart-icon" src="https://extension-static-image-hosting-rexfriends.s3.amazonaws.com/injection-cart-nocheck.png" alt="itemsavedicon"/>    
                    </>
                }
                {
                    itemSaved === false &&
                    <>
                    <Button  id="save-button" onClick={handleSaveItem} > 
                        Save Item
                    </Button>
                        <img id="cart-icon" src="https://extension-static-image-hosting-rexfriends.s3.amazonaws.com/injection-cart-nocheck.png" alt="itemsavedicon"/>    
                    </>
                }
                {
                    closetSaveError &&
                    <div id="error" onClick={()=>{closetSaveErrorSet(false)}}> {closetSaveError} </div>
                }
                
            </div>
        )
       
    }


    
    
}

export default Content