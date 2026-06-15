window.pricingTerms = [
  ['Revenue','Total sales dollars before subtracting costs. Formula: price multiplied by units sold.'],
  ['Gross Profit','Revenue minus product cost. It shows dollars left after paying for the item.'],
  ['Gross Margin','Gross profit divided by revenue. It shows what percent of each sales dollar remains after product cost.'],
  ['Markup','Gross profit divided by cost. Margin and markup are not the same number.'],
  ['Contribution Margin','Revenue minus variable costs. Useful when shipping, fees, or labor vary by item.'],
  ['MAP','Minimum Advertised Price set by a manufacturer. Selling or advertising below MAP can create compliance risk.'],
  ['MSRP','Manufacturer Suggested Retail Price. A reference price, not always a required selling price.'],
  ['Competitive Index','Our price divided by competitor price. 1.00 means equal to market. 1.05 means 5% above.'],
  ['Elasticity','How demand changes when price changes. Elastic items lose more unit volume when price rises.'],
  ['Price Waterfall','A breakdown from list price to net price after discounts, rebates, credits, and other deductions.'],
  ['Revenue Leakage','Lost revenue caused by underpricing, excessive discounts, poor compliance, or missed price increases.'],
  ['Price Architecture','The structure of good, better, best pricing across related products.'],
  ['Price Corridor','The acceptable range between floor price and ceiling price.'],
  ['Floor Price','Lowest acceptable price based on cost, margin targets, MAP, or strategic rules.'],
  ['Ceiling Price','Highest reasonable price before demand, trust, or competitive position is harmed.'],
  ['Price Ladder','A set of increasing price points across product tiers or feature levels.'],
  ['Market Basket','A group of commonly compared products used to judge competitive position.'],
  ['Loss Leader','A product priced low to drive traffic, often accepted because other items recover profit.'],
  ['Penetration Pricing','Low initial pricing used to gain market share.'],
  ['Price Skimming','Higher initial pricing used when demand is strong or the product is differentiated.'],
  ['Dynamic Pricing','Pricing that changes based on demand, competition, inventory, or other signals.'],
  ['Repricing','Changing retail prices, often at SKU or category level.'],
  ['Buy Box','E-commerce placement often influenced by price, availability, delivery, and seller performance.'],
  ['Outlier','A data point far away from the normal pattern. Pricing outliers should be reviewed before decisions.'],
  ['Regression','A statistical method used to estimate relationships, such as price impact on demand.'],
  ['Bias','Consistent over-forecasting or under-forecasting in a model.'],
  ['MAPE','Mean Absolute Percentage Error. A common forecast accuracy metric.'],
  ['Cost Plus Pricing','Pricing by adding a target markup or margin to cost.'],
  ['Competitive Pricing','Pricing based on market and competitor position.'],
  ['Value Based Pricing','Pricing based on the value customers receive, not only cost or competitors.'],
  ['Category Management','Managing groups of related products as a portfolio instead of isolated SKUs.'],
  ['Assortment','The full set of products sold in a category or channel.'],
  ['SKU Rationalization','Reviewing SKUs to remove, replace, or focus items based on performance.'],
  ['Demand Driver','A factor that changes demand, such as seasonality, weather, promotions, or availability.'],
  ['Price Sensitivity','How strongly customers respond to price changes.'],
  ['Stockout','When an item is not available. Stockouts can distort pricing analysis because demand is constrained.'],
  ['Margin Mix','How total margin changes because sales shift between high-margin and low-margin items.'],
  ['A/B Test','Testing different prices or messages on similar groups to measure impact.'],
  ['Confidence','How much trust the analyst places in a recommendation based on data quality and signal strength.'],
  ['Actionability','Whether an insight can be turned into a real business decision.']
];

