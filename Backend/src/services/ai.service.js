const Groq = require("groq-sdk");
const puppeteer = require("puppeteer");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
You are an expert technical recruiter.

Analyze the following resume and job description.

Resume:
${resume}

Self Description:
${selfDescription || "Not provided"}

Job Description:
${jobDescription}

Return ONLY valid JSON.

{
  "title":"",
  "matchScore":0,
  "technicalQuestions":[
    {
      "question":"",
      "intention":"",
      "answer":""
    }
  ],
  "behavioralQuestions":[
    {
      "question":"",
      "intention":"",
      "answer":""
    }
  ],
  "skillGaps":[
    {
      "skill":"",
      "severity":"low"
    }
  ],
  "preparationPlan":[
    {
      "day":1,
      "focus":"",
      "tasks":["","",""]
    }
  ]
}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setContent(htmlContent, {
    waitUntil: "networkidle0",
  });

  const pdf = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdf;
}

async function generateResumePdf({
  resume,
  selfDescription,
  jobDescription,
}) {
  const prompt = `
Generate a professional ATS friendly resume in HTML.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

Requirements:

- HTML only
- Beautiful modern design
- ATS friendly
- One page
- Return ONLY JSON

{
 "html":"..."
}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_object",
      },
    });

    const json = JSON.parse(completion.choices[0].message.content);

    return await generatePdfFromHtml(json.html);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  generateInterviewReport,
  generateResumePdf,
};