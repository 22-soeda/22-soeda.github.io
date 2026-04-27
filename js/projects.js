(function () {
  function buildCard(item) {
    const a = document.createElement('a');
    a.href = item.href;
    a.className =
      'custom-card is-hoverable cursor-pointer flex flex-col overflow-hidden block';

    const media = document.createElement('div');
    media.className = 'aspect-[4/3] custom-border-b relative bg-white';

    const imgModern = document.createElement('img');
    imgModern.src = item.thumbModern;
    imgModern.alt = item.title;
    imgModern.className = 'img-modern w-full h-full object-cover';

    var hasRetro =
      item.thumbRetro && String(item.thumbRetro).trim() !== '';
    if (!hasRetro) {
      media.classList.add('thumb-retro-pending');
    }

    media.appendChild(imgModern);
    if (hasRetro) {
      const imgRetro = document.createElement('img');
      imgRetro.src = item.thumbRetro;
      imgRetro.alt = item.title;
      imgRetro.className = 'img-retro w-full h-full object-cover';
      media.appendChild(imgRetro);
    }

    const body = document.createElement('div');
    body.className = 'p-6';

    const h3 = document.createElement('h3');
    h3.className = 'text-xl font-bold mb-3';
    h3.textContent = item.title;

    const p = document.createElement('p');
    p.className = 'opacity-90 leading-relaxed text-sm font-medium';
    p.textContent = item.summary;

    body.appendChild(h3);
    body.appendChild(p);

    a.appendChild(media);
    a.appendChild(body);
    return a;
  }

  function run() {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    fetch('data/projects.json')
      .then(function (r) {
        if (!r.ok) throw new Error('Failed to load projects: ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var list = data.projects;
        if (!Array.isArray(list)) return;
        grid.replaceChildren();
        list.forEach(function (item) {
          if (!item.href || !item.title) return;
          grid.appendChild(buildCard(item));
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
