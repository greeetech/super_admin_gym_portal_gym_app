import api from './api';

export async function loginAdmin(credentials) {
  const res = await api.post('/login', credentials);
  return res.data;
}

export async function getAdminProfile() {
  const res = await api.get('/profile');
  return res.data?.data;
}

export async function registerAdmin(data) {
  const res = await api.post('/register', data);
  return res.data?.data;
}

export async function getPlatformAnalytics() {
  const res = await api.get('/analytics');
  return res.data?.data;
}

export async function getTenants(params = {}) {
  const res = await api.get('/tenants', { params });
  return res.data;
}

export async function getTenantById(id) {
  const res = await api.get(`/tenants/${id}`);
  return res.data?.data;
}

export async function updateTenantStatus(id, { status, suspensionReason }) {
  const res = await api.patch(`/tenants/${id}/status`, { status, suspensionReason });
  return res.data?.data;
}

export async function grantManualSubscription(id, payload) {
  const res = await api.post(`/tenants/${id}/subscription`, payload);
  return res.data?.data;
}

export async function getSaaSPlans() {
  const res = await api.get('/plan');
  return res.data?.data || [];
}

export async function createSaaSPlan(payload) {
  const res = await api.post('/plan', payload);
  return res.data?.data;
}

export async function updateSaaSPlan(id, payload) {
  const res = await api.put(`/plan/${id}`, payload);
  return res.data?.data;
}

export async function toggleSaaSPlanStatus(id) {
  const res = await api.put(`/plan/status/${id}`);
  return res.data?.data;
}

export async function archiveSaaSPlan(id) {
  const res = await api.delete(`/plan/${id}`);
  return res.data?.data;
}

export async function getTransactions(params = {}) {
  const res = await api.get('/transactions', { params });
  return res.data;
}