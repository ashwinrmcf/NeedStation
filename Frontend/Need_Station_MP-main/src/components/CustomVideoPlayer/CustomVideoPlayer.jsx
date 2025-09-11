import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw } from 'lucide-react';
import styles from './CustomVideoPlayer.module.css';

const CustomVideoPlayer = ({ src, poster, width = "100%", height = "600px" }) => {
  const videoRef = useRef(null);
  const progressRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasEnded, setHasEnded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [hasBeenUnmuted, setHasBeenUnmuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      // Set video muted by default
      video.muted = true;
    };
    const handleEnded = () => {
      setHasEnded(true);
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Intersection Observer for scroll-based auto-play/pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const isVisible = entry.isIntersecting;
        setIsInView(isVisible);
        
        console.log('Video visibility changed:', {
          isVisible,
          userInteracted,
          hasEnded,
          isPlaying,
          intersectionRatio: entry.intersectionRatio
        });
        
        // Auto-play when video comes into view (only if not manually paused)
        if (isVisible && !manuallyPaused && !hasEnded && !isPlaying) {
          console.log('Attempting auto-play...');
          // Respect current mute state - don't change it on scroll
          video.muted = isMuted;
          video.play().then(() => {
            console.log('Auto-play successful, muted:', video.muted);
            setIsPlaying(true);
          }).catch((error) => {
            console.log('Auto-play failed:', error);
          });
        }
        
        // Auto-pause when video goes out of view (only if not manually paused)
        if (!isVisible && isPlaying && !manuallyPaused) {
          console.log('Auto-pausing video (out of view)');
          video.pause();
          setIsPlaying(false);
        }
      },
      {
        threshold: 0.1, // Lower threshold - triggers when 10% visible/invisible
        rootMargin: '-50px' // Negative margin - video must be more centered to stay playing
      }
    );

    observer.observe(video);

    return () => {
      observer.unobserve(video);
    };
  }, [isPlaying, userInteracted, hasEnded]);

  const togglePlay = () => {
    const video = videoRef.current;
    setUserInteracted(true); // Mark that user has manually interacted
    if (isPlaying) {
      video.pause();
      setManuallyPaused(true); // User manually paused
    } else {
      video.play();
      setHasEnded(false); // Reset ended state when playing again
      setManuallyPaused(false); // User manually resumed
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressClick = (e) => {
    const video = videoRef.current;
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    video.currentTime = newTime;
    setCurrentTime(newTime);
    setUserInteracted(true); // Mark user interaction
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    setVolume(newVolume);
    video.volume = newVolume;
    video.muted = newVolume === 0;
    setIsMuted(newVolume === 0);
    setUserInteracted(true);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    setUserInteracted(true);
    if (isMuted) {
      video.muted = false;
      video.volume = volume > 0 ? volume : 0.5;
      setIsMuted(false);
      setHasBeenUnmuted(true); // Mark that user has unmuted at least once
      setManuallyPaused(false); // User unmuted, re-enable auto-scroll behavior
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  const skipTime = (seconds) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className={styles.videoContainer}
      style={{ width, height }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* NeedStation Branding Overlay */}
      <div className={styles.brandingOverlay}>
        <div className={styles.logo}>
          Need<span className={styles.logoHighlight}>Player</span>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}></div>
          <p>Loading NeedStation Video...</p>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        onVolumeChange={() => {
          const video = videoRef.current;
          if (video) {
            setVolume(video.volume);
            setIsMuted(video.muted);
          }
        }}
        playsInline
        preload="metadata"
      />

      {/* Minimal Controls - Instagram Style */}
      <div className={`${styles.controls} ${showControls ? styles.showControls : ''}`}>
        <div className={styles.minimalControls}>
          {/* Play/Pause Button */}
          <button className={styles.playButton} onClick={togglePlay}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>

          {/* Volume Button */}
          <button className={styles.volumeButton} onClick={toggleMute}>
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
        </div>
      </div>

      {/* Center Play Button Overlay */}
      {!isPlaying && !isLoading && !hasEnded && (
        <div className={styles.centerPlayButton} onClick={togglePlay}>
          <div className={styles.playButtonCircle}>
            <Play size={32} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
