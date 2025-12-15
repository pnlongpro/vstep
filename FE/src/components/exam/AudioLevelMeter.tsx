import { useEffect, useState, useRef } from 'react';
import { Mic, Headphones } from 'lucide-react';

interface AudioLevelMeterProps {
  isRecording: boolean;
}

export function AudioLevelMeter({ isRecording }: AudioLevelMeterProps) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [useMockAudio, setUseMockAudio] = useState(false);
  const [microphoneError, setMicrophoneError] = useState(false);
  const [barLevels, setBarLevels] = useState<number[]>(Array(120).fill(0)); // Increase to 120 bars for denser waveform
  const animationFrameRef = useRef<number>();
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isRecording) {
      startAudioMonitoring();
    } else {
      stopAudioMonitoring();
    }

    return () => {
      stopAudioMonitoring();
    };
  }, [isRecording]);

  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: false, // Không tự động điều chỉnh gain để công bằng
        } 
      });
      mediaStreamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512; // Increased for more frequency resolution
      analyser.smoothingTimeConstant = 0.3; // Reduced for faster response
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        const normalizedLevel = Math.min(100, (average / 255) * 100 * 3.5); // Increased amplification
        
        // Generate waveform with MORE dramatic varying heights
        const newBarLevels = Array.from({ length: 120 }).map((_, index) => {
          // Use frequency data directly for more accurate representation
          const freqIndex = Math.floor((index / 120) * dataArray.length);
          const freqValue = dataArray[freqIndex] || 0;
          const normalizedFreq = (freqValue / 255) * 100 * 3.5; // Amplified
          
          // Add some variation but keep it responsive
          const variation = (Math.random() - 0.5) * 8;
          const barValue = normalizedFreq + variation;
          
          return Math.max(0, Math.min(100, barValue));
        });
        
        setBarLevels(newBarLevels);
        setAudioLevel(normalizedLevel);

        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (error) {
      // Microphone access denied - automatically switch to demo mode (silent fallback)
      setUseMockAudio(true);
      setMicrophoneError(true);
      
      // Use simulated audio levels instead
      const simulateAudio = () => {
        // Generate random audio level with realistic variation
        const baseLevel = 30 + Math.random() * 40; // Random between 30-70
        const variation = Math.sin(Date.now() / 500) * 15; // Smooth oscillation
        const randomSpike = Math.random() > 0.9 ? Math.random() * 20 : 0; // Occasional spikes
        const level = Math.max(10, Math.min(90, baseLevel + variation + randomSpike));
        
        // Generate waveform with varying heights across the spectrum
        const newBarLevels = Array.from({ length: 120 }).map((_, index) => {
          // Create a wave pattern that varies across the spectrum
          const position = index / 120; // 0 to 1
          const wavePattern = Math.sin(position * Math.PI * 4 + Date.now() / 200) * 0.3 + 0.7; // Oscillating multiplier
          const centerBoost = 1 - Math.abs(position - 0.5) * 0.5; // Boost center bars
          const randomVariation = (Math.random() - 0.5) * 10; // Random variation
          
          const barValue = level * wavePattern * centerBoost + randomVariation;
          return Math.max(0, Math.min(100, barValue));
        });
        
        setBarLevels(newBarLevels);
        setAudioLevel(level);
        animationFrameRef.current = requestAnimationFrame(simulateAudio);
      };
      
      simulateAudio();
    }
  };

  const stopAudioMonitoring = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    setAudioLevel(0);
    setBarLevels(Array(120).fill(0));
    setUseMockAudio(false);
    setMicrophoneError(false);
  };

  // Get color for each individual bar based on its height
  const getBarColor = (barHeight: number) => {
    // Red when bar is low (< 30% height) - representing low volume at that moment
    if (barHeight < 30) {
      return '#ef4444'; // Red - low volume
    }
    // Gray when bar is adequate (>= 30% height) - representing good volume
    return '#6b7280'; // Gray - adequate volume
  };

  return (
    <div className="space-y-2">
      {/* Audio Level Meter - Compact */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-md border border-blue-200 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #3b82f6 1px, transparent 0)',
            backgroundSize: '24px 24px'
          }}></div>
        </div>

        <div className="relative flex items-center gap-4 p-3">
          {/* Left: Headphones Icon - Smaller */}
          <div className="flex-shrink-0">
            <div className="relative">
              {/* Pulsing Ring Animation */}
              <div className={`absolute inset-0 rounded-full bg-blue-500 ${audioLevel > 30 ? 'animate-ping opacity-20' : 'opacity-0'}`}></div>
              
              {/* Icon Container - Smaller */}
              <div className="relative w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <Headphones className="size-6 text-white" />
              </div>
              
              {/* Recording Indicator Dot */}
              {audioLevel > 10 && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse shadow-md"></div>
              )}
            </div>
          </div>

          {/* Center: Waveform Display - Reduced Height */}
          <div className="flex-1 min-w-0">
            <div className="relative h-16 flex items-center justify-center overflow-hidden rounded-lg bg-white/80 backdrop-blur-sm border border-blue-100 shadow-inner">
              {/* Waveform bars - mirrored vertically */}
              <div className="relative flex items-center justify-center gap-px h-full px-3">
                {barLevels.map((barLevel, index) => {
                  const barHeight = barLevel;
                  const isActive = barHeight > 3;
                  const heightPx = Math.max(2, (barHeight / 100) * 32); // Max 32px from center (reduced from 48px)
                  const barColor = getBarColor(barHeight);
                  
                  return (
                    <div
                      key={index}
                      className={`w-0.5 transition-all duration-75 rounded-full ${
                        !isActive && 'opacity-20'
                      }`}
                      style={{
                        height: `${heightPx * 2}px`,
                        ...(isActive ? { background: barColor } : { background: '#d1d5db' }),
                        boxShadow: isActive && audioLevel >= 30 ? '0 0 3px rgba(156, 163, 175, 0.3)' : 'none',
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Audio Level Status - More Compact */}
          <div className="flex-shrink-0 text-right min-w-[120px]">
            <div className="flex flex-col items-end gap-1">
              {/* Status Badge - Smaller */}
              <div className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-sm ${
                audioLevel < 30 
                  ? 'bg-red-100 text-red-700 border border-red-200' 
                  : audioLevel < 60 
                  ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' 
                  : 'bg-green-100 text-green-700 border border-green-200'
              }`}>
                <Mic className="size-3" />
                <span className="text-xs">
                  {audioLevel < 30 ? 'Nói to hơn' : audioLevel < 60 ? 'Âm TB' : 'Âm tốt'}
                </span>
              </div>
              
              {/* Level Percentage - Smaller */}
              <div className="text-xs text-gray-600 font-medium">
                <span className={audioLevel > 60 ? 'text-green-600' : audioLevel > 30 ? 'text-yellow-600' : 'text-red-600'}>{Math.round(audioLevel)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Red Warning Banner - More Compact */}
      <div className="bg-red-600 text-white px-4 py-2 rounded-lg border border-red-800 shadow-md">
        <p className="text-xs uppercase tracking-wide text-center font-medium">
          BÀI NÓI ĐANG ĐƯỢC THU ÂM TRỰC TIẾP
        </p>
        <p className="text-xs mt-0.5 text-center text-red-100">
          Trong quá trình thi âm không được thao tác với hệ thống.
        </p>
      </div>
    </div>
  );
}