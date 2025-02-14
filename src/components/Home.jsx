import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/styles.css";

function Home() {
  const images = [
    "/study1.jpg",
    // "/study2.jpg",
    "/study3.jpg",
    "/study4.jpg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate(); // For navigation to login page

  const quotes = [
    "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.",
    "The way to get started is to quit talking and begin doing.",
    "Don't let what you cannot do interfere with what you can do.",
    "Hardships often prepare ordinary people for an extraordinary destiny.",
    "Stay committed to your goals and keep pushing forward."
  ];

  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slideshow image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 4000); // Change quote every 4 seconds

    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <div className="landing-page">
      {/* Menu Bar
      <nav className="navbar">
        <h1 className="logo">Study Buddy</h1>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/signup">Sign Up</a></li>
        </ul>
      </nav> */}

      {/* Slideshow Section */}
      <div className="slideshow">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? "active" : ""}`}
          >
            <img src={image} alt={`Slide ${index + 1}`} />
          </div>
        ))}
      </div>

      {/* Study Buddy Name and Start Button */}
      <div className="home-content">
        <h1 className="website-name">Study Buddy</h1>
        <button className="start-button" onClick={() => navigate("/login")}>
          Start
        </button>
      </div>

      {/* Motivational Quotes Section */}
      <div className="quotes-section">
        <h2>Motivational Quote</h2>
        <p className="quote-text">{quotes[quoteIndex]}</p>
      </div>

      {/* Motivational Image Section (2 rows, 3 columns) */}
      <div className="quote-images">
        <img src="/quote1.jpg" alt="Motivation 1" />
        <img src="/quote2.jpg" alt="Motivation 2" />
        <img src="/quote3.jpg" alt="Motivation 3" />
        <img src="/quote4.jpg" alt="Motivation 4" />
        <img src="/quote5.jpg" alt="Motivation 5" />
        <img src="/quote6.jpg" alt="Motivation 6" />
      </div>
    </div>
  );
}

export default Home;
