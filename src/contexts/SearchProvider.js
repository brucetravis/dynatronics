import { collection, getDocs } from 'firebase/firestore'
import { db } from '../components/configs/firebase/firebase';

const { createContext, useContext, useState, useEffect } = require("react");


// Create the Search Context
const SearchContext = createContext()

// Create a custom hook instead of manually using the context in the other components
export const useSearch = () => useContext(SearchContext)


export default function SearchProvider ({ children }) {

    // State to display the search input when the search Icon is clicked
    const [ showSearch, setShowSearch ] = useState(false) // Initial state is false meaning that the search input is initially hidden

    // State to handle the search term
    const [ searchTerm, setSearchTerm ] = useState("") // Initial state is an empty string to ensure flexibility

    // state to handle the filtered products
    const [ filteredProducts, setFilteredProducts ] = useState([]) // Initlal state is an empty array

    const [ allProducts, setAllProducts ] = useState([]) // Initial state is an array

    const [ loading, setLoading ] = useState()

    // Function to search for a product
    const handleSearch = (e) => {

        // Get the search term from the browser
        const term = e.target.value.toLowerCase()
        // Update the state with the search term
        setSearchTerm(term)

    }

    useEffect(() => {
        // Fetch products from the database so that we can filter
        const fetchSearchProducts = async () => {

            try {
                setLoading(true)

                // Create a reference to the products collection
                const productRef = collection(db, "Products")
                // Get the product data
                const productsSnapShot = await getDocs(productRef)
                // Map the product data
                const productData = productsSnapShot.docs.map((product) => ({
                    // Get the product Id
                    id: product.id,
                    // spread out the product data
                    ...product.data()
                }))

                // Update a state which will be used
                setAllProducts(productData)

            } catch (err) {
                console.error("Error Fetching Products from Firestore: ", err)
            
            } finally {
                setLoading(false)
            }
        }

        // Call the function
        fetchSearchProducts()

    }, [])

    // Filter the Logic
    useEffect(() => {
        const input = searchTerm.toLowerCase()
        const results = allProducts.filter(product => 
            product.name.toLowerCase().includes(input) || 
            product.category.toLowerCase().includes(input)
        )

        setFilteredProducts(results) // Update the filtered products with the results
    
    }, [searchTerm, allProducts])

    return (
        <SearchContext.Provider value={{
            showSearch, setShowSearch,
            searchTerm, setSearchTerm,
            handleSearch,
            filteredProducts,
            loading, setLoading
        }}>
            { children }
        </SearchContext.Provider>
    )
}