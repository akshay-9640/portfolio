// All site text lives here. Edit this file only; components just render it.

export type Heading = { before: string; accent: string };

export const profile = {
  firstName: "AKSHAY",
  name: "Akshay Kumar Boddu",
  headline: "Generative AI Engineer",
  idTitle: "Generative AI Engineer | Agentic AI | RAG & LLM Evaluation",
  location: "Orlando, FL",
  tagline:
    "I build production LLM agents for a top-10 U.S. commercial mortgage lender, from multi-agent workflows and RAG to evaluation and deployment.",
  heroStats: [
    { value: "95-98%", label: "extraction accuracy" },
    { value: "8h → 5m", label: "loan-doc review" },
    { value: "15+", label: "agents orchestrated" },
  ],
  bio: "Nearly 4 years in software engineering, including 2+ years building production LLM agent systems for a top-10 U.S. commercial mortgage lender. I design multi-agent workflows (LangGraph/LangChain, 15+ agents), RAG pipelines, LLM evaluation frameworks, and MCP-based tool integrations. My agents reach 95-98% extraction accuracy and cut loan-document review from about 8 hours to 5 minutes.",
  badgeTech: ["Python", "LangGraph", "FastAPI", "Azure"],
  photo: "/photos/akshay.jpg",
  roles: ["Agentic AI", "LLM Applications", "RAG Pipelines", "LLM Evaluation", "MCP Integrations"],
  pillars: [
    {
      title: "Agents that ship",
      text: "Multi-agent LangGraph/LangChain workflows with human-in-the-loop review, taken from POC through UAT to production.",
    },
    {
      title: "Retrieval that's accurate",
      text: "RAG over large enterprise document sets with Azure AI Search, FAISS and Chroma, using semantic chunking and hybrid search.",
    },
    {
      title: "Evals you can trust",
      text: "Ground-truth test sets, prompt regression tests and structured-output validation, reaching 95-98% accuracy against a 90% target.",
    },
  ],
  resume: "/resume.pdf",
};

export const nav = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Certifications", href: "#certifications" },
  { label: "Experience", href: "#experience" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
];

export const headings: Record<string, Heading> = {
  about: { before: "Hi, I'm", accent: "Akshay Kumar." },
  stack: { before: "The stack behind", accent: "my systems." },
  projects: { before: "Things I've", accent: "built." },
  process: { before: "How I", accent: "work." },
  certifications: { before: "Always", accent: "learning." },
  experience: { before: "Education &", accent: "experience." },
  achievements: { before: "Proud", accent: "moments." },
  contact: { before: "Let's", accent: "connect." },
};

// The stack, organised the way the systems are built: one layer per concern.
// `match` lists extra terms used to find where a tool shows up in projects/experience.
export type Tool = { name: string; match?: string[] };

