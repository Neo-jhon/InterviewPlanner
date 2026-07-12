import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import '../style/home.scss'
import HomeHeader from '../components/HomeHeader'
import JobDescriptionSection from '../components/JobDescriptionSection'
import ProfileSection from '../components/ProfileSection'
import CardFooter from '../components/CardFooter'
import PageFooter from '../components/PageFooter'
import { generateInterviewReport } from '../services/interview.api'

const Home = () => {
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const canGenerate =
    jobDescription.trim().length > 0 &&
    (resumeFile !== null || selfDescription.trim().length > 0)

  const handleGenerate = async () => {
    if (!canGenerate || isGenerating) return

    setIsGenerating(true)

    try {
      const title = jobDescription.trim().split('\n')[0] || 'Interview Plan'
      const { interviewReport } = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
        title,
      })

      navigate(`/interview/${interviewReport._id}`)
    } catch (error) {
      console.error('Failed to generate interview plan:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="home">
      <div className="home__container">
        <HomeHeader />

        <div className="home__card">
          <div className="home__card-body">
            <JobDescriptionSection
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <ProfileSection
              resumeFile={resumeFile}
              onResumeChange={setResumeFile}
              selfDescription={selfDescription}
              onSelfDescriptionChange={(e) => setSelfDescription(e.target.value)}
            />
          </div>

          <CardFooter
           
            onGenerate={handleGenerate}
          />
        </div>

        <PageFooter />
      </div>
    </main>
  )
}

export default Home
