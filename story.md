Below is the **updated master prompt** optimized for **Antigravity IDE + UI/UX Pro Max skill**. It changes the entire experience to a **light, editorial, cinematic research aesthetic**, while keeping the protagonist as the dominant visual element.

Crucially: **AI-generated images are used only for the fictional protagonist and cinematic environments. All UI, charts, KPI cards, numbers, architecture lines, labels, data particles, and animations must be built with actual HTML/CSS/JS.**

---

# ACUTRADER — LANDING PAGE REDESIGN MASTER PROMPT

Redesign the existing AcuTrader landing page into a premium, cinematic, scroll-driven experience for an **AI-powered quantitative trading and equity research platform**.

The experience should feel like a fusion of:

* Institutional quantitative research
* Editorial storytelling
* Premium technology product design
* Cinematic character-driven narrative
* Modern data visualization

Do **not** create a generic SaaS landing page.

The landing page should tell a visual story:

> **Market noise → Data collection → Intelligence processing → AI analysis → Quantitative models → Trade scenarios → Results**

---

# 1. PRIMARY DESIGN PRINCIPLE

Use **one consistent fictional protagonist** throughout the entire website.

The protagonist represents the trader/researcher navigating an overwhelming financial market and gradually gaining clarity through AcuTrader.

### Character direction

* Fictional person only
* Same face and identity across every scene
* Intelligent, focused, analytical
* Modern but understated wardrobe
* No celebrity resemblance
* No racing or sports references
* Natural, cinematic photography
* Calm, serious expressions
* The protagonist must remain the **primary visual focal point**

The generated images should contain:

* protagonist
* physical environment
* cinematic lighting
* desks, monitors, abstract research spaces where appropriate

The generated images must **NOT** contain:

* readable UI
* dashboards
* charts with text
* KPI cards
* financial numbers
* architecture diagrams
* floating labels
* logos
* interface text

All of those elements must be implemented separately using **HTML, CSS, JavaScript, SVG, Canvas, or WebGL where appropriate**.

---

# 2. VISUAL DIRECTION — LIGHT THEME

The entire experience should use a premium **light editorial theme**.

Avoid dark cyberpunk aesthetics.

## Primary background

Warm off-white:

```css
--bg-primary: #F5F3EE;
```

Secondary surface:

```css
--bg-secondary: #ECEAE4;
```

Cards:

```css
--surface: #FFFFFF;
```

Primary text:

```css
--text-primary: #111318;
```

Secondary text:

```css
--text-secondary: #6B7078;
```

Accent blue:

```css
--accent-blue: #365FD9;
```

Electric analytical lime:

```css
--accent-lime: #C8FF00;
```

Soft positive green:

```css
--positive: #1F9D6A;
```

Negative red:

```css
--negative: #D9534F;
```

---

# 3. COLOR CONTRAST STRATEGY

The design should be visually striking without becoming noisy.

### Use color intentionally:

* **Off-white** → dominant canvas
* **Near-black** → typography and structural hierarchy
* **Electric blue** → system intelligence and interaction
* **Electric lime** → important insights and active signals
* **Soft green/red** → market movement only

Do not overuse gradients.

Use gradients only for:

* hero lighting
* subtle glass surfaces
* hover states
* AI processing effects

The overall appearance should feel:

> **Editorial + Institutional + Modern AI Lab**

---

# 4. TYPOGRAPHY

Use strong contrast between editorial storytelling and technical information.

## Display typography

Large editorial serif or high-character display type for key narrative statements.

Examples:

* Instrument Serif
* DM Serif Display
* Playfair Display
* Bodoni-inspired font

Use for:

* major statements
* emotional transitions
* narrative moments

Example:

> MARKETS DON'T LACK DATA.

Then:

> THEY LACK CLARITY.

---

## Technical typography

Use a clean modern sans-serif.

Examples:

* Inter
* Geist
* Manrope
* IBM Plex Sans

Use for:

* navigation
* descriptions
* KPI values
* architecture labels
* technical details

Use monospaced typography for:

```text
01 / MULTI-SOURCE INGESTION
MODEL / ALL-MINILM-L6-V2
LATENCY / ASYNC PIPELINE
SIGNAL / BULLISH
```

---

# 5. NAVIGATION

Minimal fixed navigation.

### Left

