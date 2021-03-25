import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { FaDoorOpen } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';
import { MdFiberNew } from 'react-icons/md';
function Footer({ paginate, page }) {
  return (
    <div className="Footer">
      <IconButton
        onClick={() => paginate(0)}
        className={`bottom-button  ${page === 0 && 'highlight'}`}
        name="home"
      >
        <MdFiberNew />
      </IconButton>
      <IconButton
        onClick={() => paginate(1)}
        className={`bottom-button  ${page === 1 && 'highlight'}`}
        name="closets"
      >
        <FaDoorOpen />
      </IconButton>
      <IconButton
        onClick={() => {
          chrome.tabs.create({
            active: true,
            url: 'https://app.rexfriends.com',
          });
        }}
        className={`bottom-button ${page === 2 && 'highlight'}`}
        name="currentItem"
      >
        <FiHome />
      </IconButton>
    </div>
  );
}

export default Footer;
