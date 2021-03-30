import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Checkbox from '@material-ui/core/Checkbox';
import { IoMdAdd } from 'react-icons/io';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { BiCloset } from 'react-icons/bi';
import { IoIosAddCircleOutline } from 'react-icons/io';
function ClosetInjection({
  currentItem,
  uid,
  closetList,
  currentItemClosets,
  currentItemClosetsSet,
}) {
  const [showNewClosetField, showNewClosetFieldSet] = useState(false);
  const [newClosetText, newClosetTextSet] = useState('');
  const [closetNotif, closetNotifSet] = useState(undefined);
  chrome.storage.onChanged.addListener((res) => {
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

  return (
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
            <IconButton onClick={handleNewCloset} size="small" id="icon">
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
  );
}

export default ClosetInjection;
