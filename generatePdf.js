const fs = require("fs")
const path = require("path")
const { mdToPdf } = require('md-to-pdf')

// Read and combine MD files without modifying paths
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

// Convert to PDF with improved typography
mdToPdf(
  { content: allMd },
  { 
    dest: "./dist/namaste-javascript-notes.pdf",
    basedir: process.cwd(),
    css: `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.8;
        max-width: 800px;
        margin: 0 auto;
        color: #24292e;
      }
      h1 { 
        font-size: 28px; 
        margin-top: 40px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eaecef;
      }
      h2 { 
        font-size: 24px; 
        margin-top: 32px;
        padding-bottom: 8px;
      }
      h3 { font-size: 20px; margin-top: 24px; }
      p { margin: 16px 0; }
      code {
        font-family: 'SF Mono', Consolas, 'Liberation Mono', Menlo, monospace;
        background: #f6f8fa;
        padding: 2px 5px;
        border-radius: 3px;
        font-size: 13px;
      }
      pre {
        background: #f6f8fa;
        padding: 16px;
        border-radius: 6px;
        overflow-x: auto;
        line-height: 1.45;
      }
      img { 
        max-width: 100%;
        margin: 24px 0;
        box-shadow: 0 3px 6px rgba(0,0,0,0.16);
      }
      ul, ol { 
        padding-left: 24px;
        margin: 16px 0;
      }
      li { margin: 8px 0; }
      blockquote {
        margin: 16px 0;
        padding: 0 16px;
        color: #6a737d;
        border-left: 4px solid #dfe2e5;
      }
    `,
    pdf_options: {
      format: "A4",
      margin: "20mm",
      printBackground: true
    }
  }
).then(() => {
  console.log("PDF generated successfully")
})
.catch(error => console.error("Error generating PDF:", error))