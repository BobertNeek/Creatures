# Docking Station Engineer — House Standard (DSE‑HS 1.1)

**Version:** 1.1  
**Scope:** Creatures 3 / Docking Station (C3/DS)  
**Purpose:** Collision‑safe, compiled‑only standards for agents and genomes so deliverables are always drop‑in and stable across worlds.

---

## 1) Deliverables (Non‑Negotiable)
- **Compiled only.** Ship a compiled installer: `.agent` / `.agents`. No bootstrap pages, no loose PRAY recipes, no partial scaffolds.
- **Self‑contained.** Bundle all required `.cos`, `.catalogue`, sprites (`.c16`), sounds (`.wav`) **inside the compiled agent** so the user drops a single file into `My Agents/`.
- **No resource overwrites.** Compiled agents must carry their own catalogue/resources. They **must not overwrite** existing gallery, catalogue, or agent names; use unique prefixes (see §2).
- **Agent Help required.** Include a catalogue tag that binds to the **primary classifier** so in‑game Agent Help shows Name, Version, Description (see §7).

---

## 2) Naming & Metadata
- **Filenames:** `dse_<shortname>_<version>.agents` (SemVer; see §8).  
  *Example:* `dse_algaevendor_1.2.0.agents`
- **Display Name:** Short, explicit, unique in creator list.  
  *Example:* `DSE: Algae Vendor`
- **Bundled asset prefixes:** `dse_<shortname>_…`  
  *Examples:* `dse_algaevendor.c16`, `dse_algaevendor.wav`, `dse_algaevendor.catalogue`

---

## 3) Classifier Registry (Collision‑Safe Blocks)
Use **high species ranges** to avoid community collisions. Choose the **primary** classifier that matches the object role and allocate **helper objects from the same block**.

> **Rule of one primary:** One canonical F/G/S per agent for Agent Help and documentation; helpers live in the same reserved species block.

| Purpose                                         | Engine type | Family | Genus | **Species range (reserved)** |
|-------------------------------------------------|-------------|--------|-------|-------------------------------|
| Connectable gadgets (panels, linkables)         | `comp/vhcl` | 1      | 7     | **60100–60199**               |
| Medical/tools (healers, injectors, utilities)   | `comp`      | 1      | 8     | **60200–60299**               |
| Infrastructure (machine‑like)                   | `comp`      | 1      | 1     | **60300–60399**               |
| Toys                                            | `simp`      | 2      | 21    | **60400–60499**               |
| **NEW:** Vendors/dispensers (food, seeds)       | `comp`      | 1      | 9     | **60500–60599**               |
| **NEW:** Detectors/sensors (monitors, probes)   | `simp`      | 2      | 23    | **60600–60699**               |
| **NEW:** Portals/teleporters                    | `comp`      | 1      | 10    | **60700–60799**               |
| **NEW:** Flora objects (plantable flora items)  | `simp`      | 2      | 22    | **60800–60899**               |
| **NEW:** Scenery/emitters (env. FX/particles)   | `simp`      | 2      | 24    | **60900–60999**               |
| **NEW:** Simple fauna (non‑Creature ‘critters’)*| `simp`      | 2      | 25    | **61000–61099**               |

*Simple fauna = animated/simple lifeforms not using Creature biology; do **not** collide with real Creatures.

> **Reserve discipline:** If you need additional roles, allocate **611xx+** in this table before shipping and keep helpers within the same 100‑wide block.

---

## 4) Scripting Conventions
- **Required event scripts:** `INSTALL`, `REMOVE`, `CREATE`, `ACTIVATE1/2`, `DEACTIVATE`, `TOUCH`, `PICKUP`, `DROP`, `HIT`, `TIMER` (as applicable).
- **Safe targeting:** Use `OWN` by default; avoid global `TARG` flips.
- **Tick cadence:** Default `tick 10` unless design/perf demands otherwise.
- **Performance budget:** Avoid per‑frame heavy loops; cap helper object fan‑out; justify exceptions in Agent Help.
- **Error‑handling & logging:** No console spam. Guard risky ops with `doif…endi`. Debug messages are allowed behind a short prefix (e.g., `outs "[DSE:algaevendor] …"`) and must be removed or disabled for release builds.

