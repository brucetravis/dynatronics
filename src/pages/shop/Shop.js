import React, { useEffect } from 'react'
import './Shop.css'
import CategoryCards from '../../components/cards/categorycards/CategoryCards'
import { useNavigate } from 'react-router-dom'
import { useSearch } from '../../contexts/SearchProvider'


export default function Shop() {

  const { filteredProducts, 
          loading, 
          loadMoreProducts, 
          hasMoreProducts } = useSearch()

  // Initialize useNavigate in order to naviage to a page displaying all the product details
  const navigate = useNavigate()

  // function to handle the Click of each card in order to display all the information about each product
  const handleClick = (productId) => {
    navigate(`/productdetails/${productId}`)
  }
  
  // use useEffect to scroll to the top o the page onMount
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  return (
    <div className='shop-page '>
      <div className=''>
        <CategoryCards />
      </div>

      <div className='products-section'>
        {loading ? (
          <div className='shop-loading'>
            Fetching Products........
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className='product-card'
            >
              <img 
                src={product.imageUrl}
                alt="Product pic"
                className='product-image'
                onClick={()=> handleClick(product.id)}
              />

              <div className='product-info'>
                <h3 className='product-title'>{product.name}</h3>
                <p className='product-price'>
                  <span className='fs-5'>Ksh</span> {Number(product.price).toLocaleString()} 
                </p>
                {/* <p className='product-quantity'>
                  {product.quantity} Left
                </p> */}
              </div>

              {/* <button 
                className='add-to-cart-button'
                onClick={() => fetchCartProduct(product.id)} // call the function when clicked
              >
                Add to cart 
              </button> */}
            </div>
          ))
          )}
      </div>

      {/* Load More Button */}
      {!loading && hasMoreProducts && (
        <div className='load-more-container'>
          <button className='load-more-button' onClick={loadMoreProducts}>
            Load More
          </button>
        </div>
      )}

      {/* Optional loading indicator for loading next page */}
      {loading && filteredProducts.length > 0 && (
        <div className='shop-loading'>Loading more products...</div>
      )}
    </div>
  )
}
