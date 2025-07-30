import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore'
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

    // state to keep track of where the last page stopped
    const [ lastVisibleProduct, setLastVisibleProduct ] = useState(null) // Initial state in null/nothing

    // state to know if there are more products to load
    const [ hasMoreProducts, setHasMoreProducts ] = useState(true) // Initial state to Know If there are more products to load

    const [ loading, setLoading ] = useState(false)


    const loadMoreProducts = async () => {
        if (!lastVisibleProduct) return;

        setLoading(true);

        try {
            const productRef = collection(db, "Products");
            const nextQuery = query(
                productRef,
                orderBy('name'),
                startAfter(lastVisibleProduct),
                limit(6)
            );

            const nextSnapshot = await getDocs(nextQuery);

            const newProducts = nextSnapshot.docs.map(document => ({
                id: document.id,
                ...document.data()
            }));

            // setAllProducts(prev => [...prev, ...newProducts]);

            setAllProducts(prev => {
                const updated = [...prev, ...newProducts];

                // Manually update filteredProducts too
                const input = searchTerm.toLowerCase()
                const results = updated.filter(product => 
                    product.name.toLowerCase().includes(input) || 
                    product.category.toLowerCase().includes(input)
                )
                setFilteredProducts(results);

                return updated;
            });


            setLastVisibleProduct(nextSnapshot.docs[nextSnapshot.docs.length - 1]);

            if (nextSnapshot.empty || nextSnapshot.docs.length < 6) {
                setHasMoreProducts(false);
            }

        } catch (err) {
            console.error("Error loading more products:", err);
        } finally {
            setLoading(false);
        }
    };

    // Function to search for a product
    const handleSearch = (e) => {

        // Get the search term from the browser
        const term = e.target.value.toLowerCase()
        // Update the state with the search term
        setSearchTerm(term)

    }

    useEffect(() => {
        
        // function to fetch all products from fitrestore
        const fetchSearchProducts = async () => {

            try {
                setLoading(true) // start loading
                
                // Create a reference to all products in firestore
                const productRef = collection(db, "Products")
                
                // Initialize a query variable
                let q;

                if (lastVisibleProduct) {
                    // Load the next batch
                    q = query(productRef, orderBy('name'), startAfter(lastVisibleProduct), limit(15))

                } else {
                    // Initila fetch
                    q = query(productRef, orderBy('name'), limit(15))
                }

                // A SnapShot of all the product data
                const snapShot = await getDocs(q)
                
                // Map to get each product and their data
                const newProducts = snapShot.docs.map(document => ({
                    // get the Id that has been stored separately
                    id: document.id,
                    ...document.data()
                }))
                
                // Update the last visible product
                const lastVisible = snapShot.docs[snapShot.docs.length - 1] || null
                setLastVisibleProduct(lastVisible)

                // Append all existing products
                // setAllProducts(prev => [...prev, ...newProducts])

                setAllProducts(prev => {
                    const updated = [...prev, ...newProducts];

                    const input = searchTerm.toLowerCase();
                    const results = updated.filter(product =>
                        product.name.toLowerCase().includes(input) ||
                        product.category.toLowerCase().includes(input)
                    );
                    setFilteredProducts(results);

                    return updated;
                });

                // If not more products
                if (snapShot.empty || snapShot.docs.length < 6) {
                    setHasMoreProducts(false)
                }

                
            } catch (err) {
                console.error("Error fetching Products: ", err)
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
            loading, setLoading,
            loadMoreProducts,
            hasMoreProducts
        }}>
            { children }
        </SearchContext.Provider>
    )
}

// import { collection, getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore';
// import { db } from '../components/configs/firebase/firebase';
// import { createContext, useContext, useState, useEffect } from 'react';

// const SearchContext = createContext();
// export const useSearch = () => useContext(SearchContext);

// export default function SearchProvider({ children }) {
//     const [showSearch, setShowSearch] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [filteredProducts, setFilteredProducts] = useState([]);
//     const [allProducts, setAllProducts] = useState([]);
//     const [lastVisibleProduct, setLastVisibleProduct] = useState(null);
//     const [hasMoreProducts, setHasMoreProducts] = useState(true);
//     const [loading, setLoading] = useState(false);

//     const handleSearch = (e) => {
//         const term = e.target.value.toLowerCase();
//         setSearchTerm(term);
//     };

//     const fetchProducts = async (startFrom = null) => {
//         const productRef = collection(db, 'Products');
//         const baseQuery = startFrom
//             ? query(productRef, orderBy('name'), startAfter(startFrom), limit(6))
//             : query(productRef, orderBy('name'), limit(6));

//         const snapShot = await getDocs(baseQuery);

//         const newProducts = snapShot.docs.map(doc => ({
//             id: doc.id,
//             ...doc.data()
//         }));

//         const lastVisible = snapShot.docs[snapShot.docs.length - 1] || null;

//         setLastVisibleProduct(lastVisible);
//         setHasMoreProducts(snapShot.docs.length === 6);

//         return newProducts;
//     };

//     const loadMoreProducts = async () => {
//         if (!lastVisibleProduct || loading) return;

//         setLoading(true);
//         try {
//             const newProducts = await fetchProducts(lastVisibleProduct);

//             setAllProducts(prev => {
//                 const updated = [...prev, ...newProducts];
//                 updateFilteredProducts(updated, searchTerm);
//                 return updated;
//             });
//         } catch (err) {
//             console.error("Error loading more products:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateFilteredProducts = (products, term) => {
//         const input = term.toLowerCase();
//         const results = products.filter(product =>
//             product.name.toLowerCase().includes(input) ||
//             product.category.toLowerCase().includes(input)
//         );
//         setFilteredProducts(results);
//     };

//     // Initial fetch on mount
//     useEffect(() => {
//         const fetchInitialProducts = async () => {
//             setLoading(true);
//             try {
//                 const newProducts = await fetchProducts();
//                 setAllProducts(newProducts);
//                 updateFilteredProducts(newProducts, searchTerm);
//             } catch (err) {
//                 console.error("Error fetching products:", err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchInitialProducts();
//     }, []);

//     // Run filtering whenever searchTerm or allProducts change
//     useEffect(() => {
//         updateFilteredProducts(allProducts, searchTerm);
//     }, [searchTerm, allProducts]);

//     return (
//         <SearchContext.Provider
//             value={{
//                 showSearch,
//                 setShowSearch,
//                 searchTerm,
//                 setSearchTerm,
//                 handleSearch,
//                 filteredProducts,
//                 loading,
//                 setLoading,
//                 loadMoreProducts,
//                 hasMoreProducts
//             }}
//         >
//             {children}
//         </SearchContext.Provider>
//     );
// }
