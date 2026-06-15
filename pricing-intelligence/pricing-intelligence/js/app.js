let activeSkus = window.sampleSkus.slice();
let activeChallenge = 0;

const $ = id => document.getElementById(id);
const engine = window.PricingEngine;

function badge(text, type) {
  return `<span class="badge ${type}">${text}</span>`;
}

function setView(view) {
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === view));
  document.querySelectorAll('.view').forEach(panel => panel.classList.toggle('active', panel.id === view));
}

function renderOverview() {
  const metrics = engine.portfolioMetrics(activeSkus);
  $('healthScore').textContent = metrics.healthScore;
  $('healthText').textContent = metrics.healthScore >= 85 ? 'Strong, monitor exceptions' : metrics.healthScore >= 70 ? 'Good, needs targeted action' : 'Needs pricing review';
  $('kpiRevenue').textContent = engine.money(metrics.totalRevenue);
  $('kpiMargin').textContent = engine.pct(metrics.weightedMargin);
  $('kpiOpportunity').textContent = engine.money(metrics.totalOpportunity);
  $('kpiMap').textContent = metrics.mapViolations;

  const priorities = metrics.enriched
    .filter(sku => sku.belowMap || Math.abs(sku.competitorGap) > 0.06 || sku.profitImpact > 500)
    .sort((a,b) => Math.abs(b.profitImpact) - Math.abs(a.profitImpact))
    .slice(0, 10);

  $('priorityRows').innerHTML = priorities.map((sku, index) => {
    const issue = sku.belowMap ? 'MAP violation' : sku.competitorGap > 0.06 ? 'Above competitor' : sku.competitorGap < -0.06 ? 'Below market' : 'Profit opportunity';
    const type = sku.belowMap ? 'bad' : Math.abs(sku.competitorGap) > 0.06 ? 'warn' : 'ok';
    return `<tr><td>${index + 1}</td><td>${sku.sku}</td><td>${sku.category}</td><td>${badge(issue, type)}</td><td>${sku.reason} to ${engine.dollars(sku.suggestedPrice)}</td><td>${engine.money(sku.profitImpact)}</td></tr>`;
  }).join('');

  $('executiveBrief').innerHTML = `
    <p><strong>Portfolio readout:</strong> Current annualized revenue is ${engine.money(metrics.totalRevenue)} with a weighted gross margin of ${engine.pct(metrics.weightedMargin)}.</p>
    <p><strong>Action required:</strong> ${metrics.mapViolations} SKU${metrics.mapViolations === 1 ? '' : 's'} are below MAP and ${metrics.riskItems} SKU${metrics.riskItems === 1 ? '' : 's'} need pricing review due to margin or competitive positioning.</p>
    <p><strong>Estimated upside:</strong> The modeled positive annual gross profit opportunity is ${engine.money(metrics.totalOpportunity)} if recommended price actions are approved and validated after launch.</p>
  `;
}

function renderCategories() {
  const categories = CategoryHealth.groupByCategory(engine.portfolioMetrics(activeSkus).enriched);
  $('categoryCards').innerHTML = categories.map((cat, index) => `
    <button class="category-card ${index === 0 ? 'active' : ''}" data-category="${cat.category}">
      <h3>${cat.category}</h3>
      <p>${cat.skus.length} SKUs · ${engine.money(cat.revenue)} revenue · ${engine.pct(cat.margin)} margin</p>
      <div class="score-line"><span style="width:${cat.score}%"></span></div>
      <p>${cat.mapIssues} MAP issues · ${cat.competitorRisks} competitor risks · ${engine.money(cat.opportunity)} opportunity</p>
    </button>
  `).join('');
  document.querySelectorAll('.category-card').forEach(card => card.addEventListener('click', () => renderCategoryDetail(card.dataset.category)));
  if (categories[0]) renderCategoryDetail(categories[0].category);
}

