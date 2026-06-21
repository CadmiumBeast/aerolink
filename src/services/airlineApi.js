const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function parseResponseBody(text) {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {}),
    },
  });

  const payload = parseResponseBody(await response.text());

  if (!response.ok) {
    const message = payload?.message || payload?.error || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export function getPorts() {
  return requestJson('/ports');
}

export function createPort(port) {
  return requestJson('/ports', {
    method: 'POST',
    body: JSON.stringify(port),
  });
}

export function updatePort(id, port) {
  return requestJson(`/ports/${id}`, {
    method: 'PUT',
    body: JSON.stringify(port),
  });
}

export function deletePort(id) {
  return requestJson(`/ports/${id}`, {
    method: 'DELETE',
  });
}

export function searchFares({ originPortId, destinationPortId, date }) {
  const query = new URLSearchParams({
    origin_port_id: originPortId,
    destination_port_id: destinationPortId,
    date,
  });

  return requestJson(`/flights?${query.toString()}`);
}
