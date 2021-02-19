import React, {useState, useEffect} from 'react'
import IconButton from '@material-ui/core/IconButton'
import {AiOutlineDown, AiOutlineUp} from 'react-icons/ai'
import {MdNavigateNext, MdNavigateBefore} from 'react-icons/md'
import {motion, AnimatePresence} from 'framer-motion'

function Closets ({uid, closetData, closetPreviews }){
    const [[direction, closetStartIndex], closetStartIndexSet] = useState([0 , 0])
    const [currentIndex, currentIndexSet] = useState(0)

    console.log("UID:", uid)
    console.log("closetData:", closetData)
    console.log("closetPreviews:", closetPreviews)

    useEffect(() => {
        currentIndexSet(closetStartIndex)
        return () => {
            
        }
    }, [closetStartIndex])

    const handlePrevCloset = () => {
        closetStartIndexSet([-1, closetStartIndex - 1])
    }

    const handleNextCloset = () => {
        closetStartIndexSet([1, closetStartIndex + 1])
    }

    return(
        <div  className="Closets">
            <div id="header">
                This is the closet page, add image here
            </div>
            <div className="body">
            {
                currentIndex > 0 &&
                <IconButton className="prevCloset" size="small" onClick={handlePrevCloset}>
                        <AiOutlineUp/>
                </IconButton>
            }
            <AnimatePresence initial={false} custom={direction} >
                <motion.div
                    className="container"
                    custom={direction}
                    initial={{y: direction > 0 ? 130 : -130, zIndex: 20}}
                    animate={{y: 0,  opacity: 1, zIndex: 10}}
                    exit={{y: direction > 0 ? -130 : 130, opacity: 0, zIndex: 0}}
                    key={currentIndex}
                >
                    {closetData.slice(currentIndex, currentIndex + 3).map(
                        (closet, i) => 
                            <div key={i} className="closet">
                                <div className="name">{closet.name}</div>
                                <div className="items"></div>
                            </div>
                    )}
                </motion.div>
            </AnimatePresence>
            
            {
                currentIndex + 3 < closetData.length &&
                <IconButton className="nextCloset" size="small" onClick={handleNextCloset}>
                        <AiOutlineDown/>
                </IconButton>
            }
            </div>
        </div>
    )
}

export default Closets