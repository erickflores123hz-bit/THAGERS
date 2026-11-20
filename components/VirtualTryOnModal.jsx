'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../lib/context';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../lib/products';

export default function VirtualTryOnModal() {
  const {
    isTryOnModalOpen,
    setIsTryOnModalOpen,
    tryOnProduct,
    setTryOnProduct,
    products,
    addToCart,
    recommendedSize,
    setIsCheckoutModalOpen,
    showToast
  } = useApp();

  // Pasos: 'camera' | 'review' | 'processing' | 'result'
  const [step, setStep] = useState('camera');
  const [capturedImage, setCapturedImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isComparingOriginal, setIsComparingOriginal] = useState(false);
  const [facingMode, setFacingMode] = useState('user'); // 'user' o 'environment'
  const [cameraError, setCameraError] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [processingMsgIdx, setProcessingMsgIdx] = useState(0);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isResultDemo, setIsResultDemo] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const processingMessages = [
    'Escaneando postura corporal y proporciones...',
    'Alineando hombros, torso y caída de tela...',
    'Generando pliegues fotorrealistas y sombras...',
    'Finalizando renderizado de alta costura...'
  ];

  // Iniciar / detener cámara según el estado del modal
  useEffect(() => {
    if (isTryOnModalOpen && step === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isTryOnModalOpen, step, facingMode]);

  // Rotación de mensajes durante el procesamiento de IA
  useEffect(() => {
    let interval;
    if (step === 'processing') {
      interval = setInterval(() => {
        setProcessingMsgIdx((prev) => (prev + 1) % processingMessages.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [step]);

  // Reset al abrir el modal con un nuevo producto
  useEffect(() => {
    if (isTryOnModalOpen) {
      setErrorMessage(null);
      if (!capturedImage) {
        setStep('camera');
      } else {
        setStep('review');
      }
    }
  }, [isTryOnModalOpen, tryOnProduct?.id]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 960 }
        },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('No se pudo acceder a la cámara:', err);
      setCameraError('No se pudo acceder a la cámara web. Puedes subir una foto desde tus archivos.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const toggleCameraFacing = () => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 960;
    canvas.height = video.videoHeight || 1280;

    const ctx = canvas.getContext('2d');
    if (facingMode === 'user') {
      // Efecto espejo natural para cámara frontal
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedImage(dataUrl);
    stopCamera();
    setStep('review');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCapturedImage(event.target.result);
      stopCamera();
      setStep('review');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateTryOn = async () => {
    if (!capturedImage || !tryOnProduct) return;
    setStep('processing');
    setErrorMessage(null);

    try {
      const res = await fetch('/api/try-on', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userImage: capturedImage,
          productId: tryOnProduct.id,
          forceDemo: isDemoMode
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Ocurrió un error al procesar con IA.');
      }

      setResultImage(data.resultUrl);
      setIsResultDemo(Boolean(data.isDemo));
      setIsComparingOriginal(false);
      setStep('result');
      if (showToast) {
        showToast(data.isDemo ? 'Demostración generada con éxito' : 'Prueba virtual generada con éxito');
      }
    } catch (err) {
      console.error('Try-on error:', err);
      setErrorMessage(err.message || 'Error de conexión con el motor de IA.');
      setStep('review');
    }
  };

  const handleClose = () => {
    stopCamera();
    setIsTryOnModalOpen(false);
  };

  const handleAddToCartAndCheckout = () => {
    if (!tryOnProduct) return;
    addToCart(tryOnProduct, recommendedSize || 'L', 1);
    handleClose();
    setIsCheckoutModalOpen(true);
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = `taghers-tryon-${tryOnProduct?.id || 'look'}.png`;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Prendas sugeridas para cambiar rápidamente en el probador
  const eligibleGarments = products.filter(
    (p) => p.category === 'sudaderas' || p.category === 'vaqueros' || p.category === 'camisetas' || p.category === 'chandals'
  );

  return (
    <AnimatePresence>
      {isTryOnModalOpen && (
        <div className="modal-overlay active" style={{ zIndex: 1200 }}>
          {/* BACKDROP BLUR OSCURECIDO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/75"
            style={{ backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
            onClick={handleClose}
          />

          {/* CONTENEDOR MODAL */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="modal-card"
            style={{
              position: 'relative',
              zIndex: 10,
              maxWidth: '880px',
              width: '94vw',
              padding: '0',
              overflow: 'hidden',
              background: '#0d0d0d',
              border: '1px solid #262626',
              color: '#f5f5f5'
            }}
          >
            {/* CABECERA MINIMALISTA */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
              <div className="flex items-center gap-3">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h3 className="text-sm font-semibold tracking-widest uppercase text-neutral-200">
                  PROBADOR VIRTUAL IA • IDM-VTON
                </h3>
              </div>
              <motion.button
                onClick={handleClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="text-neutral-400 hover:text-white text-lg p-1 transition-colors"
                title="Cerrar"
              >
                <i className="fa-solid fa-xmark"></i>
              </motion.button>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            <div className="p-6">
              {/* PASO 1: CÁMARA EN VIVO / SUBIR FOTO */}
              {step === 'camera' && (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-md aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 shadow-2xl flex items-center justify-center">
                    {cameraError ? (
                      <div className="p-6 text-center">
                        <i className="fa-solid fa-camera-slash text-3xl text-amber-400 mb-3 block"></i>
                        <p className="text-sm text-neutral-300 mb-4">{cameraError}</p>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <i className="fa-solid fa-arrow-up-from-bracket"></i> SUBIR FOTO DESDE TU DISPOSITIVO
                        </button>
                      </div>
                    ) : (
                      <>
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
                        />

                        {/* SILUETA GUÍA TRANSLÚCIDA */}
                        <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-between p-4 border border-dashed border-white/20 rounded-lg">
                          <span className="text-[11px] tracking-wider uppercase bg-black/60 px-3 py-1 rounded text-neutral-300">
                            Encuadra tu cuerpo de frente con buena luz
                          </span>
                          <div className="w-48 h-64 border border-dashed border-emerald-400/40 rounded-full my-auto opacity-40"></div>
                          <span className="text-[10px] text-neutral-400 bg-black/60 px-2 py-0.5 rounded">
                            Distancia recomendada: 1.5 a 2 metros
                          </span>
                        </div>

                        {/* BOTÓN CAMBIAR CÁMARA */}
                        <button
                          onClick={toggleCameraFacing}
                          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center text-sm transition-colors border border-white/20"
                          title="Girar cámara"
                        >
                          <i className="fa-solid fa-camera-rotate"></i>
                        </button>
                      </>
                    )}
                  </div>

                  {/* CONTROLES DE CAPTURA */}
                  <div className="flex items-center gap-4 mt-6">
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileUpload}
                    />

                    <motion.button
                      className="btn btn-outline text-xs"
                      onClick={() => fileInputRef.current?.click()}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.96 }}
                    >
                      <i className="fa-solid fa-arrow-up-from-bracket"></i> SUBIR FOTO
                    </motion.button>

                    {!cameraError && (
                      <motion.button
                        className="btn btn-primary px-8"
                        onClick={handleCapturePhoto}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.93 }}
                      >
                        <i className="fa-solid fa-camera"></i> CAPTURAR FOTO
                      </motion.button>
                    )}
                  </div>
                </div>
              )}

              {/* PASO 2: REVISIÓN DE FOTO + PRENDA SELECCIONADA */}
              {step === 'review' && (
                <div>
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded">
                      <i className="fa-solid fa-circle-exclamation mr-1"></i> {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* TU FOTO CAPTURADA */}
                    <div className="flex flex-col items-center">
                      <span className="text-xs uppercase tracking-widest text-neutral-400 mb-2">
                        TU SILUETA CAPTURADA
                      </span>
                      <div className="relative w-full max-w-xs aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 shadow-md">
                        <img
                          src={capturedImage}
                          alt="Tu foto"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        className="text-xs text-neutral-400 hover:text-white mt-3 underline transition-colors"
                        onClick={() => {
                          setCapturedImage(null);
                          setStep('camera');
                        }}
                      >
                        <i className="fa-solid fa-rotate-left mr-1"></i> Tomar o subir otra foto
                      </button>
                    </div>

                    {/* PRENDA QUE TE VAS A PROBAR */}
                    <div className="flex flex-col">
                      <span className="text-xs uppercase tracking-widest text-neutral-400 mb-2">
                        PRENDA A PROBAR
                      </span>
                      <div className="p-4 bg-neutral-900/90 rounded-lg border border-neutral-800 flex gap-4 items-center mb-3">
                        <img
                          src={tryOnProduct?.overlayImage || tryOnProduct?.image}
                          alt={tryOnProduct?.name}
                          className="w-20 h-24 object-cover rounded bg-neutral-950 border border-neutral-800"
                        />
                        <div className="flex-1">
                          <span className="text-[10px] uppercase tracking-wider text-amber-400 font-bold block mb-1">
                            {tryOnProduct?.badge || "TAGHER'S ARCHIVE"}
                          </span>
                          <h4 className="text-sm font-semibold text-neutral-100 mb-1 leading-snug">
                            {tryOnProduct?.name}
                          </h4>
                          <span className="text-xs text-neutral-400">
                            ${formatCurrency(tryOnProduct?.price || 0)}
                          </span>
                        </div>
                      </div>

                      {/* SELECTOR DE MODO (DEMO GRATIS VS REPLICATE) */}
                      <div className="flex items-center justify-between py-2 px-3 bg-neutral-950 rounded border border-neutral-800 mb-3 text-xs">
                        <span className="text-neutral-400">Modo de prueba:</span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                              isDemoMode
                                ? 'bg-neutral-800 text-emerald-400 font-bold border border-emerald-500/30'
                                : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                            onClick={() => setIsDemoMode(true)}
                          >
                            Demo (Gratis)
                          </button>
                          <button
                            type="button"
                            className={`px-2.5 py-1 rounded text-[11px] transition-colors ${
                              !isDemoMode
                                ? 'bg-neutral-800 text-white font-bold border border-neutral-700'
                                : 'text-neutral-500 hover:text-neutral-300'
                            }`}
                            onClick={() => setIsDemoMode(false)}
                          >
                            IA Real (Replicate)
                          </button>
                        </div>
                      </div>

                      {/* SELECTOR RÁPIDO DE OTRA PRENDA */}
                      <label className="text-[11px] text-neutral-400 uppercase tracking-wider mb-2">
                        O prueba otra prenda de la colección:
                      </label>
                      <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                        {eligibleGarments.slice(0, 6).map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setTryOnProduct(item)}
                            className={`flex-shrink-0 w-14 h-16 rounded overflow-hidden border transition-all ${
                              tryOnProduct?.id === item.id
                                ? 'border-white scale-105 shadow-md'
                                : 'border-neutral-800 opacity-60 hover:opacity-100'
                            }`}
                            title={item.name}
                          >
                            <img
                              src={item.overlayImage || item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>

                      {/* BOTÓN DISPARADOR DE IA */}
                      <motion.button
                        className="btn btn-primary btn-block py-3 text-sm font-bold tracking-wider"
                        onClick={handleGenerateTryOn}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>{' '}
                        {isDemoMode ? 'GENERAR DEMOSTRACIÓN GRATIS' : 'GENERAR PRUEBA CON IA'}
                      </motion.button>
                      <span className="text-[11px] text-neutral-500 text-center block mt-2">
                        {isDemoMode
                          ? 'Modo Demo: Simulación inmediata sin consumo de saldo'
                          : 'Tiempo estimado de procesamiento: 6 a 8 segundos'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 3: PROCESANDO CON IA (SCANLINE ANIMATION) */}
              {step === 'processing' && (
                <div className="flex flex-col items-center justify-center py-10">
                  <div className="relative w-64 aspect-[3/4] rounded-lg overflow-hidden border border-neutral-700 bg-neutral-900 shadow-2xl mb-6">
                    <img
                      src={capturedImage}
                      alt="Escaneando silueta"
                      className="w-full h-full object-cover opacity-60 filter contrast-125"
                    />

                    {/* LÁSER DE ESCANEO CONTINUO */}
                    <motion.div
                      className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#34d399]"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">
                      MOTOR IDM-VTON ACTIVO
                    </span>
                  </div>

                  <p className="text-sm font-medium text-neutral-200 text-center animate-pulse">
                    {processingMessages[processingMsgIdx]}
                  </p>
                  <span className="text-xs text-neutral-500 mt-2">
                    Ajustando caída, pliegues y sombras a tu contextura...
                  </span>
                </div>
              )}

              {/* PASO 4: RESULTADO FINAL & COMPARADOR */}
              {step === 'result' && (
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* VISOR DE RESULTADO CON TOGGLE ANTES / DESPUÉS */}
                    <div className="flex flex-col items-center">
                      <div className="relative w-full max-w-sm aspect-[3/4] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-700 shadow-2xl">
                        <img
                          src={isComparingOriginal ? capturedImage : resultImage}
                          alt="Resultado Try-On"
                          className="w-full h-full object-cover transition-opacity duration-200"
                        />

                        {/* BADGE DEL MODO VISUAL */}
                        <div className="absolute top-3 left-3 bg-black/75 px-3 py-1 rounded text-[11px] font-mono tracking-wider text-neutral-200 border border-neutral-800">
                          {isComparingOriginal ? 'FOTO ORIGINAL' : 'CON PRENDA TAGHER\'S'}
                        </div>
                      </div>

                      {/* TOGGLE ANTES / DESPUÉS */}
                      <div className="flex items-center gap-3 mt-4">
                        <button
                          className={`btn btn-sm ${!isComparingOriginal ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setIsComparingOriginal(false)}
                        >
                          CON LA PRENDA
                        </button>
                        <button
                          className={`btn btn-sm ${isComparingOriginal ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => setIsComparingOriginal(true)}
                        >
                          FOTO ORIGINAL
                        </button>
                      </div>
                    </div>

                    {/* DETALLE Y ACCIONES DE COMPRA */}
                    <div className="flex flex-col justify-between h-full py-2">
                      <div>
                        {isResultDemo && (
                          <div className="mb-2 px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded text-[11px] text-emerald-300 font-mono inline-block">
                            MODO DEMO • LOOK DE PRUEBA
                          </div>
                        )}
                        <span className="text-xs text-emerald-400 uppercase tracking-widest font-mono block mb-1">
                          RESULTADO GENERADO CON ÉXITO
                        </span>
                        <h3 className="text-xl font-bold text-white mb-2">{tryOnProduct?.name}</h3>
                        <div className="text-lg font-semibold text-neutral-200 mb-4">
                          ${formatCurrency(tryOnProduct?.price || 0)}
                        </div>
                        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
                          La prenda ha sido adaptada fielmente a tu postura y silueta. Talle recomendado según proporciones:{' '}
                          <b className="text-white">{recommendedSize || 'L'}</b>.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <motion.button
                          className="btn btn-primary btn-block py-3 text-sm font-bold tracking-wider"
                          onClick={handleAddToCartAndCheckout}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <i className="fa-solid fa-bag-shopping mr-2"></i> COMPRAR ESTA PRENDA
                        </motion.button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            className="btn btn-outline btn-sm text-xs"
                            onClick={handleDownload}
                          >
                            <i className="fa-solid fa-download mr-1"></i> GUARDAR FOTO
                          </button>
                          <button
                            className="btn btn-outline btn-sm text-xs"
                            onClick={() => {
                              setStep('review');
                            }}
                          >
                            <i className="fa-solid fa-shirt mr-1"></i> PROBAR OTRA PRENDA
                          </button>
                        </div>

                        <button
                          className="w-full text-center text-xs text-neutral-500 hover:text-neutral-300 py-1 transition-colors"
                          onClick={() => {
                            setCapturedImage(null);
                            setResultImage(null);
                            setStep('camera');
                          }}
                        >
                          Tomar foto con otra pose
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
