import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { IoMdAdd } from 'react-icons/io';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow:
      'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage:
      'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
});

function ClosetInjection({
  currentItem,
  uid,
  closetList,
  currentItemClosets,
  currentItemClosetsSet,
}) {
  const classes = useStyles();
  const [showNewClosetField, showNewClosetFieldSet] = useState(false);
  const [newClosetText, newClosetTextSet] = useState('');

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
    <motion.div
      id="itemcloset-list"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 200, opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
    >
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
        >
          New Closet
        </Button>
      )}

      {closetList &&
        closetList.map((closet, i) => (
          <div id="closet-item" key={i}>
            <Checkbox
              className={classes.root}
              color="default"
              checked={currentItemClosets.includes(closet.id)}
              disabled={closet.name === 'Saved Products'}
              checkedIcon={
                <span className={clsx(classes.icon, classes.checkedIcon)} />
              }
              icon={<span className={classes.icon} />}
              inputProps={{
                'aria-label': 'decorative checkbox',
              }}
              onClick={() => handleCheck(closet.id)}
            />
            <div id="closet-name">{closet.name}</div>
          </div>
        ))}
    </motion.div>
  );
}

export default ClosetInjection;
