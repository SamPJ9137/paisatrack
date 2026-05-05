import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, Receipt, Users, Landmark, MoreHorizontal,
  Plus, X, ArrowRightLeft, Settings, Search, BarChart2,
  RefreshCw, ChevronRight, Bell, Shield, Tag, ChevronDown,
  ArrowUpRight, ArrowDownLeft, ChevronLeft, Eye, EyeOff,
  Trash2, Edit2, Camera, Filter, User, Check, Calendar,
  Lock, Download, Moon, Sun, ToggleLeft, ToggleRight, LogOut
} from "lucide-react";

// ─── Theme ────────────────────────────────────────────────────────────────────
const T = {
  bg: "#0E1420", surface: "#151C2C", card: "#1B2440",
  border: "#253050", borderSoft: "#1D2840",
  accent: "#3DD9AF", accentDim: "#1A3D30", accentText: "#2EC99C",
  text: "#DDE3F0", textSec: "#7A8BA8", textMuted: "#4A5870",
  danger: "#FF6B7A", dangerDim: "#3D1A20",
  success: "#3DD9AF", successDim: "#1A3D30",
  warning: "#F5A623", warningDim: "#3D2E10",
  purple: "#A78BFA", purpleDim: "#1E1535",
  navBg: "#0B1018", navBorder: "#1A2235",
  overlay: "rgba(5,8,18,0.9)",
};

const AC = {
  SBI:   { a: "#00C2E0", d: "#081E2A" },
  HDFC:  { a: "#F5A623", d: "#2A1C00" },
  KOTAK: { a: "#A78BFA", d: "#1A1230" },
};

// ─── Categories ───────────────────────────────────────────────────────────────
const CATS = [
  { id: "mess",           label: "Mess Food",       emoji: "🍱", color: "#FF6B7A" },
  { id: "restaurant",     label: "Restaurant",       emoji: "🍽️", color: "#FF8C61" },
  { id: "rickshaw",       label: "Rickshaw",         emoji: "🛺", color: "#F5A623" },
  { id: "metro",          label: "Metro",            emoji: "🚇", color: "#00C2E0" },
  { id: "grocery_solo",   label: "Grocery (Solo)",   emoji: "🛒", color: "#3DD9AF" },
  { id: "grocery_shared", label: "Grocery (Shared)", emoji: "🧺", color: "#2ABEAF" },
  { id: "tea",            label: "Tea / Coffee",     emoji: "☕", color: "#A0785A" },
  { id: "zomato",         label: "Zomato / Swiggy",  emoji: "🛵", color: "#FC4E0A" },
  { id: "bus",            label: "Bus / Auto",       emoji: "🚌", color: "#F5A623" },
  { id: "fuel",           label: "Fuel",             emoji: "⛽", color: "#FF6B7A" },
  { id: "medicine",       label: "Medicine",         emoji: "💊", color: "#3DD9AF" },
  { id: "entertainment",  label: "Entertainment",    emoji: "🎬", color: "#A78BFA" },
  { id: "mobile",         label: "Mobile Recharge",  emoji: "📱", color: "#00C2E0" },
  { id: "laundry",        label: "Laundry",          emoji: "👕", color: "#7A8BA8" },
  { id: "travel",         label: "Travel",           emoji: "✈️", color: "#F5A623" },
  { id: "gifts",          label: "Gifts",            emoji: "🎁", color: "#FF6B7A" },
  { id: "education",      label: "Education",        emoji: "📚", color: "#A78BFA" },
  { id: "rent",           label: "Rent",             emoji: "🏠", color: "#7A8BA8" },
  { id: "home_emi",       label: "Home EMI",         emoji: "🏦", color: "#00C2E0" },
  { id: "edu_emi",        label: "Education EMI",    emoji: "🎓", color: "#A78BFA" },
  { id: "loan",           label: "Other Loan",       emoji: "💳", color: "#FF6B7A" },
  { id: "other",          label: "Other",            emoji: "🧾", color: "#7A8BA8" },
];

const PMODES = ["Cash", "UPI", "Card"];

const NAV = [
  { id: "dashboard", label: "Home",     icon: LayoutDashboard },
  { id: "expenses",  label: "Expenses", icon: Receipt },
  { id: "lending",   label: "Lending",  icon: Users },
  { id: "accounts",  label: "Accounts", icon: Landmark },
  { id: "more",      label: "More",     icon: MoreHorizontal },
];

const MORE_ITEMS = [
  { id: "reports",    label: "Reports & Charts",   icon: BarChart2,      desc: "Monthly trends, category breakdown" },
  { id: "recurring",  label: "Recurring Expenses", icon: RefreshCw,      desc: "Auto-log rent, EMIs, subscriptions" },
  { id: "search",     label: "Search & Filter",    icon: Search,         desc: "Find any transaction fast" },
  { id: "budgets",    label: "Budget Alerts",       icon: Bell,           desc: "Set limits per category" },
  { id: "categories", label: "Categories",          icon: Tag,            desc: "Manage your expense categories" },
  { id: "transfer",   label: "Account Transfer",    icon: ArrowRightLeft, desc: "Move money between accounts" },
  { id: "settings",   label: "Settings",            icon: Settings,       desc: "Theme, PIN lock, export, backup" },
];

// ─── Seed Data ────────────────────────────────────────────────────────────────
const INIT_ACCOUNTS = [
  { id: "SBI",   name: "SBI",   fullName: "State Bank of India",  balance: 12450 },
  { id: "HDFC",  name: "HDFC",  fullName: "HDFC Bank",            balance: 89200 },
  { id: "KOTAK", name: "KOTAK", fullName: "Kotak Mahindra Bank",  balance: 34800 },
];

const INIT_ACC_TX = [
  { id: 1, accountId: "SBI",   type: "income",   title: "Salary Credit",     amount: 55000, date: "2026-05-01", note: "May salary" },
  { id: 2, accountId: "KOTAK", type: "income",   title: "Salary Transfer",   amount: 25000, date: "2026-05-01", note: "Monthly budget" },
  { id: 3, accountId: "HDFC",  type: "income",   title: "Freelance Payment", amount: 15000, date: "2026-04-28", note: "" },
  { id: 4, accountId: "SBI",   type: "transfer", title: "Transfer to HDFC",  amount: 20000, date: "2026-04-30", note: "" },
  { id: 5, accountId: "HDFC",  type: "transfer", title: "Transfer from SBI", amount: 20000, date: "2026-04-30", note: "" },
];

const INIT_EXPENSES = [
  { id: 1,  title: "Mess Lunch",        category: "mess",          amount: 80,    accountId: "SBI",   paymentMode: "Cash", date: "2026-05-03", note: "", tags: [], photo: null },
  { id: 2,  title: "Metro Card",        category: "metro",         amount: 500,   accountId: "SBI",   paymentMode: "UPI",  date: "2026-05-02", note: "", tags: [], photo: null },
  { id: 3,  title: "Zomato Dinner",     category: "zomato",        amount: 280,   accountId: "SBI",   paymentMode: "UPI",  date: "2026-05-02", note: "Biryani", tags: ["dinner"], photo: null },
  { id: 4,  title: "Morning Tea",       category: "tea",           amount: 30,    accountId: "KOTAK", paymentMode: "Cash", date: "2026-05-01", note: "", tags: [], photo: null },
  { id: 5,  title: "Grocery Run",       category: "grocery_solo",  amount: 650,   accountId: "SBI",   paymentMode: "UPI",  date: "2026-05-01", note: "", tags: [], photo: null },
  { id: 6,  title: "Home Loan EMI",     category: "home_emi",      amount: 14000, accountId: "KOTAK", paymentMode: "UPI",  date: "2026-04-05", note: "", tags: [], photo: null },
  { id: 7,  title: "Education EMI",     category: "edu_emi",       amount: 6500,  accountId: "KOTAK", paymentMode: "UPI",  date: "2026-04-10", note: "", tags: [], photo: null },
  { id: 8,  title: "Restaurant Dinner", category: "restaurant",    amount: 750,   accountId: "HDFC",  paymentMode: "Card", date: "2026-04-28", note: "With friends", tags: ["social"], photo: null },
  { id: 9,  title: "Fuel",              category: "fuel",          amount: 300,   accountId: "SBI",   paymentMode: "UPI",  date: "2026-04-25", note: "", tags: [], photo: null },
  { id: 10, title: "Movie Tickets",     category: "entertainment", amount: 400,   accountId: "HDFC",  paymentMode: "Card", date: "2026-04-20", note: "", tags: [], photo: null },
];

const INIT_PEOPLE = [
  { id: 1, name: "Rahul" },
  { id: 2, name: "Priya" },
  { id: 3, name: "Amit"  },
];

const INIT_LENDING = [
  { id: 1, personId: 1, type: "gave",     amount: 1500, date: "2026-04-20", note: "Lunch split",    dueDate: "2026-05-15", settled: false, settlementNote: "" },
  { id: 2, personId: 1, type: "received", amount: 500,  date: "2026-04-28", note: "Partial return",  dueDate: null,         settled: false, settlementNote: "" },
  { id: 3, personId: 2, type: "gave",     amount: 800,  date: "2026-05-01", note: "Train ticket",   dueDate: "2026-05-20", settled: false, settlementNote: "" },
  { id: 4, personId: 2, type: "received", amount: 800,  date: "2026-05-03", note: "Paid back",       dueDate: null,         settled: true,  settlementNote: "Paid via GPay" },
  { id: 5, personId: 3, type: "gave",     amount: 2000, date: "2026-04-15", note: "Emergency cash", dueDate: "2026-05-10", settled: false, settlementNote: "" },
];

const INIT_RECURRING = [
  { id: 1, title: "Rent",           category: "rent",     amount: 8000,  accountId: "SBI",   paymentMode: "UPI",  dayOfMonth: 1,  note: "", active: true  },
  { id: 2, title: "Home Loan EMI",  category: "home_emi", amount: 14000, accountId: "KOTAK", paymentMode: "UPI",  dayOfMonth: 5,  note: "", active: true  },
  { id: 3, title: "Education EMI",  category: "edu_emi",  amount: 6500,  accountId: "KOTAK", paymentMode: "UPI",  dayOfMonth: 10, note: "", active: true  },
  { id: 4, title: "Netflix",        category: "entertainment", amount: 649,  accountId: "HDFC",  paymentMode: "Card", dayOfMonth: 15, note: "Monthly subscription", active: true  },
  { id: 5, title: "Mobile Recharge",category: "mobile",   amount: 299,   accountId: "SBI",   paymentMode: "UPI",  dayOfMonth: 20, note: "", active: false },
];

const INIT_BUDGETS = [
  { id: 1, category: "zomato",       limit: 2000 },
  { id: 2, category: "restaurant",   limit: 3000 },
  { id: 3, category: "entertainment",limit: 2000 },
  { id: 4, category: "grocery_solo", limit: 5000 },
  { id: 5, category: "tea",          limit: 500  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt    = n  => "₹" + Math.abs(n).toLocaleString("en-IN");
const fmtD   = ds => new Date(ds + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const today0 = () => new Date().toISOString().split("T")[0];
const thisYM = () => new Date().toISOString().slice(0, 7);
const getCat = (id, extras = []) => [...CATS, ...extras].find(c => c.id === id) || { label: id, emoji: "🧾", color: "#7A8BA8" };
const ordinal = n => n + (["st","nd","rd"][((n % 100 - 20) % 10) - 1] || ["st","nd","rd"][n % 100 - 1] || "th");
function txIcon(type) {
  if (type === "income")   return { Icon: ArrowDownLeft,  color: T.success };
  if (type === "transfer") return { Icon: ArrowRightLeft, color: T.purple };
  return                          { Icon: ArrowUpRight,   color: T.danger };
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function Pill({ label, color }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 5, background: color + "22", color, letterSpacing: "0.04em" }}>
      {label}
    </span>
  );
}

function Sheet({ title, onClose, children, tall }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: T.overlay, zIndex: 400, display: "flex", alignItems: "flex-end" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{ width: "100%", maxWidth: 430, margin: "0 auto", background: T.surface, borderRadius: "24px 24px 0 0", border: `1px solid ${T.border}`, paddingBottom: 28, maxHeight: tall ? "93vh" : "88vh", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px 14px", flexShrink: 0 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>{title}</p>
          <button onClick={onClose} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <X size={14} color={T.textSec} />
          </button>
        </div>
        <div style={{ borderTop: `1px solid ${T.borderSoft}`, flexShrink: 0 }} />
        <div style={{ padding: "16px 20px 0", overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}

function Fld({ label, children }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <p style={{ margin: "0 0 5px", fontSize: 12, color: T.textSec, fontWeight: 500 }}>{label}</p>
      {children}
    </div>
  );
}

function Inp({ placeholder, value, onChange, type = "text", pre, rows }) {
  const base = { flex: 1, background: "none", border: "none", outline: "none", color: T.text, fontSize: 14, fontFamily: "inherit" };
  return (
    <div style={{ display: "flex", alignItems: rows ? "flex-start" : "center", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: rows ? "10px 14px" : "0 14px", minHeight: 46 }}>
      {pre && <span style={{ fontSize: 15, color: T.textSec, marginRight: 6 }}>{pre}</span>}
      {rows
        ? <textarea rows={rows} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={{ ...base, resize: "none", paddingTop: 2 }} />
        : <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} style={base} />
      }
    </div>
  );
}

function Sel({ value, onChange, options }) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "0 38px 0 14px", height: 46, color: T.text, fontSize: 13, fontFamily: "inherit", outline: "none", appearance: "none", cursor: "pointer" }}>
        {options.map(o => <option key={o.value} value={o.value} style={{ background: T.card }}>{o.label}</option>)}
      </select>
      <ChevronDown size={13} color={T.textSec} style={{ position: "absolute", right: 13, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
    </div>
  );
}

function PBtn({ label, onClick, disabled, color }) {
  const bg = disabled ? T.accentDim : (color || T.accent);
  const fg = disabled ? T.accentText : (color ? "#fff" : "#0B1A14");
  return (
    <button onClick={onClick} disabled={disabled} style={{ width: "100%", background: bg, border: "none", borderRadius: 14, height: 50, fontSize: 15, fontWeight: 700, color: fg, cursor: disabled ? "not-allowed" : "pointer", fontFamily: "inherit", marginTop: 6 }}>
      {label}
    </button>
  );
}

