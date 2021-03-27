import React from 'react';
import { motion } from 'framer-motion';
import IconButton from '@material-ui/core/IconButton';
import { AiOutlineClose } from 'react-icons/ai';
import { FiHome } from 'react-icons/fi';
function Notification({ showNotificationSet }) {
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
    </motion.div>
  );
}

export default Notification;
