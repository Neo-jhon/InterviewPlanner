import React from 'react'
import FileUploader from './FileUploader'

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M5 20c0-3.314 3.134-6 7-6s7 2.686 7 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const ProfileSection = ({
  resumeFile,
  onResumeChange,
  selfDescription,
  onSelfDescriptionChange,
}) => {
  return (
    <section className="home__section home__section--profile">
      <div className="home__section-header">
        <div className="home__section-title">
          <span className="home__section-icon">
            <UserIcon />
          </span>
          <h2>Your Profile</h2>
        </div>
      </div>

      <FileUploader file={resumeFile} onFileChange={onResumeChange} />

      <div className="home__divider">
        <span>OR</span>
      </div>

      <div className="home__self-desc">
        <label className="home__field-label" htmlFor="selfDescription">
          Quick Self-Description
        </label>
        <textarea
          className="home__textarea home__textarea--small"
          name="selfDescription"
          id="selfDescription"
          value={selfDescription}
          onChange={onSelfDescriptionChange}
          placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
        />
      </div>

      <div className="home__info-banner">
        <span className="home__info-icon">
          <InfoIcon />
        </span>
        <p>
          Either a Resume or a Self-Description is required to generate a personalized plan.
        </p>
      </div>
    </section>
  )
}

export default ProfileSection
