/**
 * Local mock of the Supabase client surface used by this app.
 * No network/database. Data lives in module-scoped arrays and is mirrored
 * to localStorage so wallet state survives refreshes in the same browser.
 */

type Row = Record<string, any>;

function uid() {
  return "id_" + Math.random().toString(36).slice(2, 10);
}
const nowIso = () => new Date().toISOString();
const DEMO_USER_ID = "demo-user";

// ---------- Seed data ----------
const tables: Record<string, Row[]> = {
  profiles: [
    {
      id: DEMO_USER_ID,
      name: "Rahim Uddin",
      phone: "8801711000001",
      avatar_seed: "RU",
      persona: "student",
      xp: 340,
      balance_cents: 1284500,
      level: 4,
      tier: "gold",
      streak: 7,
      last_active_date: null,
      district: "Dhaka",
      division: "Dhaka",
      nid: null,
      dob: null,
      gender: null,
      created_at: nowIso(),
      updated_at: nowIso(),
    },
  ],
  transactions: [
    { id: uid(), user_id: DEMO_USER_ID, kind: "receive", amount_cents: 250000, counterparty: "Salma Akter", note: "Eid gift 🌙", meta: {}, created_at: new Date(Date.now() - 3600_000).toISOString() },
    { id: uid(), user_id: DEMO_USER_ID, kind: "send", amount_cents: -85000, counterparty: "Khulna Bazaar", note: "Groceries", meta: {}, created_at: new Date(Date.now() - 6 * 3600_000).toISOString() },
    { id: uid(), user_id: DEMO_USER_ID, kind: "bill", amount_cents: -120000, counterparty: "DESCO", note: "Electricity bill", meta: {}, created_at: new Date(Date.now() - 86400_000).toISOString() },
    { id: uid(), user_id: DEMO_USER_ID, kind: "reward", amount_cents: 5000, counterparty: "CASh-E Rewards", note: "Mission cashback", meta: {}, created_at: new Date(Date.now() - 2 * 86400_000).toISOString() },
    { id: uid(), user_id: DEMO_USER_ID, kind: "signup_bonus", amount_cents: 10000, counterparty: "CASh-E", note: "Welcome bonus", meta: {}, created_at: new Date(Date.now() - 5 * 86400_000).toISOString() },
  ],
  contacts: [
    { id: uid(), user_id: DEMO_USER_ID, name: "Rahim Uddin", phone: "01711000001", is_priyo: true, created_at: nowIso() },
    { id: uid(), user_id: DEMO_USER_ID, name: "Salma Akter", phone: "01711000002", is_priyo: true, created_at: nowIso() },
    { id: uid(), user_id: DEMO_USER_ID, name: "Khulna Bazaar", phone: "01711000003", is_priyo: false, created_at: nowIso() },
  ],
  savings_goals: [
    { id: uid(), user_id: DEMO_USER_ID, name: "Eid Savings", emoji: "🌙", target_cents: 1500000, saved_cents: 840000, due_date: new Date(Date.now() + 42 * 86400_000).toISOString().slice(0, 10), created_at: nowIso() },
  ],
  missions: [
    { id: uid(), user_id: DEMO_USER_ID, code: "first_send", title: "Send your first money", description: "Send ৳ 50 or more to anyone", reward_xp: 100, reward_cashback_cents: 5000, progress: 1, target: 1, completed: false, created_at: nowIso() },
    { id: uid(), user_id: DEMO_USER_ID, code: "pay_3_bills", title: "Pay 3 bills this week", description: "Pay any 3 utility or recharge bills", reward_xp: 150, reward_cashback_cents: 5000, progress: 1, target: 3, completed: false, created_at: nowIso() },
    { id: uid(), user_id: DEMO_USER_ID, code: "save_1000", title: "Save ৳ 1,000 in Sanchay", description: "Add to any savings goal", reward_xp: 120, reward_cashback_cents: 0, progress: 0, target: 1, completed: false, created_at: nowIso() },
    { id: uid(), user_id: DEMO_USER_ID, code: "7_day_streak", title: "7-day login streak", description: "Open the app 7 days in a row", reward_xp: 200, reward_cashback_cents: 10000, progress: 7, target: 7, completed: false, created_at: nowIso() },
  ],
  notifications: [
    { id: uid(), user_id: DEMO_USER_ID, title: "Welcome to CASh-E 🎉", body: "Your demo wallet is preloaded with ৳12,845.", icon: "sparkles", read: false, created_at: nowIso() },
    { id: uid(), user_id: DEMO_USER_ID, title: "Money received", body: "৳2,500 from Salma Akter", icon: "send", read: false, created_at: new Date(Date.now() - 3600_000).toISOString() },
  ],
  subscriptions: [],
  ai_messages: [],
};

