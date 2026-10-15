"""Zip the built site (out/) for upload to cPanel public_html.

Run via `npm run package` (builds first). Writes deploy/ndr-smart-spaces-cpanel.zip
next to the project's parent folder's deploy/ directory. Uses forward-slash paths and
standard deflate so cPanel's unzip can read it (Windows `tar`/PowerShell zips fail).
Skips videos/homepage/, which no page uses.
"""
import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "out")
DEST_DIR = os.path.join(os.path.dirname(ROOT), "deploy")
DEST = os.path.join(DEST_DIR, "ndr-smart-spaces-cpanel.zip")

if not os.path.isfile(os.path.join(SRC, "index.html")):
    sys.exit("out/ is missing: run `npm run build` first.")

os.makedirs(DEST_DIR, exist_ok=True)
if os.path.exists(DEST):
    os.remove(DEST)

count = 0
with zipfile.ZipFile(DEST, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as archive:
    for folder, dirs, files in os.walk(SRC):
        dirs.sort()
        for name in sorted(files):
            full = os.path.join(folder, name)
            rel = os.path.relpath(full, SRC).replace(os.sep, "/")
            if rel.startswith("videos/homepage/"):
                continue
            archive.write(full, rel)
            count += 1

with zipfile.ZipFile(DEST) as archive:
    bad = archive.testzip()
    names = set(archive.namelist())
if bad or ".htaccess" not in names or "index.html" not in names:
    sys.exit(f"Zip check failed (bad={bad}).")

print(f"{count} files -> {DEST} ({os.path.getsize(DEST) / 1048576:.1f} MB)")
