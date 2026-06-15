window.PricingEngine = (() => {
  const money = value => '$' + Math.round(value || 0).toLocaleString();
  const dollars = value => '$' + Number(value || 0).toFixed(2);
  const pct = value => ((value || 0) * 100).toFixed(1) + '%';
  const annualUnits = sku => Number(sku.monthlyUnits || 0) * 12;
  const revenue = sku => Number(sku.currentPrice || 0) * annualUnits(sku);
  const profit = sku => (Number(sku.currentPrice || 0) - Number(sku.cost || 0)) * annualUnits(sku);
  const margin = sku => Number(sku.currentPrice || 0) ? (Number(sku.currentPrice || 0) - Number(sku.cost || 0)) / Number(sku.currentPrice || 0) : 0;
  const competitorGap = sku => Number(sku.competitorPrice || 0) ? (Number(sku.currentPrice || 0) - Number(sku.competitorPrice || 0)) / Number(sku.competitorPrice || 0) : 0;
  const mapGap = sku => Number(sku.currentPrice || 0) - Number(sku.map || 0);
  const belowMap = sku => Number(sku.map || 0) > 0 && Number(sku.currentPrice || 0) < Number(sku.map || 0);

  function suggestedPrice(sku) {
    const current = Number(sku.currentPrice || 0);
    const cost = Number(sku.cost || 0);
    const map = Number(sku.map || 0);
    const competitor = Number(sku.competitorPrice || 0);
    const currentMargin = margin(sku);
    let target = current;
    let reason = 'Hold price and monitor';

    if (belowMap(sku)) {
      target = Math.max(map, competitor * 0.99 || map);
      reason = 'Correct MAP violation';
    } else if (currentMargin < 0.25 && competitor > current * 1.03) {
      target = Math.min(competitor * 0.985, cost / 0.72);
      reason = 'Improve low margin while staying competitive';
    } else if (competitor > current * 1.06) {
      target = current * 1.04;
      reason = 'Below market with room to increase';
    } else if (competitor < current * 0.94 && currentMargin > 0.30) {
      target = Math.max(competitor * 1.01, cost / 0.74, map || 0);
      reason = 'Reduce competitor gap while protecting margin';
    } else if (currentMargin > 0.45 && competitor > current) {
      target = current * 1.025;
      reason = 'Strong margin and acceptable market position';
    }

    return Math.max(target, map || 0, cost * 1.08);
  }

  function modelChange(sku, newPrice, mode = 'base') {
    const multiplier = mode === 'conservative' ? 0.65 : mode === 'aggressive' ? 1.3 : 1;
    const oldPrice = Number(sku.currentPrice || 0);
    const oldUnits = annualUnits(sku);
    const priceChange = oldPrice ? (newPrice - oldPrice) / oldPrice : 0;
    const unitChange = priceChange * Number(sku.elasticity || -1) * multiplier;
    const newUnits = Math.max(0, oldUnits * (1 + unitChange));
    return {
      newUnits,
      newRevenue: newPrice * newUnits,
      newProfit: (newPrice - Number(sku.cost || 0)) * newUnits,
      oldRevenue: revenue(sku),
      oldProfit: profit(sku),
      oldUnits
    };
  }

  function enrich(sku) {
    const suggested = suggestedPrice(sku);
    const modeled = modelChange(sku, suggested);
    const profitImpact = modeled.newProfit - modeled.oldProfit;
    const gap = competitorGap(sku);
    const confidence = belowMap(sku) ? 96 : Math.max(61, Math.min(94, 82 - Math.abs(gap) * 150 + Math.abs(profitImpact) / 500));
    const reason = belowMap(sku) ? 'Correct MAP violation' : suggested > Number(sku.currentPrice) ? 'Increase price opportunity' : suggested < Number(sku.currentPrice) ? 'Competitive price adjustment' : 'Monitor';
    return {...sku, annualUnits: annualUnits(sku), revenue: revenue(sku), profit: profit(sku), margin: margin(sku), competitorGap: gap, mapGap: mapGap(sku), belowMap: belowMap(sku), suggestedPrice: suggested, profitImpact, confidence, reason};
  }

  function portfolioMetrics(skus) {
    const enriched = skus.map(enrich);
    const totalRevenue = enriched.reduce((sum, sku) => sum + sku.revenue, 0);
    const totalProfit = enriched.reduce((sum, sku) => sum + sku.profit, 0);
    const totalOpportunity = enriched.reduce((sum, sku) => sum + Math.max(0, sku.profitImpact), 0);
    const mapViolations = enriched.filter(sku => sku.belowMap).length;
    const riskItems = enriched.filter(sku => sku.belowMap || Math.abs(sku.competitorGap) > 0.07 || sku.margin < 0.24).length;
    const weightedMargin = totalRevenue ? totalProfit / totalRevenue : 0;
    const healthScore = Math.max(0, Math.min(100, Math.round(100 - mapViolations * 7 - riskItems * 2 - Math.max(0, 0.32 - weightedMargin) * 100)));
    return {enriched, totalRevenue, totalProfit, totalOpportunity, mapViolations, riskItems, weightedMargin, healthScore};
  }

  function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    const headers = lines.shift().split(',').map(header => header.trim());
    return lines.map(line => {
      const values = line.split(',').map(value => value.trim());
      const row = {};
      headers.forEach((header, index) => row[header] = values[index]);
      ['cost','currentPrice','map','competitorPrice','monthlyUnits','elasticity'].forEach(key => row[key] = Number(row[key] || 0));
      return row;
    });
  }

  return {money, dollars, pct, annualUnits, revenue, profit, margin, competitorGap, mapGap, belowMap, suggestedPrice, modelChange, enrich, portfolioMetrics, parseCsv};
})();
