import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import AnimatedText from '../common/AnimatedText';

const HERO_PHRASES = [
  'Weaving the Future of Tanzania,',
  'Empowering Communities with Code,',
  'Innovating for Social Impact,',
  'Building Digital Bridges,',
  'Transforming Ideas into Solutions,',
  'Championing Tech for Good,',
];

// Hero section component with animated text and main call-to-action
const Hero = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [animated, setAnimated] = useState(true);
  const scrollTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.75;
        
        if (isVisible) {
          section.classList.add('animate');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Rotating animated text
  useEffect(() => {
    if (!animated) return;
    const timeout = setTimeout(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
    }, HERO_PHRASES[phraseIndex].length * 40 + 1200);
    return () => clearTimeout(timeout);
  }, [phraseIndex, animated]);

  // Scroll arrow click handler
  const handleScrollArrowClick = () => {
    const nextSection = document.getElementById('vision-section');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div 
          className="absolute top-1/3 left-1/2 transform -translate-x-1/2 w-[140%] aspect-[1.5/1] -z-10"
          style={{
            background: 'radial-gradient(50% 50% at 50% 50%, rgba(99, 102, 241, 0.05) 0%, rgba(99, 102, 241, 0) 100%)',
          }}
        />
        
        <svg 
          className="absolute bottom-0 left-0 right-0 w-full max-w-7xl mx-auto max-h-[70vh] opacity-20 text-primary/30"
          viewBox="0 0 700 500" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ 
            stroke: 'currentColor',
            strokeWidth: 1,
            strokeDasharray: 5,
            strokeLinecap: 'round',
            strokeLinejoin: 'round'
          }}
        >
          <path d="M181.828 26.9552C157.103 33.9929 128.983 48.1049 116.903 62.8383C104.823 77.5717 87.1613 93.9554 78.9874 99.3529C70.8136 104.75 52.9521 116.334 39.5215 125.1L15 141.108L17.9693 145.841C19.6073 148.445 25.4687 156.401 30.9979 162.756C36.5271 169.112 49.6275 186.854 60.6582 202.566C71.6889 218.277 85.1695 236.19 91.1589 242.756C97.1484 249.321 109.088 263.887 117.634 274.942C126.179 285.996 137.048 299.276 141.733 304.193C146.419 309.11 150.771 313.672 151.407 314.442C152.044 315.212 163.075 328.996 175.906 345.212C188.737 361.429 203.759 380.442 209.198 387.584C214.637 394.726 223.493 406.039 228.832 412.814C234.171 419.59 244.131 432.345 250.86 441.244C257.589 450.143 262.698 457.539 262.698 457.936C262.698 458.333 283.732 458.66 309.399 458.66C335.067 458.66 356.1 458.334 356.1 457.938C356.1 457.543 352.491 452.678 348.076 447.021C343.662 441.364 336.179 431.729 331.771 425.684C327.363 419.639 319.879 410.004 315.464 404.347C311.05 398.69 306.347 392.582 305.326 391.2C304.306 389.817 299.278 383.253 294.473 377.067C289.668 370.881 285.03 364.76 284.483 363.913C283.936 363.066 277.183 354.294 269.48 344.553C261.778 334.813 251.001 321.304 245.731 314.699C240.46 308.095 229.433 294.271 221.429 284.152C213.425 274.033 205.721 264.325 204.61 262.392C203.499 260.458 189.938 243.599 174.592 224.895C159.246 206.191 142.788 186.142 138.093 180.334C133.397 174.527 129.529 169.394 129.347 168.903C129.164 168.412 130.866 166.376 133.129 164.381C136.828 161.068 146.2 158.829 211.766 146.55C245.073 140.273 288.677 131.886 307.919 128.012C345.562 120.402 350.536 119.278 363.5 114.261C382.17 107.101 386.767 104.326 395.445 94.1383C405.599 82.3058 406.036 81.5611 396.974 88.6862C387.036 96.5435 358.376 107.166 329.337 112.861C320.11 114.572 277.746 124.181 235.872 134.003C193.998 143.825 159.269 152.16 159.271 152.381C159.274 152.602 166.257 161.114 174.822 171.312C183.386 181.51 199.112 200.712 208.795 212.583C218.479 224.454 235.542 245.297 245.737 257.456C255.932 269.614 268.692 285.233 273.306 290.882C277.921 296.532 290.681 312.151 300.876 324.31C311.071 336.468 323.498 351.692 327.719 356.861C331.94 362.031 337.979 369.426 341.178 373.407C347.486 381.161 368.261 407.28 370.585 410.161C371.473 411.254 380.469 422.485 390.481 434.969C400.493 447.453 409.825 458.333 411.11 458.981C414.153 460.522 514.141 460.541 517.139 459.001C518.41 458.35 527.57 446.974 537.343 433.767C547.117 420.56 557.578 407.342 560.428 404.341C563.278 401.34 584.173 377.347 606.534 351.507C628.895 325.667 651.073 300.12 655.437 295.289C683.514 264.067 699.568 247.069 698.734 246.29C698.316 245.897 674.837 246.048 646.718 246.624L595.421 247.673L595.417 249.857C595.415 251.06 595.17 261.177 594.87 272.277C594.569 283.377 593.784 308.19 593.129 326.33C592.475 344.47 591.55 373.677 591.079 390.33C590.608 406.983 590.05 428.41 589.843 436.66C589.636 444.91 589.161 455.923 588.792 461.33C588.423 466.737 588.255 471.324 588.421 471.49C588.587 471.656 594.687 471.717 601.914 471.628L615.18 471.465L617.045 468.83C618.071 467.38 622.25 462.15 626.071 457.33C629.892 452.51 639 441.377 646.5 432.21C654 423.043 667.025 407.377 675.5 397.21C683.975 387.043 700.78 366.803 712.679 351.21C724.577 335.617 741.515 315.213 750.154 304.841C758.794 294.469 768.982 282.294 772.92 277.841C776.859 273.388 780 269.148 780 268.427C780 267.707 778.875 266.33 777.5 265.33C776.125 264.33 762.1 252.903 746.5 240.21C730.9 227.517 716.875 216.18 715.5 215.293C714.125 214.407 704.225 206.577 693.5 197.952C682.775 189.327 659.575 171.01 642 157.137C624.425 143.263 603.325 126.57 595 119.834C586.675 113.097 570.425 100.077 559 90.773C547.575 81.469 538 73.784 538 73.532C538 73.28 539.913 72.81 542.25 72.482C544.588 72.153 552.85 70.703 560.5 69.253C568.15 67.802 577.375 66.033 580.941 65.319C584.506 64.605 588.031 63.676 588.691 63.257C589.352 62.838 588.254 61.057 586.245 59.386C580.75 54.775 575.389 54.423 532.5 55.461C508.8 56.024 491.713 56.024 480.75 55.462C459.394 54.357 442.752 54.553 428.5 56.099C423.15 56.654 415.05 57.553 411 58.098C406.95 58.643 400.275 59.564 396.75 60.146C393.225 60.728 386.1 61.923 381.5 62.796C366.438 65.477 361.389 66.423 349.5 69.429C336.627 72.694 291.855 87.134 277 92.958C270.975 95.271 261.075 99.146 255 101.43C248.925 103.713 232.575 110.433 219 116.211C205.425 121.989 191.325 127.77 188 128.924C184.675 130.078 181.15 131.423 180 131.932L178 132.859L180.133 133.18C182.791 133.576 194.599 130.886 217.5 124.273C227.6 121.456 249.025 115.903 264.5 112.018C279.975 108.133 298.575 103.285 305 101.309C311.425 99.333 323.975 96.02 333 93.999C342.025 91.979 357.65 87.875 367.5 84.95C389.708 78.551 434.536 66.082 460 59.841C487.519 53.058 507.212 49.33 510.25 49.33C511.488 49.33 512.5 48.992 512.5 48.58C512.5 47.353 505.361 39.9 498.202 34.012C488.327 25.942 475.517 19.07 459.5 13.85C428.433 4.02203 346.207 -7.57354 303.5 5.96562C288.6 10.4556 271.414 15.0372 242.5 21.8311C226.15 25.6095 205.225 30.4094 196 32.3296C186.775 34.2498 182.078 35 181.828 34.3302C181.578 33.6635 180.45 31.2885 179.328 29.1084C178.205 26.9283 177.41 25.2 177.563 25.2C177.716 25.2 179.6 25.9827 181.828 26.9552Z" />
        </svg>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <div className="flex flex-col gap-1 items-center text-xs font-medium text-primary/80 mb-2 animate-on-scroll scale-up">
            <div className="flex gap-1 items-center">
              <span className="bg-primary/10 px-3 py-1 rounded-full">Developer</span>
              <span>·</span>
              <span className="bg-primary/10 px-3 py-1 rounded-full">Entrepreneur</span>
              <span>·</span>
              <span className="bg-primary/10 px-3 py-1 rounded-full">Visionary</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight md:leading-tight lg:leading-tight mb-4 animate-on-scroll slide-up">
            Kennedy Mtega:
            <br />
            <AnimatedText
              text={HERO_PHRASES[phraseIndex]}
              className="text-primary"
              delay={50}
              animated={animated}
              onComplete={() => setAnimated(true)}
            />
            <br />
            <span>Thread by Thread.</span>
          </h1>

          <p className="text-base md:text-lg text-foreground/80 max-w-2xl mx-auto mb-8 animate-on-scroll slide-up delay-100">
            Building systems that empower and connect communities across Tanzania 
            through innovative technology solutions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-on-scroll slide-up delay-200">
            <Button 
              to="/projects" 
              variant="primary"
              icon={<ArrowRight className="ml-1 h-4 w-4" />}
              iconPosition="right"
            >
              Embark on the Journey
            </Button>
            <Button 
              to="/contact" 
              variant="outline"
            >
              Let's Connect
            </Button>
          </div>
        </div>

        <div className="mt-16 md:mt-24 text-center">
          <button
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-background/50 border border-border animate-bounce focus:outline-none"
            aria-label="Scroll to next section"
            onClick={handleScrollArrowClick}
            tabIndex={0}
          >
            <svg width="15" height="8" viewBox="0 0 15 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 1L7.5 7L13.5 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