export const stackLayers: { name: string; role: string; tools: Tool[] }[] = [
  {
    name: "Interfaces & APIs",
    role: "How people and other systems reach the agents.",
    tools: [
      { name: "FastAPI" },
      { name: "React.js", match: ["React"] },
      { name: "Streamlit" },
      { name: "Playwright" },
      { name: "MCP", match: ["MCP server", "Model Context Protocol"] },
    ],
  },
  {
    name: "Agents & orchestration",
    role: "Multi-step workflows, tool calling and human review.",
    tools: [
      { name: "LangGraph" },
      { name: "LangChain" },
      { name: "CrewAI" },
      { name: "Human-in-the-loop", match: ["human-in-the-loop", "escalate", "escalation", "escalates", "Underwriter review", "Screenshot review"] },
      { name: "Tool calling", match: ["tool-calling", "tool calling", "as tools"] },
    ],
  },
  {
    name: "Models",
    role: "Chosen per task on accuracy, reasoning, latency and cost.",
    tools: [
      { name: "GPT-4o" },
      { name: "Claude", match: ["Claude", "Haiku", "Sonnet"] },
      { name: "Llama", match: ["Llama"] },
      { name: "Groq" },
      { name: "Ollama" },
    ],
  },
  {
    name: "Retrieval",
    role: "Getting the right passage out of 150-200 page documents.",
    tools: [
      { name: "Azure AI Search" },
      { name: "FAISS" },
      { name: "Chroma" },
      { name: "Hybrid search" },
      { name: "Semantic chunking", match: ["chunking", "chunk"] },
      { name: "RAG" },
    ],
  },
  {
    name: "Quality & observability",
    role: "Proving it works before it ships, and seeing why when it doesn't.",
    tools: [
      { name: "LLM evaluation", match: ["evaluation", "LLM Evals", "ground truth"] },
      { name: "LangSmith" },
      { name: "Prompt regression tests", match: ["regression"] },
      { name: "Structured-output validation", match: ["structured-output", "Pydantic", "typed"] },
    ],
  },
  {
    name: "Data",
    role: "Where documents, results and history live.",
    tools: [
      { name: "Python" },
      { name: "SQL" },
      { name: "PostgreSQL" },
      { name: "SQL Server" },
      { name: "MongoDB" },
      { name: "SQLite" },
      { name: "pandas" },
      { name: "scikit-learn" },
    ],
  },
  {
    name: "Platform & security",
    role: "Running it in the enterprise, safely.",
    tools: [
      { name: "Azure", match: ["Azure", "ADF", "Synapse"] },
      { name: "AWS", match: ["AWS", "S3", "Lambda", "Glue", "Redshift"] },
      { name: "Docker" },
      { name: "Kubernetes" },
      { name: "CI/CD", match: ["GitHub Actions", "GitLab CI", "Azure DevOps", "Jenkins", "CI/CD"] },
      { name: "Entra ID / OAuth2", match: ["Entra ID", "OAuth2", "JWT"] },
    ],
  },
];