```text
ACUTRADER
AI MARKET INTELLIGENCE
```

### Center / optional

```text
Platform
Research Engine
Architecture
Methodology
Results
```

### Right

Primary CTA:

```text
OPEN PLATFORM →
```

Style:

* rounded rectangular button
* near-black or electric blue
* lime hover accent
* subtle magnetic hover movement

Navigation should remain clean and never compete with the protagonist.

---

# SCENE 01 — THE NOISE

## Objective

Establish the problem.

The market has unlimited information but very little clarity.

## Composition

Full-screen cinematic hero.

The fictional protagonist sits in a bright but atmospheric research environment.

### Character

Position protagonist slightly right of center.

Camera:

* medium-wide shot
* eye-level
* shallow depth of field
* subtle camera push during scroll

The protagonist should be sharp.

Background should become increasingly abstract and softly blurred.

### HTML overlay system

Create floating HTML elements around the character:

* fragmented news headlines
* market prices
* subtle chart fragments
* changing percentages
* ticker symbols
* tiny source cards

These should appear fragmented and layered.

Examples:

```text
EARNINGS BEAT EXPECTATIONS
+4.28%
AAPL
MARKET VOLATILITY ↑
MACRO DATA
NVDA
FED OUTLOOK
```

Do not overload readability.

### Main headline

Large editorial typography:

```text
MARKETS DON'T
LACK DATA.
```

Then:

```text
THEY LACK CLARITY.
```

The second statement should appear as the scroll progresses.

### Scroll interaction

As the user scrolls:

1. Background headlines move at different speeds.
2. Foreground numbers move faster.
3. Irrelevant cards fade.
4. Visual noise compresses toward the protagonist.
5. The camera slowly pushes toward the main screen.
6. A single clean analytical line begins to emerge.

This represents:

> Noise becoming structured intelligence.

---

# SCENE 02 — THE MARKET SPEAKS IN FRAGMENTS

## Objective

Show multi-source market ingestion.

## Composition

Large horizontal cinematic scene.

The protagonist walks through a bright, abstract data environment.

Character positioned on the left-middle.

The environment should feel architectural and minimal.

the main subject along with the chair the table & the computer screen should be easily cropped by removing the background using the macos preview remove background feature 
---

## HTML/CSS DATA SYSTEM

On the right side, build an animated ingestion system entirely with HTML/CSS/SVG.

Source nodes:

```text
MARKET PRICES
HISTORICAL DATA
FUNDAMENTALS
FINANCIAL RSS
NEWS SOURCES
MARKET ACTIVITY
```

Use thin lines and subtle particles.

Do not make this look like a childish network diagram.

### Visual behavior

Particles travel from source cards toward a central processing point:

```text
ACUTRADER
INTELLIGENCE ENGINE
```

Small technical label:

```text
01 / MULTI-SOURCE INGESTION
```

### Parallax layers

```text
BACKGROUND DATA → 0.2x
ENVIRONMENT → 0.4x
PROTAGONIST → 0.6x
SOURCE CARDS → 0.8x
FOREGROUND LABELS → 1.0x
```

Movement should be subtle and smooth.

---

# SCENE 03 — FILTERING THE NOISE

## Objective

Demonstrate the news intelligence pipeline.

This should be one of the strongest visual storytelling moments.

## Character

The protagonist is now positioned centrally, examining information.

Behind and around them, hundreds of HTML-generated information fragments appear.

Examples:

```text
SPORTS NEWS
WEATHER UPDATE
POLITICAL HEADLINE
EARNINGS REPORT
CEO TRANSITION
REVENUE GUIDANCE
MERGER ACTIVITY
```

As the user scrolls, irrelevant information disappears.

The remaining information becomes structured.

---

## Technical process visualization

Build a vertical processing sequence:

```text
RAW NEWS
   ↓
FINANCIAL INTENT
   ↓
SEMANTIC FILTER
   ↓
SOURCE WEIGHTING
   ↓
DEDUPLICATION
   ↓
CATEGORY BALANCING
```

Use animated SVG lines.

The protagonist remains visually dominant.

Technical model label:

```text
all-MiniLM-L6-v2
SentenceTransformer
Cosine Similarity Filtering
```

---

# SCENE 04 — THE AI RESEARCH ENGINE

## Objective