function Empty({ icon: Icon, title, desc, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 32px", textAlign: "center", gap: 10 }}>
      <div style={{ width: 64, height: 64, borderRadius: 20, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={28} color={color} />
      </div>
      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>{title}</p>
      <p style={{ margin: 0, fontSize: 13, color: T.textSec, lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
function StatusBar() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 20px 4px", background: T.bg }}>
      <span style={{ fontSize: 12, color: T.textSec, fontWeight: 500 }}>
        {t.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
      </span>
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="14" height="10" viewBox="0 0 14 10">
          <rect x="0" y="6" width="2.5" height="4" rx="0.5" fill={T.accent}/>
          <rect x="3.5" y="4" width="2.5" height="6" rx="0.5" fill={T.accent}/>
          <rect x="7" y="2" width="2.5" height="8" rx="0.5" fill={T.accent}/>
          <rect x="10.5" y="0" width="2.5" height="10" rx="0.5" fill={T.accent}/>
        </svg>
        <div style={{ width: 22, height: 11, borderRadius: 3, border: `1.5px solid ${T.textMuted}`, padding: 1, display: "flex", alignItems: "center" }}>
          <div style={{ width: "70%", height: "100%", background: T.accent, borderRadius: 1 }} />
        </div>
      </div>
    </div>
  );
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────
function TopBar({ title, subtitle, onBack, right }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 20px 14px", background: T.bg }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {onBack && (
          <button onClick={onBack} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}>
            <ChevronLeft size={16} color={T.textSec} />
          </button>
        )}
        <div>
          {subtitle && <p style={{ margin: "0 0 1px", fontSize: 11, color: T.textMuted, letterSpacing: "0.06em" }}>{subtitle}</p>}
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.3px" }}>{title}</h1>
        </div>
      </div>
      {right || <div style={{ width: 34 }} />}
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ active, onChange }) {
  return (
    <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: T.navBg, borderTop: `1px solid ${T.navBorder}`, display: "flex", zIndex: 200, paddingBottom: 16, paddingTop: 8 }}>
      {NAV.map(s => {
        const on = active === s.id;
        return (
          <button key={s.id} onClick={() => onChange(s.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
            <div style={{ position: "relative" }}>
              {on && <div style={{ position: "absolute", inset: -6, borderRadius: 12, background: T.accentDim, zIndex: 0 }} />}
              <s.icon size={20} color={on ? T.accent : T.textMuted} style={{ position: "relative", zIndex: 1 }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: on ? 600 : 400, color: on ? T.accent : T.textMuted }}>{s.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Dashboard Screen ─────────────────────────────────────────────────────────
function DashboardScreen({ accounts, expenses, people, lending, onSettle, budgets }) {
  const ym       = thisYM();
  const td       = today0();
  const todayAmt = expenses.filter(e => e.date === td).reduce((s, e) => s + e.amount, 0);
  const monthAmt = expenses.filter(e => e.date.startsWith(ym)).reduce((s, e) => s + e.amount, 0);
  const total    = accounts.reduce((s, a) => s + a.balance, 0);
  const recent   = [...expenses].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  // All useState hooks must be at the top
  const [lendModal,   setLendModal]   = useState(null); // "receive" | "owe"
  const [settleSheet, setSettleSheet] = useState(null);
  const [settleNote,  setSettleNote]  = useState("");

  // Budget alerts
  const overBudget = budgets.filter(b => {
    const sp = expenses.filter(e => e.date.startsWith(ym) && e.category === b.category).reduce((s, e) => s + e.amount, 0);
    return sp >= b.limit;
  });
  const nearBudget = budgets.filter(b => {
    const sp = expenses.filter(e => e.date.startsWith(ym) && e.category === b.category).reduce((s, e) => s + e.amount, 0);
    const pct = sp / b.limit;
    return pct >= 0.8 && pct < 1;
  });

  // Compute per-person net balances
  function netForPerson(pid) {
    const txs  = lending.filter(t => t.personId === pid && !t.settled);
    const gave = txs.filter(t => t.type === "gave"    ).reduce((s, t) => s + t.amount, 0);
    const recv = txs.filter(t => t.type === "received").reduce((s, t) => s + t.amount, 0);
    return gave - recv; // positive = they owe you, negative = you owe them
  }

  // People who owe YOU (net > 0)
  const receiveList = people
    .map(p => ({ ...p, net: netForPerson(p.id), txs: lending.filter(t => t.personId === p.id && !t.settled && t.type === "gave") }))
    .filter(p => p.net > 0)
    .sort((a, b) => b.net - a.net);

  // People YOU owe (net < 0)
  const oweList = people
    .map(p => ({ ...p, net: netForPerson(p.id), txs: lending.filter(t => t.personId === p.id && !t.settled && t.type === "received") }))
    .filter(p => p.net < 0)
    .sort((a, b) => a.net - b.net);

  const totalReceive = receiveList.reduce((s, p) => s + p.net, 0);
  const totalOwe     = oweList.reduce((s, p) => s + Math.abs(p.net), 0);

  return (
    <div style={{ padding: "0 16px 100px" }}>

      {/* Total Balance */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: 20, marginBottom: 12, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 130, height: 130, borderRadius: "50%", background: T.accent, opacity: 0.04 }} />
        <p style={{ margin: "0 0 4px", fontSize: 11, color: T.textSec, letterSpacing: "0.07em" }}>TOTAL BALANCE</p>
        <p style={{ margin: "0 0 16px", fontSize: 32, fontWeight: 700, color: T.text, letterSpacing: "-0.5px" }}>₹{total.toLocaleString("en-IN")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {accounts.map(a => (
            <div key={a.id} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 4 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: AC[a.id].a }} />
                <span style={{ fontSize: 11, color: T.textSec, fontWeight: 600 }}>{a.name}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text }}>₹{(a.balance / 1000).toFixed(1)}k</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards — "You'll Receive" and "You Owe" are tappable */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>

        {/* Spent Today */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 14 }}>
          <p style={{ margin: "0 0 5px", fontSize: 11, color: T.textSec }}>Spent Today</p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.danger }}>{fmt(todayAmt)}</p>
        </div>

        {/* This Month */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 14 }}>
          <p style={{ margin: "0 0 5px", fontSize: 11, color: T.textSec }}>This Month</p>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.warning }}>{fmt(monthAmt)}</p>
        </div>

        {/* You'll Receive — TAPPABLE */}
        <div
          onClick={() => totalReceive > 0 && setLendModal("receive")}
          style={{ background: T.successDim, border: `1px solid ${T.success}44`, borderRadius: 16, padding: 14, cursor: totalReceive > 0 ? "pointer" : "default", position: "relative", overflow: "hidden" }}
        >
          <div style={{ position: "absolute", top: -10, right: -10, width: 50, height: 50, borderRadius: "50%", background: T.success, opacity: 0.07 }} />
          <p style={{ margin: "0 0 3px", fontSize: 11, color: T.textSec }}>You'll Receive</p>
          <p style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: T.success }}>{fmt(totalReceive)}</p>
          {receiveList.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, color: T.success, opacity: 0.8 }}>from {receiveList.length} {receiveList.length === 1 ? "person" : "people"}</span>
              <ChevronRight size={10} color={T.success} />
            </div>
          )}
        </div>

        {/* You Owe — TAPPABLE */}
        <div
          onClick={() => totalOwe > 0 && setLendModal("owe")}
          style={{ background: T.purpleDim, border: `1px solid ${T.purple}44`, borderRadius: 16, padding: 14, cursor: totalOwe > 0 ? "pointer" : "default", position: "relative", overflow: "hidden" }}
        >
          <div style={{ position: "absolute", top: -10, right: -10, width: 50, height: 50, borderRadius: "50%", background: T.purple, opacity: 0.07 }} />
          <p style={{ margin: "0 0 3px", fontSize: 11, color: T.textSec }}>You Owe</p>
          <p style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700, color: T.purple }}>{fmt(totalOwe)}</p>
          {oweList.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ fontSize: 10, color: T.purple, opacity: 0.8 }}>to {oweList.length} {oweList.length === 1 ? "person" : "people"}</span>
              <ChevronRight size={10} color={T.purple} />
            </div>
          )}
        </div>
      </div>

      {/* Budget Alert Banners */}
      {overBudget.map(b => {
        const cat = getCat(b.category);
        const sp  = expenses.filter(e => e.date.startsWith(ym) && e.category === b.category).reduce((s, e) => s + e.amount, 0);
        return (
          <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, background: T.dangerDim, border: `1px solid ${T.danger}44`, borderRadius: 13, padding: "10px 14px", marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{cat.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.danger }}>{cat.label} — Over budget!</p>
              <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>Spent {fmt(sp)} of {fmt(b.limit)} limit</p>
            </div>
            <Bell size={14} color={T.danger} />
          </div>
        );
      })}
      {nearBudget.map(b => {
        const cat = getCat(b.category);
        const sp  = expenses.filter(e => e.date.startsWith(ym) && e.category === b.category).reduce((s, e) => s + e.amount, 0);
        return (
          <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 10, background: T.warningDim, border: `1px solid ${T.warning}44`, borderRadius: 13, padding: "10px 14px", marginBottom: 8 }}>
            <span style={{ fontSize: 18 }}>{cat.emoji}</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.warning }}>{cat.label} — Nearly at limit</p>
              <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>Spent {fmt(sp)} of {fmt(b.limit)} limit</p>
            </div>
            <Bell size={14} color={T.warning} />
          </div>
        );
      })}

      {/* Recent Expenses */}
      <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600, color: T.text }}>Recent Expenses</p>
      {recent.length === 0 && <p style={{ color: T.textMuted, fontSize: 13, textAlign: "center", padding: "20px 0" }}>No expenses yet</p>}
      {recent.map(e => {
        const cat = getCat(e.category);
        return (
          <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: cat.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{cat.emoji}</div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.text }}>{e.title}</p>
                <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>{cat.label} · <span style={{ color: AC[e.accountId].a }}>{e.accountId}</span> · {fmtD(e.date)}</p>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.danger }}>-{fmt(e.amount)}</p>
          </div>
        );
      })}

      {/* ── You'll Receive sheet ───────────────────────────────────────────────── */}
      {lendModal === "receive" && (
        <Sheet title="You'll Receive" onClose={() => setLendModal(null)}>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: T.textSec }}>
            Total outstanding: <span style={{ color: T.success, fontWeight: 700 }}>{fmt(totalReceive)}</span>
          </p>

          {receiveList.map(p => {
            // Unsettled "gave" transactions for this person
            const openTxs = lending.filter(t => t.personId === p.id && !t.settled && t.type === "gave");
            const overdue = openTxs.some(t => t.dueDate && t.dueDate < today0());

            return (
              <div key={p.id} style={{ background: T.card, border: `1.5px solid ${overdue ? T.danger + "55" : T.border}`, borderRadius: 16, padding: "14px", marginBottom: 10 }}>
                {/* Person header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: T.purple + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={18} color={T.purple} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{p.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: overdue ? T.danger : T.textMuted }}>
                        {overdue ? "⚠ Has overdue amount" : `${openTxs.length} open transaction${openTxs.length !== 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.success }}>{fmt(p.net)}</p>
                </div>

                {/* Individual transactions */}
                {openTxs.map(tx => (
                  <div key={tx.id} style={{ background: T.surface, borderRadius: 12, padding: "10px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      {tx.note ? <p style={{ margin: "0 0 3px", fontSize: 12, color: T.text, fontWeight: 500 }}>📝 {tx.note}</p> : null}
                      <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>Given on {fmtD(tx.date)}</p>
                      {tx.dueDate ? (
                        <p style={{ margin: "3px 0 0", fontSize: 11, color: tx.dueDate < today0() ? T.danger : T.warning, fontWeight: 600 }}>
                          {tx.dueDate < today0() ? "⚠ Overdue · " : "Due · "}{fmtD(tx.dueDate)}
                        </p>
                      ) : null}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 10 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.success }}>{fmt(tx.amount)}</p>
                      <button
                        onClick={() => { setSettleSheet({ txId: tx.id, personName: p.name, amount: tx.amount }); setSettleNote(""); }}
                        style={{ background: T.successDim, border: `1px solid ${T.success}44`, borderRadius: 8, padding: "5px 11px", cursor: "pointer", fontSize: 11, fontWeight: 700, color: T.success, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Check size={11} color={T.success} /> Settle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </Sheet>
      )}

      {/* ── You Owe sheet ──────────────────────────────────────────────────────── */}
      {lendModal === "owe" && (
        <Sheet title="You Owe" onClose={() => setLendModal(null)}>
          <p style={{ margin: "0 0 14px", fontSize: 13, color: T.textSec }}>
            Total you owe: <span style={{ color: T.purple, fontWeight: 700 }}>{fmt(totalOwe)}</span>
          </p>

          {oweList.map(p => {
            const openTxs = lending.filter(t => t.personId === p.id && !t.settled && t.type === "received");
            return (
              <div key={p.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px", marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 12, background: T.purple + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <User size={18} color={T.purple} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{p.name}</p>
                      <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>{openTxs.length} open transaction{openTxs.length !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.purple }}>{fmt(Math.abs(p.net))}</p>
                </div>

                {openTxs.map(tx => (
                  <div key={tx.id} style={{ background: T.surface, borderRadius: 12, padding: "10px 12px", marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      {tx.note ? <p style={{ margin: "0 0 3px", fontSize: 12, color: T.text, fontWeight: 500 }}>📝 {tx.note}</p> : null}
                      <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>Received on {fmtD(tx.date)}</p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 10 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.purple }}>{fmt(tx.amount)}</p>
                      <button
                        onClick={() => { setSettleSheet({ txId: tx.id, personName: p.name, amount: tx.amount }); setSettleNote(""); }}
                        style={{ background: T.purpleDim, border: `1px solid ${T.purple}44`, borderRadius: 8, padding: "5px 11px", cursor: "pointer", fontSize: 11, fontWeight: 700, color: T.purple, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}
                      >
                        <Check size={11} color={T.purple} /> Mark Paid
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </Sheet>
      )}

      {/* ── Settle confirmation sheet ──────────────────────────────────────────── */}
      {settleSheet && (
        <Sheet title="Mark as Settled" onClose={() => setSettleSheet(null)}>
          <div style={{ background: T.successDim, border: `1px solid ${T.success}33`, borderRadius: 14, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <Check size={16} color={T.success} />
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.success }}>Settling {fmt(settleSheet.amount)} with {settleSheet.personName}</p>
              <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>This will mark the transaction as settled</p>
            </div>
          </div>
          <Fld label="Settlement Note (optional)">
            <Inp placeholder="Paid via GPay, cash, bank transfer…" value={settleNote} onChange={setSettleNote} />
          </Fld>
          <PBtn label="Confirm Settlement" onClick={() => {
            onSettle(settleSheet.txId, settleNote);
            setSettleSheet(null);
            setLendModal(null);
          }} />
        </Sheet>
      )}
    </div>
  );
}

// ─── Expense Form Sheet ───────────────────────────────────────────────────────
function ExpenseSheet({ expense, accounts, onSave, onClose, customCats = [] }) {
  const isEdit  = !!expense;
  const fileRef = useRef();
  const allCats = [...CATS, ...customCats];

  const [title, setTitle] = useState(expense?.title || "");
  const [cat,   setCat]   = useState(expense?.category || "mess");
  const [amt,   setAmt]   = useState(expense ? String(expense.amount) : "");
  const [acc,   setAcc]   = useState(expense?.accountId || "SBI");
  const [mode,  setMode]  = useState(expense?.paymentMode || "UPI");
  const [date,  setDate]  = useState(expense?.date || today0());
  const [note,  setNote]  = useState(expense?.note || "");
  const [tags,  setTags]  = useState(expense?.tags?.join(", ") || "");
  const [photo, setPhoto] = useState(expense?.photo || null);

  const accOpts = accounts.map(a => ({ value: a.id, label: `${a.name} — ${a.fullName}` }));
  const catOpts = CATS.map(c => ({ value: c.id, label: `${c.emoji} ${c.label}` }));
  const modeOpts = PMODES.map(m => ({ value: m, label: m }));

  function handlePhoto(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => setPhoto(ev.target.result);
    r.readAsDataURL(f);
  }

  function save() {
    if (!title.trim() || !amt || parseFloat(amt) <= 0) return;
    onSave({
      id: expense?.id || Date.now(),
      title: title.trim(),
      category: cat,
      amount: parseFloat(amt),
      accountId: acc,
      paymentMode: mode,
      date,
      note,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      photo,
    });
  }

  const valid = title.trim() && amt && parseFloat(amt) > 0;
  const selectedCat = getCat(cat, customCats);

  return (
    <Sheet title={isEdit ? "Edit Expense" : "Add Expense"} onClose={onClose} tall>
      {/* Category quick-select strip */}
      <div style={{ marginBottom: 14 }}>
        <p style={{ margin: "0 0 8px", fontSize: 12, color: T.textSec, fontWeight: 500 }}>Category</p>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
          {allCats.map(c => (
            <button key={c.id} onClick={() => setCat(c.id)} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "8px 10px", borderRadius: 12, border: `1.5px solid ${cat === c.id ? c.color : T.border}`, background: cat === c.id ? c.color + "20" : T.card, cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>{c.emoji}</span>
              <span style={{ fontSize: 9, color: cat === c.id ? c.color : T.textMuted, fontWeight: cat === c.id ? 700 : 400, whiteSpace: "nowrap" }}>{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected category indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, background: selectedCat.color + "15", border: `1px solid ${selectedCat.color}33`, borderRadius: 10, padding: "8px 12px", marginBottom: 14 }}>
        <span style={{ fontSize: 16 }}>{selectedCat.emoji}</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: selectedCat.color }}>{selectedCat.label}</span>
      </div>

      <Fld label="Title"><Inp placeholder="What did you spend on?" value={title} onChange={setTitle} /></Fld>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Fld label="Amount (₹)"><Inp type="number" placeholder="0" value={amt} onChange={setAmt} pre="₹" /></Fld>
        <Fld label="Date"><Inp type="date" value={date} onChange={setDate} /></Fld>
      </div>

      <Fld label="Account"><Sel value={acc} onChange={setAcc} options={accOpts} /></Fld>

      {/* Payment mode toggle */}
      <Fld label="Payment Mode">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {PMODES.map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ padding: "11px 0", borderRadius: 12, border: `1.5px solid ${mode === m ? T.accent : T.border}`, background: mode === m ? T.accentDim : T.card, cursor: "pointer", fontSize: 13, fontWeight: mode === m ? 700 : 400, color: mode === m ? T.accent : T.textSec, fontFamily: "inherit" }}>
              {m === "Cash" ? "💵" : m === "UPI" ? "📲" : "💳"} {m}
            </button>
          ))}
        </div>
      </Fld>

      <Fld label="Note (optional)"><Inp placeholder="Add a note…" value={note} onChange={setNote} rows={2} /></Fld>
      <Fld label="Tags (comma separated)"><Inp placeholder="work, weekend, outing" value={tags} onChange={setTags} /></Fld>

      {/* Photo */}
      <Fld label="Receipt / Photo">
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => fileRef.current.click()} style={{ display: "flex", alignItems: "center", gap: 7, background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: "9px 14px", cursor: "pointer", color: T.textSec, fontSize: 13, fontFamily: "inherit" }}>
            <Camera size={14} color={T.textSec} />{photo ? "Change Photo" : "Attach Photo"}
          </button>
          {photo && (
            <button onClick={() => setPhoto(null)} style={{ background: T.dangerDim, border: `1px solid ${T.danger}44`, borderRadius: 10, padding: "9px 12px", cursor: "pointer", color: T.danger, fontSize: 12, fontFamily: "inherit" }}>
              Remove
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
        </div>
        {photo && <img src={photo} alt="receipt" style={{ width: "100%", borderRadius: 12, marginTop: 10, maxHeight: 160, objectFit: "cover" }} />}
      </Fld>

      <PBtn label={isEdit ? "Save Changes" : "Add Expense"} onClick={save} disabled={!valid} />
    </Sheet>
  );
}

// ─── Expenses Screen ──────────────────────────────────────────────────────────
function ExpensesScreen({ expenses, accounts, onAdd, onEdit, onDelete, customCats = [] }) {
  const [showAdd,   setShowAdd]   = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [showFilt,  setShowFilt]  = useState(false);
  const [fCat,      setFCat]      = useState("all");
  const [fAcc,      setFAcc]      = useState("all");
  const [fMode,     setFMode]     = useState("all");

  const ym       = thisYM();
  const monthAmt = expenses.filter(e => e.date.startsWith(ym)).reduce((s, e) => s + e.amount, 0);
  const hasFilter = fCat !== "all" || fAcc !== "all" || fMode !== "all";

  const filtered = expenses.filter(e => {
    if (fCat  !== "all" && e.category    !== fCat)  return false;
    if (fAcc  !== "all" && e.accountId   !== fAcc)  return false;
    if (fMode !== "all" && e.paymentMode !== fMode) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  // Group by date
  const grouped = filtered.reduce((acc, e) => { (acc[e.date] = acc[e.date] || []).push(e); return acc; }, {});
  const dates   = Object.keys(grouped).sort((a, b) => b.localeCompare(a));
  const td      = today0();
  const yest    = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  function dateLabel(d) {
    if (d === td)   return "Today";
    if (d === yest) return "Yesterday";
    return fmtD(d);
  }

  return (
    <>
      <div style={{ padding: "0 16px 100px" }}>
        {/* Month summary + filter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 14 }}>
          <div>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: T.textSec }}>SPENT THIS MONTH</p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.danger }}>{fmt(monthAmt)}</p>
          </div>
          <button onClick={() => setShowFilt(true)} style={{ background: hasFilter ? T.accentDim : T.surface, border: `1.5px solid ${hasFilter ? T.accent : T.border}`, borderRadius: 12, width: 42, height: 42, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Filter size={16} color={hasFilter ? T.accent : T.textSec} />
          </button>
        </div>

        {hasFilter && (
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
            {fCat  !== "all" && <Pill label={`Cat: ${getCat(fCat).label}`} color={T.accent} />}
            {fAcc  !== "all" && <Pill label={`Acc: ${fAcc}`}              color={T.warning} />}
            {fMode !== "all" && <Pill label={`Mode: ${fMode}`}            color={T.purple}  />}
            <button onClick={() => { setFCat("all"); setFAcc("all"); setFMode("all"); }} style={{ background: T.dangerDim, border: `1px solid ${T.danger}33`, borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontSize: 11, color: T.danger, fontFamily: "inherit" }}>Clear</button>
          </div>
        )}

        {filtered.length === 0 && <Empty icon={Receipt} title="No expenses" desc="Tap + to add your first expense" color={T.danger} />}

        {dates.map(date => {
          const dayTotal = grouped[date].reduce((s, e) => s + e.amount, 0);
          return (
            <div key={date} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: T.textSec, letterSpacing: "0.04em" }}>{dateLabel(date)}</p>
                <p style={{ margin: 0, fontSize: 12, color: T.danger, fontWeight: 600 }}>-{fmt(dayTotal)}</p>
              </div>
              {grouped[date].map(e => {
                const cat = getCat(e.category);
                return (
                  <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                      <div style={{ width: 42, height: 42, borderRadius: 13, background: cat.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{cat.emoji}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.title}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, flexWrap: "wrap", marginTop: 3 }}>
                          <Pill label={e.paymentMode} color={T.textSec} />
                          <span style={{ fontSize: 11, color: AC[e.accountId].a, fontWeight: 600 }}>{e.accountId}</span>
                          {e.tags.slice(0, 2).map(tg => <Pill key={tg} label={tg} color={T.purple} />)}
                        </div>
                        {e.note ? <p style={{ margin: "3px 0 0", fontSize: 11, color: T.textMuted }}>{e.note}</p> : null}
                        {e.photo && <p style={{ margin: "2px 0 0", fontSize: 10, color: T.accentText }}>📎 Receipt attached</p>}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, marginLeft: 8, flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.danger }}>-{fmt(e.amount)}</p>
                      <div style={{ display: "flex", gap: 5 }}>
                        <button onClick={() => setEditItem(e)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <Edit2 size={11} color={T.textSec} />
                        </button>
                        <button onClick={() => onDelete(e.id)} style={{ background: T.dangerDim, border: `1px solid ${T.danger}33`, borderRadius: 7, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <Trash2 size={11} color={T.danger} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* FAB */}
      <button onClick={() => setShowAdd(true)} style={{ position: "fixed", bottom: 90, right: 20, width: 54, height: 54, borderRadius: "50%", background: T.accent, border: "none", boxShadow: `0 4px 20px ${T.accent}55`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 150 }}>
        <Plus size={24} color="#0B1A14" strokeWidth={2.5} />
      </button>

      {/* Add Sheet */}
      {showAdd && (
        <ExpenseSheet accounts={accounts} customCats={customCats} onSave={e => { onAdd(e); setShowAdd(false); }} onClose={() => setShowAdd(false)} />
      )}

      {/* Edit Sheet */}
      {editItem && (
        <ExpenseSheet expense={editItem} accounts={accounts} customCats={customCats} onSave={e => { onEdit(e); setEditItem(null); }} onClose={() => setEditItem(null)} />
      )}

      {/* Filter Sheet */}
      {showFilt && (
        <Sheet title="Filter Expenses" onClose={() => setShowFilt(false)}>
          <Fld label="Category">
            <Sel value={fCat} onChange={setFCat} options={[{ value: "all", label: "All Categories" }, ...CATS.map(c => ({ value: c.id, label: `${c.emoji} ${c.label}` }))]} />
          </Fld>
          <Fld label="Account">
            <Sel value={fAcc} onChange={setFAcc} options={[{ value: "all", label: "All Accounts" }, ...["SBI","HDFC","KOTAK"].map(a => ({ value: a, label: a }))]} />
          </Fld>
          <Fld label="Payment Mode">
            <Sel value={fMode} onChange={setFMode} options={[{ value: "all", label: "All Modes" }, ...PMODES.map(m => ({ value: m, label: m }))]} />
          </Fld>
          <PBtn label="Apply Filters" onClick={() => setShowFilt(false)} />
          {hasFilter && (
            <button onClick={() => { setFCat("all"); setFAcc("all"); setFMode("all"); setShowFilt(false); }} style={{ width: "100%", background: "none", border: `1px solid ${T.border}`, borderRadius: 14, height: 46, fontSize: 14, color: T.textSec, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>
              Clear All Filters
            </button>
          )}
        </Sheet>
      )}
    </>
  );
}

// ─── Accounts Screen ──────────────────────────────────────────────────────────
function AccountDetail({ account, transactions, onAddIncome, onTransfer }) {
  const [hide, setHide] = useState(false);
  const ac   = AC[account.id];
  const txs  = transactions.filter(t => t.accountId === account.id).sort((a, b) => b.date.localeCompare(a.date));
  const inAmt  = txs.filter(t => t.type === "income"  ).reduce((s, t) => s + t.amount, 0);
  const outAmt = txs.filter(t => t.type !== "income"  ).reduce((s, t) => s + t.amount, 0);

  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ background: ac.d, border: `1px solid ${ac.a}40`, borderRadius: 22, padding: 20, marginBottom: 16, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: ac.a, opacity: 0.07 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: 12, color: T.textSec }}>{account.fullName}</p>
            <p style={{ margin: 0, fontSize: 30, fontWeight: 700, color: T.text, letterSpacing: "-0.5px" }}>{hide ? "₹ ••••••" : `₹${account.balance.toLocaleString("en-IN")}`}</p>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: T.textMuted }}>Current Balance</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <div style={{ background: ac.a + "25", border: `1px solid ${ac.a}55`, borderRadius: 10, padding: "4px 14px" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: ac.a }}>{account.name}</span>
            </div>
            <button onClick={() => setHide(h => !h)} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {hide ? <Eye size={13} color={T.textSec} /> : <EyeOff size={13} color={T.textSec} />}
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
          <div style={{ background: "rgba(61,217,175,0.08)", borderRadius: 12, padding: "10px 12px" }}>
            <p style={{ margin: "0 0 2px", fontSize: 10, color: T.textMuted }}>TOTAL IN</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.success }}>+{fmt(inAmt)}</p>
          </div>
          <div style={{ background: "rgba(255,107,122,0.08)", borderRadius: 12, padding: "10px 12px" }}>
            <p style={{ margin: "0 0 2px", fontSize: 10, color: T.textMuted }}>TOTAL OUT</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.danger }}>-{fmt(outAmt)}</p>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[{ label: "Add Income", Icon: ArrowDownLeft, color: T.success, fn: onAddIncome }, { label: "Transfer", Icon: ArrowRightLeft, color: T.purple, fn: onTransfer }].map(b => (
          <button key={b.label} onClick={b.fn} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: b.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}><b.Icon size={16} color={b.color} /></div>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{b.label}</span>
          </button>
        ))}
      </div>

      <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600, color: T.text }}>Transaction History</p>
      {txs.length === 0 && <p style={{ color: T.textMuted, fontSize: 13, textAlign: "center", padding: "24px 0" }}>No transactions yet</p>}
      {txs.map(tx => {
        const { Icon, color } = txIcon(tx.type);
        return (
          <div key={tx.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={16} color={color} /></div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: T.text }}>{tx.title}</p>
                <div style={{ display: "flex", gap: 6, marginTop: 2, alignItems: "center" }}>
                  <Pill label={tx.type.toUpperCase()} color={color} />
                  <span style={{ fontSize: 11, color: T.textMuted }}>{fmtD(tx.date)}</span>
                </div>
                {tx.note ? <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textMuted }}>{tx.note}</p> : null}
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color }}>{tx.type !== "income" ? "-" : "+"}{fmt(tx.amount)}</p>
          </div>
        );
      })}
    </div>
  );
}

