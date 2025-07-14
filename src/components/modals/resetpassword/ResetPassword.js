import React, { useState } from 'react'
import ReactDOM from 'react-dom';
import './ResetPassword.css'
import { sendPasswordResetEmail } from 'firebase/auth'
// import { auth } from '../../configs/firebase/firebase'
import { auth } from '../../configs/firebase/firebase'
import { toast } from 'react-toastify'
import { X, Zap } from 'lucide-react'

export default function ResetPassword({ closeModal }) {

    // states to handle the loading and password input
    const [ emailInput, setEmailInput ] = useState("") // Initial state is an empty string for flexibility
    // state to handle the for loading while sending the email
    const [ loading , setLoading ] = useState(false) // set the initial state to false

    // function to handle the Email input term
    const handleEmailInput = (e) => {
        // Get the input from the browser
        const term = e.target.value
        // Update the state to reflect whwat the user is typing
        setEmailInput(term)
    }

    // function to reset a users password when a user has forgtten their password
    const handlePasswordReset = async (e) => {
        // Prevent the Default behaviour of the form
        e.preventDefault()

        if (!emailInput.includes("@")) {
            toast.warning("Please enter a valid email address")
            return
        }

        // Update set Loading to true when the form is submitted
        setLoading(true)

        try {
            await sendPasswordResetEmail(auth, emailInput)
            toast.success("Password Reset Link sent. Check your Email inbox.")
        } catch (error) {
            console.error("Error sending Email", error.message)
            toast.error("Failed to send Reset Email")
        
        } finally {
            setLoading(false) // By default just Set loading to false
        }
    }

  return ReactDOM.createPortal (
    <div
        className='reset-backdrop'
    >
        <form 
            onSubmit={handlePasswordReset} 
            className='electric-form-reset'
        >
            <h2>Reset Your Password</h2>

            <label className='field'>
                <input 
                    type='email'
                    name='email'
                    placeholder='Enter Your Email'
                    value={emailInput}
                    onChange={handleEmailInput}
                    required
                />
            </label>

            <button
                type='submit'
                className='submit-btn mt-3'
                disabled={loading} // Disable the button while loading
            >
                <Zap size={18} style={{ marginRight: 6 }} />
                { loading ? "Sending........" : "Send Prompt" }
            </button>

            <X 
                size={25} 
                onClick={() => closeModal() }
                className='reset-close'
            />
        </form>
    </div>,
    document.body
  )
}
