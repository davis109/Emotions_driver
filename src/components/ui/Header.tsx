import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const headerRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  
  useEffect(() => {
    if (!headerRef.current || !titleRef.current || !subtitleRef.current) return;
    
    // Create a timeline for the header animation
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.fromTo(headerRef.current, 
      { y: -50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8 }
    );
    
    tl.fromTo(titleRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.4"
    );
    
    tl.fromTo(subtitleRef.current,
      { y: -10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5 },
      "-=0.3"
    );
    
    // Create neural connection effect for the title
    const letters = titleRef.current.innerText.split('');
    titleRef.current.innerHTML = '';
    
    letters.forEach((letter, index) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.position = 'relative';
      span.style.display = 'inline-block';
      span.className = 'letter';
      titleRef.current?.appendChild(span);
      
      gsap.fromTo(span,
        { opacity: 0, y: Math.random() * 20 - 10 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.1 * index + 0.3,
          delay: 0.8 + (index * 0.04),
          ease: "elastic.out(1, 0.3)"
        }
      );
    });
    
    // Create pulse effect
    const createPulseEffect = () => {
      if (!titleRef.current) return;
      
      const letterElements = titleRef.current.querySelectorAll('.letter');
      const randomLetter = Math.floor(Math.random() * letterElements.length);
      
      gsap.fromTo(letterElements[randomLetter],
        { scale: 1, color: '' },
        { 
          scale: 1.4,
          color: '#0ea5e9', 
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          onComplete: () => {
            gsap.to(letterElements[randomLetter], {
              color: '',
              duration: 0.4
            });
          }
        }
      );
      
      // Schedule next pulse
      setTimeout(createPulseEffect, Math.random() * 2000 + 1000);
    };
    
    // Start pulse effect after initial animation
    setTimeout(createPulseEffect, 2000);
    
  }, []);
  
  return (
    <header 
      ref={headerRef}
      className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 shadow-sm py-4 px-4 sm:px-6 md:px-8 sticky top-0 z-10"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 
            ref={titleRef}
            className="text-2xl font-bold text-primary-600 dark:text-primary-400"
          >
            {title}
          </h1>
          <p 
            ref={subtitleRef}
            className="text-sm text-gray-600 dark:text-gray-400"
          >
            Your personal mental wellness journal
          </p>
        </div>
        
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header; 