# ContentFlow AI

A responsive React + Vite social media management dashboard starter.

## Run locally
1. Install Node.js (LTS).
2. Open this folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Open the local URL shown in the terminal.

## Build for deployment
```bash
npm run build
```
Upload the generated `dist` folder to Netlify, or connect the repository to Netlify with:
- Build command: `npm run build`
- Publish directory: `dist`

## Included demo features
- Responsive dashboard and sidebar navigation
- Content composer with editable post preview
- Content calendar with month navigation and add-post action
- Posts list with platform/status filters
- Hashtag suggestion helper
- Campaign tracker
- Analytics charts and sample metrics
- Settings page and profile menu

## Important integration notes
This project uses sample/demo data. The "Generate with AI" action currently creates a local sample caption; it is not connected to an AI provider. Real AI text/image generation requires an API integration and secure server-side API key handling. Publishing, scheduling to real accounts, and live analytics require official social platform integrations and user authorization. Do not put private API keys in frontend code.