export const projects: {
  title: string;
  status: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  flow: string[];
  study: { problem: string; solution: string; result: string };
}[] = [
  {
    title: "Service Action Request (SER) Agent",
    status: "Deloitte | Production",
    description:
      "Sole-built LLM agent app that drafts underwriting briefs, replacing a 150-minute manual process.",
    tags: ["LangGraph", "MCP", "FastAPI", "Azure"],
    flow: ["Servicer request", "Agent drafts brief", "Underwriter review", "Decision", "Served to client apps over MCP"],
    study: {
      problem:
        "Underwriters spent about 150 minutes per loan-servicer request (such as repair-escrow extensions) assembling a brief by hand.",
      solution:
        "An LLM agent workflow drafts the underwriting brief from the request. It is being packaged as an MCP server so the client's production apps can call the agents as tools; the first integration is into an existing production application.",
      result:
        "Projected 1,000 hours and $117K saved per year on repair-escrow extensions alone (40% efficiency gain for 15-20 underwriters; $290K total opportunity).",
    },
  },
  {
    title: "Multi-Document Reconciliation Agent",
    status: "Deloitte | Production",
    description:
      "Reconciles ESA, PCA, appraisal and zoning reports (150-200 pages each) into one structured output.",
    tags: ["LangChain", "RAG", "LLM Evals", "LangSmith"],
    flow: ["4 reports (150-200 pp each)", "Extract + chunk", "Reconcile across docs", "Validate vs ground truth", "One structured output"],
    study: {
      problem:
        "Reviewing environmental, property-condition, appraisal and zoning reports for one loan took about 8 hours.",
      solution:
        "An extraction-and-reconciliation agent in the team's 15+ agent LangGraph orchestration layer, with business-defined ground truth, prompt regression tests and LangSmith tracing.",
      result:
        "Per-loan review dropped from about 8 hours to 5 minutes at 95-98% extraction accuracy against a 90% target.",
    },
  },
  {
    title: "AI-Adoption Dashboard",
    status: "Deloitte | Production",
    description:
      "Tracks GitHub Copilot and Amazon Q usage across 5 business units, with an LLM chatbot on top.",
    tags: ["Python", "LLM Chatbot", "Dashboards"],
    flow: ["Usage report upload", "Per-unit metrics", "Compare + flag inactive users", "LLM chatbot Q&A"],
    study: {
      problem:
        "The client's VP had no single view of how AI coding tools were being adopted across business units.",
      solution:
        "Built as sole developer: leaders upload usage reports, compare units and flag inactive users, and an LLM chatbot answers questions about the data in natural language.",
      result: "One place to see adoption across 5 business units without reading through charts.",
    },
  },
  {
    title: "Computer-Use Automation System",
    status: "Personal | Open source",
    description:
      "An LLM agent discovers a UI flow once and compiles it into a typed, deterministically replayable capability for legacy back-office apps.",
    tags: ["Claude", "Playwright", "Flask", "Pydantic"],
    github: "https://github.com/akshay-9640/interface-ai-computeruse",
    live: "https://interface-ai-computeruse.vercel.app/",
    flow: ["Claude discovers flow", "Capability artifact (typed, versioned)", "Replay with no LLM", "Escalate to human on risk"],
    study: {
      problem:
        "Back-office apps are legacy-styled, have no test IDs and no APIs, so each step needs a person or a brittle script.",
      solution:
        "A Claude tool-calling agent explores a mock banking app once, with login handled by the harness and the irreversible final click gated. Its trace is compiled into a Pydantic-typed artifact that replays deterministically with an error taxonomy, allowlist guardrails, redaction and human escalation on the same live browser session.",
      result:
        "Replay needs no LLM and no API key. Business outcomes like 'member not found' return as results rather than crashes, and restricted accounts escalate to an operator instead of failing.",
    },
  },
  {
    title: "Microfinance API for AI (MCP + Claude Assistant)",
    status: "Personal | Open source",
    description:
      "A Spring Boot back-office API with an AI layer: an MCP server any AI client can plug into, and a Claude assistant that answers questions in plain English.",
    tags: ["MCP", "Claude", "Spring Boot", "Python", "SQLite"],
    github: "https://github.com/akshay-9640/microfinance-api",
    live: "https://microfinance-api-ai.vercel.app/",
    flow: ["Question in plain English", "Claude picks an MCP tool", "Read-only call to the API", "Answer from tool results only"],
    study: {
      problem:
        "Back-office data sits behind a REST API that only developers can query, and AI clients have no safe, typed way to reach it.",
      solution:
        "An MCP server (MCP SDK 2.x, stdio and Streamable HTTP) exposes three read-only, validated tools over the Spring Boot API. A Claude-powered web chat is itself an MCP client of the same tools and shows every call it makes. Login and password endpoints are never exposed to AI.",
      result:
        "Two ways in with one set of tools: plug the server into Claude Desktop or Claude Code, or use the assistant app. Covered by 19 offline tests across Java and Python.",
    },
  },
  {
    title: "Personal Job Agent",
    status: "Personal | Open source",
    description:
      "Self-hosted FastAPI app: Claude tailors a resume and answers for a posting, Playwright fills the real form, and you review before submitting.",
    tags: ["Claude API", "MCP", "FastAPI", "Playwright", "Docker"],
    github: "https://github.com/akshay-9640/Personal-job-agent",
    live: "https://personal-job-agent-backend.vercel.app/",
    flow: ["Add job posting", "Claude scores + tailors", "Playwright fills form (dry run)", "Screenshot review", "You submit"],
    study: {
      problem: "Manually submitting about 20 applications a day is slow, and most of the effort is re-typing the same answers.",
      solution:
        "Haiku scores the match and Sonnet tailors the resume, cover letter and custom answers without inventing facts. A shared DOM scanner fills Greenhouse and Lever forms (Workday is partial). Radio and checkbox questions such as work authorization are never auto-answered. It runs as a private, single-user Docker instance behind a sign-in page, with a built-in MCP server so Claude Desktop or Claude Code can add jobs and tailor applications; form filling and submitting are deliberately left out of MCP.",
      result:
        "Nothing auto-submits by default; DRY_RUN and ALLOW_REAL_SUBMIT flags control it, so a wrong guess never reaches an employer.",
    },
  },
  {
    title: "Classwise",
    status: "Personal | Open source",
    description:
      "Claude writes exams from a syllabus and grades short answers against the teacher's rubric, with teacher and student portals and an MCP server.",
    tags: ["Claude API", "MCP", "FastAPI", "Structured Outputs"],
    github: "https://github.com/akshay-9640/classwise",
    live: "https://classwise-kappa.vercel.app/",
    flow: ["Syllabus in", "Claude drafts exam + rubrics", "Code checks, teacher edits", "Students answer", "Rubric-clamped grading + review queue"],
    study: {
      problem:
        "Writing exams and grading short answers by hand takes teachers hours per class, and an AI grader can drift from the rubric or be talked into full marks.",
      solution:
        "Structured outputs return exams and grades as validated objects; the grading schema only allows the rubric's exact criteria, scores are clamped to the rubric, instructions hidden in answers are flagged, and multiple choice is graded in code. Teachers get a course portal with a review queue, students a Year 1 to 4 view of courses and scores, and a 13-tool MCP server runs it from Claude Desktop.",
      result:
        "In a recorded run, a prompt-injection answer scored 1 of 14 and was flagged for review, while simulated strong, average and struggling students scored 14, 9 and 2. Covered by 17 offline tests on a fake Claude client.",
    },
  },
  {
    title: "Pathwise",
    status: "Personal | Open source",
    description:
      "A RAG course advisor that answers from the catalog, handbook and a student's record, where every statement cites a source and every quote is verified in code.",
    tags: ["Claude API", "RAG", "MCP", "FastAPI", "Evals"],
    github: "https://github.com/akshay-9640/pathwise",
    live: "https://pathwise-bo18.vercel.app/",
    flow: ["Student question", "Hybrid retrieval + rule checks", "Claude writes cited statements", "Code verifies every quote", "Answer with highlighted sources"],
    study: {
      problem:
        "Students ask advisors the same questions about prerequisites, credit limits and clashes, and a chatbot answer is useless if nobody can check where it came from.",
      solution:
        "BM25 and local embeddings merged by rank fusion find catalog and handbook passages; eligibility, load, probation and timetable clashes are computed in code and name the rule they apply. Claude answers in statements that each cite a source with a quote, code locates every quote in its source, and the UI highlights the exact passage. An MCP server exposes the advisor and the rule checks to Claude Desktop.",
      result:
        "On a 36-question eval, hybrid retrieval found 99% of expected sources in the top 6 and beat a cross-encoder reranker, and 100% of quotes in Claude's answers were verified. The evals also caught answers whose quotes were real but whose claims were not, which led to code-computed course lists.",
    },
  },
];

