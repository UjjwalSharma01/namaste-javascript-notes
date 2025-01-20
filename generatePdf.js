const fs = require("fs")
const path = require("path")
const { mdToPdf } = require('md-to-pdf')

const allMd = ["season-1", "season-2"]
  .flatMap(folder => {
    const folderPath = `./notes/${folder}`
    return fs
      .readdirSync(folderPath)
      .filter(f => f.endsWith(".md"))
      .sort()
      .map(f => fs.readFileSync(path.join(folderPath, f), "utf-8"))
  })
  .join("\n\n")

const lecturesPath = "./notes/lectures.md"
fs.writeFileSync(lecturesPath, allMd, "utf-8")

if (!fs.existsSync("./dist")) {
  fs.mkdirSync("./dist")
}

mdToPdf(
  { content: allMd },
  { 
    dest: "./dist/namaste-javascript-notes.pdf",
    basedir: process.cwd(),
    css: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono&display=swap');
      
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        font-size: 16px;
        line-height: 1.8;
        max-width: 900px;
        margin: 0 auto;
        color: #2d3748;
        padding: 2rem;
      }

      h1, h2, h3, h4, h5, h6 {
        font-weight: 600;
        line-height: 1.3;
        color: #1a202c;
      }

      h1 { 
        font-size: 2.5em;
        margin-top: 1em;
        padding-bottom: 0.3em;
        border-bottom: 3px solid #1a202c;
      }

      h2 { 
        font-size: 1.75em;
        margin-top: 1.5em;
        padding-bottom: 0.2em;
        border-bottom: 2px solid #2d3748;
      }

      h3 { 
        font-size: 1.25em;
        margin-top: 1.2em;
      }

      p { 
        margin: 1em 0;
        line-height: 1.8;
      }

      code {
        font-family: 'JetBrains Mono', monospace;
        background: #f7fafc;
        padding: 0.2em 0.4em;
        border-radius: 4px;
        font-size: 0.9em;
        color: #2d3748;
        border: 1px solid #e2e8f0;
      }

      pre {
        background: #f7fafc;
        padding: 1.5em;
        border-radius: 8px;
        overflow-x: auto;
        line-height: 1.6;
        border: 1px solid #e2e8f0;
        margin: 1.2em 0;
      }

      pre code {
        border: none;
        padding: 0;
        background: none;
      }

      img { 
        max-width: 100%;
        margin: 1.5em auto;
        display: block;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
      }

      ul, ol { 
        padding-left: 1.5em;
        margin: 1em 0;
      }

      li { 
        margin: 0.5em 0;
        line-height: 1.6;
      }

      blockquote {
        margin: 1.2em 0;
        padding: 0.8em 1.2em;
        border-left: 4px solid #4299e1;
        background: #ebf8ff;
        border-radius: 4px;
      }

      blockquote p {
        margin: 0.4em 0;
        color: #2b6cb0;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1.2em 0;
      }

      th, td {
        padding: 0.75em;
        border: 1px solid #e2e8f0;
      }

      th {
        background: #f7fafc;
        font-weight: 600;
      }

      a {
        color: #4299e1;
        text-decoration: none;
        border-bottom: 1px solid #bee3f8;
      }
    `,
    pdf_options: {
      format: "A4",
      margin: {
        top: "15mm",
        right: "15mm",
        bottom: "15mm",
        left: "15mm"
      },
      printBackground: true,
      headerTemplate: '<div style="font-size: 8px; margin: 5px auto; color: #718096; text-align: center;">Namaste JavaScript Notes</div>',
      footerTemplate: '<div style="font-size: 8px; margin: 5px auto; color: #718096; text-align: center;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
      displayHeaderFooter: true,
      preferCSSPageSize: true
    }
  }
).then(() => {
  console.log("PDF generated successfully")
})
.catch(error => console.error("Error generating PDF:", error))