import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getInterviewReportById } from '../services/interview.api'
import '../style/interview.scss'

const NAV_ITEMS = [
  { key: 'technicalQuestions', label: 'Technical questions' },
  { key: 'behavioralQuestions', label: 'Behavioral questions' },
  { key: 'preparationPlan', label: 'Road Map' },
]

const Interview = () => {
  const { interviewId } = useParams()
  const [report, setReport] = useState(null)
  const [activeSection, setActiveSection] = useState('technicalQuestions')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const fetchReport = async () => {
      setLoading(true)
      setError(null)

      try {
        const { interviewReport } = await getInterviewReportById(interviewId)
        if (!cancelled) setReport(interviewReport)
      } catch {
        if (!cancelled) setError('Unable to load interview plan. Please try again.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchReport()
    return () => { cancelled = true }
  }, [interviewId])

  const renderMainContent = () => {
    if (loading) {
      return <p className="interview__placeholder">Loading interview plan…</p>
    }

    if (error) {
      return <p className="interview__placeholder interview__placeholder--error">{error}</p>
    }

    if (!report) return null

    const section = report[activeSection]

    if (!section?.length) {
      return <p className="interview__placeholder">No content available yet.</p>
    }

    if (activeSection === 'preparationPlan') {
      return (
        <ul className="interview__roadmap">
          {section.map((day) => (
            <li key={day.day} className="interview__roadmap-item">
              <div className="interview__roadmap-header">
                <span className="interview__roadmap-day">Day {day.day}</span>
                <span className="interview__roadmap-focus">{day.focus}</span>
              </div>
              <ul className="interview__roadmap-tasks">
                {day.tasks.map((task, index) => (
                  <li key={index}>{task}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )
    }

    return (
      <ul className="interview__questions">
        {section.map((item, index) => (
          <li key={index} className="interview__question">
            <h3 className="interview__question-text">{item.question}</h3>
            <p className="interview__question-intention">
              <span>Intention:</span> {item.intention}
            </p>
            <p className="interview__question-answer">
              <span>Answer:</span> {item.answer}
            </p>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <main className="interview">
      <div className="interview__container">
        {report?.title && (
          <h1 className="interview__title">{report.title}</h1>
        )}

        <div className="interview__layout">
          <nav className="interview__nav" aria-label="Interview sections">
            {NAV_ITEMS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                className={`interview__nav-item${activeSection === key ? ' interview__nav-item--active' : ''}`}
                onClick={() => setActiveSection(key)}
              >
                {label}
              </button>
            ))}
          </nav>

          <section className="interview__main" aria-live="polite">
            {renderMainContent()}
          </section>

          <aside className="interview__gaps">
            <h2 className="interview__gaps-title">Skill Gaps</h2>
            <div className="interview__gaps-tags">
              {report?.skillGaps?.length ? (
                report.skillGaps.map((gap, index) => (
                  <span
                    key={index}
                    className={`interview__tag interview__tag--${gap.severity}`}
                  >
                    {gap.skill}
                  </span>
                ))
              ) : (
                <p className="interview__gaps-empty">No skill gaps identified.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Interview
