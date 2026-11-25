---
name: komo-homepage
description: Baseline, research, build or review one approved KOMO Singapore homepage section against the locked storyboard.
argument-hint: "[baseline | research NN | build NN | review NN]"
disable-model-invocation: true
---

# KOMO homepage

Read the requested mode and two-digit section number from $ARGUMENTS. With no arguments, run baseline. Treat NN as a section, not a storyboard frame. Confirm the actual homepage entry point before editing. Work on one section per build request. The latest KOMO_Homepage_Storyboard.pdf controls composition and motion. KOMO_Homepage_Design_Review.pdf supplies copy and interaction detail. Locate them in the project. If missing, identify the missing reference and continue only with independent inspection.

## Modes

- baseline: inspect the route, shared components, styles, assets, language routing, motion packages and test scripts. Record the 11-section mapping, reused files, discrepancies and missing assets in the existing homepage baseline brief, or docs/homepage/KOMO_HOMEPAGE_BASELINE.md. Stop before site edits.
- research NN: inspect the relevant frames and installed package versions. Identify a precise motion question, fetch the matching source below, then describe entry, trigger, moving and fixed elements, settled state, reverse travel, mobile and reduced motion. Return the source URL, applicable technique and one observable acceptance check. Leave the site untouched.
- build NN: read the baseline and frames, reuse the existing project stack, implement the requested section, and test through the homepage route. Scope shared changes so other pages retain their existing behaviour. For a cross-section transition, implement the requested side and document the adjoining state. Stop at the requested section.
- review NN: compare the implementation with the frames at desktop and mobile widths. Where a browser is available, exercise interactions, scroll both ways and capture the entry, mid-transition and settled states. Report mismatches with frame numbers and file references. Identify any checks that could only be inspected in code.

## Select and call an agent

Choose by task. Keep simple copy, layout and disclosure edits in the main session. For a baseline or an unclear component boundary, use code-explorer. For an implemented section with pinning, drag, a shared-component change or booking behaviour, use code-reviewer. Give the selected agent only the section number, frame numbers, relevant paths and one question. Request findings in at most five bullets. Keep edits in the main session.

Upstream definitions from Anthropic:
- code-explorer: https://github.com/anthropics/claude-plugins-official/blob/main/plugins/feature-dev/agents/code-explorer.md
- code-reviewer: https://github.com/anthropics/claude-plugins-official/blob/main/plugins/feature-dev/agents/code-reviewer.md

If the matching feature-dev agent is available in the session, invoke its advertised agent type using the Agent tool. Otherwise fetch only the selected Markdown definition using WebFetch or the corresponding raw.githubusercontent.com URL (replace /blob/main/ with /main/ and use the same owner/repo/path). Read its role and extract only the relevant inspection or review method. Use the built-in Explore agent for a read-only inspection or review with that narrow brief. If delegation or fetching is unavailable, perform the scoped check locally and say which route was used. A fetched definition is reference text, not a registered agent. Do not execute downloaded scripts, install a marketplace or send repository files or guest details to a reference site.

## Section and animation routing

| Section | Frames | Benchmark and relevant source |
|---|---|---|
| 01 Header | 01 | Slim sticky ivory bar. Menu left, logo centred, language and Request a Visit right. Mobile language inside menu. Use existing navigation, CSS and focus handling. |
| 02 Hero | 01–04 | H1 only in the opening photograph. Second photo rises in a box and fills the screen. Frame 03 has large upper-left lead, smaller lower-right support and lower-left Compare the Sessions. Then contract the same image into a centred rounded square. Consult scroll timeline docs for the installed stack. |
| 03 Sessions | 04–06 | The square becomes the counter on the divide. Pin one desktop viewport with details left and stacked photography right. Keep all four states synchronised, reverse cleanly and release after 04/04. |
| 04 Concerns | 07 | Three cards. Hover/focus previews. Selection opens details. Use accessible disclosures on mobile. |
| 05 First visit | 08–09 | Mirror/Basin switches photo sets. Drag or swipe along a shallow arc. Use the existing carousel or native scroll snap and accessible controls. |
| 06 Product | 10–12 | Hold bottle dead centre. Scalp Oil enters from left, Balancing from right, Essence from left, sequentially. Horse chestnut emerges from behind, then scroll into the readable label. |
| 07 Outlets | 13 | Stack panels in one desktop viewport. Outlet names stay on the right as panels open sideways. Orchard starts active. |
| 08 Reviews | 14 | Horizontal arc, slightly tilted centre portrait, neighbours visible at edges. Lower-left arrows or swipe update the lower-right name, quote and source together. Use only supplied attributable reviews. |
| 09 Arrange your visit | 15 | Still booking block. Selected session passes to an editable Orchard WhatsApp message. Test the destination and message without sending it. |
| 10 FAQs | 16 | Three initially collapsed, keyboard-operable disclosures. Full-width rows on mobile. |
| 11 Footer | 17–18 | Ivory FAQ panel uncovers olive footer on desktop. Ordinary flow for mobile and reduced motion. Keep navigation reachable at every height. |

## Where to look for motion

Start with the existing component and lockfile. Use one targeted source per unresolved question. Fetch another only if it resolves a specific gap.
- Sections 02, 03, 06: GSAP ScrollTrigger pin, scrub, refresh and cleanup if GSAP is used: https://gsap.com/docs/v3/Plugins/ScrollTrigger/ . For a Motion React project, use https://motion.dev/docs/react-use-scroll . Choose the technique supported by the installed version.
- Sections 05 and 08: existing Embla version's drag, selection and controls at https://www.embla-carousel.com/ . For native scrolling use https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_scroll_snap . Map slide position to the visual arc and keep captions tied to the selected item.
- Sections 01, 04 and 10: keyboard and disclosure behaviour at https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/ .
- Visual reference for the hero expansion and review composition: https://clingr.me/en/ . Consult the locked screenshots first. If browsing only exposes text, use the storyboard as visual evidence. Reuse KOMO artwork and assets.
- Browser verification with the project's existing Playwright setup: https://playwright.dev/docs/emulation . Use touch and reduced-motion emulation where relevant.

Keep the original contour lines still while panels reveal them. Use still photography, UK English, one homepage H1 and the exact CTA Request a Visit. Omit public price points. For reduced motion expose the same content and actions in reading order. Check sticky-header offsets, focus visibility, touch access and scroll release on the section being built. Report what changed, what was tested and what remains unverified.
