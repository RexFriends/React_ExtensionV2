import React, { useState } from 'react';
import { IoIosArrowRoundBack } from 'react-icons/io';
import { motion } from 'framer-motion';
import { primary } from './colors';
const styles = {
  Login: {
    textAlign: 'center',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  Logo: {
    width: 200,
    height: 200,
    objectFit: 'contain',
    margin: '10px auto 0px auto',
  },
  BackButton: {
    backgroundColor: primary,
    display: 'flex',
    fontSize: 28,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  Body: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  Options: {
    width: '100%',
    height: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: '0px 10px',
    display: 'flex',
    flexDirection: 'column',
  },
  Input: {
    width: 250,
    margin: '3px auto',
  },
  Button: {
    borderRadius: '15px',
    color: 'white',
    fontWeight: 600,
    fontSize: 16,
    userSelect: 'none',
    cursor: 'pointer',
    margin: 'auto',
    padding: '3px 10px',
  },
  Bottom: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
};

function LoginComponent({ showLoginSet }) {
  const [showLoginField, showLoginFieldSet] = useState(false);
  const [showPassword, showPasswordSet] = useState(false);

  const handleGoogleLogin = () => {
    let payload = {
      action: 'googleLogin',
    };
    chrome.runtime.sendMessage(payload);
  };

  const handleFacebookLogin = () => {
    let payload = {
      action: 'facebookLogin',
    };
    chrome.runtime.sendMessage(payload);
  };
  const handleLogin = () => {};

  return (
    <div style={styles.Login}>
      <motion.div
        onClick={() => showLoginSet(false)}
        style={styles.BackButton}
        whileHover={{
          scaleX: 1.2,
          transition: { duration: 0.5 },
        }}
        whileTap={{ scaleX: 0.95 }}
      >
        <IoIosArrowRoundBack />
      </motion.div>
      <img
        src="https://uploads-ssl.webflow.com/605a46cf8dcf32867958ea0a/605a47152ceaea19fefb9e6e_Asset%203-p-500.png"
        alt="logo"
        style={styles.Logo}
      />
      <div style={styles.Body}>
        <div style={styles.Options}>
          {!showLoginField ? (
            <>
              <div
                onClick={() => showLoginFieldSet(true)}
                style={{ ...styles.Button, backgroundColor: primary }}
              >
                Login
              </div>
              <div
                style={{ ...styles.Button, backgroundColor: '#314CBE' }}
                onClick={handleFacebookLogin}
              >
                Login with Facebook
              </div>

              <div
                style={{ ...styles.Button, backgroundColor: '#DB5400' }}
                onClick={handleGoogleLogin}
              >
                Login with Google
              </div>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Email"
                style={styles.Input}
              ></input>
              <input
                style={styles.Input}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
              ></input>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div
                  style={{
                    ...styles.Button,
                    backgroundColor: primary,
                  }}
                  onClick={() => showLoginFieldSet(false)}
                >
                  Back
                </div>
                <div
                  style={{ ...styles.Button, backgroundColor: primary }}
                  onClick={handleLogin}
                >
                  Login
                </div>
              </div>
            </>
          )}
        </div>

        <div style={styles.Bottom}>
          Don't have an account?
          <div>Sign up!</div>
        </div>
      </div>
    </div>
  );
}

export default LoginComponent;
