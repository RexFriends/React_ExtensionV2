import React, { useEffect, useState } from 'react';

function ClosetBox({ closetData, closetPreview }) {
  let [image, imageSet] = useState([]);

  useEffect(() => {
    //   console.log(clo)
    let arr = closetPreview.items.slice(0, 4).map((item) => item.img);
    Promise.all(
      arr.map((url) =>
        fetch(url)
          .then((res) => res.json())
          .then((json) => json.uri)
          .catch((err) => console.log(err))
      )
    ).then((data) => {
      imageSet(data);
    });

    return () => {};
  }, []);

  const handleOpenCloset = () => {
    console.log('open closet');
    chrome.tabs.create({
      url: 'https://rexfriends.com/closets/' + closetPreview.id,
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
