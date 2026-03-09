# Skill Name
`cookbook_generator`

---

# Description

The `cookbook_generator` skill generates a complete, structured **LLM Cookbook Jupyter Notebook** for a newly released language model.

Given information about a model — its name, provider, key features, API surface, and usage examples — the skill produces a ready-to-run `.ipynb` file in a developer-friendly cookbook style. The notebook includes markdown explanations, runnable Python code cells, and a final quick-reference table, following a canonical section structure that is consistent across all models.

This skill is **model-agnostic**, **framework-independent**, and compatible with any agent or assistant (Claude, Cursor, Antigravity, custom pipelines, etc.) capable of generating or writing files.

---

# When to Use This Skill

An agent should invoke this skill when:

- A **new LLM model is announced or released** and a practical developer reference is needed.
- **Model documentation, API specs, or feature descriptions** are available as input.
- A **tutorial or onboarding notebook** needs to be generated automatically for internal or public use.
- A team wants a **consistent, reproducible format** for evaluating and documenting new models as they ship.
- The task is to create an **educational or example-driven artifact** without writing it manually.

---

# Inputs

The skill accepts the following structured inputs. All fields except `example_prompts` are required.

| Field | Type | Required | Description |
|---|---|---|---|
| `model_name` | `string` | Yes | The exact model identifier string used in API calls (e.g. `"gpt-5.4"`, `"claude-opus-5"`, `"gemini-2.5-pro"`). |
| `model_variant` | `string` | No | An optional secondary/pro variant model string (e.g. `"gpt-5.4-pro"`). Included as a commented alternative in cells. |
| `provider` | `string` | Yes | The organization releasing the model (e.g. `"OpenAI"`, `"Anthropic"`, `"Google DeepMind"`). |
| `release_date` | `string` | Yes | The release or announcement date of the model (e.g. `"March 2026"`). |
| `key_features` | `list[string]` | Yes | A list of notable capabilities or differentiators. Each feature becomes a bullet point in the intro cell and maps to a dedicated notebook section if unique enough. |
| `sdk_install_command` | `string` | Yes | The pip install command for the model's Python SDK(s) and any relevant integration libraries (e.g. `"pip install openai langchain langchain-openai"`). |
| `api_client_setup` | `object` | Yes | Contains: `import_snippet` (code to import and initialize the client), `env_var` (the API key environment variable name, e.g. `"OPENAI_API_KEY"`), and `model_const` (the Python variable name to use, e.g. `MODEL = "gpt-5.4"`). |
| `api_examples` | `list[object]` | Yes | A list of API usage examples. Each object contains: `section` (section name), `description` (brief explanation), and `code` (a runnable Python code snippet as a string). See structure details below. |
| `documentation_links` | `list[string]` | Yes | One or more URLs or references to official docs, used in the footer attribution cell. |
| `unique_features` | `list[object]` | No | Model-specific advanced capabilities that go beyond the standard template (e.g. Computer Use, Deep Web Research, Extended Thinking). Each object contains: `name`, `description`, and `code`. |
| `example_prompts` | `list[string]` | No | Optional sample user prompts or queries used inside code cells to make examples more expressive. If omitted, generic placeholder prompts are used. |

### `api_examples` Object Structure

Each item in `api_examples` should follow this schema:

```json
{
  "section": "1.1 Chat Completions API",
  "description": "Send a basic chat request using the SDK.",
  "code": "from provider_sdk import Client\n\nclient = Client()\nresponse = client.chat(...)\nprint(response)"
}
```

---

# Output

The skill outputs a single file:

- **File type:** Jupyter Notebook (`.ipynb`)
- **Filename convention:** `{model_name}_cookbook.ipynb` (e.g. `claude_opus_5_cookbook.ipynb`)
- **Cell composition:** Alternating markdown and Python code cells, organized into numbered sections
- **Style:** Developer cookbook — concise explanations followed immediately by runnable code

The notebook must be valid JSON conforming to the Jupyter nbformat 4.x specification and must open without errors in JupyterLab, VS Code, or any standard notebook environment.

---

# Notebook Structure

The generated notebook must follow this canonical section structure, derived from the reference cookbook. Every generated notebook contains all standard sections, with model-specific sections appended after the standard ones.

## Cell Layout

### Header Cell *(Markdown)*
```
# {model_name} — Complete Cookbook

**Model:** `{model_name}` ({release_date})

{one-paragraph summary from key_features}

This notebook covers:
1. Basic Usage — {provider} SDK
2. Framework Integration — LangChain / equivalent
3. Building Agents — tool use, multi-agent, guardrails
4. Advanced Applications — structured output, RAG, multimodal, async, JSON mode
{N}. [Model-Unique Feature Sections, one per unique_feature]

---
```

