(() => {
  'use strict';
  let started = false;
  function startApplication() {
  if (started) return;
  const book = window.BIBLE_WORKBOOK;
  if (!book || !Array.isArray(book.sheets)) {
    document.getElementById('main').textContent = 'Firestore 資料格式不完整，無法載入網站。請檢查資料匯入是否成功。';
    return;
  }

  started = true;
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const clamp = (n,a,b) => Math.min(b,Math.max(a,n));
  const byId = new Map(book.sheets.map(s=>[s.id,s]));
  const byName = new Map(book.sheets.map(s=>[s.name,s]));
  const categories = [...new Set(book.sheets.map(s=>s.category))];
  const JESUS_SHEET = book.sheets.find(s=>s.name==='OT-耶穌家譜') || book.sheets.find(s=>String(s.name).includes('耶穌家譜')) || null;
  const SIDEBAR_ICONS = {
    all:'<path d="M4 5h7v7H4zM13 5h7v7h-7zM4 14h7v6H4zM13 14h7v6h-7z"/>',
    '聖經概覽':'<path d="M4 5h7a4 4 0 0 1 4 4v11H8a4 4 0 0 0-4 0zM20 5h-6a4 4 0 0 0-4 4v11h6a4 4 0 0 1 4 0z"/>',
    '核心查考':'<path d="M4 6h16M7 3v6M17 3v6M5 13h14M5 18h11"/>',
    '舊約研究':'<path d="M5 4h15v16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM5 17h15M9 8h7M9 12h5"/>',
    '新約研究':'<path d="M12 3v18M5 9h14M4 4h16v16H4z"/>',
    '家譜研究':'<path d="M12 3v6M5 15v-4h14v4M5 15v6M12 15v6M19 15v6M3 21h4M10 21h4M17 21h4"/>',
    '教會歷史':'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/>',
    '神學與要理':'<path d="M12 3v18M5 9h14M4 4h16v16H4z"/>',
    '耶穌家譜':'<path d="M12 3v5M8 8h8M5 13h14M7 13v7M12 13v7M17 13v7M5 20h4M10 20h4M15 20h4"/>'
  };
  const icon = (which,cls='') => `<svg ${cls ? 'class="'+cls+'"' : ''} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linejoin="round" stroke-linecap="round">${SIDEBAR_ICONS[which]||SIDEBAR_ICONS.all}</svg>`;
  const searchSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.7"/><path d="m16 16 4.8 4.8"/></svg>';
  const state = {theme:'light', category:'all',sheet:null,viewMode:'',boardZoom:1,tableFilter:'',tableLimit:90,searchLimit:70,focus:null,toastTimeout:null,sidebarCollapsed:false};
  const dataMap = new WeakMap();
  function cellMap(sheet){
    if(!dataMap.has(sheet)) dataMap.set(sheet,new Map(sheet.cells.map(c=>[c[0]+':'+c[1],c])));
    return dataMap.get(sheet);
  }
  function colLabel(n){let x='';for(;n;n=Math.floor((n-1)/26))x=String.fromCharCode(65+(n-1)%26)+x;return x;}
  function refOf(c){return colLabel(c[1])+c[0];}
  function getCell(sheet,r,c){return cellMap(sheet).get(r+':'+c);}
  function navHome(){window.location.hash='#/';}
  function navSheet(id,ref){const next='#/sheet/'+encodeURIComponent(id)+(ref?'?cell='+encodeURIComponent(ref):'');if(window.location.hash===next)route();else window.location.hash=next;}
  function navCategory(cat){window.location.hash='#/category/'+encodeURIComponent(cat);}
  function navSearch(q){window.location.hash='#/search?q='+encodeURIComponent(q.trim());}
  function getRoute(){
    let hash=window.location.hash.replace(/^#/,'');
    let [path,query='']=hash.split('?');
    let parts=path.split('/').filter(Boolean).map(decodeURIComponent);
    return {section:parts[0]||'home',arg:parts[1]||'',query:new URLSearchParams(query)};
  }
  function closeMenu(){ $('#sidebar').classList.remove('open');$('#mobile-scrim').classList.remove('show');}
  function setTop(section,page){$('#top-section').textContent=section;$('#top-page').textContent=page;document.title=(page==='首頁'?'聖經概覽':page+'｜聖經概覽');}
  function renderNav(){
    let r=getRoute();
    let active=r.section==='home'?'all':r.section==='category'?r.arg:r.section==='sheet'?byId.get(r.arg)?.category:'none';
    const quick=[];
    if(JESUS_SHEET){
      quick.push(`<button class="nav-item quick-item ${r.section==='sheet'&&r.arg===JESUS_SHEET.id?'active':''}" data-sheet="${JESUS_SHEET.id}" title="耶穌家譜">${icon('耶穌家譜')}<span>耶穌家譜</span><span class="nav-pill">Quick</span></button>`);
    }
    const categoryItems=[{key:'all',count:book.sheets.length},...categories.map(key=>({key,count:book.sheets.filter(s=>s.category===key).length}))].map(({key,count})=>
      `<button class="nav-item ${key===active?'active':''}" data-cat="${esc(key)}" title="${key==='all'?'所有資料':esc(key)}">${icon(key)}<span>${key==='all'?'所有資料':esc(key)}</span><span class="nav-count">${count}</span></button>`).join('');
    $('#side-nav').innerHTML=`${quick.length?`<div class="nav-group"><div class="nav-group-title">快速入口</div>${quick.join('')}</div>`:''}<div class="nav-group"><div class="nav-group-title">分類導覽</div>${categoryItems}</div>`;
  }
  function initUIState(){
    try{state.sidebarCollapsed = localStorage.getItem('bible-site-sidebar')==='collapsed';}catch(e){}
    applySidebarCollapsed();
  }
  function applySidebarCollapsed(){
    const shell=$('.app-shell');
    shell?.classList.toggle('sidebar-collapsed', !!state.sidebarCollapsed && window.innerWidth>900);
    const btn=$('#sidebar-toggle');
    if(btn){
      btn.setAttribute('aria-label', state.sidebarCollapsed?'展開側邊欄':'收合側邊欄');
      btn.setAttribute('title', state.sidebarCollapsed?'展開側邊欄':'收合側邊欄');
      btn.classList.toggle('collapsed', !!state.sidebarCollapsed);
    }
  }
  function toggleSidebarCollapsed(){
    if(window.innerWidth<=900){ $('#sidebar').classList.toggle('open');$('#mobile-scrim').classList.toggle('show'); return; }
    state.sidebarCollapsed=!state.sidebarCollapsed;
    try{localStorage.setItem('bible-site-sidebar', state.sidebarCollapsed?'collapsed':'expanded');}catch(e){}
    applySidebarCollapsed();
  }
  function initTheme(){let stored='';try{stored=localStorage.getItem('bible-site-theme')||'';}catch(e){} state.theme=stored|| (window.matchMedia?.('(prefers-color-scheme: dark)').matches?'dark':'light');applyTheme();}
  function applyTheme(){document.documentElement.dataset.theme=state.theme;$('#theme-symbol').textContent=state.theme==='dark'?'☀':'☾';$('#theme-label').textContent=state.theme==='dark'?'淺色模式':'深色模式';let meta=$('meta[name=theme-color]');if(meta)meta.content=state.theme==='dark'?'#101816':'#f6f7f5';}
  function toggleTheme(){state.theme=state.theme==='dark'?'light':'dark';try{localStorage.setItem('bible-site-theme',state.theme);}catch(e){}applyTheme();}
  function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('visible');clearTimeout(state.toastTimeout);state.toastTimeout=setTimeout(()=>t.classList.remove('visible'),2500);}
  function headerCard(s){
    let typ=s.view==='images'?'圖像資料':s.view==='table'?'查考表格':'圖譜／架構';
    return `<button class="sheet-card" data-sheet="${s.id}"><span class="sheet-number">${String(book.sheets.indexOf(s)+1).padStart(2,'0')}</span><span class="sheet-card-copy"><strong title="${esc(s.name)}">${esc(s.name)}</strong><small>${esc(typ)} · ${s.cells.length?s.cells.length.toLocaleString()+' 筆儲存格':s.images.length+' 張圖片'}</small></span><span class="card-arrow">↗</span></button>`;
  }
  function searchForm(prefix='global'){
    return `<form class="search-form-row" data-form="global"><div class="global-search">${searchSvg}<input id="${prefix}-query" name="q" type="search" placeholder="搜尋人物、經文、事件、關鍵字…" aria-label="全站搜尋" autocomplete="off"><span class="key-hint">/</span></div><button class="search-submit" type="submit">搜尋</button></form>`;
  }
  function renderHome(category){
    const isAll=!category||category==='all';
    const sheets=isAll?book.sheets:book.sheets.filter(s=>s.category===category);
    setTop('聖經概覽',isAll?'首頁':category);
    $('#main').innerHTML=(isAll?
      `<section class="home-hero"><div class="hero-small">SCRIPTURE / STUDY / OVERVIEW</div><h1>探索聖經，<br><span>從脈絡開始。</span></h1><p class="hero-desc">你提供的《聖經概覽》整理資料，重新設計成可閱讀、可搜尋、可跨頁連結的互動網站。所有文字與圖片均取自原始 Excel。</p>${searchForm('home')}</section><section><div class="section-line"><div><h2 class="section-title">主題分類</h2><p class="section-description">依原始工作表整理，選取主題開始閱讀</p></div><div class="section-count">${categories.length} 個分類</div></div><div class="category-grid">${categories.map(c=>`<button class="category-card" data-cat="${esc(c)}"><span class="category-icon">${icon(c)}</span><strong>${esc(c)}</strong><span class="card-footer">${book.sheets.filter(s=>s.category===c).length} 個主題<span class="card-arrow">↗</span></span></button>`).join('')}</div></section>`:
      `<header class="page-head"><button class="back-link" data-home>← 返回所有主題</button><p class="eyebrow" style="margin-top:24px">CATEGORY / STUDY</p><h1>${esc(category)}</h1><p class="page-subtitle">${sheets.length} 個原始工作表</p></header>`)+
      `<section class="home-sheets"><div class="section-line"><div><h2 class="section-title">${isAll?'全部資料':'分類內的資料'}</h2><p class="section-description">點擊即可開啟內容</p></div><div class="section-count">${sheets.length} 個主題</div></div><div class="sheet-grid">${sheets.map(headerCard).join('')}</div></section>`;
  }

  // Excel hyperlink locations may address a displayed sheet name, a named
  // range, or a former worksheet alias without the '(G)-' / 'OT-' prefix.
  function resolveLink(target){
    if(!target)return null;
    target=String(target).trim().replace(/^#/,'');
    if(/^https?:\/\//i.test(target))return {external:target};
    const defs=book.definedNames||{};
    if(defs[target]) target=defs[target];
    if(/#REF!/i.test(target))return null;
    const m=target.match(/^(?:'((?:[^']|'')+)'|([^!]+))!(?:\$?([A-Z]+)\$?(\d+))?/i);
    if(!m)return null;
    const shName=(m[1]||m[2]||'').replace(/''/g,"'");
    let sheet=byName.get(shName);
    if(!sheet){
      const normalized=shName.replace(/^(\(G\)-|OT-|NT-|CH-|ST-)/,'');
      sheet=book.sheets.find(s=>s.name.replace(/^(\(G\)-|OT-|NT-|CH-|ST-)/,'')===normalized) || null;
    }
    return sheet?{id:sheet.id,ref:(m[3]||'A')+(m[4]||'1')}:null;
  }
  function navigateLink(target){
    const parsed=resolveLink(target);
    if(!parsed){toast('原始 Excel 的連結無法定位，請參考原始檔案。');return;}
    if(parsed.external){window.open(parsed.external,'_blank','noopener,noreferrer');return;}
    navSheet(parsed.id,parsed.ref);
  }

  function sheetHead(s){
    const typ=s.view==='images'?'圖像整理':s.view==='table'?'查考表格':'關係圖譜';
    const tagline=s.name.startsWith('(G)-')?'點擊有連結的人名，可前往對應的延伸家譜。':'所有資料依照原始 Excel 呈現，未修改原文。';
    return `<header class="page-head"><button class="back-link" data-back-category="${esc(s.category)}">← 返回${esc(s.category)}</button><p class="eyebrow" style="margin-top:25px">BIBLE / ${esc(s.category)}</p><h1>${esc(s.name)}</h1><p class="page-subtitle">${tagline}</p><div class="head-meta"><span class="head-chip">${esc(typ)}</span>${s.cells.length?`<span class="head-chip"><strong>${s.cells.length.toLocaleString()}</strong> 筆儲存格</span>`:''}${s.images.length?`<span class="head-chip"><strong>${s.images.length}</strong> 張原始圖片</span>`:''}${s.comments?`<span class="head-chip"><strong>${s.comments}</strong> 則資料註解</span>`:''}${s.links.length?`<span class="head-chip"><strong>${s.links.length}</strong> 個原始連結</span>`:''}</div></header>`;
  }
  function renderSheet(id, cellRef){
    const s=byId.get(id);if(!s){navHome();return;}
    state.sheet=s;state.focus=cellRef||null;state.tableFilter='';state.tableLimit=90;state.boardZoom=1;
    const isMobile=window.innerWidth<=650;
    state.viewMode=s.view==='board'?(isMobile?'list':'board'):s.view==='table'?(isMobile?'cards':'table'):'images';
    setTop(s.category,s.name);
    let which=s.view==='images'?renderImageViewer(s):s.view==='table'?renderTableViewer(s):renderBoardViewer(s);
    const ix=book.sheets.indexOf(s);
    $('#main').innerHTML=sheetHead(s)+which+`<div class="sheet-bottom-nav"><button ${ix===0?'disabled':''} data-sheet="${book.sheets[Math.max(0,ix-1)].id}">← ${esc(book.sheets[Math.max(0,ix-1)].name)}</button><button ${ix===book.sheets.length-1?'disabled':''} data-sheet="${book.sheets[Math.min(book.sheets.length-1,ix+1)].id}">${esc(book.sheets[Math.min(book.sheets.length-1,ix+1)].name)} →</button></div>`;
    if(s.view==='board')buildBoardContent(s);
    if(s.view==='table')buildTableContent(s);
    if(cellRef)setTimeout(()=>focusOn(s,cellRef),100);
  }

  function renderImageViewer(s){
    const arranged=[...s.images].sort((a,b)=>a.row-b.row||a.col-b.col);
    const titleCells=s.cells.filter(c=>c[0]===1&&c[2].trim());
    const gallery=arranged.map((im,i)=>{
      const candidates=titleCells.filter(c=>c[1]<=im.col+2);
      const near=candidates.at(-1)||titleCells[i];
      let caption=near?near[2]:'圖片 '+(i+1);
      return `<article class="image-tile"><figure><img data-image="${esc(im.src)}" src="${esc(im.src)}" loading="${i<2?'eager':'lazy'}" alt="${esc(s.name+' '+caption)}"></figure><div class="image-caption">${esc(caption)}<small>點擊圖片放大檢視 · 原始圖片 ${i+1}/${arranged.length}</small></div></article>`;
    }).join('');
    const remaining=s.cells.filter(c=>c[2]?.trim()&&c[0]!==1);
    return `<section class="viewer-card"><div class="viewer-toolbar"><div class="toolbar-left"><strong style="font-size:13px">圖片閱讀</strong><span class="toolbar-hint">來源：原始 Excel 內嵌圖片</span></div><div class="toolbar-right"><span class="toolbar-hint">共 ${arranged.length} 張</span></div></div><div class="image-gallery">${gallery||'<div class="empty-state">原始工作表中沒有嵌入圖片。</div>'}</div>${remaining.length?`<div class="image-text-list">${remaining.map(c=>`<p>${esc(c[2])}</p>`).join('')}</div>`:''}<div class="viewer-caption">圖片內容保留原始圖檔，未重繪、未修改。</div></section>`;
  }

  function headerInfo(s){
    const isDouble=s.id==='s5'||s.id==='s7';
    const headerRow=isDouble?3:2;
    const names=[];
    for(let col=1;col<=s.maxCol;col++){
      const top=getCell(s,2,col)?.[2]||'';
      const child=isDouble?getCell(s,3,col)?.[2]||'':'';
      let parent='';
      if(isDouble&&!top){
        const merge=s.merges.find(m=>m[0]===2&&m[1]<=col&&m[3]>=col);
        if(merge)parent=getCell(s,2,merge[1])?.[2]||'';
      }
      const parts=[top||parent,child].filter(Boolean);
      names.push(parts.length?parts.join(' / '):'欄位 '+colLabel(col));
    }
    return {names,startRow:headerRow+1};
  }
  function renderTableViewer(s){
    const introductions=s.cells.filter(c=>c[0]===1&&(String(c[2]).trim()||c[4]));
    const sourceIntro=introductions.length?`<div class="table-intro">${introductions.map(c=>`<div class="table-intro-item"><span class="source-key">${esc(refOf(c))}</span><div>${esc(c[2]||'ⓘ 原始註解')}</div>${c[4]?`<button class="tool-btn slim" data-note="${s.id}|${refOf(c)}">查看註解</button>`:''}</div>`).join('')}</div>`:'';
    return `<section class="viewer-card" id="view-panel"><div class="viewer-toolbar"><div class="toolbar-left"><button class="tool-btn ${state.viewMode==='cards'?'selected':''}" data-table-mode="cards">卡片閱讀</button><button class="tool-btn ${state.viewMode==='table'?'selected':''}" data-table-mode="table">完整表格</button></div><div class="toolbar-right"><div class="small-search">${searchSvg}<input type="search" id="table-filter" placeholder="篩選此工作表的內容" aria-label="篩選此工作表"></div></div></div>${sourceIntro}<div id="table-content"></div><div class="viewer-caption">點擊有註記的儲存格可閱讀原始 Excel 註解。原始資料與欄位順序皆保留。</div></section><p class="viewer-help">提示：手機建議使用「卡片閱讀」；電腦可切換「完整表格」，也可以水平捲動檢視所有欄位。</p>${s.images.length?renderSupplementImages(s):''}`;
  }
  function renderSupplementImages(s){return `<section style="margin-top:20px" class="viewer-card"><div class="viewer-toolbar"><strong style="font-size:13px">原始插圖</strong></div><div class="image-gallery">${s.images.map((im,i)=>`<div class="image-tile"><img data-image="${esc(im.src)}" src="${esc(im.src)}" loading="lazy" alt="原始插圖 ${i+1}"><div class="image-caption">原始圖片 ${i+1}</div></div>`).join('')}</div></section>`;}
  function rowsForTable(s){
    const {startRow}=headerInfo(s);const rows=new Map();
    for(const cell of s.cells){if(cell[0]<startRow)continue;if(!rows.has(cell[0]))rows.set(cell[0],[]);rows.get(cell[0]).push(cell);}
    const q=state.tableFilter.toLocaleLowerCase().trim();
    return [...rows].sort((a,b)=>a[0]-b[0]).filter(([r,items])=>!q||items.some(c=>((c[2]||'')+' '+(c[4]||'')).toLocaleLowerCase().includes(q)));
  }
  function buildTableContent(s){
    const root=$('#table-content');if(!root)return;
    const {names}=headerInfo(s);const filtered=rowsForTable(s);
    if(state.focus && !state.tableFilter){const row=Number((state.focus.match(/\d+$/)||[])[0]);if(row>0){const pos=filtered.findIndex(x=>x[0]===row);if(pos>=0)state.tableLimit=Math.max(state.tableLimit,pos+15);}}
    const shown=filtered.slice(0,state.tableLimit);
    const more=filtered.length>shown.length?`<button class="load-more" id="load-more">顯示更多 · 已顯示 ${shown.length}/${filtered.length} 列</button>`:'';
    if(!filtered.length){root.innerHTML='<div class="empty-state">沒有符合的資料，請調整篩選關鍵字。</div>';return;}
    if(state.viewMode==='cards'){
      const html=shown.map(([r,cells])=>{
        const populated=cells.filter(c=>String(c[2]).trim()||c[4]);
        const lookup=new Map(populated.map(c=>[c[1],c]));
        const heading=lookup.get(2)?.[2]||lookup.get(1)?.[2]||populated[0]?.[2]||'資料';
        const fields=populated.map(c=>{
          const value=String(c[2]||'')||(c[4]?'查看註解':'');
          if(!value)return '';
          const link=!!c[5];const note=!!c[4];
          return `<div class="record-row"><span class="record-key">${esc(names[c[1]-1])}</span><span class="record-value ${link?'link':''}" ${link?`data-link="${esc(c[5])}"`:note?`data-note="${s.id}|${refOf(c)}"`:''} ${link||note?'role="button" tabindex="0"':''}>${esc(value)}${note?' ⓘ':''}</span></div>`;
        }).join('');
        const target=state.focus&&r===Number((state.focus.match(/\d+$/)||[])[0]);
        return `<article class="record-card ${target?'is-target':''}" data-row="${r}"><div class="record-top"><strong>${esc(heading).slice(0,90)}</strong><span class="record-no">第 ${r} 列</span></div>${fields}</article>`;
      }).join('');
      root.innerHTML=`<div class="table-cards">${html}</div>${more}`;
    }else{
      const html=shown.map(([r,cells])=>{
        const lookup=new Map(cells.map(c=>[c[1],c]));
        const tds=[];
        for(let col=1;col<=s.maxCol;col++){
          const c=lookup.get(col);const hasNote=!!c?.[4];const link=c?.[5];let val=esc(c?.[2]||'');
          if(link)val=`<a href="#" data-link="${esc(link)}">${val||'開啟連結 ↗'}</a>`;
          else if(hasNote&&!val)val='ⓘ 查看註解';
          tds.push(`<td ${col===1?'style="min-width:85px"':''} class="${hasNote?'has-note':''} ${state.focus===colLabel(col)+r?'is-target':''}" data-row="${r}" data-col="${col}" ${hasNote&&!link?`data-note="${s.id}|${colLabel(col)+r}"`:''}>${val}</td>`);
        }
        return `<tr>${tds.join('')}</tr>`;
      }).join('');
      root.innerHTML=`<div class="table-scroll"><table class="data-table"><thead><tr>${names.map(x=>`<th>${esc(x)}</th>`).join('')}</tr></thead><tbody>${html}</tbody></table></div>${more}`;
    }
  }

  function dimensions(s){
    const x=[0],y=[0];for(const w of s.colWidths)x.push(x.at(-1)+w);for(const h of s.rowHeights)y.push(y.at(-1)+h);
    return {x,y,w:x.at(-1)||800,h:y.at(-1)||800};
  }
  function spanFor(s,c){
    const r=c[0],col=c[1];return s.merges.find(m=>m[0]===r&&m[1]===col)||[r,col,r,col];
  }
  function renderBoardViewer(s){
    const isJesus = JESUS_SHEET && s.id===JESUS_SHEET.id;
    const isGenealogy = s.category==='家譜研究' || isJesus;
    const jumpButtons = state.viewMode==='list'?'':`<button type="button" class="tool-btn slim" data-scroll-board="top">置頂</button><button type="button" class="tool-btn slim" data-scroll-board="bottom">到底</button>`;
    const hero = isJesus ? `<div class="genealogy-hero"><div><span class="genealogy-kicker">GENEALOGY · JESUS</span><h2>耶穌家譜</h2><p>將原始 Excel 的家譜結構改為更清楚的閱讀體驗：保留人物位置與延伸連結，同時以更乾淨的版面呈現。</p></div><div class="genealogy-hero-meta"><span>${s.links.length} 個延伸連結</span><span>${s.cells.length} 個節點來源</span></div></div>` : '';
    return `<section class="viewer-card ${isGenealogy?'genealogy-showcase':''}" id="view-panel">${hero}<div class="viewer-toolbar"><div class="toolbar-left"><button class="tool-btn ${state.viewMode==='list'?'selected':''}" data-board-mode="list">文字閱讀</button><button class="tool-btn ${state.viewMode==='board'?'selected':''}" data-board-mode="board">關係圖譜</button><span class="toolbar-hint">${s.links.length?'綠色節點可點擊延伸家譜':''}</span></div><div class="toolbar-right">${jumpButtons}<div class="board-zoom-controls ${state.viewMode==='list'?'hidden':''}" id="board-zoom-controls"><button type="button" class="tool-btn slim" data-zoom="out" aria-label="縮小">−</button><button type="button" class="tool-btn slim" data-zoom="reset" id="zoom-label">100%</button><button type="button" class="tool-btn slim" data-zoom="in" aria-label="放大">＋</button></div></div></div><div id="board-content"></div><div class="board-explainer">${s.name.startsWith('(G)-')||s.name==='OT-耶穌家譜'?'關係圖譜盡量保留來源檔案中的人物位置和連線。點擊綠色人名即可跳轉延伸家譜；可利用右上角「＋／−」縮放。現在支援自然卷動閱讀，也可按「到底」快速前往末端。':'文字閱讀適合手機，關係圖譜適合橫向閱讀大型資料。點選含有註解的內容可閱讀完整來源文字。'}</div></section><p class="viewer-help">原始 Excel 是完整內容依據；「文字閱讀」只改變排列方式，不會改寫或增減原文。</p>${s.images.length?renderSupplementImages(s):''}`;
  }
  function buildBoardContent(s){
    const el=$('#board-content');if(!el)return;
    $('#board-zoom-controls')?.classList.toggle('hidden',state.viewMode!=='board');
    if(state.viewMode==='list'){
      const nodes=s.cells.filter(c=>String(c[2]||'').trim()||c[4]);
      const list=nodes.map(c=>{
        const note=!!c[4],link=!!c[5];
        const info=c[6]&&(!c[2]||c[2].startsWith('='))?`<div class="node-sub">公式：${esc(c[6])}</div>`:'';
        return `<article class="node-item ${state.focus===refOf(c)?'is-target':''}" data-cell="${refOf(c)}"><span class="node-meta">${esc(refOf(c))} ${link?'· 原始跨頁連結':''} ${note?'· 附有註解':''}</span><div class="node-text">${esc(c[2]||'(原始空白儲存格)')}</div>${info}${note?`<button class="node-action" data-note="${s.id}|${refOf(c)}">閱讀註解</button>`:''}${link?`<button class="node-action" data-link="${esc(c[5])}">前往延伸資料 ↗</button>`:''}</article>`;
      }).join('');
      el.innerHTML=`<div class="list-nodes">${list||'<div class="empty-state">沒有文字資料。</div>'}</div>`;
      return;
    }
    const dim=dimensions(s);
    const nodes=s.cells.map(c=>{
      if(!String(c[2]||'').trim()&&!c[4])return '';
      const [r,col,r2,c2]=spanFor(s,c);
      const left=dim.x[Math.max(0,col-1)]||0,top=dim.y[Math.max(0,r-1)]||0;
      const width=(dim.x[c2]||left+100)-left;
      const height=(dim.y[r2]||top+24)-top;
      let text=String(c[2]||'');const note=!!c[4],linked=!!c[5];
      const isLabel=(c[1]===1&&c[0]<20)||(c[0]===1);
      const isEnglish=/^[A-Za-z\d.,\s()\-':?]+$/.test(text)&&text.length<40;
      const classes=['board-node',linked?'link-node':'',note?'note-node':'',isLabel?'label-node':'',isEnglish?'english-node':'',state.focus===refOf(c)?'is-target':''].filter(Boolean).join(' ');
      const safeTitle=esc(text.slice(0,350)+(note?'\nⓘ 有原始註解':'')+(linked?'\n↗ 點擊延伸家譜':''));
      const attributes=linked?`data-link="${esc(c[5])}"`:(note||text)?`data-note="${s.id}|${refOf(c)}"`:'';
      return `<div class="${classes}" style="left:${left}px;top:${top}px;width:${Math.max(23,width)}px;height:${Math.max(16,height)}px" title="${safeTitle}" ${attributes} data-cell="${refOf(c)}" role="${linked||note?'button':'group'}" ${linked||note?'tabindex="0"':''}>${esc(text||'ⓘ')}</div>`;
    }).join('');
    el.innerHTML=`<div class="board-viewport ${(s.category==='家譜研究'||(JESUS_SHEET&&s.id===JESUS_SHEET.id))?'genealogy-viewport':''}" id="board-viewport"><div class="board-sizer" id="board-sizer" style="position:relative;width:${dim.w}px;height:${dim.h}px"><div class="board-stage" id="board-stage" style="width:${dim.w}px;height:${dim.h}px"><div class="board-background" style="background-image:url('${s.boardBg}')"></div>${nodes}</div></div></div>`;
    setZoom(state.boardZoom, true);
  }
  function setZoom(value,preserve){
    const s=state.sheet;if(!s||s.view!=='board')return;
    const viewport=$('#board-viewport'),stage=$('#board-stage'),sizer=$('#board-sizer');if(!viewport||!stage||!sizer)return;
    const old=state.boardZoom, next=clamp(value,.35,1.75);
    const cx=viewport.scrollLeft+viewport.clientWidth/2,cy=viewport.scrollTop+viewport.clientHeight/2;
    state.boardZoom=next;const dim=dimensions(s);
    sizer.style.width=(dim.w*next)+'px';sizer.style.height=(dim.h*next)+'px';
    stage.style.transform=`scale(${next})`;
    if(preserve&&next!==old){viewport.scrollLeft=(cx/old)*next-viewport.clientWidth/2;viewport.scrollTop=(cy/old)*next-viewport.clientHeight/2;}
    if($('#zoom-label'))$('#zoom-label').textContent=Math.round(next*100)+'%';
  }
  function focusOn(s,ref){
    ref=String(ref||'').replace(/\$/g,'');
    const m=ref.match(/^([A-Z]+)(\d+)$/i);if(!m)return;
    const col=[...m[1].toUpperCase()].reduce((a,c)=>a*26+c.charCodeAt(0)-64,0),row=Number(m[2]);
    if(s.view==='board'){
      if(state.viewMode==='list'){
        const cell=$(`[data-cell="${m[1].toUpperCase()+row}"]`,$('#board-content'));
        cell?.scrollIntoView({block:'center',behavior:'smooth'});
      }else{
        const dim=dimensions(s);const viewport=$('#board-viewport');if(!viewport)return;
        let x=dim.x[Math.min(col-1,dim.x.length-1)]||0,y=dim.y[Math.min(row-1,dim.y.length-1)]||0;
        viewport.scrollLeft=Math.max(0,x*state.boardZoom-viewport.clientWidth*.32);
        const hasInternalY = viewport.scrollHeight > viewport.clientHeight + 4 && getComputedStyle(viewport).overflowY !== 'visible';
        if(hasInternalY) viewport.scrollTop=Math.max(0,y*state.boardZoom-viewport.clientHeight*.3);
        else {
          const rect=viewport.getBoundingClientRect();
          const pageTop=window.scrollY + rect.top + y*state.boardZoom;
          window.scrollTo({top:Math.max(0,pageTop-160),behavior:'smooth'});
        }
      }
    }else if(s.view==='table'){
      const el=state.viewMode==='cards'? $(`[data-row="${row}"]`,$('#table-content')) : $(`td[data-row="${row}"][data-col="${col}"]`,$('#table-content'));
      if(el){const scrollParent=el.closest('.table-scroll');if(scrollParent){scrollParent.scrollTop=el.offsetTop-130;scrollParent.scrollLeft=Math.max(0,el.offsetLeft-120);}else el.scrollIntoView({block:'center',behavior:'smooth'});}
    }
  }

  const searchIndex = book.sheets.flatMap(s=>s.cells.filter(c=>String(c[2]).trim()||c[4]).map(c=>({s,c,hay:((c[2]||'')+' '+(c[4]||'')+' '+s.name).toLocaleLowerCase()})));
  function highlight(text,q){
    const src=String(text||'');if(!q)return esc(src.slice(0,260));
    const index=src.toLocaleLowerCase().indexOf(q.toLocaleLowerCase());
    if(index<0)return esc(src.slice(0,280));
    const start=Math.max(0,index-90);const end=Math.min(src.length,index+Math.max(q.length,1)+180);
    return (start?'…':'')+esc(src.slice(start,index))+'<mark>'+esc(src.slice(index,index+q.length))+'</mark>'+esc(src.slice(index+q.length,end))+(end<src.length?'…':'');
  }
  function renderSearch(q){
    state.searchLimit=70;state.focus=null;
    setTop('全站搜尋',q||'搜尋');
    $('#main').innerHTML=`<section class="results-intro"><button class="back-link" data-home>← 返回首頁</button><h1>資料搜尋</h1>${searchForm('results')}<p id="results-count">輸入人物、經文或主題關鍵字，搜尋全部 ${book.sheets.length} 份工作表。</p></section><div class="search-result-list" id="search-results"></div><div id="search-more"></div>`;
    $('#results-query').value=q;
    buildResults(q);
  }
  function buildResults(q){
    q=q.trim().toLocaleLowerCase();if(!q){$('#search-results').innerHTML='';$('#search-more').innerHTML='';return;}
    const matches=searchIndex.filter(x=>x.hay.includes(q));
    $('#results-count').textContent=`找到 ${matches.length.toLocaleString()} 筆符合「${q}」的內容，跨 ${new Set(matches.map(x=>x.s.id)).size} 個工作表。`;
    const rows=matches.slice(0,state.searchLimit);
    $('#search-results').innerHTML=rows.map(({s,c})=>`<button class="result-card" data-result="${s.id}|${refOf(c)}"><span class="result-meta">${esc(s.name)} <span>${esc(refOf(c))}</span></span><div class="result-content">${highlight(c[2]||c[4],q)}</div></button>`).join('')||'<div class="empty-state">找不到符合的內容，可以試試其他關鍵字。</div>';
    $('#search-more').innerHTML=matches.length>rows.length?`<button class="load-more" id="search-load">顯示更多 · 已顯示 ${rows.length}/${matches.length} 筆</button>`:'';
  }
  function showModal(title,body,cls=''){
    $('#dialog-root').innerHTML=`<div class="modal-backdrop" id="modal-backdrop"><section class="modal ${cls}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="modal-head"><strong>${esc(title)}</strong><button class="modal-close" aria-label="關閉" id="modal-close">×</button></div><div class="modal-body">${body}</div></section></div>`;
  }
  function openNote(id,ref){
    const s=byId.get(id);if(!s)return;
    const m=ref.match(/^([A-Z]+)(\d+)$/i);if(!m)return;
    const col=[...m[1]].reduce((a,c)=>a*26+c.charCodeAt(0)-64,0);
    const c=getCell(s,Number(m[2]),col);if(!c)return;
    const body=`<div class="meta">${esc(s.name)} · ${esc(ref)}</div><div>${esc(c[2])||'(原始儲存格無文字)'}</div>${c[4]?`<div class="comment-label">原始 Excel 註解</div><div class="comment-box">${esc(c[4])}</div>`:''}${c[6]?`<div class="comment-label">原始公式</div><div class="comment-box">${esc(c[6])}</div>`:''}${c[5]?`<div class="comment-label">原始超連結</div><button class="tool-btn primary" data-link="${esc(c[5])}">前往延伸資料 ↗</button>`:''}`;
    showModal(c[2]?.slice(0,70)||ref,body);
  }
  function openImage(src){
    if(!/^assets\/images\/[\w.\-]+$/.test(src))return;
    showModal('原始圖片 · 放大檢視',`<img alt="原始 Excel 圖片" src="${esc(src)}">`,'image-modal');
  }
  function route(){
    closeMenu();$('#dialog-root').innerHTML='';
    const r=getRoute();
    if(r.section==='sheet')renderSheet(r.arg,r.query.get('cell')||'');
    else if(r.section==='category' && categories.includes(r.arg))renderHome(r.arg);
    else if(r.section==='search')renderSearch(r.query.get('q')||'');
    else renderHome();
    renderNav();
    if(!r.query.get('cell'))window.scrollTo({top:0,behavior:'instant'});
  }

  document.addEventListener('click',event=>{
    const target=event.target;
    if(target.closest('#menu-btn')||target.closest('#sidebar-toggle')){toggleSidebarCollapsed();return;}
    if(target.closest('#mobile-scrim')){closeMenu();return;}
    if(target.closest('#theme-btn')){toggleTheme();return;}
    if(target.closest('#search-shortcut')){navSearch('');setTimeout(()=>$('#results-query')?.focus(),80);return;}
    if(target.closest('#modal-close')||target.id==='modal-backdrop'){$('#dialog-root').innerHTML='';return;}
    const sh=target.closest('[data-sheet]');if(sh){navSheet(sh.dataset.sheet);return;}
    const cat=target.closest('[data-cat]');if(cat){cat.dataset.cat==='all'?navHome():navCategory(cat.dataset.cat);return;}
    if(target.closest('[data-home]')){navHome();return;}
    const back=target.closest('[data-back-category]');if(back){navCategory(back.dataset.backCategory);return;}
    const jump=target.closest('[data-result]');if(jump){let [id,...rest]=jump.dataset.result.split('|');navSheet(id,rest.join('|'));return;}
    const link=target.closest('[data-link]');if(link){event.preventDefault();navigateLink(link.dataset.link);return;}
    const note=target.closest('[data-note]');if(note){let [id,ref]=note.dataset.note.split('|');openNote(id,ref);return;}
    const image=target.closest('[data-image]');if(image){openImage(image.dataset.image);return;}
    const tableMode=target.closest('[data-table-mode]');if(tableMode&&state.sheet){state.viewMode=tableMode.dataset.tableMode;$$('[data-table-mode]').forEach(x=>x.classList.toggle('selected',x===tableMode));buildTableContent(state.sheet);if(state.focus)setTimeout(()=>focusOn(state.sheet,state.focus),30);return;}
    const boardMode=target.closest('[data-board-mode]');if(boardMode&&state.sheet){state.viewMode=boardMode.dataset.boardMode;$$('[data-board-mode]').forEach(x=>x.classList.toggle('selected',x===boardMode));buildBoardContent(state.sheet);if(state.focus)setTimeout(()=>focusOn(state.sheet,state.focus),60);return;}
    const zoom=target.closest('[data-zoom]');if(zoom){let op=zoom.dataset.zoom;setZoom(op==='in'?state.boardZoom*1.2:op==='out'?state.boardZoom/1.2:1,true);return;}
    const boardScroll=target.closest('[data-scroll-board]');if(boardScroll){const vp=$('#board-viewport');if(vp){const to=boardScroll.dataset.scrollBoard==='bottom' ? vp.offsetTop + vp.scrollHeight + 40 : Math.max(0,vp.offsetTop-120);window.scrollTo({top:to,behavior:'smooth'});}return;}
    if(target.closest('#load-more')&&state.sheet){state.tableLimit+=90;buildTableContent(state.sheet);return;}
    if(target.closest('#search-load')){state.searchLimit+=70;buildResults(getRoute().query.get('q')||'');return;}
  });
  document.addEventListener('submit',event=>{
    if(event.target.matches('[data-form="global"]')){event.preventDefault();let q=new FormData(event.target).get('q')||'';if(q.trim())navSearch(q);else toast('請輸入搜尋關鍵字。');}
  });
  document.addEventListener('input',event=>{
    if(event.target.id==='table-filter'&&state.sheet){const pos=event.target.selectionStart;state.tableFilter=event.target.value;state.tableLimit=90;buildTableContent(state.sheet);event.target.focus();try{event.target.setSelectionRange(pos,pos);}catch(e){}}
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){$('#dialog-root').innerHTML='';closeMenu();}
    if(event.key==='/' && !/^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName||'')){event.preventDefault();const input=$('input[type="search"]');if(input)input.focus();else{navSearch('');setTimeout(()=>$('#results-query')?.focus(),80);}}
    if((event.key==='Enter'||event.key===' ')&&event.target.matches('[data-link],[data-note]')&&event.target.tagName!=='BUTTON'&&event.target.tagName!=='A'){event.preventDefault();event.target.click();}
  });
  window.addEventListener('hashchange',route);
  $('#theme-btn').addEventListener('click',event=>event.preventDefault());
  initUIState();initTheme();window.addEventListener('resize',applySidebarCollapsed);route();
  } // End startApplication, called only after Firestore data is available.
  window.addEventListener('bible-workbook-ready', startApplication);
  if (window.BIBLE_WORKBOOK) startApplication();
})();
