(function () {
  const API = '/api/data';
  const HISTORY_API = '/api/history';
  const POLL_MS = 3000;
  const CHART_POINTS = 500;
  const STALE_MS = 25000;
  const COLORS = {
    chartBg: '#18221b',
    textMuted: '#9eb6a4',
    temp: '#8ecf9d',
    humidity: '#7ab8d4',
    light: '#d9c47a',
    soil: '#b89464',
    water: '#5b9bd5',
    flame: '#d47a7a',
    gas: '#c9a0dc',
    pressure: '#a0c4a8',
    sound: '#8eb4a2',
    trail: '#4f8a65',
    warn: '#c6ad6f',
  };

  // Conditions thresholds for weather-style widgets
  const TEMP_COLD = 10;
  const TEMP_MILD_MAX = 22;
  const TEMP_WARM_MAX = 30;
  const HUMID_DRY_MAX = 35;
  const HUMID_COMFORT_MAX = 65;
  const WATER_LOW_MAX = 1.0;
  const WATER_MID_MAX = 2.0;
  const LIGHT_DARK_MAX = 0.5;
  const LIGHT_DIM_MAX = 1.5;

  function weatherIcon(name, fill) {
    const c = fill || COLORS.textMuted;
    const icons = {
      thermometer: `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>`,
      droplet: `<svg viewBox="0 0 24 24" fill="${c}" opacity="0.9"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
      waterLevel: `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h20v12H2z"/><path d="M6 12v4M12 12v4M18 12v4"/></svg>`,
      sun: `<svg viewBox="0 0 24 24" fill="${c}" opacity="0.9"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`,
      cloud: `<svg viewBox="0 0 24 24" fill="${c}" opacity="0.85"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/></svg>`,
      sunCloud: `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.6"><circle cx="17" cy="10" r="3.5"/><path d="M2 14h16a4 4 0 1 0-1.5-7.7"/></svg>`,
      flame: `<svg viewBox="0 0 24 24" fill="${c}" opacity="0.9"><path d="M12 23c0 0 8-4 8-12 0-4-2-6-2-6-2 2-2 4-2 6 0 3 2 6 4 8-2 2-4 3-6 3-2 0-4-1-6-3 2-2 4-5 4-8 0-2 0-4-2-6 0 0-2 2-2 6 0 8 8 12 8 12z"/></svg>`,
      gas: `<svg viewBox="0 0 24 24" fill="none" stroke="${c}" stroke-width="1.8"><path d="M12 2v4M6 6l2.8 2.8M4 12h4M6 18l2.8-2.8M12 22v-4M18 18l-2.8-2.8M20 12h-4M18 6l-2.8 2.8"/><circle cx="12" cy="12" r="3"/></svg>`,
    };
    return icons[name] || '';
  }

  // Alert thresholds: flame drops near fire; gas rises with gas; water rises when wet (immersion)
  const FLAME_ALERT_MAX_V = 2.0;
  const GAS_ALERT_MIN_V = 0.8;
  const WATER_ALERT_MIN_V = 0.75;   // immersion trigger (V) — sensor reads higher when probes wet
  const WATER_CLEAR_MAX_V = 0.55;   // below this = dry (hysteresis on server for LED)

  function isFireDetected(v) { return v != null && v < FLAME_ALERT_MAX_V; }
  function isGasDetected(v) { return v != null && v >= GAS_ALERT_MIN_V; }
  function isWaterDetected(v) { return v != null && v >= WATER_ALERT_MIN_V; }
  function waterIntensity(v) {
    if (v == null || v < WATER_ALERT_MIN_V) return 0;
    const t = Math.min(v, 2.5);
    return Math.round(80 + (t - WATER_ALERT_MIN_V) / (2.5 - WATER_ALERT_MIN_V) * 175);
  }

  function getTempCondition(c) {
    if (c == null) return { label: '—', icon: 'thermometer', color: COLORS.textMuted };
    if (c < TEMP_COLD) return { label: 'Cold', icon: 'thermometer', color: '#7ab8d4' };
    if (c <= TEMP_MILD_MAX) return { label: 'Mild', icon: 'thermometer', color: COLORS.temp };
    if (c <= TEMP_WARM_MAX) return { label: 'Warm', icon: 'thermometer', color: '#d9c47a' };
    return { label: 'Hot', icon: 'thermometer', color: '#d47a7a' };
  }

  function getHumidityCondition(h) {
    if (h == null) return { label: '—', icon: 'droplet', color: COLORS.textMuted };
    if (h < HUMID_DRY_MAX) return { label: 'Dry', icon: 'droplet', color: '#d9c47a' };
    if (h <= HUMID_COMFORT_MAX) return { label: 'Comfortable', icon: 'droplet', color: COLORS.humidity };
    return { label: 'Humid', icon: 'droplet', color: '#5b9bd5' };
  }

  function getWaterLevelCondition(v) {
    if (v == null) return { label: '—', icon: 'waterLevel', color: COLORS.textMuted };
    if (v < WATER_LOW_MAX) return { label: 'Dry', icon: 'waterLevel', color: COLORS.textMuted };
    if (v <= WATER_MID_MAX) return { label: 'Immersion', icon: 'waterLevel', color: COLORS.water };
    return { label: 'High', icon: 'waterLevel', color: '#4a8bc2' };
  }

  function getLightCondition(v) {
    if (v == null) return { label: '—', icon: 'sun', color: COLORS.textMuted };
    if (v < LIGHT_DARK_MAX) return { label: 'Dark', icon: 'cloud', color: COLORS.textMuted };
    if (v <= LIGHT_DIM_MAX) return { label: 'Dim', icon: 'sunCloud', color: '#b8a86a' };
    return { label: 'Bright', icon: 'sun', color: COLORS.light };
  }

  // GPS map (Leaflet)
  const DEFAULT_LAT = 37.3861;
  const DEFAULT_LON = -122.0839;
  const DEFAULT_ZOOM = 13;
  const GPS_INVALID = -999;
  let map = null;
  let marker = null;
  let trailLayer = null;

  // Level bar (min/max) for cards that show a range. Omit for on/off or non-range values.
  const LEVEL_BARS = {
    humidity: { min: 0, max: 100, color: COLORS.humidity },
    soil_moisture: { min: 0, max: 100, color: COLORS.soil },
    water_voltage: { min: 0, max: 3.3, color: COLORS.water },
    light_voltage: { min: 0, max: 3.3, color: COLORS.light },
    sound_adc_voltage: { min: 0, max: 3.3, color: COLORS.sound },
    sound_ads1115_voltage: { min: 0, max: 3.3, color: COLORS.sound },
    flame_voltage: { min: 0, max: 3.3, color: COLORS.flame, invert: true },
    gas_voltage: { min: 0, max: 3.3, color: COLORS.gas },
    pressure_hpa: { min: 980, max: 1040, color: COLORS.pressure },
    servo_angle: { min: 0, max: 180, color: COLORS.trail },
  };

  function levelBarPct(key, raw) {
    if (raw == null) return null;
    const cfg = LEVEL_BARS[key];
    if (!cfg) return null;
    let pct = (raw - cfg.min) / (cfg.max - cfg.min);
    if (cfg.invert) pct = 1 - pct;
    return Math.max(0, Math.min(100, pct * 100));
  }

  const FIELDS = [
    { key: 'temperature_c', label: 'Temperature', unit: '°C', format: (v) => v != null ? v.toFixed(1) : null },
    { key: 'temperature_f', label: 'Temperature (°F)', unit: '°F', format: (v) => v != null ? v.toFixed(1) : null, disabled: true },
    { key: 'humidity', label: 'Humidity', unit: '%', format: (v) => v != null ? v.toFixed(1) : null },
    { key: 'pressure_hpa', label: 'Barometer', unit: 'hPa', format: (v) => v != null ? v.toFixed(1) : null },
    { key: 'soil_moisture', label: 'Soil Moisture', unit: '%', format: (v) => v != null ? v.toFixed(0) : null },
    { key: 'water_voltage', label: 'Water Level', unit: 'V', format: (v) => v != null ? v.toFixed(2) : null },
    { key: 'light_voltage', label: 'Ambient Light', unit: 'V', format: (v) => v != null ? v.toFixed(2) : null },
    { key: 'sound_adc_voltage', label: 'Ambient Sound', unit: 'V', format: (v) => v != null ? v.toFixed(2) : null },
    { key: 'flame_voltage', label: 'Flame Detector', unit: 'V', format: (v) => v != null ? v.toFixed(2) : null },
    { key: 'gas_voltage', label: 'Gas / Smoke', unit: 'V', format: (v) => v != null ? v.toFixed(2) : null },
    { key: 'motion_detected', label: 'Motion', unit: '', format: (v) => v === 1 ? 'Motion!' : v === 0 ? 'Clear' : null, cardClass: 'door' },
    { key: 'gps_altitude', label: 'Altitude', unit: 'm', format: (v) => v != null ? v.toFixed(0) : null },
    { key: 'gps_speed', label: 'Speed', unit: 'm/s', format: (v) => v != null ? v.toFixed(2) : null },
    { key: 'gps_satellites', label: 'GPS Satellites', unit: '', format: (v) => v != null ? Math.round(v) : null },
    { key: 'servo_angle', label: 'Servo', unit: '°', format: (v) => v != null ? Math.round(v) : null },
    { key: 'rgb_state', label: 'RGB LED', unit: '', format: (v) => v != null ? String(v) : null },
    { key: 'soil_voltage', label: 'Soil Sensor (raw)', unit: 'V', format: (v) => v != null ? v.toFixed(2) : null, disabled: true },
    { key: 'sound_adc_raw', label: 'Sound ADC (raw)', unit: '', format: (v) => v != null ? Math.round(v) : null, disabled: true },
    { key: 'sound_ads1115_voltage', label: 'Sound ADS1115 (raw)', unit: 'V', format: (v) => v != null ? v.toFixed(2) : null, disabled: true },
    { key: 'door_state', label: 'Door', unit: '', format: (v) => v === 1 ? 'Closed' : v === 0 ? 'Open' : null, cardClass: 'door', disabled: true },
  ];

  let showAll = false;

  let historyData = [];

  function el(tag, attrs, children) {
    const e = document.createElement(tag);
    if (attrs) Object.assign(e, attrs);
    if (attrs && attrs.className) e.className = attrs.className;
    if (children) children.forEach(c => { if (c != null) e.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c))); });
    return e;
  }

  function formatTime(iso) {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch (_) { return iso; }
  }

  function dataIsFresh(updatedAt) {
    if (!updatedAt) return false;
    const ts = Date.parse(updatedAt);
    if (Number.isNaN(ts)) return false;
    return (Date.now() - ts) <= STALE_MS;
  }

  function isValidGps(lat, lon) {
    if (lat == null || lon == null) return false;
    if (typeof lat === 'number' && (lat === GPS_INVALID || lat < -90 || lat > 90)) return false;
    if (typeof lon === 'number' && (lon === GPS_INVALID || lon < -180 || lon > 180)) return false;
    return true;
  }

  function initMap() {
    if (map) return;
    const mapEl = document.getElementById('map');
    const noFixEl = document.getElementById('mapNoFix');
    if (!mapEl || !noFixEl) return;
    map = L.map('map').setView([DEFAULT_LAT, DEFAULT_LON], DEFAULT_ZOOM);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    marker = L.marker([DEFAULT_LAT, DEFAULT_LON]).addTo(map);
    trailLayer = L.layerGroup().addTo(map);
    mapEl.style.display = 'block';
    noFixEl.style.display = 'none';
  }

  function updateMap(data, history) {
    const lat = data.gps_latitude;
    const lon = data.gps_longitude;
    const hasFix = isValidGps(lat, lon);
    const mapEl = document.getElementById('map');
    const noFixEl = document.getElementById('mapNoFix');

    if (!hasFix) {
      if (mapEl) mapEl.style.display = 'none';
      if (noFixEl) noFixEl.style.display = 'flex';
      return;
    }

    initMap();
    if (mapEl) mapEl.style.display = 'block';
    if (noFixEl) noFixEl.style.display = 'none';
    if (map) {
      map.invalidateSize(true);
    }

    marker.setLatLng([lat, lon]);
    map.setView([lat, lon], map.getZoom());

    // Trail from history (points with valid lat/lon)
    if (trailLayer && history && history.length > 1) {
      trailLayer.clearLayers();
      const points = history
        .map(p => (p.gps_latitude != null && p.gps_longitude != null && isValidGps(p.gps_latitude, p.gps_longitude)) ? [p.gps_latitude, p.gps_longitude] : null)
        .filter(Boolean);
      if (points.length > 1) {
        const polyline = L.polyline(points, { color: COLORS.trail, weight: 3, opacity: 0.8 });
        trailLayer.addLayer(polyline);
      }
    }
  }

  function isHidden(f, data) {
    if (showAll) return false;
    if (f.disabled) return true;
    if (data[f.key] == null) return true;
    return false;
  }

  function renderCards(data) {
    const container = document.getElementById('cards');
    container.innerHTML = '';
    const updatedEl = document.getElementById('updated');
    updatedEl.textContent = 'Last update: ' + formatTime(data.updated_at);

    const gpsKeys = ['gps_latitude', 'gps_longitude', 'gps_altitude', 'gps_speed', 'gps_satellites'];
    const hasGps = gpsKeys.some(k => data[k] != null);

    let hiddenCount = 0;
    FIELDS.forEach(f => {
      if (isHidden(f, data)) { hiddenCount++; return; }
      const raw = data[f.key];
      const display = f.format(raw);

      const card = el('div', { className: 'card' + (f.cardClass ? ' ' + f.cardClass : '') + (f.disabled ? ' disabled-card' : '') });
      const cardHead = el('div', { className: 'card-head' });
      cardHead.appendChild(el('h3', {}, [f.label]));
      const src = getSourceBadgeText(data, f.key);
      if (src) cardHead.appendChild(el('span', { className: 'source-badge' }, [src]));
      card.appendChild(cardHead);
      const valueSpan = el('span', { className: 'value' + (display === null ? ' unknown' : (f.key === 'door_state' ? ' ' + (raw === 1 ? 'closed' : 'open') : '')) }, [display !== null ? display : '—']);
      card.appendChild(valueSpan);
      if (f.unit && display !== null) card.appendChild(el('span', { className: 'unit' }, [f.unit]));
      const pct = levelBarPct(f.key, raw);
      if (pct != null) {
        const barTrack = el('div', { className: 'card-level-bar' });
        const barFill = el('div', { className: 'card-level-fill', style: 'width:' + pct + '%;background:' + (LEVEL_BARS[f.key].color) + ';' });
        barTrack.appendChild(barFill);
        card.appendChild(barTrack);
      }
      if (f.key === 'water_voltage') {
        const hint = el('div', { className: 'card-hint', style: 'font-size:10px;color:var(--text-muted);margin-top:4px;' });
        hint.textContent = 'Dry < 0.75 V · Immersion ≥ 0.75 V';
        card.appendChild(hint);
      }
      container.appendChild(card);
    });

    if (hasGps) {
      const gpsCard = el('div', { className: 'card wide' });
      gpsCard.appendChild(el('h3', {}, ['Location']));
      gpsCard.appendChild(el('div', { className: 'value' }, [
        (data.gps_latitude != null && data.gps_longitude != null)
          ? data.gps_latitude.toFixed(5) + ', ' + data.gps_longitude.toFixed(5)
          : '—'
      ]));
      gpsCard.appendChild(el('div', { className: 'sub' }, [
        'Alt: ' + (data.gps_altitude != null ? data.gps_altitude.toFixed(0) + ' m' : '—') +
        ' · Speed: ' + (data.gps_speed != null ? data.gps_speed.toFixed(2) + ' m/s' : '—') +
        ' · SIV: ' + (data.gps_satellites != null ? data.gps_satellites : '—')
      ]));
      container.appendChild(gpsCard);
    }

    const toggleEl = document.getElementById('showAllToggle');
    if (toggleEl) {
      if (hiddenCount > 0 && !showAll) {
        toggleEl.textContent = 'Show ' + hiddenCount + ' hidden sensor' + (hiddenCount > 1 ? 's' : '');
        toggleEl.style.display = 'inline-block';
      } else if (showAll) {
        toggleEl.textContent = 'Hide inactive sensors';
        toggleEl.style.display = 'inline-block';
      } else {
        toggleEl.style.display = 'none';
      }
    }
  }

  function getSourceBadgeText(data, key) {
    if (key === 'temperature_c' || key === 'temperature_f' || key === 'humidity') return 'Si7021 onboard';
    if (key === 'sound_adc_raw' || key === 'sound_adc_voltage') return 'Board ADC A0';
    if (key === 'sound_ads1115_voltage') return 'ADS1115 A1';
    if (key === 'light_voltage') return 'ADS1 A3 • V22';
    if (key === 'soil_voltage') return 'ADS1 A0 • V20';
    if (key === 'water_voltage') return 'ADS1 A1 • V23';
    if (key === 'flame_voltage') return 'ADS1 A2';
    if (key === 'gas_voltage') return 'ADS2 A0 • V28';
    if (key === 'soil_moisture') return data.soil_voltage != null ? 'Derived from A0 • V26' : 'V26';
    if (key === 'pressure_hpa') return 'BMP180 I2C • V35';
    if (key === 'motion_detected') return 'PIR GPIO12 • V36';
    if (key.startsWith('gps_')) return 'SAM-M8Q I2C';
    if (key === 'door_state') return 'GPIO16 • V25 (disabled)';
    if (key === 'servo_angle') return 'GPIO15 • V24/V17';
    return '';
  }

  function renderFeatureStatus(data) {
    const container = document.getElementById('featureChips');
    if (!container) return;
    container.innerHTML = '';
    const fresh = dataIsFresh(data.updated_at);
    const features = [
      { label: 'Temperature', present: data.temperature_c != null, detail: 'Si7021' },
      { label: 'Humidity', present: data.humidity != null, detail: 'Si7021' },
      { label: 'Barometer', present: data.pressure_hpa != null, detail: 'BMP180' },
      { label: 'Soil Moisture', present: data.soil_moisture != null || data.soil_voltage != null, detail: 'ADS1 A0' },
      { label: 'Water Level', present: data.water_voltage != null, detail: 'ADS1 A1' },
      { label: 'Ambient Light', present: data.light_voltage != null, detail: 'ADS1 A3' },
      { label: 'Ambient Sound', present: data.sound_adc_voltage != null || data.sound_adc_raw != null, detail: 'Board ADC' },
      { label: 'Flame Detector', present: data.flame_voltage != null, detail: 'ADS1 A2' },
      { label: 'Gas / Smoke', present: data.gas_voltage != null, detail: 'MQ2' },
      { label: 'Motion', present: data.motion_detected != null, detail: 'PIR' },
      { label: 'GPS', present: isValidGps(data.gps_latitude, data.gps_longitude), detail: 'SAM-M8Q' },
      { label: 'Servo', present: data.servo_angle != null, detail: 'GPIO15' },
      { label: 'Door', present: data.door_state != null, detail: 'GPIO16', disabled: true },
    ];
    features.forEach(f => {
      if (!showAll && f.disabled) return;
      const state = !f.present ? 'inactive' : (fresh ? 'active' : 'stale');
      const stateText = state === 'active' ? 'Active' : (state === 'stale' ? 'Stale' : 'Inactive');
      const label = f.label + ' · ' + stateText + (f.detail ? ' (' + f.detail + ')' : '') + (f.disabled ? ' [disabled]' : '');
      const chip = el('span', { className: 'feature-chip ' + state }, [label]);
      container.appendChild(chip);
    });
  }

  function drawSingleSeriesChart(canvas, history, key, color, minLabelSuffix, noDataId) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = canvas.offsetHeight;
    const padding = { top: 12, right: 12, bottom: 24, left: 44 };

    ctx.fillStyle = COLORS.chartBg;
    ctx.fillRect(0, 0, w, h);

    const noDataEl = document.getElementById(noDataId);
    if (!history || history.length < 2) {
      if (noDataEl) noDataEl.style.display = 'block';
      return;
    }
    if (noDataEl) noDataEl.style.display = 'none';

    const slice = history.slice(-CHART_POINTS);
    const vals = slice.map(p => p[key]).filter(v => v != null);
    if (vals.length === 0) {
      if (noDataEl) noDataEl.style.display = 'block';
      return;
    }
    const min = Math.min(...vals);
    const max = Math.max(...vals);

    const graphW = w - padding.left - padding.right;
    const graphH = h - padding.top - padding.bottom;
    const x = i => padding.left + (i / (slice.length - 1)) * graphW;
    const y = v => padding.top + graphH - ((v - min) / (max - min || 1)) * graphH;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    let started = false;
    slice.forEach((p, i) => {
      if (p[key] == null) return;
      const px = x(i);
      const py = y(p[key]);
      if (!started) { ctx.moveTo(px, py); started = true; }
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    ctx.fillStyle = COLORS.textMuted;
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.textAlign = 'right';
    ctx.fillText(max.toFixed(2) + ' ' + minLabelSuffix, w - padding.right + 2, padding.top + 10);
    ctx.fillText(min.toFixed(2) + ' ' + minLabelSuffix, w - padding.right + 2, padding.top + graphH + 4);
  }

  function drawCharts(history) {
    const soundADC = history.map(p => p.sound_adc_voltage).filter(v => v != null);
    const soundKey = soundADC.length > 0 ? 'sound_adc_voltage' : 'sound_ads1115_voltage';
    drawSingleSeriesChart(document.getElementById('chartTemp'), history, 'temperature_c', COLORS.temp, '°C', 'chartTempNoData');
    drawSingleSeriesChart(document.getElementById('chartHumidity'), history, 'humidity', COLORS.humidity, '%', 'chartHumidityNoData');
    drawSingleSeriesChart(document.getElementById('chartLight'), history, 'light_voltage', COLORS.light, 'V', 'chartLightNoData');
    drawSingleSeriesChart(document.getElementById('chartSoil'), history, 'soil_voltage', COLORS.soil, 'V', 'chartSoilNoData');
    drawSingleSeriesChart(document.getElementById('chartWater'), history, 'water_voltage', COLORS.water, 'V', 'chartWaterNoData');
    drawSingleSeriesChart(document.getElementById('chartFlame'), history, 'flame_voltage', COLORS.flame, 'V', 'chartFlameNoData');
    drawSingleSeriesChart(document.getElementById('chartGas'), history, 'gas_voltage', COLORS.gas, 'V', 'chartGasNoData');
    drawSingleSeriesChart(document.getElementById('chartPressure'), history, 'pressure_hpa', COLORS.pressure, 'hPa', 'chartPressureNoData');
    drawSingleSeriesChart(document.getElementById('chartSound'), history, soundKey, COLORS.sound, 'V', 'chartSoundNoData');
  }

  function renderAlertWidgets(data) {
    const container = document.getElementById('alertWidgets');
    if (!container) return;
    container.innerHTML = '';

    const fire = isFireDetected(data.flame_voltage);
    const gas = isGasDetected(data.gas_voltage);
    const water = isWaterDetected(data.water_voltage);

    const items = [
      { id: 'fire', label: 'Fire', status: fire ? 'Detected' : 'OK', icon: 'flame', color: fire ? '#d47a7a' : COLORS.textMuted, triggered: fire },
      { id: 'gas', label: 'Gas', status: gas ? 'Detected' : 'OK', icon: 'gas', color: gas ? COLORS.warn : COLORS.textMuted, triggered: gas, extraClass: 'gas' },
      { id: 'water', label: 'Water', status: water ? 'Detected' : 'OK', icon: 'waterLevel', color: water ? COLORS.water : COLORS.textMuted, triggered: water, extraClass: 'water' },
    ];

    items.forEach(it => {
      const w = el('div', { className: 'alert-widget' + (it.triggered ? ' triggered' : '') + (it.extraClass ? ' ' + it.extraClass : '') });
      const iconBox = el('div', { className: 'alert-widget-icon', innerHTML: weatherIcon(it.icon, it.color) });
      const body = el('div', { className: 'alert-widget-body' });
      body.appendChild(el('div', { className: 'alert-widget-label' }, [it.label]));
      body.appendChild(el('div', { className: 'alert-widget-status' }, [it.status]));
      w.appendChild(iconBox);
      w.appendChild(body);
      container.appendChild(w);
    });
  }

  function renderWeatherWidgets(data) {
    const container = document.getElementById('weatherWidgets');
    if (!container) return;
    container.innerHTML = '';

    const temp = getTempCondition(data.temperature_c);
    const humidity = getHumidityCondition(data.humidity);
    const water = getWaterLevelCondition(data.water_voltage);
    const light = getLightCondition(data.light_voltage);

    const widgets = [
      { label: 'Temperature', condition: temp, value: data.temperature_c != null ? data.temperature_c.toFixed(1) + ' °C' : null },
      { label: 'Humidity', condition: humidity, value: data.humidity != null ? data.humidity.toFixed(0) + '%' : null },
      { label: 'Water Level', condition: water, value: data.water_voltage != null ? data.water_voltage.toFixed(2) + ' V' : null },
      { label: 'Light', condition: light, value: data.light_voltage != null ? data.light_voltage.toFixed(2) + ' V' : null },
    ];

    widgets.forEach(w => {
      const noData = w.condition.label === '—';
      const widget = el('div', { className: 'weather-widget' + (noData ? ' no-data' : '') });
      const iconBox = el('div', { className: 'weather-widget-icon', innerHTML: weatherIcon(w.condition.icon, w.condition.color) });
      const body = el('div', { className: 'weather-widget-body' });
      body.appendChild(el('div', { className: 'weather-widget-label' }, [w.label]));
      body.appendChild(el('div', { className: 'weather-widget-condition' }, [w.condition.label]));
      if (w.value) body.appendChild(el('div', { className: 'weather-widget-value' }, [w.value]));
      widget.appendChild(iconBox);
      widget.appendChild(body);
      container.appendChild(widget);
    });
  }

  function applyCurrentData(data) {
    renderCards(data);
    renderFeatureStatus(data);
    renderWeatherWidgets(data);
    renderAlertWidgets(data);
    updateMap(data, historyData);
  }

  function fetchCurrent() {
    return fetch(API)
      .then(r => r.json())
      .then(data => applyCurrentData(data))
      .catch(err => { console.error('fetchCurrent error:', err); document.getElementById('updated').textContent = 'Last update: (error)'; });
  }

  function fetchHistory() {
    return fetch(HISTORY_API + '?limit=' + CHART_POINTS)
      .then(r => r.json())
      .then(data => {
        historyData = data;
        drawCharts(historyData);
      })
      .catch(() => drawCharts([]));
  }

  let pollTimer = null;
  let sseActive = false;

  function startSSE() {
    const es = new EventSource('/api/events');
    es.addEventListener('connected', () => {
      sseActive = true;
      if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
      const dot = document.getElementById('liveDot');
      if (dot) dot.style.display = 'inline-block';
    });
    es.addEventListener('update', (e) => {
      try {
        const data = JSON.parse(e.data);
        applyCurrentData(data);
      } catch (_) {}
    });
    es.addEventListener('history_point', (e) => {
      try {
        const point = JSON.parse(e.data);
        historyData.push(point);
        if (historyData.length > CHART_POINTS) historyData.shift();
        drawCharts(historyData);
      } catch (_) {}
    });
    es.onerror = () => {
      sseActive = false;
      es.close();
      const dot = document.getElementById('liveDot');
      if (dot) dot.style.display = 'none';
      if (!pollTimer) startPolling();
      setTimeout(startSSE, 5000);
    };
  }

  function startPolling() {
    function tick() { fetchCurrent(); fetchHistory(); }
    tick();
    pollTimer = setInterval(tick, POLL_MS);
  }

  let lastData = {};

  const origApply = applyCurrentData;
  applyCurrentData = function (data) {
    lastData = data;
    origApply(data);
  };

  function exportData() {
    const btn = document.getElementById('exportBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Exporting…'; }
    Promise.all([
      fetch(API).then(r => r.json()),
      fetch(HISTORY_API + '?limit=500').then(r => r.json())
    ]).then(([current, history]) => {
      const payload = {
        exported_at: new Date().toISOString(),
        current: current,
        history: history
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'field-monitor-export-' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.json';
      a.click();
      URL.revokeObjectURL(a.href);
    }).catch(() => {
      if (btn) { btn.disabled = false; btn.textContent = 'Export data'; }
    }).finally(() => {
      if (btn) { btn.disabled = false; btn.textContent = 'Export data'; }
    });
  }

  function exportCSV() {
    const btn = document.getElementById('exportCsvBtn');
    if (btn) { btn.disabled = true; btn.textContent = 'Exporting…'; }
    fetch(HISTORY_API + '?limit=2000').then(r => r.json()).then(history => {
      if (!history.length) { alert('No history data to export.'); return; }
      const cols = Object.keys(history[0]);
      const rows = [cols.join(',')];
      history.forEach(row => {
        rows.push(cols.map(c => {
          const v = row[c];
          if (v == null) return '';
          if (typeof v === 'string' && (v.includes(',') || v.includes('"'))) return '"' + v.replace(/"/g, '""') + '"';
          return String(v);
        }).join(','));
      });
      const blob = new Blob([rows.join('\n')], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'field-monitor-' + new Date().toISOString().slice(0, 19).replace(/:/g, '-') + '.csv';
      a.click();
      URL.revokeObjectURL(a.href);
    }).catch(() => {}).finally(() => {
      if (btn) { btn.disabled = false; btn.textContent = 'Export CSV'; }
    });
  }

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportData);

  const exportCsvBtn = document.getElementById('exportCsvBtn');
  if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportCSV);

  const toggleBtn = document.getElementById('showAllToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      showAll = !showAll;
      applyCurrentData(lastData);
    });
  }

  const alertLedToggle = document.getElementById('alertLedToggle');
  if (alertLedToggle) {
    fetch('/api/led-prefs')
      .then(r => r.json())
      .then(prefs => { alertLedToggle.checked = !!prefs.alertLedEnabled; })
      .catch(() => {});
    alertLedToggle.addEventListener('change', () => {
      fetch('/api/led-prefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertLedEnabled: alertLedToggle.checked }),
      }).catch(() => {});
    });
  }

  fetchCurrent();
  fetchHistory();
  startSSE();
  if (!sseActive) startPolling();

  window.addEventListener('resize', () => drawCharts(historyData));
})();
