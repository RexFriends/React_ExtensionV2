import React, { useState } from 'react';
import './defaultCSS.scss';
import { primary } from './colors';
import { wrap } from 'popmotion';
import { AnimatePresence, motion } from 'framer-motion';
import LoginComponent from './LoginComponent';

const styles = {
  LoginRequest: {
    zIndex: 99999,
    backgroundColor: primary,
    position: 'fixed',
    top: 100,
    right: 0,
    fontSize: 26,
    lineHeight: 1,
    color: 'white',
    fontWeight: 600,
    width: 123,
    textOverflow: wrap,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    textAlign: 'center',
    border: 10,
    userSelect: 'none',
    cursor: 'pointer',
    padding: 10,
  },
  LoginBody: {
    position: 'fixed',
    bottom: 25,
    right: 0,
    width: 300,
    height: 500,
    backgroundColor: '#F7F8F8',
    zIndex: 99999,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
  },
};

export default function ContentMain() {
  const [showLogin, showLoginSet] = useState(false);

  return (
    <>
      <AnimatePresence>
        {!showLogin && (
          <motion.div
            onClick={() => showLoginSet((oldValue) => !oldValue)}
            style={styles.LoginRequest}
            initial={{ x: 130 }}
            animate={{ x: 0 }}
            exit={{ x: 130 }}
            transition={{ type: 'tween', stiffness: 10 }}
            whileTap={{ scaleY: 0.95 }}
          >
            LOGIN to use Rex
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showLogin && (
          <motion.div
            style={styles.LoginBody}
            initial={{ width: 0 }}
            animate={{ width: 300 }}
            exit={{ width: 0, x: 300 }}
          >
            <LoginComponent showLoginSet={showLoginSet} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
