import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
  });
/**
 * @description Generate an interview report (POST with PDF resume upload)
 */
export const generateInterviewReport = async ({ jobDescription, selfDescription, resumeFile, title }) => {
    const formData = new FormData()
    formData.append("jobDescription", jobDescription)
    formData.append("selfDescription", selfDescription)
    formData.append("title", title)
    if (resumeFile) {
        formData.append("resume", resumeFile)
    }

    const response = await api.post("/api/interview/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    })

    return response.data
}

/**
 * @description Get a single interview report by ID
 */
export const getInterviewReportById = async (interviewId) => {
    // ✅ Fixed: was /api/interview/report/:id (wrong), now /api/interview/:id (correct)
    const response = await api.get(`/api/interview/${interviewId}`)
    return response.data
}

/**
 * @description Get all interview reports for the logged-in user
 */
export const getAllInterviewReports = async () => {
    const response = await api.get("/api/interview/")
    return response.data
}

/**
 * @description Download generated resume PDF
 */
export const generateResumePdf = async ({ interviewReportId }) => {
    // ✅ Fixed: was POST /api/interview/resume/pdf/:id (wrong method + wrong path)
    //           now GET /api/interview/:id/resume-pdf (correct)
    const response = await api.get(`/api/interview/${interviewReportId}/resume-pdf`, {
        responseType: "blob"
    })
    return response.data
}