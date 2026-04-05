const API_BASE = import.meta.env.VITE_API_BASE_URL || ''

async function parseError(response) {
  const text = await response.text()
  if (!text) {
    return `Request failed (${response.status})`
  }

  try {
    const parsed = JSON.parse(text)
    return parsed.message || text
  } catch {
    return text
  }
}

export async function apiRequest(path, options = {}, token = '') {
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    throw new Error(await parseError(response))
  }

  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }

  return response.text()
}

export const api = {
  login: (payload) => apiRequest('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  register: (payload) => apiRequest('/api/v1/auth/register', { method: 'POST', body: JSON.stringify(payload) }),

  getUsers: (token) => apiRequest('/api/users/', {}, token),
  deleteUser: (userId, token) => apiRequest(`/api/users/${userId}`, { method: 'DELETE' }, token),

  getCategories: () => apiRequest('/api/categories/'),
  createCategory: (payload, token) =>
    apiRequest('/api/categories/', { method: 'POST', body: JSON.stringify(payload) }, token),

  getPosts: (page = 0) => apiRequest(`/api/posts?pageNumber=${page}&pageSize=5&sortBy=postId&sortDir=desc`),
  searchPosts: (keyword) => apiRequest(`/api/posts/search/${encodeURIComponent(keyword)}`),
  getPostById: (postId) => apiRequest(`/api/posts/${postId}`),
  createPost: (userId, categoryId, payload, token) =>
    apiRequest(
      `/api/user/${Number(userId)}/category/${Number(categoryId)}/posts`,
      { method: 'POST', body: JSON.stringify(payload) },
      token,
    ),
  deletePost: (postId, token) => apiRequest(`/api/posts/${postId}`, { method: 'DELETE' }, token),
  getPostsByUser: (userId) => apiRequest(`/api/user/${userId}/posts`),

  createComment: (postId, payload, token) =>
    apiRequest(`/api/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify(payload) }, token),
  deleteComment: (commentId, token) => apiRequest(`/api/comments/${commentId}`, { method: 'DELETE' }, token),

  uploadPostImage: (postId, file, token) => {
    const formData = new FormData()
    formData.append('image', file)
    return apiRequest(`/api/posts/image/upload/${postId}`, { method: 'POST', body: formData }, token)
  },
}
