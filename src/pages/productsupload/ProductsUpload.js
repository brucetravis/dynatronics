import React, { useRef, useState, useEffect } from 'react'
import './ProductsUpload.css'
import { Upload } from 'lucide-react'
import { uploadImageToCloudinary } from '../../components/utils/Cloudinary'
import { toast } from 'react-toastify'
import { db } from '../../components/configs/firebase/firebase'
import { addDoc, collection } from 'firebase/firestore'

export default function ProductsUpload() {

    // states to update use Inputs
    const [ formData, setformData ] = useState({
        category: "",
        name: "",
        price: "",
        quantity: "",
        description: ""
    }) // initial state is an object to store inputs in an object

    const [ imageFile, setImageFile ] = useState(null) // Initila state is nothing

    // state to handle the loading of the form when uploading the product details
    const [ loading, setLoading ] = useState(false)


    // Initialize useRef to directly speak to the file input in order to clear It because React cannot controll it using states
    const fileInputRef = useRef(null) // It it referring to nothing initially

    // function to handle the input term
    const handleInput = (e) => {
        
        // Destructure to get the name and the value
        const { name, value } = e.target

        // Update the input boxes accordingly
        setformData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    }

    // handles the file input separately
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        // Update the file state with the first file selected
        setImageFile(file)
    }


    // function to submit the form
    const handleSubmit = async (e) => {
        // prevent the default behaviour of the form
        e.preventDefault()

        // set loading to true
        setLoading(true)

        // If no image has been selected
        if (!imageFile) {
            // Inform the developer/user in the console
            console.log("Please select an Image")
            // Update the state to null
            setImageFile(null)
            return
        }

        // Upload an image to cloudinary so that we can get the url and store to firestore
        const imageUrl = await uploadImageToCloudinary(imageFile)

        // If the image is being uploaded
        if (imageUrl) {
            try {
                // wait for Firestore to finish adding/saving the product before moving on
                // addDoc geerates a new Id for every new product
                await addDoc(collection(db, 'Products'),  {
                    // spread or copy all the form data
                    ...formData,
                    // Update the image url key with the actual url
                    imageUrl: imageUrl,
                    createdAt: new Date()
                })

                console.log("Uploaded Image Url", imageUrl)
                toast.success("Product Uploaded Successfully")

                // reset the form to be blank
                setformData({
                    category: "",
                    name: "",
                    price: "",
                    quantity: "",
                    description: ""
                })
                // reset the image file input to be blank
                setImageFile(null)
                fileInputRef.current.value = null //clear the file input visually
                // reset loading to false afetr a successful submission
                setLoading(false)
            } catch (err) {
                setLoading(false)
                console.error("Error Uploading to firestore")
                toast.error("Image Upload Failed")
            }
            
        } else {
            console.log("Image Upload Failed")
        }
            
    }

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
  
    return (
    <div className='products-upload-page'>
        <form
            className='electric-upload-form'
            onSubmit={handleSubmit}
        >
            <h2>Upload A Product</h2>
            <div className='categ-name d-flex align-items-center justify-content-center'>
                <label className='field'>
                    <span>Product Category:</span>
                    <input 
                        type='text' 
                        name='category' 
                        placeholder=' Product Category' 
                        className='mb-3'
                        value={formData.category}
                        onChange={handleInput}
                        required
                    />
                </label>

                
                <label className='field'>
                    <span>Product Name:</span>
                    <input 
                        type='text' 
                        name='name' 
                        placeholder=' Product Name' 
                        className='mb-3'
                        value={formData.name}
                        onChange={handleInput}
                        required
                    />
                </label>

            </div>
            
            <div className='categ-name d-flex align-items-center justify-content-center '>
                <label className='field'>
                    <span>Product Price:</span>
                    <input 
                        type='number' 
                        name='price' 
                        placeholder='Ksh/$ 200' 
                        className='mb-3'
                        value={formData.price}
                        onChange={handleInput}
                        required
                    />
                </label>
                

                <label className='field'>
                    <span>Product Quantity:</span>
                    <input 
                        type='number' 
                        name='quantity' 
                        placeholder='Product Quantity' 
                        className='mb-3'
                        value={formData.quantity}
                        onChange={handleInput}
                        required
                    />
                </label>
            </div>
            

            <label className='field'>
                <span>Product Description:</span>
                <div className="electric-glow-wrapper">
                    <textarea
                        name='description'
                        className='electric-textarea mb-3'
                        placeholder='Product Description'
                        value={formData.description}
                        onChange={handleInput}
                        required
                    ></textarea>
                </div>
            </label>
            

            <label className='field'>
                <span>Product Image:</span>
                <input 
                    type='file' 
                    accept='image/*' 
                    className='file-input mb-3'
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    required
                />
            </label>


            <button
                className='submit-btn'
                disabled={loading}
            >
                <Upload size={18} style={{ marginRight: '6px' }} />
                {loading ? "Uploading...." : "Upload" }
            </button>
        </form>
    </div>
  )
}
