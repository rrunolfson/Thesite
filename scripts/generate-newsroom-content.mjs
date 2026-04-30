import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mammoth from "mammoth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const pressReleaseSourceDir = path.join(rootDir, "data", "press-releases");
const publicAssetDir = path.join(rootDir, "public", "press-releases");
const generatedModulePath = path.join(rootDir, "src", "app", "content", "newsroom.generated.ts");

const MONTH_LOOKUP = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
};

async function main() {
  const docxFiles = await getDocxFiles();
  const pressReleases = [];

  await fs.mkdir(publicAssetDir, { recursive: true });

  for (const fileName of docxFiles) {
    pressReleases.push(await convertDocxToPressRelease(fileName));
  }

  pressReleases.sort((left, right) => right.date.localeCompare(left.date));
  await writeGeneratedModule(pressReleases);

  console.log(`Generated ${pressReleases.length} newsroom entr${pressReleases.length === 1 ? "y" : "ies"}.`);
}

async function getDocxFiles() {
  try {
    const directoryEntries = await fs.readdir(pressReleaseSourceDir, { withFileTypes: true });

    return directoryEntries
      .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === ".docx")
      .map((entry) => entry.name)
      .sort((left, right) => left.localeCompare(right));
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }
}

async function convertDocxToPressRelease(fileName) {
  const filePath = path.join(pressReleaseSourceDir, fileName);
  const rawTextResult = await mammoth.extractRawText({ path: filePath });
  const rawHtmlResult = await mammoth.convertToHtml({ path: filePath });
  const blocks = rawTextResult.value
    .split(/\n\s*\n/g)
    .map(normalizeWhitespace)
    .filter(Boolean);
  const title = inferTitle(blocks, fileName);
  const slug = slugify(title || path.basename(fileName, path.extname(fileName)));
  const date = inferDate(blocks, fileName);
  const summary = inferSummary(blocks, title, date);
  const seoDescription = summary;
  const assetOutputDir = path.join(publicAssetDir, slug);

  await fs.rm(assetOutputDir, { recursive: true, force: true });
  await fs.mkdir(assetOutputDir, { recursive: true });

  let imageIndex = 0;
  const htmlResult = await mammoth.convertToHtml(
    { path: filePath },
    {
      convertImage: mammoth.images.imgElement(async (image) => {
        imageIndex += 1;
        const extension = getExtensionForContentType(image.contentType);
        const imageName = `image-${String(imageIndex).padStart(2, "0")}.${extension}`;
        const imagePath = path.join(assetOutputDir, imageName);
        const imageBuffer = await image.readAsBuffer();

        await fs.writeFile(imagePath, imageBuffer);

        return {
          src: `/press-releases/${slug}/${imageName}`,
          alt: title,
        };
      }),
    },
  );

  for (const message of htmlResult.messages) {
    if (/^Unrecognised /.test(message.message)) {
      continue;
    }

    console.warn(`${fileName}: ${message.message}`);
  }

  return {
    slug,
    title,
    date,
    summary,
    seoDescription,
    content: postProcessHtml(htmlResult.value, rawHtmlResult.value, title),
  };
}

function inferTitle(blocks, fileName) {
  const titleCandidate = blocks.find((block) => {
    if (isCompanyLine(block)) {
      return false;
    }

    if (looksLikeDateline(block)) {
      return false;
    }

    return block.length >= 32;
  });

  return titleCandidate ?? titleFromFileName(fileName);
}

function inferDate(blocks, fileName) {
  const text = blocks.join(" ");
  const match = text.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\s*,\s*\d{4}/i);

  if (match) {
    return toIsoDate(match[0]);
  }

  const fileNameMatch = fileName.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\s+\d{4}/i);

  if (fileNameMatch) {
    return toIsoDate(fileNameMatch[0].replace(/\s+(\d{4})$/i, ", $1"));
  }

  throw new Error(`Unable to determine a publication date for ${fileName}.`);
}

function inferSummary(blocks, title, date) {
  const titleIndex = blocks.findIndex((block) => block === title);
  const orderedCandidates = [
    ...blocks.slice(Math.max(titleIndex, 0) + 1),
    ...blocks.slice(0, Math.max(titleIndex, 0)),
  ];

  for (const block of orderedCandidates) {
    if (!block || block === title || isCompanyLine(block)) {
      continue;
    }

    if (looksLikeDateline(block)) {
      const withoutDateline = stripLeadingDateline(block, date);

      if (withoutDateline.length >= 60) {
        return summarize(withoutDateline);
      }

      continue;
    }

    if (block.length >= 60) {
      return summarize(block);
    }
  }

  return summarize(title);
}

function postProcessHtml(html, rawHtml, title) {
  let nextHtml = html.trim();
  let preservedLeadingBlock = "";
  const rawLeadingImageBlockMatch = rawHtml
    .trim()
    .match(/^\s*<(p|h1|h2|h3)[^>]*>[\s\S]*?<img\b[\s\S]*?<\/\1>/i);

  const leadingImageBlockMatch = nextHtml.match(/^\s*<(p|h1|h2|h3)[^>]*>[\s\S]*?<img\b[\s\S]*?<\/\1>/i);

  if (leadingImageBlockMatch) {
    preservedLeadingBlock = formatLeadingImageBlock(
      leadingImageBlockMatch[0].trim(),
      rawLeadingImageBlockMatch?.[0]?.trim() ?? "",
    );
    nextHtml = nextHtml.slice(leadingImageBlockMatch[0].length).trimStart();
  }

  nextHtml = stripLeadingBlock(nextHtml, (text) => isCompanyLine(text));
  nextHtml = stripLeadingBlock(nextHtml, (text) => normalizeWhitespace(text) === normalizeWhitespace(title));

  return [preservedLeadingBlock, nextHtml]
    .filter(Boolean)
    .join("")
    .replace(/<img\b/g, '<img loading="lazy"');
}

