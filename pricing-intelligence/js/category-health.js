window.CategoryHealth = (() => {
  function groupByCategory(enriched) {
    const groups = {};
    enriched.forEach(sku => {
      if (!groups[sku.category]) groups[sku.category] = [];
      groups[sku.category].push(sku);
    });
    return Object.entries(groups).map(([category, skus]) => {
      const revenue = skus.reduce((sum, sku) => sum + sku.revenue, 0);
      const profit = skus.reduce((sum, sku) => sum + sku.profit, 0);
      const opportunity = skus.reduce((sum, sku) => sum + Math.max(0, sku.profitImpact), 0);
      const margin = revenue ? profit / revenue : 0;
      const mapIssues = skus.filter(sku => sku.belowMap).length;
      const competitorRisks = skus.filter(sku => Math.abs(sku.competitorGap) > 0.07).length;
      const lowMargin = skus.filter(sku => sku.margin < 0.25).length;
      const score = Math.max(0, Math.min(100, Math.round(100 - mapIssues * 12 - competitorRisks * 6 - lowMargin * 7 + margin * 8)));
      return {category, skus, revenue, profit, opportunity, margin, mapIssues, competitorRisks, lowMargin, score};
    }).sort((a,b) => b.opportunity - a.opportunity);
  }
  return {groupByCategory};
})();
