const CSS = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #F7F4EF; }
.app { min-height: 100vh; font-family: 'Noto Sans JP', sans-serif; background: #F7F4EF; color: #2D2926; padding-bottom: 80px; }

/* ── ヘッダー ── */
.header { background: #2D2926; color: #F7F4EF; padding: 14px 14px 0; position: sticky; top: 0; z-index: 10; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
.header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px; }
.header-title { font-family: 'Zen Kaku Gothic New', sans-serif; font-size: 17px; font-weight: 700; white-space: nowrap; }
.header-right { display: flex; gap: 6px; align-items: center; flex-shrink: 0; }
.add-cat-btn { background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 6px 11px; border-radius: 20px; font-size: 12px; font-family: inherit; cursor: pointer; font-weight: 500; white-space: nowrap; }
.shop-btn { background: #E8734A; color: white; border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; position: relative; flex-shrink: 0; }
.stats-btn { background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.2); width: 36px; height: 36px; border-radius: 50%; font-size: 15px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.settings-btn { background: rgba(255,255,255,0.12); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 7px 13px; border-radius: 20px; font-size: 13px; font-family: inherit; cursor: pointer; font-weight: 600; white-space: nowrap; }
.shop-count-badge { background: #E8734A; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; cursor: pointer; white-space: nowrap; }
.badge { position: absolute; top: -4px; right: -4px; background: white; color: #E8734A; border-radius: 50%; width: 16px; height: 16px; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.tabs { display: flex; overflow-x: auto; scrollbar-width: none; }
.tabs::-webkit-scrollbar { display: none; }
.tab { padding: 12px 16px; background: transparent; border: none; color: #A89E94; font-size: 14px; font-family: inherit; cursor: pointer; border-bottom: 3px solid transparent; font-weight: 600; white-space: nowrap; flex-shrink: 0; transition: color 0.2s; }
.tab.active { color: #F7F4EF; border-bottom-color: #E8734A; }
.tab.alert { color: #F09436; }
.tab.alert.active { color: #F7F4EF; border-bottom-color: #F09436; }

/* ── コンテンツ ── */
.content { padding: 12px 14px; max-width: 480px; margin: 0 auto; }
.empty { text-align: center; padding: 48px 20px; color: #A89E94; }
.empty-icon { font-size: 48px; margin-bottom: 12px; }

/* ── アイテムカード ── */
.item-card { background: white; border-radius: 14px; padding: 12px 14px 10px; margin-bottom: 8px; box-shadow: 0 1px 8px rgba(0,0,0,0.07); border-left: 4px solid #EEE9E2; transition: all 0.2s; cursor: pointer; }
.item-card.low  { border-left-color: #E8734A; background: linear-gradient(135deg, #FFFAF7, white); }
.item-card.soon { border-left-color: #D4A843; background: linear-gradient(135deg, #FFFDF0, white); }
.item-card:active { transform: scale(0.99); }
.item-main { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; gap: 8px; }
.item-info { flex: 1; min-width: 0; }
.item-name { font-size: 15px; font-weight: 700; line-height: 1.3; }
.item-meta { font-size: 11px; color: #A89E94; margin-top: 2px; }
.last-buy { color: #C06A9E; font-weight: 500; }
.badges-row { display: flex; gap: 4px; margin-top: 5px; flex-wrap: wrap; }
.low-badge  { background: #E8734A; color: white; font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 700; }
.soon-badge { background: #D4A843; color: white; font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 700; }
.fav-badge  { background: #F9E84A; color: #2D2926; font-size: 10px; padding: 2px 8px; border-radius: 10px; font-weight: 700; }
.pred-text  { font-size: 11px; color: #B0A89E; margin-top: 2px; }
.pred-text.warn { color: #D4A843; font-weight: 600; }
.stock-area { text-align: right; flex-shrink: 0; }
.stock-num { font-family: 'Zen Kaku Gothic New', sans-serif; font-size: 36px; font-weight: 700; line-height: 1; color: #2D2926; }
.stock-num.low { color: #E8734A; }
.stock-unit { font-size: 11px; color: #A89E94; margin-top: 1px; }
.ctrl-row { display: flex; align-items: center; gap: 8px; }
.progress-bar { flex: 1; height: 8px; background: #F0EDE8; border-radius: 6px; overflow: hidden; }
.progress-fill { height: 100%; border-radius: 6px; transition: width 0.4s; }
.ctrl { width: 38px; height: 38px; border-radius: 11px; border: none; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-weight: 700; transition: all 0.15s; flex-shrink: 0; }
.ctrl.minus { background: #F0EDE8; color: #2D2926; }
.ctrl.plus  { background: #2D2926; color: white; }
.ctrl:active { transform: scale(0.88); }
.edit-row { display: flex; gap: 8px; margin-top: 6px; }
.edit-btn { flex: 1; padding: 8px; border: 1.5px solid #EEE9E2; border-radius: 10px; background: white; font-size: 12px; font-family: inherit; cursor: pointer; color: #2D2926; font-weight: 500; }
.del-btn  { padding: 8px 16px; border: 1.5px solid #FFE0D5; border-radius: 10px; background: white; font-size: 12px; font-family: inherit; cursor: pointer; color: #E8734A; font-weight: 500; }

/* ── 編集パネル ── */
.bottom-edit { margin-top: 12px; }
.edit-toggle { width: 100%; padding: 11px; border: 2px dashed #D4CEC7; border-radius: 14px; background: transparent; font-size: 13px; font-family: inherit; cursor: pointer; color: #B0A89E; font-weight: 500; transition: all 0.2s; }
.edit-toggle:hover { border-color: #2D2926; color: #2D2926; }
.edit-panel { background: white; border-radius: 14px; padding: 12px; box-shadow: 0 1px 8px rgba(0,0,0,0.07); }
.edit-panel-row { display: flex; gap: 8px; margin-bottom: 8px; }
.btn-add-item     { flex: 2; padding: 11px; background: #2D2926; color: white; border: none; border-radius: 10px; font-size: 13px; font-family: inherit; cursor: pointer; font-weight: 700; }
.btn-cat-settings { flex: 1; padding: 11px; background: #F7F4EF; color: #2D2926; border: none; border-radius: 10px; font-size: 12px; font-family: inherit; cursor: pointer; font-weight: 500; }
.btn-scan         { flex: 1; padding: 11px; background: #4A90D9; color: white; border: none; border-radius: 10px; font-size: 12px; font-family: inherit; cursor: pointer; font-weight: 700; }
.btn-done { width: 100%; padding: 10px; background: white; border: 1.5px solid #EEE9E2; border-radius: 10px; font-size: 13px; font-family: inherit; cursor: pointer; color: #A89E94; }

/* ── モーダル共通 ── */
.overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: flex-end; justify-content: center; z-index: 100; backdrop-filter: blur(3px); }
.modal { background: white; border-radius: 24px 24px 0 0; padding: 8px 20px 36px; width: 100%; max-width: 480px; max-height: 92vh; overflow-y: auto; }
.modal-handle { width: 40px; height: 4px; background: #EEE9E2; border-radius: 2px; margin: 12px auto 20px; }
.modal-title { font-size: 17px; font-weight: 700; font-family: 'Zen Kaku Gothic New', sans-serif; margin-bottom: 4px; }
.modal-sub { font-size: 12px; color: #A89E94; margin-bottom: 16px; }

/* ── フォーム ── */
.flabel { font-size: 11px; color: #A89E94; font-weight: 600; margin-bottom: 5px; letter-spacing: 0.08em; text-transform: uppercase; }
.finput { width: 100%; border: 2px solid #EEE9E2; border-radius: 10px; padding: 11px 13px; font-size: 14px; font-family: inherit; outline: none; background: #F7F4EF; margin-bottom: 12px; transition: border-color 0.2s; }
.finput:focus { border-color: #2D2926; background: white; }
.ftextarea { width: 100%; border: 2px solid #EEE9E2; border-radius: 10px; padding: 11px 13px; font-size: 14px; font-family: inherit; outline: none; background: #F7F4EF; margin-bottom: 12px; transition: border-color 0.2s; resize: none; min-height: 72px; }
.ftextarea:focus { border-color: #2D2926; background: white; }
.frow { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }
.icon-picker { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.icon-opt { width: 40px; height: 40px; border-radius: 10px; border: 2px solid #EEE9E2; background: #F7F4EF; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.icon-opt.sel { border-color: #2D2926; background: white; }
.color-picker { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; }
.color-opt { width: 30px; height: 30px; border-radius: 50%; border: 3px solid transparent; cursor: pointer; transition: all 0.15s; }
.color-opt.sel { border-color: #2D2926; transform: scale(1.15); }

/* ── ボタン ── */
.btn-primary { width: 100%; padding: 14px; background: #2D2926; color: white; border: none; border-radius: 12px; font-size: 14px; font-family: inherit; cursor: pointer; font-weight: 700; margin-top: 4px; }
.btn-cancel  { width: 100%; padding: 12px; background: #F7F4EF; color: #888; border: none; border-radius: 12px; font-size: 14px; font-family: inherit; cursor: pointer; font-weight: 500; margin-top: 8px; }
.btn-danger  { width: 100%; padding: 12px; background: #FFF0EC; color: #E8734A; border: none; border-radius: 12px; font-size: 14px; font-family: inherit; cursor: pointer; font-weight: 600; margin-top: 8px; }
.btn-record  { width: 100%; padding: 13px; background: #2D2926; color: white; border: none; border-radius: 12px; font-size: 14px; font-family: inherit; cursor: pointer; font-weight: 700; margin-bottom: 8px; }
.btn-ghost   { width: 100%; padding: 12px; background: transparent; color: #A89E94; border: 1.5px dashed #D4CEC7; border-radius: 12px; font-size: 13px; font-family: inherit; cursor: pointer; margin-top: 8px; }
.btn-fav { width: 100%; padding: 12px; border: 2px solid #EEE9E2; border-radius: 12px; font-size: 14px; font-family: inherit; cursor: pointer; font-weight: 600; margin-top: 8px; background: white; color: #2D2926; transition: all 0.2s; }
.btn-fav.active { background: #FFF8D0; border-color: #F9E84A; }

/* ── バーコードスキャン ── */
.scanner-wrap { border-radius: 14px; overflow: hidden; margin-bottom: 12px; background: #000; min-height: 240px; display: flex; align-items: center; justify-content: center; }
.scanner-hint { font-size: 12px; color: #A89E94; text-align: center; margin-bottom: 12px; line-height: 1.7; }
.scan-result-card { background: #F0F7FF; border: 2px solid #4A90D9; border-radius: 12px; padding: 12px 14px; margin-bottom: 12px; }
.scan-result-name { font-size: 15px; font-weight: 700; margin-bottom: 4px; }
.scan-result-sub  { font-size: 12px; color: #A89E94; }

/* ── 購入履歴 ── */
.history-item { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid #F7F4EF; cursor: pointer; }
.history-item:last-child { border-bottom: none; }
.history-item:active { opacity: 0.7; }
.hist-name  { font-size: 14px; font-weight: 700; line-height: 1.3; }
.hist-brand { font-size: 12px; color: #A89E94; margin-top: 2px; }
.hist-desc  { font-size: 11px; color: #888; margin-top: 2px; line-height: 1.4; }
.hist-memo  { font-size: 12px; color: #5BAD8F; margin-top: 4px; line-height: 1.5; white-space: pre-wrap; }
.hist-date  { font-size: 11px; color: #C4BEB8; margin-top: 4px; }
.latest-tag { background: #2D2926; color: white; font-size: 10px; padding: 2px 7px; border-radius: 8px; font-weight: 700; white-space: nowrap; margin-left: 4px; flex-shrink: 0; }
.fav-tag    { background: #F9E84A; color: #2D2926; font-size: 10px; padding: 2px 7px; border-radius: 8px; font-weight: 700; white-space: nowrap; margin-left: 4px; flex-shrink: 0; }
.no-history { text-align: center; padding: 28px; color: #A89E94; font-size: 13px; line-height: 2; }
.hist-reuse-hint { font-size: 11px; color: #A89E94; text-align: center; margin-top: 4px; margin-bottom: 8px; }

/* ── 商品検索 ── */
.search-row { display: flex; gap: 8px; margin-bottom: 12px; }
.search-input { flex: 1; border: 2px solid #EEE9E2; border-radius: 10px; padding: 11px 13px; font-size: 14px; font-family: inherit; outline: none; background: #F7F4EF; transition: border-color 0.2s; }
.search-input:focus { border-color: #2D2926; background: white; }
.search-btn { padding: 11px 14px; background: #2D2926; color: white; border: none; border-radius: 10px; font-size: 13px; font-family: inherit; cursor: pointer; font-weight: 700; white-space: nowrap; }
.search-btn:disabled { opacity: 0.5; cursor: default; }
.searching { text-align: center; padding: 20px; color: #A89E94; font-size: 13px; }
.product-card { background: #F7F4EF; border-radius: 12px; padding: 12px; margin-bottom: 12px; display: flex; gap: 12px; align-items: flex-start; }
.prod-name  { font-size: 14px; font-weight: 700; line-height: 1.3; margin-bottom: 3px; }
.prod-brand { font-size: 12px; color: #A89E94; margin-bottom: 4px; }
.prod-desc  { font-size: 12px; color: #666; line-height: 1.5; }

/* ── 買い物リスト ── */
.shop-item { display: flex; align-items: flex-start; gap: 10px; padding: 12px 0; border-bottom: 1px solid #F7F4EF; }
.shop-item:last-child { border-bottom: none; }
.shop-dot  { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.shop-name { font-size: 14px; font-weight: 700; }
.shop-info { font-size: 12px; color: #A89E94; margin-top: 2px; }
.shop-last { font-size: 11px; color: #C06A9E; margin-top: 2px; }
.shop-fav  { font-size: 11px; color: #B8960A; margin-top: 2px; font-weight: 600; }

/* ── 消費統計 ── */
.stats-card { background: white; border-radius: 14px; padding: 14px; box-shadow: 0 1px 8px rgba(0,0,0,0.07); margin-bottom: 10px; }
.stats-item-name { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
.bar-row { display: flex; align-items: center; gap: 8px; margin-bottom: 7px; }
.bar-label { font-size: 11px; color: #A89E94; width: 36px; flex-shrink: 0; text-align: right; }
.bar-track { flex: 1; height: 22px; background: #F0EDE8; border-radius: 8px; overflow: hidden; }
.bar-fill  { height: 100%; border-radius: 8px; transition: width 0.5s; display: flex; align-items: center; justify-content: flex-end; padding-right: 8px; min-width: 0; }
.bar-val   { font-size: 11px; color: white; font-weight: 700; }
.stats-empty { text-align: center; padding: 40px 20px; color: #A89E94; font-size: 13px; line-height: 2; }

/* ── 設定モーダル ── */
.settings-section { margin-bottom: 4px; }
.settings-label { font-size: 11px; color: #A89E94; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 10px; margin-top: 16px; }
.settings-divider { height: 1px; background: #F0EDE8; margin: 8px 0; }
.settings-cat-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #F7F4EF; font-size: 14px; font-weight: 500; }
.settings-cat-row:last-of-type { border-bottom: none; }
.settings-empty-note { font-size: 13px; color: #A89E94; text-align: center; padding: 12px 0; }
.settings-action-btn { width: 100%; padding: 13px; background: #F7F4EF; color: #2D2926; border: none; border-radius: 12px; font-size: 14px; font-family: inherit; cursor: pointer; font-weight: 600; text-align: left; }

/* ── 履歴アイテム（削除ボタン付き）── */
.history-item-wrap { display: flex; align-items: flex-start; border-bottom: 1px solid #F7F4EF; }
.history-item-wrap:last-child { border-bottom: none; }
.history-item-wrap .history-item { border-bottom: none; flex: 1; }
.hist-del-btn { background: none; border: none; font-size: 16px; cursor: pointer; padding: 12px 4px; color: #C4BEB8; flex-shrink: 0; opacity: 0.6; transition: opacity 0.15s; }
.hist-del-btn:active { opacity: 1; color: #E8734A; }

/* ── トースト ── */
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #2D2926; color: white; padding: 10px 20px; border-radius: 20px; font-size: 13px; font-family: 'Noto Sans JP', sans-serif; z-index: 999; white-space: nowrap; box-shadow: 0 4px 20px rgba(0,0,0,0.2); animation: fup 0.3s ease; }
.toast.warn { background: #E8734A; }
@keyframes fup { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
`;

export default CSS;
