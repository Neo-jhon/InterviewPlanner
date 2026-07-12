import { createContext, useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { generateInterviewReport, getInterviewReportById, getAllInterviewReports } from "../services/interview.api"

export const InterviewContext = createContext()

export const InterviewProvider = ({ children }) => {
    const [loading, setLoading] = useState(false)
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    /**
     * Generate a new interview report and navigate to the result page.
     * Called from the Home page when the user clicks "Generate My Interview Strategy".
     */
    const handleGenerateReport = async ({ jobDescription, selfDescription, resumeFile, title }) => {
        try {
            setLoading(true)
            setError(null)

            const data = await generateInterviewReport({
                jobDescription,
                selfDescription,
                resumeFile,
                title
            })

            setReport(data.interviewReport)
            // ✅ Navigate to the interview detail page using the real DB ID
            navigate(`/interview/${data.interviewReport._id}`)

        } catch (err) {
            const message = err.response?.data?.message || "Failed to generate interview plan. Please try again."
            setError(message)
            console.error("handleGenerateReport error:", err)
        } finally {
            setLoading(false)
        }
    }

    /**
     * Fetch an interview report by ID (used when page loads or user refreshes).
     */
    const fetchReportById = async (interviewId) => {
        try {
            setLoading(true)
            setError(null)
            const data = await getInterviewReportById(interviewId)
            setReport(data.interviewReport)
        } catch (err) {
            const message = err.response?.data?.message || "Failed to load interview report."
            setError(message)
            console.error("fetchReportById error:", err)
        } finally {
            setLoading(false)
        }
    }

    /**
     * Fetch all reports for the dashboard/history view.
     */
    const fetchAllReports = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await getAllInterviewReports()
            setReports(data.interviewReports)
        } catch (err) {
            const message = err.response?.data?.message || "Failed to load interview reports."
            setError(message)
            console.error("fetchAllReports error:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <InterviewContext.Provider value={{
            loading,
            report,
            setReport,
            reports,
            setReports,
            error,
            setError,
            handleGenerateReport,   // ← use this in Home page
            fetchReportById,        // ← use this in Interview detail page on mount
            fetchAllReports,        // ← use this in reports list/dashboard page
        }}>
            {children}
        </InterviewContext.Provider>
    )
}

// Convenience hook — use this instead of useContext(InterviewContext) everywhere
export const useInterview = () => useContext(InterviewContext)
