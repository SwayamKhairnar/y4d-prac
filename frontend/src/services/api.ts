/// <reference types="vite/client" />
import axios from 'axios';
import { CommunityRequest, RequestCategory, RequestStatus } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api/v1`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface BackendRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface BackendRequestListResponse {
  items: BackendRequest[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface BackendUser {
  id: string;
  name: string;
  email: string;
}

export interface BackendVolunteer {
  id: string;
  request_id: string;
  user_id: string;
  created_at: string;
}

// Convert backend request to frontend CommunityRequest
export const mapBackendRequestToFrontend = (req: BackendRequest): CommunityRequest => {
  return {
    id: req.id,
    title: req.title,
    category: req.category as RequestCategory,
    status: req.status as RequestStatus,
    location: req.location || 'Remote/Unknown',
    description: req.description,
    timeAgo: new Date(req.created_at).toLocaleDateString(),
    createdAt: req.created_at,
    authorName: 'Community Member', // We don't get author name in the list response
    authorRole: 'Member',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + req.created_by,
    authorInitials: 'CM',
    supportingMedia: [],
    volunteersCount: 0, // Would need separate fetch or backend change
    volunteers: [],
    comments: [],
  };
};

export const getRequests = async (category?: string, status?: string): Promise<CommunityRequest[]> => {
  const params: any = { limit: 50 };
  if (category && category !== 'all') params.category = category;
  if (status && status !== 'all') params.status = status;
  
  const response = await api.get<BackendRequestListResponse>('/requests', { params });
  return response.data.items.map(mapBackendRequestToFrontend);
};

export const getRequest = async (id: string): Promise<CommunityRequest> => {
  const response = await api.get<BackendRequest>(`/requests/${id}`);
  return mapBackendRequestToFrontend(response.data);
};

export const createRequest = async (
  title: string, 
  description: string, 
  category: string, 
  location: string, 
  userId: string
): Promise<CommunityRequest> => {
  const response = await api.post<BackendRequest>('/requests', {
    title,
    description,
    category,
    location,
    created_by: userId
  });
  return mapBackendRequestToFrontend(response.data);
};

export const updateRequestStatus = async (id: string, status: string): Promise<CommunityRequest> => {
  const response = await api.patch<BackendRequest>(`/requests/${id}`, { status });
  return mapBackendRequestToFrontend(response.data);
};

export const volunteerForRequest = async (requestId: string, userId: string): Promise<void> => {
  await api.post(`/requests/${requestId}/volunteer`, { user_id: userId });
};

// We don't have a GET /users endpoint in the backend schema.
// For temporary user selection, we'll try fetching it in case it's added,
// otherwise return an empty array and the UI should fallback to a text input for UUID.
export const fetchUsers = async (): Promise<BackendUser[]> => {
  try {
    const res = await api.get('/users');
    return res.data;
  } catch (e) {
    console.warn("No /users endpoint available for fetching users. Returning empty list.");
    return [];
  }
}
