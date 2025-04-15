import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Quote {
  text: string;
  author: string;
}

const quotes: Quote[] = [
  {
    text: "Your mind is a powerful thing. When you fill it with positive thoughts, your life will start to change.",
    author: "Unknown"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "In the midst of winter, I found there was, within me, an invincible summer.",
    author: "Albert Camus"
  },
  {
    text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela"
  },
  {
    text: "Your present circumstances don't determine where you can go; they merely determine where you start.",
    author: "Nido Qubein"
  },
  {
    text: "You are never too old to set another goal or to dream a new dream.",
    author: "C.S. Lewis"
  },
  {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  },
  {
    text: "Peace is the result of retraining your mind to process life as it is, rather than as you think it should be.",
    author: "Wayne W. Dyer"
  },
  {
    text: "Nothing is impossible. The word itself says 'I'm possible!'",
    author: "Audrey Hepburn"
  },
  {
    text: "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it.",
    author: "Rumi"
  },
];

interface QuoteDisplayProps {
  autoChange?: boolean;
  interval?: number;
}

const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ 
  autoChange = true,
  interval = 10000 
}) => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState<number>(
    Math.floor(Math.random() * quotes.length)
  );
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    if (!autoChange) return;

    const intervalId = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentQuoteIndex(prevIndex => {
          const newIndex = Math.floor(Math.random() * quotes.length);
          return newIndex !== prevIndex ? newIndex : (prevIndex + 1) % quotes.length;
        });
        setIsVisible(true);
      }, 500); // Wait for exit animation to complete
      
    }, interval);

    return () => clearInterval(intervalId);
  }, [autoChange, interval]);

  const handleNextQuote = () => {
    setIsVisible(false);
    setTimeout(() => {
      setCurrentQuoteIndex(prevIndex => (prevIndex + 1) % quotes.length);
      setIsVisible(true);
    }, 500);
  };

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="w-full card overflow-hidden">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center">
        <span>Quote of the Day</span>
        <button 
          onClick={handleNextQuote}
          className="ml-auto p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                   hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Next quote"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
          </svg>
        </button>
      </h2>
      
      <div className="h-32 relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.div
              key={currentQuoteIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-gray-800 dark:text-gray-200 mb-2 text-lg italic">
                "{currentQuote.text}"
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                — {currentQuote.author}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuoteDisplay; 