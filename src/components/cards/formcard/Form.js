import React, { useState } from 'react'
import './Form.css'
import { Eye, EyeOff, Zap } from 'lucide-react'
import { createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        updateProfile 
    } from 'firebase/auth'
    
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../../configs/firebase/firebase'
import { v4 as uuid } from "uuid"
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../../../contexts/AuthProvider'
// import ResetPassword from '../../modals/resetpassword/ResetPassword'
import ResetPassword from '../../modals/resetpassword/ResetPassword'


export default function Form() {
    
    // use useNavigate
    const navigate = useNavigate()
    
    const { setUser } = useAuth()

    // state to update the input
    const [ inputValue, setInputValue ] = useState({
        name: "",
        email: "",
        password: "",
        ConfirmPassword: ""
    }) // The initial state is the empty object property name

    // state to handle the form loading
    const [ loading, setLoading ] = useState(false) // Initial state is false

    // state to display the login inputs
    const [ isLogIn, setIsLogIn ] = useState(false) // initial state is false

    // state to view the password when clicking the eye button
    const [ showPwd, setShowPwd ] = useState(false) // Initial state is false meaning the password cannot be seen/ dots
    const [ showConfirmPwd, setShowConfirmPwd ] = useState(false) // Initial state is false meaning the password cannot be seen/ dots

    // state to show the reset Modal
    const [ showResetModal, setShowResetModal ] = useState(false) // Inial state is false

    const openModal = () => setShowResetModal(true) // When Opening to show the reset Modal
    const closeModal = () => setShowResetModal(false) // When closing to hide the Modal

    // function to update the state
    const handleChange = (e) => {
        setInputValue((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }
    
    
    // function to handle the form submission
    const handleSignUpSubmit = async (e) => {
        // prevent the default behaviour of the form
        e.preventDefault()

        // special characters in a password
        const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '_', '=', '+', '[', ']', '{', '}', '\\', '|', ';', ':', '\'', '"', ',', '<', '>', '.', '/', '?', '`', '~'];
        // check if the password has at least one special character
        const hasSpecial = specialCharacters.some(char => inputValue.password.includes(char))

        // Admin credentials
        const admin_cred = ["bruceambundo@gmail.com", "bruce@dynatech.com", "bruzy@gmail.com"]

        // check if the password matches the confirm password
        if (inputValue.password.length < 6) {
            toast.warning("Password MUST be with at least 6 characters")
            // Do not submit
            return

        } else if (inputValue.password !== inputValue.ConfirmPassword) {
            // Update the error message
            toast.warning(" Passwords MUST match")
            // Do not submit
            return
            // if the password does not contain at least one special character
        } else if (!hasSpecial) {
            // Update the error message
            toast.warning(`Password MUST contain at least one special character ${specialCharacters.join()}`)
            // Do not submit
            return
            // the errors state will be initially empty
        }

        // set the loading to true after all three validations. Incase of an error the remember that loading was still false
        // set the loading to true since It will be true when the form is being submitted
        setLoading(true)

        try {
            // create a user usein firebases createUseWithEmailAndPassword
            const cred = await createUserWithEmailAndPassword(
                auth, 
                inputValue.email.trim(), 
                inputValue.password
            )

            // Update the displayName key in the user property
            await updateProfile(cred.user, { displayName: inputValue.name.trim() })
            
            // Access the saved displayName value from firebase and store It in the user object 
            await cred.user.reload()  // reload does not reload the web page but accesses the user object values after a name has been saved to dsplayName           
            
            // Update the user state with the extracted name so that we can display the users name
            setUser({ ...auth.currentUser })
            // create a usercollection in firestore and add a document of the users info
            await setDoc(doc(db, "users", cred.user.uid), {
                uid: cred.user.uid,
                name: inputValue.name.trim(),
                email: inputValue.email.trim(),
                role: admin_cred.includes(inputValue.email.trim()) ? "admin" : "user",
                createdAt: Date.now(),
                referralCode: uuid()
            })

            // Notify the user that their account has been created
            toast.success("Account Created Successfully, success")
            // navigateto the shop page
            navigate('/', { replace: true })
            
            // Update the inputValue state to empty strings
            setInputValue({
                name: "",
                email: "",
                password: "",
                ConfirmPassword: ""
            })
        } catch (err) {
            // log the error messages to the console
            console.log(err.code, err.message)
            console.log(err.message)

            if (err.code === 'auth/email-already-in-use') {
                toast.error("Ero=ro Creating Account. Email Already in Use")
            }
            
        } finally {
            // Update the loading state to false so that the loading can be completed
            setLoading(false)
        }
    }

    // function to handle the logIn logic
    const handleLogInSubmit = async (e) => {
        // prevent the default action of the form (submitting automatically)
        e.preventDefault()


        // Update setLoading to true
        setLoading(true)
        
        // try submitting the form
        try {
            // sign in a user with the email and password
            const cred = await signInWithEmailAndPassword(
                auth, 
                inputValue.email.trim(), 
                inputValue.password
            )
            // Pull their firestore document to read their role
            const snap = await getDoc(doc(db, "users", cred.user.uid))
            const data = snap.data()
            const role = data?.role || "user"
            
            toast.success("Logged In")

            // Redirect the user according to the role
            if (role === "admin") {
                navigate("/home", { replace: true })
            } else if (role === "user") {
                navigate("/", { replace: true })
            }
        } catch (err) {
            console.log(err.code, err.message)
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div>
        <form 
            onSubmit={isLogIn ? handleLogInSubmit : handleSignUpSubmit} 
            className='electric-form'
        >
            {isLogIn ? (
                <h2>Log In</h2>
            ) : (
                <h2>Create Account</h2>
            )}
            <div>
                {!isLogIn && (
                    <label className='field'>
                        <span>Name:</span>
                        <input 
                            type='text' 
                            name="name" 
                            placeholder='John Mackenzie' 
                            value={inputValue.name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                )}
                <label className='field'>
                    <span>Email:</span>
                    <input 
                        type='email' 
                        name="email" 
                        placeholder='johnmackenzie@gmail.com'
                        value={inputValue.email}
                        onChange={handleChange}
                        required 
                    />
                </label>
                <label className='field password-field'>
                    <span>Password (6 or more characters):</span>
                    <input 
                        type={ showPwd ? 'text' : 'password' } 
                        name='password' 
                        placeholder='.......' 
                        value={inputValue.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type='button'
                        className='eye-btn'
                        onClick={() => setShowPwd((prev) => !prev)}
                        aria-label={ showPwd ? "Hide Password" : "Show Password" }
                    >
                        { showPwd ? <Eye size={18} /> : <EyeOff size={18} /> }
                    </button>
                </label>
                {!isLogIn && (
                    <label className='field'>
                        <span>Confirm Password:</span>
                        <input 
                            type={showConfirmPwd ? "text": "password" }
                            name="ConfirmPassword" 
                            placeholder='......'
                            value={inputValue.ConfirmPassword}
                            onChange={handleChange}
                            required 
                        />

                        <button
                            type='button'
                            className='eye-btn'
                            onClick={() => setShowConfirmPwd((prev) => !prev)}
                            aria-label={ showConfirmPwd ? "Hide Password" : "Show Password" }
                        >
                            { showConfirmPwd ? <Eye size={18} /> : <EyeOff size={18} /> }
                        </button>
                    </label>
                )}
            </div>
            <button 
                type='submit'
                className='submit-btn'
                disabled={loading}
            >
                <Zap size={18} style={{ marginRight: 6 }} />
                {loading ? (isLogIn ? "Logging In....." : "Creating account......") : (isLogIn ? "Log In" : "Sign Up")}
            </button>

            <div className='d-flex flex-column'>
                <Link
                    onClick={() => openModal()}
                    className='mt-3'
                >
                    forgot your password
                </Link>

                <Link 
                    className='text-center mt-3'
                    onClick={() => setIsLogIn((prev) => !prev)}
                >
                    {isLogIn ? 
                        "Don't have an account? Click to sign Up" : 
                        "Already have an account? click to log In"
                    }
                </Link>
            </div>
            {/* {errors && <p className='error-text bg-red text-white'>{errors}</p>} */}
        </form>

        {/* Show the reset form card when the showModle state is true */}
        { showResetModal && (
            <ResetPassword closeModal={closeModal} />
        ) }

    </div>
  )
}
