import React from 'react'
import {getState, updateState, clearState} from '../../chromeTools'
import {AiOutlineClose, AiTwotoneSetting} from 'react-icons/ai'
import Button from '@material-ui/core/Button'
import {motion} from 'framer-motion'

import firebase from 'firebase';
import IconButton from '@material-ui/core/IconButton'
require('firebase/auth')

function Profile ({showProfileSet}){
    const spring = {
        type: "spring",
        damping: 20,
        stiffness: 100
      }

    function signOut() {
        firebase.auth().signOut().then(() => {
            updateState("uId", "empty")
            // successful log out
        }).catch((error) => {
            console.log(error)
        });
    }

    const OpenOptions = () => {
        chrome.tabs.create({ url: "options.html" });
    }

    return(
        <motion.div className="Profile"
        id="profile"
        animate={{ width: 275, x: 0}}
        initial={{ width: 0, x: 275 }}
        exit={{ x: 275 }}
        transition={{spring}}
        >
            <div  id="top">
                <IconButton onClick={()=>{showProfileSet(false)}}><AiOutlineClose/></IconButton>
                <div>Profile</div>
                <IconButton onClick={OpenOptions}><AiTwotoneSetting/></IconButton> 
            </div>
            <div id="content">
                <img src="https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png" id="propic" alt="propic"/>
            
                <Button onClick={()=>{signOut()}}  id="signout" variant="contained" color="secondary">Sign Out</Button> 
            </div>
        </motion.div>
    )
}

export default Profile