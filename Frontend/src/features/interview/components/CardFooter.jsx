import React from 'react'

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3l1.2 4.2L17.5 8.5l-4.3 1.3L12 14l-1.2-4.2L6.5 8.5l4.3-1.3L12 3zM5 17l.7 2.3L8 20l-2.3.7L5 23l-.7-2.3L2 20l2.3-.7L5 17zM19 15l.5 1.8L21.3 17l-1.8.5L19 19l-.5-1.8L16.7 17l1.8-.5L19 15z"
      fill="currentColor"
    />
  </svg>
)

const CardFooter = ({ disabled, onGenerate }) => {
  return (
    <footer className="home__card-footer">
      <button
        type="button"
        className="home__generate-btn"
        onClick={onGenerate}
      >
        <SparkleIcon />
        Generate My Interview Strategy
      </button>
    </footer>
  )
}

export default CardFooter
