// ─────────────────────────────────────────────────────────────
// Deep-dive case study content for /projects/[slug] pages.
// Keyed by Project.slug from data.ts. Personalize the wording —
// but every technical claim is grounded in the real stack.
// ─────────────────────────────────────────────────────────────

export type CaseStudy = {
  slug: string;
  subtitle: string;
  overview: string;
  problem: string;
  approach: { heading: string; body: string }[];
  challenges: { challenge: string; solution: string }[];
  learnings: string[];
};

export const caseStudies: Record<string, CaseStudy> = {
  "lask-ai": {
    slug: "lask-ai",
    subtitle: "An AI coding assistant that understands your whole codebase — not just the open file",
    overview:
      "Lask AI is a VS Code extension backed by a FastAPI inference service. It answers questions about a project with codebase-aware responses: instead of guessing from the open file alone, it retrieves the relevant functions, classes and their call relationships, then generates an answer grounded in that context.",
    problem:
      "Generic AI coding assistants only see what you paste or what sits in the active editor window. Real questions rarely live in one file — \"where does this state get mutated?\" or \"why does this helper double-encode?\" need cross-file context. I wanted an assistant that could navigate an entire repository the way a senior teammate would: follow the code, not the cursor.",
    approach: [
      {
        heading: "AST-aware code indexing",
        body: "The repository is parsed into an abstract syntax tree, and every meaningful symbol — functions, classes, methods — is extracted with its source, file path and signature. Parsing before embedding means retrieval operates on semantic units of code rather than arbitrary text chunks, which keeps functions intact and answers grounded in complete definitions.",
      },
      {
        heading: "Code RAG pipeline",
        body: "Each symbol is embedded and indexed in a FAISS vector store, with MongoDB holding the symbol metadata and file mappings. At query time, the question is embedded, nearest neighbours are retrieved, and the matched source is reassembled into the prompt — classic retrieval-augmented generation, tuned for code instead of prose.",
      },
      {
        heading: "Gemini-powered generation",
        body: "Retrieved context plus the user's question goes to Gemini Flash 1.5, chosen for its long context window and latency profile — both matter when you're stuffing several full source files into a prompt inside an interactive editor.",
      },
      {
        heading: "VS Code extension frontend",
        body: "The extension communicates with the FastAPI backend over HTTP, streaming answers into a side panel so the assistant feels native to the editor rather than a browser tab users have to switch away from.",
      },
    ],
    challenges: [
      {
        challenge: "Naive text chunking split functions mid-body, producing retrieval hits that were half a function — useless for explaining behaviour.",
        solution: "Switched to AST-based symbol extraction so every indexed unit is a complete, syntactically valid definition. Retrieval quality jumped immediately because embeddings describe whole functions, not fragments.",
      },
      {
        challenge: "Large repositories mean thousands of symbols, and re-embedding everything on every change is slow.",
        solution: "Incremental indexing — only changed files are re-parsed and re-embedded, with metadata tracked in MongoDB so the FAISS index and the file tree stay in sync.",
      },
    ],
    learnings: [
      "Retrieval quality dominates model quality for grounded code assistants — a cheap model with precise context beats a frontier model with fuzzy context.",
      "ASTs are the right unit of measure for code retrieval; text chunking is a hack that shows immediately.",
      "Editor UX is a latency product — answers that take more than a few seconds stop being used.",
    ],
  },

  "hrms-chatbot": {
    slug: "hrms-chatbot",
    subtitle: "Conversational HR services inside Slack and Teams, wired to a live HRMS portal",
    overview:
      "The HRMS Chatbot is an enterprise assistant that lets employees, managers and HR teams handle day-to-day HR tasks conversationally: applying for leave, checking attendance, and querying policies. It integrates with the Keka HR portal on the backend and meets users where they already work — Microsoft Teams and Slack.",
    problem:
      "HR self-service portals are where productivity goes to die: logins, menus, forms and PDF policies for questions that take ten seconds to ask. Employees avoided them, HR teams drowned in repetitive tickets, and managers couldn't get quick answers about leave balances mid-meeting. The goal was to collapse all of that into a chat message.",
    approach: [
      {
        heading: "Bot Framework + Azure infrastructure",
        body: "The bot is built on Microsoft Bot Builder and hosted as an Azure Bot Service, which gives first-class Microsoft Teams channel support — critical for an enterprise audience — with Slack as an additional channel.",
      },
      {
        heading: "Intent routing with LangChain",
        body: "Free-text messages are routed through a LangChain pipeline that classifies intent (leave application, balance query, attendance, policy question), extracts the relevant parameters, and dispatches to the right handler with validation before anything touches the HRMS.",
      },
      {
        heading: "Keka portal integration",
        body: "A FastAPI middleware layer talks to the Keka HR portal's APIs: fetching balances, submitting leave requests and reading attendance records. Mutations go through validation and confirmation steps in the chat, so a leave application is reviewed in-conversation before it is submitted.",
      },
      {
        heading: "Policy questions via Chroma DB",
        body: "HR policy documents are embedded into Chroma DB, so questions like \"what's the carry-forward policy?\" get grounded, source-backed answers instead of the model improvising company policy.",
      },
    ],
    challenges: [
      {
        challenge: "LLMs hallucinate HR answers — and a wrong leave balance or made-up policy is a genuinely bad failure mode in an enterprise.",
        solution: "Strict separation: anything backed by data (balances, attendance, applications) goes through deterministic API calls with the LLM only handling understanding and formatting; policy questions are grounded via retrieval over the actual documents with citations.",
      },
      {
        challenge: "Conversational applications need multi-turn state — \"apply for leave\" then \"make it from Monday\" must merge into one request.",
        solution: "Slot-filling conversation state per user/session in the Bot Framework dialog stack, so parameters accumulate across messages and the bot asks only for what's missing.",
      },
    ],
    learnings: [
      "In enterprise settings, the LLM is the interface layer, not the data layer — routing and validation belong in deterministic code.",
      "Meeting users inside Teams/Slack matters more than any feature: adoption follows zero new apps to open.",
      "Confirmation flows for write-actions are non-negotiable when the bot can change real HR data.",
    ],
  },

  "shopify-chatbot": {
    slug: "shopify-chatbot",
    subtitle: "A storefront concierge that finds products and checks out orders — conversationally",
    overview:
      "The Shopify Chatbot is a shopping assistant for Shopify stores: customers describe what they're looking for in plain language, the bot searches the catalogue, answers product questions, and can place orders through the Shopify API. Built with a Streamlit frontend over a LangGraph-orchestrated Python service.",
    problem:
      "Store search boxes are keyword matchers — they fail on \"something waterproof under ₹2000 for commuting\", and multi-step purchases generate support tickets. I wanted a storefront layer that behaves like a good in-store clerk: asks clarifying questions, knows the catalogue, and handles the transaction end to end.",
    approach: [
      {
        heading: "LangGraph state machine",
        body: "The conversation is modelled as a graph of states — intent detection, catalogue search, product Q&A, cart management, checkout — with LangGraph handling transitions and looping. Graph-shaped orchestration (versus a linear chain) is what makes multi-turn commerce conversations recover gracefully when users change direction mid-flow.",
      },
      {
        heading: "Shopify GraphQL integration",
        body: "Product searches, variants, inventory and pricing are served through Shopify's GraphQL Admin/Storefront APIs via a FastAPI service layer. GraphQL's single-query shape keeps catalogue lookups efficient — one request assembles product, variant and price data that REST would need several calls for.",
      },
      {
        heading: "Retrieval over the catalogue",
        body: "Product descriptions and attributes are embedded into Chroma DB so natural-language queries map to semantically relevant products, with OpenAI models handling the conversational layer and synthesis.",
      },
      {
        heading: "LangSmith observability",
        body: "Every conversation trace is captured in LangSmith — prompt I/O, tool calls, latencies — which turned debugging commerce flows from guesswork into reading timelines.",
      },
    ],
    challenges: [
      {
        challenge: "Commerce conversations change state mid-sentence — users pivot from browsing to checkout to a product question without warning.",
        solution: "LangGraph's conditional edges let each turn re-evaluate the destination state, so pivots become graph transitions rather than conversation resets.",
      },
      {
        challenge: "Order placement against a live store cannot tolerate \"the model thought it placed the order\".",
        solution: "Cart and checkout operations are explicit, validated tool calls against the Shopify API with human-visible confirmation before submission — the LLM orchestrates, the API commits.",
      },
    ],
    learnings: [
      "Graph orchestration is the right shape for transactional conversations; chains are for pipelines.",
      "Tracing (LangSmith) pays for itself the first week — agentic bugs are invisible without it.",
      "For commerce, keep the LLM out of the commit path: it should draft intent, never execute purchases.",
    ],
  },

  sage: {
    slug: "sage",
    subtitle: "Turning thousands of support calls into structured, scoreable insights",
    overview:
      "SAGE (Speech Analysis And Guidance Engine) ingests recorded customer-support calls and evaluates each one across 140+ parameters: problems the customer faced, emotional tone across the call's arc, resolution satisfaction, compliance points, and more. Built on Whisper for transcription and GPT-4o-mini for analysis, with LLM parallelization to make the volume tractable. (Private project — details shared on request.)",
    problem:
      "Manual call QA reviews a tiny random sample of calls with hours of listening per call, and consistency depends entirely on which reviewer you get. I wanted near-total coverage, parameter-level scoring, and a feedback loop fast enough to change agent behaviour the same week.",
    approach: [
      {
        heading: "Whisper transcription",
        body: "Calls are transcribed with Whisper, preserving speaker turns and timestamps so every downstream analysis can cite the exact moment it refers to.",
      },
      {
        heading: "140+ parameter rubric",
        body: "Each call is scored against a structured rubric covering problem categories, emotional tone progression, resolution quality and process compliance. The rubric is encoded as structured prompts with explicit scoring criteria, so parameter definitions are configuration — not prompt folklore.",
      },
      {
        heading: "LLM parallelization",
        body: "Scoring parameters are grouped and evaluated in parallel across calls, turning a serial hours-per-batch problem into one that scales out — the throughput trick that makes near-100% call coverage economically sensible.",
      },
      {
        heading: "GPT-4o-mini economics",
        body: "GPT-4o-mini hit the accuracy/cost balance for high-volume scoring: cheap enough to run on every call, strong enough at structured classification that parameter-level results stayed consistent across reviewers and re-runs.",
      },
    ],
    challenges: [
      {
        challenge: "Asking one prompt for 140+ parameters produces sloppy, inconsistent scoring deep into the list.",
        solution: "Split the rubric into focused groups evaluated by separate prompts, then merged downstream — each call gets narrow attention, and parallel execution keeps total latency flat.",
      },
      {
        challenge: "Emotional tone isn't a point-in-time label — calls arc, and a summary label loses the story.",
        solution: "Tone is evaluated per segment of the transcript, so the output is a progression (frustrated → heard → satisfied) rather than a single adjective, which is what makes the coaching feedback actionable.",
      },
    ],
    learnings: [
      "At scale, prompt architecture is a throughput problem — rubric partitioning and parallelization matter as much as model choice.",
      "Structured output schemas are the difference between LLM output you can aggregate and output you can only read.",
      "Coverage changes the product: sampling 2% of calls finds anecdotes, scoring 100% finds patterns.",
    ],
  },
};
