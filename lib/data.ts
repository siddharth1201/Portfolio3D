// ─────────────────────────────────────────────────────────────
// Single source of truth for all portfolio content.
// The 3D scene, sections and navbar all read from here.
// Ported from the 2D portfolio (project-bolt-sb1-csmfvcrg).
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Siddharth Verma",
  firstName: "Siddharth",
  role: "Full Stack + Gen AI Developer",
  tagline:
    "I use AI to eliminate the repetitive, so I can engineer what truly matters—scalable, intelligent systems.",
  location: "Indore, Madhya Pradesh, India",
  email: "siddharthverma1201@gmail.com",
  phone: "+91 8839919484",
  resumeUrl: "/resume.pdf",
  photo: "/myimg.jpg",
};

export const socials = {
  github: "https://github.com/siddharth1201",
  linkedin: "https://www.linkedin.com/in/siddharthverma7952a31a9",
  twitter: "https://twitter.com",
};

export type Project = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  videoId: string; // YouTube id, empty string = no preview
};

export const projects: Project[] = [
  {
    slug: "lask-ai",
    title: "Lask AI — Your Personal Coding Assistant",
    description:
      "An AI-powered VS Code extension that acts as a coding assistant, helping you write code faster and more efficiently.",
    tags: [
      "Python",
      "FastAPI",
      "MongoDB",
      "Gemini Flash 1.5",
      "text-ada-002 embeddings",
      "Faiss Index",
      "Code RAG",
      "AST",
      "Prompt Engineering",
    ],
    githubUrl: "https://github.com/siddharth1201/LaskAI",
    videoId: "iRfluvbTNaA",
  },
  {
    slug: "hrms-chatbot",
    title: "HRMS Chatbot — HR Assistant for Enterprises",
    description:
      "A chatbot providing HR services to employees, managers, and HR teams. Integrated with the Keka HR portal for leave applications and attendance, plus Slack and MS Teams for seamless communication.",
    tags: [
      "Azure OpenAI",
      "Microsoft Bot Builder",
      "Azure Bot Service",
      "Python",
      "FastAPI",
      "Chroma DB",
      "LangChain",
    ],
    githubUrl: "https://github.com/siddharth1201/hrms-on-chat",
    videoId: "E9OLF7G16ZA",
  },
  {
    slug: "shopify-chatbot",
    title: "Shopify Chatbot",
    description:
      "An AI-powered chatbot for Shopify stores that helps customers find products, answer queries, and place orders. Integrated with the Shopify API for seamless communication.",
    tags: [
      "Streamlit",
      "Shopify GraphQL APIs",
      "Python FastAPIs",
      "OpenAI",
      "LangGraph",
      "LangSmith",
      "Chroma DB",
    ],
    githubUrl: "https://github.com/siddharth1201/shopify-chat",
    videoId: "XBV5vPF5Ba8",
  },
  {
    slug: "sage",
    title: "SAGE — Speech Analysis And Guidance Engine",
    description:
      "A call analysis system that evaluates customer calls for problems faced, emotional tone, resolution satisfaction and 140+ such parameters.",
    tags: ["Whisper AI", "GPT-4o-mini", "Prompt Engineering", "LLM Parallelization"],
    githubUrl: "", // private
    videoId: "",
  },
];

export type SkillCategory = {
  id: string;
  label: string;
  skills: { name: string; icon: string }[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "frontend",
    label: "Frontend",
    skills: [
      { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
      { name: "Next.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
      { name: "TypeScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
      { name: "JavaScript", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
      { name: "Tailwind CSS", icon: "https://img.icons8.com/?size=100&id=4PiNHtUJVbLs&format=png&color=000000" },
      { name: "HTML5", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
      { name: "CSS3", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
      { name: "Redux Toolkit", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    skills: [
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
      { name: "Express", icon: "https://img.icons8.com/?size=100&id=2ZOaTclOqD4q&format=png&color=000000" },
      { name: "Python (FastAPI)", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
      { name: "Java (Spring Boot)", icon: "https://img.icons8.com/?size=100&id=A3Ulk2RcONKs&format=png&color=000000" },
      { name: "REST / GraphQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
      { name: "CI/CD", icon: "https://img.icons8.com/?size=100&id=12599&format=png&color=000000" },
      { name: "Nginx", icon: "https://cdn.simpleicons.org/nginx" },
      { name: "JWT / OAuth", icon: "https://cdn.simpleicons.org/jsonwebtokens" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    skills: [
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
      { name: "AWS", icon: "https://img.icons8.com/?size=100&id=33039&format=png&color=000000" },
      { name: "Azure", icon: "https://img.icons8.com/?size=100&id=VLKafOkk3sBX&format=png&color=000000" },
      { name: "GCP", icon: "https://img.icons8.com/?size=100&id=WHRLQdbEXQ16&format=png&color=000000" },
      { name: "Kafka", icon: "https://img.icons8.com/?size=100&id=fOhLNqGJsUbJ&format=png&color=000000" },
      { name: "Claude", icon: "https://img.icons8.com/?size=100&id=H5H0mqCCr5AV&format=png&color=000000" },
      { name: "Copilot", icon: "https://cdn.simpleicons.org/githubcopilot" },
    ],
  },
  {
    id: "genai",
    label: "GenAI",
    skills: [
      { name: "LangChain", icon: "https://cdn.simpleicons.org/langchain" },
      { name: "HuggingFace", icon: "https://cdn.simpleicons.org/huggingface" },
      { name: "CrewAI", icon: "https://blog.crewai.com/content/images/2024/10/crewai_logo.png" },
      { name: "OpenAI", icon: "https://cdn.simpleicons.org/openai" },
      { name: "Google Generative AI", icon: "https://wp-socialnation-assets.s3.ap-south-1.amazonaws.com/wp-content/uploads/2023/04/15165935/Google-Generative-AI.png" },
      { name: "AWS Bedrock", icon: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
      { name: "Azure Cognitive Services", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a8/Microsoft_Azure_Logo.svg" },
      { name: "Vertex AI", icon: "https://cdn.simpleicons.org/googlecloud" },
    ],
  },
];

export const navLinks = [
  { label: "Home", href: "/#home" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Case Studies", href: "/projects" },
  { label: "Contact", href: "/#contact" },
];