Show raw information becoming structured equity research.

The environment becomes cleaner.

The protagonist now interacts with a large invisible central workspace.

Do not generate the dashboard inside the image.

Instead, create a floating HTML research document.

---

## Research document layout

Animated card:

```text
EQUITY RESEARCH NOTE
────────────────────

OPERATIONS
Positive operating momentum detected.

EARNINGS
Revenue growth above sector expectation.

REGULATION
No material adverse catalyst identified.

OUTLOOK
Moderately bullish over the medium horizon.
```

Animate sections appearing one by one.

Technical label:

```text
02 / GENERATIVE RESEARCH SYNTHESIS
```

Model:

```text
MISTRAL-7B-INSTRUCT
```

Visual metaphor:

Scattered information converges into a clean structured research note.

---

# SCENE 05 — QUANTITATIVE ANALYSIS

## Objective

Show the mathematical intelligence layer.

This scene should transition from qualitative information to quantitative signals.

The protagonist should be shown in a focused analytical pose.

Background:

Bright minimal research lab.

---

## HTML data visualization

Build animated technical modules:

```text
RSI
42.8
NEUTRAL → RECOVERY
```

```text
MACD
BULLISH CROSS
```

```text
VOLATILITY
18.4%
MODERATE
```

```text
200 SMA
SUPPORT DETECTED
```

Use real chart animations built with:

* SVG
* Canvas
* CSS transforms
* chart libraries if already used in the project

Do not use images for charts.

Technical indicators:

```text
RSI
MACD
SMA
BOLLINGER BANDS
ATR
VOLATILITY
```

---

# SCENE 06 — THE PROBABILISTIC ENGINE

## Objective

Show the synthesis of multiple signals.

This is the core intelligence scene.

Use a large central probability visualization built with SVG or Canvas.

Example:

```text
BULL CASE

67%
```

Opposite:

```text
BEAR CASE

33%
```

Signals flow into the probability engine:

```text
TECHNICALS
+
FUNDAMENTALS
+
NEWS SENTIMENT
+
MARKET ACTIVITY
```

↓

```text
PROBABILISTIC STRATEGY ENGINE
```

The protagonist should stand or sit beside the visualization, not behind it.

Do not obscure the face.

---

# SCENE 07 — FROM SIGNAL TO STRATEGY

## Objective

Show actionable trade scenarios.

Split the composition into two large HTML cards.

### Conservative Strategy

```text
CONSERVATIVE

ACCUMULATION ZONE
$200 — $210

TARGET
$225

STOP LOSS
$190
```

### Swing Strategy

```text
SWING

ENTRY
$205

TARGET
$232

RISK
MEDIUM
```

Animate the cards into position as the user scrolls.

Behind them, the protagonist is visible but slightly defocused.

This represents:

> The system has moved from analysis to decision support.

Important:

Do not use language implying guaranteed returns.

Use:

```text
SCENARIO
PROBABILITY
RISK LEVEL
INVALIDATION
```

rather than:

```text
GUARANTEED PROFIT
BEST TRADE
```

---

# SCENE 08 — THE ARCHITECTURE

## Objective

Explain why AcuTrader is fast.

The visual language becomes more technical.

## Architecture

Build the entire architecture using HTML/SVG.

```text
DATA SOURCES
      │
      ▼
PYTHON ML SERVICE
      │
      ├── Pandas
      ├── Technical Analysis
      ├── SentenceTransformers
      ├── LLM Inference
      │
      ▼
ASYNC INSIGHT CACHE
      │
      ▼
NODE.JS + EXPRESS API
      │
      ▼
POSTGRESQL / SUPABASE
      │
      ▼
ACUTRADER PLATFORM
```

Add a second flow:

```text
USER REQUEST
     ↓
NODE API
     ↓
PRE-COMPUTED INSIGHTS
     ↓
< 100ms RESPONSE
```

Use animated packets travelling through the architecture.

No static diagram feeling.

The architecture should feel alive.

---

# FINAL SCENE — CLARITY

Return to the protagonist.

The environment is now clean and calm.

All visual noise has disappeared.

Only subtle market lines and a few meaningful signals remain.

Large final statement:

```text
FROM MARKET NOISE

TO MARKET INTELLIGENCE.
```

Supporting copy:

