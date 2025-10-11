import React from 'react';
import './Quote.css';
import quoteStart from '../assets/“.png';
// import box from '../assets/Rectangle 26.png'


const Quote = () => {
  return (
    <div className="quote-container">
      <div className="quote-box">
        <img src={quoteStart} alt="start quote" className="quote-mark-start" />
        <p className="quote-text">
          With great power comes great electricity bill
        </p>
        <img src={quoteStart} alt="end quote" className="quote-mark-end" />
      </div>
      <div className="quote-author">
        <span className="author-text">- Dr. Who</span>
      </div>
      {/* <div className="box">
        <img src={box} alt="" />
      </div> */}
    </div>
  );
};

export default Quote;
