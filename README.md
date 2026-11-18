# portfolio

Static sites behind portfolio.probablysmart.com and the project landing pages.

- `sites/portfolio/` is the portfolio (index, about, `projects.js` data, screenshots).
- `sites/<project>/` are the landing pages for Go Git Swap, Nestplay, Roots and Turnsmith.
- `previews/` are link-preview images.

Plain HTML, CSS and JS with no build step. Each folder in `sites/` is uploaded as-is to S3 and served by CloudFront.

Preview locally:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
```

Then open http://localhost:8765/sites/portfolio/.
