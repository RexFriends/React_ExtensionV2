import React from 'react'
import {IoMail} from 'react-icons/io5'

function Header({showProfileSet, showNotificationSet}){

    const data = {
        notifications: 100,
        firstname: "Elongated Muskrat",
        propic: "https://i.imgur.com/CNhZzYY.jpg",
        specialtext: ""
    }

    return(
        <div className="Header">
            
            <IoMail className="notif" onClick={() => {showProfileSet(false); showNotificationSet(true)}} />
            <div className="badge">
                    {data.notifications > 99 ? 
                        <>
                            <div className="count">99</div>
                            <div className="excess">+</div>
                        </> :
                        <div className="count">{data.notifications}</div>
                    }
            </div>
            <div className="center">
                {data.specialtext}
            </div>
            <div className="nametag">
                {data.firstname}
            </div>
            <img src={data.propic} className="profile" onClick={() => {showNotificationSet(false); showProfileSet(true)}}/>
            
        </div>
    )
}


export default Header