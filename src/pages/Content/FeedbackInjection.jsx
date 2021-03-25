import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IconButton from '@material-ui/core/IconButton';
import { FaCopy } from 'react-icons/fa';
import Button from '@material-ui/core/Button';
import { AiOutlineUserAdd, AiOutlineSearch } from 'react-icons/ai';
import { FiSend, FiEdit, FiSave } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';

function FeedbackInjeciton({ currentItem, uid, currentCopy }) {
  const [friends, friendsSet] = useState([]);
  const [inputField, inputFieldSet] = useState('');
  const [showSearchFriend, showSearchFriendSet] = useState(false);
  const [showAddFriend, showAddFriendSet] = useState(false);
  const [showCopiedLink, showCopiedLinkSet] = useState(undefined);
  const [feedbackNotif, feedbackNotifSet] = useState(undefined);
  const [editFriendShow, editFriendShowSet] = useState(false);
  const [editValue, editValueSet] = useState('');
  useEffect(() => {
    chrome.storage.local.get('friends', (res) => {
      friendsSet(res.friends);
      // console.log('fetch friends', res.friends);
    });
    return () => {};
  }, []);

  chrome.storage.onChanged.addListener((res) => {
    if (res.friends) {
      // console.log(res.friends.newValue);
      friendsSet(res.friends.newValue);
    }
    if (res.feedbackNotif) {
      // console.log('feedback notif update', res.feedbackNotif);
      if (res.feedbackNotif.newValue.message !== 'null') {
        // console.log('show popup', res.feedbackNotif.newValue.message);
        feedbackNotifSet(res.feedbackNotif.newValue);
        setTimeout(() => feedbackNotifSet(undefined), 2000);
        setTimeout(() => {
          let feedbackNotif = { message: null };
          chrome.storage.local.set({ feedbackNotif });
        }, 2000);
      }
    }
  });

  // const handleSearchFriend = () => {
  //   showSearchFriendSet(true);
  // };
  const handleAddFriendShow = () => {
    showAddFriendSet(true);
  };

  const handleShare = () => {
    let payload = {
      action: 'copy_link',
      uid: uid,
      listing_id: currentItem.id,
    };
    chrome.runtime.sendMessage(payload);
    setTimeout(() => showCopiedLinkSet(true), 500);
    setTimeout(() => showCopiedLinkSet(false), 5000);
  };

  const handleSendRequestClick = (id) => {
    let payload = {
      action: 'send rex',
      contact_id: id,
      uid: uid,
      product_id: currentItem.id,
    };
    chrome.runtime.sendMessage(payload);
  };

  // const handleSearch = () => {
  //   if (inputField !== '') {
  //     let payload = {
  //       action: 'send friend request',
  //       username: inputField,
  //       uid: uid,
  //     };
  //     chrome.runtime.sendMessage(payload);
  //   }
  //   inputFieldSet('');
  //   showSearchFriendSet(false);
  // };

  const handleAdd = () => {
    if (inputField !== '' && inputField !== '0') {
      let payload = {
        action: 'add_friend_number',
        uid: uid,
        phonenumber: inputField,
      };
      chrome.runtime.sendMessage(payload);
    }
    inputFieldSet('');
    showAddFriendSet(false);
  };

  const handleEditFriend = (id) => {
    if (editFriendShow !== false && editValue !== '') {
      handleSaveFriend();
    }
    editFriendShowSet(id);
  };

  const handleSaveFriend = () => {
    if (editValue !== '') {
      let payload = {
        action: 'change nickname',
        new_nickname: editValue,
        contact_id: editFriendShow,
        uid: uid,
      };
      chrome.runtime.sendMessage(payload);
    }
    editValueSet('');
    editFriendShowSet(false);
  };

  const handleCancelEdit = () => {
    editValueSet('');
    editFriendShowSet(false);
  };
  return (
    <>
      <motion.div
        id="sharebox"
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 300, opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
      >
        <div id="rex-top">
          <div id="title">Share</div>
          <IconButton onClick={handleShare} size="small" id="share-button">
            <FaCopy id="svg" />
          </IconButton>
          <AnimatePresence>
            {showCopiedLink && (
              <motion.div
                id="popup"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
              >
                Copied! {currentCopy.substr(8)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div id="rex-content">
          {
            // showSearchFriend ? (
            //   <div id="searchbar">
            //     <input
            //       id="input"
            //       placeholder="Search for a Friend"
            //       autoComplete="off"
            //       maxLength="15"
            //       value={inputField}
            //       onChange={(e) => inputFieldSet(e.target.value)}
            //     />
            //     <IconButton onClick={handleSearch} size="small" id="searchbutton">
            //       <AiOutlineSearch id="svg" />
            //     </IconButton>
            //   </div>
            // ) :
            showAddFriend ? (
              <div id="searchbar">
                <input
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  required
                  id="input"
                  placeholder="Add Phone Number"
                  autoComplete="off"
                  maxLength="15"
                  value={inputField}
                  onChange={(e) => inputFieldSet(e.target.value)}
                />
                <IconButton onClick={handleAdd} size="small" id="searchbutton">
                  <AiOutlineUserAdd id="svg" />
                </IconButton>
              </div>
            ) : (
              showAddFriend === false && (
                // & (showSearchFriend === false)
                <div id="addfriend">
                  {/* <Button
                    onClick={handleSearchFriend}
                    startIcon={<AiOutlineSearch id="svg" />}
                    size="small"
                  >
                    Search
                  </Button> */}
                  <Button
                    onClick={handleAddFriendShow}
                    startIcon={<AiOutlineUserAdd id="svg" />}
                    size="small"
                  >
                    Invite
                  </Button>
                </div>
              )
            )
          }

          <div id="friendList">
            {friends &&
              friends
                .slice(0)
                .reverse()
                .map((friend, i) => (
                  <div key={i} id="friend">
                    <div id="name">
                      {editFriendShow === friend.id ? (
                        <input
                          id="input"
                          value={editValue}
                          onChange={(e) => editValueSet(e.target.value)}
                          type="text"
                          autoComplete="off"
                          maxLength="12"
                          placeholder="Add Nickname"
                        ></input>
                      ) : friend.name ? (
                        friend.name
                      ) : (
                        friend.phonenumber
                      )}
                    </div>
                    <div id="icons">
                      {editFriendShow === friend.id ? (
                        <>
                          <IconButton size="small" onClick={handleSaveFriend}>
                            <FiSave />
                          </IconButton>
                          <IconButton size="small" onClick={handleCancelEdit}>
                            <IoMdClose />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            size="small"
                            onClick={() => handleEditFriend(friend.id)}
                          >
                            <FiEdit />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleSendRequestClick(friend.id)}
                          >
                            <FiSend />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </div>
                ))}
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {feedbackNotif !== undefined && (
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 100 }}
            exit={{ opacity: 0, width: 0 }}
            className={feedbackNotif.variant}
            id="feedback-notif"
          >
            {feedbackNotif.message}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default FeedbackInjeciton;
