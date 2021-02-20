import React, {useState} from 'react'
import {FaGoogle, FaFacebookSquare} from 'react-icons/fa'
import {HiOutlineMail} from 'react-icons/hi'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import {motion, AnimatePresence} from 'framer-motion'
import {useForm} from 'react-hook-form';
import logo from '../../../../assets/img/Asset 1.png'


//Auth
import firebase from 'firebase';
require('firebase/auth')

const googleProvider = new firebase.auth.GoogleAuthProvider()
const facebookProvider = new firebase.auth.FacebookAuthProvider();
facebookProvider.setCustomParameters({
'display': 'popup'
});




function Landing(){
    const [emailLogin, emailLoginSet] = useState(false)
    const [signup, signupSet] = useState(false)
    const {register, handleSubmit,  errors} = useForm()
    const [error, errorSet] = useState(undefined)

    const onSubmit = (data) => {
        if(emailLogin){
            firebase.auth().signInWithEmailAndPassword(data.email, data.password)
                .then(res => {
                    handleCustomSignin(res.user.uid, res.user.email)
                }).catch((error) => {
                    console.log("custom signin error", error);
                });

         
        }else if(signup){
            
            firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
                .then((res) => {
                    console.log("user signup custom data", res, "data:", data)
                    handleSuccessfulLogin(
                        res.user.uid, 
                        data.firstname,
                        data.lastname,
                        res.user.email,
                        data.phone
                    )
        
                }).catch((error) => {
                    console.log("custom signup error", error)
                });
        }
    }

    function googleSignUp() {
        firebase.auth().signInWithPopup(googleProvider).then((res) => {
            handleSuccessfulLogin(
                res.user.uid, 
                res.additionalUserInfo.profile.given_name,  
                res.additionalUserInfo.profile.family_name,
                res.user.email
            )
          }).catch((error) => {
            console.log("google signup error:", error.message)
          })
    }


    function facebookSignUp() {
        firebase.auth().signInWithPopup(facebookProvider).then((res) => {
            let name = res.user.displayName.split(" ")
            handleSuccessfulLogin(
                res.user.uid, 
                name[0], 
                name[1], 
                res.user.email
            )
        }).catch((error) => {
            console.log("facebook signup error:", (error))
        })
    }

    function handleSuccessfulLogin(uid, firstname, lastname, email, phone = null ){
        let payload = {
            action: "login-signup",
            uid: uid,
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone
        }
        chrome.runtime.sendMessage(payload,  (reply) => {
            console.log("sent signin/signup data to background", reply)
        })
    }
    function handleCustomSignin(uid, email){
        let payload = {
            action: "custom-signin",
            uid: uid,
            email: email
        }
        chrome.runtime.sendMessage(payload, (reply) => {
            console.log("sent custom signin to background", reply)
        })
    }

    return(
        <motion.div className="Landing" 
            
            animate={{y: 0}}
            exit={{y:-600}}
            // initial={{y:-600}}
            transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
        >
            <img className="logo" src={logo} alt="rexLogo"  onClick={()=>{signupSet(false); emailLoginSet(false)}}/>
            <AnimatePresence>
            {
                emailLogin &&
                <motion.div className="email-login-popup"
                    animate={{ x:0}}
                    initial={{ x: 350 }}
                    exit={{ x: 350 }}
                    transition={{ type: "spring", stiffness: 1000, damping: 100 }}
                >
                    <div className="close-popup" onClick={()=>{emailLoginSet(false)}}></div>
                    <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                        <TextField name="email" label="EMAIL" inputRef={register}></TextField>
                        <TextField type="password" name="password" label="PASSWORD" inputRef={register}></TextField>
                        <Button  type="submit" className='login-button'  > LOGIN </Button >
                    </form>
                </motion.div>
            }
            </AnimatePresence>
            <AnimatePresence>
            {
                signup &&
                <motion.div className="signup-popup"
                    animate={{ y: 0, height: 320 }}
                    initial={{ y: 400, height: 0 }}
                    exit={{  x:-350 }}
                    transition={{ type: "spring", stiffness: 1000, damping: 100 }}
                >
                    <div onClick={()=>{signupSet(false)}} className="close-popup"></div>
                    <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
                        <div className="name">
                            <TextField className="input-left" name="firstname" label="FIRST NAME" inputRef={register}></TextField>
                            <TextField className="input-right" name="lastname" label="LAST NAME" inputRef={register}></TextField>
                        </div>
                        <TextField className="input"  name="email" label="EMAIL" inputRef={register}></TextField>
                        <TextField className="input"  name="phone" label="PHONE" inputRef={register}></TextField>
                        <TextField className="input"  type="password" name="password" label="PASSWORD" inputRef={register}></TextField>
                        <Button  type="submit" className='login-button'> SIGNUP </Button >
                    </form>
                    <div className="error-box">{error && error}</div>
                </motion.div>
            }
           </AnimatePresence>
            <div className="buttons">
                <div className="login">
                    <Button className="email login-button" startIcon={<HiOutlineMail/>} onClick={()=>{emailLoginSet(true); signupSet(false)}}>Login with Email</Button>
                    <Button className="fb login-button" startIcon={<FaFacebookSquare/>} onClick={()=>{facebookSignUp()}}>  Login with Facebook</Button>
                    <Button className="google login-button" startIcon={<FaGoogle/> } onClick={()=>{googleSignUp()}}> Login with Google</Button>
                </div>
                <div className="signup">
                    <div onClick={()=>emailLoginSet(false)}>Don't have an account?</div>
                    <Button className="signup-button" onClick={()=>{signupSet(true); emailLoginSet(false)}}>Sign-up</Button>
                </div>
            </div>
        </motion.div>
    )
}

export default Landing