const { createContext, useContext, useState } = require("react");


// Create the Search Context
const SearchContext = createContext()

// Create a custom hook instead of manually using the context in the other components
export const useSearch = () => useContext(SearchContext)


export default function SearchProvider ({ children }) {

    // State to display the search input when the search Icon is clicked
    const [ showSearch, setShowSearch ] = useState(false) // Initial state is false meaning that the search input is initially hidden

    // State to handle the search term
    const [ searchTerm, setSearchTerm ] = useState("") // Initial state is an empty string to ensure flexibility

    // Function to search for a product
    const handleSearch = (e) => {

        // Get the search term from the browser
        const term = e.target.value.toLowerCase()
        // Update the state with the search term
        setSearchTerm(term)

    }

    return (
        <SearchContext.Provider value={{
            showSearch, setShowSearch,
            searchTerm, setSearchTerm,
            handleSearch
        }}>
            { children }
        </SearchContext.Provider>
    )
}