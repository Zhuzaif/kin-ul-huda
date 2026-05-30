# Islamic App - Comprehensive UI/UX Documentation

Based on the source code, components, and Tailwind design architecture, this document outlines the exact Global Design System, Screen-by-Screen Matrix, and Interaction/Animation rules required to replicate this application pixel-perfectly.

---

## 1. GLOBAL DESIGN SYSTEM

### 1.1 Color Palette
The application utilizes a calming, pastel-driven color palette designed to exude serenity, warmth, and purity. 

**Neutral & Background Colors**
*   **Warm Beige (Base Bg):** `#FAF8F5`
*   **Warm Beige Dark:** `#F0EAE1`
*   **Period Mode Bg:** `#FCF5F5` (A subtle, warmer tint triggered by context)
*   **Outside Container:** `#E5E7EB` (Gray background outside the mobile preview)

**Primary & Accent Colors**
*   **Soft Mint:** `#E2F0EA`
*   **Soft Mint Dark:** `#B9DBCB` (Used for active states/Taharah)
*   **Deep Mint/Forest:** `#2B604A`, `#1F4535` (Used for text headers, Tasbeeh FAB)
*   **Light Peach:** `#FFF0E6`
*   **Light Peach Dark:** `#FFDCC3` 
*   **Peach Accent text:** `#D98A5B` (Used for headings and Period Mode active text)
*   **Soft Pink:** `#F9E5E6`
*   **Soft Pink Dark:** `#EBB6BA` (Used for Haiz/Period indicators and Heart icons)
*   **Muted Gold:** `#C9A66B`
*   **Muted Gold Light:** `#F8F1E3`

### 1.2 Typography
*   **Primary Font (UI/English):** `Inter` (sans-serif)
    *   *Weights:* 300, 400, 500, 600, 700
    *   *System fallback:* `system-ui, -apple-system, sans-serif`
*   **Secondary Font (Arabic/Script):** `Amiri` (serif)
    *   *Weights:* 400, 700
*   **Scaling:**
    *   H1 / Main Titles: `text-3xl` / `text-[26px]`, `font-bold`, `tracking-tight`
    *   H2 / Card Titles: `text-2xl`, `font-bold`
    *   Subtitles: `text-sm`, `font-medium`, `text-gray-500`
    *   Arabic Verses: `text-[26px]`, `leading-[2]`, `font-arabic`
    *   Body Text: `text-[13px]`, `leading-relaxed`
    *   Micro-Labels / Tags: `text-[10px]`, `uppercase`, `tracking-widest`

### 1.3 Core Component Styling
*   **Container Shape:** Outer app bounds are `sm:rounded-[48px]` with a white `sm:border-[8px]` frame.
*   **Cards:** Standard border radius is `rounded-[32px]` or `rounded-[24px]`. 
*   **Glassmorphism:** Generous use of `bg-white/50`, `bg-white/70`, `backdrop-blur-sm`, and `border-white/60` borders to give a frosted, elevated look.
*   **Shadows:** Soft ambient shadows replacing hard drop-shadows (e.g., `shadow-[0_4px_20px_rgba(0,0,0,0.03)]`).
*   **3D Push Buttons (Gamified Action):**
    *   *Normal State:* Deep box shadow (e.g., `shadow-[0_6px_0_#0F241B]`)
    *   *Pressed State:* Offset transformation (`active:translate-y-[6px]`) removing the box shadow (`active:shadow-[0_0px_0_#0F241B]`) to create a literal "push down" tactile response.

---

## 2. SCREEN-BY-SCREEN MATRIX

### 2.1 Dashboard (Home)
*   **Header:** Greets the user and includes a pill-shaped Period Mode toggle (`w-14 h-8`). Uses `motion` spring layout (`stiffness: 500, damping: 30`) to slide a 24px inner thumb.
*   **Prayer Time Widget (Modal Expand):**
    *   *Normal:* Gradient background (Soft Mint -> Light Mint). Real-time countdown timer (`-02:15:30`).
    *   *Period Mode Active:* Background shifts seamlessly to Light Peach -> Soft Pink. "Next prayer" shifts to "Dhikr Time". 
    *   *Action:* Clicking triggers a modal bottom sheet (spring animation: `y: 100% -> 0`, `damping: 25, stiffness: 200`) revealing the full daily prayer map and Qibla compass button.
*   **Daily Verse Card:**
    *   Displays Arabic + offset translation.
    *   *Parallax:* Uses `motion/react` `useScroll` mapped to a `-20%` to `20%` Y-axis constraint on an opaque SVG pattern.
    *   *Header Icons:* A "Share" (triggers `navigator.share`) and a "Save" heart (triggers pop transition).
*   **Quick Actions (4-Grid):** Updates dynamically. Standard icons (Quran, Tasbeeh) switch entirely to period-friendly tasks (Listen to Quran, Daily Dhikr) when Period Mode is active.

