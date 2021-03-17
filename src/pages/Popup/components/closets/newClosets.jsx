import React, { useState, useEffect } from 'react';
import IconButton from '@material-ui/core/IconButton';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';

import { motion, AnimatePresence } from 'framer-motion';
import ClosetBox from './ClosetBox';
import EmptyBox from './EmptyBox';
function NewClosets({ uid, closetData, closetPreviews }) {
  const [[direction, closetStartIndex], closetStartIndexSet] = useState([0, 0]);
  const [currentIndex, currentIndexSet] = useState(0);

  useEffect(() => {
    let payload = {
      action: 'update preview',
    };

    chrome.runtime.sendMessage(payload);
    return () => {};
  }, []);

  useEffect(() => {
    currentIndexSet(closetStartIndex);

    return () => {};
  }, [closetStartIndex]);

  const handlePrevCloset = () => {
    closetStartIndexSet([-1, closetStartIndex - 1]);
  };

  const handleNextCloset = () => {
    closetStartIndexSet([1, closetStartIndex + 1]);
  };

  return (
    <div className="newClosets">
      <div id="header">Closets</div>
      {closetData !== undefined && (
        <div className="body">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              className="container"
              custom={direction}
              initial={{ y: direction > 0 ? 200 : -200, zIndex: 20 }}
              animate={{ y: 0, opacity: 1, zIndex: 10 }}
              exit={{ y: direction > 0 ? -200 : 200, opacity: 0, zIndex: 0 }}
              key={currentIndex}
            >
              {closetData !== undefined &&
                closetData
                  .slice(currentIndex * 2, currentIndex * 2 + 4)
                  .map((closet, i) => {
                    if (i % 2 !== 1) {
                      //   console.log('index & i', currentIndex, i, closet);
                      return (
                        <div id="row" key={i}>
                          <ClosetBox
                            closetData={closetData[currentIndex * 2 + i]}
                            closetPreview={closetPreviews[currentIndex * 2 + i]}
                          />
                          {closetData[currentIndex * 2 + i + 1] ? (
                            <ClosetBox
                              closetData={closetData[currentIndex * 2 + i + 1]}
                              closetPreview={
                                closetPreviews[currentIndex * 2 + i + 1]
                              }
                            />
                          ) : (
                            <EmptyBox />
                          )}
                        </div>
                      );
                    } else {
                      return;
                    }
                  })}
            </motion.div>
          </AnimatePresence>

          <IconButton
            className="prevCloset"
            size="medium"
            onClick={handlePrevCloset}
            disabled={currentIndex <= 0}
          >
            <AiOutlineUp />
          </IconButton>

          <IconButton
            className="nextCloset"
            size="medium"
            onClick={handleNextCloset}
            disabled={currentIndex * 2 + 3 >= closetData.length}
          >
            <AiOutlineDown />
          </IconButton>
        </div>
      )}
    </div>
  );
}

export default NewClosets;