---

### Section 0 — Setup & Installation *(Markdown + 2 Code cells)*
- **Cell 0.1 (Markdown):** `## 0. Setup & Installation`
- **Cell 0.2 (Code):** `!pip install` command using `sdk_install_command`
- **Cell 0.3 (Code):** Import `os`, set `os.environ["{env_var}"] = "..."`, define `MODEL = "{model_name}"`

---

### Section 1 — Basic Usage with {Provider} SDK *(Markdown + Code cells)*

Each subsection = 1 markdown title cell + 1 code cell.

| Subsection | Content |
|---|---|
| **1.1 Chat Completions API** | Basic `messages=[...]` request, print response |
| **1.2 Responses API** *(if applicable)* | Stateless single-turn API variant, if the provider offers one |
| **1.3 Multi-turn Conversation** | A 2-turn conversation loop, appending assistant + user messages |
| **1.4 Streaming Responses** | Add `stream=True`, iterate chunks, print deltas; include model-specific reasoning/thinking stream if available |

---

### Section 2 — Framework Integration *(Markdown + Code cells)*

Use the appropriate framework wrapper (e.g. `ChatOpenAI`, `ChatAnthropic`, `ChatGoogleGenerativeAI` via LangChain, or the provider's native framework SDK).

| Subsection | Content |
|---|---|
| **2.1 Basic Chat Usage** | Wrap model in framework chat class, `.invoke()` a message |
| **2.2 Prompt Templates + Chains** | Use `ChatPromptTemplate`, build a simple `prompt \| llm` chain |
| **2.3 Structured Output with Pydantic** | Define a `BaseModel`, use `.with_structured_output()` or equivalent |
| **2.4 Tool Calling** | Define 2 tools via `@tool`, `bind_tools()`, check `response.tool_calls` |

---

### Section 3 — Building Agents *(Markdown + Code cells)*

| Subsection | Content |
|---|---|
| **3.1 Basic Agent with Tools** | Create a single agent with 2 function tools; run it with a sample query |
| **3.2 Multi-Agent Handoffs** | Create 3 specialist agents + 1 triage agent with handoff routing |
| **3.3 Agents as Tools (Orchestration)** | Create subagents exposed as tools to an orchestrator agent |
| **3.4 Agent with Guardrails** | Add an input guardrail that blocks off-topic queries; show blocked vs. allowed |
| **3.5 Agent with Web Search & File Search** | Agent using built-in search tools; `WebSearchTool`, `FileSearchTool`, or equivalent |
| **3.6 Framework Agent** | LangGraph or equivalent framework agent using `create_agent` / `AgentExecutor` |
| **3.7 {Model-Unique Agent Feature}** | Placeholder for any model-specific agent capability (e.g. Computer Use); code should be commented out with setup instructions |

---

### Section 4 — Advanced Applications *(Markdown + Code cells)*

| Subsection | Content |
|---|---|
| **4.1 Structured Output (SDK native)** | Use `client.chat.completions.parse()` or equivalent with a Pydantic schema |
| **4.2 Function Calling / Tool Use (SDK native)** | Define tools as JSON schema dicts; call model; parse tool call results |
| **4.3 RAG Pipeline** | LangChain RAG chain using a `FakeRetriever`, `ChatPromptTemplate`, `StrOutputParser` |
| **4.4 Content Generation Pipeline** | 2-step sequential chain: generate ideas → write final content |
| **4.5 Async Batch Processing** | `AsyncClient`, `asyncio.gather()`, concurrent completions for a list of prompts |
| **4.6 Image + Text (Multimodal Input)** | Pass an image URL and text in a single message; Option B: local file via base64 (commented) |
| **4.7 JSON Mode** | Set `response_format={"type": "json_object"}`; parse with `json.loads()` |
| **4.8+ {unique_features}** | One subsection per item in `unique_features` input; include description markdown cell + demo code cell |

---

### Footer Cell *(Markdown)*
A quick-reference table summarizing all key values:

```
---
## Quick Reference

| Feature | Value / Snippet |
|---|---|
| **Model string** | `{model_name}` |
| **Context window** | {context_window} tokens |
| **Chat API** | `client.chat.completions.create(model=MODEL, messages=[...])` |
| **Streaming** | `stream=True` |
| **Structured output** | `client.chat.completions.parse(..., response_format=MyModel)` |
| **LangChain** | `ChatXxx(model="{model_name}")` |
| **Agents SDK** | `Agent(name=..., model=MODEL, tools=[...])` |
| ... | ... |

---
*Notebook generated on {date}. References: {documentation_links}*
```

---

# Behavior

When invoked, the skill must:

1. **Parse all inputs** — validate that required fields are present; raise a descriptive error if any required field is missing.
2. **Map key features to sections** — each item in `key_features` that corresponds to an advanced or model-unique capability (e.g. "1M token context", "thinking mode", "computer use") should generate or annotate a dedicated subsection in Section 4 or its own section after Section 4.
3. **Generate markdown cells** — write concise developer-facing explanations (1–3 sentences). Avoid marketing language. Reference the feature name and purpose.
4. **Generate code cells** — produce idiomatic, runnable Python. Follow these conventions:
   - Use `MODEL` as the constant everywhere instead of hardcoding the model string.
   - Include `try/except` blocks only at natural error boundaries (JSON parsing, structured output parsing).
   - Include commented-out alternatives for model variants, experimental APIs, or environment-dependent features (e.g. computer use requires display access).
   - Use `# await main()` comments for async cells where top-level await may not be available.
   - Keep code cells focused on one concept each.
5. **Order cells consistently** — follow the section structure above exactly. Do not reorder standard sections.
6. **Apply `api_examples` inputs** — inject the provided code snippets into the matching section cells. If `api_examples` provides a snippet for Section 1.1, use that code verbatim (or lightly adapted) in cell 1.1.
7. **Append unique feature sections** — for each item in `unique_features`, append a new subsection after Section 4.7 with a markdown explanatory cell followed by a code cell (commented out if the feature requires special environment setup).
8. **Write the quick reference table** — build the table dynamically from model inputs and section content.
9. **Output the `.ipynb` file** — serialize the notebook as valid nbformat 4.x JSON and write it to `{model_name}_cookbook.ipynb`.

---

# Example Skill Invocation

The following shows how an agent or orchestration system would call this skill:

```json
{
  "skill": "cookbook_generator",
  "inputs": {
    "model_name": "claude-opus-5",
    "model_variant": "claude-opus-5-thinking",
    "provider": "Anthropic",
    "release_date": "April 2026",
    "key_features": [
      "200K token context window",
      "Extended Thinking Mode with visible reasoning chains",
      "Native tool use and agentic workflows",
      "Vision and document understanding",
      "Hybrid reasoning: instant vs. think-before-answer modes"
    ],
    "sdk_install_command": "pip install -qU anthropic langchain langchain-anthropic langgraph pydantic",
    "api_client_setup": {
      "import_snippet": "import anthropic\nclient = anthropic.Anthropic()",
      "env_var": "ANTHROPIC_API_KEY",
      "model_const": "MODEL = \"claude-opus-5-20260401\""
    },
    "api_examples": [
      {
        "section": "1.1 Chat Completions API",
        "description": "Send a basic message using the Anthropic SDK.",
        "code": "import anthropic\nclient = anthropic.Anthropic()\nmessage = client.messages.create(\n    model=MODEL,\n    max_tokens=1024,\n    messages=[{\"role\": \"user\", \"content\": \"Explain transformers in 3 bullet points.\"}]\n)\nprint(message.content[0].text)"
      },
      {
        "section": "1.4 Streaming Responses",
        "description": "Stream the response token-by-token, including thinking blocks when Extended Thinking is enabled.",
        "code": "with client.messages.stream(\n    model=MODEL,\n    max_tokens=1024,\n    messages=[{\"role\": \"user\", \"content\": \"Write a haiku about neural networks.\"}]\n) as stream:\n    for text in stream.text_stream:\n        print(text, end='', flush=True)"
      }
    ],
    "documentation_links": [
      "https://docs.anthropic.com/en/api/",
      "https://python.langchain.com/docs/integrations/chat/anthropic/"
    ],
    "unique_features": [
      {
        "name": "Extended Thinking Mode",
        "description": "Claude Opus 5 can expose its step-by-step reasoning chain before producing a final answer, useful for complex math, code review, and multi-step planning.",
        "code": "# Extended Thinking: set thinking={\"type\": \"enabled\", \"budget_tokens\": 5000}\nresponse = client.messages.create(\n    model=MODEL,\n    max_tokens=8000,\n    thinking={\"type\": \"enabled\", \"budget_tokens\": 5000},\n    messages=[{\"role\": \"user\", \"content\": \"What is 27 * 453 + 88? Show your reasoning.\"}]\n)\nfor block in response.content:\n    if block.type == 'thinking':\n        print('[THINKING]', block.thinking[:200])\n    elif block.type == 'text':\n        print('[ANSWER]', block.text)"
      }
    ],
    "example_prompts": [
      "Explain the difference between REST and GraphQL in 3 bullet points.",
      "Write a Python function to find the longest palindromic substring.",
      "What are the top 3 benefits of microservices architecture?"
    ]
  }
}
```

---

# Example Output

The skill produces a `.ipynb` file with the following conceptual structure (cells listed in order):

```
[Markdown]  Title cell: "# claude-opus-5 — Complete Cookbook"
            Model summary, key features bulleted list, table of contents

[Markdown]  ## 0. Setup & Installation
[Code]      !pip install -qU anthropic langchain langchain-anthropic ...
[Code]      import os; os.environ["ANTHROPIC_API_KEY"] = "sk-..."; MODEL = "claude-opus-5-20260401"

[Markdown]  ## 1. Basic Usage with Anthropic SDK
[Markdown]  ### 1.1 Chat Completions API
[Code]      client.messages.create(...) — basic request + print
[Markdown]  ### 1.2 Multi-turn Conversation
[Code]      2-turn messages list loop
[Markdown]  ### 1.3 Streaming Responses
[Code]      client.messages.stream(...) — delta iteration

[Markdown]  ## 2. Framework Integration (LangChain)
[Markdown]  ### 2.1 Basic ChatAnthropic Usage
[Code]      ChatAnthropic(model=MODEL).invoke(...)
[Markdown]  ### 2.2 Prompt Templates + Chains
[Code]      ChatPromptTemplate | llm chain
[Markdown]  ### 2.3 Structured Output with Pydantic
[Code]      llm.with_structured_output(MyModel)
[Markdown]  ### 2.4 Tool Calling
[Code]      llm.bind_tools([...]) + tool_calls check

[Markdown]  ## 3. Building Agents
[Markdown]  ### 3.1 Basic Agent with Tools
[Code]      Agent with 2 function tools
[Markdown]  ### 3.2 Multi-Agent Handoffs
[Code]      Triage agent routing to specialists
[Markdown]  ### 3.3 Agents as Tools (Orchestration)
[Code]      Subagents exposed via .as_tool()
[Markdown]  ### 3.4 Agent with Guardrails
[Code]      InputGuardrail blocking off-topic queries
[Markdown]  ### 3.5 Agent with Web & File Search
[Code]      Agent with WebSearchTool + FileSearchTool
[Markdown]  ### 3.6 LangGraph Agent
[Code]      create_agent(...) with tools + stream

[Markdown]  ## 4. Advanced Applications
[Markdown]  ### 4.1 Structured Output (SDK native)
[Code]      client.messages.create with json schema
[Markdown]  ### 4.2 Function Calling (SDK native)
[Code]      tools=[ ... json schema dicts ... ]
[Markdown]  ### 4.3 RAG Pipeline
[Code]      FakeRetriever + ChatPromptTemplate chain
[Markdown]  ### 4.4 Content Generation Pipeline
[Code]      2-step idea → post chain
[Markdown]  ### 4.5 Async Batch Processing
[Code]      asyncio.gather() over list of prompts
[Markdown]  ### 4.6 Image + Text (Multimodal)
[Code]      message with image_url + text content
[Markdown]  ### 4.7 JSON Mode
[Code]      response_format=json_object; json.loads()

[Markdown]  ### 4.8 Extended Thinking Mode   ← from unique_features
[Code]      client.messages.create(thinking={...}); print thinking + answer blocks

[Markdown]  --- Quick Reference Table ---
            | Feature | Value | ...
            Footer attribution line
```

---

# Constraints

- **Framework-independent:** The skill itself does not depend on LangChain, LangGraph, or any specific agent framework. It generates code that *uses* those frameworks, but the skill's own execution has no such dependency.
- **Model-agnostic:** No part of the skill hardcodes a specific provider, SDK, or model. All model-specific values flow in through inputs.
- **Reusable across agents:** The skill can be invoked by Claude, Cursor, Antigravity, custom pipelines, or any system that can construct the JSON input payload and write a file.
- **No hallucinated APIs:** The skill must only generate code that uses the API surface described in `api_examples` and `unique_features`. It must not invent method names or parameters not provided in the inputs.
- **Deterministic structure:** The section order (0 → 1 → 2 → 3 → 4 → unique → quick reference) must always be preserved to ensure notebooks are consistent and comparable across models.
- **Safe code generation:** Generated code must not include hardcoded secret values. API keys must always reference environment variables or placeholder strings like `"sk-..."`. No use of `eval()` for untrusted input; use `ast.literal_eval()` or dedicated parsers where evaluation is needed.
