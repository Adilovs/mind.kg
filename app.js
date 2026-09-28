const { worlds, topics, levels, taxonomy, taxonomyEdges, getTopic, getWorldTopics } = window.MindContent;

const view = document.querySelector('#view');
const crumbs = document.querySelector('#breadcrumbs');
const searchModal = document.querySelector('#search-modal');
const searchInput = document.querySelector('#global-search');
let activeWorld = 'ai';
let selectedRoadmap = 'ai';
let activeDepth = 'intuitive';
let searchIndex = 0;
let focusedCategory = null;
let selectedMapTopic = null;
let graphScale = 1;
let graphOffset = { x: 0, y: 0 };
let graphDrag = null;
let darkTheme = localStorage.getItem('mind-theme') === 'dark';
document.documentElement.dataset.theme = darkTheme ? 'dark' : 'light';

const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const worldById = id => worlds.find(world => world.id === id);
const levelFor = id => levels[id] || levels.foundation;
const topicLink = (id, label) => getTopic(id) ? `<a class="topic-link" href="#topic/${id}">${esc(label || getTopic(id).title)}<span>↗</span></a>` : `<span class="topic-link muted-topic">${esc(label || id.replaceAll('-', ' '))}</span>`;
const setCrumb = (...items) => { crumbs.innerHTML = items.map((item, i) => `${i ? '<span class="crumb-sep">/</span>' : ''}<span>${esc(item)}</span>`).join(''); };
const activateNav = (id) => { document.querySelectorAll('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === id)); };

function renderHome() {
  activateNav('home'); setCrumb('Главная');
  view.innerHTML = `
    <section class="hero-grid">
      <div class="hero-copy">
        <div class="eyebrow"><span class="eyebrow-line"></span>КАРТА ЗНАНИЙ · ОТКРЫТЫЙ ПУТЬ</div>
        <h1>От нуля<br />до <span class="accent-text">AI Engineer</span><span class="hero-period">.</span></h1>
        <p class="hero-description">Изучай математику, физику, Computer Science и искусственный интеллект через единую карту знаний.</p>
        <div class="hero-actions"><a class="button button-dark" href="#roadmap">Найти свой путь <span>↗</span></a><a class="text-button" href="#world/ai">Исследовать карту <span>→</span></a></div>
        <div class="hero-footnote"><span class="status-dot"></span>Без регистрации · Начни с того, что уже знаешь</div>
      </div>
      <div class="hero-visual" aria-label="Визуальная карта связей знаний">
        <div class="visual-head"><span>КАРТА ЗНАНИЙ</span><span class="live-indicator">● LIVE MAP</span></div>
        <div class="constellation">
          <svg viewBox="0 0 540 350" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="M96 176 190 104 284 155 380 82 453 145M96 176 190 245 284 155 354 263 453 145M190 104 211 43 380 82M190 245 112 300M284 155 354 263 454 307M380 82 453 145"/><path class="path-highlight" d="M96 176 190 104 284 155 380 82 453 145"/></svg>
          <a href="#topic/python" class="map-node node-python"><span class="node-dot"></span><span>Python</span></a>
          <a href="#topic/linear-algebra" class="map-node node-linear"><span class="node-dot"></span><span>Linear algebra</span></a>
          <a href="#topic/machine-learning" class="map-node node-ml featured"><span class="node-dot"></span><span>Machine learning</span></a>
          <a href="#topic/neural-networks" class="map-node node-nn"><span class="node-dot"></span><span>Neural networks</span></a>
          <a href="#topic/transformers" class="map-node node-transformers"><span class="node-dot"></span><span>Transformers</span></a>
          <a href="#topic/probability" class="map-node node-prob"><span class="node-dot"></span><span>Probability</span></a>
          <a href="#topic/algorithms" class="map-node node-alg"><span class="node-dot"></span><span>Algorithms</span></a>
          <span class="map-orbit orbit-one"></span><span class="map-orbit orbit-two"></span>
        </div>
        <div class="visual-foot"><span>${topics.length} тем в карте знаний</span><span>ОБНОВЛЯЕТСЯ</span></div>
      </div>
    </section>
    <section class="section-block worlds-section">
      <div class="section-heading"><div><div class="eyebrow">EXPLORE THE WORLDS · 6 ПРОСТРАНСТВ</div><h2>Куда ведёт любопытство?</h2></div><a class="section-link" href="#roadmap">Смотреть roadmap <span>↗</span></a></div>
      <div class="world-grid">${[
        ...worlds.map(world=>({...world, href:`#world/${world.id}`, count:`${getWorldTopics(world.id).length} узлов знаний`, action:'Открыть карту'})),
        {id:'research',title:'Research',en:'OPEN QUESTIONS',icon:'⌕',color:'violet',description:'Открытые вопросы, важные результаты и исследовательские направления.',href:'#research',count:'Математика · Физика · AI',action:'Исследовать'},
        {id:'lab',title:'AI Lab',en:'INTERACTIVE LAB',icon:'⚗',color:'mint',description:'Эксперименты и визуальные инструменты для изучения идей AI.',href:'#lab',count:'6 экспериментальных сред',action:'Открыть лабораторию'},
      ].map((item,index) => `<a class="world-card ${item.color}" href="${item.href}"><div class="world-card-top"><span class="world-icon">${item.icon}</span><span class="world-number">0${index + 1} / 06</span></div><div class="world-en">${item.en}</div><h3>${item.title}</h3><p>${item.description}</p><div class="world-card-bottom"><span>${item.count}</span><span class="arrow-circle">↗</span></div></a>`).join('')}</div>
    </section>
    <section class="learning-strip"><div><span class="strip-mark">✳</span><div><div class="eyebrow">НЕ ПРОСТО КУРСЫ</div><h2>Каждая тема объясняет,<br /><span>что было до и что будет дальше.</span></h2></div></div><div class="learning-steps">${['Понять','Визуализировать','Практиковать','Связать'].map((s,i)=>`<span><i>0${i+1}</i>${s}</span>`).join('')}</div></section>
    <section class="section-block start-section"><div class="start-card"><div><div class="eyebrow">ТВОЯ ТОЧКА СТАРТА</div><h2>Не уверен, с чего начать?</h2><p>Выбери цель — карта соберёт путь из связанных тем, от основ к практике.</p></div><a href="#roadmap" class="button button-light">Открыть карту пути <span>→</span></a></div></section>`;
}

function renderWorld(id) {
  activeWorld = id;
  const world = worldById(id); if (!world) return renderHome();
  activateNav(id); setCrumb('Исследуй', world.title);
  const localList = getWorldTopics(id);
  const categories = taxonomy.filter(category=>category.world===id).map(category=>({...category,topics:category.children.map(getTopic).filter(Boolean)})).filter(category=>category.topics.length);
  const list = [...new Map([...localList,...categories.flatMap(category=>category.topics)].map(topic=>[topic.id,topic])).values()];
  const covered = new Set(categories.flatMap(category=>category.topics.map(topic=>topic.id)));
  const loose = list.filter(topic=>!covered.has(topic.id));
  if(loose.length) categories.push({id:'additional-topics',title:'Другие темы карты',level:'foundation',topics:loose});
  const levelCounts = [...new Set(list.map(topic => topic.level))].map(l => `${levelFor(l).label} ${list.filter(t=>t.level===l).length}`).join('　·　');
  view.innerHTML = `<section class="world-hero ${world.color}"><div class="eyebrow"><span class="eyebrow-line"></span>${world.en} · РАСШИРЯЕМАЯ TAXONOMY</div><div class="world-hero-row"><div><h1>${world.title}<span class="hero-period">.</span></h1><p>${world.description}</p></div><span class="world-hero-icon">${world.icon}</span></div><div class="world-meta"><span>${list.length} структурированных узлов</span><span>${categories.length} крупных областей</span><span>${levelCounts}</span><span class="curriculum-note">Учебная программа расширяется</span></div></section>
    <div class="world-layout"><aside class="world-index"><div class="index-title">ОБЛАСТИ <span>${String(categories.length).padStart(2,'0')}</span></div>${categories.map((category,i)=>`<a href="#section-${category.id}"><span>${String(i+1).padStart(2,'0')}</span>${esc(category.title)}</a>`).join('')}<a class="index-roadmap" href="#roadmap/${id}"><span>⌁</span>Открыть карту узлов ↗</a></aside><div class="topic-catalog">${categories.map((category,i)=>{const group=category.topics; return `<section class="catalog-section" id="section-${category.id}"><div class="catalog-heading"><div><span class="catalog-kicker">ОБЛАСТЬ ${String(i+1).padStart(2,'0')} · ${levelFor(category.level).label.toUpperCase()}</span><h2>${esc(category.title)}</h2></div><span>${group.length} узлов <span class="curriculum-note">· программа расширяется</span></span></div><div class="catalog-list">${group.map((topic,j)=>`<a class="catalog-topic" href="#topic/${topic.id}"><span class="topic-index">${String(j+1).padStart(2,'0')}</span><div class="catalog-topic-main"><h3>${esc(topic.title)}</h3><p>${esc(topic.overview||topic.subtitle)}</p><div class="catalog-relations">${topic.prerequisites.length?`<span>Предпосылки:</span> ${topic.prerequisites.slice(0,2).map(id=>getTopic(id)?.title).filter(Boolean).join(' · ')}`:'<span>Начальный узел области</span>'}</div></div><span class="level-pill ${levelFor(topic.level).color}">${levelFor(topic.level).label}</span><span class="catalog-arrow">↗</span></a>`).join('')}</div></section>`;}).join('')}</div></div>`;
}

function layoutDag(nodes, edges, { xGap=290, yGap=145, xStart=140, yStart=115, maxRows=7, vertical=false, minWidth=1200 } = {}) {
  if(vertical){const positions=new Map();nodes.forEach((node,index)=>positions.set(node.id,{x:xStart,y:yStart+index*yGap}));return {positions,width:minWidth,height:Math.max(650,yStart+nodes.length*yGap+80)};}
  const ids=new Set(nodes.map(node=>node.id)); const incoming=new Map(nodes.map(node=>[node.id,[]]));
  edges.forEach(edge=>{if(ids.has(edge.from)&&ids.has(edge.to))incoming.get(edge.to).push(edge.from);});
  const stages=new Map(); const stageOf=(id,stack=new Set())=>{if(stages.has(id))return stages.get(id);if(stack.has(id))return 0;stack.add(id);const prev=incoming.get(id)||[];const value=prev.length?Math.max(...prev.map(parent=>stageOf(parent,stack)+1)):0;stack.delete(id);stages.set(id,value);return value;};
  nodes.forEach(node=>stageOf(node.id));
  const columns=new Map();nodes.forEach(node=>{const col=stages.get(node.id);if(!columns.has(col))columns.set(col,[]);columns.get(col).push(node);});
  for(const col of columns.values())col.sort((a,b)=>a.title.localeCompare(b.title,'ru'));
  const positions=new Map();let maxY=0;
  for(const [col,items] of columns){items.forEach((node,index)=>{const row=index%maxRows;const lane=Math.floor(index/maxRows);const pos={x:xStart+col*xGap,y:yStart+row*yGap+lane*maxRows*yGap};positions.set(node.id,pos);maxY=Math.max(maxY,pos.y);});}
  return {positions,width:Math.max(minWidth,...[...stages.values()].map(s=>xStart+s*xGap+280)),height:Math.max(650,maxY+yGap+100)};
}

function getCategoryEdges(categoryIds) {
  const worldCategories=taxonomy.filter(category=>category.world===selectedRoadmap);
  const known=new Set(worldCategories.map(category=>category.id));
  return taxonomyEdges.filter(([from,to])=>known.has(from)&&known.has(to)&&categoryIds.has(from)&&categoryIds.has(to)).map(([from,to])=>({from,to,kind:'leads-to'}));
}

function renderRoadmap() {
  activateNav('roadmap');
  const world=worldById(selectedRoadmap)||worldById('ai');
  const categories=taxonomy.filter(category=>category.world===selectedRoadmap);
  const category=categories.find(item=>item.id===focusedCategory);
  const backLabel=category?`<button class="map-back" id="map-back">← Все области ${world.title}</button>`:'';
  setCrumb('Roadmap',world.title,...(category?[category.title]:[]));
  let nodes,edges,layout, nodeWidth,nodeHeight;
  const compactMap=window.matchMedia('(max-width: 760px)').matches;
  if(category){
    nodes=category.children.map(getTopic).filter(Boolean);
    const nodeIds=new Set(nodes.map(node=>node.id));
    edges=[];nodes.forEach(node=>{
      node.next.forEach(target=>{if(nodeIds.has(target))edges.push({from:node.id,to:target,kind:'leads-to'});});
      node.prerequisites.forEach(target=>{if(nodeIds.has(target))edges.push({from:target,to:node.id,kind:'prerequisite'});});
    });
    const unique=new Map(edges.map(edge=>[`${edge.from}:${edge.to}`,edge]));edges=[...unique.values()];
    nodeWidth=216;nodeHeight=88;layout=layoutDag(nodes,edges,{xGap:300,yGap:142,xStart:compactMap?175:150,yStart:120,maxRows:7,vertical:compactMap,minWidth:compactMap?350:1200});
  } else {
    nodes=categories;
    edges=getCategoryEdges(new Set(nodes.map(node=>node.id)));
    nodeWidth=236;nodeHeight=108;layout=layoutDag(nodes,edges,{xGap:320,yGap:170,xStart:compactMap?175:170,yStart:compactMap?125:140,maxRows:5,vertical:compactMap,minWidth:compactMap?350:1200});
  }
  const points=layout.positions;
  const edgeMarkup=edges.map(edge=>{const a=points.get(edge.from),b=points.get(edge.to);if(!a||!b)return '';if(compactMap){const x1=a.x,y1=a.y+nodeHeight/2-3,x2=b.x,y2=b.y-nodeHeight/2+3,mid=(y1+y2)/2;return `<path class="map-edge ${edge.kind}" d="M ${x1} ${y1} C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${y2}" marker-end="url(#map-arrow)"/>`;}const x1=a.x+nodeWidth/2-5,y1=a.y+nodeHeight/2,x2=b.x-nodeWidth/2+5,y2=b.y+nodeHeight/2,mid=(x1+x2)/2;return `<path class="map-edge ${edge.kind}" d="M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}" marker-end="url(#map-arrow)"/>`;}).join('');
  const nodeMarkup=nodes.map((node,index)=>{const p=points.get(node.id);const selected=selectedMapTopic===node.id;const count=category?`${node.prerequisites.length} prerequisites · ${node.next.length} next`: `${node.children.map(getTopic).filter(Boolean).length} topics · ${levelFor(node.level).label}`;return `<g class="knowledge-node ${category?'topic-map-node':'category-map-node'} ${selected?'selected':''}" transform="translate(${p.x-nodeWidth/2},${p.y-nodeHeight/2})" ${category?`data-map-topic="${node.id}" role="button" tabindex="0" aria-label="Открыть узел ${esc(node.title)}"`:`data-category="${node.id}" role="button" tabindex="0" aria-label="Развернуть область ${esc(node.title)}"`}><rect width="${nodeWidth}" height="${nodeHeight}" rx="9"/><text class="map-node-index" x="15" y="21">${category?'NODE':'AREA'} · ${String(index+1).padStart(2,'0')}</text><text class="map-node-title" x="15" y="47">${esc(node.title.length>24?node.title.slice(0,23)+'…':node.title)}</text><text class="map-node-caption" x="15" y="68">${esc(count)}</text><text class="map-node-action" x="${nodeWidth-22}" y="${nodeHeight-17}">${category?'↗':'＋'}</text></g>`;}).join('');
  const selectedTopic=category&&selectedMapTopic?getTopic(selectedMapTopic):null;
  const detail=selectedTopic?`<aside class="map-inspector" aria-label="Выбранная тема"><button class="inspector-close" id="inspector-close" aria-label="Закрыть карточку темы">×</button><span class="eyebrow">${world.en} · ${levelFor(selectedTopic.level).label.toUpperCase()}</span><h3>${esc(selectedTopic.title)}</h3><p>${esc(selectedTopic.overview||selectedTopic.subtitle)}</p><div class="inspector-relations"><span>ПЕРЕД ЭТИМ</span>${selectedTopic.prerequisites.length?selectedTopic.prerequisites.map(id=>getTopic(id)).filter(Boolean).slice(0,3).map(item=>`<a href="#topic/${item.id}">${esc(item.title)}</a>`).join(''):'<small>Начальный узел</small>'}</div><a class="button button-dark" href="#topic/${selectedTopic.id}">Открыть страницу темы <span>↗</span></a></aside>`:'';
  const tabItems=[['math','Математика'],['physics','Физика'],['cs','Computer Science'],['ai','AI']];
  view.innerHTML=`<section class="map-page-head"><div><div class="eyebrow"><span class="eyebrow-line"></span>ИНТЕРАКТИВНАЯ KNOWLEDGE MAP</div><h1>Карта знаний<span class="hero-period">.</span></h1><p>Выбирай область, раскрывай связанные темы и прослеживай путь между идеями.</p></div><div class="map-head-meta"><span class="status-dot"></span>${topics.length} узлов · taxonomy расширяется</div></section><div class="map-workspace"><div class="map-toolbar"><div class="map-world-tabs">${tabItems.map(([id,label])=>`<button data-map-world="${id}" class="${selectedRoadmap===id?'selected':''}">${label}</button>`).join('')}</div><div class="map-actions">${backLabel}<span class="map-action-separator"></span><button data-graph-action="zoom-out" aria-label="Уменьшить масштаб">−</button><button class="map-zoom-readout" data-graph-action="reset">${Math.round(graphScale*100)}%</button><button data-graph-action="zoom-in" aria-label="Увеличить масштаб">＋</button><button data-graph-action="fit" aria-label="Сбросить положение">⌖</button></div></div><div class="map-canvas-wrap"><svg id="knowledge-map" class="knowledge-map" style="width:${layout.width}px;height:${layout.height}px;max-width:none" viewBox="0 0 ${layout.width} ${layout.height}" role="application" aria-label="Интерактивная карта ${esc(world.title)}"><defs><pattern id="map-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.3" cy="1.3" r="1"/></pattern><marker id="map-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z"/></marker></defs><rect class="map-grid-bg" width="100%" height="100%" fill="url(#map-dots)"/><g id="map-transform" transform="translate(${graphOffset.x} ${graphOffset.y}) scale(${graphScale})">${edgeMarkup}${nodeMarkup}</g></svg>${detail}<div class="map-instructions"><span>Двигай карту мышью</span><span>Колесо или кнопки — масштаб</span><span>Выбери узел, чтобы открыть детали</span></div></div><div class="map-legend"><span><i class="legend-category"></i>${category?'Тема':'Область'}</span><span><i class="legend-edge"></i>Ведёт к следующему</span><span class="map-data-note">Связи показываются только там, где они описаны в графе</span></div></div><section class="map-footnote"><span>◇</span><p><strong>Открытая структура.</strong> Карта показывает основные учебные области и узлы. Curriculum расширяется постепенно; число узлов не означает полноту дисциплины.</p></section>`;
  const svg=document.querySelector('#knowledge-map');
  svg.addEventListener('wheel',event=>{event.preventDefault();setGraphScale(graphScale*(event.deltaY<0?1.1:.9));},{passive:false});
  svg.addEventListener('pointerdown',event=>{if(event.target.closest('.knowledge-node'))return;graphDrag={x:event.clientX,y:event.clientY,origin:{...graphOffset}};svg.classList.add('dragging');svg.setPointerCapture(event.pointerId);});
  svg.addEventListener('pointermove',event=>{if(!graphDrag)return;const rect=svg.getBoundingClientRect();const ratio=layout.width/rect.width;graphOffset={x:graphDrag.origin.x+(event.clientX-graphDrag.x)*ratio,y:graphDrag.origin.y+(event.clientY-graphDrag.y)*ratio};applyGraphTransform();});
  const stopDrag=()=>{graphDrag=null;svg.classList.remove('dragging');};svg.addEventListener('pointerup',stopDrag);svg.addEventListener('pointercancel',stopDrag);
}

function setGraphScale(value){graphScale=Math.min(2.2,Math.max(.45,value));applyGraphTransform();const readout=document.querySelector('.map-zoom-readout');if(readout)readout.textContent=`${Math.round(graphScale*100)}%`;}
function applyGraphTransform(){const group=document.querySelector('#map-transform');if(group)group.setAttribute('transform',`translate(${graphOffset.x} ${graphOffset.y}) scale(${graphScale})`);}

function renderTopic(id) {
  const topic=getTopic(id); if(!topic) return renderNotFound();
  const world=worldById(topic.world); activateNav(topic.world); setCrumb(world.title,topic.section,topic.title);
  const prereqs=topic.prerequisites.map(getTopic).filter(Boolean);
  const related=topic.related.map(getTopic).filter(Boolean);
  const next=topic.next.map(getTopic).filter(Boolean);
  const depthNames={intuitive:'Интуитивно',standard:'Стандартно',rigorous:'Строго'};
  const explanation=topic.content?.[activeDepth] || topic.theory || topic.overview;
  const formulas=topic.formulas?.length ? `<div class="formula-list">${topic.formulas.map(formula=>`<div class="formula-card"><span>${esc(formula.label)}</span><div class="math-expression" data-tex="${esc(formula.tex)}">${esc(formula.tex)}</div></div>`).join('')}</div>` : '<div class="content-placeholder">Формулы для этой темы будут добавлены по мере подготовки учебного материала.</div>';
  const statusLabels={theorem:'Теорема',definition:'Определение',conjecture:'Гипотеза',hypothesis:'Гипотеза',empirical_result:'Эмпирический результат',established_fact:'Устоявшийся факт',interpretation:'Интерпретация',open_problem:'Открытая проблема'};
  const claims=topic.statusNote?`<div class="claim-note"><span>◇</span><p><strong>Статус знания · ${statusLabels[topic.knowledgeStatus]||'Не указан'}</strong><br>${esc(topic.statusNote)}</p></div>`:'';
  const tasks=topic.practiceTasks?.length?topic.practiceTasks.map(item=>`<article class="practice-card"><span class="practice-icon">↗</span><div><strong>${item.type==='calculation'?'Расчётная задача':'Вопрос на понимание'}</strong><p>${esc(item.prompt)}</p></div><span class="practice-state">САМОСТОЯТЕЛЬНАЯ РАБОТА</span></article>`).join(''):'<div class="content-placeholder">Задачи, доказательства и проекты появятся вместе с материалами этой темы.</div>';
  const resources=Object.entries(topic.resources||{}).filter(([,items])=>items?.length).flatMap(([kind,items])=>items.map(item=>`<a class="topic-resource" href="${esc(item.url)}" target="_blank" rel="noreferrer"><span>${esc(kind)}</span><strong>${esc(item.title)}</strong><span>↗</span></a>`)).join('')||'<div class="content-placeholder">Проверенные учебники, университетские курсы и упражнения ещё не привязаны. В каталоге нет фиктивных URL.</div>';
  const definitions=topic.definitions?.length?`<ul class="definition-list">${topic.definitions.map(item=>`<li><strong>${esc(item.term)}</strong><p>${esc(item.description)}</p></li>`).join('')}</ul>`:'<div class="content-placeholder">Определения и терминология для этой темы будут подготовлены отдельно.</div>';
  const examples=topic.examples?.length?topic.examples.map(item=>`<article class="example-card"><div class="example-top"><span>${esc(item.title||'ПРИМЕР')}</span><span>РАЗБОР</span></div><p>${esc(item.description)}</p></article>`).join(''):'<div class="content-placeholder">Разобранные примеры будут добавлены вместе с полноценным объяснением.</div>';
  const proofs=topic.proofs?.length?topic.proofs.map(item=>`<details class="proof-item"><summary>${esc(item.title)}</summary><p>${esc(item.body)}</p></details>`).join(''):'<div class="content-placeholder">Доказательства появятся там, где они уместны для темы, с указанием условий и статуса результата.</div>';
  const visual=topic.visualization?`<div class="visual-placeholder"><span>◌</span><div><strong>${esc(topic.visualization.title||'Визуализация')}</strong><p>${esc(topic.visualization.description||'Интерактивная модель для исследования идеи.')}</p></div></div>`:'<div class="content-placeholder">Интерактивная визуализация запланирована. Сейчас карта связывает эту тему с предпосылками и следующими идеями.</div>';
  const graphColumn=(label,dot,items,empty)=>`<div class="graph-column"><div class="graph-label"><i class="graph-dot ${dot}"></i>${label}<span>${items.length}</span></div>${items.length?items.map(item=>topicLink(item.id)).join(''):`<p class="graph-empty">${empty}</p>`}</div>`;
  const siblingTopics=(taxonomy.find(category=>category.id===topic.taxonomyId)?.children||[]).map(getTopic).filter(Boolean);
  const tabs=Object.keys(depthNames);
  view.innerHTML=`<div class="topic-layout"><aside class="topic-sidebar"><a class="back-world" href="#world/${topic.world}">← ${esc(world.title)}</a><div class="topic-sidebar-label">В ЭТОЙ ОБЛАСТИ</div>${siblingTopics.slice(0,35).map(item=>`<a class="side-topic ${item.id===id?'current':''}" href="#topic/${item.id}">${esc(item.title)}${item.id===id?'<span aria-hidden="true">●</span>':''}</a>`).join('')}<a class="topic-side-cta" href="#roadmap/${topic.world}"><span>⌁</span><strong>Проследить путь на карте</strong><span>Открыть roadmap ↗</span></a></aside><article class="topic-article"><div class="eyebrow"><span class="eyebrow-line"></span>${world.en} · ${esc(topic.section.toUpperCase())}</div><div class="topic-title-row"><div><h1>${esc(topic.title)}<span class="hero-period">.</span></h1><p class="topic-subtitle">${esc(topic.overview||topic.subtitle)}</p></div><span class="level-pill large ${levelFor(topic.level).color}">${levelFor(topic.level).label}</span></div><div class="topic-toolbar"><div class="depth-tabs" role="tablist" aria-label="Глубина объяснения">${tabs.map(key=>`<button role="tab" aria-selected="${activeDepth===key}" data-depth="${key}" class="${activeDepth===key?'selected':''}">${depthNames[key]}</button>`).join('')}</div><span class="read-time">CURRICULUM EXPANDING</span></div>${claims}<section class="lesson-section"><span class="lesson-number">01</span><div><h2>Обзор и интуиция</h2><p class="lesson-lead">${esc(explanation)}</p><p>${esc(topic.intuition)}</p></div></section><section class="lesson-section"><span class="lesson-number">02</span><div><h2>Теория и определения</h2><p>${esc(topic.theory)}</p>${definitions}</div></section><section class="lesson-section"><span class="lesson-number">03</span><div><h2>Формулы</h2>${formulas}${topic.derivation?.length?`<h3>Вывод</h3><ol class="derivation-list">${topic.derivation.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`:''}</div></section><section class="lesson-section"><span class="lesson-number">04</span><div><h2>Примеры</h2>${examples}</div></section><section class="lesson-section"><span class="lesson-number">05</span><div><h2>Доказательства и результаты</h2>${proofs}</div></section><section class="lesson-section"><span class="lesson-number">06</span><div><h2>Визуализация</h2>${visual}</div></section><section class="lesson-section"><span class="lesson-number">07</span><div><h2>Практика</h2>${tasks}</div></section><section class="lesson-section"><span class="lesson-number">08</span><div><h2>Применения</h2><div class="application-tags">${topic.applications.map(value=>`<span>${esc(value)}</span>`).join('')||'<span>Применения ещё описываются</span>'}</div></div></section><section class="graph-section"><div class="graph-heading"><div><div class="eyebrow">KNOWLEDGE GRAPH</div><h2>Связи темы</h2></div><a href="#roadmap/${topic.world}">Открыть карту ↗</a></div><div class="graph-columns">${graphColumn('ПРЕДПОСЫЛКИ','before',prereqs,'Стартовый узел или предпосылки уточняются.')}${graphColumn('СВЯЗАННЫЕ','related',related,'Связи будут добавляться по мере развития графа.')}${graphColumn('ВЕДЁТ К','next',next,'Следующие узлы ещё не указаны.')}</div></section><section class="resources-section"><div class="eyebrow">RESOURCES</div><h2>Источники и дополнительное обучение</h2>${resources}</section></article></div>`;
  renderMath();
}

function renderLab() { activateNav('lab'); setCrumb('Инструменты','AI Lab'); view.innerHTML=`<section class="placeholder-hero"><div class="eyebrow"><span class="eyebrow-line"></span>ЭКСПЕРИМЕНТЫ · AI LAB</div><h1>Идеи, которые<br /><span class="accent-text">можно потрогать.</span></h1><p>Интерактивная лаборатория для экспериментов с математикой и искусственным интеллектом. Выбирай параметры и наблюдай, что меняется.</p><span class="coming-chip"><span></span>ИНТЕРАКТИВЫ ГОТОВЯТСЯ · ОТКРЫТЫЙ ПЛАН</span></section><section class="lab-grid">${[['01','Градиентный спуск','Меняй скорость обучения и смотри, как точка ищет минимум.','∿'],['02','Нейронная сеть','Собери сеть из слоёв и наблюдай, как она учится.','⌘'],['03','Классификация','Исследуй данные и границы решений модели.','◌'],['04','Свёртка изображений','Меняй фильтры и изучай работу свёрточных слоёв.','▦'],['05','Трансформер','Исследуй attention и работу модели с последовательностью.','⇢'],['06','AI-агенты','Наблюдение → решение → действие → награда.','⟳']].map(([n,title,desc,icon])=>`<article class="lab-card"><div class="lab-card-top"><span>${n} / PLAYGROUND</span><span>${icon}</span></div><h2>${title}</h2><p>${desc}</p><button class="lab-open" data-coming="${title}">Посмотреть план <span>↗</span></button></article>`).join('')}</section>`; }

function renderResearch() { activateNav('research'); setCrumb('Исследуй','Исследования'); view.innerHTML=`<section class="placeholder-hero research-hero"><div class="eyebrow"><span class="eyebrow-line"></span>ВОПРОСЫ БЕЗ ГОТОВЫХ ОТВЕТОВ</div><h1>У границы<br /><span class="accent-text">известного.</span></h1><p>Исследовательский уровень — это знакомство с открытыми вопросами, текущими направлениями и тем, как устроена научная работа.</p></section><section class="research-grid">${[['Математика','Гипотезы, открытые проблемы и важные прорывы.','mathematics-research','math','Rₘ'],['Физика','Активные направления, методы и экспериментальные вопросы.','physics-research','physics','Rᵩ'],['Искусственный интеллект','Архитектуры моделей, агенты, безопасность и оценка.','ai-research','ai','Rₐ']].map(([name,desc,category,worldId,mark])=>`<a class="research-card" href="#roadmap/${worldId}/${category}"><div class="research-mark">${mark}</div><div class="eyebrow">RESEARCH AREA</div><h2>${name}</h2><p>${desc}</p><span class="research-open">Исследовать направление <b>↗</b></span></a>`).join('')}</section><div class="research-integrity"><span>◇</span><p><strong>Статус знания имеет значение.</strong> Mind.kg различает теоремы, гипотезы, эмпирические результаты, интерпретации и открытые проблемы. Исследовательский уровень описывает сложность материала, а не академическую степень.</p></div>`; }

function renderResources(){activateNav('resources');setCrumb('Библиотека','Ресурсы');view.innerHTML=`<section class="placeholder-hero"><div class="eyebrow"><span class="eyebrow-line"></span>БИБЛИОТЕКА МАТЕРИАЛОВ</div><h1>Хорошие источники.<br /><span class="accent-text">В нужном контексте.</span></h1><p>Материалы будут привязаны к темам и проверены по типу источника. Пока каталог не заполнен: мы не добавляем случайные или фиктивные ссылки.</p></section><div class="resource-library-grid">${[['Учебники','Учебники и первичные учебные тексты.'],['Университетские курсы','Открытые лекции и учебные программы университетов.'],['Лекции и видео','Визуальные объяснения и записи лекций.'],['Справочники','Документация и надёжные reference-материалы.'],['Задачи и проекты','Практика, вычислительные задачи и мини-проекты.'],['Научные статьи','Первичные публикации и исследовательские обзоры.']].map(([name,desc],index)=>`<article class="resource-library-card"><span class="resource-card-index">0${index+1}</span><div><h2>${name}</h2><p>${desc}</p><span class="resource-empty">Материалы для этой категории пополняются</span></div></article>`).join('')}</div>`;}

function renderNotFound(){ setCrumb('Карта знаний'); view.innerHTML=`<section class="not-found"><div class="eyebrow">УЗЕЛ ЕЩЁ НЕ ДОБАВЛЕН</div><h1>Эта тема пока<br />не на карте.</h1><p>Связь уже может быть отмечена, а подробная страница появится позже.</p><a class="button button-dark" href="#roadmap">Вернуться к roadmap →</a></section>`; }

function render() {
  const route=decodeURIComponent(location.hash.replace(/^#\/?/,''));
  if (!route || route==='home') renderHome();
  else if(route.startsWith('world/')) renderWorld(route.split('/')[1]);
  else if(route.startsWith('topic/')) renderTopic(route.split('/')[1]);
  else if(route==='roadmap' || route.startsWith('roadmap/')) {if(route.startsWith('roadmap/')){selectedRoadmap=route.split('/')[1];focusedCategory=route.split('/')[2]||null;}else focusedCategory=null;selectedMapTopic=null;renderRoadmap();}
  else if(route==='lab') renderLab();
  else if(route==='research') renderResearch();
  else if(route==='resources') renderResources();
  else renderNotFound();
  document.querySelector('#sidebar').classList.remove('sidebar-open');
  window.scrollTo(0,0);
}

function openSearch(){ searchModal.hidden=false; searchInput.value=''; renderSearch(''); setTimeout(()=>searchInput.focus(),0); }
function closeSearch(){ searchModal.hidden=true; }
function renderSearch(query){
  const q=query.trim().toLowerCase();
  const searchable=topics.map(topic=>({topic,text:`${topic.title} ${topic.subtitle} ${topic.section} ${topic.id.replaceAll('-',' ')} ${(topic.aliases||[]).join(' ')} ${topic.applications.join(' ')} ${topic.prerequisites.map(id=>getTopic(id)?.title||'').join(' ')}`}));
  const direct=q?searchable.filter(item=>item.text.toLowerCase().includes(q)).map(item=>item.topic):topics;
  const relatedIds=new Set();
  if(q&&direct.length){for(const item of direct.slice(0,6)){for(const id of [...item.prerequisites,...item.related,...item.next]){relatedIds.add(id);const linked=getTopic(id);linked?.next.forEach(next=>relatedIds.add(next));linked?.related.forEach(next=>relatedIds.add(next));}}}
  const resultIds=new Set(direct.map(item=>item.id));
  const results=[...direct,...[...relatedIds].map(getTopic).filter(item=>item&&!resultIds.has(item.id))].slice(0,12);
  searchIndex=0;
  document.querySelector('#search-results').innerHTML=results.length?results.map((t,i)=>`<a class="search-result ${i===0?'highlighted':''}" href="#topic/${t.id}" data-result="${i}"><span class="result-icon">${worldById(t.world)?.icon||'⌕'}</span><span><strong>${esc(t.title)}</strong><small>${worldById(t.world)?.title||'Knowledge map'} <i>/</i> ${esc(t.section)}</small></span><span class="result-level">${levelFor(t.level).label}</span><kbd>↵</kbd></a>`).join(''):`<div class="search-empty"><span>⌕</span><strong>Ничего не найдено</strong><p>Попробуй другое название или связанную идею.</p></div>`;
}

document.addEventListener('click', event=>{
  if(event.target.closest('.search-result')) closeSearch();
  const mapWorld=event.target.closest('[data-map-world]');if(mapWorld){selectedRoadmap=mapWorld.dataset.mapWorld;focusedCategory=null;selectedMapTopic=null;graphScale=1;graphOffset={x:0,y:0};renderRoadmap();return;}
  if(event.target.closest('#map-back')){focusedCategory=null;selectedMapTopic=null;graphScale=1;graphOffset={x:0,y:0};renderRoadmap();return;}
  const mapCategory=event.target.closest('[data-category]');if(mapCategory){focusedCategory=mapCategory.dataset.category;selectedMapTopic=null;graphScale=1;graphOffset={x:0,y:0};renderRoadmap();return;}
  const mapTopic=event.target.closest('[data-map-topic]');if(mapTopic){selectedMapTopic=selectedMapTopic===mapTopic.dataset.mapTopic?null:mapTopic.dataset.mapTopic;renderRoadmap();return;}
  if(event.target.closest('#inspector-close')){selectedMapTopic=null;renderRoadmap();return;}
  const graphAction=event.target.closest('[data-graph-action]')?.dataset.graphAction;if(graphAction==='zoom-in'){setGraphScale(graphScale*1.18);return;}if(graphAction==='zoom-out'){setGraphScale(graphScale/1.18);return;}if(graphAction==='reset'||graphAction==='fit'){graphScale=1;graphOffset={x:0,y:0};applyGraphTransform();const label=document.querySelector('.map-zoom-readout');if(label)label.textContent='100%';return;}
  const depth=event.target.closest('[data-depth]'); if(depth){activeDepth=depth.dataset.depth;renderTopic(location.hash.split('/')[1]);return;}
  if(event.target.closest('#example-expand')){const p=document.querySelector('#example-more');p.hidden=!p.hidden;event.target.closest('#example-expand').querySelector('span').textContent=p.hidden?'＋':'−';return;}
  if(event.target.closest('#search-trigger'))openSearch();
  if(event.target.closest('#theme-toggle')){darkTheme=!darkTheme;document.documentElement.dataset.theme=darkTheme?'dark':'light';localStorage.setItem('mind-theme',darkTheme?'dark':'light');}
  if(event.target.closest('#menu-toggle'))document.querySelector('#sidebar').classList.toggle('sidebar-open');
  const coming=event.target.closest('[data-coming]');if(coming)showToast(`${coming.dataset.coming} — появится в следующей версии`);
});
window.addEventListener('hashchange',render);
searchInput.addEventListener('input',()=>renderSearch(searchInput.value));
searchModal.addEventListener('click',event=>{if(event.target===searchModal)closeSearch();});
document.addEventListener('keydown',event=>{
  if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-category],[data-map-topic]')){event.preventDefault();event.target.click();}
  if((event.metaKey||event.ctrlKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();}
  if(event.key==='Escape'){closeSearch();if(selectedMapTopic){selectedMapTopic=null;renderRoadmap();return;}if(focusedCategory){focusedCategory=null;renderRoadmap();return;}}
  if(searchModal.hidden)return;
  const results=[...document.querySelectorAll('.search-result')];
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();if(!results.length)return;searchIndex=(searchIndex+(event.key==='ArrowDown'?1:-1)+results.length)%results.length;results.forEach((el,i)=>el.classList.toggle('highlighted',i===searchIndex));results[searchIndex].scrollIntoView({block:'nearest'});}
  if(event.key==='Enter'&&results[searchIndex]){location.hash=results[searchIndex].getAttribute('href');closeSearch();}
});
function showToast(message){let toast=document.querySelector('.app-toast');if(!toast){toast=document.createElement('div');toast.className='app-toast';toast.setAttribute('role','status');document.body.append(toast);}toast.textContent=message;toast.classList.add('visible');clearTimeout(showToast.timer);showToast.timer=setTimeout(()=>toast.classList.remove('visible'),2600);}
function renderMath(){if(window.katex)document.querySelectorAll('.math-expression').forEach(node=>{try{node.innerHTML=window.katex.renderToString(node.dataset.tex,{displayMode:true,throwOnError:false});}catch{}});}
window.addEventListener('load',renderMath);
render();
