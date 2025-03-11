
import React, { useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import AnimatedText from '../common/AnimatedText';
import Button from '../ui/Button';

const Hero = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Tanzania map outline - simplified for animation purposes
    const mapPoints = [
      [0.3, 0.3], [0.4, 0.2], [0.5, 0.25], [0.6, 0.2], 
      [0.7, 0.3], [0.75, 0.35], [0.7, 0.5], [0.75, 0.6], 
      [0.7, 0.7], [0.6, 0.75], [0.4, 0.7], [0.3, 0.6],
      [0.25, 0.5], [0.3, 0.3]
    ];

    // Nodes for network effect
    let nodes: { x: number; y: number; dx: number; dy: number; connections: number[] }[] = [];
    const nodeCount = 20;
    
    // Initialize nodes
    for (let i = 0; i < nodeCount; i++) {
      // Random position within the map boundaries
      const mapIndex = Math.floor(Math.random() * mapPoints.length);
      const [baseX, baseY] = mapPoints[mapIndex];
      
      // Add some variation within the map segment
      const x = (baseX + (Math.random() - 0.5) * 0.1) * canvas.width;
      const y = (baseY + (Math.random() - 0.5) * 0.1) * canvas.height;
      
      nodes.push({
        x,
        y,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        connections: []
      });
    }

    // Create connections between nodes
    nodes.forEach((node, i) => {
      // Each node connects to 2-4 closest nodes
      const connectionCount = 2 + Math.floor(Math.random() * 3);
      
      // Calculate distances to all other nodes
      const distances = nodes.map((otherNode, j) => {
        if (i === j) return { index: j, distance: Infinity };
        const dx = node.x - otherNode.x;
        const dy = node.y - otherNode.y;
        return { index: j, distance: Math.sqrt(dx * dx + dy * dy) };
      });
      
      // Sort by distance and take the closest
      distances.sort((a, b) => {
        const distA = typeof a === 'number' ? Infinity : a.distance;
        const distB = typeof b === 'number' ? Infinity : b.distance;
        return distA - distB;
      });
      
      // Store the indices of the closest nodes
      for (let c = 0; c < connectionCount && c < distances.length; c++) {
        const distanceObj = distances[c];
        if (typeof distanceObj !== 'number') {
          node.connections.push(distanceObj.index);
        }
      }
    });

    let animationProgress = 0;
    let lastTimestamp = 0;
    const animationDuration = 2000; // ms

    // Define drawMap function BEFORE it's used in handleResize
    const drawMap = () => {
      if (!ctx || !canvas) return;
      
      // Draw map outline
      ctx.beginPath();
      mapPoints.forEach(([x, y], i) => {
        const canvasX = x * canvas.width;
        const canvasY = y * canvas.height;
        if (i === 0) {
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
        }
      });
      ctx.closePath();
      ctx.strokeStyle = `rgba(69, 127, 255, ${0.1 + animationProgress * 0.6})`;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Fill with gradient based on animation progress
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, `rgba(69, 127, 255, ${0.05 * animationProgress})`);
      gradient.addColorStop(1, `rgba(176, 137, 255, ${0.08 * animationProgress})`);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw nodes and connections
      nodes.forEach((node, i) => {
        // Update node position with small movement
        node.x += node.dx;
        node.y += node.dy;
        
        // Bounce off edges of map area
        if (node.x < canvas.width * 0.25 || node.x > canvas.width * 0.75) {
          node.dx = -node.dx;
        }
        if (node.y < canvas.height * 0.2 || node.y > canvas.height * 0.75) {
          node.dy = -node.dy;
        }
        
        // Draw connections
        node.connections.forEach(connIndex => {
          const connNode = nodes[connIndex];
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connNode.x, connNode.y);
          ctx.strokeStyle = `rgba(69, 127, 255, ${0.1 * animationProgress})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });
        
        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(69, 127, 255, ${0.4 + 0.6 * animationProgress})`;
        ctx.fill();
      });
    };

    // Set canvas dimensions
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Clear and redraw when window is resized
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawMap();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Animation function
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;
      
      // Update animation progress
      if (animationProgress < 1) {
        animationProgress += elapsed / animationDuration;
        if (animationProgress > 1) animationProgress = 1;
      }
      
      lastTimestamp = timestamp;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw map and nodes
      drawMap();
      
      // Request next frame
      requestAnimationFrame(animate);
    };

    // Start animation
    requestAnimationFrame(animate);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="blur-circle w-[500px] h-[500px] bg-blue-400/20 absolute left-[-250px] top-1/4"></div>
      <div className="blur-circle w-[600px] h-[600px] bg-purple-400/15 absolute right-[-300px] bottom-1/4"></div>
      
      {/* Canvas for Tanzania map animation */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full z-0"
      ></canvas>

      <div className="container relative z-10 px-4 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <span className="inline-block py-1 px-3 mb-6 bg-primary/10 text-primary text-sm font-medium rounded-full">
              Developer • Entrepreneur • Visionary
            </span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-4">
            <AnimatedText 
              text="Kennedy Mtega:"
              className="block"
              delay={500}
            />
            <AnimatedText 
              text="Weaving the Future of Tanzania,"
              className="block text-primary mt-2"
              delay={1500}
            />
            <AnimatedText 
              text="Thread by Thread."
              className="block"
              delay={2500}
            />
          </h1>
          
          <p className="mt-4 md:mt-6 text-base md:text-lg lg:text-xl text-foreground/80 max-w-2xl mx-auto animate-fade-in">
            Building systems that empower and connect communities across Tanzania through innovative technology solutions.
          </p>
          
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <Button 
              to="/projects" 
              size="lg"
              icon={<ArrowRight />}
            >
              Embark on the Journey
            </Button>
            <Button 
              to="/contact" 
              size="lg"
              variant="outline"
            >
              Let's Connect
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-pulse-slow">
        <span className="text-sm text-foreground/60 mb-2">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-foreground/60 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
