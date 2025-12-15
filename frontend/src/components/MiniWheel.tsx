import { motion } from 'motion/react';

export function MiniWheel() {
  const wheelPrizes = [
    { id: 1, label: '%10', color: '#8B5E3C' },
    { id: 2, label: '%15', color: '#C8A27A' },
    { id: 3, label: '%20', color: '#2D1B12' },
    { id: 4, label: '%25', color: '#8B5E3C' },
    { id: 5, label: '%30', color: '#C8A27A' },
    { id: 6, label: '%50', color: '#2D1B12' },
  ];

  const degreesPerSlice = 360 / wheelPrizes.length;

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      animate={{ rotate: 360 }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {wheelPrizes.map((prize, index) => {
        // Başlangıç açısı: üstten başla (-90 derece)
        const startAngle = -90 + (index * degreesPerSlice);
        const endAngle = -90 + ((index + 1) * degreesPerSlice);
        const middleAngle = (startAngle + endAngle) / 2;
        
        // Radyan cinsine çevir
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;
        const middleRad = (middleAngle * Math.PI) / 180;
        
        // Dilim için köşe noktaları
        const x1 = 100 + 100 * Math.cos(startRad);
        const y1 = 100 + 100 * Math.sin(startRad);
        const x2 = 100 + 100 * Math.cos(endRad);
        const y2 = 100 + 100 * Math.sin(endRad);

        const largeArcFlag = degreesPerSlice > 180 ? 1 : 0;
        const pathData = `M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

        // Metin pozisyonu: dilimin ortasından
        const textRadius = 65;
        const textX = 100 + textRadius * Math.cos(middleRad);
        const textY = 100 + textRadius * Math.sin(middleRad);
        
        // Metin rotasyonu: dışarı doğru baksın
        const textRotation = middleAngle + 90;

        return (
          <g key={prize.id}>
            {/* Dilim */}
            <path
              d={pathData}
              fill={prize.color}
              stroke="white"
              strokeWidth="2"
            />
            
            {/* Metin - her dilimin ortasında */}
            <g transform={`translate(${textX}, ${textY}) rotate(${textRotation})`}>
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none"
              >
                <tspan
                  x="0"
                  y="0"
                  fill="white"
                  fontSize="18"
                  fontWeight="900"
                >
                  {prize.label}
                </tspan>
              </text>
            </g>
          </g>
        );
      })}
      
      {/* Merkez daire */}
      <circle cx="100" cy="100" r="25" fill="white" stroke="#2D1B12" strokeWidth="3" />
    </motion.svg>
  );
}
