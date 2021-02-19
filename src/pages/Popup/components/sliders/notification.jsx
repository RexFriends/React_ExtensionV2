import React from 'react'
import {motion} from 'framer-motion'

function Notification ({showNotificationSet})  {
    const spring = {
        type: "spring",
        damping: 20,
        stiffness: 100
      }


    return(
        
            <motion.div  className="Notification" 
                animate={{ width: 275, x: 0}}
                initial={{ width: 0, x: -275 }}
                exit={{ x: -275 }}
                transition={{spring}}
               
            >  
                <h2>Notification Slider</h2>
                <button onClick={()=>{showNotificationSet(false)}}>X</button>
            </motion.div>     


    )
}

export default Notification