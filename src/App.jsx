import { useState, useEffect } from "react";
import {
  DEFAULT_CATEGORIES, DEFAULT_ITEMS,
  STORAGE_CATS, STORAGE_ITEMS, LEGACY_KEYS,
  nextId, calcPrediction,
} from "./constants.js";
import CSS from "./styles.js";
import { ModalLayer } from "./components.jsx";

const SOON_DAYS = 7;

// ── ストレージ読み込み（旧キーからの移行対応）────────────────────────
async function loadStorage() {
  try {
    // まず現行キーを試みる
    const [cr, ir] = await Promise.allSettled([
      window.storage.get(STORAGE_CATS),
      window.storage.get(STORAGE_ITEMS),
    ]);
    if (cr.status === "fulfilled" && cr.value && ir.status === "fulfilled" && ir.value) {
      return {
        cats:  JSON.parse(cr.value.value),
        items: JSON.parse(ir.value.value),
      };
    }
    // 旧キーを順番に試みる
    for (const legacy of LEGACY_KEYS) {
      const [lc, li] = await Promise.allSettled([
        window.storage.get(legacy.cats),
        window.storage.get(legacy.items),
      ]);
      if (lc.status === "fulfilled" && lc.value && li.status === "fulfilled" && li.value) {
        const cats  = JSON.parse(lc.value.value);
        const items = JSON.parse(li.value.value);
        // 現行キーに移行保存
        await window.storage.set(STORAGE_CATS,  JSON.stringify(cats));
        await window.storage.set(STORAGE_ITEMS, JSON.stringify(items));
        console.log(`Migrated from ${legacy.cats}`);
        return { cats, items };
      }
    }
  } catch {}
  return null; // 何もなければデフォルト
}