// ---------- Persistence (localStorage) ----------
const STORAGE_KEY = "cashe_demo_v2";
let persistScheduled = false;
function persist() {
  if (typeof window === "undefined") return;
  if (persistScheduled) return;
  persistScheduled = true;
  const write = () => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tables)); } catch {}
    persistScheduled = false;
  };
  write();
}
if (typeof window !== "undefined") {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      for (const k of Object.keys(tables)) {
        if (Array.isArray(saved[k])) tables[k] = saved[k];
      }
    }
  } catch {}
}

// ---------- Query builder ----------
function applyFilter(rows: Row[], filters: Array<(r: Row) => boolean>) {
  return rows.filter((r) => filters.every((f) => f(r)));
}

function makeBuilder(table: string, mode: "select" | "insert" | "update" | "delete" | "upsert", payload?: any, opts?: any) {
  const filters: Array<(r: Row) => boolean> = [];
  let _order: { col: string; asc: boolean } | null = null;
  let _limit: number | null = null;
  let _single = false;
  let _maybeSingle = false;
  let _count: "exact" | null = opts?.count ?? null;
  let _head = opts?.head ?? false;

  const exec = (): { data: any; error: any; count?: number } => {
    const all = tables[table] ?? (tables[table] = []);
    if (mode === "insert") {
      const items = Array.isArray(payload) ? payload : [payload];
      const inserted = items.map((it) => ({ id: uid(), created_at: nowIso(), ...it }));
      all.push(...inserted);
      persist();
      return { data: inserted, error: null };
    }
    if (mode === "upsert") {
      const items = Array.isArray(payload) ? payload : [payload];
      const onConflict: string = opts?.onConflict ?? "id";
      const keys = onConflict.split(",").map((s) => s.trim());
      const out: Row[] = [];
      for (const it of items) {
        const idx = all.findIndex((r) => keys.every((k) => r[k] === it[k]));
        if (idx >= 0) {
          all[idx] = { ...all[idx], ...it, updated_at: nowIso() };
          out.push(all[idx]);
        } else {
          const ins = { id: uid(), created_at: nowIso(), ...it };
          all.push(ins);
          out.push(ins);
        }
      }
      persist();
      return { data: out, error: null };
    }
    if (mode === "update") {
      const matched = applyFilter(all, filters);
      for (const r of matched) Object.assign(r, payload, { updated_at: nowIso() });
      persist();
      return { data: matched, error: null };
    }
    if (mode === "delete") {
      const matched = applyFilter(all, filters);
      tables[table] = all.filter((r) => !matched.includes(r));
      persist();
      return { data: matched, error: null };
    }
    // select
    let rows = applyFilter(all, filters);
    if (_order) {
      rows = [...rows].sort((a, b) => {
        const av = a[_order!.col];
        const bv = b[_order!.col];
        if (av === bv) return 0;
        return (av < bv ? -1 : 1) * (_order!.asc ? 1 : -1);
      });
    }
    const count = rows.length;
    if (_limit != null) rows = rows.slice(0, _limit);
    if (_single) return { data: rows[0] ?? null, error: rows[0] ? null : { message: "no rows" } };
    if (_maybeSingle) return { data: rows[0] ?? null, error: null };
    if (_head) return { data: null, error: null, count: _count ? count : undefined };
    return { data: rows, error: null, count: _count ? count : undefined };
  };

  const builder: any = {
    eq(col: string, val: any) { filters.push((r) => r[col] === val); return builder; },
    neq(col: string, val: any) { filters.push((r) => r[col] !== val); return builder; },
    in(col: string, vals: any[]) { filters.push((r) => vals.includes(r[col])); return builder; },
    is(col: string, val: any) { filters.push((r) => r[col] === val); return builder; },
    gte(col: string, val: any) { filters.push((r) => r[col] >= val); return builder; },
    lte(col: string, val: any) { filters.push((r) => r[col] <= val); return builder; },
    gt(col: string, val: any) { filters.push((r) => r[col] > val); return builder; },
    lt(col: string, val: any) { filters.push((r) => r[col] < val); return builder; },
    ilike(col: string, pat: string) {
      const re = new RegExp("^" + pat.replace(/%/g, ".*") + "$", "i");
      filters.push((r) => re.test(String(r[col] ?? "")));
      return builder;
    },
    order(col: string, o?: { ascending?: boolean }) { _order = { col, asc: o?.ascending ?? true }; return builder; },
    limit(n: number) { _limit = n; return builder; },
    range(from: number, to: number) { _limit = Math.max(0, to - from + 1); return builder; },
    single() { _single = true; return Promise.resolve(exec()); },
    maybeSingle() { _maybeSingle = true; return Promise.resolve(exec()); },
    select(_cols?: string, sOpts?: any) {
      if (sOpts?.count) _count = sOpts.count;
      if (sOpts?.head) _head = sOpts.head;
      return builder;
    },
    then(onF: any, onR: any) { return Promise.resolve(exec()).then(onF, onR); },
    catch(onR: any) { return Promise.resolve(exec()).catch(onR); },
    finally(cb: any) { return Promise.resolve(exec()).finally(cb); },
  };
  return builder;
}

