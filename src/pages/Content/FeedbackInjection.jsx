import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IconButton from '@material-ui/core/IconButton';
import { FaCopy } from 'react-icons/fa';
import Button from '@material-ui/core/Button';
import { AiOutlineUserAdd, AiOutlineSearch } from 'react-icons/ai';
import { FiSend, FiEdit, FiSave } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { GrLinkNext } from 'react-icons/gr';

function FeedbackInjeciton({ currentItem, uid, currentCopy }) {
  const [friends, friendsSet] = useState([]);
  const [inputField, inputFieldSet] = useState('');
  const [showSearchFriend, showSearchFriendSet] = useState(false);
  const [showAddFriend, showAddFriendSet] = useState(false);
  const [showAddFriendName, showAddFriendNameSet] = useState(false);
  const [showCopiedLink, showCopiedLinkSet] = useState(undefined);
  const [feedbackNotif, feedbackNotifSet] = useState(undefined);
  const [editFriendShow, editFriendShowSet] = useState(false);
  const [editValue, editValueSet] = useState('');
  const [tempNumberToMatch, tempNumberToMatchSet] = useState(undefined);
  const [searchBar, searchBarSet] = useState('');
  const [searchResults, searchResultsSet] = useState(undefined);

  useEffect(() => {
    chrome.storage.local.get('friends', (res) => {
      friendsSet(res.friends);
      // console.log('fetch friends', res.friends);
    });

    return () => {};
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchBar.length >= 3) {
        console.log(
          `I can see you're not typing. I can use "${searchBar}" now!`
        );
        let payload = {
          action: 'friend search',
          text: searchBar,
          uid: uid,
        };
        chrome.runtime.sendMessage(payload);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [searchBar]);

  chrome.storage.onChanged.addListener((res) => {
    if (res.friends) {
      // console.log(res.friends.newValue);
      friendsSet(res.friends.newValue);
    }
    if (res.feedbackNotif) {
      if (res.feedbackNotif.newValue.message !== 'null') {
        if (res.feedbackNotif.newValue.message === 'Valid Number') {
          tempNumberToMatchSet(inputField);
          inputFieldSet('');
          showAddFriendNameSet(true);
        }
        feedbackNotifSet(res.feedbackNotif.newValue);
        // setTimeout(() => feedbackNotifSet(undefined), 2000);
        // setTimeout(() => {
        //   let feedbackNotif = { message: null };
        //   chrome.storage.local.set({ feedbackNotif });
        // }, 2000);
      }
    }
    // ! Handles showing the search results
    if (res.userSearch) {
      if (res.userSearch.hasOwnProperty('newValue')) {
        searchResultsSet(res.userSearch.newValue);
      } else {
        searchResultsSet(undefined);
      }
    }
  });

  // const handleSearchFriend = () => {
  //   showSearchFriendSet(true);
  // };
  const handleAddFriendShow = () => {
    showAddFriendSet(true);
    searchBarSet('');
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

  const handleSendRequestClick = (friend) => {
    console.log(friend);
    if (friend.isUser === false) {
      let payload = {
        action: 'send rex',
        user_requesting_id: null,
        uid: uid,
        product_id: currentItem.id,
      };
      chrome.runtime.sendMessage(payload);
    } else {
      let payload = {
        action: 'send rex',
        user_requesting_id: friend.id,
        uid: uid,
        product_id: currentItem.id,
      };
      chrome.runtime.sendMessage(payload);
    }
  };

  const handleAdd = () => {
    if (inputField !== '' && inputField !== '0') {
      let payload = {
        action: 'add_friend_number',
        uid: uid,
        phonenumber: inputField,
      };
      chrome.runtime.sendMessage(payload);
    }
  };

  const handleAddName = () => {
    chrome.storage.local.get({ friends }, (res) => {
      let friend = res.friends.find(
        (friend) => friend.phonenumber === tempNumberToMatch
      );
      if (inputField !== '') {
        let payload = {
          action: 'change nickname',
          new_nickname: inputField,
          contact_id: friend.id,
          uid: uid,
        };
        chrome.runtime.sendMessage(payload);
      }
    });

    inputFieldSet('');
    showAddFriendNameSet(false);
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
          {showAddFriend ? (
            <div id="searchbar">
              <AnimatePresence>
                {!showAddFriendName ? (
                  <motion.div
                    key="1"
                    id="motion"
                    initial={{ x: 300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                  >
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
                    <IconButton
                      onClick={handleAdd}
                      size="small"
                      id="searchbutton"
                    >
                      <GrLinkNext id="svg" />
                    </IconButton>
                  </motion.div>
                ) : (
                  <motion.div
                    key="2"
                    id="motion"
                    initial={{ x: 300 }}
                    animate={{ x: 0 }}
                    exit={{ x: -300 }}
                    transition={{ delay: 1 }}
                  >
                    <input
                      type="text"
                      required
                      id="input"
                      placeholder="Add A Name"
                      autoComplete="off"
                      maxLength="15"
                      value={inputField}
                      onChange={(e) => inputFieldSet(e.target.value)}
                    />
                    <IconButton
                      onClick={handleAddName}
                      size="small"
                      id="searchbutton"
                    >
                      <GrLinkNext id="svg" />
                    </IconButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            showAddFriend === false && (
              <div id="addfriend">
                <input
                  type="text"
                  placeholder="Search Friends"
                  value={searchBar}
                  onChange={(e) => searchBarSet(e.target.value)}
                />
                <Button
                  onClick={handleAddFriendShow}
                  startIcon={<AiOutlineUserAdd id="svg" />}
                  size="small"
                >
                  Invite
                </Button>
              </div>
            )
          )}

          <div id="friendList">
            {friends &&
              friends
                .slice(0)
                .reverse()
                .filter((friend) => {
                  if (friend.name !== null) {
                    return friend.name
                      .toLowerCase()
                      .includes(searchBar.toLowerCase());
                  } else {
                    return false;
                  }
                })
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
                            onClick={() => handleSendRequestClick(friend)}
                          >
                            <FiSend />
                          </IconButton>
                        </>
                      )}
                    </div>
                  </div>
                ))}
            {searchResults && <div>search results</div>}
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
