import React from 'react';
import { IoMail } from 'react-icons/io5';

function Header({ showProfileSet, showNotificationSet, user }) {
  const data = {
    notifications: 100,
    firstname: 'Firstname Lastname',
    propic:
      'https://cdn.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
    specialtext: '',
  };

  return (
    <div className="Header">
      {/* <IoMail
        className="notif"
        onClick={() => {
          showProfileSet(false);
          showNotificationSet(true);
        }}
      /> */}
      {/* <div className="badge">
        {data.notifications > 99 ? (
          <>
            <div className="count">99</div>
            <div className="excess">+</div>
          </>
        ) : (
          <div className="count">{data.notifications}</div>
        )}
      </div> */}
      {/* <div className="center">{data.specialtext}</div> */}
      {user && (
        <div className="nametag">
          {user.first_name} {user.last_name}
        </div>
      )}
      <img
        src={data.propic}
        className="profile"
        onClick={() => {
          showNotificationSet(false);
          showProfileSet(true);
        }}
      />
    </div>
  );
}

export default Header;
