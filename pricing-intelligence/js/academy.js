window.Academy = (() => {
  function renderCalculators(container, lessons) {
    container.innerHTML = lessons.map(lesson => `
      <article class="calculator-card">
        <h3>${lesson.name}</h3>
        <div class="formula">${lesson.formula}</div>
        <p class="math-example"><strong>Math example:</strong><br>${lesson.example}</p>
        <p><strong>Business meaning:</strong> ${lesson.meaning}</p>
      </article>
    `).join('');
  }
  function renderDictionary(container, terms, query = '') {
    const q = query.trim().toLowerCase();
    const filtered = terms.filter(([term, definition]) => !q || term.toLowerCase().includes(q) || definition.toLowerCase().includes(q));
    container.innerHTML = filtered.map(([term, definition]) => `
      <article class="dictionary-card">
        <h3>${term}</h3>
        <p>${definition}</p>
      </article>
    `).join('');
  }
  function renderResources(container, resources) {
    container.innerHTML = resources.map(resource => `
      <article class="resource-card">
        <h3>${resource.title}</h3>
        <ul>${resource.items.map(item => `<li>${item}</li>`).join('')}</ul>
      </article>
    `).join('');
  }
  return {renderCalculators, renderDictionary, renderResources};
})();
