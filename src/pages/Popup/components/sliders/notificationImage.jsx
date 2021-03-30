import React, { useState, useEffect } from 'react';
import APIURL from '../../../../assets/url';
function NotificationImage({ notification }) {
  const [product, setProduct] = useState(undefined);
  const [image, setImage] = useState(undefined);
  useEffect(() => {
    if (!product) {
      chrome.storage.local.get('uId', (res) => {
        fetch(
          `${APIURL}/api/product?product_id=${notification.product_info.id}&uid=${res.uId}`
        )
          .then((res) => res.json())
          .then((json) => {
            setProduct(json.product);
          });
      });
    }

    if (product) {
      if (product.images) {
        fetch(product.images)
          .then((res) => res.json())
          .then((json) => {
            let base64 = json.img_1;
            if (base64.substring(0, 2) === "b'" && base64[base64.length - 1]) {
              base64 = base64.slice(2);
              base64 = base64.slice(0, -1);
              setImage('data:image/jpeg;base64,' + base64);
              return;
            }
            if (base64.substring(0, 2) === 'ht') {
              setImage(base64);
            }
          })
          .catch((err) => console.log('err 1'));
      } else {
        fetch(product.screenshot)
          .then((res) => res.json())
          .then((json) => setImage(json.uri))
          .catch((err) => console.log('err 2'));
      }
    }
  }, [product, notification.product_id]);

  return <img src={image} id="product" alt="product-img" />;
}

export default NotificationImage;
