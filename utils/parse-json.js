const fs = require("fs");
const stripJsonComments = require("strip-json-comments").default;

function parseJSONFile(filePath) {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const strippedContent = stripJsonComments(fileContent);
    return JSON.parse(strippedContent);
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`File not found: ${filePath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(
        `Invalid JSON in ${filePath}: ${error.message}`,
      );
    }
    throw error;
  }
}

module.exports = { parseJSONFile };