### 2.2 Duas & Dhikr
*   **Top Header & Tabs:** Pill toggle (`bg-white/50 backdrop-blur-sm` wrapper) switching between "All Duas" & "My Prayers". Active states gain `shadow-[0_2px_10px_rgba(0,0,0,0.04)]` and strict white background.
*   **Highlight Card:** Uses `#D98A5B` accents. A background SVG (Cupped hands) rotated `rotate-12` is tucked away in the right bottom edge.
*   **Categories Horizontal Map:** Hide-scrollbar `overflow-x-auto`. Colored tags (Sun/Moon/Waves icons) nested in a pill row.
*   **Dua List Items:** Vertically stacked `rounded-[32px]` cards. Features left-aligned English context and right-aligned (`dir="rtl"`) Arabic blocks. Expandable via Chevron.
*   **Tasbeeh Floating Action Button (FAB):** Positioned bottom-right (`bottom-[100px]`, `right-6`). Features glowing radial aura (`bg-soft-mint-dark/30 blur-xl opacity-50`).

### 2.3 Al-Nisa (Women's Fiqh & Purity Tracker)
*   **Purity Dashboard Card:**
    *   Central circular Ring Tracker SVG (`w-44 h-44`) with `strokeDasharray="28, 100"` dynamically outlining progress.
    *   Tag Legend at bottom representing Haiz (Period), Istihada (Irregular), and Taharah (Pure).
*   **Fiqh Learning Path (Gamified Journey):**
    *   *Background:* Smooth bezier curve SVG track mapped vertically down the background center.
    *   *Hierarchy of Nodes:* 
        *   **Completed:** `w-16 h-16`, Mint Green, green checkmark.
        *   **Active:** Enlarged `w-[88px] h-[88px]`, Gradient Pink to Peach, active glowing aura ring behind it. Pops out with Level info.
        *   **Locked:** `w-16 h-16`, Solid White with Light Gray border, padlock icon.
    *   Each node shifts slightly left or right via margin utilities (e.g., `translate-x-10`, `-translate-x-12`) to follow the winding S-curve visual.
*   **Ask an Aalima FAB:** Positioned bottom-left (`bottom-[100px]`, `left-6`). Horizontal pill enclosing a soft pink circle icon with text context.

### 2.4 Profile & Settings
*   **User Header:** Circular Avatar wrapper with a heavy `blur-xl opacity-70` behind it for a glowing halo effect.
*   **Spiritual Goal Input:** `textarea` component restrained to 200 characters, tracking state via a bottom-right raw character string limit.
*   **Settings List:** Flat, vertically stacked buttons inside `bg-white/70`, generating active states via `active:scale-[0.98]`. Chevrons point right.
*   **Support Us Button:** Spans full width, uses a vibrant gradient (Pink to Peach) to stand out from typical muted settings.

### 2.5 Bottom Navigation
*   Includes 4 distinct icons: Home, Quran, Duas, Al-Nisa, Profile. 
*   Uses dynamic color replacement for active paths (e.g., Al-Nisa switches icon strokes to `text-soft-pink-dark`, Duas switches to `text-muted-gold`).

---

## 3. INTERACTION & ANIMATION RULES

### 3.1 CSS Transitions & Timings
*   **Fade-in (Screen mount):** Almost all primary wrapper nodes adopt a standard Tailwind `animate-in fade-in duration-300` to fade gracefully onto the screen on tab-switch.
*   **Hover & Transformation:** 
    *   Scale transforms for micro-interactions uses `active:scale-[0.98]` or `active:scale-95` to trigger a realistic tactile feel across the board.
    *   Transitions rely strictly on Tailwind's `transition-all duration-300 ease-in-out`.
    *   Colors fade smoothly via `transition-colors duration-500` (especially critical for the Period Mode background shift).

### 3.2 Hardware Level Integration
*   **Haptic Feedback:** The Period Mode Context utilizes standard browser `navigator.vibrate(50)` on activation to inject sensory physical affirmation along with visual state changes.

### 3.3 Framer Motion Specifications (`motion/react`)
*   **Spring Configurations:** When transitioning dynamic UI blocks (like Modals or Toggles), physical spring configurations are utilized over linear tweens (e.g., `type: "spring", stiffness: 500, damping: 30`).
*   **Pop Layouts / Layout Grouping:** Swapping text structures in the PrayerWidget relies on `<AnimatePresence mode="popLayout">`. Incoming nodes transition via `initial={{ opacity: 0, y: 10 }}` to give text a slight bottom-up cascading reveal.
*   **Parallax Mapping:** `useScroll` bounded to a specific ref offsets the vertical `Y` background position relative directly to user scroll position.

### 3.4 Responsive Scalability & Layout 
*   **Scroll Management:** Custom CSS rules hide the webkit scrollbar globally (`::-webkit-scrollbar { display: none; }`) to ensure a native-app feel even when embedded in browsers.
*   **Touch Optimizations:** Buttons and clickable padding envelopes maintain standard minimum hit areas. Padding scales around `p-4` or `p-6` to ensure elements maintain minimum `44x44px` physical touch bounds on mobile viewports.
*   **Wrapper Constraint:** The design restricts growth uniformly, capping physical pixel dimensions at `max-w-[400px]` with centering rules.
