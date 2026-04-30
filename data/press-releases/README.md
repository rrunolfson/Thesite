# Newsroom Source Files

Place source press releases in this folder as `.docx` files.

## Preferred workflow

1. Add the new `.docx` file here.
2. Run `npm run newsroom:generate` to convert the document into website content.
3. Review the generated entries in `src/app/content/newsroom.generated.ts`.
4. Review the extracted images in `public/press-releases/<slug>/`.
5. Run `npm run build` before publishing.

## Notes

- `.docx` is preferred over PDF because it preserves structure and embedded images more reliably.
- The generator derives the title, publication date, summary, HTML body, and image assets from each document.
- If a generated summary or title needs editorial cleanup, adjust the source `.docx` and rerun the generator.