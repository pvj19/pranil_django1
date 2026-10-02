import re
from pathlib import Path

path = Path("marketpath/templates/marketpath/index.html")
text = path.read_text(encoding="utf-8")

new_block = '''<div class="ideas">
  <div class="idea">
    <button class="idea-toggle" type="button" aria-expanded="true">
      <h3>Invest with your values</h3>
      <span class="idea-chevron" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
      </span>
    </button>
    <p class="idea-body">Choose companies that match your ethics, so your money supports the kind of society you want to live in.</p>
  </div>
  <div class="idea">
    <button class="idea-toggle" type="button" aria-expanded="true">
      <h3>Build wealth for the long run</h3>
      <span class="idea-chevron" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
      </span>
    </button>
    <p class="idea-body">Work towards financial freedom and a secure, peaceful future, one sensible step at a time.</p>
  </div>
  <div class="idea">
    <button class="idea-toggle" type="button" aria-expanded="true">
      <h3>Invest with discipline</h3>
      <span class="idea-chevron" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
      </span>
    </button>
    <p class="idea-body">Follow written rules for entries, exits and holding periods instead of tips, moods and hunches.</p>
  </div>
  <div class="idea">
    <button class="idea-toggle" type="button" aria-expanded="true">
      <h3>Manage risk first</h3>
      <span class="idea-chevron" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6l4 4 4-4"/></svg>
      </span>
    </button>
    <p class="idea-body">Decide what you can afford to lose before you place a trade, then size the position to match.</p>
  </div>
</div>'''

# Find <div class="ideas"> ... its matching closing </div>, however deep it's nested
start = text.find('<div class="ideas">')
if start == -1:
    raise SystemExit('Could not find <div class="ideas"> in the file. No changes made.')

pos = start + len('<div class="ideas">')
depth = 1
while depth > 0:
    next_open = text.find('<div', pos)
    next_close = text.find('</div>', pos)
    if next_close == -1:
        raise SystemExit('Could not find the matching closing </div>. No changes made.')
    if next_open != -1 and next_open < next_close:
        depth += 1
        pos = next_open + 4
    else:
        depth -= 1
        pos = next_close + len('</div>')

old_block = text[start:pos]
text = text[:start] + new_block + text[pos:]
path.write_text(text, encoding="utf-8")
print("Done. Replaced", len(old_block), "characters with", len(new_block), "characters.")