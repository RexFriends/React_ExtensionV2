import React, { useEffect, useState } from 'react';

function ClosetBox({ closetData, closetPreview }) {
  let [image, imageSet] = useState([]);

  useEffect(() => {
    let arr = closetPreview.items.slice(0, 4).map((item) => {
      if (item.isWebscraped) {
        return item.images;
      } else {
        return item.img;
      }
    });

    Promise.all(
      arr.map((url) =>
        fetch(url)
          .then((res) => res.json())
          .then((json) => {
            if (json.uri) {
              return json.uri;
            } else {
              return json;
            }
          })
          .catch((err) => console.log(err))
      )
    ).then((data) => {
      imageSet(
        data.map((data) => {
          let item = data.img_1;
          if (item.substring(0, 2) === "b'" && item[item.length - 1]) {
            let base64 = item;
            base64 = base64.slice(2);
            base64 = base64.slice(0, -1);
            return 'data:image/jpeg;base64,' + base64;
          } else {
            return item;
          }
        })
      );
    });

    return () => {};
  }, []);

  const handleOpenCloset = () => {
    chrome.tabs.create({
      url: 'https://app.rexfriends.com/closets/' + closetPreview.id,
    });
  };

  return (
    <div className="closet">
      <div className="container" onClick={handleOpenCloset}>
        {image[0] && <img id="preview" src={image[0]} alt="1"></img>}
        {image[1] && <img id="preview" src={image[1]} alt="2"></img>}
        {image[2] && <img id="preview" src={image[2]} alt="3"></img>}
        {image[3] && <img id="preview" src={image[3]} alt="3"></img>}
      </div>
      {/* <Button onClick={handleClick}>Button</Button> */}
      <div className="name">{closetData.name}</div>
    </div>
  );
}

export default ClosetBox;
