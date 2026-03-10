---
name: cookbook_generator
description: Generate a complete, production-grade Jupyter Notebook cookbook for any newly released LLM. Use this skill when a user provides a model name, documentation link, or release notes and wants a structured developer cookbook (.ipynb) generated automatically. Produces runnable, well-organized notebooks covering setup, basic usage, framework integration, agents, and advanced features. Works from a natural language query and a docs link — no JSON payload required.
---

This skill guides the generation of a complete, developer-ready **LLM Cookbook Jupyter Notebook** for any newly released language model. It is model-agnostic, framework-independent, and works with any agent or assistant capable of reading documentation and writing files.

The user provides a query describing the model — typically a model name, a documentation URL, release notes, or a short description of key features. The skill reads that information, infers the API surface, and produces a structured `.ipynb` file that a developer can open, run, and learn from immediately.

## Planning the Cookbook

Before generating any cells, read and understand the model context:
- **Model identity**: What is the exact API model string? Is there a Pro or variant tier? Who is the provider?
- **API surface**: What SDK does it use? How is the client initialized? What are the key method signatures for chat, streaming, and tool use?
- **Unique capabilities**: What does this model do that others don't? Examples: thinking/reasoning mode, computer use, massive context windows, multimodal input, built-in web search. Each unique capability gets its own dedicated section.
- **Framework compatibility**: Which LangChain chat class wraps this model? Is there a native agents SDK?
- **Constraints**: Are any features environment-dependent (e.g., computer use requires a desktop), require special permissions, or are experimental? Those cells must be commented out with a clear warning.

**CRITICAL**: Read the documentation link before generating. Do not invent API method names, parameter names, or SDK classes. Every code cell must reflect the actual API surface described in the docs or query. If a certain pattern is not documented, do not generate it.

## Notebook Structure

Every generated notebook follows this canonical section order. Do not deviate from it. Model-specific sections are appended after Section 4, never inserted between standard sections.

**Header cell** — A markdown title cell with the model name, release date, a feature summary as bullet points, and a numbered table of contents listing all sections including model-unique ones.

**Section 0 — Setup & Installation** — One `!pip install` code cell with all required packages. One configuration cell importing `os`, setting the API key environment variable as a placeholder (`"sk-..."`), and defining `MODEL = "{model_string}"` as the single source of truth used throughout all cells.

**Section 1 — Basic Usage with {Provider} SDK** — Four subsections, each a markdown title cell followed by one code cell:
- 1.1 Chat Completions API — basic `messages=[...]` request, print response
- 1.2 Responses API or equivalent single-turn variant, if the provider offers one; otherwise skip
- 1.3 Multi-turn Conversation — a 2-turn loop that appends assistant and user messages
- 1.4 Streaming Responses — `stream=True` iteration over chunks; if the model has a thinking/reasoning stream, show it in a dimmed color alongside the final answer

**Section 2 — Framework Integration** — LangChain or the provider's own framework SDK. Four subsections:
- 2.1 Basic chat call using the framework wrapper class (e.g. `ChatOpenAI`, `ChatAnthropic`)
- 2.2 Prompt templates and chains using `ChatPromptTemplate` piped to the LLM
- 2.3 Structured output using Pydantic `BaseModel` and `.with_structured_output()`
- 2.4 Tool calling using `@tool` decorator, `bind_tools()`, and checking `response.tool_calls`

**Section 3 — Building Agents** — Six standard subsections plus one model-specific placeholder:
- 3.1 Basic agent with 2 function tools; run with a sample query
- 3.2 Multi-agent handoffs: 3 specialist agents plus a triage agent that routes between them
- 3.3 Agents as tools: subagents exposed via `.as_tool()` to an orchestrator
- 3.4 Agent with input guardrails that block off-topic queries; show both allowed and blocked cases
- 3.5 Agent with built-in web search and file search tools
- 3.6 Framework agent using LangGraph `create_agent` or equivalent
- 3.7 Placeholder for the model's most distinctive agentic capability (e.g. Native Computer Use); comment out the code and include environment setup instructions

