import axios from "axios";

const API_URL = "http://localhost:8080/api/progress";

export const getAllProgress = async (token) =>
  axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createProgress = async (data, token) =>
  axios.post(API_URL, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const updateProgress = async (id, data, token) =>
  axios.put(`${API_URL}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteProgress = async (id, token) =>
  axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getProgressById = async (id, token) =>
  axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