function AccountsScreen({ accounts, transactions, onUpdate, detail, onSelectDetail }) {
  const [modal,  setModal]  = useState(null);
  const [inAcc,  setInAcc]  = useState("SBI");
  const [inAmt,  setInAmt]  = useState("");
  const [inNote, setInNote] = useState("");
  const [inDate, setInDate] = useState(today0());
  const [frAcc,  setFrAcc]  = useState("SBI");
  const [toAcc,  setToAcc]  = useState("HDFC");
  const [trAmt,  setTrAmt]  = useState("");
  const [trNote, setTrNote] = useState("");
  const [trDate, setTrDate] = useState(today0());

  const accOpts = accounts.map(a => ({ value: a.id, label: `${a.name} — ${a.fullName}` }));
  const total   = accounts.reduce((s, a) => s + a.balance, 0);
  const detAcc  = detail ? accounts.find(a => a.id === detail) : null;

  function doIncome() {
    const a = parseFloat(inAmt); if (!a) return;
    onUpdate({ type: "income", accountId: inAcc, amount: a, note: inNote, date: inDate, title: inNote || "Income" });
    setInAmt(""); setInNote(""); setModal(null);
  }
  function doTransfer() {
    const a = parseFloat(trAmt); if (!a || frAcc === toAcc) return;
    onUpdate({ type: "transfer", fromAccountId: frAcc, toAccountId: toAcc, amount: a, note: trNote, date: trDate });
    setTrAmt(""); setTrNote(""); setModal(null);
  }

  return (
    <>
      {detail ? (
        <AccountDetail account={detAcc} transactions={transactions} onAddIncome={() => { setInAcc(detail); setModal("income"); }} onTransfer={() => setModal("transfer")} />
      ) : (
        <div style={{ padding: "0 16px 100px" }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 20, padding: "18px 20px", marginBottom: 18 }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: T.textSec, letterSpacing: "0.07em" }}>NET WORTH</p>
            <p style={{ margin: "0 0 3px", fontSize: 30, fontWeight: 700, color: T.text }}>₹{total.toLocaleString("en-IN")}</p>
            <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>SBI · HDFC · KOTAK</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
            <button onClick={() => setModal("income")} style={{ background: T.successDim, border: `1px solid ${T.success}33`, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: T.success + "20", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowDownLeft size={18} color={T.success} /></div>
              <div style={{ textAlign: "left" }}><p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.success }}>Add Income</p><p style={{ margin: 0, fontSize: 10, color: T.textMuted }}>Credit any account</p></div>
            </button>
            <button onClick={() => setModal("transfer")} style={{ background: T.purpleDim, border: `1px solid ${T.purple}33`, borderRadius: 14, padding: 14, display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: T.purple + "20", display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowRightLeft size={18} color={T.purple} /></div>
              <div style={{ textAlign: "left" }}><p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.purple }}>Transfer</p><p style={{ margin: 0, fontSize: 10, color: T.textMuted }}>Between accounts</p></div>
            </button>
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: T.text }}>Your Accounts</p>
          {accounts.map(acc => {
            const ac   = AC[acc.id];
            const txs  = transactions.filter(t => t.accountId === acc.id);
            const mIn  = txs.filter(t => t.type === "income" ).reduce((s, t) => s + t.amount, 0);
            const mOut = txs.filter(t => t.type !== "income" ).reduce((s, t) => s + t.amount, 0);
            return (
              <div key={acc.id} onClick={() => onSelectDetail(acc.id)} style={{ background: ac.d, border: `1px solid ${ac.a}35`, borderRadius: 20, padding: 18, marginBottom: 12, cursor: "pointer", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", bottom: -35, right: -35, width: 110, height: 110, borderRadius: "50%", background: ac.a, opacity: 0.07 }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                  <div><p style={{ margin: "0 0 2px", fontSize: 11, color: T.textSec }}>{acc.fullName}</p><p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: T.text }}>₹{acc.balance.toLocaleString("en-IN")}</p></div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                    <div style={{ background: ac.a + "25", border: `1px solid ${ac.a}50`, borderRadius: 9, padding: "3px 12px" }}><span style={{ fontSize: 13, fontWeight: 700, color: ac.a }}>{acc.name}</span></div>
                    <ChevronRight size={14} color={T.textMuted} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "rgba(61,217,175,0.07)", borderRadius: 10, padding: "8px 10px" }}><p style={{ margin: "0 0 1px", fontSize: 10, color: T.textMuted }}>CREDITED</p><p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.success }}>+₹{mIn.toLocaleString("en-IN")}</p></div>
                  <div style={{ background: "rgba(255,107,122,0.07)", borderRadius: 10, padding: "8px 10px" }}><p style={{ margin: "0 0 1px", fontSize: 10, color: T.textMuted }}>DEBITED</p><p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: T.danger }}>-₹{mOut.toLocaleString("en-IN")}</p></div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal === "income" && (
        <Sheet title="Add Income / Credit" onClose={() => setModal(null)}>
          <Fld label="Account"><Sel value={inAcc} onChange={setInAcc} options={accOpts} /></Fld>
          <Fld label="Amount (₹)"><Inp type="number" placeholder="Enter amount" value={inAmt} onChange={setInAmt} pre="₹" /></Fld>
          <Fld label="Date"><Inp type="date" value={inDate} onChange={setInDate} /></Fld>
          <Fld label="Note (optional)"><Inp placeholder="Salary, freelance, cashback…" value={inNote} onChange={setInNote} /></Fld>
          <PBtn label="Add Income" onClick={doIncome} disabled={!inAmt || parseFloat(inAmt) <= 0} />
        </Sheet>
      )}
      {modal === "transfer" && (
        <Sheet title="Transfer Between Accounts" onClose={() => setModal(null)}>
          <Fld label="From"><Sel value={frAcc} onChange={setFrAcc} options={accOpts} /></Fld>
          <Fld label="To"><Sel value={toAcc} onChange={v => v !== frAcc && setToAcc(v)} options={accOpts.filter(o => o.value !== frAcc)} /></Fld>
          <Fld label="Amount (₹)"><Inp type="number" placeholder="Enter amount" value={trAmt} onChange={setTrAmt} pre="₹" /></Fld>
          <Fld label="Date"><Inp type="date" value={trDate} onChange={setTrDate} /></Fld>
          <Fld label="Note (optional)"><Inp placeholder="Reason" value={trNote} onChange={setTrNote} /></Fld>
          {frAcc === toAcc && <p style={{ color: T.danger, fontSize: 12, margin: "0 0 6px" }}>Source and destination must differ.</p>}
          <PBtn label="Transfer Money" onClick={doTransfer} disabled={!trAmt || parseFloat(trAmt) <= 0 || frAcc === toAcc} />
        </Sheet>
      )}
    </>
  );
}

