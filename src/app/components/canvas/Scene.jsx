'use client';

import { StrictMode, useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from '../../experience/Experience';
import { LevaPane } from '../../experience/common';
import * as THREE from 'three';

const Scene = () => {
  const [bgColor, setBgColor] = useState('#ffffff');
  const targetColor = useRef(new THREE.Color('#ffffff'));
  const currentColor = useRef(new THREE.Color('#ffffff'));
  const isTransitioning = useRef(false);
  const transitionProgress = useRef(0);
  const transitionDuration = 5;
  
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleColorChange = (event) => {
      targetColor.current = new THREE.Color(event.detail.color);
      isTransitioning.current = true;
      transitionProgress.current = 0;
    };

    window.addEventListener('colorChange', handleColorChange);
    
    return () => {
      window.removeEventListener('colorChange', handleColorChange);
    };
  }, []);

  const created = ({ gl, scene }) => {
    canvasRef.current = gl;
    gl.setClearColor(bgColor, 1);
    
    const animate = () => {
      if (isTransitioning.current) {
        transitionProgress.current += 0.016 / transitionDuration;
        
        if (transitionProgress.current >= 1) {
          isTransitioning.current = false;
          transitionProgress.current = 1;
          currentColor.current.copy(targetColor.current);
        }
        
        const t = transitionProgress.current;
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        
        const interpolatedColor = new THREE.Color().copy(currentColor.current)
          .lerp(targetColor.current, ease);
        
        canvasRef.current.setClearColor(interpolatedColor.getStyle(), 1);
        
        if (transitionProgress.current === 1) {
          setBgColor(targetColor.current.getStyle());
        }
      }
      
      requestAnimationFrame(animate);
    };
    
    animate();
  };

  return (
    <div className="relative h-screen">
      <StrictMode>
        <Canvas
          camera={{
            fov: 45,
            near: 0.1,
            far: 100,
            position: [0, 0, 6],
          }}
          onCreated={created}
        >
          <Experience />
        </Canvas>
      </StrictMode>
    </div>
  );
};

export default Scene;