export const workflow = [
  { step: "Discover", text: "I spend about half my time with product managers and underwriters, deciding which decisions AI automates and which stay human-reviewed." },
  { step: "Prototype", text: "A working agent on real documents early, so feedback is about behavior, not slides." },
  { step: "Evaluate", text: "Business-defined ground truth (10-50 labeled documents per agent), prompt regression tests and structured-output validation before anything ships." },
  { step: "Demo & UAT", text: "Live demos with the people who'll use it; their feedback goes in before production." },
  { step: "Ship & document", text: "FastAPI + Docker behind Entra ID/OAuth2, CI/CD, plus architecture docs and production-readiness notes." },
];

export const impact = [
  { label: "Underwriting brief (SER)", before: "150 min", after: "agent draft" },
  { label: "Multi-report loan review", before: "8 hrs", after: "5 min" },
  { label: "Form 1005 processing", before: "15-20 min", after: "2 min" },
  { label: "Form 1006 processing", before: "4-8 hrs", after: "3-5 min" },
];

export const certifications: { name: string; issuer: string }[] = [
  { name: "AB-100: Agentic AI Business Solutions Architect", issuer: "Microsoft" },
  { name: "PL-400: Power Platform Developer Associate", issuer: "Microsoft" },
  { name: "Azure AI Engineer Associate", issuer: "Microsoft" },
  { name: "Cloud Practitioner", issuer: "AWS" },
];