// ─── Placeholder ──────────────────────────────────────────────────────────────
function Placeholder({ icon: Icon, title, desc, color }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12, padding: "0 40px", textAlign: "center" }}>
      <div style={{ width: 72, height: 72, borderRadius: 24, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
        <Icon size={32} color={color} />
      </div>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: T.text }}>{title}</p>
      <p style={{ margin: 0, fontSize: 13, color: T.textSec, lineHeight: 1.6 }}>{desc}</p>
      <div style={{ marginTop: 8, padding: "8px 20px", borderRadius: 10, background: T.accentDim, border: `1px solid ${T.accent}33` }}>
        <p style={{ margin: 0, fontSize: 12, color: T.accentText }}>Coming in next steps</p>
      </div>
    </div>
  );
}

// ─── Lending Screen ───────────────────────────────────────────────────────────
function LendingScreen({ people, lending, onAddPerson, onAddTx, onSettle, onDeletePerson, detail, onSelectDetail }) {
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showAddTx,     setShowAddTx]     = useState(false);
  const [newName,       setNewName]       = useState("");
  const [txType,        setTxType]        = useState("gave");
  const [txAmt,         setTxAmt]         = useState("");
  const [txNote,        setTxNote]        = useState("");
  const [txDue,         setTxDue]         = useState("");
  const [txDate,        setTxDate]        = useState(today0());
  const [showSettle,    setShowSettle]    = useState(null); // tx id being settled
  const [settleNote,    setSettleNote]    = useState("");

  // Net balance for a person: positive = they owe you, negative = you owe them
  function net(pid) {
    const txs  = lending.filter(t => t.personId === pid && !t.settled);
    const gave = txs.filter(t => t.type === "gave"    ).reduce((s, t) => s + t.amount, 0);
    const recv = txs.filter(t => t.type === "received").reduce((s, t) => s + t.amount, 0);
    return gave - recv;
  }

  const totalReceive = people.reduce((s, p) => { const n = net(p.id); return n > 0 ? s + n : s; }, 0);
  const totalOwe     = people.reduce((s, p) => { const n = net(p.id); return n < 0 ? s + Math.abs(n) : s; }, 0);

  const detailPerson = detail ? people.find(p => p.id === detail) : null;
  const detailTxs    = detail ? [...lending.filter(t => t.personId === detail)].sort((a, b) => b.date.localeCompare(a.date)) : [];
  const netBal       = detail ? net(detail) : 0;

  // ── Detail view ─────────────────────────────────────────────────────────────
  if (detail && detailPerson) {
    const totalGave = detailTxs.filter(t => t.type === "gave").reduce((s, t) => s + t.amount, 0);
    const totalRecv = detailTxs.filter(t => t.type === "received").reduce((s, t) => s + t.amount, 0);

    return (
      <>
        <div style={{ padding: "0 16px 100px" }}>

          {/* Person Hero Card */}
          <div style={{ background: T.purpleDim, border: `1px solid ${T.purple}33`, borderRadius: 20, padding: 20, marginBottom: 14, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, right: -30, width: 120, height: 120, borderRadius: "50%", background: T.purple, opacity: 0.06 }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 50, height: 50, borderRadius: 16, background: T.purple + "25", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <User size={24} color={T.purple} />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.text }}>{detailPerson.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>{detailTxs.length} transaction{detailTxs.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0 0 2px", fontSize: 10, color: T.textSec, letterSpacing: "0.06em" }}>
                  {netBal > 0 ? "WILL RECEIVE" : netBal < 0 ? "YOU OWE" : "ALL CLEAR"}
                </p>
                <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: netBal > 0 ? T.success : netBal < 0 ? T.danger : T.textMuted }}>
                  {netBal !== 0 ? fmt(Math.abs(netBal)) : "₹0"}
                </p>
              </div>
            </div>

            {/* Mini stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div style={{ background: "rgba(255,107,122,0.08)", borderRadius: 12, padding: "10px 12px" }}>
                <p style={{ margin: "0 0 2px", fontSize: 10, color: T.textMuted }}>TOTAL GAVE</p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.danger }}>{fmt(totalGave)}</p>
              </div>
              <div style={{ background: "rgba(61,217,175,0.08)", borderRadius: 12, padding: "10px 12px" }}>
                <p style={{ margin: "0 0 2px", fontSize: 10, color: T.textMuted }}>TOTAL RECEIVED</p>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.success }}>{fmt(totalRecv)}</p>
              </div>
            </div>
          </div>

          {/* Add Transaction button */}
          <button onClick={() => setShowAddTx(true)} style={{ width: "100%", background: T.accentDim, border: `1px solid ${T.accent}44`, borderRadius: 14, padding: "13px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", marginBottom: 18 }}>
            <Plus size={16} color={T.accent} />
            <span style={{ fontSize: 14, fontWeight: 600, color: T.accent }}>Add Transaction</span>
          </button>

          {/* Transaction history */}
          <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 600, color: T.text }}>Transaction History</p>
          {detailTxs.length === 0 && (
            <Empty icon={Users} title="No transactions yet" desc="Tap above to add a gave / received entry" color={T.purple} />
          )}

          {detailTxs.map(tx => {
            const isGave   = tx.type === "gave";
            const color    = isGave ? T.danger : T.success;
            const Icon     = isGave ? ArrowUpRight : ArrowDownLeft;
            const overdue  = tx.dueDate && !tx.settled && tx.dueDate < today0();

            return (
              <div key={tx.id} style={{ background: T.card, border: `1px solid ${tx.settled ? T.borderSoft : T.border}`, borderRadius: 16, padding: "14px", marginBottom: 10, opacity: tx.settled ? 0.6 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 12, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Icon size={17} color={color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color }}>
                        {isGave ? "You gave" : "You received"}
                      </p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textMuted }}>
                        {fmtD(tx.date)}
                      </p>
                      {tx.note ? (
                        <p style={{ margin: "4px 0 0", fontSize: 12, color: T.textSec }}>📝 {tx.note}</p>
                      ) : null}
                      {tx.dueDate && !tx.settled ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
                          <Calendar size={11} color={overdue ? T.danger : T.warning} />
                          <p style={{ margin: 0, fontSize: 11, color: overdue ? T.danger : T.warning, fontWeight: overdue ? 700 : 400 }}>
                            {overdue ? "Overdue · " : "Due · "}{fmtD(tx.dueDate)}
                          </p>
                        </div>
                      ) : null}
                      {tx.settled && tx.settlementNote ? (
                        <p style={{ margin: "4px 0 0", fontSize: 11, color: T.success }}>✓ {tx.settlementNote}</p>
                      ) : null}
                    </div>
                  </div>

                  {/* Amount + settle */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0, marginLeft: 8 }}>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color }}>{fmt(tx.amount)}</p>
                    {tx.settled ? (
                      <Pill label="SETTLED" color={T.success} />
                    ) : (
                      <button onClick={() => { setShowSettle(tx.id); setSettleNote(""); }} style={{ background: T.successDim, border: `1px solid ${T.success}44`, borderRadius: 8, padding: "5px 11px", cursor: "pointer", fontSize: 11, fontWeight: 700, color: T.success, fontFamily: "inherit", display: "flex", alignItems: "center", gap: 4 }}>
                        <Check size={11} color={T.success} /> Settle
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Transaction Sheet */}
        {showAddTx && (
          <Sheet title={`Add Transaction — ${detailPerson.name}`} onClose={() => setShowAddTx(false)}>
            {/* Type toggle */}
            <Fld label="Type">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { val: "gave",     label: "💸 I Gave",     color: T.danger,  dim: T.dangerDim  },
                  { val: "received", label: "💰 I Received", color: T.success, dim: T.successDim },
                ].map(tp => (
                  <button key={tp.val} onClick={() => setTxType(tp.val)} style={{ padding: "13px", borderRadius: 12, border: `1.5px solid ${txType === tp.val ? tp.color : T.border}`, background: txType === tp.val ? tp.dim : T.card, cursor: "pointer", fontSize: 13, fontWeight: txType === tp.val ? 700 : 400, color: txType === tp.val ? tp.color : T.textSec, fontFamily: "inherit" }}>
                    {tp.label}
                  </button>
                ))}
              </div>
            </Fld>
            <Fld label="Amount (₹)"><Inp type="number" placeholder="0" value={txAmt} onChange={setTxAmt} pre="₹" /></Fld>
            <Fld label="Date"><Inp type="date" value={txDate} onChange={setTxDate} /></Fld>
            <Fld label="Note"><Inp placeholder="Lunch split, train ticket, emergency…" value={txNote} onChange={setTxNote} /></Fld>
            <Fld label="Due Date (optional)"><Inp type="date" value={txDue} onChange={setTxDue} /></Fld>
            <PBtn label="Add Transaction" disabled={!txAmt || parseFloat(txAmt) <= 0} onClick={() => {
              onAddTx({ id: Date.now(), personId: detail, type: txType, amount: parseFloat(txAmt), date: txDate, note: txNote, dueDate: txDue || null, settled: false, settlementNote: "" });
              setTxAmt(""); setTxNote(""); setTxDue(""); setShowAddTx(false);
            }} />
          </Sheet>
        )}

        {/* Settle Sheet */}
        {showSettle && (
          <Sheet title="Mark as Settled" onClose={() => setShowSettle(null)}>
            <p style={{ margin: "0 0 14px", fontSize: 13, color: T.textSec }}>Add an optional note about how it was settled (e.g. "Paid via GPay", "Cash returned").</p>
            <Fld label="Settlement Note (optional)"><Inp placeholder="Paid via GPay, cash, UPI…" value={settleNote} onChange={setSettleNote} /></Fld>
            <PBtn label="Mark Settled" onClick={() => { onSettle(showSettle, settleNote); setShowSettle(null); }} />
          </Sheet>
        )}
      </>
    );
  }

  // ── People list view ─────────────────────────────────────────────────────────
  return (
    <>
      <div style={{ padding: "0 16px 100px" }}>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
          <div style={{ background: T.successDim, border: `1px solid ${T.success}33`, borderRadius: 16, padding: 14 }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: T.textSec }}>TO RECEIVE</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.success }}>{fmt(totalReceive)}</p>
          </div>
          <div style={{ background: T.dangerDim, border: `1px solid ${T.danger}33`, borderRadius: 16, padding: 14 }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, color: T.textSec }}>YOU OWE</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.danger }}>{fmt(totalOwe)}</p>
          </div>
        </div>

        {/* People list */}
        {people.length === 0 && (
          <Empty icon={Users} title="No people added" desc="Tap 'Add Person' below to start tracking money" color={T.purple} />
        )}

        {people.map(p => {
          const n   = net(p.id);
          const cnt = lending.filter(t => t.personId === p.id).length;
          const unsettled = lending.filter(t => t.personId === p.id && !t.settled).length;
          const overdue   = lending.some(t => t.personId === p.id && !t.settled && t.dueDate && t.dueDate < today0());

          return (
            <div key={p.id} onClick={() => onSelectDetail(p.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: T.card, border: `1.5px solid ${overdue ? T.danger + "55" : T.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10, cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 15, background: T.purple + "22", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <User size={22} color={T.purple} />
                  {overdue && (
                    <div style={{ position: "absolute", top: -3, right: -3, width: 12, height: 12, borderRadius: "50%", background: T.danger, border: `2px solid ${T.card}` }} />
                  )}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: T.text }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>
                    {cnt} transaction{cnt !== 1 ? "s" : ""}
                    {unsettled > 0 ? ` · ${unsettled} open` : " · all settled"}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 10, color: T.textSec }}>
                    {n > 0 ? "OWES YOU" : n < 0 ? "YOU OWE" : "CLEAR"}
                  </p>
                  <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: n > 0 ? T.success : n < 0 ? T.danger : T.textMuted }}>
                    {fmt(Math.abs(n))}
                  </p>
                </div>
                <ChevronRight size={15} color={T.textMuted} />
              </div>
            </div>
          );
        })}

        {/* Visible Add Person button */}
        <button
          onClick={() => setShowAddPerson(true)}
          style={{ width: "100%", background: T.purpleDim, border: `1px solid ${T.purple}44`, borderRadius: 14, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", marginTop: 4 }}
        >
          <Plus size={16} color={T.purple} />
          <span style={{ fontSize: 14, fontWeight: 600, color: T.purple }}>Add Person</span>
        </button>
      </div>

      {/* FAB */}
      <button onClick={() => setShowAddPerson(true)} style={{ position: "fixed", bottom: 90, right: 20, width: 54, height: 54, borderRadius: "50%", background: T.accent, border: "none", boxShadow: `0 4px 20px ${T.accent}55`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 150 }}>
        <Plus size={24} color="#0B1A14" strokeWidth={2.5} />
      </button>

      {/* Add Person Sheet */}
      {showAddPerson && (
        <Sheet title="Add Person" onClose={() => setShowAddPerson(false)}>
          <Fld label="Name"><Inp placeholder="e.g. Rahul, Priya, Mom…" value={newName} onChange={setNewName} /></Fld>
          <PBtn label="Add Person" disabled={!newName.trim()} onClick={() => {
            onAddPerson({ id: Date.now(), name: newName.trim() });
            setNewName(""); setShowAddPerson(false);
          }} />
        </Sheet>
      )}
    </>
  );
}

// ─── Search Screen ────────────────────────────────────────────────────────────
function SearchScreen({ expenses, people, lending }) {
  const [query,   setQuery]   = useState("");
  const [tab,     setTab]     = useState("expenses"); // "expenses" | "lending"
  const [fCat,    setFCat]    = useState("all");
  const [fAcc,    setFAcc]    = useState("all");
  const [fMode,   setFMode]   = useState("all");
  const [fFrom,   setFFrom]   = useState("");
  const [fTo,     setFTo]     = useState("");
  const [showFilt,setShowFilt]= useState(false);

  const q = query.toLowerCase().trim();

  // ── Expense search ──────────────────────────────────────────────────────────
  const filteredExp = expenses.filter(e => {
    if (q && !e.title.toLowerCase().includes(q) && !e.note.toLowerCase().includes(q) && !e.tags.join(" ").toLowerCase().includes(q)) return false;
    if (fCat  !== "all" && e.category    !== fCat)  return false;
    if (fAcc  !== "all" && e.accountId   !== fAcc)  return false;
    if (fMode !== "all" && e.paymentMode !== fMode) return false;
    if (fFrom && e.date < fFrom) return false;
    if (fTo   && e.date > fTo)   return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const totalFiltered = filteredExp.reduce((s, e) => s + e.amount, 0);

  // ── Lending search ──────────────────────────────────────────────────────────
  const filteredLend = lending.filter(t => {
    const person = people.find(p => p.id === t.personId);
    if (!person) return false;
    if (q && !person.name.toLowerCase().includes(q) && !t.note.toLowerCase().includes(q)) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const hasFilter = fCat !== "all" || fAcc !== "all" || fMode !== "all" || fFrom || fTo;

  function clearFilters() { setFCat("all"); setFAcc("all"); setFMode("all"); setFFrom(""); setFTo(""); }

  return (
    <>
      <div style={{ padding: "0 16px 100px" }}>

        {/* Search bar */}
        <div style={{ display: "flex", alignItems: "center", background: T.card, border: `1.5px solid ${q ? T.accent : T.border}`, borderRadius: 14, padding: "0 14px", height: 50, gap: 10, marginBottom: 12 }}>
          <Search size={17} color={q ? T.accent : T.textSec} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search transactions, people, notes…"
            autoFocus
            style={{ flex: 1, background: "none", border: "none", outline: "none", color: T.text, fontSize: 15, fontFamily: "inherit" }}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
              <X size={15} color={T.textSec} />
            </button>
          )}
        </div>

        {/* Tab toggle */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 4, marginBottom: 12 }}>
          {[{ id: "expenses", label: "💸 Expenses" }, { id: "lending", label: "🤝 Lending" }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "9px 0", borderRadius: 9, border: "none", background: tab === t.id ? T.accent : "transparent", color: tab === t.id ? "#0B1A14" : T.textSec, fontSize: 13, fontWeight: tab === t.id ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Expense filters row (only on expenses tab) */}
        {tab === "expenses" && (
          <div style={{ display: "flex", gap: 8, marginBottom: 12, alignItems: "center" }}>
            <div style={{ flex: 1, display: "flex", gap: 6, overflowX: "auto" }}>
              {fCat  !== "all" && <Pill label={`${getCat(fCat).emoji} ${getCat(fCat).label}`} color={T.accent} />}
              {fAcc  !== "all" && <Pill label={fAcc}  color={AC[fAcc]?.a || T.warning} />}
              {fMode !== "all" && <Pill label={fMode} color={T.purple} />}
              {fFrom && <Pill label={`From ${fmtD(fFrom)}`} color={T.textSec} />}
              {fTo   && <Pill label={`To ${fmtD(fTo)}`}     color={T.textSec} />}
              {hasFilter && (
                <button onClick={clearFilters} style={{ flexShrink: 0, background: T.dangerDim, border: `1px solid ${T.danger}33`, borderRadius: 6, padding: "2px 9px", cursor: "pointer", fontSize: 11, color: T.danger, fontFamily: "inherit" }}>Clear</button>
              )}
            </div>
            <button onClick={() => setShowFilt(true)} style={{ flexShrink: 0, background: hasFilter ? T.accentDim : T.card, border: `1.5px solid ${hasFilter ? T.accent : T.border}`, borderRadius: 10, width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Filter size={15} color={hasFilter ? T.accent : T.textSec} />
            </button>
          </div>
        )}

        {/* ── Expenses results ──────────────────────────────────────────────── */}
        {tab === "expenses" && (
          <>
            {/* Results count + total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>
                {filteredExp.length} result{filteredExp.length !== 1 ? "s" : ""}
                {q && <span style={{ color: T.accent }}> for "{query}"</span>}
              </p>
              {filteredExp.length > 0 && <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: T.danger }}>-{fmt(totalFiltered)}</p>}
            </div>

            {filteredExp.length === 0 && (
              <Empty icon={Search} title={q ? "No matches" : "Start searching"} desc={q ? "Try different keywords or adjust filters" : "Type anything to find transactions"} color={T.textSec} />
            )}

            {filteredExp.map(e => {
              const cat = getCat(e.category);

              // Highlight matching text
              function highlight(text) {
                if (!q || !text.toLowerCase().includes(q)) return <span style={{ color: T.text }}>{text}</span>;
                const idx = text.toLowerCase().indexOf(q);
                return (
                  <span style={{ color: T.text }}>
                    {text.slice(0, idx)}
                    <span style={{ background: T.accent + "44", color: T.accent, borderRadius: 3, padding: "0 2px" }}>{text.slice(idx, idx + q.length)}</span>
                    {text.slice(idx + q.length)}
                  </span>
                );
              }

              return (
                <div key={e.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1, minWidth: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: cat.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19, flexShrink: 0 }}>{cat.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{highlight(e.title)}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 11, color: T.textMuted }}>{fmtD(e.date)}</span>
                        <Pill label={e.paymentMode} color={T.textSec} />
                        <span style={{ fontSize: 11, color: AC[e.accountId].a, fontWeight: 600 }}>{e.accountId}</span>
                      </div>
                      {e.note ? <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textMuted }}>{highlight(e.note)}</p> : null}
                      {e.tags.length > 0 && (
                        <div style={{ display: "flex", gap: 4, marginTop: 3, flexWrap: "wrap" }}>
                          {e.tags.map(tg => <Pill key={tg} label={tg} color={T.purple} />)}
                        </div>
                      )}
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.danger, marginLeft: 8, flexShrink: 0 }}>-{fmt(e.amount)}</p>
                </div>
              );
            })}
          </>
        )}

        {/* ── Lending results ───────────────────────────────────────────────── */}
        {tab === "lending" && (
          <>
            <div style={{ marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>
                {filteredLend.length} result{filteredLend.length !== 1 ? "s" : ""}
                {q && <span style={{ color: T.accent }}> for "{query}"</span>}
              </p>
            </div>

            {filteredLend.length === 0 && (
              <Empty icon={Users} title={q ? "No matches" : "Start searching"} desc={q ? "Try a person's name or note" : "Type a name or note to find lending entries"} color={T.purple} />
            )}

            {filteredLend.map(tx => {
              const person  = people.find(p => p.id === tx.personId);
              const isGave  = tx.type === "gave";
              const color   = isGave ? T.danger : T.success;
              const Icon    = isGave ? ArrowUpRight : ArrowDownLeft;
              return (
                <div key={tx.id} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, padding: "12px 14px", marginBottom: 8, opacity: tx.settled ? 0.55 : 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: color + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={17} color={color} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: T.text }}>{person?.name}</p>
                        <p style={{ margin: 0, fontSize: 11, color }}>You {isGave ? "gave" : "received"}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textMuted }}>{fmtD(tx.date)}{tx.dueDate ? ` · Due ${fmtD(tx.dueDate)}` : ""}</p>
                        {tx.note ? <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textSec }}>📝 {tx.note}</p> : null}
                        {tx.settled && <Pill label="SETTLED" color={T.success} />}
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color, marginLeft: 8, flexShrink: 0 }}>{fmt(tx.amount)}</p>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {/* Filter Sheet (expenses only) */}
      {showFilt && (
        <Sheet title="Filter Expenses" onClose={() => setShowFilt(false)}>
          <Fld label="Category">
            <Sel value={fCat} onChange={setFCat} options={[{ value: "all", label: "All Categories" }, ...CATS.map(c => ({ value: c.id, label: `${c.emoji} ${c.label}` }))]} />
          </Fld>
          <Fld label="Account">
            <Sel value={fAcc} onChange={setFAcc} options={[{ value: "all", label: "All Accounts" }, ...["SBI","HDFC","KOTAK"].map(a => ({ value: a, label: a }))]} />
          </Fld>
          <Fld label="Payment Mode">
            <Sel value={fMode} onChange={setFMode} options={[{ value: "all", label: "All Modes" }, ...PMODES.map(m => ({ value: m, label: m }))]} />
          </Fld>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Fld label="From Date"><Inp type="date" value={fFrom} onChange={setFFrom} /></Fld>
            <Fld label="To Date"><Inp type="date" value={fTo} onChange={setFTo} /></Fld>
          </div>
          <PBtn label="Apply Filters" onClick={() => setShowFilt(false)} />
          {hasFilter && (
            <button onClick={() => { clearFilters(); setShowFilt(false); }} style={{ width: "100%", background: "none", border: `1px solid ${T.border}`, borderRadius: 14, height: 46, fontSize: 14, color: T.textSec, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>
              Clear All Filters
            </button>
          )}
        </Sheet>
      )}
    </>
  );
}

// ─── Budgets Screen ───────────────────────────────────────────────────────────
function BudgetsScreen({ budgets, expenses, onAdd, onEdit, onDelete }) {
  const ym = thisYM();
  const [showAdd,  setShowAdd]  = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [bCat,     setBCat]     = useState("");
  const [bLimit,   setBLimit]   = useState("");

  // Categories not yet budgeted
  const usedCats  = budgets.map(b => b.category);
  const availCats = CATS.filter(c => !usedCats.includes(c.id));

  useEffect(() => {
    if (availCats.length && !bCat) setBCat(availCats[0].id);
  }, [availCats.length]);

  function spent(cat) {
    return expenses.filter(e => e.date.startsWith(ym) && e.category === cat).reduce((s, e) => s + e.amount, 0);
  }

  function statusColor(pct) {
    if (pct >= 1)   return T.danger;
    if (pct >= 0.8) return T.warning;
    return T.success;
  }

  function resetForm() { setBLimit(""); if (availCats.length) setBCat(availCats[0].id); }

  const sorted = [...budgets].sort((a, b) => {
    const pa = spent(a.category) / a.limit;
    const pb = spent(b.category) / b.limit;
    return pb - pa; // show most-spent-% first
  });

  const totalBudget  = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent   = budgets.reduce((s, b) => s + spent(b.category), 0);
  const overCount    = budgets.filter(b => spent(b.category) >= b.limit).length;
  const warnCount    = budgets.filter(b => { const p = spent(b.category)/b.limit; return p >= 0.8 && p < 1; }).length;

  return (
    <>
      <div style={{ padding: "0 16px 100px" }}>

        {/* Summary header */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: "16px 18px", marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div>
              <p style={{ margin: "0 0 3px", fontSize: 11, color: T.textSec, letterSpacing: "0.07em" }}>TOTAL BUDGETED</p>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: T.text }}>{fmt(totalBudget)}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0 0 3px", fontSize: 11, color: T.textSec }}>SPENT SO FAR</p>
              <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: totalSpent > totalBudget ? T.danger : T.warning }}>{fmt(totalSpent)}</p>
            </div>
          </div>
          {/* Overall progress bar */}
          <div style={{ background: T.border, borderRadius: 8, height: 10, marginBottom: 8 }}>
            <div style={{ width: `${Math.min(totalSpent / totalBudget, 1) * 100}%`, height: "100%", background: statusColor(totalSpent / totalBudget), borderRadius: 8, transition: "width 0.4s" }} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {overCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.dangerDim, border: `1px solid ${T.danger}33`, borderRadius: 8, padding: "4px 10px" }}>
                <Bell size={11} color={T.danger} />
                <span style={{ fontSize: 11, color: T.danger, fontWeight: 700 }}>{overCount} over limit</span>
              </div>
            )}
            {warnCount > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.warningDim, border: `1px solid ${T.warning}33`, borderRadius: 8, padding: "4px 10px" }}>
                <Bell size={11} color={T.warning} />
                <span style={{ fontSize: 11, color: T.warning, fontWeight: 700 }}>{warnCount} near limit</span>
              </div>
            )}
            {overCount === 0 && warnCount === 0 && budgets.length > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, background: T.successDim, border: `1px solid ${T.success}33`, borderRadius: 8, padding: "4px 10px" }}>
                <Check size={11} color={T.success} />
                <span style={{ fontSize: 11, color: T.success, fontWeight: 700 }}>All within budget</span>
              </div>
            )}
          </div>
        </div>

        {/* Budget cards */}
        {sorted.length === 0 && (
          <Empty icon={Bell} title="No budgets set" desc="Set monthly limits per category to track your spending" color={T.warning} />
        )}

        {sorted.map(b => {
          const sp   = spent(b.category);
          const pct  = sp / b.limit;
          const col  = statusColor(pct);
          const cat  = getCat(b.category);
          const rem  = b.limit - sp;

          return (
            <div key={b.id} style={{ background: T.card, border: `1.5px solid ${pct >= 1 ? T.danger + "66" : pct >= 0.8 ? T.warning + "55" : T.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10 }}>

              {/* Top row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 13, background: cat.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, flexShrink: 0 }}>
                    {cat.emoji}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{cat.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>Limit {fmt(b.limit)} / month</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: col }}>{fmt(sp)}</p>
                    <p style={{ margin: 0, fontSize: 10, color: T.textMuted }}>{Math.round(pct * 100)}% used</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <button onClick={() => { setEditItem(b); setBLimit(String(b.limit)); }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 7, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Edit2 size={11} color={T.textSec} />
                    </button>
                    <button onClick={() => onDelete(b.id)} style={{ background: T.dangerDim, border: `1px solid ${T.danger}33`, borderRadius: 7, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Trash2 size={12} color={T.danger} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ background: T.border, borderRadius: 6, height: 8, marginBottom: 8 }}>
                <div style={{ width: `${Math.min(pct, 1) * 100}%`, height: "100%", background: col, borderRadius: 6, transition: "width 0.4s" }} />
              </div>

              {/* Status message */}
              {pct >= 1 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Bell size={12} color={T.danger} />
                  <p style={{ margin: 0, fontSize: 11, color: T.danger, fontWeight: 700 }}>
                    Over by {fmt(sp - b.limit)} this month!
                  </p>
                </div>
              ) : pct >= 0.8 ? (
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Bell size={12} color={T.warning} />
                  <p style={{ margin: 0, fontSize: 11, color: T.warning, fontWeight: 600 }}>
                    Only {fmt(rem)} left for this month
                  </p>
                </div>
              ) : (
                <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>
                  {fmt(rem)} remaining this month
                </p>
              )}
            </div>
          );
        })}

        {/* Set Budget button */}
        <button onClick={() => { setShowAdd(true); resetForm(); }} style={{ width: "100%", background: T.warningDim, border: `1px solid ${T.warning}44`, borderRadius: 14, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", marginTop: 4 }}>
          <Plus size={16} color={T.warning} />
          <span style={{ fontSize: 14, fontWeight: 600, color: T.warning }}>Set Budget Limit</span>
        </button>
      </div>

      {/* Add Budget Sheet */}
      {showAdd && (
        <Sheet title="Set Budget Limit" onClose={() => setShowAdd(false)} tall>
          <Fld label="Category">
            {availCats.length === 0 ? (
              <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>All categories already have a budget set.</p>
            ) : (
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
                {availCats.map(c => (
                  <button key={c.id} onClick={() => setBCat(c.id)} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "7px 9px", borderRadius: 12, border: `1.5px solid ${bCat === c.id ? c.color : T.border}`, background: bCat === c.id ? c.color + "20" : T.card, cursor: "pointer" }}>
                    <span style={{ fontSize: 18 }}>{c.emoji}</span>
                    <span style={{ fontSize: 9, color: bCat === c.id ? c.color : T.textMuted, fontWeight: bCat === c.id ? 700 : 400, whiteSpace: "nowrap" }}>{c.label}</span>
                  </button>
                ))}
              </div>
            )}
          </Fld>
          <Fld label="Monthly Limit (₹)">
            <Inp type="number" placeholder="e.g. 2000" value={bLimit} onChange={setBLimit} pre="₹" />
          </Fld>
          {/* Quick preset amounts */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {[500, 1000, 2000, 3000, 5000].map(amt => (
              <button key={amt} onClick={() => setBLimit(String(amt))} style={{ background: bLimit === String(amt) ? T.accentDim : T.card, border: `1px solid ${bLimit === String(amt) ? T.accent : T.border}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, color: bLimit === String(amt) ? T.accent : T.textSec, fontFamily: "inherit", fontWeight: bLimit === String(amt) ? 700 : 400 }}>
                {fmt(amt)}
              </button>
            ))}
          </div>
          <PBtn label="Set Budget" disabled={!bCat || !bLimit || parseFloat(bLimit) <= 0 || availCats.length === 0}
            onClick={() => {
              onAdd({ id: Date.now(), category: bCat, limit: parseFloat(bLimit) });
              setShowAdd(false); resetForm();
            }}
          />
        </Sheet>
      )}

      {/* Edit Budget Sheet */}
      {editItem && (
        <Sheet title={`Edit Budget — ${getCat(editItem.category).label}`} onClose={() => setEditItem(null)}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.surface, borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
            <span style={{ fontSize: 24 }}>{getCat(editItem.category).emoji}</span>
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{getCat(editItem.category).label}</p>
              <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>Current limit: {fmt(editItem.limit)}</p>
            </div>
          </div>
          <Fld label="New Monthly Limit (₹)">
            <Inp type="number" placeholder="Enter new limit" value={bLimit} onChange={setBLimit} pre="₹" />
          </Fld>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {[500, 1000, 2000, 3000, 5000].map(amt => (
              <button key={amt} onClick={() => setBLimit(String(amt))} style={{ background: bLimit === String(amt) ? T.accentDim : T.card, border: `1px solid ${bLimit === String(amt) ? T.accent : T.border}`, borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 12, color: bLimit === String(amt) ? T.accent : T.textSec, fontFamily: "inherit", fontWeight: bLimit === String(amt) ? 700 : 400 }}>
                {fmt(amt)}
              </button>
            ))}
          </div>
          <PBtn label="Update Limit" disabled={!bLimit || parseFloat(bLimit) <= 0}
            onClick={() => {
              onEdit({ ...editItem, limit: parseFloat(bLimit) });
              setEditItem(null);
            }}
          />
        </Sheet>
      )}
    </>
  );
}

// ─── Recurring Screen ─────────────────────────────────────────────────────────
function RecurringScreen({ recurring, accounts, onAdd, onToggle, onDelete }) {
  const [showAdd, setShowAdd] = useState(false);
  const [rTitle,  setRTitle]  = useState("");
  const [rCat,    setRCat]    = useState("rent");
  const [rAmt,    setRAmt]    = useState("");
  const [rAcc,    setRAcc]    = useState("SBI");
  const [rMode,   setRMode]   = useState("UPI");
  const [rDay,    setRDay]    = useState("1");
  const [rNote,   setRNote]   = useState("");

  const accOpts = accounts.map(a => ({ value: a.id, label: `${a.name} — ${a.fullName}` }));
  const catOpts = CATS.map(c => ({ value: c.id, label: `${c.emoji} ${c.label}` }));
  const dayOpts = Array.from({ length: 28 }, (_, i) => ({ value: String(i + 1), label: `${ordinal(i + 1)} of every month` }));

  const totalMonthly = recurring.filter(r => r.active).reduce((s, r) => s + r.amount, 0);

  // Figure out upcoming day for each recurring item this month
  const today = new Date();
  function nextDate(day) {
    const d = new Date(today.getFullYear(), today.getMonth(), day);
    if (d < today) d.setMonth(d.getMonth() + 1);
    return d.toISOString().split("T")[0];
  }
  function isDueSoon(day) {
    const diff = (new Date(nextDate(day)) - today) / 86400000;
    return diff >= 0 && diff <= 5;
  }
  function isOverdue(day) {
    return new Date(nextDate(day)) < today && nextDate(day) !== today0();
  }

  const active   = recurring.filter(r => r.active).sort((a, b) => a.dayOfMonth - b.dayOfMonth);
  const inactive = recurring.filter(r => !r.active);

  function resetForm() { setRTitle(""); setRAmt(""); setRNote(""); setRDay("1"); setRCat("rent"); setRAcc("SBI"); setRMode("UPI"); }

  return (
    <>
      <div style={{ padding: "0 16px 100px" }}>

        {/* Monthly total card */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, padding: "16px 18px", marginBottom: 16 }}>
          <p style={{ margin: "0 0 3px", fontSize: 11, color: T.textSec, letterSpacing: "0.07em" }}>AUTO-DEDUCTED MONTHLY</p>
          <p style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 700, color: T.danger }}>{fmt(totalMonthly)}</p>
          <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>{active.length} active recurring expense{active.length !== 1 ? "s" : ""}</p>
        </div>

        {/* Active recurring list */}
        {active.length === 0 && inactive.length === 0 && (
          <Empty icon={RefreshCw} title="No recurring set" desc="Add rent, EMIs and subscriptions so they auto-log every month" color={T.accent} />
        )}

        {active.length > 0 && (
          <>
            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 600, color: T.textSec, letterSpacing: "0.04em" }}>ACTIVE</p>
            {active.map(r => {
              const cat    = getCat(r.category);
              const soon   = isDueSoon(r.dayOfMonth);
              const nd     = nextDate(r.dayOfMonth);
              return (
                <div key={r.id} style={{ background: T.card, border: `1.5px solid ${soon ? T.warning + "66" : T.border}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, flex: 1 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: cat.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                        {cat.emoji}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{r.title}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3, flexWrap: "wrap" }}>
                          <Pill label={`${ordinal(r.dayOfMonth)} every month`} color={T.textSec} />
                          <span style={{ fontSize: 11, color: AC[r.accountId].a, fontWeight: 600 }}>{r.accountId}</span>
                          <Pill label={r.paymentMode} color={T.textSec} />
                        </div>
                        {r.note ? <p style={{ margin: "4px 0 0", fontSize: 11, color: T.textMuted }}>{r.note}</p> : null}
                        {/* Next due */}
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 5 }}>
                          <Calendar size={11} color={soon ? T.warning : T.textMuted} />
                          <span style={{ fontSize: 11, color: soon ? T.warning : T.textMuted, fontWeight: soon ? 700 : 400 }}>
                            {soon ? "⚡ Due soon — " : "Next: "}{fmtD(nd)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: amount + controls */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, marginLeft: 10, flexShrink: 0 }}>
                      <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.danger }}>{fmt(r.amount)}</p>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => onToggle(r.id)} style={{ background: T.accentDim, border: `1px solid ${T.accent}44`, borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, color: T.accent, fontFamily: "inherit" }}>
                          ON
                        </button>
                        <button onClick={() => onDelete(r.id)} style={{ background: T.dangerDim, border: `1px solid ${T.danger}33`, borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                          <Trash2 size={12} color={T.danger} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Inactive recurring list */}
        {inactive.length > 0 && (
          <>
            <p style={{ margin: "16px 0 10px", fontSize: 13, fontWeight: 600, color: T.textSec, letterSpacing: "0.04em" }}>PAUSED</p>
            {inactive.map(r => {
              const cat = getCat(r.category);
              return (
                <div key={r.id} style={{ background: T.card, border: `1px solid ${T.borderSoft}`, borderRadius: 16, padding: "14px 16px", marginBottom: 10, opacity: 0.55 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 44, height: 44, borderRadius: 14, background: cat.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                        {cat.emoji}
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: T.textSec }}>{r.title}</p>
                        <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>{ordinal(r.dayOfMonth)} every month · {fmt(r.amount)}</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => onToggle(r.id)} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "5px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, color: T.textSec, fontFamily: "inherit" }}>
                        OFF
                      </button>
                      <button onClick={() => onDelete(r.id)} style={{ background: T.dangerDim, border: `1px solid ${T.danger}33`, borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                        <Trash2 size={12} color={T.danger} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Add Recurring button */}
        <button onClick={() => setShowAdd(true)} style={{ width: "100%", background: T.accentDim, border: `1px solid ${T.accent}44`, borderRadius: 14, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", marginTop: 8 }}>
          <Plus size={16} color={T.accent} />
          <span style={{ fontSize: 14, fontWeight: 600, color: T.accent }}>Add Recurring Expense</span>
        </button>
      </div>

      {/* Add Recurring Sheet */}
      {showAdd && (
        <Sheet title="Add Recurring Expense" onClose={() => { setShowAdd(false); resetForm(); }} tall>

          <Fld label="Title"><Inp placeholder="Rent, Netflix, EMI…" value={rTitle} onChange={setRTitle} /></Fld>

          {/* Category strip */}
          <Fld label="Category">
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6 }}>
              {CATS.map(c => (
                <button key={c.id} onClick={() => setRCat(c.id)} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "7px 9px", borderRadius: 12, border: `1.5px solid ${rCat === c.id ? c.color : T.border}`, background: rCat === c.id ? c.color + "20" : T.card, cursor: "pointer" }}>
                  <span style={{ fontSize: 17 }}>{c.emoji}</span>
                  <span style={{ fontSize: 9, color: rCat === c.id ? c.color : T.textMuted, fontWeight: rCat === c.id ? 700 : 400, whiteSpace: "nowrap" }}>{c.label}</span>
                </button>
              ))}
            </div>
          </Fld>

          <Fld label="Amount (₹)"><Inp type="number" placeholder="0" value={rAmt} onChange={setRAmt} pre="₹" /></Fld>
          <Fld label="Account"><Sel value={rAcc} onChange={setRAcc} options={accOpts} /></Fld>

          {/* Payment mode toggle */}
          <Fld label="Payment Mode">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {PMODES.map(m => (
                <button key={m} onClick={() => setRMode(m)} style={{ padding: "11px 0", borderRadius: 12, border: `1.5px solid ${rMode === m ? T.accent : T.border}`, background: rMode === m ? T.accentDim : T.card, cursor: "pointer", fontSize: 13, fontWeight: rMode === m ? 700 : 400, color: rMode === m ? T.accent : T.textSec, fontFamily: "inherit" }}>
                  {m === "Cash" ? "💵" : m === "UPI" ? "📲" : "💳"} {m}
                </button>
              ))}
            </div>
          </Fld>

          <Fld label="Deduction Day"><Sel value={rDay} onChange={setRDay} options={dayOpts} /></Fld>
          <Fld label="Note (optional)"><Inp placeholder="Any extra info" value={rNote} onChange={setRNote} /></Fld>

          <PBtn
            label="Add Recurring"
            disabled={!rTitle.trim() || !rAmt || parseFloat(rAmt) <= 0}
            onClick={() => {
              onAdd({ id: Date.now(), title: rTitle.trim(), category: rCat, amount: parseFloat(rAmt), accountId: rAcc, paymentMode: rMode, dayOfMonth: parseInt(rDay), note: rNote, active: true });
              setShowAdd(false); resetForm();
            }}
          />
        </Sheet>
      )}
    </>
  );
}

// ─── Reports Screen ───────────────────────────────────────────────────────────
function ReportsScreen({ expenses }) {
  const [selMonth, setSelMonth] = useState(thisYM());

  // Build last 6 months for selector
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i);
    const ym  = d.toISOString().slice(0, 7);
    const lbl = d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    return { ym, lbl };
  }).reverse();

  const monthExp  = expenses.filter(e => e.date.startsWith(selMonth));
  const totalM    = monthExp.reduce((s, e) => s + e.amount, 0);

  // Category breakdown
  const catData = CATS
    .map(c => ({ ...c, value: monthExp.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0) }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  // 6-month bar data
  const barData = months.map(m => ({
    month: m.lbl.split(" ")[0],
    total: expenses.filter(e => e.date.startsWith(m.ym)).reduce((s, e) => s + e.amount, 0),
    current: m.ym === selMonth,
  }));

  // Payment mode breakdown
  const modeColors = { Cash: T.warning, UPI: T.accent, Card: T.purple };
  const modeData = PMODES.map(m => ({
    mode: m,
    total: monthExp.filter(e => e.paymentMode === m).reduce((s, e) => s + e.amount, 0),
  })).filter(d => d.total > 0);
  const modeTotal = modeData.reduce((s, d) => s + d.total, 0);

  // Account breakdown
  const accData = ["SBI", "HDFC", "KOTAK"].map(id => ({
    id,
    total: monthExp.filter(e => e.accountId === id).reduce((s, e) => s + e.amount, 0),
  })).filter(d => d.total > 0);
  const accTotal = accData.reduce((s, d) => s + d.total, 0);

  const maxBar = Math.max(...barData.map(d => d.total), 1);

  return (
    <div style={{ padding: "0 16px 100px" }}>

      {/* Month Selector */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 14 }}>
        {months.map(m => (
          <button key={m.ym} onClick={() => setSelMonth(m.ym)} style={{ flexShrink: 0, padding: "7px 14px", borderRadius: 20, border: `1.5px solid ${selMonth === m.ym ? T.accent : T.border}`, background: selMonth === m.ym ? T.accentDim : T.card, color: selMonth === m.ym ? T.accent : T.textSec, fontSize: 12, fontWeight: selMonth === m.ym ? 700 : 400, cursor: "pointer", fontFamily: "inherit" }}>
            {m.lbl}
          </button>
        ))}
      </div>

      {/* Total this month */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px 18px", marginBottom: 14 }}>
        <p style={{ margin: "0 0 2px", fontSize: 11, color: T.textSec }}>TOTAL SPENT — {months.find(m => m.ym === selMonth)?.lbl}</p>
        <p style={{ margin: 0, fontSize: 28, fontWeight: 700, color: T.danger }}>{fmt(totalM)}</p>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: T.textMuted }}>{monthExp.length} transaction{monthExp.length !== 1 ? "s" : ""}</p>
      </div>

      {/* 6-month bar chart (custom, no library needed) */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, marginBottom: 14 }}>
        <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: T.text }}>6-Month Trend</p>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
          {barData.map(d => {
            const pct = d.total / maxBar;
            return (
              <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                  <div style={{ width: "100%", height: `${Math.max(pct * 100, 4)}%`, background: d.current ? T.accent : T.border, borderRadius: "6px 6px 0 0", transition: "height 0.3s" }} />
                </div>
                <span style={{ fontSize: 10, color: d.current ? T.accent : T.textMuted, fontWeight: d.current ? 700 : 400 }}>{d.month}</span>
              </div>
            );
          })}
        </div>
        {/* Y labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          <span style={{ fontSize: 10, color: T.textMuted }}>₹0</span>
          <span style={{ fontSize: 10, color: T.textMuted }}>₹{(maxBar / 1000).toFixed(0)}k</span>
        </div>
      </div>

      {/* Category breakdown */}
      {catData.length > 0 ? (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: T.text }}>By Category</p>
          {catData.map(d => {
            const pct = d.value / totalM;
            return (
              <div key={d.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 16 }}>{d.emoji}</span>
                    <span style={{ fontSize: 13, color: T.text }}>{d.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: T.textMuted }}>{Math.round(pct * 100)}%</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{fmt(d.value)}</span>
                  </div>
                </div>
                <div style={{ background: T.border, borderRadius: 6, height: 7 }}>
                  <div style={{ width: `${pct * 100}%`, height: "100%", background: d.color, borderRadius: 6, transition: "width 0.4s" }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 24, marginBottom: 14, textAlign: "center" }}>
          <p style={{ margin: 0, fontSize: 13, color: T.textMuted }}>No expenses in this month</p>
        </div>
      )}

      {/* Payment mode breakdown */}
      {modeData.length > 0 && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16, marginBottom: 14 }}>
          <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: T.text }}>By Payment Mode</p>
          {modeData.map(d => {
            const pct = d.total / modeTotal;
            const emoji = d.mode === "Cash" ? "💵" : d.mode === "UPI" ? "📲" : "💳";
            return (
              <div key={d.mode} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{ fontSize: 16 }}>{emoji}</span>
                    <span style={{ fontSize: 13, color: T.text }}>{d.mode}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: T.textMuted }}>{Math.round(pct * 100)}%</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{fmt(d.total)}</span>
                  </div>
                </div>
                <div style={{ background: T.border, borderRadius: 6, height: 7 }}>
                  <div style={{ width: `${pct * 100}%`, height: "100%", background: modeColors[d.mode], borderRadius: 6, transition: "width 0.4s" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Account breakdown */}
      {accData.length > 0 && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 16 }}>
          <p style={{ margin: "0 0 14px", fontSize: 14, fontWeight: 600, color: T.text }}>By Account</p>
          {accData.map(d => {
            const pct = d.total / accTotal;
            return (
              <div key={d.id} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: AC[d.id].a }} />
                    <span style={{ fontSize: 13, color: T.text }}>{d.id}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, color: T.textMuted }}>{Math.round(pct * 100)}%</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{fmt(d.total)}</span>
                  </div>
                </div>
                <div style={{ background: T.border, borderRadius: 6, height: 7 }}>
                  <div style={{ width: `${pct * 100}%`, height: "100%", background: AC[d.id].a, borderRadius: 6, transition: "width 0.4s" }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── PIN Setup ────────────────────────────────────────────────────────────────
function PINSetup({ onSave, onClose }) {
  const [step, setStep] = useState(1);
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [err,  setErr]  = useState(false);
  const cur    = step === 1 ? pin1 : pin2;
  const setCur = step === 1 ? setPin1 : setPin2;

  function press(d) {
    if (cur.length >= 4) return;
    const next = cur + d;
    setCur(next);
    if (next.length === 4) {
      if (step === 1) { setTimeout(() => setStep(2), 180); }
      else if (next === pin1) { setTimeout(() => onSave(pin1), 150); }
      else { setErr(true); setTimeout(() => { setPin2(""); setErr(false); }, 700); }
    }
  }
  function del() { setCur(c => c.slice(0, -1)); }

  return (
    <Sheet title={step === 1 ? "Set New PIN" : "Confirm PIN"} onClose={onClose}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24, paddingBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: T.textSec, textAlign: "center" }}>
          {step === 1 ? "Choose a 4-digit PIN to protect your app" : "Re-enter your PIN to confirm"}
        </p>
        {/* Dots */}
        <div style={{ display: "flex", gap: 14 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: i < cur.length ? (err ? T.danger : T.accent) : T.border, transition: "background 0.15s" }} />
          ))}
        </div>
        {err && <p style={{ margin: "-10px 0 0", fontSize: 12, color: T.danger, fontWeight: 600 }}>PINs don't match, try again</p>}
        {/* Keypad */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, width: 230 }}>
          {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d, i) => (
            <button key={i} onClick={() => d === "⌫" ? del() : d !== "" && press(String(d))}
              style={{ height: 58, borderRadius: 14, background: d === "" ? "transparent" : T.card, border: d === "" ? "none" : `1px solid ${T.border}`, fontSize: d === "⌫" ? 20 : 22, fontWeight: 600, color: T.text, cursor: d === "" ? "default" : "pointer", fontFamily: "inherit" }}>
              {d}
            </button>
          ))}
        </div>
      </div>
    </Sheet>
  );
}

