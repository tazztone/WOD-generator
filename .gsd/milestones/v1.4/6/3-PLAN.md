---
phase: 6
plan: 3
wave: 1
gap_closure: true
---

# Fix: Basic ARIA Attributes

## Problem
The app has several interactive elements (Start Timer, Share, Settings Toggles) that lack basic accessibility support, making it difficult for screen readers and keyboard users to navigate.

## Root Cause
Accessibility attributes (ARIA labels, roles) were deferred during initial implementation.

## Tasks

<task type="auto">
  <name>Add ARIA Attributes to Key Elements</name>
  <files>/home/tazztone/_coding/WOD-generator/src/components/ui/Button.jsx, /home/tazztone/_coding/WOD-generator/src/screens/ConfigScreen.jsx, /home/tazztone/_coding/WOD-generator/src/screens/ActiveTimer.jsx</files>
  <action>
    - Add `aria-label` to icon-only buttons (Play, Trash, Share, Info).
    - Ensure toggle buttons in `ConfigScreen.jsx` have appropriate `aria-pressed` or `role="switch"` attributes.
    - Check that navigation elements (Back arrows) have descriptive labels.
    - Ensure timer display and key metrics (like time cap) are announced appropriately.
  </action>
  <verify>Manual check of DOM elements for aria attributes.</verify>
  <done>Core interactive elements are now accessible via screen readers.</done>
</task>
