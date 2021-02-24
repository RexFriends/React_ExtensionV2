import React, {useState, useEffect} from 'react';

import Switch from '@material-ui/core/Switch'
import Button from '@material-ui/core/Button'
import './Options.scss';

const Options  = () => {
  const [injection, injectionSet] = useState(true)
  const [showWarning, showWarningSet] = useState(false)
  useEffect(() => {
    
    chrome.storage.local.get(["showInjection"], res => {
      injectionSet(res.showInjection)
    })
    return () => {
      
    }
  }, [])

  const handleChange = (val) => {
    if(val === "injection"){
      injectionSet(!injection)
      chrome.storage.local.set({showInjection: !injection})
      showWarningSet(true)
    }
  }

  return (
    <div className="OptionsContainer">
      <div id="title">Rex Settings</div>
      <div id="container">

        {/* Settings */}
        <div id="section">
          Settings
        </div>
          <div id="item">
            Show Save Item Button 
            <Switch onChange={()=>handleChange("injection")} checked={injection} />
          </div>
            {showWarning && 
              <div id="note">
                refresh pages to reflect changes
              </div>
            }
          <div id="item">
            Default Closet <div id="in-dev">in dev</div>
          </div>
          <div id="item">
            Dark Mode <div id="in-dev">in dev</div>
          </div>
          

        {/* Account */}
        <div id="section">
          Account
        </div>
          <div id="item">
            Edit Profile <div id="in-dev">in dev</div>
          </div>
          <div id="item">
            <Button variant="contained" color="primary" id="button" >Sign-out</Button> <div id="in-dev">in dev</div>
          </div>

        {/* Support */}
        <div id="section">
          Support 
        </div>
          <div id="item">
            Report a Problem <div id="in-dev">in dev</div>
          </div>

        {/* About Section */}
        <div id="section">
          About
        </div>
          <div id="item">
            Help / Info <div id="in-dev">in dev</div>
          </div>
          <div id="item">
            Privacy Policy <div id="in-dev">in dev</div>
          </div>
          <div id="item">
            Terms <div id="in-dev">in dev</div>
          </div>


        
      </div>
      
    </div>
  )
};

export default Options;
