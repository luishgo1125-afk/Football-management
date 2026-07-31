import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

async function getShared(key) {
  const { data, error } = await supabase.from('kv_store').select('value').eq('key', key).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error('not found');
  return { key, value: data.value, shared: true };
}

async function setShared(key, value) {
  const { error } = await supabase.from('kv_store').upsert({ key, value, updated_at: new Date().toISOString() });
  if (error) throw error;
  return { key, value, shared: true };
}

async function deleteShared(key) {
  const { error } = await supabase.from('kv_store').delete().eq('key', key);
  if (error) throw error;
  return { key, deleted: true, shared: true };
}

async function listShared(prefix) {
  let query = supabase.from('kv_store').select('key');
  if (prefix) query = query.like('key', `${prefix}%`);
  const { data, error } = await query;
  if (error) throw error;
  return { keys: (data || []).map((r) => r.key), prefix, shared: true };
}

function getLocal(key) {
  const value = localStorage.getItem(key);
  if (value === null) return Promise.reject(new Error('not found'));
  return Promise.resolve({ key, value, shared: false });
}
function setLocal(key, value) {
  localStorage.setItem(key, value);
  return Promise.resolve({ key, value, shared: false });
}
function deleteLocal(key) {
  localStorage.removeItem(key);
  return Promise.resolve({ key, deleted: true, shared: false });
}
function listLocal(prefix) {
  const keys = Object.keys(localStorage).filter((k) => !prefix || k.startsWith(prefix));
  return Promise.resolve({ keys, prefix, shared: false });
}

window.storage = {
  get: (key, shared = false) => (shared ? getShared(key) : getLocal(key)),
  set: (key, value, shared = false) => (shared ? setShared(key, value) : setLocal(key, value)),
  delete: (key, shared = false) => (shared ? deleteShared(key) : deleteLocal(key)),
  list: (prefix, shared = false) => (shared ? listShared(prefix) : listLocal(prefix)),
};