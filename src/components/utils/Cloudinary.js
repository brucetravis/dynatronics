import axios from 'axios'
import { toast } from 'react-toastify'

export const uploadImageToCloudinary = async (imageFile) => {
    // object to **hold the image and settings** we want to send to Cloudinary.
    const formData = new FormData()
    formData.append('file', imageFile)
    
//     This tells Cloudinary, **“Use this preset when uploading.”**
// - `'dynatronics_preset'` should match the one you created in your Cloudinary dashboard.
// - It allows uploading **without needing secret keys.**
    formData.append('upload_preset', 'dynatronics_upload')

    try {
        // This sends the formData (with image and preset) to Cloudinary using a POST request.
        const res = await axios.post(
            // await means: wait until Cloudinary responds with the result (the image upload result).
            // The result will be stored in res.
            'https://api.cloudinary.com/v1_1/dz8yfvpjj/image/upload',
            formData
        )

        return res.data.secure_url
    } catch (err) {
        console.error('Cloudinary Upload failed', err)
        toast.error("Cloudinary Upload failed")
        return null
    }
    
}
