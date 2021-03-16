import React, { useState, useEffect } from 'react';

import IconButton from '@material-ui/core/IconButton';
import { BiCloset } from 'react-icons/bi';
import { AiOutlineShareAlt, AiOutlineClose } from 'react-icons/ai';

import './Content.scss';

import { AnimatePresence, motion } from 'framer-motion';

import { BiHide } from 'react-icons/bi';
// this might be affecting the css of websites
import ClosetInjection from './ClosetInjection';
import FeedbackInjection from './FeedbackInjection';

const Content = () => {
  const [showInjection, showInjectionSet] = useState(true);
  const [uid, uidSet] = useState(undefined);
  const [itemSaved, itemSavedSet] = useState(false);
  const [closetList, closetListSet] = useState(undefined);
  const [currentItem, currentItemSet] = useState(undefined);
  const [currentItemClosets, currentItemClosetsSet] = useState([]);
  const [showCloset, showClosetSet] = useState(false);
  const [showShare, showShareSet] = useState(false);
  const [currentCopy, currentCopySet] = useState(undefined);
  const [closetSaveError, closetSaveErrorSet] = useState(undefined);
  const [currentURI, currentURISet] = useState(undefined);

  chrome.storage.onChanged.addListener((response) => {
    if (response.closet) {
      closetListSet(response.closet.newValue);
      if (response.closet.newValue && response.closet.oldValue) {
        if (response.closet.newValue.length > response.closet.oldValue.length) {
          let newClosetId =
            response.closet.newValue[response.closet.newValue.length - 1].id;
          currentItemClosetsSet([...currentItemClosets, newClosetId]);
        }
      }
    }
    if (response.closet_save_error) {
      if (response.closet_save_error.newValue) {
        closetSaveErrorSet(response.closet_save_error.newValue);
        chrome.storage.local.set({ closet_save_error: undefined });
      }
    }
    if (response.uri) {
      itemSavedSet(false);
      currentURISet(response.uri.newValue);
    }
    if (response.current_copy) {
      console.log('in chrome', response.current_copy.newValue.copy_link);
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

  useEffect(() => {
    chrome.storage.local.get(['uId', 'closet'], (res) => {
      uidSet(res.uId);
      closetListSet(res.closet);
    });
    return () => {};
  }, []);

  const handleSaveItem = () => {
    let payload = {
      action: 'save-item',
      uri: currentURI,
    };

    itemSavedSet('loading');
    setTimeout(() => chrome.runtime.sendMessage(payload), 500);
    setTimeout(() => itemSavedSet('saved'), 1000);
  };

  const handleManageCloset = () => {
    if (showShare) {
      showShareSet(false);
      setTimeout(() => showClosetSet(!showCloset), 1000);
    } else {
      showCloset
        ? showClosetSet(false)
        : chrome.storage.local.get('current_item', (res) => {
            currentItemSet(res.current_item);
            currentItemClosetsSet(res.current_item.closets);
            showClosetSet(true);
          });
    }
  };

  const handleManageShare = () => {
    if (showCloset) {
      showClosetSet(false);
      setTimeout(() => showShareSet(!showShare), 1000);
    } else {
      chrome.storage.local.get('current_item', (res) => {
        currentItemSet(res.current_item);
        showShareSet(!showShare);
      });
    }
  };

  return (
    <>
      <AnimatePresence>
        {uid === 'empty' ? (
          <motion.div
            id="request-signin"
            transition={{ type: 'tween' }}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
          >
            Login through the extension to start using rex!
          </motion.div>
        ) : (
          <>
            <AnimatePresence>
              {showInjection && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div id="landing-button">
                    <AnimatePresence>
                      {/* Item is not saved */}
                      {itemSaved === false && (
                        <motion.div
                          id="item-not-saved"
                          initial={{ x: 100 }}
                          animate={{ x: 0 }}
                          transition={{ type: 'tween' }}
                          exit={{ x: 100 }}
                        >
                          <IconButton id="save-button" onClick={handleSaveItem}>
                            Save Item
                          </IconButton>
                          <img
                            id="cart-icon"
                            src="https://extension-static-image-hosting-rexfriends.s3.amazonaws.com/injection-cart-nocheck.png"
                            alt="itemsavedicon"
                          />
                        </motion.div>
                      )}

                      {/* window *screen capture* animation */}
                      {itemSaved === 'loading' && (
                        <div id="rex-screenshot-animation"></div>
                      )}

                      {/* Item is saved */}
                      {itemSaved === 'saved' && (
                        <motion.div
                          id="item-saved"
                          initial={{ x: 100 }}
                          animate={{ x: 0 }}
                          transition={{ type: 'tween' }}
                          exit={{ x: 100 }}
                        >
                          <AnimatePresence>
                            {showCloset && (
                              <ClosetInjection
                                currentItem={currentItem}
                                uid={uid}
                                closetList={closetList}
                                currentItemClosets={currentItemClosets}
                                currentItemClosetsSet={currentItemClosetsSet}
                              />
                            )}
                          </AnimatePresence>
                          <AnimatePresence>
                            {showShare && (
                              <FeedbackInjection
                                currentCopy={currentCopy}
                                currentItem={currentItem}
                                uid={uid}
                              />
                            )}
                          </AnimatePresence>

                          <div id="saved-item-options">
                            <IconButton
                              id="closet-button"
                              onClick={handleManageCloset}
                              size="small"
                            >
                              {showCloset ? <AiOutlineClose /> : <BiCloset />}
                            </IconButton>
                            <IconButton
                              id="closet-button"
                              onClick={handleManageShare}
                              size="small"
                            >
                              {showShare ? (
                                <AiOutlineClose />
                              ) : (
                                <AiOutlineShareAlt />
                              )}
                            </IconButton>
                          </div>
                          <img
                            id="cart-icon"
                            src="https://extension-static-image-hosting-rexfriends.s3.amazonaws.com/injection-cart-check.png"
                            alt="itemsavedicon"
                          />
                        </motion.div>
                      )}

                      {/* Item has been saved error */}
                      {closetSaveError && (
                        <motion.div
                          id="error"
                          onClick={() => {
                            closetSaveErrorSet(false);
                          }}
                          initial={{ x: 100 }}
                          animate={{ x: 0 }}
                          transition={{ type: 'tween' }}
                          exit={{ x: 100 }}
                          key="4"
                        >
                          {closetSaveError}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {itemSaved === false && (
                    <IconButton
                      id="hide1"
                      size="small"
                      onClick={() => {
                        showInjectionSet(false);
                      }}
                    >
                      <BiHide />
                    </IconButton>
                  )}
                  <AnimatePresence>
                    {(showShare === false) &
                      (showCloset === false) &
                      (itemSaved === 'saved') && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <IconButton
                          id="hide2"
                          size="small"
                          onClick={() => {
                            showInjectionSet(false);
                          }}
                        >
                          <BiHide />
                        </IconButton>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Content;
