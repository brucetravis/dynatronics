import React, { useState } from 'react';
import './CategoryCards.css';
import categoryCardsData from '../../data/categoryCardsData';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryCards() {


  // state to keep track of the current starting Index and reset If we reach the last index
  // Changes when you click Next or Previous.
  const [ showFive, setShowFive ] = useState(0) // Initial state is zero meaning index 1

  // variable containing how many cards we want per page
  const cardsPerPage = 5
  

  // function to handle the nect button when clicked
  const handleNext = () => {

    // If the next set's first index exceeds the length or the array/Or the next set is a range that is not in the array
    if (showFive + cardsPerPage >= categoryCardsData.length ) {
      // Update the state to display the first set since we do not want to exceed the limit
      setShowFive(0)
      // Otherwise
    } else {
      // Just display 5 cards
      setShowFive(showFive + cardsPerPage)
    }
  }


  // function to handle the previous cards
  // const handlePrev = () => {

  //   if (showFive - cardsPerPage >= 0) {
  //     setshowFive(showFive - cardsPerPage)
  //   }
  // }

  const handlePrev = () => {
    if (showFive - cardsPerPage < 0) {
      // Go to the last page
      const remainder = categoryCardsData.length % cardsPerPage;
      const lastPageIndex = remainder === 0 
        ? categoryCardsData.length - cardsPerPage 
        : categoryCardsData.length - remainder;
      setShowFive(lastPageIndex);
    } else {
      setShowFive(showFive - cardsPerPage);
    }
  };
  
  const visibleCards = categoryCardsData.slice(showFive, showFive + cardsPerPage)

  return (
    <section className="category-section">
      {/* Cards */}
      <div className="cards-track" >
        {visibleCards.map(card => (
          <div 
            key={card.id} 
            className={`category-card ${card.class}`}
          >
            {card.text}
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button 
        className="scroll-btn left"  
        onClick={handlePrev}
        // disabled={showFive === 0}
      >
        <ChevronLeft size={20}/>
      </button>
      <button 
        className="scroll-btn right" 
        onClick={handleNext}
        // disabled={showFive + cardsPerPage >= categoryCardsData.length}
      >
        <ChevronRight size={20}/>
      </button>
    </section>
  );
}