function renderCategoryDetail(categoryName) {
  document.querySelectorAll('.category-card').forEach(card => card.classList.toggle('active', card.dataset.category === categoryName));
  const categories = CategoryHealth.groupByCategory(engine.portfolioMetrics(activeSkus).enriched);
  const category = categories.find(cat => cat.category === categoryName);
  if (!category) return;
  $('detailTitle').textContent = category.category;
  $('detailSubtitle').textContent = 'Drillable category view with category score, SKU actions, MAP risk, and market position.';
  $('detailMetrics').innerHTML = `
    <article class="kpi"><span>Health Score</span><strong>${category.score}</strong><small>Weighted category risk score</small></article>
    <article class="kpi"><span>Revenue</span><strong>${engine.money(category.revenue)}</strong><small>Annualized current revenue</small></article>
    <article class="kpi"><span>Margin</span><strong>${engine.pct(category.margin)}</strong><small>Weighted gross margin</small></article>
    <article class="kpi"><span>Opportunity</span><strong>${engine.money(category.opportunity)}</strong><small>Modeled gross profit upside</small></article>
  `;
  $('detailRows').innerHTML = category.skus.map(sku => {
    const action = sku.belowMap ? 'Raise to MAP' : sku.profitImpact > 200 ? 'Review increase' : Math.abs(sku.competitorGap) > 0.06 ? 'Review market gap' : 'Hold';
    return `<tr><td>${sku.sku}</td><td>${engine.dollars(sku.currentPrice)}</td><td>${engine.dollars(sku.cost)}</td><td>${engine.pct(sku.margin)}</td><td>${engine.dollars(sku.competitorPrice)}</td><td>${engine.dollars(sku.map)}</td><td>${action}</td></tr>`;
  }).join('');
}

function renderOpportunity() {
  const rows = engine.portfolioMetrics(activeSkus).enriched
    .sort((a,b) => Math.max(0, b.profitImpact) - Math.max(0, a.profitImpact));
  $('opportunityRows').innerHTML = rows.map((sku, index) => `
    <tr><td>${index + 1}</td><td>${sku.sku}</td><td>${sku.category}</td><td>${engine.dollars(sku.currentPrice)}</td><td>${engine.dollars(sku.suggestedPrice)}</td><td>${sku.reason}</td><td>${engine.money(sku.profitImpact)}</td><td>${Math.round(sku.confidence)}%</td></tr>
  `).join('');
}

function renderSimulator() {
  const categories = [...new Set(activeSkus.map(sku => sku.category))];
  const existing = $('simCategory').value;
  $('simCategory').innerHTML = categories.map(category => `<option>${category}</option>`).join('');
  if (categories.includes(existing)) $('simCategory').value = existing;
  calculateSimulator();
}

function calculateSimulator() {
  const category = $('simCategory').value;
  const change = Number($('priceChange').value || 0) / 100;
  const mode = $('elasticityMode').value;
  $('priceChangeLabel').textContent = `${change >= 0 ? '+' : ''}${Math.round(change * 100)}%`;
  const skus = activeSkus.filter(sku => sku.category === category);
  const modeled = skus.map(sku => engine.modelChange(sku, Number(sku.currentPrice) * (1 + change), mode));
  const oldRevenue = modeled.reduce((sum, item) => sum + item.oldRevenue, 0);
  const newRevenue = modeled.reduce((sum, item) => sum + item.newRevenue, 0);
  const oldProfit = modeled.reduce((sum, item) => sum + item.oldProfit, 0);
  const newProfit = modeled.reduce((sum, item) => sum + item.newProfit, 0);
  const newUnits = modeled.reduce((sum, item) => sum + item.newUnits, 0);
  $('simRevenue').textContent = engine.money(newRevenue - oldRevenue);
  $('simProfit').textContent = engine.money(newProfit - oldProfit);
  $('simUnits').textContent = Math.round(newUnits).toLocaleString();
  $('simMargin').textContent = engine.pct(newRevenue ? newProfit / newRevenue : 0);
}

function renderMap() {
  const rows = engine.portfolioMetrics(activeSkus).enriched.sort((a,b) => a.mapGap - b.mapGap);
  $('mapRows').innerHTML = rows.map(sku => {
    const status = sku.belowMap ? badge('Violation', 'bad') : badge('Compliant', 'ok');
    const correction = sku.belowMap ? engine.dollars(Math.max(sku.map, sku.competitorPrice * 0.99)) : 'None';
    return `<tr><td>${sku.sku}</td><td>${sku.brand}</td><td>${sku.category}</td><td>${engine.dollars(sku.currentPrice)}</td><td>${engine.dollars(sku.map)}</td><td>${engine.dollars(sku.mapGap)}</td><td>${correction}</td><td>${status}</td></tr>`;
  }).join('');
}

