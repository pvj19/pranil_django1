from pathlib import Path

path = Path("marketpath/static/marketpath/js/main.js")
text = path.read_text(encoding="utf-8")

# Edit these four entries: "img" must match a file in
# marketpath/static/marketpath/images/, and "desc" is the text shown
# above the image. Add or remove entries as needed.
new_sheets_block = '''  var SHEETS = [
    {
      id: 'oc', tab: 'Option chain', img: 'marketpath/images/option-chain.png',
      desc: 'See where open interest is building across strikes, and which side is adding or unwinding, for Nifty and Bank Nifty.'
    },
    {
      id: 'fd', tab: 'FII and DII data', img: 'marketpath/images/fii-dii-data.png',
      desc: 'Track daily buying and selling by foreign and domestic institutions, with net figures worked out for you.'
    },
    {
      id: 'sc', tab: 'Stock scanner', img: 'marketpath/images/stock-scanner.png',
      desc: 'Filter a list of stocks by price move, volume and level breaks, so you only open the charts worth looking at.'
    },
    {
      id: 'eod', tab: 'End-of-day analysis', img: 'marketpath/images/stock-eod-analysis.png',
      desc: 'A calm end-of-day review: where each stock closed inside its recent range, and which way its trend is leaning.'
    }
  ];

  function sheetHtml(s) {
    return '<img class="xl-screenshot" src="/static/' + s.img + '" alt="' + s.tab + ' screenshot" loading="lazy">';
  }
'''

start = text.find('  /* ---------- Excel tool previews')
if start == -1:
    raise SystemExit('Could not find the Excel tool previews block. No changes made.')

end_marker = "  var tabsEl = $('#tabs')"
end = text.find(end_marker, start)
if end == -1:
    raise SystemExit('Could not find where the previews block ends. No changes made.')

old_block = text[start:end]
text = text[:start] + new_sheets_block + '\n' + text[end:]
path.write_text(text, encoding="utf-8")
print("Done. Replaced", len(old_block), "characters with", len(new_sheets_block) + 1, "characters.")