// ─── PIN Lock Screen ──────────────────────────────────────────────────────────
function PINLock({ onUnlock }) {
  const [entry, setEntry] = useState("");
  const [err,   setErr]   = useState(false);
  const PIN = "1234"; // default demo PIN — real PIN stored in state

  function press(d) {
    if (entry.length >= 4) return;
    const next = entry + d;
    setEntry(next);
    if (next.length === 4) {
      if (next === PIN) setTimeout(() => onUnlock(), 150);
      else { setErr(true); setTimeout(() => { setEntry(""); setErr(false); }, 700); }
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: T.bg, zIndex: 1000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32, fontFamily: "'SF Pro Display','Segoe UI',sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 68, height: 68, borderRadius: 22, background: T.accentDim, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
          <Lock size={30} color={T.accent} />
        </div>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text }}>PaisaTrack</p>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: T.textSec }}>Enter your PIN to continue</p>
      </div>
      <div style={{ display: "flex", gap: 14 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ width: 15, height: 15, borderRadius: "50%", background: i < entry.length ? (err ? T.danger : T.accent) : T.border, transition: "background 0.15s" }} />
        ))}
      </div>
      {err && <p style={{ margin: "-20px 0 0", fontSize: 12, color: T.danger, fontWeight: 600 }}>Incorrect PIN</p>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, width: 250 }}>
        {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((d, i) => (
          <button key={i} onClick={() => d === "⌫" ? setEntry(e => e.slice(0,-1)) : d !== "" && press(String(d))}
            style={{ height: 66, borderRadius: 18, background: d === "" ? "transparent" : T.card, border: d === "" ? "none" : `1px solid ${T.border}`, fontSize: d === "⌫" ? 22 : 24, fontWeight: 600, color: T.text, cursor: d === "" ? "default" : "pointer", fontFamily: "inherit" }}>
            {d}
          </button>
        ))}
      </div>
      <p style={{ margin: 0, fontSize: 12, color: T.textMuted }}>Demo PIN: 1234</p>
    </div>
  );
}

