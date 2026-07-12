const express = require("express")
const interviewController = require("../controllers/interview.controller")
const authMiddleware = require("../middlewares/auth.middleware")
const upload = require("../middlewares/file.middleware")

const interviewRouter = express.Router()

/**
 * @route POST /api/interview/
 * @description Generate interview report (requires resume PDF upload)
 * @access Private
 */
interviewRouter.post(
    "/",
    authMiddleware.authUser,
    upload.single("resume"),
    interviewController.generateInterViewReportController
)

/**
 * @route GET /api/interview/
 * @description Get all interview reports for logged in user
 * @access Private
 */
interviewRouter.get(
    "/",
    authMiddleware.authUser,
    interviewController.getAllInterviewReportsController
)

/**
 * @route GET /api/interview/:interviewId
 * @description Get a single interview report by ID
 * @access Private
 */
interviewRouter.get(
    "/:interviewId",
    authMiddleware.authUser,
    interviewController.getInterviewReportByIdController
)

/**
 * @route GET /api/interview/:interviewReportId/resume-pdf
 * @description Generate and download resume PDF
 * @access Private
 */
interviewRouter.get(
    "/:interviewReportId/resume-pdf",
    authMiddleware.authUser,
    interviewController.generateResumePdfController
)

module.exports = interviewRouter