import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gold text-black-900 font-semibold hover:bg-gold-light shadow-[0_0_20px_rgba(201,168,76,0.25)] hover:shadow-[0_0_30px_rgba(201,168,76,0.45)]',
  secondary:
    'bg-transparent text-white border border-surface-border hover:border-gold hover:text-gold',
  ghost:
    'bg-transparent text-gold hover:text-gold-light underline-offset-4 hover:underline px-0 py-0',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  to,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
}) => {
  const baseClasses = `
    inline-flex items-center justify-center gap-2
    rounded-full font-body font-medium tracking-wide
    transition-all duration-300 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black-900
    disabled:opacity-40 disabled:cursor-not-allowed
    select-none cursor-pointer
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.trim();

  const motionProps = {
    whileHover: disabled ? {} : { scale: 1.03 },
    whileTap: disabled ? {} : { scale: 0.97 },
    transition: { duration: 0.15, ease: [0.22, 1, 0.36, 1] as const },
  };

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link to={to} className={baseClasses}>
          {children}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <a href={href} className={baseClasses}>
          {children}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.button
      {...motionProps}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </motion.button>
  );
};
