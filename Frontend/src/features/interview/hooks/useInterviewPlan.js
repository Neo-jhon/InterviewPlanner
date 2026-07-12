/**
 * Hook layer — orchestrates interview plan form state and API calls.
 * UI-only phase: stub implementation. Wire up state + API in a later pass.
 */
export const useInterviewPlan = () => {
  return {
    jobDescription: '',
    selfDescription: '',
    resumeFile: null,
    isGenerating: false,
    setJobDescription: () => {},
    setSelfDescription: () => {},
    setResumeFile: () => {},
    handleGenerate: () => {},
    canGenerate: false,
  }
}
