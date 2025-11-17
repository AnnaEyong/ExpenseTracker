// app/loading.jsx
export default function Loading() {
  return (
    <div className="bounce-loader-container bg-background">
      <div className="bounce-dot"></div>
      <div className="bounce-dot"></div>
      <div className="bounce-dot"></div>

      <style>{`
        .bounce-loader-container {
          position: fixed;
          inset: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          z-index: 9999;
        }

        .bounce-dot {
          width: 10px;
          height: 10px;
          background-color: #2563EB;
          border-radius: 50%;
          animation: bounce 0.7s infinite alternate;
        }

        .bounce-dot:nth-child(2) {
          animation-delay: 0.3s;
        }
        .bounce-dot:nth-child(3) {
          animation-delay: 0.5s;
        }

        @keyframes bounce {
          0%   { transform: translateY(0); }
          50%  { transform: translateY(-15px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}