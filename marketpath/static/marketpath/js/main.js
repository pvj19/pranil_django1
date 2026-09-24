(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Mobile header button (nav links hide on small screens) */
  var mq = window.matchMedia('(max-width: 760px)');
  function syncHeader() {
    $('#mobile-cta').style.display = mq.matches ? 'inline-flex' : 'none';
    $('.site-nav .btn').style.display = mq.matches ? 'none' : 'inline-flex';
  }
  syncHeader();
  if (mq.addEventListener) mq.addEventListener('change', syncHeader);

  /* ---------- Hero chart: a price line that respects its levels ---------- */
  (function () {
    var L = 16, R = 470, T = 28, B = 404, N = 72, raw = [], i;
    for (i = 0; i < N; i++) {
      var t = i / (N - 1);
      raw.push(0.6 * t + 0.11 * Math.sin(i / 3.1) + 0.07 * Math.sin(i / 1.4 + 2) + 0.09 * Math.sin(i / 8 + 1));
    }
    var mn = Math.min.apply(null, raw), mx = Math.max.apply(null, raw);
    var X = function (k) { return L + (R - L) * k / (N - 1); };
    var Yv = function (v) { return B - (B - T) * (v - mn) / (mx - mn); };
    var d = raw.map(function (v, k) { return (k ? 'L' : 'M') + X(k).toFixed(1) + ' ' + Yv(v).toFixed(1); }).join(' ');
    var s = '';
    for (i = 0; i <= 5; i++) {
      var gy = T + (B - T) * i / 5;
      s += '<line class="g" x1="' + L + '" x2="' + (R + 6) + '" y1="' + gy + '" y2="' + gy + '"/>';
    }
    var levels = [
      { p: 0.86, name: 'Resistance', c: '#F5C04A', dash: '9 6' },
      { p: 0.52, name: 'Pivot', c: '#FFFFFF', dash: '2 7' },
      { p: 0.16, name: 'Support', c: '#7FE0B0', dash: '9 6' }
    ];
    s += '<g class="lv">';
    levels.forEach(function (lv) {
      var y = B - (B - T) * lv.p;
      s += '<line x1="' + L + '" x2="' + (R + 6) + '" y1="' + y + '" y2="' + y + '" stroke="' + lv.c + '" stroke-width="2" stroke-dasharray="' + lv.dash + '"/>';
      s += '<text x="' + (R + 16) + '" y="' + (y + 5) + '" style="fill:' + lv.c + '">' + lv.name + '</text>';
    });
    s += '</g>';
    s += '<path class="price" pathLength="1" d="' + d + '"/>';
    s += '<circle class="end" cx="' + X(N - 1).toFixed(1) + '" cy="' + Yv(raw[N - 1]).toFixed(1) + '" r="7"/>';
    $('#hero-chart').innerHTML = s;
  })();

  /* ---------- Excel tool previews (sample numbers) ---------- */
  var num = function (t, cls) { return { t: t, cls: cls || '' }; };
  var pos = function (t) { return { t: t, cls: 'up' }; };
  var neg = function (t) { return { t: t, cls: 'down' }; };
  var txt = function (t, cls) { return { t: t, cls: 'l ' + (cls || '') }; };
  var bar = function (t, w, kind) { return { t: t, cls: kind, w: w }; };

  var SHEETS = [
    {
      id: 'oc', tab: 'Option chain', file: 'option-chain.xlsx',
      desc: 'See where open interest is building across strikes, and which side is adding or unwinding, for Nifty and Bank Nifty.',
      cols: ['Call OI (lakh)', 'Call change', 'Strike', 'Put change', 'Put OI (lakh)'],
      rows: [
        { cells: [bar('38.4', '51%', 'bar-dn'), pos('+2.1'), num('22,000', 'strong'), neg('\u22121.4'), bar('21.7', '29%', 'bar-up')] },
        { cells: [bar('44.9', '60%', 'bar-dn'), pos('+3.6'), num('22,050', 'strong'), neg('\u22120.8'), bar('27.3', '36%', 'bar-up')] },
        { cells: [bar('52.3', '70%', 'bar-dn'), pos('+5.2'), num('22,100', 'strong'), pos('+0.9'), bar('33.8', '45%', 'bar-up')] },
        { hl: true, cells: [bar('61.7', '82%', 'bar-dn'), pos('+1.8'), num('22,150', 'strong'), pos('+2.4'), bar('45.6', '61%', 'bar-up')] },
        { cells: [bar('71.2', '95%', 'bar-dn'), neg('\u22122.3'), num('22,200', 'strong'), pos('+6.1'), bar('58.9', '79%', 'bar-up')] },
        { cells: [bar('49.6', '66%', 'bar-dn'), neg('\u22124.1'), num('22,250', 'strong'), pos('+8.4'), bar('66.2', '88%', 'bar-up')] },
        { cells: [bar('35.8', '48%', 'bar-dn'), neg('\u22123.0'), num('22,300', 'strong'), pos('+7.7'), bar('72.5', '97%', 'bar-up')] }
      ]
    },
    {
      id: 'fd', tab: 'FII and DII data', file: 'fii-dii-data.xlsx',
      desc: 'Track daily buying and selling by foreign and domestic institutions, with net figures worked out for you (\u20b9 crore).',
      cols: ['Session', 'FII buy', 'FII sell', 'FII net', 'DII net'],
      rows: [
        { cells: [txt('Day 1'), num('12,480'), num('13,215'), neg('\u2212735'), pos('+1,120')] },
        { cells: [txt('Day 2'), num('14,020'), num('12,860'), pos('+1,160'), pos('+410')] },
        { cells: [txt('Day 3'), num('11,930'), num('13,480'), neg('\u22121,550'), pos('+1,890')] },
        { cells: [txt('Day 4'), num('12,750'), num('12,610'), pos('+140'), pos('+260')] },
        { cells: [txt('Day 5'), num('13,310'), num('14,120'), neg('\u2212810'), pos('+970')] },
        { cells: [txt('Day 6'), num('12,090'), num('11,730'), pos('+360'), neg('\u2212220')] }
      ]
    },
    {
      id: 'sc', tab: 'Stock scanner', file: 'stock-scanner.xlsx',
      desc: 'Filter a list of stocks by price move, volume and level breaks, so you only open the charts worth looking at.',
      cols: ['Symbol', 'Last price', 'Change', 'Volume vs avg', 'Signal'],
      rows: [
        { cells: [txt('Alpha Ltd'), num('1,284.50'), pos('+2.4%'), num('2.1\u00d7'), txt('Breakout', 'up strong')] },
        { cells: [txt('Bravo Ltd'), num('642.10'), pos('+1.1%'), num('1.6\u00d7'), txt('Near resistance')] },
        { cells: [txt('Charlie Ltd'), num('2,910.00'), neg('\u22120.8%'), num('0.9\u00d7'), txt('No signal')] },
        { cells: [txt('Delta Ltd'), num('388.75'), pos('+3.2%'), num('3.4\u00d7'), txt('Breakout', 'up strong')] },
        { cells: [txt('Echo Ltd'), num('1,015.30'), neg('\u22122.1%'), num('1.8\u00d7'), txt('Breakdown', 'down strong')] },
        { cells: [txt('Foxtrot Ltd'), num('176.40'), pos('+0.4%'), num('1.2\u00d7'), txt('Near support')] }
      ]
    },
    {
      id: 'eod', tab: 'End-of-day analysis', file: 'stock-eod-analysis.xlsx',
      desc: 'A calm end-of-day review: where each stock closed inside its recent range, and which way its trend is leaning.',
      cols: ['Symbol', 'Close', '20-day high', '20-day low', 'Place in range', 'Trend'],
      rows: [
        { cells: [txt('Alpha Ltd'), num('1,284.50'), num('1,290.00'), num('1,120.40'), bar('97%', '97%', 'bar-up'), txt('Up', 'up strong')] },
        { cells: [txt('Bravo Ltd'), num('642.10'), num('668.90'), num('590.25'), bar('66%', '66%', 'bar-up'), txt('Up', 'up strong')] },
        { cells: [txt('Charlie Ltd'), num('2,910.00'), num('3,105.00'), num('2,880.50'), bar('13%', '13%', 'bar-dn'), txt('Down', 'down strong')] },
        { cells: [txt('Delta Ltd'), num('388.75'), num('392.10'), num('331.00'), bar('95%', '95%', 'bar-up'), txt('Up', 'up strong')] },
        { cells: [txt('Echo Ltd'), num('1,015.30'), num('1,180.00'), num('1,008.60'), bar('4%', '4%', 'bar-dn'), txt('Down', 'down strong')] },
        { cells: [txt('Foxtrot Ltd'), num('176.40'), num('184.75'), num('168.20'), bar('50%', '50%', 'bar-up'), txt('Sideways')] }
      ]
    }
  ];

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
  function cellHtml(c) {
    var style = c.w ? ' style="--w:' + c.w + '"' : '';
    return '<td class="' + c.cls + '"' + style + '>' + c.t + '</td>';
  }
  function sheetHtml(s) {
    var h = '<div class="xl-title"><span>' + s.file + '</span><span class="badge">Sample data</span></div><div class="xl-scroll"><table class="xl-t"><thead>';
    h += '<tr class="letters"><th></th>' + s.cols.map(function (_, i) { return '<th>' + LETTERS[i] + '</th>'; }).join('') + '</tr>';
    h += '<tr class="heads"><th class="rn">1</th>' + s.cols.map(function (c, i) { return '<th class="' + (i === 0 && (s.id === 'fd' || s.id === 'sc' || s.id === 'eod') ? 'l' : '') + '">' + c + '</th>'; }).join('') + '</tr></thead><tbody>';
    s.rows.forEach(function (r, ri) {
      h += '<tr' + (r.hl ? ' class="hl"' : '') + '><th class="rn">' + (ri + 2) + '</th>' + r.cells.map(cellHtml).join('') + '</tr>';
    });
    return h + '</tbody></table></div>';
  }

  var tabsEl = $('#tabs'), win = $('#xl-window'), descEl = $('#sheet-desc');
  var active = 0;
  function renderTabs() {
    tabsEl.innerHTML = SHEETS.map(function (s, i) {
      return '<button class="tab" role="tab" type="button" id="tab-' + s.id + '" data-i="' + i + '" aria-selected="' + (i === active) + '" aria-controls="xl-window" tabindex="' + (i === active ? 0 : -1) + '">' + s.tab + '</button>';
    }).join('');
  }
  function show(i, focus) {
    active = i;
    renderTabs();
    win.setAttribute('aria-labelledby', 'tab-' + SHEETS[i].id);
    win.innerHTML = sheetHtml(SHEETS[i]);
    descEl.textContent = SHEETS[i].desc;
    if (focus) $('#tab-' + SHEETS[i].id).focus();
  }
  tabsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.tab');
    if (b) show(parseInt(b.getAttribute('data-i'), 10), false);
  });
  tabsEl.addEventListener('keydown', function (e) {
    var k = e.key;
    if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].indexOf(k) === -1) return;
    e.preventDefault();
    var n = SHEETS.length, i = active;
    if (k === 'ArrowRight') i = (i + 1) % n;
    else if (k === 'ArrowLeft') i = (i - 1 + n) % n;
    else if (k === 'Home') i = 0;
    else i = n - 1;
    show(i, true);
  });
  show(0, false);

  /* ---------- Reviews ----------
     Content comes from window.MARKETPATH_REVIEWS, rendered server-side
     by the Django view (see marketpath/views.py: REVIEWS). */
  /* ---------- Horizontal carousels (testimonials + courses) ---------- */
  (function () {
    function wireCarousel(trackId, cardSelector, gap) {
      var track = document.getElementById(trackId);
      if (!track) return;
      $$('.nav[data-target="' + trackId + '"]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var card = track.querySelector(cardSelector);
          if (!card) return;
          var amount = (card.offsetWidth + gap) * parseInt(btn.getAttribute('data-dir'), 10);
          track.scrollBy({ left: amount, behavior: 'smooth' });
        });
      });
    }
    wireCarousel('course-carousel', '.course-card', 22);
  })();

  /* ---------- Testimonial carousel (kept separate: buttons have no data-target) ---------- */
  (function () {
    var track = $('#carousel1');
    if (!track) return;
    $$('.nav', track.closest('.carousel-wrapper')).forEach(function (btn) {
      if (btn.hasAttribute('data-target')) return;
      btn.addEventListener('click', function () {
        var card = track.querySelector('.carousel-card');
        if (!card) return;
        var gap = 24;
        var amount = (card.offsetWidth + gap) * parseInt(btn.getAttribute('data-dir'), 10);
        track.scrollBy({ left: amount, behavior: 'smooth' });
      });
    });
  })();

  /* ---------- Course buttons pre-fill the enquiry form ----------
     data-interest carries the EnquiryForm.interest choice value
     (see marketpath/views.py: COURSES[*].interest_value), and the
     rendered <select id="id_interest"> uses the same choice values. */
  $$('[data-interest]').forEach(function (a) {
    a.addEventListener('click', function () {
      var sel = $('#id_interest');
      if (sel) sel.value = a.getAttribute('data-interest');
    });
  });


  






  
  /* Contact form: Django (marketpath/views.py + forms.py) validates
     and saves the Enquiry on submit, then re-renders this page with
     either field errors or a success message. No client-side
     interception needed here; the required attrs Django adds give
     basic native validation before the request is sent. */

  /* ---------- Calculator toolkit (Risk:reward, P&L, Drawdown, Compound growth) ---------- */
  (function () {
    var isNum = Number.isFinite;
    var inr = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
    var px = function (n) { return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 6 }); };
    var signed = function (n, f) { return (n >= 0 ? '+' : '\u2212') + f(Math.abs(n)); };

    var CALC_TOOLS = [
      {
        id: 'rr', name: 'Risk : reward', blurb: 'Check whether a setup pays enough for how often it wins.',
        lead: 'Compare what you risk with what you stand to make, and see the win rate you need to break even.',
        fields: [
          { id: 'entry', label: 'Entry price', value: 100 },
          { id: 'stop', label: 'Stop price', value: 96 },
          { id: 'target', label: 'Target price', value: 110 },
          { id: 'win', label: 'Your win rate (%)', value: 40 }
        ],
        compute: function (v) {
          if (![v.entry, v.stop, v.target].every(isNum)) return { error: 'Enter entry, stop and target prices.' };
          var risk = Math.abs(v.entry - v.stop), dir = v.entry > v.stop ? 1 : -1, reward = (v.target - v.entry) * dir;
          if (risk === 0) return { error: 'Entry and stop can\u2019t be the same price.' };
          if (reward <= 0) return { error: 'For a ' + (dir > 0 ? 'long' : 'short') + ' trade the target must be ' + (dir > 0 ? 'above' : 'below') + ' entry.' };
          var ratio = reward / risk, be = 100 / (1 + ratio);
          var results = [
            { label: 'Risk per unit', value: px(risk) },
            { label: 'Reward per unit', value: px(reward) },
            { label: 'Risk : reward', value: '1 : ' + ratio.toFixed(2), primary: true },
            { label: 'Break-even win rate', value: be.toFixed(1) + '%' }
          ];
          if (isNum(v.win) && v.win >= 0 && v.win <= 100) {
            var w = v.win / 100, ex = w * ratio - (1 - w);
            results.push({ label: 'Expectancy per trade', value: signed(ex, function (n) { return n.toFixed(2); }) + 'R', tone: ex >= 0 ? 'up' : 'down' });
          }
          return { results: results, note: 'At 1 : ' + ratio.toFixed(2) + ' you need to win more than ' + be.toFixed(1) + '% of trades to break even, before fees. Expectancy is the average result per trade in units of risk (R).' };
        }
      },
      {
        id: 'pnl', name: 'Profit and loss', blurb: 'See what a trade really made after fees.',
        lead: 'Enter both prices and your fees to see gross and net results, and how far price has to move just to cover costs.',
        fields: [
          { id: 'side', label: 'Side', type: 'select', value: 'long', options: [['long', 'Long'], ['short', 'Short']] },
          { id: 'entry', label: 'Entry price', value: 100 },
          { id: 'exit', label: 'Exit price', value: 104 },
          { id: 'units', label: 'Units', value: 50 },
          { id: 'fee', label: 'Fee per order (₹)', value: 2 }
        ],
        compute: function (v) {
          if (!(v.entry > 0 && v.exit > 0 && v.units > 0)) return { error: 'Enter entry, exit and units above zero.' };
          var dir = v.side === 'short' ? -1 : 1;
          var gross = (v.exit - v.entry) * v.units * dir;
          var fees = (isNum(v.fee) && v.fee > 0 ? v.fee : 0) * 2;
          var net = gross - fees, ret = net / (v.entry * v.units) * 100;
          return {
            results: [
              { label: 'Gross P&L', value: signed(gross, inr.format.bind(inr)), tone: gross >= 0 ? 'up' : 'down' },
              { label: 'Fees (entry and exit)', value: inr.format(fees) },
              { label: 'Net P&L', value: signed(net, inr.format.bind(inr)), tone: net >= 0 ? 'up' : 'down', primary: true },
              { label: 'Return on position', value: signed(ret, function (n) { return n.toFixed(2); }) + '%', tone: ret >= 0 ? 'up' : 'down' },
              { label: 'Move needed to cover fees', value: px(fees / v.units) + ' per unit' }
            ],
            note: 'Fees are counted once when you open and once when you close.'
          };
        }
      },
      {
        id: 'dd', name: 'Drawdown recovery', blurb: 'How much you need to win back after a loss.',
        lead: 'Losses are harder to recover than they look. A 50% drop needs a 100% gain to get back to even.',
        fields: [
          { id: 'start', label: 'Starting balance (₹)', value: 10000 },
          { id: 'dd', label: 'Drawdown (%)', value: 20 }
        ],
        compute: function (v) {
          if (!(v.start > 0)) return { error: 'Enter a starting balance above zero.' };
          if (!(v.dd > 0 && v.dd < 100)) return { error: 'Enter a drawdown between 0 and 100%.' };
          var left = v.start * (1 - v.dd / 100), gain = (v.start / left - 1) * 100;
          var rows = [10, 20, 30, 40, 50, 60, 75];
          var html = '<div class="calc-extra"><h4>Gain needed to recover, by size of loss</h4>';
          html += '<div class="dd-row you"><span>Your ' + v.dd + '%</span><span class="bar"><i style="width:' + Math.min(gain / 300 * 100, 100) + '%"></i></span><span class="v">+' + gain.toFixed(1) + '%</span></div>';
          rows.forEach(function (d) {
            var g = (1 / (1 - d / 100) - 1) * 100;
            html += '<div class="dd-row"><span>Lose ' + d + '%</span><span class="bar"><i style="width:' + (g / 300 * 100) + '%"></i></span><span class="v">+' + g.toFixed(1) + '%</span></div>';
          });
          html += '</div>';
          return {
            results: [
              { label: 'Balance after the loss', value: inr.format(left) },
              { label: 'Gain needed to recover', value: '+' + gain.toFixed(1) + '%', primary: true },
              { label: 'Profit needed', value: inr.format(v.start - left) }
            ],
            extra: html
          };
        }
      },
      {
        id: 'cg', name: 'Compound growth', blurb: 'What steady monthly returns add up to over time.',
        lead: 'Add a monthly return and optional deposits to see how a balance grows. This is arithmetic, not a forecast.',
        fields: [
          { id: 'start', label: 'Starting balance (₹)', value: 5000 },
          { id: 'rate', label: 'Monthly return (%)', value: 2 },
          { id: 'months', label: 'Months', value: 24 },
          { id: 'dep', label: 'Monthly deposit (₹)', value: 200 }
        ],
        compute: function (v) {
          var months = Math.round(v.months);
          if (!(v.start >= 0)) return { error: 'Enter a starting balance of zero or more.' };
          if (!(isNum(v.rate) && v.rate >= -50 && v.rate <= 100)) return { error: 'Use a monthly return between \u221250% and 100%.' };
          if (!(months >= 1 && months <= 600)) return { error: 'Use between 1 and 600 months.' };
          var dep = isNum(v.dep) ? v.dep : 0;
          var bal = v.start, put = v.start, series = [bal], contrib = [put];
          for (var m = 1; m <= months; m++) {
            bal = bal * (1 + v.rate / 100) + dep; put += dep;
            series.push(bal); contrib.push(put);
          }
          if (!isFinite(bal)) return { error: 'That growth is too large to display. Try fewer months or a lower return.' };
          var maxV = Math.max.apply(null, series.concat(contrib).concat([1]));
          var pt = function (arr) {
            return arr.map(function (y, i) {
              var xx = 10 + i / months * 580;
              var yy = 130 - Math.max(0, y) / maxV * 120;
              return xx.toFixed(1) + ',' + yy.toFixed(1);
            }).join(' ');
          };
          var svg = '<div class="calc-extra calc-spark"><svg viewBox="0 0 600 140" role="img" aria-label="Balance growth compared with money deposited">' +
            '<line x1="10" x2="590" y1="130" y2="130" stroke="var(--line-strong)" stroke-width="1"/>' +
            '<polyline points="' + pt(contrib) + '" fill="none" stroke="var(--muted)" stroke-width="2" stroke-dasharray="6 5"/>' +
            '<polyline points="' + pt(series) + '" fill="none" stroke="var(--green)" stroke-width="3" stroke-linejoin="round"/></svg>' +
            '<div class="legend"><span><b></b>Balance</span><span><b class="dash"></b>Money put in</span></div></div>';
          return {
            results: [
              { label: 'Ending balance', value: inr.format(bal), primary: true },
              { label: 'Total put in', value: inr.format(put) },
              { label: 'Growth earned', value: signed(bal - put, inr.format.bind(inr)), tone: bal - put >= 0 ? 'up' : 'down' }
            ],
            note: 'Real markets don\u2019t pay a fixed return each month, and losing months matter more than the average suggests.',
            extra: svg
          };
        }
      }
    ];

    var calcTabsEl = $('#calc-tabs'), calcPanel = $('#calc-panel');
    if (!calcTabsEl || !calcPanel) return;
    var calcState = {};
    var calcActiveId = CALC_TOOLS[0].id;

    function renderCalcTabs() {
      calcTabsEl.innerHTML = CALC_TOOLS.map(function (t) {
        var sel = t.id === calcActiveId;
        return '<button class="calc-tab" role="tab" type="button" id="calc-tab-' + t.id + '" data-id="' + t.id + '" aria-selected="' + sel + '" aria-controls="calc-panel" tabindex="' + (sel ? 0 : -1) + '">' +
          '<span class="ct-name">' + t.name + '</span><span class="ct-desc">' + t.blurb + '</span></button>';
      }).join('');
    }
    function calcFieldHtml(f, cur) {
      if (f.type === 'select') {
        return '<label class="calc-field">' + f.label + '<select data-f="' + f.id + '">' +
          f.options.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === cur ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') +
          '</select></label>';
      }
      return '<label class="calc-field">' + f.label + '<input data-f="' + f.id + '" type="number" inputmode="decimal" step="any" value="' + (isNum(cur) ? cur : '') + '"></label>';
    }
    function updateCalcTool() {
      var t = CALC_TOOLS.filter(function (x) { return x.id === calcActiveId; })[0];
      var res = t.compute(calcState[t.id]);
      var out = $('.calc-out', calcPanel);
      if (res.error) { out.innerHTML = '<p class="err">' + res.error + '</p>'; return; }
      out.innerHTML = '<dl class="calc-stats">' + res.results.map(function (r) {
        return '<div class="calc-stat ' + (r.primary ? 'primary ' : '') + (r.tone || '') + '"><dt>' + r.label + '</dt><dd>' + r.value + '</dd></div>';
      }).join('') + '</dl>' + (res.note ? '<p class="note">' + res.note + '</p>' : '') + (res.extra || '');
    }
    function renderCalcPanel() {
      var t = CALC_TOOLS.filter(function (x) { return x.id === calcActiveId; })[0];
      if (!calcState[t.id]) {
        calcState[t.id] = {};
        t.fields.forEach(function (f) { calcState[t.id][f.id] = f.value; });
      }
      calcPanel.setAttribute('aria-labelledby', 'calc-tab-' + t.id);
      calcPanel.innerHTML = '<h3>' + t.name + '</h3><p class="blurb">' + t.lead + '</p>' +
        '<div class="calc-fields">' + t.fields.map(function (f) { return calcFieldHtml(f, calcState[t.id][f.id]); }).join('') + '</div>' +
        '<div class="calc-out" aria-live="polite"></div>';
      $$('[data-f]', calcPanel).forEach(function (el) {
        var handler = function () {
          var f = el.getAttribute('data-f');
          calcState[t.id][f] = el.tagName === 'SELECT' ? el.value : parseFloat(el.value);
          updateCalcTool();
        };
        el.addEventListener('input', handler);
        el.addEventListener('change', handler);
      });
      updateCalcTool();
    }
    function selectCalcTool(id, focus) {
      calcActiveId = id;
      renderCalcTabs();
      renderCalcPanel();
      if (focus) $('#calc-tab-' + id).focus();
    }
    calcTabsEl.addEventListener('click', function (e) {
      var b = e.target.closest('.calc-tab');
      if (b) selectCalcTool(b.getAttribute('data-id'), false);
    });
    calcTabsEl.addEventListener('keydown', function (e) {
      var keys = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End'];
      if (keys.indexOf(e.key) === -1) return;
      e.preventDefault();
      var i = CALC_TOOLS.map(function (t) { return t.id; }).indexOf(calcActiveId);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') i = (i + 1) % CALC_TOOLS.length;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') i = (i - 1 + CALC_TOOLS.length) % CALC_TOOLS.length;
      else if (e.key === 'Home') i = 0;
      else i = CALC_TOOLS.length - 1;
      selectCalcTool(CALC_TOOLS[i].id, true);
    });
    renderCalcTabs();
    renderCalcPanel();
  })();
})();





