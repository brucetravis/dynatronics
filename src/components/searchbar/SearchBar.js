import React from 'react'
import './SearchBar.css'
import { motion } from 'framer-motion'
import { XCircle } from 'lucide-react'
import { useAuth } from '../../contexts/AuthProvider'

export default function SearchBar() {

  // Get the state function from the uth Provider in order to update the function
  const { setShowSearch } = useAuth()

  return (
    <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut"}}
        exit={{ y: 100, opacity: 0 }}
        className='search-bar'
    >
      <XCircle 
        size={30}
        className='close-search'
        onClick={() => setShowSearch((prev) => !prev)}
      />
      
      <motion.input
        type='search'
        initial={{ width: 200, opacity: 0 }}
        animate={{ width: 500, opacity: 1 }}
        transition={{ duration: 0.5 }}
        placeholder='Search Products'
        className='search-bar-input'
      
      />

    </motion.div>
  )
}