// ---------- RPC functions ----------
const rpcHandlers: Record<string, (args: any) => any> = {
  daily_checkin: () => {
    const p = tables.profiles[0];
    const today = new Date().toISOString().slice(0, 10);
    if (p.last_active_date === today) return { ok: false, reason: "already_checked_in", streak: p.streak };
    p.streak = (p.streak ?? 0) + 1;
    p.last_active_date = today;
    const bonus = 20 + Math.min(p.streak, 7) * 5;
    p.xp += bonus;
    p.level = Math.max(1, Math.floor(p.xp / 100) + 1);
    return { ok: true, streak: p.streak, xp: bonus };
  },
  award_xp: ({ p_xp }: any) => {
    tables.profiles[0].xp += p_xp ?? 0;
    return null;
  },
  debit_wallet: ({ p_amount_cents, p_kind, p_counterparty, p_note }: any) => {
    const p = tables.profiles[0];
    if (p.balance_cents < p_amount_cents) return { ok: false };
    p.balance_cents -= p_amount_cents;
    tables.transactions.unshift({ id: uid(), user_id: DEMO_USER_ID, kind: p_kind, amount_cents: -p_amount_cents, counterparty: p_counterparty, note: p_note, meta: {}, created_at: nowIso() });
    return { ok: true, new_balance: p.balance_cents };
  },
  credit_wallet: ({ p_amount_cents, p_kind, p_counterparty, p_note }: any) => {
    const p = tables.profiles[0];
    p.balance_cents += p_amount_cents;
    tables.transactions.unshift({ id: uid(), user_id: DEMO_USER_ID, kind: p_kind, amount_cents: p_amount_cents, counterparty: p_counterparty, note: p_note, meta: {}, created_at: nowIso() });
    return { ok: true };
  },
  transfer_money: ({ p_to_phone, p_amount_cents, p_note }: any) => {
    const p = tables.profiles[0];
    if (p.balance_cents < p_amount_cents) throw new Error("Insufficient balance");
    p.balance_cents -= p_amount_cents;
    const contact = tables.contacts.find((c) => c.phone === p_to_phone);
    tables.transactions.unshift({ id: uid(), user_id: DEMO_USER_ID, kind: "send", amount_cents: -p_amount_cents, counterparty: contact?.name ?? p_to_phone, note: p_note, meta: {}, created_at: nowIso() });
    return { ok: true, new_balance: p.balance_cents };
  },
  claim_mission: ({ p_mission }: any) => {
    const m = tables.missions.find((x) => x.id === p_mission);
    if (!m) throw new Error("Mission not found");
    if (m.completed) throw new Error("Already claimed");
    if (m.progress < m.target) throw new Error("Mission not finished");
    m.completed = true;
    const p = tables.profiles[0];
    p.xp += m.reward_xp;
    if (m.reward_cashback_cents > 0) {
      p.balance_cents += m.reward_cashback_cents;
      tables.transactions.unshift({ id: uid(), user_id: DEMO_USER_ID, kind: "reward", amount_cents: m.reward_cashback_cents, counterparty: "CASh-E Rewards", note: `Mission reward: ${m.title}`, meta: {}, created_at: nowIso() });
    }
    return { ok: true, xp: m.reward_xp, cashback_cents: m.reward_cashback_cents };
  },
  find_recipient: ({ p_phone }: any) => {
    const c = tables.contacts.find((x) => x.phone === p_phone);
    return c ? [{ id: DEMO_USER_ID, name: c.name, avatar_seed: c.name.slice(0, 2).toUpperCase() }] : [];
  },
};

// ---------- Public client ----------
export const supabase: any = {
  from(table: string) {
    return {
      select: (cols?: string, opts?: any) => makeBuilder(table, "select", undefined, opts).select(cols, opts),
      insert: (vals: any) => makeBuilder(table, "insert", vals),
      update: (vals: any) => makeBuilder(table, "update", vals),
      upsert: (vals: any, opts?: any) => makeBuilder(table, "upsert", vals, opts),
      delete: () => makeBuilder(table, "delete"),
    };
  },
  rpc(name: string, args?: any) {
    return Promise.resolve().then(() => {
      const h = rpcHandlers[name];
      if (!h) return { data: null, error: { message: `rpc ${name} not implemented in demo` } };
      try { const data = h(args ?? {}); persist(); return { data, error: null }; }
      catch (e: any) { return { data: null, error: { message: e.message } }; }
    });
  },
  channel() {
    const ch: any = {
      on() { return ch; },
      subscribe() { return ch; },
      unsubscribe() {},
    };
    return ch;
  },
  removeChannel() {},
  auth: {
    async getSession() { return { data: { session: null }, error: null }; },
    async getUser() { return { data: { user: null }, error: null }; },
    onAuthStateChange(_cb: any) {
      return { data: { subscription: { unsubscribe() {} } } };
    },
    async signOut() { return { error: null }; },
  },
};
