#!/usr/bin/env python3
"""ZWS — Detection of invisible characters (zero-width spaces).

Common source: copy-paste from Outlook or Teams.
Detected characters: U+200B, U+200C, U+200D, U+FEFF.
"""

import sys

ZWS = [chr(0x200B), chr(0x200C), chr(0x200D), chr(0xFEFF)]


def check_file(filepath: str) -> list[int]:
    found = []
    try:
        with open(filepath, encoding="utf-8", errors="replace") as f:
            for i, line in enumerate(f, 1):
                if any(ch in line for ch in ZWS):
                    found.append(i)
    except Exception:  # noqa: S110 — silently skip unreadable files
        pass
    return found


def main() -> int:
    failed = False
    for filepath in sys.argv[1:]:
        lines = check_file(filepath)
        if lines:
            print(
                f"❌ [ZWS] Invisible character (zero-width) in: {filepath} (lines: {','.join(map(str, lines))})"
            )
            print("   💡 Likely source: copy-paste from Outlook or Teams")
            failed = True
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