export const timeline: {
  title: string;
  org: string;
  when: string;
  bullets: string[];
}[] = [
  {
    title: "Solution Analyst (AI & Enterprise Platform Engineering)",
    org: "Deloitte, Lake Mary, FL",
    when: "Jul 2024 - Present",
    bullets: [
      "Sole developer of the Service Action Request (SER) agent app for a top-10 U.S. commercial mortgage lender, replacing a 150-minute manual process (projected 1,000 hours and $117K saved per year). Packaging it as an MCP server for the client's production applications.",
      "Built a multi-document reconciliation agent for ESA, PCA, appraisal and zoning reports (150-200 pages each), cutting per-loan review from about 8 hours to 5 minutes.",
      "Delivered extraction agents for loan forms 1005 and 1006 with human-in-the-loop review for unstructured sections: 1005 from 15-20 min to about 2 min, 1006 from 4-8 hrs to 3-5 min.",
      "Built LLM evaluation frameworks (10-50 human-labeled documents per agent, prompt regression testing, structured-output validation), reaching 95-98% accuracy against a 90% target.",
      "Integrated the agents into a 15+ agent LangGraph/LangChain layer (4-person team) and used LangSmith tracing to debug and tune multi-agent runs.",
      "Designed RAG architectures with Azure AI Search, FAISS, Chroma, semantic chunking and hybrid search; benchmarked GPT-4o, Claude, Llama and Groq per task on accuracy, latency and cost.",
      "Built FastAPI services in Docker secured with Entra ID, OAuth2 and JWT; built AWS (S3, Lambda, Glue, Redshift) and Azure (ADF, Synapse) data pipelines; automated delivery with GitHub Actions, GitLab CI, Azure DevOps and Jenkins.",
      "Sole developer of an AI-adoption dashboard (GitHub Copilot and Amazon Q usage across 5 business units) with an LLM chatbot for natural-language queries.",
      "Spent about half of my time in discovery with product managers and business teams, led live demos and UAT with underwriters, and wrote architecture documentation and production-readiness recommendations.",
    ],
  },
  {
    title: "Assistant System Engineer",
    org: "TCS (Tata Consultancy Services), Bangalore, India",
    when: "May 2021 - Aug 2022",
    bullets: [
      "Developed enterprise financial platform features with React.js and JavaScript alongside architects and cross-functional Agile teams.",
      "Delivered scalable features that improved performance and quality and reduced post-release defects.",
      "Took part in design discussions, API integrations, testing and CI/CD for large-scale banking applications.",
    ],
  },
  {
    title: "Software Developer",
    org: "Gramtarang Inclusive Development, Visakhapatnam, India",
    when: "Aug 2020 - May 2021",
    bullets: [
      "Developed healthcare CRM modules for patient registration, electronic health records and regulated healthcare data workflows.",
      "Worked with stakeholders to deliver web solutions for secure patient data management.",
    ],
  },
];

export const education = [
  {
    degree: "M.S. Computer and Information Sciences",
    school: "Florida International University, Miami, FL",
    when: "Apr 2024",
  },
  {
    degree: "B.Tech Computer Science Engineering",
    school: "Centurion University, Visakhapatnam, India",
    when: "May 2021",
  },
];

export const gallery = [
  { src: "/photos/fiu-1.jpg", alt: "Akshay at his FIU graduation with his diploma" },
  { src: "/photos/fiu-2.jpg", alt: "Akshay in FIU graduation regalia in front of the FIU backdrop" },
  { src: "/photos/fiu-3.jpg", alt: "Akshay at his FIU graduation" },
];

export const achievements = [
  { value: "95-98%", label: "extraction accuracy vs. 90% target" },
  { value: "8h → 5m", label: "loan-document review time" },
  { value: "$117K", label: "projected annual savings from SER" },
  { value: "15+", label: "agents in the orchestration layer" },
  { value: "4", label: "years in software engineering" },
];

export const contact = {
  email: "akshaykumarboddu019@gmail.com",
  linkedin: "https://www.linkedin.com/in/bodduakshaykumar",
  location: "Orlando, FL",
  github: "https://github.com/akshay-9640",
};
