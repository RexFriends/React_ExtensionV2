import React from 'react';
import { motion } from 'framer-motion';
import { FaBolt } from 'react-icons/fa';
import { primary } from './colors';
const styles = {
  InitialScrape: {
    zIndex: 100000,
    background: '#FFFFFF 0% 0% no-repeat padding-box',
    position: 'fixed',
    top: 158,
    right: 2,
    width: 375,
    height: 225,
    borderRadius: 22,
    color: 'white',
    fontWeight: 700,
    boxShadow: '0px 3px 6px #00000029',
    fontSize: 18,
    textAlign: 'center',
    userSelect: 'none',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
  },
  TopBar: {
    border: 'solid red 2px',
  },
  ItemDetail: {
    border: 'solid red 2px',
    flexGrow: 1,
    display: 'flex',
  },
  ItemImage: {
    border: 'solid red 2px',
    width: 180,
  },
  ItemDescription: {
    border: 'solid red 2px',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
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
    width: 150,
  },
};

export default function InitialScrape({ showInitialScrapeSet }) {
  return (
    <motion.div style={styles.InitialScrape}>
      <div style={styles.TopBar} onClick={() => showInitialScrapeSet(false)}>
        X
      </div>
      <div style={styles.ItemDetail}>
        <div style={styles.ItemImage}>Image goes here</div>
        <div style={styles.ItemDescription}>
          <div>Amazon</div>
          <div>Cloud Sweater</div>
          <div>$54.00</div>
          <div style={{ ...styles.Button, backgroundColor: primary }}>
            Quick save <FaBolt />
          </div>
          <div style={{ ...styles.Button, backgroundColor: primary }}>
            Save to closet
          </div>
        </div>
      </div>
    </motion.div>
  );
}
