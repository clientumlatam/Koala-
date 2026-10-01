import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mic,
  Square,
  Sparkles,
  Copy,
  Check,
  Search,
  MessageCircle,
  X,
  Upload,
  AlertCircle,
  Volume2,
  RefreshCw,
  Clock,
  AudioLines,
  Radio,
  FileAudio
} from 'lucide-react';
import { KoalaLogo } from './KoalaLogo';

interface AudioTranscriberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTranscriptionToSearch?: (text: string) => void;
  onApplyTranscriptionToChat?: (text: string) => void;
}

export const AudioTranscriberModal: React.FC<AudioTranscriberModalProps> = ({
  isOpen,
  onClose,
  onApplyTranscriptionToSearch,
  onApplyTranscriptionToChat,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionText, setTranscriptionText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up on unmount or close
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  if (!isOpen) return null;

  // Start recording from user's microphone
  const handleStartRecording = async () => {
    setErrorMessage(null);
    setAudioBlob(null);
    setTranscriptionText('');
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Tu navegador o dispositivo no soporta la captura de audio por micrófono.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Determine best supported mime type
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        // Stop all tracks to release microphone hardware indicator
        stream.getTracks().forEach((track) => track.stop());

        const fullBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(fullBlob);
        const url = URL.createObjectURL(fullBlob);
        setAudioUrl(url);

        // Automatically transcribe once stopped
        await transcribeAudioBlob(fullBlob, mimeType);
      };

      recorder.start(250); // Collect data every 250ms
      setIsRecording(true);
      setRecordingDuration(0);

      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error starting microphone recording:', err);
      let userFriendly = 'No se pudo acceder al micrófono.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        userFriendly = 'Permiso denegado: Por favor habilita el acceso al micrófono en la barra de tu navegador.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        userFriendly = 'No se detectó ningún micrófono conectado en tu dispositivo.';
      }
      setErrorMessage(userFriendly);
      setIsRecording(false);
    }
  };

  // Stop recording
  const handleStopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Convert blob to base64 & send to /api/transcribe-audio
  const transcribeAudioBlob = async (blob: Blob, mimeType: string) => {
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onloadend = async () => {
        try {
          const base64data = reader.result as string;

          const response = await fetch('/api/transcribe-audio', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              audioData: base64data,
              mimeType: mimeType || blob.type || 'audio/webm',
              instruction: 'Transcribe este audio en español. Devuelve exclusivamente las palabras pronunciadas por el usuario sin comentarios de relleno.',
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            if (data.fallbackText) {
              setTranscriptionText(data.fallbackText);
            } else {
              throw new Error(data.error || 'Error al comunicarse con el servidor de transcripción.');
            }
          } else {
            setTranscriptionText(data.text || '');
          }
        } catch (postErr: any) {
          console.error('Error posting audio to backend:', postErr);
          setErrorMessage(postErr.message || 'Error al procesar la transcripción del audio.');
        } finally {
          setIsTranscribing(false);
        }
      };

      reader.onerror = () => {
        setIsTranscribing(false);
        setErrorMessage('Error al leer los datos de audio en el navegador.');
      };
    } catch (e: any) {
      setIsTranscribing(false);
      setErrorMessage(e.message || 'Error general en el proceso de transcripción.');
    }
  };

  // Handle local file upload (e.g. voice memo / recorded audio)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setAudioBlob(file);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(URL.createObjectURL(file));

    transcribeAudioBlob(file, file.type || 'audio/webm');
  };

  const handleCopyTranscription = () => {
    if (!transcriptionText) return;
    navigator.clipboard.writeText(transcriptionText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4.5 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white flex items-center justify-between shadow-xs shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="p-2 sm:p-2.5 rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner shrink-0">
              <AudioLines className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold font-fredoka tracking-wide truncate">
                  Transcribir Audio
                </h3>
                <span className="text-[9px] sm:text-[10px] uppercase font-black px-1.5 sm:px-2 py-0.5 rounded-full bg-white/25 text-white tracking-wider">
                  gemini
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-orange-100 truncate">
                Dictá tu consulta con el micrófono y convertila a texto con IA
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0 ml-2"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Microphone Central Interaction Area */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/60 flex flex-col items-center justify-center text-center relative overflow-hidden">
            {/* Ambient Background Wave effect when recording */}
            {isRecording && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-72 h-72 rounded-full bg-orange-500 animate-ping" />
              </div>
            )}

            {/* Central Mic Button */}
            <div className="relative mb-4">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  disabled={isTranscribing}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white shadow-lg hover:shadow-orange-500/30 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Comenzar a grabar audio"
                >
                  <Mic className="w-8 h-8" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 cursor-pointer animate-pulse"
                  title="Detener y procesar transcripción"
                >
                  <Square className="w-7 h-7 fill-white" />
                </button>
              )}
            </div>

            {/* Status text & timer */}
            {isRecording ? (
              <div className="space-y-1">
                <div className="flex items-center justify-center gap-2 text-rose-600 font-extrabold text-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                  <span>Grabando audio en vivo...</span>
                </div>
                <div className="text-2xl font-black font-mono text-slate-800 dark:text-white">
                  {formatTimer(recordingDuration)}
                </div>
                <p className="text-xs text-slate-500">
                  Hacé clic en el botón rojo cuadrado para finalizar y transcribir
                </p>
              </div>
            ) : isTranscribing ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Transcribiendo con gemini-3.5-transcribe...</span>
                </div>
                <p className="text-xs text-slate-400">
                  Procesando ondas vocales e interpretando en español
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Presioná el micrófono para hablar
                </p>
                <p className="text-xs text-slate-500 max-w-sm">
                  Podés consultar por stock de bolsas de polietileno, medidas de bobinas, cotizaciones o envíos.
                </p>
              </div>
            )}

            {/* Audio Wave Bars Visualizer (Simulated) */}
            {isRecording && (
              <div className="flex items-center justify-center gap-1.5 mt-4 h-8">
                {[12, 28, 16, 32, 24, 18, 30, 14, 26, 20, 32, 16].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, h, 8] }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + (i % 4) * 0.15,
                      ease: 'easeInOut',
                    }}
                    className="w-1 bg-orange-500 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Aviso de audio: </span>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Audio Player Preview (if recorded or uploaded) */}
          {audioUrl && !isRecording && (
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <Volume2 className="w-4 h-4 text-orange-600 shrink-0" />
              <audio src={audioUrl} controls className="w-full h-8" />
            </div>
          )}

          {/* Transcription Results Card */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Texto Transcripto ({transcriptionText ? transcriptionText.split(/\s+/).filter(Boolean).length : 0} palabras)</span>
              </label>

              {transcriptionText && (
                <button
                  type="button"
                  onClick={handleCopyTranscription}
                  className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar texto</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <textarea
              rows={4}
              value={transcriptionText}
              onChange={(e) => setTranscriptionText(e.target.value)}
              placeholder="El texto dictado aparecerá aquí automáticamente una vez finalizada la grabación..."
              className="w-full p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 font-medium"
            />
          </div>

          {/* Action Buttons to connect with Search & Chatbot */}
          {transcriptionText && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {onApplyTranscriptionToSearch && (
                <button
                  type="button"
                  onClick={() => {
                    onApplyTranscriptionToSearch(transcriptionText);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Buscar en Catálogo de Productos</span>
                </button>
              )}

              {onApplyTranscriptionToChat && (
                <button
                  type="button"
                  onClick={() => {
                    onApplyTranscriptionToChat(transcriptionText);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Consultar al Asesor IA / WhatsApp</span>
                </button>
              )}
            </div>
          )}

          {/* Alternative File Upload */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>¿Tenés un archivo de audio o nota de voz grabada?</span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-orange-600 dark:text-orange-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir archivo (.webm, .mp3, .wav)</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-orange-600" />
            <span>Motor de Transcripción de Audio: <strong>Gemini 3.5 Transcribe</strong></span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
