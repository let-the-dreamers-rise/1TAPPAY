'use client';

/**
 * QRCodeDisplay Component
 * 
 * Renders QR codes for payment links with download functionality.
 * Styled with UPI/PayPal inspired design.
 */

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeDisplayProps {
  url: string;
  size?: number;
  downloadable?: boolean;
  label?: string;
}

export function QRCodeDisplay({ 
  url, 
  size = 200, 
  downloadable = true,
  label 
}: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (!qrRef.current) return;

    try {
      // Get the SVG element
      const svg = qrRef.current.querySelector('svg');
      if (!svg) return;

      // Create a canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Set canvas size (add padding)
      const padding = 40;
      canvas.width = size + padding * 2;
      canvas.height = size + padding * 2;

      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = () => {
        // Draw QR code centered with padding
        ctx.drawImage(img, padding, padding, size, size);

        // Add label if provided
        if (label) {
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 16px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(label, canvas.width / 2, canvas.height - 15);
        }

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (!blob) return;

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `1tappay-qr-${Date.now()}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });

        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    } catch (error) {
      console.error('Failed to download QR code:', error);
      alert('Failed to download QR code. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* QR Code Container */}
      <div 
        ref={qrRef}
        className="p-4 bg-white rounded-2xl shadow-fintech border-2 border-gray-200 hover:border-primary-500 transition-all"
      >
        <QRCodeSVG
          value={url}
          size={size}
          level="H"
          includeMargin={false}
          bgColor="#ffffff"
          fgColor="#000000"
        />
      </div>

      {/* Label */}
      {label && (
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </p>
      )}

      {/* Download Button */}
      {downloadable && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-all text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download QR Code
        </button>
      )}

      {/* Scan Instructions */}
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 max-w-xs">
        Scan with any QR code reader to open the payment link
      </p>
    </div>
  );
}
