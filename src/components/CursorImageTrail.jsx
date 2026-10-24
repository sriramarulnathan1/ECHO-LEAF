import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

const DEFAULT_URLS = [
  '/images/hackathon-neon-workspace.jpg',
  '/images/hackathon-team-coding.jpg',
  '/images/hackathon-synthwave.jpg',
  '/images/hackathon-night-team.jpg',
  '/images/hackathon-collaboration.jpg',
  '/images/hackathon-purple-team.jpg',
];

const TRANSITION = { type: 'spring', stiffness: 300, damping: 30 };
const srcOf = image => (typeof image === 'string' ? image : image?.src || '');

export default function CursorImageTrail({
  images = DEFAULT_URLS,
  imageWidth = 150,
  imageHeight = 200,
  radius = 8,
  fit = 'cover',
  position = 'center',
  frequency = 35,
  visibleFor = 1.2,
  showLabel = false,
  labelText = 'Hover Me',
  labelColor = '#ffffff',
  labelFont = {
    fontFamily: 'Inter, sans-serif',
    fontWeight: 400,
    fontSize: 60,
    lineHeight: '1.5em',
    letterSpacing: '0em',
    textAlign: 'left',
  },
  className = '',
  style,
  ...rest
}) {
  const urls = useMemo(() => {
    const list = (images || []).map(srcOf).filter(Boolean);
    return list.length ? list : DEFAULT_URLS;
  }, [images]);
  const threshold = 200 - ((frequency - 1) * 199) / 49;
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeImages, setActiveImages] = useState([]);
  const activeImagesRef = React.useRef([]);
  const timersRef = React.useRef(new Set());

  useEffect(() => {
    activeImagesRef.current = activeImages;
  }, [activeImages]);

  useEffect(() => () => {
    timersRef.current.forEach(timer => window.clearTimeout(timer));
  }, []);

  const handleMouseMove = event => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMousePos({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    setIsHovering(true);
  };

  useEffect(() => {
    if (!isHovering || urls.length === 0) return undefined;
    const lastImage = activeImagesRef.current[activeImagesRef.current.length - 1];
    const distance = lastImage
      ? Math.hypot(mousePos.x - lastImage.x, mousePos.y - lastImage.y)
      : Infinity;
    if (distance <= threshold) return undefined;

    const newImage = {
      id: `${Date.now()}-${Math.random()}`,
      position: currentImageIndex,
      x: mousePos.x,
      y: mousePos.y,
      state: 'entering',
    };
    setActiveImages(previous => {
      const next = [...previous, newImage];
      activeImagesRef.current = next;
      return next;
    });
    setCurrentImageIndex(previous => (previous + 1) % urls.length);

    const exitTimer = window.setTimeout(() => {
      timersRef.current.delete(exitTimer);
      setActiveImages(previous => previous.map(image =>
        image.id === newImage.id ? { ...image, state: 'exiting' } : image,
      ));
    }, visibleFor * 1000);
    const removeTimer = window.setTimeout(() => {
      timersRef.current.delete(removeTimer);
      setActiveImages(previous => previous.filter(image => image.id !== newImage.id));
    }, visibleFor * 1000 + 2000);
    timersRef.current.add(exitTimer);
    timersRef.current.add(removeTimer);
  }, [mousePos, isHovering, urls, threshold, currentImageIndex, visibleFor]);

  return (
    <div
      {...rest}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{ position: 'relative', overflow: 'hidden', width: 600, height: 600, ...style }}
    >
      {showLabel && (
        <div
          style={{
            position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', color: labelColor,
            ...labelFont,
          }}
        >
          {labelText}
        </div>
      )}
      {activeImages.map(({ id, position: slot, x, y, state }) => (
        <motion.div
          key={id}
          initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)', x: x - imageWidth / 2, y: y - imageHeight / 2 }}
          animate={{
            opacity: state === 'entering' ? 1 : 0,
            scale: state === 'entering' ? 1 : 0.5,
            filter: state === 'entering' ? 'blur(0px)' : 'blur(10px)',
            x: x - imageWidth / 2,
            y: y - imageHeight / 2,
          }}
          transition={TRANSITION}
          style={{
            position: 'absolute', width: imageWidth, height: imageHeight,
            backgroundImage: `url(${urls[slot]})`, backgroundSize: fit,
            backgroundPosition: fit === 'cover' ? `center ${position}` : 'center',
            backgroundRepeat: 'no-repeat', borderRadius: radius, pointerEvents: 'none',
          }}
        />
      ))}
    </div>
  );
}