window.calculatorLessons = [
  {name:'Margin Calculator',formula:'Margin = (Price - Cost) / Price',example:'Price = $100, Cost = $60, Profit = $40, Margin = $40 / $100 = 40%',meaning:'For every $100 sold, $40 remains before operating expenses.'},
  {name:'Markup Calculator',formula:'Markup = (Price - Cost) / Cost',example:'Price = $100, Cost = $60, Markup = $40 / $60 = 66.7%',meaning:'Markup measures profit relative to cost. It is useful for cost-plus pricing.'},
  {name:'Suggested Price From Target Margin',formula:'Price = Cost / (1 - Target Margin)',example:'Cost = $60, Target Margin = 40%, Price = $60 / 0.60 = $100',meaning:'Use this when a category has a margin target and cost is known.'},
  {name:'Competitive Index',formula:'Competitive Index = Our Price / Competitor Price',example:'Our Price = $105, Competitor = $100, Index = 1.05',meaning:'An index above 1 means we are above competitor price. Below 1 means we are cheaper.'},
  {name:'MAP Gap',formula:'MAP Gap = Current Price - MAP',example:'Current Price = $94, MAP = $99, Gap = -$5',meaning:'A negative gap means the item is below MAP and should be reviewed.'},
  {name:'Elasticity Volume Response',formula:'Unit Change % = Price Change % x Elasticity',example:'Price increase = 5%, Elasticity = -1.2, Units change = -6%',meaning:'This estimates how demand may react when price changes.'},
  {name:'Revenue Impact',formula:'New Revenue - Current Revenue',example:'Current = $100 x 1,000 = $100,000. New = $103 x 960 = $98,880. Impact = -$1,120',meaning:'A price increase can still lower revenue if unit loss is too high.'},
  {name:'Gross Profit Impact',formula:'New Profit - Current Profit',example:'Cost = $60. Current profit = $40 x 1,000. New profit = $43 x 960. Impact = +$1,280',meaning:'Profit can improve even when revenue falls, depending on unit response.'},
  {name:'Weighted Margin',formula:'Total Gross Profit / Total Revenue',example:'Profit = $30,000 and Revenue = $100,000. Weighted Margin = 30%',meaning:'Portfolio margin should be weighted by sales, not averaged by SKU.'},
  {name:'Annualized Opportunity',formula:'Monthly Impact x 12',example:'Monthly profit lift = $2,500. Annualized opportunity = $30,000',meaning:'Helps leaders understand the scale of pricing decisions.'}
];

window.analystResources = [
  {title:'Excel',items:['Pivot tables','XLOOKUP','Power Query','Data validation','Scenario modeling','Conditional formatting']},
  {title:'SQL',items:['Sales by SKU','Price history pulls','Competitor feed joins','Margin reporting','Category rollups']},
  {title:'Power BI or Tableau',items:['Executive dashboards','Category health views','Trend reporting','Exception queues','Drillable reports']},
  {title:'Python or R',items:['Data cleaning','Elasticity modeling','Forecasting','Outlier detection','Competitor scraping support']},
  {title:'Competitive Price Sources',items:['Competitor websites','Google Shopping','Manufacturer authorized dealer pages','Marketplace feeds','Internal competitor data vendors']},
  {title:'Pricing Governance',items:['MAP rules','Approval workflow','Price change logs','Post-launch validation','Audit trail']},
  {title:'Financial Knowledge',items:['Revenue','Gross profit','Margin','Markup','Contribution margin','Profitability impact']},
  {title:'Communication',items:['Executive summaries','Category recommendations','Risk callouts','Simple visuals','Clear next actions']},
  {title:'Data Quality',items:['SKU matching','Unit of measure checks','Missing cost flags','Duplicate product records','Outlier review']}
];

window.challenges = [
  {title:'Competitor Drop',prompt:'A main competitor drops a high-volume SKU by 8%. Your margin is 32%, stock is strong, and MAP is not a constraint. What should you do first?',options:['Immediately undercut by 10%','Investigate volume, margin, and category role before changing price','Ignore it because margin is healthy','Raise price to protect profit'],answer:1,feedback:'Correct. A pricing analyst should not blindly match. First check demand, margin, competitor reliability, product match, inventory position, and category strategy.'},
  {title:'MAP Violation',prompt:'A SKU is priced at $94.99 and manufacturer MAP is $99.99. Competitors are at $104.99. What is the best recommendation?',options:['Keep price because it is selling','Raise at least to MAP and monitor demand','Drop price further','Remove the item from reporting'],answer:1,feedback:'Correct. The item is below MAP and below market. Raising to MAP reduces compliance risk and may improve margin without harming position too much.'},
  {title:'Elasticity Tradeoff',prompt:'A 5% price increase is expected to reduce units by 7%. Unit margin improves from $20 to $25. What should you compare?',options:['Only revenue','Only units sold','Gross profit before and after','Only competitor price'],answer:2,feedback:'Correct. Pricing decisions should compare profit impact, not just revenue or units.'},
  {title:'Category Health',prompt:'A category has strong revenue growth but falling weighted margin and more SKUs below competitor price. What should be reviewed?',options:['Only low-selling SKUs','Margin mix and underpriced high-volume SKUs','Only MAP violations','Nothing because revenue is growing'],answer:1,feedback:'Correct. Revenue growth can hide margin leakage. Weighted margin, mix, and high-volume underpricing should be reviewed.'}
];
