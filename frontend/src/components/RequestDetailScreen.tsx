import React, { useState } from 'react';
import { CommunityRequest, RequestStatus, UserProfile } from '../types';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Users, 
  Share2, 
  Check, 
  Flag, 
  Image as ImageIcon,
  HandHeart,
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface RequestDetailScreenProps {
  request: CommunityRequest;
  onBack: () => void;
  onToggleHelp: (requestId: string) => void;
  onUpdateStatus: (requestId: string, newStatus: RequestStatus) => void;
  onAddComment: (requestId: string, text: string) => void;
  onOpenVolunteers: (request: CommunityRequest) => void;
  onOpenMediaLightbox: (images: string[], initialIndex: number) => void;
  currentUser: UserProfile;
  isVolunteering?: boolean;
}

export const RequestDetailScreen: React.FC<RequestDetailScreenProps> = ({
  request,
  onBack,
  onToggleHelp,
  onUpdateStatus,
  onAddComment,
  onOpenVolunteers,
  onOpenMediaLightbox,
  currentUser,
  isVolunteering = false,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [copiedShare, setCopiedShare] = useState(false);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(request.id, commentInput.trim());
    setCommentInput('');
  };

  // Progress step indices
  const getProgressIndex = (status: RequestStatus) => {
    switch (status) {
      case 'open':
        return 0;
      case 'in-progress':
        return 1;
      case 'resolved':
        return 2;
      case 'pending':
        return 0;
      default:
        return 0;
    }
  };

  const progressIndex = getProgressIndex(request.status);

  return (
    <main className="pt-20 pb-24 md:pb-16 max-w-7xl mx-auto w-full px-4 md:px-8">
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#3d4947] hover:text-[#00685f] font-semibold text-sm transition-colors group cursor-pointer"
          id="back-to-requests-btn"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Requests</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#bcc9c6]/50 bg-white text-xs font-semibold text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#00685f] transition-all"
          id="share-request-btn"
        >
          {copiedShare ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#00685f]" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Core Request Details */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/50 soft-shadow">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-[#eff4ff] text-[#00685f] px-3 py-1 rounded-full text-xs font-semibold border border-[#bcc9c6]/30 capitalize flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span>{request.category}</span>
              </span>

              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  request.status === 'open'
                    ? 'bg-[#00685f]/10 text-[#00685f]'
                    : request.status === 'in-progress'
                    ? 'bg-[#a36700]/15 text-[#825100]'
                    : 'bg-[#bcc9c6]/30 text-[#0d1c2e]'
                }`}
              >
                {request.status === 'in-progress' ? 'In Progress' : request.status}
              </span>

              {request.urgency === 'high' && (
                <span className="bg-[#ffdad6] text-[#ba1a1a] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  High Urgency
                </span>
              )}
            </div>

            <h1 className="font-headline text-2xl sm:text-3xl font-bold text-[#0d1c2e] mb-3">
              {request.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#3d4947]">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#00685f]" />
                <span>{request.location}</span>
                {request.addressDetails && (
                  <span className="text-[#6d7a77]">({request.addressDetails})</span>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#00685f]" />
                <span>{request.timeAgo}</span>
              </div>

              <div className="flex items-center gap-2">
                <img
                  src={request.authorAvatar}
                  alt={request.authorName}
                  className="w-5 h-5 rounded-full object-cover border border-[#bcc9c6]/50"
                />
                <span>by <strong className="text-[#0d1c2e]">{request.authorName}</strong></span>
              </div>
            </div>
          </div>

          {/* About this request Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/50 soft-shadow">
            <h2 className="font-headline text-lg font-bold text-[#0d1c2e] mb-3">
              About this request
            </h2>
            <p className="text-sm sm:text-base text-[#3d4947] leading-relaxed mb-4">
              {request.description}
            </p>
            {request.additionalDetails && (
              <p className="text-sm sm:text-base text-[#3d4947] leading-relaxed pt-3 border-t border-[#eff4ff]">
                {request.additionalDetails}
              </p>
            )}
          </div>

          {/* Supporting Media Gallery */}
          {request.supportingMedia && request.supportingMedia.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/50 soft-shadow">
              <h2 className="font-headline text-lg font-bold text-[#0d1c2e] mb-4">
                Supporting Media
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {request.supportingMedia.map((url, idx) => (
                  <div
                    key={idx}
                    onClick={() => onOpenMediaLightbox(request.supportingMedia, idx)}
                    className="h-32 sm:h-44 rounded-xl overflow-hidden border border-[#bcc9c6]/50 bg-[#eff4ff] cursor-pointer group relative"
                  >
                    <img
                      src={url}
                      alt={`Supporting media attachment ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ImageIcon className="w-6 h-6 drop-shadow-md" />
                    </div>
                  </div>
                ))}

                <div
                  onClick={() => onOpenMediaLightbox(request.supportingMedia, 0)}
                  className="h-32 sm:h-44 bg-[#eff4ff] rounded-xl border-2 border-dashed border-[#bcc9c6]/70 flex flex-col items-center justify-center text-[#3d4947] cursor-pointer hover:bg-[#dce9ff] hover:border-[#00685f] transition-all p-4 text-center"
                >
                  <ImageIcon className="w-6 h-6 text-[#00685f] mb-1" />
                  <span className="text-xs font-semibold">
                    View full gallery ({request.supportingMedia.length} item{request.supportingMedia.length > 1 ? 's' : ''})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Request Progress Stepper */}
          <div className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/50 soft-shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-lg font-bold text-[#0d1c2e]">
                Request Progress
              </h2>
              <span className="text-xs text-[#3d4947]">
                Current status: <strong className="capitalize text-[#00685f]">{request.status}</strong>
              </span>
            </div>

            <div className="relative flex justify-between items-center px-4 md:px-8">
              {/* Background Track */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-2 bg-[#eff4ff] rounded-full z-0" />
              
              {/* Active Fill Track */}
              <div
                className="absolute left-6 top-1/2 -translate-y-1/2 h-2 bg-[#00685f] rounded-full z-0 transition-all duration-500"
                style={{
                  width:
                    progressIndex === 0
                      ? '0%'
                      : progressIndex === 1
                      ? '50%'
                      : 'calc(100% - 48px)',
                }}
              />

              {/* Step 1: Open */}
              <button
                onClick={() => onUpdateStatus(request.id, 'open')}
                className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all ${
                    progressIndex >= 0
                      ? 'bg-[#00685f] text-white ring-4 ring-[#f8f9ff]'
                      : 'bg-white border-2 border-[#bcc9c6] text-[#3d4947]'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    progressIndex >= 0 ? 'text-[#00685f]' : 'text-[#3d4947]'
                  }`}
                >
                  Open
                </span>
              </button>

              {/* Step 2: In Progress */}
              <button
                onClick={() => onUpdateStatus(request.id, 'in-progress')}
                className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all ${
                    progressIndex >= 1
                      ? 'bg-[#00685f] text-white ring-4 ring-[#f8f9ff]'
                      : progressIndex === 0
                      ? 'bg-white border-2 border-[#00685f] text-[#00685f]'
                      : 'bg-white border-2 border-[#bcc9c6] text-[#3d4947]'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full ${
                      progressIndex >= 1 ? 'bg-white' : 'bg-[#00685f]'
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    progressIndex >= 1 ? 'text-[#00685f]' : 'text-[#3d4947]'
                  }`}
                >
                  In Progress
                </span>
              </button>

              {/* Step 3: Resolved */}
              <button
                onClick={() => onUpdateStatus(request.id, 'resolved')}
                className="relative z-10 flex flex-col items-center gap-1 group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition-all ${
                    progressIndex === 2
                      ? 'bg-[#00685f] text-white ring-4 ring-[#f8f9ff]'
                      : 'bg-white border-2 border-[#bcc9c6] text-[#3d4947]'
                  }`}
                >
                  <Flag className="w-4 h-4" />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    progressIndex === 2 ? 'text-[#00685f]' : 'text-[#3d4947]'
                  }`}
                >
                  Resolved
                </span>
              </button>
            </div>

            <p className="text-[11px] text-center text-[#6d7a77] mt-6">
              Click any stage above to transition status as the community aid progresses.
            </p>
          </div>

          {/* Coordination Notes & Comments */}
          <div className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/50 soft-shadow">
            <h2 className="font-headline text-lg font-bold text-[#0d1c2e] mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#00685f]" />
              <span>Community Coordination</span>
            </h2>

            {/* Comment list */}
            <div className="space-y-4 mb-5">
              {request.comments.length === 0 ? (
                <p className="text-xs text-[#6d7a77] italic py-2">
                  No coordination notes yet. Be the first to leave a message for volunteers.
                </p>
              ) : (
                request.comments.map((cmt) => (
                  <div key={cmt.id} className="flex items-start gap-3 bg-[#eff4ff]/60 p-3.5 rounded-xl">
                    <img
                      src={cmt.authorAvatar}
                      alt={cmt.authorName}
                      className="w-7 h-7 rounded-full object-cover shrink-0 mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-xs font-bold text-[#0d1c2e]">{cmt.authorName}</span>
                        <span className="text-[11px] text-[#6d7a77]">{cmt.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#3d4947] leading-relaxed">{cmt.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleSendComment} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Post a coordination update or offer detail..."
                className="flex-1 bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0d1c2e] placeholder-[#6d7a77] input-focus-ring"
              />
              <button
                type="submit"
                disabled={!commentInput.trim()}
                className="bg-[#00685f] hover:bg-[#008378] text-white px-4 py-2.5 rounded-xl font-semibold text-xs disabled:opacity-40 transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Sticky Sidebar: Action Card & Volunteer Roster */}
        <aside className="w-full lg:w-80 lg:shrink-0">
          <div className="sticky top-20 bg-white rounded-2xl p-6 border border-[#bcc9c6]/50 soft-shadow flex flex-col gap-5">
            <div>
              <h2 className="font-headline text-xl font-bold text-[#0d1c2e]">Want to help?</h2>
              <p className="text-xs text-[#3d4947] mt-1 leading-relaxed">
                Join the civic community effort to support this local request.
              </p>
            </div>

            {/* Big Action Button */}
            <button
              onClick={() => onToggleHelp(request.id)}
              disabled={isVolunteering}
              className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 ${
                request.isUserHelping
                  ? 'bg-[#e6eeff] text-[#00685f] border border-[#00685f]'
                  : 'bg-[#00685f] hover:bg-[#008378] text-white'
              }`}
              id="want-to-help-btn"
            >
              <HandHeart className="w-5 h-5" />
              <span>
                {isVolunteering 
                  ? 'Updating...' 
                  : request.isUserHelping ? "✓ I'm Helping (Leave)" : 'I Want to Help'}
              </span>
            </button>

            <hr className="border-[#bcc9c6]/30" />

            {/* Volunteer Roster Preview */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#0d1c2e]">
                  {request.volunteersCount} people are helping
                </span>
                <button
                  onClick={() => onOpenVolunteers(request)}
                  className="text-xs text-[#00685f] font-semibold hover:underline"
                  id="view-volunteers-link-btn"
                >
                  View Volunteers
                </button>
              </div>

              {/* Overlapping Avatars */}
              <div className="flex -space-x-2.5 overflow-hidden py-1">
                {request.volunteers.slice(0, 5).map((vol, index) => (
                  <img
                    key={vol.id || index}
                    src={vol.avatar}
                    alt={vol.name}
                    title={vol.name}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover shadow-xs"
                  />
                ))}
                {request.volunteersCount > 5 && (
                  <div className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-2 ring-white bg-[#d5e3fc] text-[#00685f] text-xs font-bold shadow-xs">
                    +{request.volunteersCount - 5}
                  </div>
                )}
              </div>
            </div>

            {/* Safety & Trust Note */}
            <div className="bg-[#eff4ff] p-3.5 rounded-xl border border-[#bcc9c6]/30">
              <p className="text-[11px] text-[#3d4947] leading-relaxed">
                🛡️ <strong>Verified Civic Initiative:</strong> Requests on Y4D Help Hub are moderated by local community coordinators.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};