// ─── Settings Screen ──────────────────────────────────────────────────────────
function SettingsScreen({ pin, onSetPin, onClearPin, expenses, accounts, lending, people, recurring, budgets }) {
  const [showPINSetup, setShowPINSetup] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [exported, setExported] = useState(false);

  // ── Export CSV ───────────────────────────────────────────────────────────────
  function exportCSV() {
    const header = ["Date","Title","Category","Amount","Account","Payment Mode","Note","Tags"];
    const rows   = expenses.map(e => [
      e.date,
      `"${e.title}"`,
      getCat(e.category).label,
      e.amount,
      e.accountId,
      e.paymentMode,
      `"${e.note}"`,
      `"${e.tags.join(", ")}"`,
    ]);
    const csv  = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `paisatrack-expenses-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExported(true);
    setTimeout(() => setExported(false), 3000);
  }

  // ── Export Lending CSV ───────────────────────────────────────────────────────
  function exportLendingCSV() {
    const header = ["Date","Person","Type","Amount","Note","Due Date","Settled","Settlement Note"];
    const rows   = lending.map(t => {
      const person = people.find(p => p.id === t.personId);
      return [
        t.date,
        `"${person?.name || ""}"`,
        t.type,
        t.amount,
        `"${t.note}"`,
        t.dueDate || "",
        t.settled ? "Yes" : "No",
        `"${t.settlementNote}"`,
      ];
    });
    const csv  = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `paisatrack-lending-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Section helper ───────────────────────────────────────────────────────────
  function Section({ title, children }) {
    return (
      <div style={{ marginBottom: 20 }}>
        <p style={{ margin: "0 0 8px", fontSize: 11, color: T.textMuted, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{title}</p>
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
          {children}
        </div>
      </div>
    );
  }

  function Row({ icon: Icon, iconColor, label, desc, right, onClick, danger }) {
    return (
      <div onClick={onClick} style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 16px", borderBottom: `1px solid ${T.borderSoft}`, cursor: onClick ? "pointer" : "default" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: (iconColor || T.accent) + "20", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={16} color={iconColor || T.accent} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: danger ? T.danger : T.text }}>{label}</p>
          {desc && <p style={{ margin: "2px 0 0", fontSize: 11, color: T.textMuted }}>{desc}</p>}
        </div>
        {right}
      </div>
    );
  }

  const stats = {
    expenses:  expenses.length,
    totalSpent: expenses.reduce((s, e) => s + e.amount, 0),
    people:    people.length,
    recurring: recurring.filter(r => r.active).length,
    budgets:   budgets.length,
  };

  return (
    <>
      <div style={{ padding: "0 16px 100px" }}>

        {/* App info card */}
        <div style={{ background: T.accentDim, border: `1px solid ${T.accent}33`, borderRadius: 18, padding: "16px 18px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 52, borderRadius: 16, background: T.accent + "30", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 26 }}>💰</span>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: T.text }}>PaisaTrack</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: T.accentText }}>Personal Finance Manager · v1.0</p>
            <p style={{ margin: "4px 0 0", fontSize: 11, color: T.textMuted }}>{stats.expenses} expenses · {stats.people} people · {stats.recurring} active recurring</p>
          </div>
        </div>

        {/* Security */}
        <Section title="Security">
          <Row
            icon={Lock} iconColor={pin ? T.success : T.danger}
            label={pin ? "PIN Lock Enabled" : "PIN Lock Disabled"}
            desc={pin ? "Tap to change your PIN" : "Set a PIN to protect your data"}
            onClick={() => setShowPINSetup(true)}
            right={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {pin
                  ? <span style={{ fontSize: 11, fontWeight: 700, color: T.success, background: T.successDim, padding: "3px 8px", borderRadius: 6 }}>ON</span>
                  : <span style={{ fontSize: 11, fontWeight: 700, color: T.danger, background: T.dangerDim, padding: "3px 8px", borderRadius: 6 }}>OFF</span>
                }
                <ChevronRight size={14} color={T.textMuted} />
              </div>
            }
          />
          {pin && (
            <Row
              icon={LogOut} iconColor={T.danger}
              label="Remove PIN"
              desc="Disable PIN lock for this app"
              onClick={onClearPin}
              danger
              right={<ChevronRight size={14} color={T.textMuted} />}
            />
          )}
        </Section>

        {/* Export */}
        <Section title="Export Data">
          <Row
            icon={Download} iconColor={T.accent}
            label="Export Expenses as CSV"
            desc={`${stats.expenses} transactions · ₹${stats.totalSpent.toLocaleString("en-IN")} total`}
            onClick={exportCSV}
            right={
              exported
                ? <span style={{ fontSize: 11, fontWeight: 700, color: T.success }}>✓ Done!</span>
                : <ChevronRight size={14} color={T.textMuted} />
            }
          />
          <Row
            icon={Download} iconColor={T.purple}
            label="Export Lending as CSV"
            desc={`${lending.length} lending entries`}
            onClick={exportLendingCSV}
            right={<ChevronRight size={14} color={T.textMuted} />}
          />
        </Section>

        {/* Data Summary */}
        <Section title="Your Data">
          {[
            { label: "Total Expenses",     value: stats.expenses,              color: T.danger  },
            { label: "Total Spent",        value: `₹${stats.totalSpent.toLocaleString("en-IN")}`, color: T.warning },
            { label: "People in Lending",  value: stats.people,                color: T.purple  },
            { label: "Active Recurring",   value: stats.recurring,             color: T.accent  },
            { label: "Budgets Set",        value: stats.budgets,               color: T.success },
          ].map((row, i) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", borderBottom: i < 4 ? `1px solid ${T.borderSoft}` : "none" }}>
              <p style={{ margin: 0, fontSize: 13, color: T.textSec }}>{row.label}</p>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: row.color }}>{row.value}</p>
            </div>
          ))}
        </Section>

        {/* Danger zone */}
        <Section title="Danger Zone">
          <Row
            icon={Trash2} iconColor={T.danger}
            label="Clear All Data"
            desc="This cannot be undone"
            onClick={() => setShowClearConfirm(true)}
            danger
            right={<ChevronRight size={14} color={T.textMuted} />}
          />
        </Section>

        <p style={{ textAlign: "center", fontSize: 11, color: T.textMuted, marginTop: 8 }}>All data stored locally on your device</p>
      </div>

      {/* PIN Setup Sheet */}
      {showPINSetup && (
        <PINSetup
          onSave={newPin => { onSetPin(newPin); setShowPINSetup(false); }}
          onClose={() => setShowPINSetup(false)}
        />
      )}

      {/* Clear All Confirm Sheet */}
      {showClearConfirm && (
        <Sheet title="Clear All Data?" onClose={() => setShowClearConfirm(false)}>
          <div style={{ background: T.dangerDim, border: `1px solid ${T.danger}33`, borderRadius: 14, padding: "14px", marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: T.danger, fontWeight: 600 }}>⚠ This will delete all your expenses, lending records, budgets, and recurring expenses permanently.</p>
          </div>
          <PBtn label="Yes, Delete Everything" onClick={() => setShowClearConfirm(false)} color={T.danger} />
          <button onClick={() => setShowClearConfirm(false)} style={{ width: "100%", background: "none", border: `1px solid ${T.border}`, borderRadius: 14, height: 46, fontSize: 14, color: T.textSec, cursor: "pointer", fontFamily: "inherit", marginTop: 8 }}>
            Cancel
          </button>
        </Sheet>
      )}
    </>
  );
}

// ─── Categories Screen ────────────────────────────────────────────────────────
const CAT_EMOJIS = ["🍱","🍽️","🛺","🚇","🛒","🧺","☕","🛵","🚌","⛽","💊","🎬","📱","👕","✈️","🎁","📚","🏠","🏦","🎓","💳","🧾","🎵","🏋️","🐾","💄","🧴","🍕","🚗","🎮","🍔","🧋","🥗","🍜","🎪","🛍️","🔧","💡","🏥","📦"];
const CAT_COLORS = ["#FF6B7A","#FF8C61","#F5A623","#00C2E0","#3DD9AF","#A78BFA","#FC4E0A","#A0785A","#7A8BA8","#2ABEAF","#FF6B9D","#61DAFB","#F97316","#84CC16","#06B6D4","#8B5CF6","#EC4899","#14B8A6","#F59E0B","#EF4444"];

function CategoriesScreen({ customCats, onAdd, onEdit, onDelete, expenses }) {
  const [showAdd,   setShowAdd]   = useState(false);
  const [editItem,  setEditItem]  = useState(null);
  const [cLabel,    setCLabel]    = useState("");
  const [cEmoji,    setCEmoji]    = useState("🧾");
  const [cColor,    setCColor]    = useState("#3DD9AF");
  const [showEmoji, setShowEmoji] = useState(false);

  const allCats   = [...CATS, ...customCats];
  const ym        = thisYM();

  function usageCount(id) {
    return expenses.filter(e => e.category === id).length;
  }
  function monthlySpent(id) {
    return expenses.filter(e => e.category === id && e.date.startsWith(ym)).reduce((s, e) => s + e.amount, 0);
  }

  function resetForm() { setCLabel(""); setCEmoji("🧾"); setCColor("#3DD9AF"); setShowEmoji(false); }

  return (
    <>
      <div style={{ padding: "0 16px 100px" }}>

        {/* Stats card */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px 18px", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: T.textSec }}>BUILT-IN</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text }}>{CATS.length}</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: T.textSec }}>CUSTOM</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.accent }}>{customCats.length}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: "0 0 2px", fontSize: 11, color: T.textSec }}>TOTAL</p>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: T.text }}>{allCats.length}</p>
          </div>
        </div>

        {/* Custom categories */}
        {customCats.length > 0 && (
          <>
            <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: T.textSec, letterSpacing: "0.05em" }}>YOUR CUSTOM CATEGORIES</p>
            {customCats.map(c => {
              const cnt   = usageCount(c.id);
              const spent = monthlySpent(c.id);
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, background: T.card, border: `1.5px solid ${c.color}44`, borderRadius: 14, padding: "12px 14px", marginBottom: 8 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: c.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                    {c.emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: T.text }}>{c.label}</p>
                    <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>
                      {cnt} use{cnt !== 1 ? "s" : ""}
                      {spent > 0 ? ` · ${fmt(spent)} this month` : ""}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setEditItem(c); setCLabel(c.label); setCEmoji(c.emoji); setCColor(c.color); }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Edit2 size={12} color={T.textSec} />
                    </button>
                    <button onClick={() => onDelete(c.id)} style={{ background: T.dangerDim, border: `1px solid ${T.danger}33`, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                      <Trash2 size={12} color={T.danger} />
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* Add custom category button */}
        <button onClick={() => { setShowAdd(true); resetForm(); }} style={{ width: "100%", background: T.accentDim, border: `1px solid ${T.accent}44`, borderRadius: 14, padding: "14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, cursor: "pointer", marginBottom: 20, marginTop: customCats.length > 0 ? 4 : 0 }}>
          <Plus size={16} color={T.accent} />
          <span style={{ fontSize: 14, fontWeight: 600, color: T.accent }}>Add Custom Category</span>
        </button>

        {/* Built-in categories (read-only) */}
        <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: T.textSec, letterSpacing: "0.05em" }}>BUILT-IN CATEGORIES</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {CATS.map(c => {
            const cnt   = usageCount(c.id);
            const spent = monthlySpent(c.id);
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 12px" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: c.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                  {c.emoji}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.label}</p>
                  <p style={{ margin: 0, fontSize: 10, color: T.textMuted }}>
                    {cnt > 0 ? `${cnt} use${cnt !== 1 ? "s" : ""}` : "Unused"}
                    {spent > 0 ? ` · ${fmt(spent)}` : ""}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Category Sheet */}
      {showAdd && (
        <Sheet title="Add Custom Category" onClose={() => setShowAdd(false)}>
          {/* Preview */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: cColor + "18", border: `1.5px solid ${cColor}44`, borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: cColor + "30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{cEmoji}</div>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: cColor }}>{cLabel || "Category Name"}</p>
              <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>Preview</p>
            </div>
          </div>

          <Fld label="Category Name"><Inp placeholder="e.g. Gym, Pet Care, Snacks…" value={cLabel} onChange={setCLabel} /></Fld>

          {/* Emoji picker */}
          <Fld label="Emoji">
            <button onClick={() => setShowEmoji(s => !s)} style={{ display: "flex", alignItems: "center", gap: 10, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 14px", cursor: "pointer", width: "100%" }}>
              <span style={{ fontSize: 22 }}>{cEmoji}</span>
              <span style={{ fontSize: 13, color: T.textSec }}>Tap to pick emoji</span>
              <ChevronDown size={13} color={T.textSec} style={{ marginLeft: "auto" }} />
            </button>
            {showEmoji && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 10, maxHeight: 160, overflowY: "auto" }}>
                {CAT_EMOJIS.map(e => (
                  <button key={e} onClick={() => { setCEmoji(e); setShowEmoji(false); }} style={{ width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${cEmoji === e ? T.accent : "transparent"}`, background: cEmoji === e ? T.accentDim : "transparent", fontSize: 20, cursor: "pointer" }}>
                    {e}
                  </button>
                ))}
              </div>
            )}
          </Fld>

          {/* Color picker */}
          <Fld label="Color">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CAT_COLORS.map(col => (
                <button key={col} onClick={() => setCColor(col)} style={{ width: 34, height: 34, borderRadius: "50%", background: col, border: `3px solid ${cColor === col ? T.text : "transparent"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cColor === col && <Check size={14} color="#fff" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </Fld>

          <PBtn label="Add Category" disabled={!cLabel.trim()} onClick={() => {
            onAdd({ id: `custom_${Date.now()}`, label: cLabel.trim(), emoji: cEmoji, color: cColor });
            setShowAdd(false); resetForm();
          }} />
        </Sheet>
      )}

      {/* Edit Category Sheet */}
      {editItem && (
        <Sheet title="Edit Category" onClose={() => setEditItem(null)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: cColor + "18", border: `1.5px solid ${cColor}44`, borderRadius: 14, padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: cColor + "30", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{cEmoji}</div>
            <div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: cColor }}>{cLabel || "Category Name"}</p>
              <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>Preview</p>
            </div>
          </div>
          <Fld label="Category Name"><Inp placeholder="Category name" value={cLabel} onChange={setCLabel} /></Fld>
          <Fld label="Emoji">
            <button onClick={() => setShowEmoji(s => !s)} style={{ display: "flex", alignItems: "center", gap: 10, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 14px", cursor: "pointer", width: "100%" }}>
              <span style={{ fontSize: 22 }}>{cEmoji}</span>
              <span style={{ fontSize: 13, color: T.textSec }}>Tap to change</span>
              <ChevronDown size={13} color={T.textSec} style={{ marginLeft: "auto" }} />
            </button>
            {showEmoji && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 10, maxHeight: 160, overflowY: "auto" }}>
                {CAT_EMOJIS.map(e => (
                  <button key={e} onClick={() => { setCEmoji(e); setShowEmoji(false); }} style={{ width: 38, height: 38, borderRadius: 10, border: `1.5px solid ${cEmoji === e ? T.accent : "transparent"}`, background: cEmoji === e ? T.accentDim : "transparent", fontSize: 20, cursor: "pointer" }}>
                    {e}
                  </button>
                ))}
              </div>
            )}
          </Fld>
          <Fld label="Color">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CAT_COLORS.map(col => (
                <button key={col} onClick={() => setCColor(col)} style={{ width: 34, height: 34, borderRadius: "50%", background: col, border: `3px solid ${cColor === col ? T.text : "transparent"}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cColor === col && <Check size={14} color="#fff" strokeWidth={3} />}
                </button>
              ))}
            </div>
          </Fld>
          <PBtn label="Save Changes" disabled={!cLabel.trim()} onClick={() => {
            onEdit({ ...editItem, label: cLabel.trim(), emoji: cEmoji, color: cColor });
            setEditItem(null); resetForm();
          }} />
        </Sheet>
      )}
    </>
  );
}

// ─── More Screen ──────────────────────────────────────────────────────────────
function MoreScreen({ onNavigate, pin }) {
  return (
    <div style={{ padding: "0 16px 100px" }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 18, overflow: "hidden", marginBottom: 16 }}>
        {MORE_ITEMS.map((item, i) => {
          const isLive = item.id === "reports" || item.id === "recurring" || item.id === "budgets" || item.id === "search" || item.id === "settings" || item.id === "categories";
          return (
            <div key={item.id} onClick={() => isLive && onNavigate(item.id)}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: i < MORE_ITEMS.length - 1 ? `1px solid ${T.borderSoft}` : "none", cursor: isLive ? "pointer" : "default", opacity: isLive ? 1 : 0.5 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: isLive ? T.accentDim : T.surface, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <item.icon size={16} color={isLive ? T.accent : T.textMuted} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: isLive ? T.text : T.textMuted }}>{item.label}</p>
                  {isLive && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: T.accentDim, color: T.accent }}>LIVE</span>}
                  {!isLive && <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4, background: T.surface, color: T.textMuted }}>SOON</span>}
                </div>
                <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>{item.desc}</p>
              </div>
              {isLive && <ChevronRight size={14} color={T.textMuted} />}
            </div>
          );
        })}
      </div>
      {/* PIN status banner */}
      <div onClick={() => onNavigate("settings")} style={{ background: pin ? T.successDim : T.dangerDim, border: `1px solid ${pin ? T.success : T.danger}33`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
        <Shield size={16} color={pin ? T.success : T.danger} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: pin ? T.success : T.danger }}>{pin ? "PIN Lock is ON" : "PIN Lock not set"}</p>
          <p style={{ margin: 0, fontSize: 11, color: T.textMuted }}>{pin ? "Your data is protected" : "Tap to protect your financial data"}</p>
        </div>
        <ChevronRight size={14} color={T.textMuted} />
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active,        setActive]        = useState("dashboard");
  const [accounts,      setAccounts]      = useState(INIT_ACCOUNTS);
  const [accTx,         setAccTx]         = useState(INIT_ACC_TX);
  const [expenses,      setExpenses]      = useState(INIT_EXPENSES);
  const [accountDetail, setAccountDetail] = useState(null);
  const [people,        setPeople]        = useState(INIT_PEOPLE);
  const [lending,       setLending]       = useState(INIT_LENDING);
  const [lendingDetail, setLendingDetail] = useState(null);
  const [subScreen,     setSubScreen]     = useState(null);
  const [recurring,     setRecurring]     = useState(INIT_RECURRING);
  const [budgets,       setBudgets]       = useState(INIT_BUDGETS);
  const [pin,           setPin]           = useState(null);
  const [locked,        setLocked]        = useState(false);
  const [customCats,    setCustomCats]    = useState([]);

  function handleTabChange(tab) { setActive(tab); setAccountDetail(null); setLendingDetail(null); setSubScreen(null); }

  function handleAccUpdate(action) {
    const id = Date.now();
    if (action.type === "income") {
      setAccounts(prev => prev.map(a => a.id === action.accountId ? { ...a, balance: a.balance + action.amount } : a));
      setAccTx(prev => [...prev, { id, accountId: action.accountId, type: "income", title: action.title || "Income", amount: action.amount, date: action.date, note: action.note }]);
    } else if (action.type === "transfer") {
      setAccounts(prev => prev.map(a => {
        if (a.id === action.fromAccountId) return { ...a, balance: a.balance - action.amount };
        if (a.id === action.toAccountId)   return { ...a, balance: a.balance + action.amount };
        return a;
      }));
      setAccTx(prev => [...prev,
        { id,     accountId: action.fromAccountId, type: "transfer", title: `Transfer to ${action.toAccountId}`,     amount: action.amount, date: action.date, note: action.note },
        { id: id+1, accountId: action.toAccountId, type: "income",   title: `Transfer from ${action.fromAccountId}`, amount: action.amount, date: action.date, note: action.note },
      ]);
    }
  }

  function addExpense(e)    { setExpenses(prev => [e, ...prev]); }
  function editExpense(e)   { setExpenses(prev => prev.map(x => x.id === e.id ? e : x)); }
  function deleteExpense(id){ setExpenses(prev => prev.filter(x => x.id !== id)); }

  function addPerson(p)  { setPeople(prev => [...prev, p]); }
  function addLendingTx(tx) { setLending(prev => [...prev, tx]); }
  function settleTx(txId, note) {
    setLending(prev => prev.map(t => t.id === txId ? { ...t, settled: true, settlementNote: note } : t));
  }

  function addRecurring(r)    { setRecurring(prev => [...prev, r]); }
  function toggleRecurring(id){ setRecurring(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r)); }
  function deleteRecurring(id){ setRecurring(prev => prev.filter(r => r.id !== id)); }

  function addBudget(b)    { setBudgets(prev => [...prev, b]); }
  function editBudget(b)   { setBudgets(prev => prev.map(x => x.id === b.id ? b : x)); }
  function deleteBudget(id){ setBudgets(prev => prev.filter(x => x.id !== id)); }

  function addCustomCat(c)    { setCustomCats(prev => [...prev, c]); }
  function editCustomCat(c)   { setCustomCats(prev => prev.map(x => x.id === c.id ? c : x)); }
  function deleteCustomCat(id){ setCustomCats(prev => prev.filter(x => x.id !== id)); }

  // Top bar config per screen
  const topBarProps = () => {
    if (active === "accounts" && accountDetail) {
      const acc = accounts.find(a => a.id === accountDetail);
      return { title: acc?.name, subtitle: "Accounts", onBack: () => setAccountDetail(null) };
    }
    if (active === "lending" && lendingDetail) {
      const person = people.find(p => p.id === lendingDetail);
      return { title: person?.name, subtitle: "Lending & Borrowing", onBack: () => setLendingDetail(null) };
    }
    if (active === "more" && subScreen === "reports") {
      return { title: "Reports & Charts", subtitle: "More", onBack: () => setSubScreen(null) };
    }
    if (active === "more" && subScreen === "recurring") {
      return { title: "Recurring Expenses", subtitle: "More", onBack: () => setSubScreen(null) };
    }
    if (active === "more" && subScreen === "budgets") {
      return { title: "Budget Alerts", subtitle: "More", onBack: () => setSubScreen(null) };
    }
    if (active === "more" && subScreen === "search") {
      return { title: "Search & Filter", subtitle: "More", onBack: () => setSubScreen(null) };
    }
    if (active === "more" && subScreen === "settings") {
      return { title: "Settings", subtitle: "More", onBack: () => setSubScreen(null) };
    }
    if (active === "more" && subScreen === "categories") {
      return { title: "Categories", subtitle: "More", onBack: () => setSubScreen(null) };
    }
    const map = {
      dashboard: { title: "Overview", subtitle: "May 2026" },
      expenses:  { title: "Expenses" },
      lending:   { title: "Lending & Borrowing" },
      accounts:  { title: "Accounts" },
      more:      { title: "More" },
    };
    return map[active] || {};
  };

  const tbp = topBarProps();

  return (
    <div style={{ background: T.bg, minHeight: "100vh", maxWidth: 430, margin: "0 auto", fontFamily: "'SF Pro Display', 'Segoe UI', sans-serif", position: "relative", overflowX: "hidden" }}>
      {locked && pin && <PINLock onUnlock={() => setLocked(false)} />}
      <StatusBar />
      <TopBar {...tbp} />
      <div style={{ overflowY: "auto", maxHeight: "calc(100vh - 115px)", paddingBottom: 20 }}>
        {active === "dashboard" && <DashboardScreen accounts={accounts} expenses={expenses} people={people} lending={lending} onSettle={settleTx} budgets={budgets} />}
        {active === "expenses"  && <ExpensesScreen expenses={expenses} accounts={accounts} onAdd={addExpense} onEdit={editExpense} onDelete={deleteExpense} customCats={customCats} />}
        {active === "lending"   && <LendingScreen people={people} lending={lending} onAddPerson={addPerson} onAddTx={addLendingTx} onSettle={settleTx} detail={lendingDetail} onSelectDetail={setLendingDetail} />}
        {active === "accounts"  && <AccountsScreen accounts={accounts} transactions={accTx} onUpdate={handleAccUpdate} detail={accountDetail} onSelectDetail={setAccountDetail} />}
        {active === "more" && !subScreen && <MoreScreen onNavigate={setSubScreen} pin={pin} />}
        {active === "more" && subScreen === "reports"   && <ReportsScreen expenses={expenses} />}
        {active === "more" && subScreen === "recurring" && <RecurringScreen recurring={recurring} accounts={accounts} onAdd={addRecurring} onToggle={toggleRecurring} onDelete={deleteRecurring} />}
        {active === "more" && subScreen === "budgets"   && <BudgetsScreen budgets={budgets} expenses={expenses} onAdd={addBudget} onEdit={editBudget} onDelete={deleteBudget} />}
        {active === "more" && subScreen === "search"    && <SearchScreen expenses={expenses} people={people} lending={lending} />}
        {active === "more" && subScreen === "settings"   && <SettingsScreen pin={pin} onSetPin={p => { setPin(p); setLocked(false); }} onClearPin={() => { setPin(null); setLocked(false); }} expenses={expenses} accounts={accounts} lending={lending} people={people} recurring={recurring} budgets={budgets} />}
        {active === "more" && subScreen === "categories" && <CategoriesScreen customCats={customCats} onAdd={addCustomCat} onEdit={editCustomCat} onDelete={deleteCustomCat} expenses={expenses} />}
      </div>
      <BottomNav active={active} onChange={handleTabChange} />
    </div>
  );
}
