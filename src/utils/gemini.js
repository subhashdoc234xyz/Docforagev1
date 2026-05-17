import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Generates a GitHub README.md using Google Gemini 2.5 Flash.
 * Supports both static env-configured keys and dynamic in-app keys.
 * 
 * @param {string} input - Project description or source code
 * @param {string} inputType - "description" | "code"
 * @param {string} [customApiKey] - Dynamic API key provided by user in UI
 * @returns {Promise<string>} Generated README Markdown
 */
export async function generateREADME(input, inputType, customApiKey) {
  // 1. Resolve API key with hierarchical fallback:
  //    Custom User Key > Vite Env Key > CRA Env Key
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || 
                 (typeof process !== 'undefined' && process.env && process.env.REACT_APP_GEMINI_API_KEY);
  
  const apiKey = (customApiKey && customApiKey.trim()) || (envKey && envKey.trim());

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    throw new Error("API_KEY_MISSING");
  }

  // 2. Initialize the Google Generative AI client
  const genAI = new GoogleGenerativeAI(apiKey);

  // 3. Get the stable Gemini 2.5 Flash model
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an expert developer documentation writer. Generate a complete, professional GitHub README.md file.

The user has provided the following ${inputType === "code" ? "code" : "project description"}:

---
${input}
---

Generate a README.md that includes ALL of the following sections:

1. **Project Title** with a catchy, clean one-liner description
2. **Badges** — use shields.io badges for: language, license (MIT), status (active), and version (1.0.0)
3. **Table of Contents**
4. **About the Project** — what it does and why it exists (2-3 sentences)
5. **Features** — bullet list of 4-6 key features
6. **Tech Stack** — technologies used in a table or list
7. **Getting Started**
   - Prerequisites
   - Installation steps (numbered, with code blocks)
8. **Usage** — how to use it, with code examples
9. **API Documentation** (if relevant from the code/description, else skip gracefully)
10. **Contributing** — short guide on how to contribute
11. **License** — MIT License
12. **Team / Authors** — mention contributors

Rules:
- Use proper GitHub Markdown formatting
- All code blocks must have language identifiers (e.g. \`\`\`bash, \`\`\`js, \`\`\`python)
- Badges must use real shields.io URLs
- Make it look professional, clean, and production-ready
- Detect the programming language and framework automatically from the input
- Output ONLY the raw markdown, no explanations, no preamble, no markdown code block wrapper (do not start with \`\`\`markdown and end with \`\`\`). Output raw Markdown text directly.

Begin the README now:
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
