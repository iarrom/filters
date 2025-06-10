export function setParam(key, value) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
    params.delete(key);
  } else {
    const encoded = Array.isArray(value) ? value.join(',') : value;
    params.set(key, encoded);
  }
  const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.location.search = params.toString();
  }
}

export function getParam(key) {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

export function removeParam(key) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  params.delete(key);
  const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  if (window.history && window.history.replaceState) {
    window.history.replaceState({}, '', newUrl);
  } else {
    window.location.search = params.toString();
  }
}

function parseValue(val) {
  if (!val) return '';
  const trimmed = val.trim();
  if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
    try {
      return [JSON.parse(trimmed)];
    } catch (_e) {
      return trimmed;
    }
  }
  if (trimmed.includes(',')) {
    return trimmed.split(',').filter((v) => v !== '');
  }
  return trimmed;
}

export function applyParamsToWized(Wized, mapping = {}) {
  if (typeof window === 'undefined') return;
  const params = new URLSearchParams(window.location.search);
  for (const [param, variable] of Object.entries(mapping)) {
    if (params.has(param)) {
      const raw = params.get(param);
      Wized.data.v[variable] = parseValue(raw);
    }
  }
}
