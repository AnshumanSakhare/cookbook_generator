# Cookbook Workflow

Use this reference when the request includes a model launch, a cookbook, a notebook, release notes, or docs links.

## Goal

Generate a developer-ready Jupyter notebook for the model and save it in the same output folder as the tweets and snippet image.

## Source of Truth

- use the user-provided docs link, release notes, or pasted source material
- do not invent SDK method names, classes, or parameters
- if the API surface is unclear, leave the unsupported part out rather than hallucinating

## Notebook Structure

Follow this section order:
- header cell
- section 0: setup and installation
- section 1: basic usage with provider SDK
- section 2: framework integration
- section 3: building agents
- section 4: advanced applications
- footer cell

Append model-specific sections after the standard advanced sections.

## Planning Checklist

Extract before writing:
- exact model name
- exact API model string
- provider and SDK
- context window
- pricing if available
- speed or latency notes if available
- unique capabilities
- known limits or environment requirements
- framework wrapper class if documented

## File Convention

Save the notebook in the same bundle folder as the tweet drafts and PNG.

Use a filename like:
- `topic-cookbook.ipynb`

Examples:
- `gemini-embedding-2-cookbook.ipynb`
- `gpt-5-mini-cookbook.ipynb`

## Code Rules

- define `MODEL = "{model_string}"` once in the setup section and reuse it everywhere
- keep one concept per code cell
- comment out environment-dependent code with a warning
- use `async def main()` and end async cells with `# await main()`
- never include real credentials
- do not use `eval()`
- only use `try/except` where parsing or type uncertainty makes it necessary

## Content Rules

- keep markdown cells short and concrete
- explain why a model-specific feature matters
- name the exact method or feature being demonstrated
- no marketing language
- no em dashes

## Bundle Expectations

For a typical new model bundle, the folder should contain:
- reaction tweet markdown
- code-post markdown
- code-post PNG
- cookbook or use-case tweet markdown
- comparison tweet markdown when requested
- cookbook notebook