function formatLeadingImageBlock(blockHtml, rawBlockHtml) {
  const imageTags = Array.from(blockHtml.matchAll(/<img\b[^>]*>/gi)).map((match) =>
    match[0].replace(/\sstyle="[^"]*"/gi, "").replace(/\sclass="[^"]*"/gi, ""),
  );

  if (imageTags.length < 2) {
    return blockHtml;
  }

  const lastMileIndex = findLastMileImageIndex(rawBlockHtml, imageTags.length);
  const orderedIndexes = [
    lastMileIndex,
    ...imageTags.map((_, index) => index).filter((index) => index !== lastMileIndex),
  ];

  const formattedImages = orderedIndexes.slice(0, 2).map((index) =>
    imageTags[index].replace(
      /<img\b/i,
      '<img style="display:block; width:auto; height:auto; max-width:min(42%, 220px); max-height:72px; object-fit:contain; margin:0; padding:0; border:0; background:transparent; border-radius:0;"',
    ),
  );

  return `<div style="display:flex; align-items:center; justify-content:space-between; gap:1.5rem; margin:0 0 2.5rem; width:100%;">${formattedImages.join("")}</div>`;
}

function findLastMileImageIndex(rawBlockHtml, imageCount) {
  if (!rawBlockHtml) {
    return 0;
  }

  const rawImageTags = Array.from(rawBlockHtml.matchAll(/<img\b[^>]*>/gi)).map((match) => match[0]);

  if (!rawImageTags.length) {
    return 0;
  }

  const partnerIndexes = [];
  let searchStart = 0;

  for (let index = 0; index < Math.min(rawImageTags.length, imageCount); index += 1) {
    const rawImageTag = rawImageTags[index];
    const position = rawBlockHtml.indexOf(rawImageTag, searchStart);
    const nextPosition = index + 1 < rawImageTags.length
      ? rawBlockHtml.indexOf(rawImageTags[index + 1], position + rawImageTag.length)
      : rawBlockHtml.length;
    const trailingText = normalizeWhitespace(
      stripHtml(rawBlockHtml.slice(position + rawImageTag.length, nextPosition === -1 ? rawBlockHtml.length : nextPosition)),
    );

    searchStart = position + rawImageTag.length;

    if (/LAST\s*MILE/i.test(trailingText) || /LAST\s*MILE/i.test(rawImageTag)) {
      return index;
    }

    if (/SGITAL|SERVICENOW\s+PREMIER|SERVICENOW/i.test(rawImageTag)) {
      partnerIndexes.push(index);
    }
  }

  if (partnerIndexes.length === 1 && imageCount === 2) {
    return partnerIndexes[0] === 0 ? 1 : 0;
  }

  return 0;
}

function stripLeadingBlock(html, shouldStrip) {
  const match = html.match(/^\s*<(p|h1|h2|h3)[^>]*>([\s\S]*?)<\/\1>/i);

  if (!match) {
    return html;
  }

  if (/<img\b/i.test(match[0])) {
    return html;
  }

  const text = normalizeWhitespace(stripHtml(match[2]));

  if (!shouldStrip(text)) {
    return html;
  }

  return html.slice(match[0].length).trimStart();
}

function stripLeadingDateline(text, isoDate) {
  const year = isoDate.slice(0, 4);

  return normalizeWhitespace(
    text
      .replace(/^.*?(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\s*,\s*\d{4}\s*[-:]?\s*/i, "")
      .replace(new RegExp(`^.*?${year}\s*[-:]\s*`, "i"), ""),
  );
}

function looksLikeDateline(text) {
  return /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\s*,\s*\d{4}/i.test(text);
}

function isCompanyLine(text) {
  return text.length <= 24 && text === text.toUpperCase();
}

function summarize(text) {
  const sentenceMatch = normalizeWhitespace(text).match(/.+?[.!?](?=\s|$)/);
  const sentence = sentenceMatch ? sentenceMatch[0] : normalizeWhitespace(text);

  if (sentence.length <= 220) {
    return sentence;
  }

  return `${sentence.slice(0, 217).trimEnd()}...`;
}

function toIsoDate(input) {
  const match = normalizeWhitespace(input).match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2})\s*,\s*(\d{4})/i);

  if (!match) {
    throw new Error(`Unable to parse date from ${input}.`);
  }

  const month = MONTH_LOOKUP[match[1].toLowerCase()];
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month, day));

  return date.toISOString().slice(0, 10);
}

function slugify(text) {
  return normalizeWhitespace(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function titleFromFileName(fileName) {
  return path
    .basename(fileName, path.extname(fileName))
    .replace(/\s+-\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}\s+\d{4}$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

function stripHtml(text) {
  return text
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function getExtensionForContentType(contentType) {
  const contentTypeMap = {
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    "image/tiff": "tiff",
    "image/webp": "webp",
  };

  const extension = contentTypeMap[contentType];

  if (!extension) {
    throw new Error(`Unsupported image content type: ${contentType}`);
  }

  return extension;
}

async function writeGeneratedModule(pressReleases) {
  const moduleContents = `export const generatedPressReleases = ${JSON.stringify(pressReleases, null, 2)};\n`;

  await fs.mkdir(path.dirname(generatedModulePath), { recursive: true });
  await fs.writeFile(generatedModulePath, moduleContents, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});