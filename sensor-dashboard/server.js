/**
 * Sensor Dashboard — HTTP API + SSE real-time push + static dashboard
 * Accepts POST /api/data (ingest), serves GET /api/data (current), GET /api/history (chart),
 * and GET /api/events (SSE stream for real-time browser updates).
 * Updated 2026-03-15: file-based persistence, expanded history, SSE live push.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const MAX_HISTORY = 2000;
const SAVE_INTERVAL_MS = 10000;
const API_KEY = process.env.SENSOR_API_KEY || null;
const DATA_DIR = path.join(__dirname, 'data');
const CURRENT_FILE = path.join(DATA_DIR, 'current.json');
const HISTORY_FILE = path.join(DATA_DIR, 'history.json');

const app = express();
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// --- Ensure data directory ---
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// --- Default state ---
function freshCurrent() {
  return {
    updated_at: null,
    temperature_c: null, temperature_f: null, humidity: null,
    temperature_c_2: null, temperature_f_2: null, humidity_2: null,
    sound_adc_raw: null, sound_adc_voltage: null, sound_ads1115_voltage: null,
    light_voltage: null, soil_voltage: null, water_voltage: null,
    flame_voltage: null, gas_voltage: null,
    door_state: null, soil_moisture: null,
    gps_latitude: null, gps_longitude: null, gps_altitude: null,
    gps_speed: null, gps_satellites: null,
    servo_angle: null, rgb_state: null,
    pressure_hpa: null, motion_detected: null,
  };
}

// --- Load persisted state ---
let current = freshCurrent();
let history = [];

function loadState() {
  try {
    if (fs.existsSync(CURRENT_FILE)) {
      const saved = JSON.parse(fs.readFileSync(CURRENT_FILE, 'utf8'));
      const base = freshCurrent();
      for (const k of Object.keys(base)) {
        if (saved[k] !== undefined) base[k] = saved[k];
      }
      if (saved.updated_at) base.updated_at = saved.updated_at;
      current = base;
      console.log(`Loaded current state from ${CURRENT_FILE} (updated: ${current.updated_at})`);
    }
  } catch (e) {
    console.error('Failed to load current.json:', e.message);
  }
  try {
    if (fs.existsSync(HISTORY_FILE)) {
      const arr = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
      if (Array.isArray(arr)) {
        history = arr.slice(-MAX_HISTORY);
        console.log(`Loaded ${history.length} history points from ${HISTORY_FILE}`);
      }
    }
  } catch (e) {
    console.error('Failed to load history.json:', e.message);
  }
}

let dirty = false;
const sseClients = new Set();

function broadcastSSE(eventName, data) {
  const msg = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) {
    res.write(msg);
  }
}

function saveState() {
  if (!dirty) return;
  try {
    fs.writeFileSync(CURRENT_FILE, JSON.stringify(current, null, 2));
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history));
    dirty = false;
  } catch (e) {
    console.error('Failed to save state:', e.message);
  }
}

loadState();
setInterval(saveState, SAVE_INTERVAL_MS);
process.on('SIGINT', () => { saveState(); process.exit(0); });
process.on('SIGTERM', () => { saveState(); process.exit(0); });

// --- Key mapping ---
const historyKeys = [
  'temperature_c', 'temperature_f', 'humidity',
  'light_voltage', 'sound_adc_voltage', 'sound_ads1115_voltage',
  'soil_moisture', 'soil_voltage', 'water_voltage',
  'flame_voltage', 'gas_voltage', 'pressure_hpa',
  'motion_detected', 'gps_latitude', 'gps_longitude',
];

function toSnakeCase(k) {
  return String(k).trim().replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
}

const KEY_MAP = {
  temperature_c: 'temperature_c', temperature_f: 'temperature_f', humidity: 'humidity',
  temperature_c_2: 'temperature_c_2', temperature_f_2: 'temperature_f_2', humidity_2: 'humidity_2',
  sound_adc_raw: 'sound_adc_raw', sound_adc_voltage: 'sound_adc_voltage',
  sound_ads1115_voltage: 'sound_ads1115_voltage',
  light_voltage: 'light_voltage', soil_voltage: 'soil_voltage',
  water_voltage: 'water_voltage', flame_voltage: 'flame_voltage', gas_voltage: 'gas_voltage',
  door_state: 'door_state', soil_moisture: 'soil_moisture',
  gps_latitude: 'gps_latitude', gps_longitude: 'gps_longitude',
  gps_altitude: 'gps_altitude', gps_speed: 'gps_speed', gps_satellites: 'gps_satellites',
  servo_angle: 'servo_angle', rgb_state: 'rgb_state',
  pressure_hpa: 'pressure_hpa', motion_detected: 'motion_detected',
};

const BLYNK_PIN_MAP = {
  0: 'sound_adc_raw', 5: 'temperature_f', 6: 'temperature_c', 7: 'humidity',
  8: 'sound_adc_voltage', 20: 'soil_voltage', 21: 'water_voltage',
  22: 'light_voltage', 23: 'gas_voltage', 25: 'door_state', 26: 'soil_moisture',
  30: 'gps_latitude', 31: 'gps_longitude', 32: 'gps_altitude',
  33: 'gps_speed', 34: 'gps_satellites', 35: 'pressure_hpa', 36: 'motion_detected',
  24: 'servo_angle', 17: 'servo_angle',
};

function parsePayload(body) {
  const out = {};
  for (const [key, value] of Object.entries(body)) {
    if (value === undefined || value === null) continue;
    const n = toSnakeCase(key);
    const dest = KEY_MAP[n];
    if (dest) out[dest] = dest === 'rgb_state' ? value : Number(value);
  }
  return out;
}

function mergeCurrent(payload) {
  const ts = new Date().toISOString();
  Object.assign(current, payload, { updated_at: ts });

  const point = { t: ts };
  historyKeys.forEach(k => { if (current[k] != null) point[k] = current[k]; });
  if (Object.keys(point).length > 1) {
    history.push(point);
    if (history.length > MAX_HISTORY) history.shift();
  }
  dirty = true;
  broadcastSSE('update', current);
  broadcastSSE('history_point', point);
}

// --- Routes ---

function handleIngest(req, res) {
  if (API_KEY) {
    const key = req.get('x-api-key') || req.query.api_key;
    if (key !== API_KEY) return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  const payload = parsePayload(req.body || {});
  if (Object.keys(payload).length === 0) {
    return res.status(400).json({ error: 'No recognized sensor fields in JSON body' });
  }
  mergeCurrent(payload);
  res.status(202).json({ ok: true, updated_at: current.updated_at });
}

function handleBlynkWebhook(req, res) {
  if (API_KEY) {
    const key = req.get('x-api-key') || req.query.api_key || (req.body && req.body.api_key);
    if (key !== API_KEY) return res.status(401).json({ error: 'Invalid or missing API key' });
  }
  const body = req.body || {};
  const q = req.query || {};
  const pin = body.device_pin != null ? Number(body.device_pin) : (body.pin != null ? Number(body.pin) : q.device_pin != null ? Number(q.device_pin) : q.pin != null ? Number(q.pin) : null);
  const value = body.device_pinValue != null ? body.device_pinValue : body.pinValue ?? q.device_pinValue ?? q.pinValue;

  if (pin != null && value !== undefined && value !== '') {
    const key = BLYNK_PIN_MAP[pin];
    if (key) {
      const num = key === 'rgb_state' ? value : Number(value);
      if (!Number.isNaN(num) || key === 'rgb_state') {
        mergeCurrent({ [key]: key === 'rgb_state' ? value : num });
        return res.status(202).json({ ok: true, updated_at: current.updated_at, pin, key });
      }
    }
    return res.status(202).json({ ok: true, updated_at: current.updated_at, pin, skipped: 'unknown pin' });
  }
  const payload = parsePayload(body);
  if (Object.keys(payload).length > 0) {
    mergeCurrent(payload);
    return res.status(202).json({ ok: true, updated_at: current.updated_at });
  }
  return res.status(400).json({ error: 'Missing device_pin + device_pinValue or recognized sensor fields' });
}

app.post('/api/data', handleIngest);
app.post('/ingest', handleIngest);
app.post('/api/webhook/blynk', handleBlynkWebhook);
app.get('/api/webhook/blynk', handleBlynkWebhook);

app.get('/api/data', (_req, res) => res.json(current));

app.get('/api/history', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || 500, MAX_HISTORY);
  res.json(history.slice(-limit));
});

app.get('/api/events', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write(`event: connected\ndata: ${JSON.stringify({ updated_at: current.updated_at })}\n\n`);
  sseClients.add(res);
  req.on('close', () => sseClients.delete(res));
});

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Sensor dashboard: http://localhost:${PORT}`);
  console.log(`Data persistence: ${DATA_DIR} (saves every ${SAVE_INTERVAL_MS / 1000}s)`);
  if (API_KEY) console.log('POST /api/data requires X-API-Key header.');
});
