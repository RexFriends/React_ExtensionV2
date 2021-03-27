import React, { useState, useRef, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Moment from 'react-moment';
import { FaCopy } from 'react-icons/fa';
import {
  BiCloset,
  BiSad,
  BiHappyHeartEyes,
  BiMailSend,
  BiSend,
} from 'react-icons/bi';
import { AiOutlineMeh } from 'react-icons/ai';
import { VscChromeClose } from 'react-icons/vsc';
import { CgCloseR } from 'react-icons/cg';
import { RiMailSendLine } from 'react-icons/ri';
import { MdNavigateBefore } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import Image from '../../../../assets/img/Asset 1.png';

function CurrentItem({ uid, currentItem, closets, friends }) {
  const [showPage, showPageSet] = useState('feedback');
  const [friendList, friendListSet] = useState(0);
  const [direction, directionSet] = useState(undefined);
  const [newCloset, newClosetSet] = useState(undefined);
  const [friendDetail, friendDetailSet] = useState(undefined);
  const [showFeedback, showFeedbackSet] = useState(false);
  const [showWaiting, showWaitingSet] = useState(false);
  const [showRequestFeedback, showRequestFeedbackSet] = useState(false);
  const [feedbackSuccess, feedbackSuccessSet] = useState(false);
  const [images, imagesSet] = useState([]);
  const [imageIndex, imageIndexSet] = useState(0);
  const [showCopiedLink, showCopiedLinkSet] = useState(undefined);
  const [currentCopy, currentCopySet] = useState('');
  const [currentItemExist, currentItemExistSet] = useState(true);

  const closetInput = useRef(null);

  useEffect(() => {
    console.log('Current Item');

    if (JSON.stringify(currentItem) === '{}') {
      currentItemExistSet(false);
      return;
    }

    if (currentItem) {
      chrome.storage.local.get(['uId'], (res) => {
        let payload = {
          action: 'get_currentItem',
          uid: res.uId,
          currentItemId: currentItem.id,
        };

        chrome.runtime.sendMessage(payload);
        let images = [];
        if (currentItem.images !== null) {
          fetch(currentItem.images)
            .then((res) => res.json())
            .then((json) => {
              //! need to transform the weird base64 code to an img html object
              for (const key in json) {
                let base64 = json[key];
                if (
                  base64.substring(0, 2) === "b'" &&
                  base64[base64.length - 1]
                ) {
                  base64 = base64.slice(2);
                  base64 = base64.slice(0, -1);
                }
                images.push(
                  <img src={'data:image/jpeg;base64,' + base64} id="img" />
                );
              }
              //! currently only shows the first image due to webscraper being BAD :(
              imagesSet([images[0]]);
            });
        } else {
          // ! display screenshot if webscraper is unsuccessful
          fetch(currentItem.screenshot)
            .then((res) => res.json())
            .then((json) => {
              // console.log('this is the screenshot fetch data', json);
              images.push(<img src={json.uri} id="img" />);
              imagesSet(images);
            });
        }
      });
    }

    return () => {};
  }, [currentItem]);

  chrome.storage.onChanged.addListener((response) => {
    if (response.current_copy) {
      // console.log('in chrome', response.current_copy.newValue.copy_link);
      let link = response.current_copy.newValue.copy_link;
      currentCopySet(link);
      var inp = document.createElement('input');
      document.body.appendChild(inp);
      inp.value = link;
      inp.select();
      document.execCommand('copy', false);
      inp.remove();
    }
  });
  // focuses on new textbox when rendered
  useEffect(() => {
    if (closetInput.current !== null) {
      closetInput.current.focus();
    }
    return () => {};
  }, [newCloset]);

  // if current item doesn't exist
  if (currentItem === undefined) {
    return (
      <div className="CurrentItem" id="empty">
        Click <div id="text"> Save Item </div> on a product page to see it here!
      </div>
    );
  }

  // animation for page scroll
  const variants = {
    enter: (direction) => {
      return {
        x: direction > 0 ? 350 : -350,
        opacity: 0,
      };
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => {
      return {
        x: direction < 0 ? 350 : -350,
        opacity: 0,
      };
    },
  };

  // combines the currentItem.feedbacks with friends
  const handleFriendObject = (feedbacks, friends) => {
    let repliedId = feedbacks.map((f) => f.friend_id);
    let tempFeedback = feedbacks.map((feedback) => {
      let tempFriend = friends.find(
        (friend) => friend.id === feedback.friend_id
      );
      return { ...tempFriend, ...feedback };
    });
    let tempFriends = friends.filter(
      (friend) => !repliedId.includes(friend.id)
    );

    return tempFeedback.concat(tempFriends);
  };

  // this will combine the currentItem.closet with closets
  const closetObjectOrder = (currentItem, closets) => {
    return closets
      .map((closet) => {
        let tempCloset = closet;
        if (currentItem.closets.includes(closet.id)) {
          tempCloset.state = true;
        } else {
          tempCloset.state = false;
        }
        return tempCloset;
      })
      .sort((a, b) => (a.state === false ? 1 : -1));
  };

  // handles which friend page to show
  const handlePage = (page) => {
    if (showPage === page) {
      showPageSet('feedback');
      clearNewCloset();
    } else {
      closeFriendDetails();
      showPageSet(page);
    }
  };

  // closes friend details
  const closeFriendDetails = () => {
    friendDetailSet(undefined);
    showFeedbackSet(false);
    showWaitingSet(false);
    showRequestFeedbackSet(false);
    feedbackSuccessSet(false);
  };

  // handles the friends list scrolling
  const handleNextFriendsRow = () => {
    friendListSet(friendList + 1);
    directionSet(1);
    closeFriendDetails();
  };

  const handlePrevFriendsRow = () => {
    friendListSet(friendList - 1);
    directionSet(-1);
    closeFriendDetails();
  };

  // closes new closet text box
  const clearNewCloset = () => {
    newClosetSet(undefined);
  };

  const handleFocus = (event) => {
    event.target.setAttribute('autocomplete', 'off');
  };

  // determines which box variant to show based on friend reply status
  const handleFriendStatus = (friendData) => {
    closeFriendDetails();
    friendDetailSet(friendData);

    if (friendData.feedback) {
      showFeedbackSet(true);
    } else if (friendData.sent) {
      showWaitingSet(true);
    } else {
      showRequestFeedbackSet(true);
    }
  };

  // ! fetch request here
  const handleFeedbackRequest = (id) => {
    let payload = {
      uId: uid,
      friendId: id,
      listingID: currentItem.id,
    };
    // console.log('Make a fetch request with this payload:', payload);
    feedbackSuccessSet(true);
    // on success, turn button into a check mark or show an svg animted that sent an email out
    // ALSO! Modify the contact data to include the current updated values, something like bellow
    // for (let i = 0; i < data.friends; i++){
    //     if(data.friends[i].id === id){
    //         let currentTime = new Date.now()
    //         data.friends[i].sent = "waiting"
    //         data.friends[i].time_sent = currentTime.toISOString()
    //         console.log(data.friends[i])
    //     }
    // }
    // on error, do something, show user an error message, e.g. contact can't be reached, or contact has canceled rex requests.
  };

  const handleCopyLink = () => {
    let payload = {
      action: 'copy_link',
      uid: uid,
      listing_id: currentItem.id,
    };
    chrome.runtime.sendMessage(payload);
    setTimeout(() => showCopiedLinkSet(true), 500);
    setTimeout(() => showCopiedLinkSet(false), 5000);
  };

  // ! fetch request
  const handleRequestApp = (appName) => {
    let payload = {
      app: appName,
      uId: uid,
      listingID: currentItem.id,
    };

    // console.log(
    //   'Request App Share with:',
    //   appName,
    //   'Using this payload:',
    //   payload
    // );
    // trigger user share, 3 options
    // copy link will trigger a popup that tells the user the link has been copied
    // messenger will popup fb messenger (if user is connected)
    // whatsapp will do something ?
  };

  // ! fetch request
  const handleClosetChange = (closetData) => {
    // console.log(
    //   'Closet State change',
    //   closetData.name,
    //   'to =>',
    //   !closetData.state
    // );
    // trigger closet state change
    // client side rendering of closet data change before fetch request is completed
    // fetch request
  };

  // ! fetch request
  const handleNewCloset = () => {
    // console.log('create New Closet named:', newCloset);
    // make a fetch call and then add the new closet to data
    clearNewCloset();
  };

  const handleCarousel = (e) => {
    // console.log();
    imageIndexSet(e);
  };

  return (
    <div className="CurrentItem">
      {currentItemExist ? (
        <>
          <div id="header">Your Last Saved Item . . .</div>
          <div id="carousel">
            <Carousel
              value={imageIndex}
              slides={images}
              onChange={handleCarousel}
              plugins={['centered']}
            />
            {/* Don't need a dot carousel if there's only one image */}
            {/* <Dots
            value={imageIndex}
            onChange={handleCarousel}
            number={images.length}
          /> */}
          </div>
          <div id="options">
            <div id="features">
              <IconButton onClick={() => handlePage('closet')} className="icon">
                {showPage === 'closet' ? <VscChromeClose /> : <BiCloset />}
              </IconButton>
              <div className="text">
                {showPage === 'feedback'
                  ? 'Feedback'
                  : showPage === 'info'
                  ? 'Info'
                  : 'Closets'}
              </div>
              <IconButton onClick={handleCopyLink} className="icon">
                <FaCopy />
              </IconButton>
            </div>
            <div id="friends">
              <div className="friends-nav">
                {friendList > 0 && (
                  <IconButton
                    onClick={handlePrevFriendsRow}
                    id="prev"
                    size="small"
                  >
                    <MdNavigateBefore />
                  </IconButton>
                )}
              </div>

              <AnimatePresence custom={direction} initial={false}>
                <motion.div
                  key={friendList}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="friends"
                ></motion.div>
              </AnimatePresence>
            </div>

            {/* Item Closet */}
            <AnimatePresence>
              {showPage === 'closet' && (
                <motion.div
                  id="closets"
                  initial={{ x: -350 }}
                  animate={{ x: 0 }}
                  exit={{ x: -350 }}
                >
                  {newCloset === undefined ? (
                    <div
                      className="closet add"
                      onClick={() => newClosetSet('')}
                    >
                      <div className="name">+</div>
                    </div>
                  ) : (
                    <div className="closet text">
                      <input
                        id="textfield"
                        ref={closetInput}
                        value={newCloset}
                        onChange={(e) => newClosetSet(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleNewCloset();
                          }
                        }}
                        onFocus={handleFocus}
                      ></input>
                    </div>
                  )}

                  {newCloset !== undefined && (
                    <div className="closet submit" onClick={handleNewCloset}>
                      Add
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Friend Feedback */}
            <AnimatePresence>
              {friendDetail && (
                <motion.div
                  id="feedback"
                  key={friendDetail.id}
                  initial={{ y: 125, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 125, opacity: 0 }}
                >
                  <IconButton id="close" onClick={closeFriendDetails}>
                    <CgCloseR />
                  </IconButton>
                  {showFeedback && (
                    <div className="content feedback">
                      <div className="emote">
                        {friendDetail.review === 'meh' && (
                          <AiOutlineMeh id="meh" />
                        )}
                        {friendDetail.review === 'good' && (
                          <BiHappyHeartEyes id="good" />
                        )}
                        {friendDetail.review === 'bad' && <BiSad id="bad" />}
                      </div>
                      <div className="text">{friendDetail.feedback}</div>
                    </div>
                  )}
                  {showWaiting && (
                    <div className="content waiting">
                      <div>
                        <RiMailSendLine />
                      </div>
                      <div>
                        request sent{' '}
                        <Moment fromNow date={friendDetail.time_sent} />
                      </div>
                    </div>
                  )}
                  {showRequestFeedback && (
                    <div className="content request">
                      {feedbackSuccess ? (
                        <div>Successfully Requested!</div>
                      ) : (
                        <Button
                          id="request"
                          onClick={() => handleFeedbackRequest(friendDetail.id)}
                          endIcon={<BiSend />}
                        >
                          Request Feedback from {friendDetail.name}
                        </Button>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <div id="TutorialCurrent">
          <h2>Welcome to Rex!</h2>
          <img src={Image} alt="icon" id="icon" />
          <div id="text">Save products from any website</div>
          <div id="text2">
            Just click the{' '}
            <img
              src="https://extension-static-image-hosting-rexfriends.s3.amazonaws.com/injection-cart-nocheck.png"
              alt="cart"
              id="cart"
            />
            on the right!
          </div>
        </div>
      )}
    </div>
  );
}

export default CurrentItem;
