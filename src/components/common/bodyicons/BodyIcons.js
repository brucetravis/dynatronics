import React, { useEffect, useState } from 'react'
import './BodyIcons.css'
import { LayoutDashboard, PackagePlus, Phone } from 'lucide-react'
import { Tooltip } from 'react-tooltip'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../configs/firebase/firebase'
import { useAuth } from '../../../contexts/AuthProvider'
import { useNavigate } from 'react-router-dom'


export default function BodyIcons() {

  // useNavigate() to navigate to another page
  const navigate = useNavigate()

  // Import the user from the coontext
  const { user } = useAuth()

  // React useState() for updating the UI
  const [ role, setRole ] = useState("user" || "Guest") // Iniital state is an ordinary user

  // useEffect to watch out is a user changes
  useEffect(() => {

    const getUserRole = async () => {

      // If user is null
      if (!user) {
        // Update the state to user to represent an ordinary user
        setRole("user" || "Guest")
        return // Then exit
      };

      try {
        // Refernce to the current logged in users document
        const snapShot = await getDoc(doc(db, "users", user.uid))
        // convert the snapShot into plain JavaScript data
        const data = snapShot.data()
        // Pick out he role or default to user
        const userRole = data?.role || "user"
        setRole(userRole) // Update the role in the state

      } catch(err) {
        console.error(`Error fetching user role ${err}`)
        setRole("user" || "Guest") // If something goes wrong fallback to user
      }
    }

    // Call the async function so that It can run
    getUserRole()
  }, [user])

  

  return (
    <div className='body-icon-div'>
      
      { role === "admin" ? (
        <>
          <LayoutDashboard 
            size={25}
            className='icon dashboard'
            data-tooltip-id="dashTip"

          />

          <PackagePlus 
            size={25}
            className='icon upload'
            data-tooltip-id="uploadTip"
            onClick={() => navigate('/productsupload')}
          />

          <Phone 
            size={25}
            className='icon phone'
            data-tooltip-id="phoneTip"
            onClick={() => {
              window.open('tel:+254712345678', '_blank')
            }}

          />

          <Tooltip id="dashTip" efect="solid" place="left" className="custom-tooltip dash-tooltip">Dashboard</Tooltip>
          <Tooltip id="uploadTip" effect="solid" place='left' className='custom-tooltip upload-tooltip'>Upload Products</Tooltip>
                    <Tooltip id='phoneTip' effect='solid' place='left' className='custom-tooltip phone-tooltip'>Contact Us</Tooltip>
        </>
      ) : (
        <>
          <Phone 
            size={25}
            className='icon phone'
            data-tooltip-id="phoneTip"
            onClick={() => {
              window.open('tel:+254712345678', '_blank')
            }}
            
          />

          <Tooltip id='phoneTip' effect='solid' place='left' className='custom-tooltip phone-tooltip'>Contact Us</Tooltip>
        </>
      )}

    </div>
  )
}
