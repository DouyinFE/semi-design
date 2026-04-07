# Design System

## Overview
A modern, professional, and flexible interface for enterprise-level applications.
Clean lines, balanced information density, and highly accessible. Designed to be neutral yet highly customizable, providing a reliable and efficient user experience for complex B2B platforms.

## Colors
Semi Design uses a comprehensive CSS variable system to automatically handle Light and Dark modes. **Never hardcode hex values in your code.**

### Semantic Colors (Light / Dark)
- **Primary** (`var(--semi-color-primary)`): CTAs, active states, key interactive elements. (Light: #0064FA / Dark: #54A9FF)
- **Secondary** (`var(--semi-color-secondary)`): Supporting actions, secondary highlights. (Light: #0095EE / Dark: #40B4F3)
- **Tertiary** (`var(--semi-color-tertiary)`): Third-level actions, neutral icons. (Light: #6B7075 / Dark: #888D92)
- **Success** (`var(--semi-color-success)`): Success messages, safe actions. (Light: #3BB346 / Dark: #5DC264)
- **Warning** (`var(--semi-color-warning)`): Warning states, alerts. (Light: #FC8800 / Dark: #FFAE43)
- **Danger** (`var(--semi-color-danger)`): Error states, destructive actions. (Light: #F93920 / Dark: #FC725A)
- **Info** (`var(--semi-color-info)`): Informational messages, neutral feedback. Same hue as Primary. (Light: #0064FA / Dark: #54A9FF)

### Backgrounds & Surfaces (Light / Dark)
- **Page Background** (`var(--semi-color-bg-0)`): The lowest level background. (Light: #FFFFFF / Dark: #16161A)
- **Elevated Surface** (`var(--semi-color-bg-1)`): Cards, containers. (Light: #FFFFFF / Dark: #232429)
- **Modal/Popover Surface** (`var(--semi-color-bg-2)`): Middle layer containers. (Light: #FFFFFF / Dark: #35363C)
- **Fill Default** (`var(--semi-color-fill-0)`): Component backgrounds (e.g., input). (Light: rgba(46,50,56,0.05) / Dark: rgba(255,255,255,0.12))
- **Fill Hover** (`var(--semi-color-fill-1)`): Component hover backgrounds. (Light: rgba(46,50,56,0.09) / Dark: rgba(255,255,255,0.16))
- **Fill Active** (`var(--semi-color-fill-2)`): Component active/pressed backgrounds. (Light: rgba(46,50,56,0.13) / Dark: rgba(255,255,255,0.20))

### Text & Borders (Light / Dark)
- **Primary Text** (`var(--semi-color-text-0)`): Main content. (Light: #1C1F23 / Dark: #F9F9F9)
- **Secondary Text** (`var(--semi-color-text-1)`): Descriptions, secondary content. (Light: rgba(28,31,35,0.8) / Dark: rgba(249,249,249,0.8))
- **Tertiary Text** (`var(--semi-color-text-2)`): Placeholder, disabled-like text. (Light: rgba(28,31,35,0.62) / Dark: rgba(249,249,249,0.6))
- **Outline/Border** (`var(--semi-color-border)`): Default borders and dividers. (Light: rgba(28,31,35,0.08) / Dark: rgba(255,255,255,0.08))

### AI Colors
Semi Design provides dedicated AI-themed color variables for AI-powered features and interfaces:
- **AI General** (`var(--semi-color-ai-general)`): Gradient-based AI accent color for AI-related UI elements. Uses a multi-stop linear gradient blending blue, purple, and pink hues.
- **AI Purple** (`var(--semi-color-ai-purple)`): Solid purple accent for secondary AI elements. (Light: rgba(166,71,255) / Dark: rgba(195,117,255))
- **AI Background Bottom** (`var(--semi-color-ai-background-bottom)`): Subtle gradient overlay for AI section backgrounds.
- **AI Background Top** (`var(--semi-color-ai-background-top)`): Stronger gradient overlay for AI section top layers.

Each AI color supports `-hover`, `-active`, and `-disabled` state variants.

### Data Visualization Palette
Semi Design provides 20 data colors (`var(--semi-color-data-0)` through `var(--semi-color-data-19)`) optimized for charts and data visualizations. These colors are designed to be distinguishable and accessible in both Light and Dark modes. Use them with VChart or any charting library.

## Typography
- **Font Stack**: `"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif`
- All text (headlines, body, labels) uses the same font stack.

Headlines use bold weight (600) ranging from 16px to 32px:
- H1: 32px, line-height 44px
- H2: 28px, line-height 40px
- H3: 24px, line-height 32px
- H4: 20px, line-height 28px
- H5: 18px, line-height 24px
- H6: 16px, line-height 22px

Body text uses regular weight (400) at 14px with a 20px line height. 
Labels and secondary text use regular weight at 12px with a 16px line height.

Text colors strictly follow the hierarchy:
- Primary Text: `var(--semi-color-text-0)`
- Secondary Text: `var(--semi-color-text-1)`
- Tertiary Text: `var(--semi-color-text-2)`
- Disabled Text: `var(--semi-color-text-3)` or `var(--semi-color-disabled-text)`

## Elevation
This design uses subtle shadows to convey depth for floating elements (modals, popovers, toasts, dropdowns).
- **Elevated (Light)**: `0 0 1px rgba(0, 0, 0, 0.3), 0 4px 14px rgba(0, 0, 0, 0.1)`
- **Elevated (Dark)**: `inset 0 0 0 1px rgba(255, 255, 255, 0.1), 0 4px 14px rgba(0, 0, 0, 0.25)`

Standard page elements (cards, containers) generally stay flat, relying on 1px borders and background color variations (`--semi-color-fill-0`) for hierarchy.

## Components
### Border Radius (Rounded Corners)
Semi Design uses a strict border-radius hierarchy:
- **Extra Small** (`var(--semi-border-radius-extra-small)`, 3px): Inner elements like checkbox ticks.
- **Small** (`var(--semi-border-radius-small)`, 3px): Most basic controls like Buttons, Inputs, Tags, and Tabs.
- **Medium** (`var(--semi-border-radius-medium)`, 6px): Menu-like components like Dropdowns, Select dropdowns, and Tree nodes.
- **Large** (`var(--semi-border-radius-large)`, 12px): Large container components like Modals, Cards, and Popovers.
- **Circle/Full** (`var(--semi-border-radius-circle)` / `var(--semi-border-radius-full)`): 50% or 9999px for Avatars, Badges, and pill-shaped elements.

### Basic Components
- **Buttons**: Use `var(--semi-border-radius-small)`. Primary uses brand blue fill (`var(--semi-color-primary)`). Secondary uses light blue fill (`var(--semi-color-secondary)`). Default/Tertiary buttons use a transparent background with text color, and `var(--semi-color-fill-0)` on hover.
- **Menus & Dropdowns**: Use `var(--semi-border-radius-medium)`, elevated shadow.
- **Modals & Cards**: Use `var(--semi-border-radius-large)`, elevated shadow for modals, flat with borders for standard cards. Modals use `var(--semi-color-bg-2)` (Light: #FFFFFF / Dark: #35363C) for background.
- **Tags & Badges**: Use `var(--semi-border-radius-small)` for tags, fully rounded for badges and avatars.
- **Tabs**: Line tabs use a 2px bottom border (`var(--semi-color-primary)`, Light: #0064FA / Dark: #54A9FF for active). Card tabs use `var(--semi-border-radius-small)` on top corners.
- **Tables**: Use `var(--semi-color-bg-1)` (Light: #FFFFFF / Dark: #232429) for header backgrounds and `var(--semi-color-border)` (Light: rgba(28,31,35,0.08) / Dark: rgba(255,255,255,0.08)) for dividers. Hovering over a row changes its background to `var(--semi-color-fill-0)` (Light: rgba(46,50,56,0.05) / Dark: rgba(255,255,255,0.12)).

### Forms & Inputs
- **Sizing**: Default control height is 32px. Small size is 24px, Large size is 40px.
- **Styling**: Inputs use a transparent border (`transparent`), 3px corner radius, and a filled background (`var(--semi-color-fill-0)`, Light: rgba(46,50,56,0.05) / Dark: rgba(255,255,255,0.12)).
- **Hover State**: Background changes to `var(--semi-color-fill-1)` (Light: rgba(46,50,56,0.09) / Dark: rgba(255,255,255,0.16)).
- **Focus State**: Background changes back to `var(--semi-color-fill-0)` and uses a 1px primary blue border (`var(--semi-color-focus-border)`, Light: #0064FA / Dark: #54A9FF).
- **Required Fields**: Indicated by a red asterisk (`var(--semi-color-danger)`).

### Iconography
- **Default Size**: Icons default to 16px (`var(--semi-icon-size-medium)`). Other sizes include 8px, 12px, 20px, and 24px.
- **Color**: Icons generally inherit the text color (`currentColor`) or use `var(--semi-color-text-2)` for neutral/secondary actions.

### Interaction States
- **Hover**: For filled components, use the `-hover` suffix variable (e.g., `var(--semi-color-primary-hover)`). For neutral items (like list items or transparent buttons), use `var(--semi-color-fill-1)` (Light: rgba(46,50,56,0.09) / Dark: rgba(255,255,255,0.16)) as the background.
- **Active/Pressed**: Use the `-active` suffix variable (e.g., `var(--semi-color-primary-active)`), or `var(--semi-color-fill-2)` (Light: rgba(46,50,56,0.13) / Dark: rgba(255,255,255,0.20)) for neutral items.
- **Disabled**: Use `var(--semi-color-disabled-bg)` (Light: #E6E8EA / Dark: #2E3238) for backgrounds, `var(--semi-color-disabled-text)` (Light: rgba(28,31,35,0.35) / Dark: rgba(249,249,249,0.35)) for text, and `var(--semi-color-disabled-border)` (Light: #E6E8EA / Dark: #2E3238) for borders. Disabled elements often have reduced opacity and `cursor: not-allowed`.

## Do's and Don'ts
- **Do use CSS Variables**: Never hardcode Hex colors in CSS/Styles. Always use the provided `var(--semi-color-*)` variables to ensure Dark Mode compatibility.
- Do use the primary blue (`var(--semi-color-primary)`) consistently for the most important action on a screen.
- Do maintain the strict border-radius hierarchy: 3px for basic controls, 6px for menus, 12px for large containers.
- Don't mix different font families; rely on Inter and the native system font stack for a seamless cross-platform experience.
- Do use semantic colors (Success, Warning, Danger) strictly for their intended feedback roles, not for decoration.
- Do use Semi's spacing scale (4px, 8px, 12px, 16px, 24px) for margins and paddings to maintain rhythm.
