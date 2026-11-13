'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../lib/context';
import { formatCurrency } from '../lib/products';
import confetti from 'canvas-confetti';

export default function VirtualTryOnModal() {
  const {
    isTryOnModalOpen,
    setIsTryOnModalOpen,
    selectedProduct,
    setSelectedProduct,
    products,
    openSmartSizerModal,
    addToCart,
    showToast
  } = useApp();

  const [isAiFitActive, setIsAiFitActive] = useState(true);
  const [cameraStatus, setCameraStatus] = useState('Iniciando IA MediaPipe...');
  const [scale, setScale] = useState(1.0);
  const [posY, setPosY] = useState(0);
  const [opacity, setOpacity] = useState(0.95);
  const [isStaticImageMode, setIsStaticImageMode] = useState(false);
  const [staticImageSrc, setStaticImageSrc] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraInstanceRef = useRef(null);
  const poseInstanceRef = useRef(null);
  const streamRef = useRef(null);

  // Overlay position and width state calculated by MediaPipe or manual
  const [overlayStyle, setOverlayStyle] = useState({
    left: '50%',
    top: '42%',
    transform: 'translate(-50%, -50%)',
    width: '58%'
  });

  // Elegir prenda seleccionada o primera del catálogo
  const activeGarment = selectedProduct || products[0];

  useEffect(() => {
    if (!isTryOnModalOpen) {
      stopCamera();
      return;
    }

    // Inicializar Cámara & MediaPipe
    if (!isStaticImageMode) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isTryOnModalOpen, isStaticImageMode]);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (cameraInstanceRef.current && cameraInstanceRef.current.stop) {
      try {
        cameraInstanceRef.current.stop();
      } catch (e) {}
      cameraInstanceRef.current = null;
    }
  };

  const startCamera = async () => {
    setCameraStatus('Conectando cámara...');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraStatus('Cámara activa. Iniciando MediaPipe Pose...');
          initMediaPipe();
        };
      }
    } catch (err) {
      console.warn('Cámara no disponible:', err);
      setCameraStatus('Cámara no disponible. Puedes subir una foto.');
    }
  };

  const initMediaPipe = () => {
    if (typeof window === 'undefined' || !window.Pose) {
      setCameraStatus('Modo visual listo (IA en espera)');
      return;
    }

    try {
      const pose = new window.Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
      });

      pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      pose.onResults(onPoseResults);
      poseInstanceRef.current = pose;

      if (window.Camera && videoRef.current) {
        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (poseInstanceRef.current && videoRef.current && isTryOnModalOpen) {
              await poseInstanceRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });
        camera.start();
        cameraInstanceRef.current = camera;
        setCameraStatus('IA MediaPipe Pose Conectada');
      }
    } catch (e) {
      console.error('Error inicializando MediaPipe:', e);
      setCameraStatus('Modo manual activo');
    }
  };

  const onPoseResults = (results) => {
    if (!isAiFitActive || !results.poseLandmarks) return;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const landmarks = results.poseLandmarks;
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    if (leftShoulder && rightShoulder && leftShoulder.visibility > 0.5 && rightShoulder.visibility > 0.5) {
      // Coordenadas normalizadas (0 a 1)
      const midX = (leftShoulder.x + rightShoulder.x) / 2;
      const midY = (leftShoulder.y + rightShoulder.y) / 2;
      const shoulderDist = Math.hypot(rightShoulder.x - leftShoulder.x, rightShoulder.y - leftShoulder.y);

      // Calcular porcentaje de ancho y posición
      const widthPercent = Math.max(30, Math.min(90, shoulderDist * 220 * scale));
      const leftPercent = midX * 100;
      const topPercent = (midY * 100) + (posY / 5);

      setOverlayStyle({
        left: `${leftPercent}%`,
        top: `${topPercent}%`,
        transform: `translate(-50%, -35%) scale(${scale})`,
        width: `${widthPercent}%`
      });
      setCameraStatus('Seguimiento corporal: Torso detectado');
    }
  };

  const handleUserPhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        setStaticImageSrc(loadEvent.target.result);
        setIsStaticImageMode(true);
        setCameraStatus('Foto propia cargada con éxito');
      };
      reader.readAsDataURL(file);
    }
  };

  const restartCamera = () => {
    setIsStaticImageMode(false);
    setStaticImageSrc(null);
    startCamera();
  };

  const resetAdjustments = () => {
    setScale(1.0);
    setPosY(0);
    setOpacity(0.95);
    setOverlayStyle({
      left: '50%',
      top: '42%',
      transform: 'translate(-50%, -50%)',
      width: '58%'
    });
    showToast('Ajustes manuales restablecidos', 'info');
  };

  const captureSnapshot = () => {
    const canvas = document.createElement('canvas');
    const width = 800;
    const height = 900;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Fondo oscuro streetwear
    ctx.fillStyle = '#0f0f11';
    ctx.fillRect(0, 0, width, height);

    // Dibujar video o imagen
    if (isStaticImageMode && staticImageSrc) {
      const img = new Image();
      img.src = staticImageSrc;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height);
        drawWatermarkAndDownload(canvas);
      };
    } else if (videoRef.current && videoRef.current.readyState >= 2) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      drawWatermarkAndDownload(canvas);
    } else {
      drawWatermarkAndDownload(canvas);
    }
  };

  const drawWatermarkAndDownload = (canvas) => {
    const ctx = canvas.getContext('2d');
    
    // Marca de agua TAGHER'S
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(20, canvas.height - 70, 360, 50);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Montserrat, sans-serif';
    ctx.fillText("TAGHER'S | VIRTUAL TRY-ON AI", 35, canvas.height - 38);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}

    const link = document.createElement('a');
    link.download = `TAGHERS-look-${activeGarment.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    showToast('¡Foto de tu look guardada con éxito!', 'success');
  };

  if (!isTryOnModalOpen) return null;

  const garmentImgSrc = activeGarment.overlayImage || activeGarment.images?.[0] || activeGarment.image;

  return (
    <div className="modal-overlay active" id="tryonModal">
      <div className="modal-card modal-tryon">
        <div className="modal-header">
          <div className="modal-title-wrap">
            <i className="fa-solid fa-camera"></i>
            <div>
              <h3>PROBADOR VIRTUAL CON IA EN VIVO</h3>
              <span className="modal-subtitle">
                Seguimiento corporal en tiempo real de hombros y torso con MediaPipe Pose
              </span>
            </div>
          </div>
          <button
            className="modal-close-btn"
            onClick={() => setIsTryOnModalOpen(false)}
            title="Cerrar probador"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="tryon-body">
          {/* VIEWPORT CÁMARA */}
          <div className="camera-viewport-container">
            {/* AVISO DE CALCE */}
            <div className="virtual-fit-warning-banner">
              <i className="fa-solid fa-triangle-exclamation"></i>
              <div>
                <b>Aviso de Calce Virtual:</b> Proyección estética del diseño sobre tu silueta.{' '}
                <a href="#" onClick={(e) => { e.preventDefault(); openSmartSizerModal(); }}>
                  <u>Calcula tu talle recomendado aquí</u>
                </a>.
              </div>
            </div>

            {/* VIDEO WEBCAM */}
            {!isStaticImageMode ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <img
                src={staticImageSrc}
                alt="Foto propia"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            <canvas
              ref={canvasRef}
              className="pose-tracking-canvas"
              width={640}
              height={480}
            />

            {/* OVERLAY PRENDA */}
            <div
              className="garment-overlay-container"
              style={{
                position: 'absolute',
                pointerEvents: 'none',
                opacity: opacity,
                ...overlayStyle
              }}
            >
              <img
                src={garmentImgSrc}
                alt={activeGarment.name}
                style={{ width: '100%', filter: 'drop-shadow(0 14px 28px rgba(0,0,0,0.45))' }}
              />
            </div>

            {/* ESTADO CÁMARA */}
            <div className="camera-status">
              <span className="status-dot"></span>
              <span>{cameraStatus}</span>
            </div>
          </div>

          {/* CONTROLES DEL PROBADOR */}
          <div className="tryon-controls-panel">
            <div className="control-section">
              <label className="control-label">PRENDA SELECCIONADA</label>
              <div className="selected-garment-card">
                <img src={activeGarment.image} alt={activeGarment.name} />
                <div className="garment-info">
                  <h4>{activeGarment.name}</h4>
                  <span>${formatCurrency(activeGarment.price)}</span>
                </div>
              </div>
            </div>

            {/* MÓDULO IA */}
            <div className="control-section ai-feature-box">
              <div className="ai-box-header">
                <span className="control-label">
                  <i className="fa-solid fa-brain"></i> IA CORPORAL EN VIVO
                </span>
                <span className="badge-ai-live">{isAiFitActive ? 'ACTIVO' : 'MANUAL'}</span>
              </div>
              <button
                className="btn btn-sm btn-dark btn-block"
                onClick={() => setIsAiFitActive(!isAiFitActive)}
              >
                <i className="fa-solid fa-person-rays"></i>{' '}
                {isAiFitActive ? 'IA Auto-Calce: ACTIVADO' : 'IA Auto-Calce: PAUSADO'}
              </button>
              <button
                className="btn btn-sm btn-outline btn-block mt-1"
                onClick={openSmartSizerModal}
              >
                <i className="fa-solid fa-ruler-combined"></i> ¿Cuál es mi Talle Ideal? (Asesor IA)
              </button>
            </div>

            {/* SELECTOR RÁPIDO DE PRENDAS */}
            <div className="control-section">
              <label className="control-label">CAMBIAR PRENDA</label>
              <div className="tryon-garment-picker">
                {products.map((p) => (
                  <div
                    key={p.id}
                    className={`picker-item ${p.id === activeGarment.id ? 'active' : ''}`}
                    onClick={() => setSelectedProduct(p)}
                  >
                    <img src={p.image} alt={p.name} />
                    <span>${formatCurrency(p.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AJUSTES MANUALES */}
            <div className="control-section">
              <label className="control-label">AJUSTES MANUALES</label>

              <div className="slider-row">
                <span>Tamaño</span>
                <input
                  type="range"
                  min="0.4"
                  max="2.0"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                />
                <span>{Math.round(scale * 100)}%</span>
              </div>

              <div className="slider-row">
                <span>Posición Vertical</span>
                <input
                  type="range"
                  min="-150"
                  max="150"
                  step="2"
                  value={posY}
                  onChange={(e) => setPosY(parseInt(e.target.value, 10))}
                />
                <span>{posY}</span>
              </div>

              <div className="slider-row">
                <span>Opacidad</span>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                />
                <span>{Math.round(opacity * 100)}%</span>
              </div>

              <button className="btn btn-sm btn-outline" onClick={resetAdjustments}>
                <i className="fa-solid fa-rotate-left"></i> Restablecer
              </button>
            </div>

            {/* ACCIONES */}
            <div className="control-section camera-source-actions">
              <button className="btn btn-dark btn-block" onClick={captureSnapshot}>
                <i className="fa-solid fa-camera-retro"></i> TOMAR FOTO & GUARDAR LOOK
              </button>

              <div className="alt-source-row">
                <label className="btn btn-outline btn-block file-upload-btn">
                  <i className="fa-solid fa-cloud-arrow-up"></i> SUBIR TU PROPIA FOTO
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUserPhotoUpload}
                    style={{ display: 'none' }}
                  />
                </label>
                {isStaticImageMode && (
                  <button
                    className="btn btn-outline"
                    onClick={restartCamera}
                    title="Reiniciar cámara en vivo"
                  >
                    <i className="fa-solid fa-video"></i>
                  </button>
                )}
              </div>

              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  addToCart(activeGarment);
                }}
              >
                <i className="fa-solid fa-bag-shopping"></i> AÑADIR ESTA PRENDA AL CARRITO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
