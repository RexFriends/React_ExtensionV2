import React, { useState, useRef, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Moment from 'react-moment';
import { FaCopy } from 'react-icons/fa';
import { BiCloset } from 'react-icons/bi';
import { VscChromeClose } from 'react-icons/vsc';
import { motion, AnimatePresence } from 'framer-motion';
import Carousel, { Dots } from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';
import Image from '../../../../assets/img/Asset 1.png';
import { FiSend, FiEdit, FiSave } from 'react-icons/fi';
import { IoMdClose } from 'react-icons/io';
import { AiOutlineUserAdd, AiOutlineSearch } from 'react-icons/ai';
import { GrLinkNext } from 'react-icons/gr';
import { FiSearch } from 'react-icons/fi';
import { FaUserFriends } from 'react-icons/fa';
import { IoIosAddCircleOutline } from 'react-icons/io';

function CurrentItem({ uid, currentItem, closets, friends }) {
  const [showPage, showPageSet] = useState('feedback');
  const [newCloset, newClosetSet] = useState(undefined);
  const [images, imagesSet] = useState([]);
  const [imageIndex, imageIndexSet] = useState(0);
  const [currentItemExist, currentItemExistSet] = useState(true);
  const [showAlert, showAlertSet] = useState(undefined);
  const [searchResults, searchResultsSet] = useState(undefined);
  const [searchBar, searchBarSet] = useState('');
  const [editFriendShow, editFriendShowSet] = useState(false);
  const closetInput = useRef(null);
  const [editValue, editValueSet] = useState('');
  const [showAddFriend, showAddFriendSet] = useState(false);
  const [showAddFriendName, showAddFriendNameSet] = useState(false);
  const [inputField, inputFieldSet] = useState('');
  const [tempNumberToMatch, tempNumberToMatchSet] = useState(undefined);
  const [feedbackNotif, feedbackNotifSet] = useState(undefined);
  const [showNewClosetField, showNewClosetFieldSet] = useState(false);
  const [newClosetText, newClosetTextSet] = useState('');
  const [closetNotif, closetNotifSet] = useState(undefined);

  useEffect(() => {
    //*  only runs if user is new
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
                  images.push(
                    <img src={'data:image/jpeg;base64,' + base64} id="img" />
                  );
                } else {
                  images.push(<img src={json[key]} id="img" />);
                }
              }
              //! currently only shows the first image due to webscraper being BAD :(
              imagesSet([images[0]]);
            });
        } else {
          //* display screenshot if webscraper is unsuccessful
          fetch(currentItem.screenshot)
            .then((res) => res.json())
            .then((json) => {
              images.push(<img src={json.uri} id="img" />);
              imagesSet(images);
            });
        }
      });
    }

    return () => {};
  }, [currentItem]);

  useEffect(() => {
    if (searchBar.length === 0) {
      searchResultsSet(undefined);
    }
    const timeoutId = setTimeout(() => {
      if (searchBar.length >= 1) {
        let payload = {
          action: 'friend search',
          text: searchBar,
          uid: uid,
        };
        chrome.runtime.sendMessage(payload);
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchBar]);
  chrome.storage.onChanged.addListener((response) => {
    if (response.current_copy && response.current_copy.newValue !== null) {
      let link = response.current_copy.newValue.copy_link;
      var inp = document.createElement('input');
      document.body.appendChild(inp);
      inp.value = link;
      inp.select();
      document.execCommand('copy', false);
      inp.remove();
      showAlertSet(`Copied! ${link.substr(8)}`);
      setTimeout(() => showAlertSet(undefined), 2000);
      setTimeout(() => chrome.storage.local.set({ current_copy: null }), 2500);
    }
  });

  chrome.storage.onChanged.addListener((res) => {
    if (res.userSearch) {
      if (res.userSearch.hasOwnProperty('newValue')) {
        searchResultsSet(res.userSearch.newValue);
      } else {
        searchResultsSet(undefined);
      }
    }
    if (res.feedbackNotif) {
      if (res.feedbackNotif.newValue.message !== 'null') {
        if (res.feedbackNotif.newValue.message === 'Valid Number') {
          tempNumberToMatchSet(inputField);
          inputFieldSet('');
          showAddFriendNameSet(true);
        }
        feedbackNotifSet(res.feedbackNotif.newValue);
        setTimeout(() => feedbackNotifSet(undefined), 2000);
        setTimeout(() => {
          let feedbackNotif = { message: null };
          chrome.storage.local.set({ feedbackNotif });
        }, 1000);
      }
    }
    if (res.closetNotif) {
      if (res.closetNotif.newValue.message !== 'null') {
        closetNotifSet(res.closetNotif.newValue);
        setTimeout(() => closetNotifSet(undefined), 1000);
        setTimeout(() => {
          let closetNotif = { message: null };
          chrome.storage.local.set({ closetNotif });
        }, 1000);
      }
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

  // closes new closet text box
  const clearNewCloset = () => {
    newClosetSet(undefined);
  };

  const handleFocus = (event) => {
    event.target.setAttribute('autocomplete', 'off');
  };

  const handleCopyLink = () => {
    let payload = {
      action: 'copy_link',
      uid: uid,
      listing_id: currentItem.id,
    };
    chrome.runtime.sendMessage(payload);
  };

  const handleAddFriendShow = () => {
    showAddFriendSet(true);
    searchBarSet('');
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

  const handleCancel = () => {
    inputFieldSet('');
    showAddFriendSet(false);
  };

  const handleCarousel = (e) => {
    imageIndexSet(e);
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
      let friend = friends.find(
        (friend) => friend.phone_number === tempNumberToMatch
      );
      if (inputField !== '') {
        let payload = {
          action: 'change nickname',
          new_nickname: inputField,
          contact_id: friend.id,
          uid: uid,
        };
        chrome.runtime.sendMessage(payload);
        inputFieldSet('');
        showAddFriendNameSet(false);
        showAddFriendSet(false);
      }
    });
  };

  const handleSendRequestClick = (friend) => {
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

  const handleNewCloset = () => {
    if (newClosetText !== '') {
      let payload = {
        action: 'add to-new-closet',
        closet_name: newClosetText, // closet id
        item_id: currentItem.id, // item id
        uid: uid,
        closets: closetList,
      };
      chrome.runtime.sendMessage(payload);
    }
    newClosetTextSet('');
    showNewClosetFieldSet(false);
  };
  const handleCheck = (closet_id) => {
    let tempCurrent = currentItemClosets;
    let payload = {
      closet_id: closet_id,
      item_id: currentItem.id,
      uid: uid,
    };
    if (currentItemClosets.includes(closet_id)) {
      tempCurrent = tempCurrent.filter((id) => id !== closet_id);
      payload.action = 'remove closet-item';
    } else {
      payload.action = 'add closet-item';
      tempCurrent = [closet_id, ...tempCurrent];
    }
    chrome.runtime.sendMessage(payload);
    currentItemClosetsSet(tempCurrent);
  };

  const handleSearchBar = (e) => {
    searchBarSet(e.target.value);
  };

  console.log(friends);

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
              {/* <IconButton
                onClick={() =>
                  showPageSet(showPage === 'closet' ? 'feedback' : 'closet')
                }
                className="icon"
              >
                {showPage === 'closet' ? <VscChromeClose /> : <BiCloset />}
              </IconButton> */}
              <div className="text">
                {showPage === 'feedback' ? 'Share' : 'Closets'}
              </div>
              <AnimatePresence>
                {showAlert && (
                  <motion.div
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 300, opacity: 0 }}
                    id="alert"
                  >
                    {showAlert}
                  </motion.div>
                )}
              </AnimatePresence>
              <IconButton onClick={handleCopyLink} className="icon">
                <FaCopy />
              </IconButton>
            </div>
            {/* Share */}
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
                      <IconButton onClick={handleCancel} size="small">
                        <IoMdClose />
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
                        label="required"
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
                <div id="searchbar">
                  <div id="motion" key="3">
                    <input
                      type="text"
                      id="input"
                      autoComplete="off"
                      placeholder="Search Friends"
                      value={searchBar}
                      onChange={handleSearchBar}
                    />
                    <Button
                      onClick={handleAddFriendShow}
                      startIcon={<AiOutlineUserAdd id="svg" />}
                      size="small"
                    >
                      Invite
                    </Button>
                  </div>
                </div>
              )
            )}
            <div id="friendList">
              {!searchResults && friends && (
                <>
                  <div id="query">
                    Friends
                    <div id="icons">
                      <FaUserFriends />
                    </div>
                  </div>
                  {friends
                    .slice(0)
                    .reverse()
                    .map((friend, i) => (
                      <div key={i} id="friend">
                        {friend.profile_image !== null ? (
                          <img
                            id="proimg"
                            src={friend.profile_image}
                            alt="user-propic"
                          ></img>
                        ) : (
                          <img
                            id="proimg"
                            src="https://ui-avatars.com/api/?background=bdbcbb&color=fff&rounded=true&name=Null&size=64&length=1"
                            alt="user-propic"
                          ></img>
                        )}
                        <div id="name">
                          {friend.username
                            ? friend.username
                            : friend.name
                            ? friend.name
                            : friend.phone_number}
                        </div>
                        <div id="icons">
                          {editFriendShow === friend.id ? (
                            <>
                              <IconButton
                                size="small"
                                onClick={handleSaveFriend}
                              >
                                <FiSave />
                              </IconButton>
                              <IconButton
                                size="small"
                                onClick={handleCancelEdit}
                              >
                                <IoMdClose />
                              </IconButton>
                            </>
                          ) : (
                            <>
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
                </>
              )}
              {searchResults && (
                <>
                  <div id="query">
                    search results
                    <div id="icons">
                      <FiSearch />
                    </div>
                  </div>
                  {searchResults.length > 0 ? (
                    searchResults.map((user, i) => (
                      <div key={i} id="friend">
                        <img
                          id="proimg"
                          src={user.profile_image}
                          alt="user-propic"
                        ></img>
                        <div id="name">
                          {user.username ? user.username : user.name}
                        </div>
                        <div id="icons">
                          <IconButton
                            size="small"
                            onClick={() => handleSendRequestClick(user)}
                          >
                            <FiSend />
                          </IconButton>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div id="no-users">No Users Found</div>
                  )}
                </>
              )}
            </div>
            {/* Closet */}
            <AnimatePresence>
              {showPage === 'closet' && (
                <motion.div
                  id="closets"
                  initial={{ x: -350 }}
                  animate={{ x: 0 }}
                  exit={{ x: -350 }}
                >
                  <>
                    <motion.div
                      id="itemcloset-list"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 450, opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <div id="closet-top">
                        <div id="title">Closets</div>
                        <IconButton size="small" id="closet-button" disabled>
                          <BiCloset id="svg" />
                        </IconButton>
                      </div>
                      {showNewClosetField ? (
                        <div id="new-closet-field">
                          <input
                            id="textfield"
                            placeholder="Closet Name"
                            autoComplete="off"
                            maxLength="12"
                            value={newClosetText}
                            onChange={(e) => newClosetTextSet(e.target.value)}
                          />
                          <IconButton
                            onClick={handleNewCloset}
                            size="small"
                            id="icon"
                          >
                            <IoMdAdd />
                          </IconButton>
                        </div>
                      ) : (
                        <Button
                          id="new-closet"
                          onClick={() => showNewClosetFieldSet(true)}
                          id="new-closet-button"
                          startIcon={<IoIosAddCircleOutline />}
                        >
                          New Closet
                        </Button>
                      )}
                      <div id="closets">
                        {closetList &&
                          closetList.map((closet, i) => (
                            <div id="closet-item" key={i}>
                              <Checkbox
                                color="default"
                                checked={currentItemClosets.includes(closet.id)}
                                disabled={closet.name === 'Saved Products'}
                                onClick={() => handleCheck(closet.id)}
                              />
                              <div id="closet-name">{closet.name}</div>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                    <AnimatePresence>
                      {closetNotif !== undefined && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className={closetNotif.variant}
                          id="closet-notif"
                        >
                          {closetNotif.message}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
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
            Just click the
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