export default function App() {
  const [cats,      setCats]      = useState(null);
  const [items,     setItems]     = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [editMode,  setEditMode]  = useState(false);
  const [modal,     setModal]     = useState(null);
  const [toast,     setToast]     = useState(null);

  // ── 初期ロード ────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const saved = await loadStorage();
      if (saved) {
        setCats(saved.cats);
        setItems(saved.items);
        setActiveTab(saved.cats[0]?.id);
      } else {
        setCats(DEFAULT_CATEGORIES);
        setItems(DEFAULT_ITEMS);
        setActiveTab("kitchen");
      }
    })();
  }, []);

  // ── 保存 ──────────────────────────────────────────────────────────
  const saveCats  = async (c) => { setCats(c);  try { await window.storage.set(STORAGE_CATS,  JSON.stringify(c)); } catch {} };
  const saveItems = async (i) => { setItems(i); try { await window.storage.set(STORAGE_ITEMS, JSON.stringify(i)); } catch {} };
  const toast_    = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 2400); };

  // ── 在庫操作 ──────────────────────────────────────────────────────
  const adjustStock = (catId, itemId, delta) => {
    const today = new Date().toLocaleDateString("ja-JP");
    const ni = {
      ...items,
      [catId]: items[catId].map(i => {
        if (i.id !== itemId) return i;
        const newStock  = Math.max(0, i.stock + delta);
        const usageLogs = delta < 0
          ? [{ date: today }, ...(i.usageLogs || [])]
          : (i.usageLogs || []);
        return { ...i, stock: newStock, usageLogs };
      }),
    };
    saveItems(ni);
    const it = ni[catId].find(i => i.id === itemId);
    if (delta < 0 && it.stock <= it.threshold)
      toast_(`⚠️ ${it.name}が少なくなっています`, "warn");
  };

  // ── カテゴリー操作 ────────────────────────────────────────────────
  const addCat = ({ label, icon, color }) => {
    const id = `cat_${Date.now()}`;
    saveCats([...cats, { id, label, icon, color }]);
    saveItems({ ...items, [id]: [] });
    setActiveTab(id); setModal(null); toast_("カテゴリーを追加しました");
  };
  const updateCat = (cat) => {
    saveCats(cats.map(c => c.id === cat.id ? cat : c));
    setModal(null); toast_("更新しました");
  };
  const deleteCat = (catId) => {
    if (cats.length <= 1) { toast_("最低1つ必要です", "warn"); return; }
    const nc = cats.filter(c => c.id !== catId);
    const ni = { ...items }; delete ni[catId];
    saveCats(nc); saveItems(ni);
    setActiveTab(nc[0].id); setEditMode(false); setModal(null); toast_("削除しました");
  };

  // ── アイテム操作 ──────────────────────────────────────────────────
  const addItem = (catId, d) => {
    const item = { id: nextId(), name: d.name, stock: +d.stock, threshold: +d.threshold, unit: d.unit, history: [], usageLogs: [] };
    saveItems({ ...items, [catId]: [...(items[catId] || []), item] });
    setModal(null); toast_("追加しました");
  };
  const updateItem = (catId, d) => {
    saveItems({ ...items, [catId]: items[catId].map(i => i.id === d.id ? { ...i, ...d, stock: +d.stock, threshold: +d.threshold } : i) });
    setModal(null); toast_("更新しました");
  };
  const deleteItem = (catId, itemId) => {
    saveItems({ ...items, [catId]: items[catId].filter(i => i.id !== itemId) });
    toast_("削除しました");
  };

  // ── 購入記録 ──────────────────────────────────────────────────────
  const addPurchase = (catId, itemId, record) => {
    const qty     = record.qty || 1;
    const dateStr = record.buyDate
      ? new Date(record.buyDate).toLocaleDateString("ja-JP")
      : new Date().toLocaleDateString("ja-JP");
    const rec = { id: Date.now(), date: dateStr, qty, ...record };
    const ni = {
      ...items,
      [catId]: items[catId].map(i => {
        if (i.id !== itemId) return i;
        const favorite = rec.isFavorite
          ? { name: rec.name, brand: rec.brand, imageUrl: rec.imageUrl }
          : i.favorite;
        return { ...i, stock: i.stock + qty, history: [rec, ...(i.history || [])], favorite };
      }),
    };
    saveItems(ni);
    const updated = ni[catId].find(i => i.id === itemId);
    setModal({ type: "history", catId, item: updated });
    toast_(`記録しました（+${qty}${updated.unit}）`);
  };

  // ── 履歴再登録 ────────────────────────────────────────────────────
  const reuseHistory = (catId, item, histRecord) => {
    setModal({
      type: "addPurchase", catId, item,
      prefill: {
        name: histRecord.name, brand: histRecord.brand,
        description: histRecord.description, imageUrl: histRecord.imageUrl,
        memo: histRecord.memo || "", isFavorite: histRecord.isFavorite || false,
      },
    });
  };

  // ── 購入履歴削除 ──────────────────────────────────────────────────
  const deleteHistory = (catId, itemId, histId, qty) => {
    const ni = {
      ...items,
      [catId]: items[catId].map(i => {
        if (i.id !== itemId) return i;
        const newHistory = (i.history || []).filter(h => h.id !== histId);
        const newStock   = Math.max(0, i.stock - qty);
        return { ...i, history: newHistory, stock: newStock };
      }),
    };
    saveItems(ni);
    const updated = ni[catId].find(i => i.id === itemId);
    setModal({ type: "history", catId, item: updated });
    toast_("削除しました");
  };

  // ── バーコードスキャン ────────────────────────────────────────────
  const onScanFound = (catId, scanResult) => {
    setModal({ type: "addItem", catId, prefill: { name: scanResult.name, brand: scanResult.brand, unit: scanResult.unit || "個" } });
  };

  // ── データリセット ────────────────────────────────────────────────
  const resetAllData = async () => {
    saveCats(DEFAULT_CATEGORIES);
    saveItems(DEFAULT_ITEMS);
    setActiveTab("kitchen");
    setModal(null);
    toast_("データをリセットしました");
  };

  // ── ローディング ──────────────────────────────────────────────────
  if (!cats || !items) {
    return <div style={{ display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontFamily:"sans-serif",color:"#888" }}>読み込み中...</div>;
  }

  // ── 派生データ ────────────────────────────────────────────────────
  const activeCat = cats.find(c => c.id === activeTab);
  const allItemsWithPred = cats.flatMap(cat =>
    (items[cat.id] || []).map(item => ({ ...item, cat, pred: calcPrediction(item) }))
  );
  const soonItems = allItemsWithPred.filter(i => i.pred && i.pred.daysLeft <= SOON_DAYS).sort((a, b) => a.pred.daysLeft - b.pred.daysLeft);
  const shopItems = allItemsWithPred.filter(i => i.stock <= i.threshold);
  const activeItems = activeTab === "soon"
    ? soonItems
    : (items[activeTab] || []).map(item => ({ ...item, pred: calcPrediction(item) }));

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap" rel="stylesheet" />
      <style>{CSS}</style>
      <div className="app">

        {/* ヘッダー */}
        <header className="header">
          <div className="header-top">
            <div className="header-title">🏠 在庫管理</div>
            <div className="header-right">
              {/* 買い物リストバッジ（件数だけ見せる） */}
              {shopItems.length > 0 && (
                <div className="shop-count-badge" onClick={() => setModal({ type: "settings" })}>
                  🛒 {shopItems.length}件
                </div>
              )}
              {/* 設定ボタン1つに統合 */}
              <button className="settings-btn" onClick={() => setModal({ type: "settings" })}>
                ⚙️ 設定
              </button>
            </div>
          </div>
          <div className="tabs">
            {soonItems.length > 0 && (
              <button className={`tab alert ${activeTab === "soon" ? "active" : ""}`}
                onClick={() => { setActiveTab("soon"); setEditMode(false); }}>
                ⚠️ もうすぐ切れる
              </button>
            )}
            {cats.map(cat => (
              <button key={cat.id} className={`tab ${activeTab === cat.id ? "active" : ""}`}
                onClick={() => { setActiveTab(cat.id); setEditMode(false); }}>
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </header>

        {/* コンテンツ */}
        <div className="content">

          {/* そろそろ切れるタブ */}
          {activeTab === "soon" && (
            activeItems.length === 0
              ? <div className="empty"><div className="empty-icon">✅</div><div>切れそうなものはありません</div></div>
              : activeItems.map(item => {
                  const isLow = item.stock <= item.threshold;
                  const catId = item.cat.id;
                  const pct   = Math.min(100, item.stock / Math.max(item.threshold * 3, item.stock, 1) * 100);
                  return (
                    <div key={`${catId}-${item.id}`} className={`item-card ${isLow ? "low" : "soon"}`}
                      onClick={() => setModal({ type: "history", catId, item })}>
                      <div className="item-main">
                        <div className="item-info">
                          <div className="item-name">{item.name}</div>
                          <div className="item-meta">{item.cat.icon} {item.cat.label}</div>
                          <div className={`pred-text ${item.pred.daysLeft <= 3 ? "warn" : ""}`}>
                            あと約 {item.pred.daysLeft} 日
                          </div>
                          {isLow ? <span className="low-badge">要購入</span> : <span className="soon-badge">⚠️ そろそろ</span>}
                        </div>
                        <div className="stock-area">
                          <div className={`stock-num ${isLow ? "low" : ""}`}>{item.stock}</div>
                          <div className="stock-unit">{item.unit}</div>
                        </div>
                      </div>
                      <div className="ctrl-row" onClick={e => e.stopPropagation()}>
                        <button className="ctrl minus" onClick={() => adjustStock(catId, item.id, -1)}>−</button>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${pct}%`, background: isLow ? "#E8734A" : "#D4A843" }} />
                        </div>
                        <button className="ctrl plus" onClick={() => adjustStock(catId, item.id, 1)}>＋</button>
                      </div>
                    </div>
                  );
                })
          )}

          {/* 通常タブ */}
          {activeTab !== "soon" && (
            <>
              {activeItems.length === 0 && !editMode
                ? <div className="empty"><div className="empty-icon">📦</div><div>アイテムがありません</div><div style={{ fontSize: 12, marginTop: 6 }}>下の「編集」から追加できます</div></div>
                : activeItems.map(item => {
                    const isLow  = item.stock <= item.threshold;
                    const isSoon = item.pred && item.pred.daysLeft <= SOON_DAYS && !isLow;
                    const last   = item.history?.[0];
                    const fav    = item.favorite;
                    const pct    = Math.min(100, item.stock / Math.max(item.threshold * 3, item.stock, 1) * 100);
                    return (
                      <div key={item.id} className={`item-card ${isLow ? "low" : isSoon ? "soon" : ""}`}
                        onClick={() => !editMode && setModal({ type: "history", catId: activeTab, item })}>
                        <div className="item-main">
                          <div className="item-info">
                            <div className="item-name">{item.name}</div>
                            <div className="item-meta">
                              目安: {item.threshold}{item.unit}以下
                              {fav
                                ? <span className="last-buy"> · ⭐ {fav.brand || fav.name}</span>
                                : last && <span className="last-buy"> · 前回: {last.brand || last.name}</span>}
                            </div>
                            {item.pred && (
                              <div className={`pred-text ${item.pred.daysLeft <= SOON_DAYS ? "warn" : ""}`}>
                                平均 {item.pred.avgDays} 日/回 · あと約 {item.pred.daysLeft} 日
                              </div>
                            )}
                            <div className="badges-row">
                              {isLow  && <span className="low-badge">要購入</span>}
                              {isSoon && <span className="soon-badge">⚠️ そろそろ</span>}
                              {fav    && <span className="fav-badge">⭐ お気に入り</span>}
                            </div>
                          </div>
                          <div className="stock-area">
                            <div className={`stock-num ${isLow ? "low" : ""}`}>{item.stock}</div>
                            <div className="stock-unit">{item.unit}</div>
                          </div>
                        </div>
                        {!editMode && (
                          <div className="ctrl-row" onClick={e => e.stopPropagation()}>
                            <button className="ctrl minus" onClick={() => adjustStock(activeTab, item.id, -1)}>−</button>
                            <div className="progress-bar">
                              <div className="progress-fill" style={{ width: `${pct}%`, background: isLow ? "#E8734A" : isSoon ? "#D4A843" : activeCat?.color }} />
                            </div>
                            <button className="ctrl plus" onClick={() => adjustStock(activeTab, item.id, 1)}>＋</button>
                          </div>
                        )}
                        {editMode && (
                          <div className="edit-row" onClick={e => e.stopPropagation()}>
                            <button className="edit-btn" onClick={() => setModal({ type: "editItem", catId: activeTab, item: { ...item } })}>✏️ 編集</button>
                            <button className="del-btn" onClick={() => deleteItem(activeTab, item.id)}>🗑️ 削除</button>
                          </div>
                        )}
                      </div>
                    );
                  })}

              <div className="bottom-edit">
                {!editMode
                  ? <button className="edit-toggle" onClick={() => setEditMode(true)}>
                      ✏️ {activeCat?.label}を編集
                    </button>
                  : <div className="edit-panel">
                      <div className="edit-panel-row">
                        <button className="btn-add-item" onClick={() => setModal({ type: "addItem", catId: activeTab })}>＋ アイテムを追加</button>
                        <button className="btn-scan" onClick={() => setModal({ type: "scan", catId: activeTab })}>📷 スキャン</button>
                        <button className="btn-cat-settings" onClick={() => setModal({ type: "editCat", cat: { ...activeCat } })}>⚙️</button>
                      </div>
                      <button className="btn-done" onClick={() => setEditMode(false)}>完了</button>
                    </div>}
              </div>
            </>
          )}
        </div>
      </div>

      {modal && (
        <ModalLayer modal={modal} setModal={setModal} cats={cats} items={items}
          addCat={addCat} updateCat={updateCat} deleteCat={deleteCat}
          addItem={addItem} updateItem={updateItem}
          addPurchase={addPurchase} reuseHistory={reuseHistory} deleteHistory={deleteHistory}
          onScanFound={onScanFound}
          shopItems={shopItems} toast_={toast_}
          resetAllData={resetAllData} />
      )}

      {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}
