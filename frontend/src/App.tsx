import React, { useState, useEffect } from 'react';
import { CommunityRequest, RequestStatus, TabType } from './types';
import { currentUser as initialUserProfile } from './data/mockData';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { RequestsScreen } from './components/RequestsScreen';
import { RequestDetailScreen } from './components/RequestDetailScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { CreateRequestModal } from './components/CreateRequestModal';
import { VolunteersModal } from './components/VolunteersModal';
import { MediaLightboxModal } from './components/MediaLightboxModal';
import { Toast, ToastMessage } from './components/Toast';
import { 
  getRequests, 
  createRequest, 
  updateRequestStatus, 
  volunteerForRequest 
} from './services/api';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [selectedRequest, setSelectedRequest] = useState<CommunityRequest | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [volunteersModalRequest, setVolunteersModalRequest] = useState<CommunityRequest | null>(null);
  const [lightboxImages, setLightboxImages] = useState<string[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Temporary User Selection
  const [currentUserId, setCurrentUserId] = useState<string>('4f6e7a35-7f78-4c80-9b3b-862df70f2f29'); // Using an existing user from DB for tests

  // Backend state
  const [requests, setRequests] = useState<CommunityRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVolunteering, setIsVolunteering] = useState(false);

  // Load from backend
  const fetchBackendRequests = async () => {
    try {
      setLoading(true);
      const data = await getRequests();
      setRequests(data);
    } catch (e) {
      console.error('Failed to fetch requests', e);
      addToast('error', 'Failed to load requests from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBackendRequests();
  }, []);

  // Keep selectedRequest updated
  useEffect(() => {
    if (selectedRequest) {
      const updated = requests.find((r) => r.id === selectedRequest.id);
      if (updated) {
        setSelectedRequest(updated);
      }
    }
  }, [requests]);

  const addToast = (type: 'success' | 'info' | 'error', message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleNavigate = (tab: TabType) => {
    setCurrentTab(tab);
    setSelectedRequest(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetchBackendRequests(); // Refresh on tab change
  };

  const handleSelectRequest = (req: CommunityRequest) => {
    setSelectedRequest(req);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToRequests = () => {
    setSelectedRequest(null);
  };

  const handleToggleHelp = async (requestId: string) => {
    if (isVolunteering) return;
    setIsVolunteering(true);
    try {
      await volunteerForRequest(requestId, currentUserId);
      addToast('success', `You joined the effort!`);
      
      const updateRequestVolunteers = (req: CommunityRequest) => ({
        ...req,
        isUserHelping: true,
        volunteersCount: req.volunteersCount + 1,
        volunteers: [
          ...req.volunteers,
          {
            id: currentUserId,
            name: initialUserProfile.name,
            avatar: initialUserProfile.avatar,
            role: 'Volunteer',
            joinedDate: 'Just now'
          }
        ]
      });

      setRequests((prev) =>
        prev.map((req) => req.id === requestId ? updateRequestVolunteers(req) : req)
      );

      if (selectedRequest?.id === requestId) {
        setSelectedRequest((prev) => prev ? updateRequestVolunteers(prev) : null);
      }
    } catch (e: any) {
      const detail = e.response?.data?.detail;
      if (e.response?.status === 409) {
        addToast('info', detail || 'You have already volunteered for this request.');
      } else {
        addToast('error', detail || 'Failed to volunteer.');
      }
      console.error(e);
    } finally {
      setIsVolunteering(false);
    }
  };

  const handleUpdateStatus = async (requestId: string, newStatus: RequestStatus) => {
    try {
      // Map frontend status to backend status if necessary
      let backendStatus = newStatus === 'in-progress' ? 'in_progress' : newStatus;
      if (backendStatus === 'pending') backendStatus = 'open'; // fallback for unsupported UI status

      await updateRequestStatus(requestId, backendStatus);
      addToast('success', `Progress updated!`);
      fetchBackendRequests();
    } catch (e: any) {
      const detail = e.response?.data?.detail;
      addToast('error', detail || 'Failed to update status.');
      console.error(e);
    }
  };

  const handleAddComment = (requestId: string, text: string) => {
    // UI Only field - mock behavior
    const newComment = {
      id: 'cmt-' + Date.now(),
      authorName: initialUserProfile.name,
      authorAvatar: initialUserProfile.avatar,
      text,
      timestamp: 'Just now',
    };

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id === requestId) {
          addToast('success', 'Your coordination note was posted (UI Only).');
          return {
            ...req,
            comments: [...(req.comments || []), newComment],
          };
        }
        return req;
      })
    );
  };

  const handleCreateRequest = async (
    data: Omit<CommunityRequest, 'id' | 'createdAt' | 'volunteers' | 'comments' | 'volunteersCount'>
  ) => {
    try {
      const newReq = await createRequest(
        data.title,
        data.description,
        data.category,
        data.location,
        currentUserId
      );
      
      addToast('success', 'Community request published successfully!');
      fetchBackendRequests();
      setSelectedRequest(newReq);
      setCreateModalOpen(false);
    } catch (e: any) {
      const detail = e.response?.data?.detail;
      addToast('error', detail || 'Failed to create request.');
      console.error(e);
    }
  };

  const handleOpenMediaLightbox = (images: string[], initialIndex: number) => {
    setLightboxImages(images);
    setLightboxIndex(initialIndex);
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0d1c2e] flex flex-col font-['Inter',sans-serif]">
      {/* Temporary User ID selector for hackathon testing */}
      <div className="bg-blue-100 p-2 flex justify-center items-center gap-4 text-sm border-b border-blue-200">
        <span className="font-semibold">Dev Mode: User UUID</span>
        <input 
          type="text" 
          value={currentUserId}
          onChange={(e) => setCurrentUserId(e.target.value)}
          className="px-2 py-1 border rounded font-mono text-xs w-72"
        />
        <span className="text-gray-500 text-xs">Used for Create/Volunteer</span>
      </div>

      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenCreate={() => setCreateModalOpen(true)}
        user={initialUserProfile}
      />

      {selectedRequest ? (
        <RequestDetailScreen
          request={selectedRequest}
          onBack={handleBackToRequests}
          onToggleHelp={handleToggleHelp}
          onUpdateStatus={handleUpdateStatus}
          onAddComment={handleAddComment}
          onOpenVolunteers={(req) => setVolunteersModalRequest(req)}
          onOpenMediaLightbox={handleOpenMediaLightbox}
          currentUser={initialUserProfile}
          isVolunteering={isVolunteering}
        />
      ) : currentTab === 'home' ? (
        <HomeScreen
          onNavigate={handleNavigate}
          onOpenCreate={() => setCreateModalOpen(true)}
          onSelectRequest={handleSelectRequest}
          recentRequests={requests}
        />
      ) : currentTab === 'requests' ? (
        <RequestsScreen
          requests={requests}
          onSelectRequest={handleSelectRequest}
          onOpenCreate={() => setCreateModalOpen(true)}
        />
      ) : (
        <DashboardScreen
          user={initialUserProfile}
          requests={requests}
          onSelectRequest={handleSelectRequest}
          onOpenCreate={() => setCreateModalOpen(true)}
          onNavigateToRequests={() => handleNavigate('requests')}
        />
      )}

      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenCreate={() => setCreateModalOpen(true)}
      />

      <CreateRequestModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateRequest as any}
      />

      <VolunteersModal
        request={volunteersModalRequest}
        isOpen={!!volunteersModalRequest}
        onClose={() => setVolunteersModalRequest(null)}
      />

      <MediaLightboxModal
        images={lightboxImages}
        currentIndex={lightboxIndex}
        isOpen={lightboxImages.length > 0}
        onClose={() => setLightboxImages([])}
        onNavigate={(idx) => setLightboxIndex(idx)}
      />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
