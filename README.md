# Habit Tracker — Browser Productivity App

> A lightweight, single-page habit tracker with daily completion, streak counts and a seven-day progress view.

**Stack:** HTML · CSS · vanilla JavaScript · browser localStorage  
**Project type:** Frontend prototype

## What it does

- Create habits with a name and emoji.
- Mark a habit as completed for the current day.
- Remove habits or clear today's completions.
- See completion statistics, the current streak and recent seven-day activity.
- Persist data locally in the same browser using `localStorage`.

This is an entirely client-side application: **no backend, login, cloud sync or analytics service** is included.

## Getting started

Clone or download this repository, then open `index.html` in a browser.

For a consistent local development workflow in VS Code, you can use a local web server such as Live Server. No npm packages or build step are required.

## How the data is stored

A single `habits` entry in the browser's localStorage holds habit records and the dates on which each one was completed. Completion keys follow the `YYYY-MM-DD` format using the browser's local calendar day.

**Privacy:** Habit data stays in that browser storage, but it is not encrypted or backed up. Clearing site data or changing devices can remove the records.

## Repository structure

```text
index.html   # Application layout
style.css    # Presentation
script.js    # Habit state, date handling, streak logic and rendering
README.md    # Documentation
```

## Limitations and next improvements

- Streak behavior currently expects consecutive completed days ending today; alternatives (for example, keeping yesterday's streak until today's deadline) can be considered.
- Storage parsing, schema validation and import/export need hardening.
- Automated tests for local dates, daylight-saving transitions and streak calculation are not yet present.
- Rendered habit names and emojis are escaped in HTML templates, but moving away from inline click handlers toward DOM event listeners would simplify further security hardening.
- Accessibility and mobile usability should be evaluated in real browsers.

**Project status:** Small frontend prototype; not a multi-user habit management platform.
