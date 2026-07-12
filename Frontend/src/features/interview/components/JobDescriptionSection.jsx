import React from 'react'

const FolderIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M3 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

const JobDescriptionSection = ({
  value,
  onChange,
  maxLength = 5000,
}) => {
  return (
    <section className="home__section home__section--job">
      <div className="home__section-header">
        <div className="home__section-title">
          <span className="home__section-icon">
            <FolderIcon />
          </span>
          <h2>Target Job Description</h2>
        </div>
        <span className="home__badge">Required</span>
      </div>

      <div className="home__textarea-wrapper">
        <textarea
          className="home__textarea home__textarea--large"
          name="jobDescription"
          id="jobDescription"
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          placeholder="Paste the full job description here... e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
        />
        <span className="home__char-count">
          {value.length} / {maxLength} chars
        </span>
      </div>
    </section>
  )
}

export default JobDescriptionSection
