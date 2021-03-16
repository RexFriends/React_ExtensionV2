import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IconButton from '@material-ui/core/IconButton';
import { FaCopy } from 'react-icons/fa';
import Button from '@material-ui/core/Button';
import { AiOutlineUserAdd, AiOutlineSearch } from 'react-icons/ai';

function FeedbackInjeciton({ currentItem, uid, currentCopy }) {
  const [friends, friendsSet] = useState([]);
  const [inputField, inputFieldSet] = useState('');
  const [showSearchFriend, showSearchFriendSet] = useState(false);
  const [showAddFriend, showAddFriendSet] = useState(false);
  const [showCopiedLink, showCopiedLinkSet] = useState(undefined);
  useEffect(() => {
    chrome.storage.local.get('friends', (res) => {
      friendsSet(res.friends);
    });
    return () => {};
  }, []);

  const handleSearchFriend = () => {
    showSearchFriendSet(true);
  };
  const handleAddFriend = () => {
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

  const handleSearch = () => {
    //  shows error message if user does not exist
    // if successful, show "request sent"
    inputFieldSet('');
    showSearchFriendSet(false);
  };

  const handleAdd = () => {
    let payload = {
      action: 'add_friend_number',
      uid: uid,
      number: inputField,
    };
    chrome.runtime.sendMessage(payload);
    inputFieldSet('');
    showAddFriendSet(false);
  };

  return (
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
        {showSearchFriend ? (
          <div id="searchbar">
            <input
              id="input"
              placeholder="Search for a Friend"
              autoComplete="off"
              maxLength="15"
              value={inputField}
              onChange={(e) => inputFieldSet(e.target.value)}
            />
            <IconButton onClick={handleSearch} size="small" id="searchbutton">
              <AiOutlineSearch id="svg" />
            </IconButton>
          </div>
        ) : showAddFriend ? (
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
          (showAddFriend === false) & (showSearchFriend === false) && (
            <div id="addfriend">
              <Button
                onClick={handleSearchFriend}
                startIcon={<AiOutlineSearch id="svg" />}
                size="small"
              >
                Search
              </Button>
              <Button
                onClick={handleAddFriend}
                startIcon={<AiOutlineUserAdd id="svg" />}
                size="small"
              >
                Invite
              </Button>
            </div>
          )
        )}

        <div id="friendList">
          {friends.map((friend) => (
            <div>{friend.id}</div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default FeedbackInjeciton;
