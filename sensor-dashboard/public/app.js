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
  };

  // GPS map (Leaflet)
  const DEFAULT_LAT = 37.3861;
  const DEFAULT_LON = -122.0839;
  const DEFAULT_ZOOM = 13;
  const GPS_INVALID = -999;
  let map = null;
  let marker = null;
  let trailLayer = null;

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
    if (key === 'water_voltage') return 'ADS1 A1 • V21';
    if (key === 'flame_voltage') return 'ADS1 A2';
    if (key === 'gas_voltage') return 'ADS2 A0 • V23';
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

  function applyCurrentData(data) {
    renderCards(data);
    renderFeatureStatus(data);
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

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportData);

  const toggleBtn = document.getElementById('showAllToggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      showAll = !showAll;
      applyCurrentData(lastData);
    });
  }

  fetchCurrent();
  fetchHistory();
  startSSE();
  if (!sseActive) startPolling();

  window.addEventListener('resize', () => drawCharts(historyData));
})();
