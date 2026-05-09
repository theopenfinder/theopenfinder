# CLAUDE.md — Frontend Website Rules

## Purpose of the Project
- **Create an open-source directory and search tool website**, called OpenFinder, aimed at 1) increasing visibility and discovery of open-source programs and alternatives, 2) being a consumer-facing tool that can democratize access to open-source ecosystems, which often are developer-facing. 
- OpenFinder aims to be a solution to community complaints of decentralized cross-platform obscurity and non-userfriendliness, with plans to scale to be an open source hub for developers and consumers, from intially providing a clean and accessible taxonomy of open source projects, to later including weekly spotlights, newsletters, open-source job boards, community reviews, tool-submissions, forum/discussions, community created guides, and more.

- **v1 of the site, which will be the focus of this project, will have:**
    - **theopenfinder.com/home** - a homepage, aesthetically clean, with links to browse categories page, browse all tools page, etc.
    - **theopenfinder.com/categories** - browse categories page with subcategories listed and links that lead internally to the tool (e.g. *.com/categories/Media/streaming/jellyfin*, where "Media" is a category, "streaming" is a subcategory of "Media", and "jellyfin" is a streaming tool).
    - **theopenfinder.com/tools** - browse roughly 120 open source tools with sort features (by selecting tag, category, subcategory, release date), each with a tool page and tool quickview/card, ideally using a template/preset made specifically for "toolpages" or "toolcards" that can be applied across all tools, so that we can be more uniform and efficient not having to design each tool page from scratch.
    - **theopenfinder.com/guides** - browse curated platform guides, starter-packs, de-google/de-microsoft stacks, etc.
    - **theopenfinder.com/about** - short mission statement, contact, socials, github, and v2, v3 goals/timeline

- I already have lists of categories, tags, tools, and guides that I will send you when it is time. Your scope of work pertains to primarily to site design and development. We will first set up basic site structure, appearance, themes, page presets/types; then, fill in with few example tool; and lastly, implement across entire tool list.    

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color