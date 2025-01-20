// JavaScript
const fs = require("fs")
const path = require("path")
const prettyMdPdf = require("pretty-markdown-pdf")

const allMd = ["season-1", "season-2"]
  .flatMap(folder => {
    const folderPath = `./notes/${folder}`
    return fs
      .readdirSync(folderPath)
      .filter(f => f.endsWith(".md"))
      .sort() // Ensures files are read in alphabetical order
      .map(f => {
        const filePath = path.join(folderPath, f)
        let content = fs.readFileSync(filePath, "utf-8")
        
        // **Preserve original image paths by ensuring they are relative**
        // Replace absolute image paths with relative paths based on the folder
        content = content.replace(/!\[([^\]]*)\]\((\/assets\/[^)]+)\)/g, (match, alt, imgPath) => {
          // Remove the leading '/' to make the path relative
          const relativePath = path.join(folder, imgPath.replace(/^\/+/, ''))
          return `![${alt}](${relativePath})`
        })
        
        return content
      })
  })
  .join("\n\n")

// Write the combined markdown to lectures.md
const lecturesPath = "./notes/lectures.md"
fs.writeFileSync(lecturesPath, allMd, "utf-8")

// Convert lectures.md to PDF without modifying image paths
prettyMdPdf.convertMd({
  markdownFilePath: lecturesPath,
  outputFilePath: "./dist/namaste-javascript-notes.pdf",
  dest: "./notes", // Temp HTML will be created in the same folder
  forceRebuild: true
})
  .then(() => {
    // Copy temp HTML to dist for debugging
    const tempHtmlPath = path.join("./notes", "lectures.html")
    const debugHtmlPath = path.join("./dist", "lectures.html")
    
    if (fs.existsSync(tempHtmlPath)) {
      fs.copyFileSync(tempHtmlPath, debugHtmlPath)
      console.log("PDF generated successfully with original image paths.")
      console.log(`Temp HTML copied to ${debugHtmlPath} for debugging.`)
    } else {
      console.log("PDF generated, but temp HTML was not found.")
    }
  })
  .catch(err => console.error("Error generating PDF:", err))