function renderCompetitive() {
  const rows = engine.portfolioMetrics(activeSkus).enriched.sort((a,b) => Math.abs(b.competitorGap) - Math.abs(a.competitorGap));
  const above = rows.filter(sku => sku.competitorGap > 0.05).length;
  const below = rows.filter(sku => sku.competitorGap < -0.05).length;
  const aligned = rows.length - above - below;
  $('competitiveSummary').innerHTML = `
    <div class="summary-item"><strong>${above} SKUs above market</strong><span>Review demand sensitivity and margin cushion before matching competitors.</span></div>
    <div class="summary-item"><strong>${below} SKUs below market</strong><span>Potential price increase opportunity if stock, conversion, and MAP support it.</span></div>
    <div class="summary-item"><strong>${aligned} SKUs aligned</strong><span>Monitor for changes and validate against product match quality.</span></div>
  `;
  const sources = [
    ['Competitor websites','Track matching product pages, sale prices, availability, and shipping terms.'],
    ['Google Shopping','Search by brand, model, MPN, UPC, or exact SKU to compare retailers.'],
    ['Manufacturer sites','Check MAP, MSRP, dealer lists, discontinued status, and product specs.'],
    ['Marketplace feeds','Watch Amazon, Walmart, eBay, and specialty marketplaces if relevant.'],
    ['Vendor data providers','Enterprise teams may use tools like Profitero, DataWeave, PriceSpider, or Pricefx.'],
    ['Internal sales data','Validate whether competitor gaps actually impact conversion and volume.']
  ];
  $('priceSources').innerHTML = sources.map(([title, text]) => `<div class="resource-item"><strong>${title}</strong><span>${text}</span></div>`).join('');
  $('competitiveRows').innerHTML = rows.map(sku => {
    const gap = sku.competitorGap;
    const position = gap > 0.05 ? badge('Above market', 'warn') : gap < -0.05 ? badge('Below market', 'info') : badge('Aligned', 'ok');
    const note = gap > 0.05 ? 'Check elasticity and competitor match quality.' : gap < -0.05 ? 'Review if price increase is safe.' : 'Maintain and monitor.';
    return `<tr><td>${sku.sku}</td><td>${sku.category}</td><td>${engine.dollars(sku.currentPrice)}</td><td>${engine.dollars(sku.competitorPrice)}</td><td>${engine.pct(gap)}</td><td>${position}</td><td>${note}</td></tr>`;
  }).join('');
}

function renderChallenge() {
  const challenge = window.challenges[activeChallenge];
  $('challengeTitle').textContent = challenge.title;
  $('challengePrompt').textContent = challenge.prompt;
  $('challengeFeedback').innerHTML = '';
  $('challengeOptions').innerHTML = challenge.options.map((option, index) => `<button data-answer="${index}">${option}</button>`).join('');
  document.querySelectorAll('#challengeOptions button').forEach(button => {
    button.addEventListener('click', () => {
      const selected = Number(button.dataset.answer);
      document.querySelectorAll('#challengeOptions button').forEach((btn, index) => {
        btn.classList.toggle('correct', index === challenge.answer);
        btn.classList.toggle('wrong', index === selected && selected !== challenge.answer);
      });
      $('challengeFeedback').innerHTML = `<p>${challenge.feedback}</p>`;
    });
  });
}

function renderAll() {
  renderOverview();
  renderCategories();
  renderOpportunity();
  renderSimulator();
  renderMap();
  renderCompetitive();
  Academy.renderCalculators($('calculatorCards'), window.calculatorLessons);
  Academy.renderDictionary($('dictionaryCards'), window.pricingTerms, $('dictionarySearch').value);
  Academy.renderResources($('resourceCards'), window.analystResources);
  renderChallenge();
}

document.querySelectorAll('.nav-item').forEach(button => button.addEventListener('click', () => setView(button.dataset.view)));
$('loadSampleBtn').addEventListener('click', () => { activeSkus = window.sampleSkus.slice(); renderAll(); });
$('csvInput').addEventListener('change', event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { activeSkus = engine.parseCsv(reader.result); renderAll(); };
  reader.readAsText(file);
});
$('printBriefBtn').addEventListener('click', () => window.print());
$('simCategory').addEventListener('change', calculateSimulator);
$('priceChange').addEventListener('input', calculateSimulator);
$('elasticityMode').addEventListener('change', calculateSimulator);
$('dictionarySearch').addEventListener('input', () => Academy.renderDictionary($('dictionaryCards'), window.pricingTerms, $('dictionarySearch').value));
$('nextChallengeBtn').addEventListener('click', () => { activeChallenge = (activeChallenge + 1) % window.challenges.length; renderChallenge(); });

renderAll();