### REMOVE Compliance Box (MUST)
On uninstall, your `REMOVE` handler **must**:
1) **Stop timers** on the primary and helper objects.  
2) **Kill all particles/overlays** created by the agent.  
3) **Unhook callbacks/listeners** you registered.  
4) **Delete helpers** in the agent’s reserved block.  
5) **Leave no orphans**: the world state matches pre‑install.

**Example block sweep:**
```caos
* Primary classifier for this agent: 1 7 60100
rscr
* (if you installed any rscr, clear it here; optional if none)
endm

scrp 1 7 60100 4
  enum 1 7 60100 60199
    kill targ
  next
endm
```

---

## 5) Media Specs (Sprites & Sounds)
- **Sprites (`.c16`)**: Prefer power‑of‑two dimensions where feasible; keep consistent frame counts per state; align consistently. `.att` alignment is out of scope unless the agent displays creature sprites.
- **Sounds (`.wav`)**: Mono, 22050 Hz recommended. Keep peaks sane (avoid clipping) and keep short FX under ~2s unless musically intentional.
- **Prefixes:** All media files carry the agent prefix from §2.

---

## 6) Genetics (dna3‑only)
- **Format:** Ship only valid dna3 `.gen` / `.gno` genomes; correct headers/checksums; contiguous indices.
- **Chemistry hygiene:** Receptors/emitters must target **existing** chemicals; half‑lives sane; novel chemicals restricted to **240–249**.
- **No orphans:** No receptor/emitter points to a missing chemical ID.
- **Catalogue mapping (MUST for novel chemicals):** Provide a tiny catalogue block mapping any new chemical IDs to human‑readable names so monitors don’t show mystery numbers.
- **Stability:** Only add novel lobes/instincts if tested stable in‑engine; document them briefly in the Changelog.

---

## 7) Catalogue & Agent Help
- **Default locale:** `en` (English). Additional locales allowed in the same catalogue file as optional blocks.
- **Binding:** Agent Help entry must bind to the **primary classifier** (see §3).
- **Content (minimum):** Name, Version, Short Description, Compatibility (DS standalone / Docked), Known Issues (optional). Keep it brief and factual.

---

## 8) Versioning (SemVer)
- **Filenames and Help** must include SemVer (MAJOR.MINOR.PATCH).
- **Bump rules:**  
  • **MAJOR** for breaking script interfaces, classifier changes, or removal of features.  
  • **MINOR** for new features that are backwards‑compatible.  
  • **PATCH** for bugfixes and non‑breaking tweaks.

---

## 9) Compatibility Targets
- Target **Docking Station (standalone)** by default; must also run in **Docked** worlds unless explicitly marked DS‑only in Agent Help.

---

## 10) Validation Checklist (pre‑ship)
- ✅ Compiled `.agent/.agents` only; self‑contained payload; unique prefixes.  
- ✅ Agent Help present (default `en`), bound to primary classifier; version listed.  
- ✅ Classifier from reserved block; helpers in same block; no collisions.  
- ✅ INSTALL/CREATE/ACTIVATE/DEACTIVATE/TOUCH/PICKUP/DROP/HIT/TIMER present as needed; **REMOVE Compliance Box** satisfied.  
- ✅ No console spam; guarded operations; sane tick/perf budget.  
- ✅ Media meets specs; sounds mono 22050 Hz; sprite frames consistent.  
- ✅ Genetics (if any): dna3 valid; novel chems 240–249; **no orphans**; catalogue mapping provided.  
- ✅ Compatibility stated; inject/uninstall tested; world left clean (no orphans, no lingering listeners).

---

## Why this exists
This standard mirrors proven patterns from working agents to keep installs painless, worlds clean, and collaboration drama‑free: **high, reserved species blocks** to avoid collisions, a **compiled‑only** pipeline so users drop a single file, and a **short checklist** that catches the usual foot‑guns long before release.

---

## Changelog
**1.1**  
- Added roles and reserved species blocks for vendors/dispensers, detectors/sensors, portals, flora, scenery/emitters, and simple fauna.  
- Introduced **REMOVE Compliance Box** and explicit uninstall expectations.  
- Added no‑spam logging policy and minimal debug‑message guidance.  
- Added media tolerances (sprite frame consistency, recommended sound settings).  
- Strengthened genetics: **no orphan chemicals** and **required catalogue mapping** for new IDs.  
- Mandated default `en` locale for Agent Help; optional additional locales.  
- Formalised SemVer bump rules and filename/help requirements.  
- Clarified packaging: no overwrites; unique prefixes; self‑contained resources.

