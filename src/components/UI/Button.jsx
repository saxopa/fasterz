import React from 'react'
import PropTypes from 'prop-types'
import '../../styles/Button.css'

export default function Button({
  variant = 'primary',
  children,
  className = '',
  ...props
}) {
  const base = 'btn'
  const style = variant === 'secondary' ? 'btn-secondary' : 'btn-primary'
  return (
    <button className={`${base} ${style} ${className}`} {...props}>
      {children}
    </button>
  )
}

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary']),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
}
