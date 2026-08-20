export type RequestCategory = 
  | 'community'
  | 'education'
  | 'food'
  | 'healthcare'
  | 'environment'
  | 'infrastructure';

export type RequestStatus = 'open' | 'in-progress' | 'resolved' | 'pending';

export type TabType = 'home' | 'requests' | 'dashboard';

export interface Volunteer {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  joinedDate?: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
}

export interface CommunityRequest {
  id: string;
  title: string;
  category: RequestCategory;
  status: RequestStatus;
  location: string;
  addressDetails?: string;
  description: string;
  additionalDetails?: string;
  timeAgo: string;
  createdAt: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  authorInitials: string;
  coverImage?: string;
  supportingMedia: string[];
  volunteersCount: number;
  targetVolunteers?: number;
  donorsNeeded?: number;
  eventDate?: string;
  volunteers: Volunteer[];
  comments: Comment[];
  isUserHelping?: boolean;
  isUserAuthor?: boolean;
  urgency?: 'high' | 'normal' | 'low';
}

export interface UserProfile {
  name: string;
  avatar: string;
  email: string;
  location: string;
  requestsCreatedCount: number;
  activeRequestsCount: number;
  helpedWithCount: number;
  totalContributionsCount: number;
}
