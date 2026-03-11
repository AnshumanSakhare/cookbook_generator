---
name: twitter-post-generator
description: Write Twitter/X posts in this account's builder voice, especially for AI product news, model launches, code snippets, use-case posts, comparisons, roundups, and rewrites that must match existing account style. Use when asked to draft, refine, rewrite, or critique tweets/X posts so they sound like this account instead of generic AI marketing copy.
---

# Twitter Post Generator

Write like a builder talking to another builder.

Load [references/voice-rules.md](references/voice-rules.md) first.
Load [references/account-examples.md](references/account-examples.md) when matching tone, cadence, hook patterns, or deciding whether a draft feels native to the account.
Load [references/cookbook-workflow.md](references/cookbook-workflow.md) when the request includes a model launch, cookbook, notebook, release notes, or docs.
If the request needs a code snippet image, use the bundled script in `scripts/generate-rayso-snippet.js`.

## Local Code Snippet Generator

The skill is self-contained for code snippet images.

Before first use, install dependencies in `.agents/skills/twitter-post-generator/scripts/`:

```powershell
cd .agents\skills\twitter-post-generator\scripts
npm install
```

Generate snippet images with:

```powershell
node .agents\skills\twitter-post-generator\scripts\generate-rayso-snippet.js `
  --file path\to\snippet.ts `
  --language typescript `
  --theme gemini `
  --title "Gemini Embedding 2" `
  --output content\twitter-drafts\2026-03-11-gemini-embedding-2\2026-03-11-gemini-embedding-2-code-post.png
```

## Output Bundle

For model launches or multi-asset requests, create one dedicated bundle folder in `content/twitter-drafts/`.

Use this pattern:
- `content/twitter-drafts/YYYY-MM-DD-topic/`

Put all related outputs for that request inside the same folder:
- tweet draft markdown files
- code snippet PNG files
- cookbook notebook `.ipynb`

For simple one-off rewrites, you may still write directly into `content/twitter-drafts/`. For new model release work, prefer a bundle folder every time.

## Workflow

1. Identify the single job of the post.

Choose one:
- reactive news take
- first reaction to a new model
- code snippet post
- use case / cookbook post
- comparison post
- roundup
- rewrite of an existing draft

Do not merge multiple jobs into one post unless the user explicitly asks for that.

2. Extract the few facts that matter.

For product or model posts, pull only the details builders care about:
- exact model or product name
- concrete capability change
- pricing, context, speed, or reliability if available
- one implication for someone shipping code
- one caveat if it matters

Ignore benchmark theater, marketing adjectives, and background filler.

3. Pick a format before writing.

Use the smallest format that fits:
- `news + builder take` for most announcements
- `code snippet` when there is code, SDK usage, or an implementation angle
- `i tried x` when there is direct testing or hands-on feedback
- `comparison` when one dimension is being compared
- `roundup` for grouped updates
- `resource drop` when pointing to a cookbook, repo, or demo

If the request is about a newly released model, treat it as a bundle unless the user explicitly asks for only one asset.

4. Generate the code snippet image when the post is a code post.

For any `code snippet` post:
- run `scripts/generate-rayso-snippet.js`
- generate the PNG instead of only describing the visual
- save the PNG in the request bundle folder when one exists
- use a matching filename stem for the markdown file and the PNG

Preferred pattern:
- markdown: `content/twitter-drafts/YYYY-MM-DD-topic/YYYY-MM-DD-topic-code-post.md`
- image: `content/twitter-drafts/YYYY-MM-DD-topic/YYYY-MM-DD-topic-code-post.png`

Pass the snippet content, language, title, and preferred output path to the Rayso workflow.
Use sensible defaults unless the user specifies otherwise:
- theme: `gemini`
- dark mode: `true`
- background: `true`
- padding: `32`

If the user provides code, use it as-is unless it is clearly malformed for presentation.
If the user asks for a code post but does not provide code, write the post draft and clearly note that the PNG is pending source code.

5. Generate the cookbook notebook when needed.

For model launches, cookbook drops, or any request that mentions docs, release notes, or a notebook:
- generate a Jupyter notebook `.ipynb`
- save it in the same bundle folder as the tweets and PNG
- use a filename like `topic-cookbook.ipynb`
- follow `references/cookbook-workflow.md`

Never invent SDK method names or parameters.
If the user supplied a docs link or release notes, use those as the source of truth.
If the cookbook cannot be safely completed because the API surface is unclear, keep the tweets grounded and state what source material is missing.

6. Save the draft to a markdown file.

Create a new markdown file for every generation in the bundle folder when one exists. Otherwise use `content/twitter-drafts/`.

Use a meaningful hyphen-case filename that captures the topic and format.
Preferred pattern:
- `YYYY-MM-DD-topic-format.md`

Keep the markdown draft, PNG, and notebook in the same folder for bundled requests. Do not create a nested `assets/` folder for tweet outputs.

Examples:
- `2026-03-11-gemini-embedding-2-reaction.md`
- `2026-03-11-gemini-embedding-2-code-post.md`
- `2026-03-11-openai-promptfoo-comparison.md`
- `gemini-embedding-2-cookbook.ipynb`

Inside the file, include:
- `#` title with the topic
- `## Post`
- the final post text
- `## Visual`
- generated PNG path in the same folder, or `pending` if code was not supplied
- `## Cookbook`
- notebook path in the same folder, or `not requested`
- `## Reply Link`
- `## Notes` for angle, caveats, or why this version works

