import React, {useState, useEffect} from 'react';
import logo from '../../assets/img/logo.svg';
import {updateState} from './chromeTools'
// Components
import Profile from './components/sliders/profile'
import Notification from './components/sliders/notification'
import Landing from './components/landing/landing'
import CurrentItem from './components/currentItem/currentItem'
import Home from './components/home/home'
import Closets from './components/closets/closets'
import Header from './components/header/header'
import Footer from './components/footer/footer'

// styling
import './App.scss';

// Libraries
import { wrap } from "popmotion";
import {AnimatePresence, motion} from 'framer-motion'

// Auth
import firebase from 'firebase';
require('firebase/auth')

const Popup = () => {
  // Manages the two popups, these states don't get saved
  const [showProfile, showProfileSet] = useState(false)
  const [showNotification, showNotificationSet] = useState(false)

  // these states persist & are saved in chrome.local
  const [homePageData, homePageDataSet] = useState(undefined)
  const [friendsData, friendsDataSet] = useState(undefined)
  const [currentItemData, currentItemDataSet] = useState(undefined)
  const [closetData, closetDataSet] = useState(undefined)
  const [closetPreviewData, closetPreviewDataSet] = useState(undefined)


  const [[page, direction], setPage] = useState([undefined, 0]);
  const [currentUid, currentUidSet] = useState("")


  async function fetchUserInfo() {
    await firebase.auth().onAuthStateChanged(user => {
      if (user) {
          // make a fetch to get user info based on user.uid (or do this in dashboard)
          console.log('fetch user info')
          currentUidSet(user.uid)
          updateState('uId', user.uid)

      } else {
          currentUidSet('empty')
      }
    });
  }

  useEffect(() => {
    fetchUserInfo();
    chrome.storage.local.get(["currentItem", "friends", "closet", "closetPreview", "homepage", "page", "uId"], res =>
      {
        currentItemDataSet(res.currentItem)
        friendsDataSet(res.friends)
        closetDataSet(res.closet)
        homePageDataSet(res.homepage)
        closetPreviewDataSet(res.closetPreview)
        setPage([res.page, 0])
        currentUidSet(res.uId)
      }
    )
    return () => {
    }
  }, [])
  
  chrome.storage.onChanged.addListener( response => {
    if (response.closet){
      closetDataSet(response.closet.newValue)
      console.log("closet values have changed", response)
    }
    if (response.friends){
      friendsDataSet(response.friends.newValue)
      console.log("friends values have changed", response)
    }
    if (response.currentItem){
      currentItemDataSet(response.currentItem.newValue)
      console.log("friends values have changed", response)
    }
    if (response.homepage){
      homePageDataSet(response.homepage.newValue)
      console.log("homepage values have changed", response)
    }
    if (response.closetPreview){
      closetPreviewDataSet(response.closetPreview.newValue)
      console.log("closetPreview values have changed", response)
    }
  }
)

  // Handle Sliders
  const showMainScreen = () => {
    showNotificationSet(false)
    showProfileSet(false)
  }

  // All current pages
  let pages = [
    <CurrentItem uid={currentUid} currentItem={currentItemData} closets={closetData} friends={friendsData}/>, 
    <Home uid={currentUid} homepageData={homePageData}/>, 
    <Closets uid={currentUid}  closetData={closetData} closetPreviews={closetPreviewData}/>]

  // Handle Page Scroll Animation
  const paginate = (newPage) => {
    setPage([newPage, 
      newPage > page ? 1 : -1 
    ]);
    updateState("page", newPage)
  };

  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 350 : -350,
        opacity: 1
      };
    },
    center: {
      zIndex: 1,
      x: direction > 0 ? 0 : 0,
      opacity: 1
    },
    exit: (direction) => {
      return {
        zIndex: 100,
        x: direction < 0 ? 350 : -350,
        opacity: 1
      };
    }
  };
  
  const imageIndex = wrap(0, pages.length, page);

  return (
    <div className="App">
        <AnimatePresence initial={false}>
          {
          currentUid === "empty" &&
            <Landing/>
          }
        </AnimatePresence>
        
      {/* Sliders */}
      <AnimatePresence>
        {showProfile &&  
        <Profile showProfileSet={showProfileSet}/> 
        }
      </AnimatePresence>

      <AnimatePresence>
        {showNotification &&
        <Notification showNotificationSet={showNotificationSet}/> 
        }
      </AnimatePresence>


      {/* General UI */}
        <Header showProfileSet={showProfileSet} showNotificationSet={showNotificationSet}/>
        {page !== undefined && 
        <div className="Content-Box" onClick={showMainScreen}>
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              className="Content"
              key={page}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
            >
              {pages[imageIndex]}
            </motion.div>
            </AnimatePresence>
        </div>
        }
        <Footer paginate={paginate} page={page}/>
        



    </div>
  );
};

export default Popup;
