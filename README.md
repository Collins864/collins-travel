# Collins Travel

A React starter project for booking bus and train tickets, ready for GitHub Pages sharing.

## What is included

- React frontend with trip search, seat selection, passenger details, and checkout summary
- Static mock booking flow that works without any backend
- Shared mock trip data used directly by the frontend
- GitHub Pages workflow for cleaner sharing

## Setup

1. Install Node.js 18 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Optional: add Stripe keys to enable real payment intents.

## Run locally

Frontend: `npm run dev`

Backend: `npm run server`

## GitHub Pages deployment

This repo includes `.github/workflows/deploy-pages.yml` for GitHub Pages.

1. Push the project to the `main` branch on GitHub.
2. In the repository, open `Settings` -> `Pages`.
3. Under `Build and deployment`, choose `GitHub Actions`.
4. Let the workflow run.
5. Your site will publish at:
   `https://collins864.github.io/collins-travel/`

## Current note

The project can still be run locally with `npm install` and `npm run dev`.
