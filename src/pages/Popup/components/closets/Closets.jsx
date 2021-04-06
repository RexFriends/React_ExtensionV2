import React, { useState, useEffect } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import IconButton from '@material-ui/core/IconButton';

function Closets() {
  const [closetPreviewData, closetPreviewDataSet] = useState(undefined);

  useEffect(() => {
    chrome.storage.local.get(['closet_preview'], (res) => {
      closetPreviewDataSet(res.closet_preview);
    });
    return () => {};
  }, []);

  const handleOpenCloset = (id) => {
    chrome.tabs.create({
      active: true,
      url: 'https://app.rexfriends.com/closets/' + id,
    });
  };

  return (
    <div className="newClosets">
      <div id="header">Closets</div>
      <div id="body">
        {closetPreviewData &&
          closetPreviewData
            .filter((closet) => closet.closet_name !== 'Saved Products')
            .map((closet, i) => (
              <div
                id="closet-box"
                key={i}
                style={
                  closet.closet_icon
                    ? {
                        backgroundImage: `url(${closet.closet_icon})`,
                        backgroundSize: 'contain',
                        textShadow: '2px 2px 5px black',
                      }
                    : { backgroundColor: '#' + closet.color }
                }
              >
                <div id="name">{closet.closet_name}</div>

                <IconButton
                  id="button"
                  onClick={() => handleOpenCloset(closet.id)}
                >
                  <BiLinkExternal />
                </IconButton>
              </div>
            ))}
      </div>
    </div>
  );
}

export default Closets;
