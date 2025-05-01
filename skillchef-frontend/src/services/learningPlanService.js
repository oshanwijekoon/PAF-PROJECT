import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/plans"; // Update this if your backend URL/port is different

// GET all learning plans
export const getAllPlans = async () => {
  const response = await axios.get(API_BASE_URL);
  return response.data._embedded
    ? response.data._embedded.learningPlanList
    : [];
};

// CREATE a new learning plan
export const createPlan = async (planData) => {
  const response = await axios.post(API_BASE_URL, planData);
  return response.data;
};

// UPDATE an existing plan
export const updatePlan = async (id, updatedPlan) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updatedPlan);
  return response.data;
};

// DELETE a plan
export const deletePlan = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  return response.data;
};
