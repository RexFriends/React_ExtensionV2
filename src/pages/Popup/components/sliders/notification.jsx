import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import IconButton from '@material-ui/core/IconButton';
import { AiOutlineClose } from 'react-icons/ai';
import { FiHome, FiSend } from 'react-icons/fi';
import { FaCopy } from 'react-icons/fa';
import Image from '../../../../assets/img/Asset 1.png';
function Notification({ showNotificationSet }) {
  const [NotifData, notifDataSet] = useState([]);
  useEffect(() => {
    chrome.storage.local.get('notifications', (res) => {
      let payload = {
        action: 'log',
        log: res.notifications,
        msg: 'Got here',
      };
      chrome.runtime.sendMessage(payload);

      //! Compile notifications here & save to state
    });

    return () => {};
  }, []);

  const spring = {
    type: 'spring',
    damping: 20,
    stiffness: 100,
  };

  const openRexPage = () => {
    chrome.tabs.create({
      url: 'https://app.rexfriends.com/',
    });
  };

  return (
    <motion.div
      className="Notification"
      animate={{ width: 275, x: 0 }}
      initial={{ width: 0, x: -275 }}
      exit={{ x: -275 }}
      transition={{ spring }}
    >
      <div id="top">
        <IconButton
          onClick={() => {
            showNotificationSet(false);
          }}
        >
          <AiOutlineClose />
        </IconButton>

        <IconButton onClick={openRexPage}>
          <FiHome />
        </IconButton>
      </div>

      {NotifData.length === 0 ? (
        <div id="no-notif">
          <div id="text">You currently have no notifications</div>
          <img src={Image} alt="icon" id="icon" />
          <div id="text">
            Send rex
            <br />
            <IconButton disabled size="small">
              <FiSend />
            </IconButton>
            /
            <IconButton disabled size="small">
              <FaCopy />
            </IconButton>
            <br />
            or fill out feedbacks!
          </div>
        </div>
      ) : (
        <div id="content">
          <div id="notif"></div>
          <div id="notif"></div>
          <div id="notif"></div>
          <div id="notif"></div>
          <div id="notif"></div>
          <div id="notif"></div>
          <div id="notif"></div>
          <div id="notif"></div>
          <div id="notif"></div>
          <div id="notif"></div>
          <div id="notif"></div>
          <div id="notif"></div>
        </div>
      )}
    </motion.div>
  );
}

export default Notification;
