from __future__ import annotations

import argparse
import re
from pathlib import Path


BUILT_VENDOR_NOTES = {
    "Siemens (Automation & Energy)": (
        "validated public catalog sources have already been curated through the Siemens developer "
        "ecosystem and published to the Google Sheet; Siemens remains a confirmed public-source "
        "vendor for this catalog."
    ),
    "Zebra Technologies (Retail & Logistics)": (
        "validated public Zebra RFID integration sources have been confirmed and published to the "
        "Google Sheet, including reader REST, management-event, tag-event, and raw MQTT payload "
        "documentation for asset-tracking workflows."
    ),
    "Samsara (Logistics & Transport)": (
        "validated public Samsara telematics, routing, compliance, maintenance, payroll, and TMS "
        "integration sources have been confirmed and published to the Google Sheet."
    ),
    "Motive (Logistics & Transport)": (
        "validated public Motive fleet operations sources have been confirmed and published to the "
        "Google Sheet, including vehicle, gateway, HOS, inspection, fault, and webhook workflows."
    ),
    "Geotab (Logistics & Transport)": (
        "validated public Geotab developer sources have been confirmed and published to the Google "
        "Sheet, including MyGeotab, MyAdmin, and Drive integration surfaces relevant to fleet "
        "operations."
    ),
    "Moxa (Connectivity & Networking)": (
        "validated public Moxa device lifecycle management documentation has been confirmed and "
        "published to the Google Sheet through the public DLM On-Premises OpenAPI surface."
    ),
}

SECTION_PATTERN = re.compile(r"^##\s+\d+\.\s+(.*)$")


def section_has_research_note(lines: list[str], start_index: int) -> bool:
    for index in range(start_index + 1, min(start_index + 8, len(lines))):
        line = lines[index]
        if SECTION_PATTERN.match(line):
            return False
        if line.startswith("Research status:") or line.startswith("Research note:"):
            return True
    return False


def sync_built_notes(markdown_path: Path) -> int:
    lines = markdown_path.read_text(encoding="utf-8").splitlines()
    output: list[str] = []
    inserted = 0

    index = 0
    while index < len(lines):
        line = lines[index]
        output.append(line)
        match = SECTION_PATTERN.match(line)
        if match:
            section_title = match.group(1)
            if section_title in BUILT_VENDOR_NOTES and not section_has_research_note(lines, index):
                output.append("")
                output.append(f"Research note: {BUILT_VENDOR_NOTES[section_title]}")
                inserted += 1
        index += 1

    if inserted:
        markdown_path.write_text("\n".join(output) + "\n", encoding="utf-8")
    return inserted


def list_unresolved(markdown_path: Path, batch_size: int) -> list[list[str]]:
    lines = markdown_path.read_text(encoding="utf-8").splitlines()
    unresolved: list[str] = []
    for index, line in enumerate(lines):
        match = SECTION_PATTERN.match(line)
        if not match:
            continue
        section_title = match.group(1)
        if not section_has_research_note(lines, index):
            unresolved.append(section_title)

    return [unresolved[i : i + batch_size] for i in range(0, len(unresolved), batch_size)]


def main() -> int:
    parser = argparse.ArgumentParser(description="Sync and inspect first_800_integrations research notes.")
    parser.add_argument(
        "--markdown-path",
        default="guidelines/first_800_integrations.md",
        help="Path to the markdown tracker file.",
    )
    parser.add_argument(
        "--sync-built-notes",
        action="store_true",
        help="Insert missing research notes for already-validated built vendors.",
    )
    parser.add_argument(
        "--list-unresolved",
        action="store_true",
        help="Print unresolved vendor sections that still lack research status or research notes.",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=3,
        help="Batch size when printing unresolved vendors.",
    )
    args = parser.parse_args()

    markdown_path = Path(args.markdown_path)

    if args.sync_built_notes:
        inserted = sync_built_notes(markdown_path)
        print(f"Inserted notes: {inserted}")

    if args.list_unresolved:
        batches = list_unresolved(markdown_path, args.batch_size)
        print(f"Unresolved batches: {len(batches)}")
        for batch_index, batch in enumerate(batches, start=1):
            print(f"Batch {batch_index}:")
            for item in batch:
                print(f"- {item}")

    if not args.sync_built_notes and not args.list_unresolved:
        parser.error("Specify at least one action.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())