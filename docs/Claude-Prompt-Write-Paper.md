# Prompt: Claude — Write the Final Paper (INF 148, Option 3)

Use this prompt when asking Claude (or another AI) to draft the **5–10 page written report** for the Environmental Field Logger final project. Paste the sections below into the chat and attach or provide access to the listed source files.

---

## Your task

Write the **final written report** for the INF 148 Environmental Field Logger project (Option 3: Programming Guru). The report must be **5–10 pages** when rendered (e.g., PDF). Use the provided outline as the exact structure; **replace every `[PLACEHOLDER: ...]`** with concrete prose, or with a short note (e.g., “[Insert Figure 1: Breadboard layout]”) where the user must add a file or personal detail later.

**Requirements:**

- **Structure:** Follow the section order and headings in `Final-Project-Paper-Outline.md` (Title/abstract → Introduction → Competitors → System design → Access and interface → Security and data → Implementation notes → Group contribution → Conclusion → References → Figures/tables).
- **Tone:** Academic but clear; suitable for a course report. Use third person or “we” consistently.
- **Citations:** Use the references listed in the outline (Kumar et al., Chowdhury et al., Sathyamoorthy et al., Arya et al., Hameed et al., Roostaei et al., EPA Air Sensor Toolbox). Cite in text where the outline or existing bullets already reference them. Add placeholders for “course readings” or “Blynk/Instructure docs” if the syllabus requires them.
- **Placeholders:** Do not leave raw `[PLACEHOLDER: ...]` in the final draft. Either replace with real content or with a clear instruction, e.g. “[Insert screenshot of dashboard here]” or “[Add 1–2 sentences on key result]”.
- **Length:** Aim for 5–10 pages of body content (excluding title page and references). Expand bullet points into short paragraphs where appropriate; keep tables and lists where they aid clarity.
- **Option 3 focus:** Emphasize implementation (firmware, dashboard, virtual pins, data flow) and any difficulties encountered (e.g., ADS1115 I2C, GPS fix) when filling Section 7 and related placeholders.

---

## Source files to use

Read and use these files (paths relative to project root or blynk repo):

| Priority | File | Use for |
|----------|------|--------|
| **Primary** | `code/blynk/Final-Project-Paper-Outline.md` | Section structure, existing bullets, references, placeholders to replace. |
| **Primary** | `code/blynk/Final_Project_Overview.md` | Project summary, pin map, dashboard API, artifact paths, wiring cross-reference. |
| **Context** | `Documents/2025/Breadboard.md` | Current wiring state (two boards, I2C, ADS1115, GPS); for System design and figures. |
| **Context** | `code/blynk/sensor-dashboard/WEBSITE_GUIDE.md` | How the local dashboard works; for Access and interface and Implementation. |
| **Context** | `code/blynk/sensor-dashboard/README.md` | API endpoints, JSON fields; for Implementation and data flow. |
| **Optional** | `code/blynk/Step_by_Step_Wiring_Guide.md` | Step-by-step wiring; for System design / hardware. |
| **Optional** | `code/blynk/Wiring_Table_And_Stability.md` | Pin table, stability; for System design. |
| **Optional** | `code/blynk/ADS1115_Troubleshooting.md` | ADS1115 I2C issues; for Implementation difficulties. |
| **Optional** | `code/blynk/GPS_SAM-M8Q_Blynk_Datastreams.md` | GPS Blynk datastreams (V30–V34); for System design / data flow. |

If available, also use:

- **video_script_and_slide_updates.md** — narrative and slide text; align report wording with presentation.
- **Final_Presentation_Field_Logger1.pdf** — for competitor table, system architecture, component list; describe figures in text if images cannot be embedded.

---

## Placeholders to resolve (checklist)

When writing, ensure each of these is addressed:

1. **Abstract:** Add 1–2 sentences on result or key finding (outline says “[PLACEHOLDER: add 1–2 sentences on result or key finding]”).
2. **Section 4.2:** Replace with a short narrative describing device sketches/diagrams (or “[Insert labeled device sketches; use SYSTEM ARCHITECTURE and COMPONENTS slides as source]”).
3. **Section 5:** Add or reference dashboard/Blynk screenshot (or “[Insert Figure: dashboard screenshot and/or Blynk app view; label components]”).
4. **Section 6:** Clarify where local dashboard stores data — in-memory only or persisted to disk (or state “in-memory; optional persistence to disk”).
5. **Section 7:** Add 1–2 short paragraphs on difficulties (e.g., ADS1115 I2C address/wiring, GPS fix) and how they were solved; use ADS1115_Troubleshooting.md if available.
6. **Section 8:** Replace with “[Names]: hardware/wiring — X; firmware — Y; dashboard — Z; report — W; video — V]” or leave as “[PLACEHOLDER: who did what]. Video: [name], final project INF 148, ~8–10 min.”
7. **Section 9:** Add 1–2 sentences on future work (e.g., more sensors, persistence, alerts, shared dashboards).
8. **References:** Add course readings or Blynk/Instructure docs if required by syllabus.
9. **Figures/tables:** Either embed or write “[Insert Figure 1: Breadboard layout from Breadboard.md]”, etc.; keep Table 1 (competitors), Table 2 (sensor menu), Table 3 (virtual pin map) as in outline.

---

## Output format

- Produce **one continuous document** in Markdown (or clear sections) that can be pasted into a word processor or converted to PDF.
- Use `##` for main sections, `###` for subsections; use bold for key terms where the outline does.
- Keep the References section in the same style as the outline (numbered list, author et al., year, title, journal/source, volume/issue, pages/URL).
- At the end, include a short “Figures and tables” list with captions so the user knows what to insert where.

---

## Optional instruction to paste at the start

You can start your request to Claude with:

```
I need you to write the 5–10 page final report for my INF 148 Environmental Field Logger project (Option 3). Use the outline in Final-Project-Paper-Outline.md as the exact structure. Replace every [PLACEHOLDER: ...] with real content or a clear “[Insert …]” instruction. Use the source files listed in Claude-Prompt-Write-Paper.md (outline, Final_Project_Overview, Breadboard.md, WEBSITE_GUIDE, etc.) for facts and wording. Keep citations from the outline (Kumar, Chowdhury, Sathyamoorthy, Arya, Hameed, Roostaei, EPA). Emphasize implementation and troubleshooting in Section 7. Output one Markdown document ready for conversion to PDF.
```

Then attach or provide the contents of **Final-Project-Paper-Outline.md** and, if possible, **Final_Project_Overview.md** and **Breadboard.md** so Claude has the full context.