**Section 4 — Advanced Applications** — Seven standard subsections plus one per unique model capability:
- 4.1 Structured output via the native SDK (e.g. `client.chat.completions.parse()`)
- 4.2 Function calling using raw JSON schema tool definitions; parse and print tool call results
- 4.3 RAG pipeline using a `FakeRetriever`, `ChatPromptTemplate`, and `StrOutputParser`
- 4.4 Content generation pipeline: 2-step sequential chain (generate ideas → write final output)
- 4.5 Async batch processing using `AsyncClient` and `asyncio.gather()` over a list of prompts
- 4.6 Multimodal input: pass an image URL and text together; include a commented Option B for base64 local files
- 4.7 JSON mode: `response_format={"type": "json_object"}`; parse with `json.loads()`
- 4.8+ One subsection per model-unique feature inferred from docs: markdown explanation cell followed by a runnable code cell; comment out anything requiring special setup

**Footer cell** — A quick-reference markdown table covering all key model strings, API patterns, SDK calls, and parameters used throughout the notebook. End with an attribution line crediting the documentation source and the generation date.

## Code Style Guidelines

Write code cells that a developer can run without modification, except for replacing the API key placeholder. Follow these rules precisely:

- **Use `MODEL`** everywhere as the constant. Never hardcode the model string in any cell other than the configuration cell in Section 0.
- **Comment out alternatives**: If the model has a Pro or variant tier, include it as a commented-out line directly below the active model constant.
- **Wrap error-prone calls**: Use `try/except` only at natural failure boundaries — JSON parsing with `json.loads()`, structured output parsing, and any call that may return an unexpected type. Do not add defensive error handling to straightforward API calls.
- **Async cells**: Define an `async def main()` function and end the cell with `# await main()`. Do not call `asyncio.run()` inline — this breaks Jupyter kernels.
- **Environment-dependent features**: If a feature requires OS access, a display, a vector store ID, or special permissions, comment out the entire code block and prepend a `# ⚠️ WARNING:` comment explaining the requirement.
- **One concept per cell**: Do not combine unrelated API patterns in a single code cell. Each cell should demonstrate one thing clearly.
- **No hardcoded secrets**: API keys must always be `"sk-..."` or read from `os.environ`. Never include real credentials.
- **No `eval()`**: Use `ast.literal_eval()` for safe expression evaluation, or a dedicated math/expression parser. Never use raw `eval()` on any string.

## Content Guidelines

Write markdown cells that explain without marketing. Follow these rules:

- Keep each markdown cell to 1–3 sentences. If more context is needed, use a short bullet list.
- Name the specific feature or method being demonstrated. Do not write vague intros like "In this section, we will explore...".
- For model-unique features, include one sentence explaining *why* the feature matters and one sentence on typical use cases.
- Use `> ⚠️` blockquotes for environment warnings (e.g., Computer Use, API keys, display requirements).
- The header cell's table of contents must number every section including model-unique ones, so the full notebook scope is visible at a glance.
- **No em dashes**: Never use em dashes (-) in generated markdown cells. Use a regular hyphen (-) or reword the sentence instead.

**NEVER** generate cells that:
- Hallucinate SDK class names, method signatures, or parameter names not found in the provided documentation
- Include working API keys or real credentials
- Mix unrelated patterns in a single code cell to save space
- Reorder the standard sections (0 through 4.7 must always appear in order)
- Skip the quick-reference footer table

## Example Usage

A user invokes this skill with a query like:

> *"Generate a cookbook for Claude Opus 5. Docs: https://docs.anthropic.com/en/api/"*

or

> *"New model just dropped: Gemini 2.5 Pro with 1M context and thinking mode. Here are the release notes: [paste]. Make a cookbook."*

The skill reads the docs link or release notes, infers the SDK (`anthropic`, `google-generativeai`, etc.), the chat class (`ChatAnthropic`, `ChatGoogleGenerativeAI`), the API key variable name, all relevant method signatures, and any unique capabilities. It then generates the complete `.ipynb` file named `{model_name}_cookbook.ipynb` following the structure above — no JSON payload, no manual field filling required.

