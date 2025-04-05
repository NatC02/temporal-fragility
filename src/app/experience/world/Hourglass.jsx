import { MeshTransmissionMaterial, Text, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

const colorPalette = [
  '#ffffff',
  '#FFFF00',
];

let currentColorIndex = 0;

const Hourglass = () => {
  const hourglassGroup = useRef();
  const meshRefs = useRef({});
  const [isMoving, setIsMoving] = useState(false);
  const [textColor, setTextColor] = useState(colorPalette[currentColorIndex]);
  
  const currentTextColor = useRef(new THREE.Color(colorPalette[currentColorIndex]));
  const targetTextColor = useRef(new THREE.Color(colorPalette[currentColorIndex]));
  const colorTransitionProgress = useRef(1);
  
  const { nodes } = useGLTF('/hourglass.glb');
  const { viewport, size } = useThree();
  const mouse = useRef(new THREE.Vector2());

  const textProps = {
    color: textColor
  };
  
  const materialProps = {
    chromaticAberration: 0.53,
    transmission: 1,
    thickness: 0.45,
    roughness: 0.16,
    ior: 1.5,
    anisotropicBlur: 0.1,
    distortion: 0.64,
    distortionScale: 0.5,
    temporalDistortion: 0.26,
    backside: false
  };
  
  const rotation = {
    x: 0,
    y: Math.PI/2,
    z: 0,
    lockRotation: false
  };

  useEffect(() => {
    if (hourglassGroup.current) {
      hourglassGroup.current.rotation.x = rotation.x;
      hourglassGroup.current.rotation.y = rotation.y;
      hourglassGroup.current.rotation.z = rotation.z;
    }
  }, []);

  const handleClick = () => {
    currentColorIndex = (currentColorIndex + 1) % colorPalette.length;
    const newColor = colorPalette[currentColorIndex];
    
    currentTextColor.current = new THREE.Color(textColor);
    targetTextColor.current = new THREE.Color(newColor);
    colorTransitionProgress.current = 0;
    
    window.dispatchEvent(new CustomEvent('colorChange', { 
      detail: { color: newColor } 
    }));
  };

  useFrame((state, delta) => {
    if (hourglassGroup.current && !rotation.lockRotation) {
      hourglassGroup.current.rotation.y -= delta * 0.8;
    }
    
    if (colorTransitionProgress.current < 1) {
      colorTransitionProgress.current += delta / 1.5;
      
      if (colorTransitionProgress.current >= 1) {
        colorTransitionProgress.current = 1;
      }
      
      const t = colorTransitionProgress.current;
      const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      
      const interpolatedColor = new THREE.Color().copy(currentTextColor.current)
        .lerp(targetTextColor.current, ease);
      
      setTextColor(interpolatedColor.getStyle());
    }
  });

  useEffect(() => {
    Object.values(meshRefs.current).forEach(mesh => {
      if (mesh && mesh.material) {
        mesh.material.side = materialProps.backside
          ? THREE.DoubleSide
          : THREE.FrontSide;
        mesh.material.needsUpdate = true;
      }
    });
  }, []);

  useEffect(() => {
    console.log('Available nodes in the GLB:', nodes);
  }, [nodes]);
  
  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / size.width) * 2 - 1;
      const y = -(event.clientY / size.height) * 2 + 1;
      
      mouse.current.set(x, y);
      
      if (!isMoving) {
        setIsMoving(true);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [size, isMoving]);

  return (
    <>
      <group scale={viewport.width / 2} position={[0, -0.2, 0]}>
        <Text
          font="fonts/Staatliches-Regular.ttf"
          fontSize={0.5}
          position={[0, 0, -0.4]}
          anchorX="center"
          anchorY="middle"
          {...textProps}
        >
          Fragile
        </Text>
        <group 
          ref={hourglassGroup} 
          scale={0.0082} 
          position={[0, -.31, 0]}
          onClick={handleClick}
        >
          {Object.keys(nodes).map(nodeName => {
            if (!nodes[nodeName].geometry) return null;
            
            return (
              <mesh
                key={nodeName}
                ref={ref => {
                  meshRefs.current[nodeName] = ref;
                }}
                geometry={nodes[nodeName].geometry}
              >
                <MeshTransmissionMaterial 
                  {...materialProps} 
                />
              </mesh>
            );
          })}
        </group>
      </group>
    </>
  );
};

export default Hourglass;

useGLTF.preload('/hourglass.glb');
