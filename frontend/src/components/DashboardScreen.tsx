import React from 'react';
import { CommunityRequest, UserProfile } from '../types';
import { 
  PlusCircle, 
  Clock, 
  HandHeart, 
  Award, 
  ListFilter, 
  Handshake, 
  ArrowRight, 
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DashboardScreenProps {
  user: UserProfile;
  requests: CommunityRequest[];
  onSelectRequest: (request: CommunityRequest) => void;
  onOpenCreate: () => void;
  onNavigateToRequests: () => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  requests,
  onSelectRequest,
  onOpenCreate,
  onNavigateToRequests,
}) => {
  // Derive user's created requests
  const myRequests = requests.filter((r) => r.isUserAuthor);

  // Derive requests user is helping with
  const helpingRequests = requests.filter((r) => r.isUserHelping);

  const activeMyRequests = myRequests.filter((r) => r.status === 'open' || r.status === 'in-progress' || r.status === 'pending');

  return (
    <main className="pt-20 pb-24 md:pb-16 max-w-7xl mx-auto w-full px-4 md:px-8">
      {/* Title Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-bold text-[#0d1c2e]">
            Your Activity
          </h1>
          <p className="text-sm text-[#3d4947] mt-0.5">
            Overview of your community engagement and mutual aid contribution.
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="bg-[#00685f] hover:bg-[#008378] text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 w-fit"
          id="dashboard-post-request-btn"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Request</span>
        </button>
      </div>

      {/* Summary Bento Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {/* Card 1: Requests Created */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#bcc9c6]/50 soft-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#3d4947] uppercase tracking-wider">
              Requests Created
            </span>
            <div className="w-7 h-7 rounded-full bg-[#008378] text-white flex items-center justify-center shadow-xs">
              <PlusCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="font-headline text-2xl sm:text-3xl font-bold text-[#00685f]">
            {myRequests.length || user.requestsCreatedCount}
          </div>
        </div>

        {/* Card 2: Active Requests */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#bcc9c6]/50 soft-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#3d4947] uppercase tracking-wider">
              Active Requests
            </span>
            <div className="w-7 h-7 rounded-full bg-[#a36700] text-white flex items-center justify-center shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="font-headline text-2xl sm:text-3xl font-bold text-[#825100]">
            {activeMyRequests.length || user.activeRequestsCount}
          </div>
        </div>

        {/* Card 3: Helped With */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#bcc9c6]/50 soft-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#3d4947] uppercase tracking-wider">
              Helped With
            </span>
            <div className="w-7 h-7 rounded-full bg-[#6063ee] text-white flex items-center justify-center shadow-xs">
              <HandHeart className="w-4 h-4" />
            </div>
          </div>
          <div className="font-headline text-2xl sm:text-3xl font-bold text-[#4648d4]">
            {helpingRequests.length || user.helpedWithCount}
          </div>
        </div>

        {/* Card 4: Total Contributions */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#bcc9c6]/50 soft-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-[#3d4947] uppercase tracking-wider">
              Total Contributions
            </span>
            <div className="w-7 h-7 rounded-full bg-[#d5e3fc] text-[#0d1c2e] flex items-center justify-center shadow-xs">
              <Award className="w-4 h-4 text-[#00685f]" />
            </div>
          </div>
          <div className="font-headline text-2xl sm:text-3xl font-bold text-[#0d1c2e]">
            {user.totalContributionsCount + helpingRequests.length}
          </div>
        </div>
      </div>

      {/* Two Column Section Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Column 1: My Requests */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#bcc9c6]/40 pb-2">
            <h2 className="font-headline text-lg font-bold text-[#0d1c2e] flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-[#00685f]" />
              <span>My Requests</span>
            </h2>
            <button
              onClick={onNavigateToRequests}
              className="text-xs font-semibold text-[#00685f] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-4">
            {myRequests.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-dashed border-[#bcc9c6] text-center flex flex-col items-center justify-center">
                <p className="text-sm font-semibold text-[#0d1c2e]">No requests created yet</p>
                <p className="text-xs text-[#3d4947] mt-1 mb-4">
                  Have a civic need or neighborhood project? Post a request.
                </p>
                <button
                  onClick={onOpenCreate}
                  className="bg-[#00685f] text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Create Request
                </button>
              </div>
            ) : (
              myRequests.map((req) => (
                <article
                  key={req.id}
                  onClick={() => onSelectRequest(req)}
                  className="bg-white rounded-2xl p-5 border border-[#bcc9c6]/50 soft-shadow hover-shadow cursor-pointer flex flex-col gap-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="bg-[#eff4ff] text-[#0d1c2e] text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {req.category}
                    </span>

                    <span
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        req.status === 'pending'
                          ? 'bg-[#ffddb8] text-[#653e00]'
                          : req.status === 'in-progress'
                          ? 'bg-[#d5e3fc] text-[#4648d4]'
                          : 'bg-[#89f5e7] text-[#00201d]'
                      }`}
                    >
                      {req.status === 'pending' && <Clock className="w-3 h-3" />}
                      {req.status === 'in-progress' && <Clock className="w-3 h-3" />}
                      {req.status === 'open' && <CheckCircle2 className="w-3 h-3" />}
                      <span className="capitalize">{req.status === 'in-progress' ? 'In Progress' : req.status}</span>
                    </span>
                  </div>

                  <h3 className="font-headline text-base font-bold text-[#0d1c2e] line-clamp-1">
                    {req.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#3d4947] line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-[#eff4ff] mt-2">
                    <div className="flex items-center -space-x-2">
                      {req.volunteers && req.volunteers.length > 0 ? (
                        <>
                          {req.volunteers.slice(0, 3).map((v, i) => (
                            <img
                              key={i}
                              src={v.avatar}
                              alt={v.name}
                              className="w-6 h-6 rounded-full border-2 border-white object-cover"
                            />
                          ))}
                          {req.volunteers.length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-[#eff4ff] text-[10px] font-bold text-[#3d4947] flex items-center justify-center">
                              +{req.volunteers.length - 3}
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-[#6d7a77]">No volunteers yet</span>
                      )}
                    </div>

                    <span className="text-xs text-[#3d4947]">{req.timeAgo}</span>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        {/* Column 2: I'm Helping With */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#bcc9c6]/40 pb-2">
            <h2 className="font-headline text-lg font-bold text-[#0d1c2e] flex items-center gap-2">
              <Handshake className="w-5 h-5 text-[#4648d4]" />
              <span>I'm Helping With</span>
            </h2>
          </div>

          <div className="space-y-4">
            {helpingRequests.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-dashed border-[#bcc9c6] text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#4648d4] flex items-center justify-center mb-3">
                  <HandHeart className="w-6 h-6" />
                </div>
                <h3 className="font-headline text-base font-bold text-[#0d1c2e]">
                  Not helping with anything yet
                </h3>
                <p className="text-xs text-[#3d4947] max-w-xs mt-1 mb-4">
                  Explore community requests and lend a hand to your neighbors.
                </p>
                <button
                  onClick={onNavigateToRequests}
                  className="bg-[#00685f] text-white text-xs font-semibold px-4 py-2 rounded-xl"
                >
                  Explore Requests
                </button>
              </div>
            ) : (
              helpingRequests.map((req) => (
                <article
                  key={req.id}
                  className="bg-white rounded-2xl p-5 border border-[#bcc9c6]/50 soft-shadow hover-shadow flex flex-col gap-3"
                >
                  <div className="flex gap-4">
                    {req.coverImage ? (
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#eff4ff]">
                        <img
                          src={req.coverImage}
                          alt={req.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-[#eff4ff] text-[#00685f] shrink-0 flex items-center justify-center font-headline font-bold text-lg">
                        {req.title.substring(0, 2).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-headline text-base font-bold text-[#0d1c2e] line-clamp-1">
                          {req.title}
                        </h3>
                        <p className="text-xs text-[#3d4947] line-clamp-1 mt-0.5">
                          {req.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-xs text-[#3d4947] pt-2">
                        <div>
                          <span className="text-[11px] text-[#6d7a77] block">Location</span>
                          <span className="font-medium truncate max-w-[120px] block">
                            {req.location}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[11px] text-[#6d7a77] block">Volunteers</span>
                          <div className="flex items-center gap-1 text-[#00685f] font-semibold justify-end">
                            <Users className="w-3.5 h-3.5" />
                            <span>{req.volunteersCount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#eff4ff] flex justify-end">
                    <button
                      onClick={() => onSelectRequest(req)}
                      className="text-xs font-semibold text-[#0d1c2e] border border-[#bcc9c6] px-3.5 py-1.5 rounded-lg hover:bg-[#eff4ff] transition-colors flex items-center gap-1.5"
                    >
                      <span>View Request</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
};
