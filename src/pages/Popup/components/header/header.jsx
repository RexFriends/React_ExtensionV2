import React, { useEffect, useState } from 'react';
import { IoMail } from 'react-icons/io5';

function Header({ showProfileSet, showNotificationSet, user }) {
  const [notifications, notificationsSet] = useState(0);
  const data = {
    propic:
      'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
  };
  useEffect(() => {
    chrome.storage.local.get(['notifications'], (res) => {
      if (res.notifications) {
        notificationsSet(res.notifications.amount);
      }
    });
  }, []);
  return (
    <div className="Header">
      <IoMail
        className="notif"
        onClick={() => {
          showProfileSet(false);
          showNotificationSet(true);
        }}
      />
      {notifications !== 0 && (
        <div className="badge">
          {notifications > 99 ? (
            <>
              <div className="count">99</div>
              <div className="excess">+</div>
            </>
          ) : (
            <div className="count">{notifications}</div>
          )}
        </div>
      )}
      <div id="user">
        {user && <div className="nametag">{user.username}</div>}
        <img
          src={user?.profile_image ? user.profile_image : data.propic}
          className="profile"
          onClick={() => {
            showNotificationSet(false);
            showProfileSet(true);
          }}
        />
      </div>
    </div>
  );
}

export default Header;
