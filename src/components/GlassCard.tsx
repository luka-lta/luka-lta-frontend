import React from 'react'

interface GlassmorphismCardProps {
    children: React.ReactNode
    className?: string
}

const GlassCard: React.FC<GlassmorphismCardProps> = ({ children, className = '' }) => {
    return (
        <div className={`
      backdrop-filter backdrop-blur-lg bg-white bg-opacity-10
      border border-gray-200 border-opacity-20 rounded-xl
      shadow-lg p-6
      transition-all duration-500 ease-in-out
      hover:bg-opacity-10 hover:shadow-xl
      ${className}
    `}>
            {children}
        </div>
    )
}

export default GlassCard

