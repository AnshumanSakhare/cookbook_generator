# Voice Rules

## Core Voice

- write in first person only when it feels natural
- sound like a builder shipping things
- keep sentences short
- let lowercase happen naturally
- stay opinionated, but make the opinion defensible

## What To Optimize For

- strong first line that works alone
- one idea per post
- clear builder implication
- concrete wording over abstract wording
- high reshare value without sounding engineered

## Preferred Formats

### News + Builder Take

Use:
- what happened
- why it matters for builders
- one implication or take

### Code Snippet

Use:
- outcome first
- simplest useful code angle
- one line on when to use it

### I Tried X

Use:
- what you tested
- honest reaction
- what worked or did not

### Roundup

Use:
- short observation hook
- 3 to 5 bullets
- optional closing take

### Resource Drop

Use:
- question or direct hook
- what the resource covers
- link in reply, not in the main post

## New Model Posts

Always extract:
- exact model name
- exact API/model string if relevant
- context window, pricing, speed, or capability change if available
- what changed for builders
- one caveat if relevant

Sequence model posts across multiple posts:
1. reaction
2. code
3. use case
4. comparison

## Do Not Do This

- do not start with background context
- do not use empty praise
- do not say "revolutionary", "incredible", "amazing", "powerful", or "innovative"
- do not stuff in multiple ideas
- do not paste links into the main post by default
- do not use more than one hashtag
- do not make benchmark-only arguments without explaining why they matter
- do not sound like a tech newsletter

## Account Strategy

- normal posts beat threads for now
- 3 posts a day is enough; quality matters more than volume
- links belong in the first reply
- quote tweets only if there is a real take
- on weekends, prefer lighter reaction or roundup content

## File Output Convention

- for model launches or multi-asset requests, create one bundle folder inside `content/twitter-drafts/`
- save every generated draft as a new markdown file in that bundle folder
- use descriptive hyphen-case filenames, not generic names like `tweet-1.md`
- include the date, topic, and format in the filename when possible
- keep the file readable so it can double as an archive of past drafts
- for code posts, save the rendered snippet PNG in the same folder as the markdown draft
- for cookbook requests, save the notebook in the same folder too
- keep the markdown files, PNG, and notebook together in one bundle folder

## Code Post Integration

- when the requested post includes a code snippet, use the local `scripts/generate-rayso-snippet.js` script to create the image
- prefer the `gemini` theme by default unless the user asks otherwise
- the markdown draft should record the actual PNG path, not just say "code snippet image"

## Rewrite Heuristics

When a draft feels wrong, usually fix it by:
- deleting the first sentence
- replacing adjectives with specifics
- turning product claims into builder outcomes
- cutting the second idea
- making the last line sharper
