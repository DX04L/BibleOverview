// Data bootstrapping: no Excel/JSON files are read from the public website.
// Firebase imports are intentionally lazy so configuration errors show a clear message.
const main = document.getElementById('main');
function showFailure(message, err) {
  console.error('聖經概覽 Firebase 載入失敗', err || message);
  main.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'loading-view';
  box.style.cssText = 'padding:44px 26px;max-width:740px;line-height:1.9';
  const title = document.createElement('strong');
  title.textContent = '資料載入失敗';
  const p = document.createElement('p');
  p.textContent = message;
  const detail = document.createElement('p');
  detail.style.cssText='font-size:14px;opacity:.8';
  detail.textContent = '請確認 Firebase 專案設定、Firestore Security Rules，以及資料匯入是否成功。';
  box.append(title, p, detail);
  main.appendChild(box);
}
async function loadBibleWorkbook() {
  const config = window.BIBLE_FIREBASE_CONFIG;
  if (!config || !config.projectId || config.projectId.includes('YOUR_') ||
      !config.apiKey || config.apiKey.startsWith('PASTE_') ||
      !config.appId || config.appId.startsWith('PASTE_')) {
    showFailure('尚未填入 Firebase 網站設定。請修改 website/firebase-config.js 中的 apiKey、projectId、appId 等欄位。');
    return;
  }
  try {
    const {initializeApp} = await import('https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js');
    const {getFirestore, collection, doc, getDocs, getDoc} = await import('https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js');
    const db = getFirestore(initializeApp(config));
    const metaSnap = await getDoc(doc(db, 'bible_overview_meta', 'index'));
    if (!metaSnap.exists()) throw new Error('找不到 bible_overview_meta/index，請先執行資料匯入。');
    const index = metaSnap.data();
    if (typeof index.payload !== 'string' || !Array.isArray(index.sheetIds)) throw new Error('資料索引結構不正確。');
    const snapshots = await getDocs(collection(db, 'bible_overview_sheets'));
    const sheetsById = new Map();
    snapshots.forEach(s => {const data=s.data(); if (typeof data.payload === 'string') sheetsById.set(s.id, data.payload);});
    const expected=index.sheetIds;
    if (expected.length !== index.sheetCount || new Set(expected).size !== expected.length)
      throw new Error('資料索引的工作表數量不一致。');
    const missing=expected.filter(id => !sheetsById.has(id));
    if(missing.length) throw new Error('Firestore 缺少工作表：'+missing.join(', '));
    const sheets=expected.map(id => {
      const sheet=JSON.parse(sheetsById.get(id));
      if(sheet.id !== id || !Array.isArray(sheet.cells) || !Array.isArray(sheet.links) || !Array.isArray(sheet.images))
        throw new Error('工作表內容格式不正確：'+id);
      return sheet;
    });
    const book=JSON.parse(index.payload);
    book.sheets=sheets;
    if(book.totalCells !== sheets.reduce((sum,s)=>sum+s.cells.length,0) ||
       book.totalImages !== sheets.reduce((sum,s)=>sum+s.images.length,0) ||
       book.totalComments !== sheets.reduce((sum,s)=>sum+s.comments,0))
      throw new Error('資料完整性驗證失敗：筆數與原始 Excel 不一致。');
    window.BIBLE_WORKBOOK=book;
    window.dispatchEvent(new Event('bible-workbook-ready'));
  } catch (err) {
    const message=err?.code === 'permission-denied'
      ? 'Firestore 尚未允許公開讀取聖經概覽資料；請設定提供的 firestore.rules。'
      : err?.message?.includes('Failed to fetch')
        ? '無法連線至 Firebase。請檢查網路與瀏覽器限制。'
        : 'Firebase 讀取失敗：'+(err?.message || '未知錯誤');
    showFailure(message,err);
  }
}
loadBibleWorkbook();
