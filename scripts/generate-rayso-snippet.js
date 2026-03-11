#!/usr/bin/env node
/**
 * Generates a PNG code snippet image by automating ray.so with Puppeteer.
 *
 * Usage:
 *   node generate-rayso-snippet.js --code "const x = 1" --language javascript --theme gemini --output out.png
 *   node generate-rayso-snippet.js --file ./code.js --language typescript --theme gemini --output out.png
 */

const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) continue;
    const key = argv[i].slice(2);
    const val = argv[i + 1];
    if (val !== undefined && !val.startsWith("--")) {
      result[key] = val;
      i++;
    } else {
      result[key] = true;
    }
  }
  return result;
}

function buildRaySoUrl(opts) {
  const {
    code,
    language = "auto",
    theme = "gemini",
    background = "true",
    darkMode = "true",
    padding = "32",
    title = "Untitled",
  } = opts;

  const encoded = Buffer.from(code).toString("base64");
  const params = new URLSearchParams({
    code: encoded,
    language,
    theme,
    background,
    darkMode,
    padding,
    title,
  });

  return `https://ray.so/#${params.toString()}`;
}

async function waitForFrame(page) {
  const candidates = [
    '[data-testid="frame"]',
    '[class*="DefaultFrame-module"]',
    '[class*="Frame-module__"][class*="__outerFrame"]',
    '[class*="Frame-module__"][class*="__frameContainer"]',
    '[class*="Frame_frame"]',
    '[class*="frame__"]',
    '[class*="SnippetImage"]',
    '[class*="EditorFrame"]',
    '[class*="editor-frame"]',
    "canvas",
  ];

  const deadline = Date.now() + 15000;
  while (Date.now() < deadline) {
    for (const selector of candidates) {
      try {
        const el = await page.$(selector);
        if (el) return selector;
      } catch (_) {
        // Ignore transient selector failures while the page settles.
      }
    }
    await sleep(300);
  }

  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  let code = args.code;
  let tempFilePath = null;
  if (!code && args.file) {
    tempFilePath = path.resolve(args.file);
    if (!fs.existsSync(tempFilePath)) {
      console.error(`Error: file not found: ${tempFilePath}`);
      process.exit(1);
    }
    code = fs.readFileSync(tempFilePath, "utf8");
  }

  if (!code) {
    console.error(
      'Usage:\n' +
        '  node generate-rayso-snippet.js --code "YOUR CODE" [options]\n' +
        "  node generate-rayso-snippet.js --file ./code.js [options]\n\n" +
        "Options:\n" +
        "  --language   javascript|typescript|python|rust|go|css|html|bash|json|sql|auto\n" +
        "  --theme      candy|breeze|midnight|sunset|noir|ice|sand|forest|mono|jasmine|dreamscape|gemini\n" +
        "  --background true|false\n" +
        "  --darkMode   true|false\n" +
        "  --padding    16|32|64|128\n" +
        "  --title      snippet title\n" +
        "  --output     output PNG path\n"
    );
    process.exit(1);
  }

  const outputPath = path.resolve(args.output || "snippet.png");
  const url = buildRaySoUrl({ ...args, code });

  console.log("Opening ray.so...");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 });
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    const frameSelector = await waitForFrame(page);
    if (!frameSelector) {
      throw new Error(
        "Could not locate the snippet frame on ray.so. Check selectors in generate-rayso-snippet.js."
      );
    }

    // Hide all UI chrome (settings bar, toolbar, nav) before screenshotting
    await page.addStyleTag({
      content: `
        [class*="Toolbar"],[class*="toolbar"],
        [class*="Controls"],[class*="controls"],
        [class*="BottomBar"],[class*="bottomBar"],
        [class*="ActionBar"],[class*="actionBar"],
        [class*="TopBar"],[class*="topBar"],
        [class*="SettingsBar"],[class*="settingsBar"],
        [class*="ExportBar"],[class*="exportBar"],
        [class*="Header"]:not([class*="Frame"]):not([class*="Editor"]),
        [role="toolbar"], nav, footer
        { display: none !important; }
      `,
    });

    await sleep(1500);

    const frameEl = await page.$(frameSelector);
    if (!frameEl) {
      throw new Error(`Frame element disappeared after being found: ${frameSelector}`);
    }

    // Use clip to the frame's exact bounding box so no overlapping UI leaks in
    const box = await frameEl.boundingBox();
    if (!box) {
      throw new Error("Could not get bounding box of frame element");
    }

    await page.screenshot({
      path: outputPath,
      omitBackground: true,
      clip: {
        x: box.x,
        y: box.y,
        width: box.width,
        height: box.height,
      },
    });

    console.log(`Saved snippet to: ${outputPath}`);

    if (tempFilePath && args.keepTempFile !== "true") {
      fs.unlinkSync(tempFilePath);
      console.log(`Cleaned up temp file: ${tempFilePath}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
