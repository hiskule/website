---
name: Academic Kinetic
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#47464f'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#777680'
  outline-variant: '#c8c5d0'
  surface-tint: '#595a8b'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#151544'
  on-primary-container: '#7e7fb4'
  inverse-primary: '#c1c2fa'
  secondary: '#715c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed320'
  on-secondary-container: '#705b00'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#341003'
  on-tertiary-container: '#b0765f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c1c2fa'
  on-primary-fixed: '#151544'
  on-primary-fixed-variant: '#414272'
  secondary-fixed: '#ffe17a'
  secondary-fixed-dim: '#ecc300'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#554500'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#fbb79d'
  on-tertiary-fixed: '#341003'
  on-tertiary-fixed-variant: '#6a3a27'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  deep-navy: '#0B0B3B'
  electric-gold: '#F6CC13'
  pure-white: '#FFFFFF'
  subtle-gray: '#F4F4F9'
  ink-black: '#05051A'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '800'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 48px
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

The design system is built to bridge the gap between prestigious academic tradition and the high-energy curiosity of secondary education. It targets high school students, aiming to make engineering feel both attainable and exhilarating.

The visual style is **High-Contrast / Bold**, utilizing a "Modern Collegiate" aesthetic. It pairs the institutional weight of deep navy with a vibrant, "electric" golden yellow to create a sense of momentum. The interface relies on crisp execution, heavy-weight typography for impact, and intentional use of negative space to ensure clarity. The overall feel should be "Engineered": precise, functional, yet brimming with youthful potential.

## Colors

The palette is driven by high-contrast pairings to maintain accessibility and visual energy. 

- **Primary (Deep Navy):** Used for primary backgrounds, headings, and foundational structural elements. It conveys authority and the "Skule" heritage.
- **Secondary (Electric Gold):** Used exclusively for calls-to-action, highlights, and critical interactive states. It acts as the "spark" of energy against the dark navy.
- **Neutral:** A pure white base is used for content-heavy sections to ensure readability. 

Interactive elements should leverage the gold against the navy for maximum "pop." Avoid using the gold for body text; reserve it for high-impact accents and primary buttons.

## Typography

This design system uses **Inter** exclusively to achieve a systematic, clean, and engineering-focused look. 

The type hierarchy is characterized by significant contrast in scale. Large "Display" and "Headline" levels use extra-bold weights and tighter letter spacing to create a sense of urgency and confidence. Body text is kept spacious for maximum legibility. 

Labels and small metadata should often use the "Label-Bold" style with all-caps and increased letter-spacing to act as "tags" or "technical markers," reinforcing the engineering theme.

## Layout & Spacing

The layout follows a **Fluid Grid** model based on an 8px rhythm. 

- **Desktop:** A 12-column grid with 24px gutters and 48px outside margins. 
- **Tablet:** An 8-column grid with 20px gutters.
- **Mobile:** A 4-column grid with 16px margins.

Spacing should be used to group related technical concepts. "Stack" units (vertical spacing) are aggressive to keep the UI from feeling cramped. Content blocks should be clearly separated by `stack-lg` to allow each topic to breathe, reflecting an organized, modular engineering mindset.

## Elevation & Depth

This design system avoids traditional soft shadows in favor of **Tonal Layers** and **Bold Outlines**. 

- **Primary Depth:** Achieved through high-contrast color blocking (e.g., a white card on a Deep Navy background).
- **Interactive Depth:** Elements do not "hover" with shadows; instead, they use thick (2px - 3px) solid borders or color inversions.
- **Flat Elevation:** Surfaces are strictly flat. Use `subtle-gray` to differentiate secondary containers from the `pure-white` primary background.

For specialized "Engineering" components like schematics or code blocks, use a subtle "Ghost Border" (1px Deep Navy at 10% opacity) to define boundaries without adding visual weight.

## Shapes

The shape language is **Soft (0.25rem)**. 

While the brand is youthful, overly rounded "pill" shapes are avoided to maintain a professional, technical edge. The small 4px radius on buttons and cards provides a subtle "modern" feel while retaining the structural integrity of a grid-based design. 

Large-scale containers or image masks can occasionally use **Sharp (0px)** corners to create a more "editorial" or "brutalist" look when highlighting major engineering projects.

## Components

- **Buttons:** Primary buttons must be high-impact. Use `Electric Gold` backgrounds with `Deep Navy` text. Use bold, all-caps labels. Secondary buttons should use `Deep Navy` borders (2px) with transparent backgrounds.
- **Input Fields:** Use 2px solid borders. When focused, the border shifts to `Electric Gold`. No shadows.
- **Cards:** White backgrounds with a subtle `subtle-gray` border. Headlines within cards should be `Deep Navy`.
- **Chips/Labels:** Use `Deep Navy` backgrounds with `Electric Gold` text for technical tags (e.g., "Robotics," "Workshop").
- **Lists:** Use custom bullet points (small 4px golden squares) to reinforce the "grid/pixel" engineering aesthetic.
- **Navigation:** The top-tier navigation should be high-contrast, typically `Deep Navy` with `Pure White` links and a `Gold` highlight for the active state or "Apply" button.