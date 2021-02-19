import React, {useState, useEffect} from 'react'
import {motion, AnimatePresence} from 'framer-motion'
import IconButton from '@material-ui/core/IconButton'
import {AiOutlineDown, AiOutlineUp} from 'react-icons/ai'
function Home ({uid, homepageData}){
    
    const [[direction, storeStartIndex], storeStartIndexSet] = useState([0 , 0])
    const [currentIndex, currentIndexSet] = useState(0)

    // console.log("UID:", uid)
    // console.log("homepageData:", homepageData)


    useEffect(() => {
        currentIndexSet(storeStartIndex)

        return () => {
            
        }
    }, [storeStartIndex])

    const handleNextStore = () => {
        storeStartIndexSet([1, storeStartIndex + 1])
    
    }

    const handlePrevStore = () => {
        storeStartIndexSet([-1, storeStartIndex - 1])
       
    }

    if(homepageData === undefined){
        return(
            <div className="Home">
                Loading
            </div>
        )
    }


    return(
        <div  className="Home">
            <div id="header">
                {homepageData.title}
            </div>
            {
                storeStartIndex  > 0 &&
                <IconButton className="prevStore" size="small" onClick={handlePrevStore}>
                    <AiOutlineUp/>
                </IconButton>
            }
            <div id="stores">
            <AnimatePresence initial={false} custom={direction} >
                <motion.div
                    className="container"
                    custom={direction}
                    initial={{y: direction > 0 ? 75 : -75, zIndex: 20}}
                    animate={{y: 0,  opacity: 1, zIndex: 10}}
                    exit={{y: direction > 0 ? -75 : 75, opacity: 0, zIndex: 1}}
                    key={currentIndex}
                >
                    {
                        homepageData.affiliateLinks.slice(currentIndex, currentIndex + 5).map(
                            (store, i) => 
                                <motion.a 
                                    key={i}
                                    className="store"
                                    whileHover={{opacity: 0.4}}   
                                    transition={{duration: 0.05}}
                                    href={store.link}
                                    target="_blank"
                                >
                                    <img src={store.logo} id="store-image" alt={store.name}></img>
                                </motion.a>
                        )                      
                    }
                </motion.div>
            </AnimatePresence>  
            </div>
            {
                storeStartIndex + 5 < homepageData.affiliateLinks.length &&
                <IconButton className="nextStore" size="small" onClick={handleNextStore}>
                    <AiOutlineDown/>
                </IconButton>
            }
        </div>

    )
}

export default Home



// facebook signup error message This chrome extension ID (chrome-extension://kkifikadofpbodeknehfnbdjnklifgia) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.