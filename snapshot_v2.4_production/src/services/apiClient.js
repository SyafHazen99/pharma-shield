const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchMedicines() {
  try {
    const res = await fetch(`${API_BASE_URL}/medicines`);
    if (!res.ok) throw new Error('Failed to fetch medicines');
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline or unreachable. Falling back to local data.", err);
    return null;
  }
}

export async function saveSnapshotToDisk(snapshotPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/snapshots/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snapshotPayload)
    });
    if (!res.ok) throw new Error('Failed to save snapshot on server disk');
    return await res.json();
  } catch (err) {
    console.warn("Snapshot disk saver API call failed.", err);
    return null;
  }
}

export async function createPurchaseRequest(prPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/purchase-requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(prPayload)
    });
    if (!res.ok) throw new Error('Failed to create PR');
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline. Using client state.", err);
    return null;
  }
}

export async function updatePRStatus(prId, status, reason = '') {
  try {
    const res = await fetch(`${API_BASE_URL}/purchase-requests/${prId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, reason })
    });
    if (!res.ok) throw new Error('Failed to update PR status');
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline. Using client state.", err);
    return null;
  }
}

export async function createPurchaseOrder(poPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/purchase-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(poPayload)
    });
    if (!res.ok) throw new Error('Failed to create PO');
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline. Using client state.", err);
    return null;
  }
}

export async function createGoodsReceipt(grPayload) {
  try {
    const res = await fetch(`${API_BASE_URL}/goods-receipts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(grPayload)
    });
    if (!res.ok) throw new Error('Failed to create Goods Receipt');
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline. Using client state.", err);
    return null;
  }
}

export async function payInvoice(invoiceId) {
  try {
    const res = await fetch(`${API_BASE_URL}/invoices/${invoiceId}/pay`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to process payment');
    return await res.json();
  } catch (err) {
    console.warn("Backend API offline. Using client state.", err);
    return null;
  }
}
