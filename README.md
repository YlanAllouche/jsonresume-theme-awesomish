# JSON Resume Theme: Awesomeish

A clean, modern, and condensed JSON Resume theme heavily "inspired" by [Awesome-CV](https://github.com/posquit0/Awesome-CV) and [jsoncv](https://github.com/reorx/jsoncv) 
Look at `./output` folder for examples

This project doubles as a cover (and even generic) letter generator, going a bit beyond the `jsonresume` schema

## Features

- **Smart Grouping**: Conditional underlines for multiple positions at the same company
- **Condensed Design**: Optimized sections like languages and skills for better space usage
- **Complete `jsonresume` schema support**: All standard resume sections supported


## Installation & Usage

```bash

# in your CV project
npm install https://github.com/ylanallouche/jsonresume-theme-awesomish
resume export --theme awesomeish output.html
resume export --theme awesomeish output.pdf

```

### Customization

You can customize the theme by:

1. **Colors**: Edit CSS variables in `style.css`
   ```css
   :root {
     --color-primary: #ed333b; /* Change accent color */
   }
   ```

2. **Layout**: Modify `resume.handlebars` template structure

3. **Styling**: Update `style.css` for typography, spacing, etc.

4. **Logic**: Add custom Handlebars helpers in `index.js`

# Cover Letter Generator

This package includes a cover letter generator that maintains theming continuity with the jsonresume resume.

## Usage

### NPM Scripts (if using this theme directly)
```bash
# Generate HTML with default sample
npm run cover-letter

# Generate PDF with default sample  
npm run cover-letter:pdf

# With custom JSON file (HTML only)
npm run cover-letter -- my-cover-letter.json

# With custom JSON file (PDF)
npm run cover-letter -- my-cover-letter.json --pdf my-letter.pdf
```

### Direct Command
```bash
# Generate HTML only
node build-cover-letter.js [input.json]

# Generate PDF at specified path  
node build-cover-letter.js [input.json] --pdf output.pdf

# Show help
node build-cover-letter.js --help
```

#### Examples
```bash
# Default sample, HTML only
node build-cover-letter.js

# Custom JSON, HTML only
node build-cover-letter.js my-letter.json

# Default sample, PDF generation
node build-cover-letter.js --pdf letter.pdf

# Custom JSON with PDF
node build-cover-letter.js my-letter.json --pdf letter.pdf

# PDF with full path
node build-cover-letter.js my-letter.json --pdf /path/to/cover-letter.pdf

# Company-specific filename
node build-cover-letter.js application.json --pdf ./applications/google-2024.pdf
```

### Using in Another Project

#### Option 1: Install as Binary (Recommended)
If you publish this theme to npm, install it globally:
```bash
npm install -g jsonresume-theme-awesomish
build-cover-letter --pdf my-cover-letter.json
```


## JSON Schema

The cover letter expects a JSON file with this structure. **All fields are optional** - provide only what you need:

```json
{
  "recipient": {
    "company": "Company Name",
    "name": "Hiring Manager Name", 
    "title": "Hiring Manager Title",
    "address": {
      "street": "123 Company Street",
      "city": "City",
      "postalCode": "12345",
      "region": "State/Region", 
      "countryCode": "US"
    }
  },
  "subject": "Application for Software Engineer Position",
  "content": {
    "opening": "Dear Hiring Manager,",
    "body": [
      "First paragraph...",
      "Second paragraph...",
      "Third paragraph..."
    ],
    "closing": "Thank you for considering my application."
  },
  "sender": {
    "name": "Your Name",
    "email": "your.email@example.com", 
    "phone": "+1 (555) 123-4567",
    "location": {
      "city": "Your City",
      "region": "Your State",
      "countryCode": "US"
    },
    "url": "https://yourwebsite.com"
  },
  "date": "2024-01-15"
}
```


## License

MIT License - see LICENSE file for details.
