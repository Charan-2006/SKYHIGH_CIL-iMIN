import React from 'react';
import { motion } from 'framer-motion';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  headerTitle?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  hoverable?: boolean;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  headerTitle,
  subtitle,
  headerAction,
  hoverable = false,
  animate = false,
  className = '',
  ...props
}) => {
  const Component = animate ? motion.div : 'div';
  
  const baseStyle = 'bg-white border border-cortex-border rounded-xl p-5 shadow-premium overflow-hidden';
  const hoverStyle = hoverable ? 'shadow-premium-hover cursor-pointer' : '';

  return (
    <Component
      className={`${baseStyle} ${hoverStyle} ${className}`}
      {...(animate ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
      } : {})}
      {...props as any}
    >
      {(headerTitle || subtitle || headerAction) && (
        <div className="flex justify-between items-start mb-5 pb-3 border-b border-cortex-border/50">
          <div>
            {headerTitle && (
              <h3 className="text-base font-bold text-cortex-dark tracking-wide uppercase">
                {headerTitle}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-cortex-gray mt-1 leading-normal">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="flex items-center">{headerAction}</div>}
        </div>
      )}
      <div>{children}</div>
    </Component>
  );
};
export default Card;
