# 🧠 AI Resume Screening Platform

An AI-powered recruitment automation tool that helps recruiters screen resumes instantly using ATS scoring, job-specific criteria, and no-code automation.

---

## 🚀 Features

- 📝 Recruiter registration and login
- 📄 Job posting with custom experience and skill requirements
- 🔗 Shareable application form for applicants
- 📂 Resume upload and secure cloud storage
- 🤖 AI-based resume scoring (via external LLM API)
- ⚙️ Automation with n8n (no-code workflows)
- 📧 Automated recruiter and applicant email notifications
- 📊 Analytics dashboard for application insights
- 🧾 Optional PDF reports and Slack/Discord alerts

---

## ⚙️ Tech Stack

| Layer        | Tech Used                      |
|-------------|---------------------------------|
| 🖥 Frontend   | [V0 by Vercel](https://v0.dev) (React + Tailwind) |
| 🛠 Backend    | V0 + Express API Routes        |
| ☁️ Storage    | Cloudinary / AWS S3 (for resumes) |
| 🔄 Automation | [n8n](https://n8n.io) for workflows |
| 🧠 AI Scoring | GPT / Custom Python API        |
| 📈 Charts     | Recharts / Chart.js            |
| 📬 Emails     | Gmail / SendGrid               |
| 🛡 Auth       | Firebase / JWT                 |

---

## 🧩 How It Works

1. **Recruiter registers** and creates a job post with requirements.
2. **Form link** is shared with applicants.
3. **Applicants submit** details and upload resumes.
4. An **n8n webhook** receives submission → sends resume to AI for scoring.
5. Recruiter receives **AI score, decision, and feedback** automatically.
6. **Analytics dashboard** visualizes insights like avg score, selection rate, and more.

---

## 📂 Folder Structure

- frontend - V0 generated React components (Tailwind styled)
- backend - API endpoints for jobs, recruiters, applicants
-   automation - n8n workflow JSON and API documentation
 -  ai-scoring - Python API for resume parsing and scoring

---

## 🧪 Local Development

```bash
# Clone repo
git clone https://github.com/yourusername/ai-resume-screening.git
cd ai-resume-screening

# Install dependencies
cd frontend
npm install

cd ../backend
npm install

# Run frontend & backend (in separate terminals)
npm run dev
```
# Import and activate n8n workflow from /automation
## 💡 AI + Automation
🔮 Frontend/Backend by V0: Built using prompt-based generation of components and routes

⚙️ n8n Automation:

Webhook triggered on resume submission

Sends resume + job criteria to scoring API

Sends email to recruiter + applicant

Logs result in DB / Google Sheets

Triggers optional Slack/Discord alert
## 📊 Future Improvements
✅ Admin panel for platform moderation

🧠 Feedback-based model training

📁 Multi-role support (HR teams, managers)

🌐 Multilingual form support

🔐 Role-based access & recruiter tiers
## tiers

## 🙌 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

## 📜 License
MIT License © 2025 [Your Name]
## ✨ Credits
Built using V0 by Vercel

Automated with n8n

AI powered by GPT & custom resume parser APIs