```text
AcuTrader combines multi-source data ingestion,
semantic filtering, generative research synthesis
and quantitative analysis into structured
market intelligence.
```

Primary CTA:

```text
ENTER ACUTRADER →
```

Secondary:

```text
EXPLORE THE RESEARCH ENGINE
```

---

# 6. MICRO-INTERACTIONS

Implement refined interactions.

### Buttons

* magnetic hover
* subtle 2–4px movement
* background transition
* arrow movement

### Data cards

On hover:

* slight lift
* soft shadow
* border becomes accent blue or lime
* values animate subtly

### Architecture nodes

On hover:

* reveal concise explanation
* connected lines brighten
* associated data particles increase slightly

### Scroll progress

Create a small fixed vertical indicator:

```text
01
02
03
04
05
06
07
08
```

Current section is highlighted.

---

# 7. PARALLAX RULES

Use restrained cinematic parallax.

Never create aggressive movement.

Use:

```css
transform: translate3d()
will-change: transform
```

Avoid layout-triggering animation.

Use:

* `requestAnimationFrame`
* CSS transforms
* opacity
* GSAP ScrollTrigger only if already available or appropriate

Respect:

```css
@media (prefers-reduced-motion: reduce)
```

For mobile:

* reduce parallax significantly
* simplify floating elements
* maintain readability
* avoid horizontal overflow

---

# 8. ACCESSIBILITY

The design must maintain:

* WCAG-friendly contrast
* visible focus states
* keyboard navigation
* semantic HTML
* ARIA labels where necessary
* reduced motion support

Do not sacrifice usability for visual effects.

---

# 9. IMPLEMENTATION RULES

## AI-generated imagery is ONLY for:

* protagonist
* physical environments
* cinematic backgrounds
* atmospheric scenes

## HTML/CSS/JS must generate:

* all text
* headings
* paragraphs
* UI
* dashboards
* KPI cards
* stock numbers
* tickers
* charts
* sparklines
* architecture diagrams
* animated lines
* data particles
* technical labels
* research reports
* probability visualizations
* strategy cards

Do not bake interface elements into images.

---

# 10. IMAGE LAYOUT RULE

Every generated character image should leave **intentional negative space** for HTML overlays.

For example:

### Scene 01

```text
LEFT 35% → headline
CENTER/RIGHT → protagonist
BACKGROUND → blurred environment
```

### Scene 02

```text
LEFT → protagonist
RIGHT → animated ingestion system
```

### Scene 05

```text
CENTER → protagonist/environment
LEFT + RIGHT → technical HTML modules
```

This ensures the generated image and actual interface work together rather than competing.

---

# FINAL CREATIVE DIRECTION

The final landing page should feel like:

> **A cinematic story about transforming information overload into financial intelligence.**

The protagonist is the emotional anchor.

The HTML interface is the analytical layer.

The user should visually experience:

```text
NOISE
↓
INGESTION
↓
FILTERING
↓
AI SYNTHESIS
↓
QUANTITATIVE ANALYSIS
↓
PROBABILISTIC ENGINE
↓
TRADE SCENARIOS
↓
CLARITY
```

Do not make the page look like a template.

Do not use generic SaaS illustrations.

Do not use excessive glassmorphism.

Do not fill every section with cards.

Use **large whitespace, editorial typography, cinematic imagery, controlled motion, strong contrast, and carefully layered HTML data visualizations**.

The final result should feel like a **premium interactive research documentary for an AI quantitative trading platform**, while still clearly communicating the actual AcuTrader technology stack, models, pipeline, architecture, analysis methodology, and resulting market insights.

---

## Recommended implementation structure

```text
LandingPage
├── Navigation
├── Scene01_Noise
├── Scene02_Ingestion
├── Scene03_SemanticFiltering
├── Scene04_AIResearch
├── Scene05_QuantAnalysis
├── Scene06_ProbabilityEngine
├── Scene07_StrategyGeneration
├── Scene08_Architecture
└── FinalCTA
```

For the strongest result, I would implement this as a **single continuous scroll narrative rather than eight disconnected sections**. Each scene should visually transition into the next—for example, the floating noise from Scene 01 physically becomes the incoming data streams in Scene 02, and those streams become filtered research signals in Scene 03. That continuity will make the AcuTrader story feel substantially more premium and cinematic.
