import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import IconButton from '@material-ui/core/IconButton';
import { AiOutlineClose } from 'react-icons/ai';
import { FiHome, FiSend } from 'react-icons/fi';
import { FaCopy } from 'react-icons/fa';
import Image from '../../../../assets/img/Asset 1.png';
import { AiOutlineSmile, AiOutlineFrown } from 'react-icons/ai';
import { Send } from '@material-ui/icons';
import TextOverflow from '../TextOverflow';
import APIURL from '../../../../assets/url';
import NotificationImage from './notificationImage';
function Notification({ showNotificationSet, currentUid }) {
  const [NotifData, notifDataSet] = useState([]);
  useEffect(() => {
    if (!NotifData) {
      chrome.storage.local.get('notifications', (res) => {
        let payload = {
          action: 'log',
          log: res.notifications,
          msg: 'Got here',
        };
        notifDataSet(res.notifications.notifications);
        chrome.runtime.sendMessage(payload);
      });
    } else {
      updateAllUnseenNotifications(NotifData);
    }
    console.log(NotifData);
    return () => {};
  }, [NotifData]);

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

  const redirectToFeedbackForm = (notification) => {
    performUpdateCall([
      { id: notification.id, notified_user: true, type: 'request' },
    ]);
    chrome.tabs.create({
      active: true,
      url: notification.feedback_form_link,
    });
  };

  const performUpdateCall = (toUpdate) => {
    console.log(toUpdate);
    const rexUID = localStorage.getItem('rexUID');
    fetch(`${APIURL}/api/update-notification?uid=${rexUID}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        notification_list: toUpdate,
      }),
    })
      .then(() => {
        getNotifications(false);
      })
      .catch(console.error);
  };

  const updateAllUnseenNotifications = (notifs) => {
    // update unseen notifs which aren't of the "requested feedback" type
    if (notifs) {
      const toUpdate = notifs
        .filter((n) => !n.seen && n.time_responded)
        .map((n) => ({ id: n.id, notified_user: true, type: 'completed' }));
      if (toUpdate.length > 0) {
        performUpdateCall(toUpdate);
      }
    }
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
          {NotifData.map((notif, i) => (
            <div
              id="notif"
              key={i}
              className={!notif.seen ? 'highlight' : 'nohighlight'}
            >
              <div id="first">
                <img src={notif.profile_image} alt="propic" id="profilepic" />
                <div id="name">
                  <div id="topname">
                    {notif.first_name} {notif.last_name}
                  </div>
                  <div id="username">@{notif.username}</div>
                </div>
                <div id="type" className={notif.notif_type}>
                  {notif.notif_type}
                </div>
              </div>
              <div id="second">
                <NotificationImage notification={notif} />
                {notif.product_info && notif.product_info.images && (
                  <div id="webscrape">
                    <div id="brand">{notif.product_info.brand}</div>
                    <div id="name">
                      <TextOverflow
                        text={
                          notif.product_info.name
                            ? notif.product_info.name.split(',')[0]
                            : ''
                        }
                        overflowLength={36}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div id="third">
                {notif.feedback && <div id="feedback">{notif.feedback}</div>}
                {notif.notif_type === 'Request' ? (
                  <IconButton
                    disabled={notif.seen}
                    onClick={() => redirectToFeedbackForm(notif)}
                    id="icon"
                    className="link"
                  >
                    <Send style={{ color: '#37DB69' }} />
                  </IconButton>
                ) : notif.thumbsUp === null ? (
                  <AiOutlineSmile style={{ color: '#37DB69' }} id="icon" />
                ) : (
                  <AiOutlineFrown style={{ color: '#FD6C73' }} id="icon" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Notification;
