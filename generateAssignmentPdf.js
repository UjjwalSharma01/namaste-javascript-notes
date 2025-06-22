const fs = require("fs")
const path = require("path")
const { mdToPdf } = require('md-to-pdf')

// Read the assignment markdown file
const assignmentContent = fs.readFileSync("./assign.md", "utf-8")

// Ensure dist directory exists
if (!fs.existsSync("./dist")) {
  fs.mkdirSync("./dist")
}

mdToPdf(
  { content: assignmentContent },
  { 
    dest: "./dist/agentic-workforce-framework-assignment.pdf",
    basedir: process.cwd(),
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        max-width: 900px;
        margin: 0 auto;
        color: #2d3748;
        padding: 1.5rem;
        background: #ffffff;
      }

      h1, h2, h3, h4, h5, h6 {
        font-weight: 700;
        line-height: 1.2;
        color: #1a202c;
        margin-top: 2em;
        margin-bottom: 0.8em;
      }

      h1 { 
        font-size: 2.4em;
        text-align: center;
        margin-top: 0.5em;
        margin-bottom: 0.8em;
        padding-bottom: 0.5em;
        border-bottom: 3px solid #2b6cb0;
        color: #2b6cb0;
        page-break-after: avoid;
      }

      h2 { 
        font-size: 1.8em;
        margin-top: 1.5em;
        margin-bottom: 0.6em;
        padding-bottom: 0.3em;
        border-bottom: 2px solid #4a5568;
        color: #2d3748;
        page-break-after: avoid;
      }

      h3 { 
        font-size: 1.4em;
        margin-top: 1.2em;
        margin-bottom: 0.4em;
        color: #2d3748;
        page-break-after: avoid;
      }

      h4 {
        font-size: 1.2em;
        margin-top: 1em;
        margin-bottom: 0.4em;
        color: #4a5568;
        page-break-after: avoid;
      }

      p { 
        margin: 0.8em 0;
        line-height: 1.6;
        text-align: justify;
        font-size: 1em;
      }

      strong {
        font-weight: 600;
        color: #2d3748;
      }

      code {
        font-family: 'JetBrains Mono', monospace;
        background: #f7fafc;
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-size: 0.85em;
        color: #2d3748;
        border: 1px solid #e2e8f0;
      }

      pre {
        background: #f7fafc;
        padding: 1.5em;
        border-radius: 8px;
        overflow-x: auto;
        line-height: 1.5;
        border: 1px solid #e2e8f0;
        margin: 1.5em 0;
        font-size: 0.9em;
      }

      pre code {
        border: none;
        padding: 0;
        background: none;
        font-size: inherit;
      }

      img { 
        max-width: 100%;
        max-height: 75vh;
        height: auto;
        margin: 0.5em auto 0.8em auto;
        display: block;
        border-radius: 6px;
        box-shadow: 0 3px 10px -2px rgba(0,0,0,0.1);
        border: 1px solid #e2e8f0;
        page-break-inside: avoid;
        object-fit: contain;
      }

      ul, ol { 
        padding-left: 2em;
        margin: 1em 0;
      }

      li { 
        margin: 0.5em 0;
        line-height: 1.6;
        font-size: 1em;
      }

      li strong {
        color: #2b6cb0;
      }

      blockquote {
        margin: 1.5em 0;
        padding: 1em 1.5em;
        border-left: 4px solid #4299e1;
        background: #ebf8ff;
        border-radius: 6px;
        font-style: italic;
      }

      blockquote p {
        margin: 0.5em 0;
        color: #2b6cb0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.5em 0;
        font-size: 0.9em;
      }

      th, td {
        padding: 0.8em;
        border: 1px solid #e2e8f0;
        text-align: left;
      }

      th {
        background: #f7fafc;
        font-weight: 600;
        color: #2d3748;
      }

      tr:nth-child(even) {
        background: #f9f9f9;
      }

      a {
        color: #4299e1;
        text-decoration: none;
        border-bottom: 1px solid #bee3f8;
      }

      a:hover {
        color: #2b6cb0;
        border-bottom-color: #2b6cb0;
      }

      /* Executive Summary and important sections styling */
      h2:first-of-type + p {
        font-size: 1.1em;
        font-weight: 500;
        color: #2d3748;
        margin: 1.5em 0;
        padding: 1em;
        background: #f0f9ff;
        border-left: 4px solid #0ea5e9;
        border-radius: 6px;
      }

      /* Continuous flow - prevent unnecessary page breaks */
      h1, h2, h3, h4, h5, h6 {
        page-break-after: avoid;
        page-break-inside: avoid;
      }

      /* Keep content flowing together */
      h1 + *, h2 + *, h3 + *, h4 + * {
        page-break-before: avoid;
      }

      /* Specific workflow section spacing */
      h3 + img {
        margin-top: 0.3em;
      }

      img + p {
        margin-top: 0.6em;
        page-break-before: avoid;
      }

      /* Prevent widows and orphans */
      p {
        orphans: 3;
        widows: 3;
      }

      /* Header information styling */
      body > p:nth-of-type(1),
      body > p:nth-of-type(2),
      body > p:nth-of-type(3) {
        text-align: center;
        margin: 0.3em 0;
        color: #4a5568;
      }

      /* Improve list formatting in technical sections */
      ul ul {
        margin: 0.5em 0;
      }

      li ul li {
        margin: 0.3em 0;
        font-size: 0.95em;
      }
    `,
    pdf_options: {
      format: "A4",
      margin: {
        top: "12mm",
        right: "12mm",
        bottom: "12mm",
        left: "12mm"
      },
      printBackground: true,
      headerTemplate: '<div style="font-size: 9px; margin: 8px auto; color: #718096; text-align: center; font-family: Inter;">Agentic Workforce Framework Design - Assignment 2</div>',
      footerTemplate: '<div style="font-size: 9px; margin: 8px auto; color: #718096; text-align: center; font-family: Inter;">Page <span class="pageNumber"></span> of <span class="totalPages"></span> | Ujjwal Sharma</div>',
      displayHeaderFooter: true,
      preferCSSPageSize: true,
      scale: 0.9,
      timeout: 60000
    }
  }
).then(() => {
  console.log("✅ Assignment PDF generated successfully at ./dist/agentic-workforce-framework-assignment.pdf")
  console.log("📄 The PDF includes all diagrams with high-quality local images")
})
.catch(error => {
  console.error("❌ Error generating PDF:", error)
  process.exit(1)
})