If multiple options are requested, put them in the same file as:
- `## Option 1`
- `## Option 2`
- `## Option 3`

7. Write in the account voice.

Apply these rules every time:
- lead with the news, observation, or takeaway
- use short lines and short sentences
- keep the tone grounded, direct, and mildly opinionated
- sound like a practitioner, not a journalist or creator
- keep one clear idea per post
- mention the builder implication explicitly
- keep links out of the main post unless the user overrides the account strategy

8. Match what the account actually does.

Prefer these account patterns:
- opening with the product or model name, then the concrete change
- collapsing specs into a practical implication
- using a sharp last line as the take
- using lowercase naturally
- using lists only when they add scan value
- ending with a cookbook, demo, or code asset only when it is real

Avoid patterns the account does not want:
- grand claims like "game-changing" or "revolutionary"
- corporate throat-clearing
- fake certainty
- broad "best model" claims without a task
- thread-like density in a single post

## Output Rules

When drafting, always create the markdown file first, then return:
- the file path
- the main post text
- `visual:` with the generated image path for code posts, otherwise the recommended asset type
- `cookbook:` with the notebook path when one was generated
- `reply link:` only if the post should have a first-reply link

For code posts, do not stop at a recommendation like `code snippet image`.
Actually generate the PNG through the bundled script when the environment allows it.

When giving multiple options, vary the angle, not just the wording.
Good variation axes:
- stack replacement
- implication for builders
- honest test
- comparison on one dimension
- contrarian observation

When rewriting a weak draft:
- keep the core fact
- remove hype
- compress to one idea
- replace abstract language with a concrete builder takeaway

## Model Release Handling

For new model launches, create one bundle folder and write separate posts inside it in this order:
1. first reaction
2. SDK/code snippet
3. concrete use case or cookbook
4. comparison on one dimension
5. notebook cookbook if requested or implied by the workflow

Do not combine all four into one post.

For comparisons:
- compare only one dimension per post
- state whether the comparison is from testing or from published specs
- never declare a universal winner

## Final Check

Reject or rewrite the draft if any of these are true:
- the first line is generic
- the post sounds like it came from the official brand account
- there is no builder takeaway
- more than one main idea is competing
- hype words carry the sentence
- the post could have been written about any product

If the user gives source material, stay faithful to it.
If facts are missing, state the gap or write a version that avoids unsupported claims.
