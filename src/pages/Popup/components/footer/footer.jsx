import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { FaDoorOpen } from 'react-icons/fa';
import { FiHome } from 'react-icons/fi';
function Footer({ paginate, page }) {
  return (
    <div className="Footer">
      {/* <IconButton onClick={()=> paginate(1)} className={`bottom-button  ${page === 1 && "highlight"}`} name="home">
                <HomeIcon onClick={()=>{paginate(1)}} fontSize="large" />
            </IconButton> */}
      <IconButton
        onClick={() => paginate(0)}
        className={`bottom-button  ${page === 0 && 'highlight'}`}
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
        className={`bottom-button ${page === 1 && 'highlight'}`}
        name="currentItem"
      >
        <FiHome />
      </IconButton>
    </div>
  );
}

export default Footer;
