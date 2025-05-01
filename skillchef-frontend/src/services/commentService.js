import axios from "axios";

const API_URL = "http://localhost:8080/api/comments";

export const getCommentsByPost = (postId) => {
  return axios.get(`${API_URL}/post/${postId}`);
};

export const createComment = (postId, text, user) => {
  return axios.post(API_URL, {
    postId,
    userId: user.id,
    username: user.username,
    text,
  });
};

export const updateComment = (commentId, text) => {
  return axios.put(`${API_URL}/${commentId}`, {
    text,
  });
};

export const deleteComment = (commentId) => {
  return axios.delete(`${API_URL}/${commentId}`);
};
