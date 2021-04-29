import React, { useEffect, useState } from 'react';
import { primary } from './colors';
import { wrap } from 'popmotion';
import APIURL from '../../../assets/url';
import { AiOutlineMenu } from 'react-icons/ai';
import { AnimatePresence, motion } from 'framer-motion';
import InitialScrape from './InitialScrape';

const styles = {
  Icon: {
    zIndex: 99999,
    backgroundColor: primary,
    position: 'fixed',
    top: 100,
    right: 0,
    fontSize: 26,
    lineHeight: 1,
    color: 'white',
    fontWeight: 600,
    width: 58,
    height: 56,
    textOverflow: wrap,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    textAlign: 'center',
    userSelect: 'none',
    cursor: 'pointer',
    padding: 4,
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 0,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 0,
  },
  HoverBar: {
    zIndex: 99999,
    backgroundColor: '#207C9D',
    position: 'fixed',
    top: 100,
    right: -25,
    width: 25,
    height: 56,
    userSelect: 'none',
    cursor: 'pointer',
    padding: '16px 0',
    fontSize: 20,
    color: 'white',
  },
  NotificationBadge: {
    zIndex: 100000,
    backgroundColor: primary,
    position: 'fixed',
    top: 89,
    right: 42,
    width: 27,
    height: 27,
    borderRadius: 100,
    color: 'white',
    fontWeight: 700,
    backgroundColor: '#FF1919',
    fontSize: 18,
    textAlign: 'center',
    userSelect: 'none',
    cursor: 'pointer',
  },
};

export default function ContentUser() {
  const [initialData, initialDataSet] = useState(undefined);
  const [hovered, setHovered] = useState(false);
  const [initialScrape, initialScrapeSet] = useState(undefined);
  const [showInitialScrape, showInitialScrapeSet] = useState(true);
  const [showApplicationBody, showApplicationBodySet] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(['uId'], (res) => {
      console.log(
        'getting uid',
        res,
        APIURL + '/api/closet_preview?uid=' + res.uId
      );
      chrome.runtime.sendMessage(
        {
          contentScriptQuery: 'getdata',
          url: APIURL + '/api/extension_dashboard?uid=' + res.uId,
        },
        function (response) {
          if (response != undefined && response != '') {
            console.log('Response from extension_dashboard', response);
            initialDataSet(response);
            callback(response);
          } else {
            callback(null);
          }
        }
      );
    });
    let currentURL = window.location.toString();
    console.log(
      'getting scrape',
      APIURL + '/api/scrape-product?url=' + currentURL
    );
    chrome.runtime.sendMessage(
      {
        contentScriptQuery: 'getdata',
        url: APIURL + '/api/scrape-product?url=' + currentURL,
      },
      function (response) {
        if (response != undefined && response != '') {
          console.log('Response from scrape-product', response);
          initialScrapeSet(response);
          callback(response);
        } else {
          callback(null);
        }
      }
    );

    return () => {};
  }, []);

  const handleHoverBarClick = () => {
    console.log('handleHoverBarClick');
  };
  const handleNotificationBubble = () => {
    console.log('handleNotificationBubble');
  };

  const handleCartClick = () => {
    console.log('handleCartClick');
  };
  return (
    <>
      {initialData?.notifications?.amount > 0 && (
        <motion.div
          style={styles.NotificationBadge}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNotificationBubble}
        >
          {initialData.notifications.amount}
        </motion.div>
      )}

      <motion.div
        style={styles.Icon}
        initial={{ x: 0, backgroundColor: primary }}
        animate={{
          x: hovered ? -20 : 0,
          backgroundColor: hovered ? ['#60F', primary] : primary,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleCartClick}
      >
        <img
          style={styles.Logo}
          alt=""
          src="https://extension-static-image-hosting-rexfriends.s3.amazonaws.com/injection-04.png"
        ></img>
      </motion.div>
      <motion.div
        style={styles.HoverBar}
        animate={{ x: hovered ? -20 : 0 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={handleHoverBarClick}
      >
        <AiOutlineMenu styles={{ display: 'block', margin: 'auto' }} />
      </motion.div>
      <AnimatePresence>
        {showInitialScrape && (
          <InitialScrape showInitialScrapeSet={showInitialScrapeSet} />
        )}
      </AnimatePresence>
    </>
  );
}
