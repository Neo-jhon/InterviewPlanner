import React, { useRef, useState } from 'react'

const UploadIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 16V4m0 0l-4 4m4-4l4 4M4 17v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

const FileUploader = ({ file, onFileChange, accept = '.pdf,.doc,.docx' }) => {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) {
      onFileChange(droppedFile)
    }
  }

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileChange(selectedFile)
    }
  }

  return (
    <div className="home__upload">
      <p className="home__upload-label">
        Upload Resume <span className="home__upload-label-accent">(Best Results)</span>
      </p>

      <div
        className={`home__dropzone${isDragging ? ' home__dropzone--active' : ''}${file ? ' home__dropzone--filled' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
      >
        <span className="home__dropzone-icon">
          <UploadIcon />
        </span>
        {file ? (
          <>
            <p className="home__dropzone-text">{file.name}</p>
            <p className="home__dropzone-hint">Click to replace file</p>
          </>
        ) : (
          <>
            <p className="home__dropzone-text">Click to upload or drag &amp; drop</p>
            <p className="home__dropzone-hint">PDF or DOCX (Max 5MB)</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        hidden
        accept={accept}
        onChange={handleFileSelect}
      />
    </div>
  )
}

export default FileUploader
