import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import { FaSave, FaDoorOpen } from 'react-icons/fa';
import HomeIcon from '@material-ui/icons/Home';
function Footer({ paginate, page }) {
  return (
    <div className="Footer">
      <IconButton
        onClick={() => paginate(0)}
        className={`bottom-button ${page === 0 && 'highlight'}`}
        name="currentItem"
      >
        <FaSave />
      </IconButton>
      {/* <IconButton onClick={()=> paginate(1)} className={`bottom-button  ${page === 1 && "highlight"}`} name="home">
                <HomeIcon onClick={()=>{paginate(1)}} fontSize="large" />
            </IconButton> */}
      <IconButton
        onClick={() => paginate(1)}
        className={`bottom-button  ${page === 1 && 'highlight'}`}
        name="closets"
      >
        <FaDoorOpen />
      </IconButton>
    </div>
  );
}

export default Footer;
