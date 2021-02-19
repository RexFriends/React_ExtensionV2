import React from 'react'
import {getState, updateState, clearState} from '../../chromeTools'
import {motion} from 'framer-motion'

import firebase from 'firebase';
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

    return(
        <motion.div className="Profile"
        animate={{ width: 275, x: 0}}
        initial={{ width: 0, x: 275 }}
        exit={{ x: 275 }}
        transition={{spring}}
        >
            <h2>Profile Slide in </h2>
            <button onClick={()=>{showProfileSet(false)}}>X</button>
            <button onClick={()=>{signOut()}}>Sign Out</button>
        </motion.div>
    )
}

export default Profile