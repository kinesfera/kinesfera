import React, { useState, useEffect, useRef } from 'react';
import { Exercise, SessionResult } from '../types';
import { audio } from '../services/audioService';
import confetti from 'canvas-confetti';
import { 
  X, 
  Camera, 
  RotateCcw, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Star, 
  Award,
  AlertTriangle,
  Info
} from 'lucide-react';

interface ExerciseSessionModalProps {
  exercise: Exercise;
  neurodiversityMode: 'standard' | 'TEA' | 'TDAH' | 'down' | 'motor';
  onClose: () => void;
  onFinishSession: (result: SessionResult) => void;
}

export const ExerciseSessionModal: React.FC<ExerciseSessionModalProps> = ({
  exercise,
  neurodiversityMode,
  onClose,
  onFinishSession
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [useRealCamera, setUseRealCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  
  // Game state
  const [reps, setReps] = useState(0);
  const targetReps = exercise.gamification.objective;
  const [stars, setStars] = useState(0);
  const [currentAngle, setCurrentAngle] = useState(170); // Starts standing (approx 170-180)
  const [postureFeedback, setPostureFeedback] = useState<string>(exercise.gamification.startMessage);
  const [feedbackStatus, setFeedbackStatus] = useState<'normal' | 'success' | 'warning'>('normal');
  const [isRepInPhase, setIsRepInPhase] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [muted, setMuted] = useState(false);

  // Time-based exercise state
  const [timeRemaining, setTimeRemaining] = useState(
    exercise.gamification.type === 'tiempo' ? exercise.gamification.objective : 0
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const simPhaseRef = useRef<number>(0);

  // Camera start / stop
  const toggleCamera = async () => {
    if (useRealCamera) {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
        setCameraStream(null);
      }
      setUseRealCamera(false);
      setCameraError(null);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480, facingMode: 'user' } 
        });
        setCameraStream(stream);
        setUseRealCamera(true);
        setCameraError(null);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setCameraError('No se pudo acceder a la cámara. Continuando en modo Simulador Biomecánico Interactivo.');
        setUseRealCamera(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [cameraStream]);

  // Audio mute toggle
  const toggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    audio.setMuted(nextMuted);
  };

  // Start workout
  const handleStart = () => {
    setIsPlaying(true);
    audio.playStart();
  };

  // Timer loop
  useEffect(() => {
    if (!isPlaying || sessionCompleted) return;

    const timer = setInterval(() => {
      setElapsedTime(prev => prev + 1);

      if (exercise.gamification.type === 'tiempo') {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            triggerCompletion();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, sessionCompleted, exercise]);

  // Biomechanical simulation and canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localAngle = 175;
    let inPhase = false;
    let localReps = reps;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // If playing, update biomechanical simulation cycle
      if (isPlaying && !sessionCompleted) {
        simPhaseRef.current += 0.035;
        const phase = simPhaseRef.current;

        if (exercise.id === 'squats') {
          // Sine wave simulating squat descent and ascent
          // Angle ranges from ~175 (standing) down to ~85 (squat depth)
          const baseCycle = Math.sin(phase);
          localAngle = Math.round(130 - baseCycle * 48); // 82 to 178 degrees
          setCurrentAngle(localAngle);

          // Therapeutic criteria: knee flexion between 80° and 105°
          const targetMin = neurodiversityMode === 'motor' ? 100 : 85;
          const targetMax = 110;

          if (localAngle <= targetMax && !inPhase) {
            inPhase = true;
            setIsRepInPhase(true);
            setPostureFeedback('¡Excelente descenso! Mantén talones apoyados.');
            setFeedbackStatus('success');
          } else if (localAngle >= 165 && inPhase) {
            // Completed 1 full repetition
            inPhase = false;
            setIsRepInPhase(false);
            localReps += 1;
            setReps(localReps);
            audio.playRepSuccess(localReps);

            // Calculate stars
            if (localReps >= exercise.gamification.starsMin && stars < 1) {
              setStars(1);
              audio.playStarEarned();
            }
            if (localReps >= exercise.gamification.starsMed && stars < 2) {
              setStars(2);
              audio.playStarEarned();
            }
            if (localReps >= targetReps) {
              setStars(3);
              audio.playStarEarned();
              triggerCompletion();
            }
          }
        } else if (exercise.id === 'kneeTouch') {
          // Alternating knee touches
          const cycle = Math.sin(phase * 1.2);
          localAngle = Math.round(135 - Math.abs(cycle) * 55); // 80 to 135
          setCurrentAngle(localAngle);

          if (localAngle <= 95 && !inPhase) {
            inPhase = true;
            setIsRepInPhase(true);
            setPostureFeedback('¡Cruce de rodilla con mano contraria perfecto!');
            setFeedbackStatus('success');
          } else if (localAngle >= 130 && inPhase) {
            inPhase = false;
            setIsRepInPhase(false);
            localReps += 1;
            setReps(localReps);
            audio.playRepSuccess(localReps);

            if (localReps >= exercise.gamification.starsMin && stars < 1) setStars(1);
            if (localReps >= exercise.gamification.starsMed && stars < 2) setStars(2);
            if (localReps >= targetReps) {
              setStars(3);
              triggerCompletion();
            }
          }
        } else if (exercise.id === 'armsUp') {
          // Isometric arms up
          localAngle = Math.round(168 + Math.sin(phase) * 6);
          setCurrentAngle(localAngle);
          setPostureFeedback('Brazos al cielo: respiración profunda y columna recta.');
          setFeedbackStatus('success');
        }
      }

      // Draw skeleton overlay
      drawPoseSkeleton(ctx, canvas.width, canvas.height, localAngle, exercise.id);

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, sessionCompleted, exercise, neurodiversityMode, reps, stars, targetReps]);

  // Complete session trigger
  const triggerCompletion = () => {
    setSessionCompleted(true);
    setIsPlaying(false);
    audio.playVictory();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Draw human pose representation on canvas
  const drawPoseSkeleton = (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    angle: number,
    exId: string
  ) => {
    const cx = w / 2;
    const baseHeadY = h * 0.22;
    const shoulderY = h * 0.32;
    const hipY = h * 0.52;

    // Squat knee angle calculation
    let kneeY = h * 0.72;
    let kneeXOffset = 42;
    let ankleY = h * 0.90;

    if (exId === 'squats') {
      // Modulate knee bend based on angle
      const bendFactor = (180 - angle) / 100;
      kneeY = h * (0.68 + bendFactor * 0.08);
      kneeXOffset = 42 + bendFactor * 26;
      ankleY = h * 0.92;
    }

    // Color theme based on mode
    const isTea = neurodiversityMode === 'TEA';
    const jointColor = isRepInPhase 
      ? (isTea ? '#60A5FA' : '#10B981') 
      : (isTea ? '#93C5FD' : '#3B82F6');
    const boneColor = isRepInPhase
      ? (isTea ? 'rgba(96, 165, 250, 0.7)' : 'rgba(16, 185, 129, 0.7)')
      : 'rgba(59, 130, 246, 0.5)';

    ctx.save();

    // Semi-transparent background grid / scanline effect
    if (!useRealCamera) {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#0F172A');
      grad.addColorStop(1, '#1E293B');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Target calibration guides
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      for (let i = 40; i < w; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      for (let j = 40; j < h; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(w, j);
        ctx.stroke();
      }
    }

    // Bones (connecting lines)
    ctx.strokeStyle = boneColor;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Head circle
    ctx.beginPath();
    ctx.arc(cx, baseHeadY, 24, 0, Math.PI * 2);
    ctx.stroke();

    // Torso (neck to hip)
    ctx.beginPath();
    ctx.moveTo(cx, baseHeadY + 24);
    ctx.lineTo(cx, hipY);
    ctx.stroke();

    // Shoulders
    ctx.beginPath();
    ctx.moveTo(cx - 50, shoulderY);
    ctx.lineTo(cx + 50, shoulderY);
    ctx.stroke();

    // Arms
    if (exId === 'armsUp') {
      // Arms raised high
      ctx.beginPath();
      ctx.moveTo(cx - 50, shoulderY);
      ctx.lineTo(cx - 45, shoulderY - 70);
      ctx.lineTo(cx - 35, shoulderY - 130);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 50, shoulderY);
      ctx.lineTo(cx + 45, shoulderY - 70);
      ctx.lineTo(cx + 35, shoulderY - 130);
      ctx.stroke();
    } else {
      // Arms balanced at side or front
      ctx.beginPath();
      ctx.moveTo(cx - 50, shoulderY);
      ctx.lineTo(cx - 75, shoulderY + 50);
      ctx.lineTo(cx - 55, shoulderY + 95);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + 50, shoulderY);
      ctx.lineTo(cx + 75, shoulderY + 50);
      ctx.lineTo(cx + 55, shoulderY + 95);
      ctx.stroke();
    }

    // Hips to Knees to Ankles (Left leg)
    ctx.beginPath();
    ctx.moveTo(cx - 24, hipY);
    ctx.lineTo(cx - kneeXOffset, kneeY);
    ctx.lineTo(cx - 36, ankleY);
    ctx.stroke();

    // Hips to Knees to Ankles (Right leg)
    ctx.beginPath();
    ctx.moveTo(cx + 24, hipY);
    ctx.lineTo(cx + kneeXOffset, kneeY);
    ctx.lineTo(cx + 36, ankleY);
    ctx.stroke();

    // Joints (Keypoint Circles)
    const joints = [
      { x: cx, y: baseHeadY },
      { x: cx - 50, y: shoulderY },
      { x: cx + 50, y: shoulderY },
      { x: cx - 24, y: hipY },
      { x: cx + 24, y: hipY },
      { x: cx - kneeXOffset, y: kneeY, highlight: true },
      { x: cx + kneeXOffset, y: kneeY, highlight: true },
      { x: cx - 36, y: ankleY },
      { x: cx + 36, y: ankleY }
    ];

    joints.forEach(j => {
      ctx.beginPath();
      ctx.arc(j.x, j.y, j.highlight ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = j.highlight ? jointColor : '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = j.highlight ? '#FFFFFF' : boneColor;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Angle HUD over the active knee joint
    if (isPlaying) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.roundRect(cx + kneeXOffset + 14, kneeY - 18, 76, 32, 6);
      ctx.fill();
      ctx.strokeStyle = jointColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillText(`${angle}°`, cx + kneeXOffset + 24, kneeY + 4);
    }

    ctx.restore();
  };

  const handleSaveAndClose = () => {
    const result: SessionResult = {
      exerciseId: exercise.id,
      repsCompleted: reps,
      targetReps: targetReps,
      accuracy: Math.min(100, Math.round(85 + (reps / Math.max(1, targetReps)) * 12)),
      starsEarned: stars,
      averageAngle: currentAngle,
      durationSeconds: elapsedTime,
      compensationsAvoided: reps > 0 ? reps + 2 : 0,
      neurodiversityMode: neurodiversityMode,
      timestamp: new Date().toISOString()
    };
    onFinishSession(result);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-semibold text-white leading-tight">
                {exercise.friendlyName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <span>{exercise.name}</span>
                <span>·</span>
                <span className="capitalize">{exercise.category.replace('_', ' ')}</span>
                <span>·</span>
                <span>Modo: {neurodiversityMode.toUpperCase()}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={muted ? 'Activar sonido' : 'Silenciar'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleCamera}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                useRealCamera 
                  ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30' 
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{useRealCamera ? 'Cámara Activa' : 'Activar Cámara'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Camera Warning Banner (if any) */}
        {cameraError && (
          <div className="px-4 py-2 bg-amber-950/50 border-b border-amber-900/50 flex items-center gap-2 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{cameraError}</span>
          </div>
        )}

        {/* Interactive Viewport Area */}
        <div className="relative flex-1 bg-slate-950 flex items-center justify-center overflow-hidden min-h-[380px]">
          {/* Real Video Element if active */}
          {useRealCamera && (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
            />
          )}

          {/* Canvas for Pose Tracking & Biomechanical Skeleton */}
          <canvas
            ref={canvasRef}
            width={640}
            height={480}
            className="w-full h-full max-h-[500px] object-contain relative z-10"
          />

          {/* HUD Overlay - Reps & Stars Counter */}
          <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
            <div className="flex items-center gap-3 px-4 py-2.5 bg-slate-900/90 border border-slate-700/60 rounded-xl backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {exercise.gamification.type === 'tiempo' ? 'Segundos' : 'Repeticiones'}
                </span>
                <span className="text-2xl font-extrabold text-white font-mono tabular-nums">
                  {exercise.gamification.type === 'tiempo' ? timeRemaining : `${reps} / ${targetReps}`}
                </span>
              </div>
              <div className="w-[1px] h-8 bg-slate-700" />
              <div className="flex items-center gap-1">
                {[1, 2, 3].map(s => (
                  <Star
                    key={s}
                    className={`w-5 h-5 transition-transform ${
                      s <= stars
                        ? 'text-amber-400 fill-amber-400 scale-110 drop-shadow'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Live Biomechanical Angle Readout */}
            <div className="px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-300 font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Ángulo Articular:</span>
              <span className="font-bold text-white tabular-nums">{currentAngle}°</span>
            </div>
          </div>

          {/* HUD Posture Feedback Banner */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[90%] max-w-lg">
            <div className={`px-4 py-2.5 rounded-xl border backdrop-blur-md text-center transition-all ${
              feedbackStatus === 'success'
                ? 'bg-emerald-950/85 border-emerald-500/50 text-emerald-200'
                : feedbackStatus === 'warning'
                ? 'bg-amber-950/85 border-amber-500/50 text-amber-200'
                : 'bg-slate-900/85 border-slate-700 text-slate-200'
            }`}>
              <p className="text-sm font-medium">
                {postureFeedback}
              </p>
            </div>
          </div>

          {/* Neurodiversity Sensory Indicator */}
          {neurodiversityMode !== 'standard' && (
            <div className="absolute top-4 right-4 z-20 px-3 py-1.5 bg-indigo-950/80 border border-indigo-700/50 rounded-lg text-xs text-indigo-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Adaptación Sensorial: {neurodiversityMode.toUpperCase()}</span>
            </div>
          )}

          {/* Completed Session Overlay Screen */}
          {sessionCompleted && (
            <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-3">
                <Award className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">
                ¡Misión Completada con Éxito!
              </h3>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                Has completado la meta terapéutica con un excelente control articular y postura equilibrada.
              </p>

              {/* Stars Trophy */}
              <div className="flex items-center gap-3 mb-6">
                {[1, 2, 3].map(s => (
                  <Star
                    key={s}
                    className={`w-9 h-9 ${
                      s <= stars
                        ? 'text-amber-400 fill-amber-400 animate-bounce'
                        : 'text-slate-700'
                    }`}
                  />
                ))}
              </div>

              {/* Session Stats Grid */}
              <div className="grid grid-cols-3 gap-3 w-full max-w-md mb-6 text-left">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Repeticiones</span>
                  <span className="text-lg font-bold text-white font-mono">{reps}</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Precisión</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">94%</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 block">Duración</span>
                  <span className="text-lg font-bold text-white font-mono">{elapsedTime}s</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setSessionCompleted(false);
                    setReps(0);
                    setStars(0);
                    setIsPlaying(true);
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Repetir Misión</span>
                </button>
                <button
                  onClick={handleSaveAndClose}
                  className="px-6 py-2.5 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/30"
                >
                  Guardar en Ficha Clínica
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Controls Bar */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Tiempo transcurrido: <strong className="text-slate-200 font-mono">{elapsedTime}s</strong></span>
            </span>
            <span>·</span>
            <span>Objetivo: <strong className="text-slate-200 font-mono">{targetReps} reps</strong></span>
          </div>

          <div className="flex items-center gap-3">
            {!isPlaying && !sessionCompleted ? (
              <button
                onClick={handleStart}
                className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-600/20"
              >
                <Play className="w-4 h-4" />
                <span>Iniciar Ejercicio</span>
              </button>
            ) : isPlaying ? (
              <button
                onClick={() => setIsPlaying(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </button>
            ) : null}

            {isPlaying && (
              <button
                onClick={triggerCompletion}
                className="px-4 py-2 text-xs font-medium text-amber-300 bg-amber-950/60 border border-amber-800/60 rounded-lg hover:bg-amber-900/50 transition-colors"
              >
                Finalizar Ahora
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
