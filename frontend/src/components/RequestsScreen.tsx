import React, { useState, useMemo } from 'react';
import { CommunityRequest, RequestCategory, RequestStatus } from '../types';
import { 
  Plus, 
  Search, 
  Clock, 
  Users, 
  Sparkles, 
  GraduationCap, 
  Utensils, 
  HeartPulse, 
  Trees, 
  Shirt, 
  Wrench, 
  ChevronLeft, 
  ChevronRight,
  Filter
} from 'lucide-react';

interface RequestsScreenProps {
  requests: CommunityRequest[];
  onSelectRequest: (request: CommunityRequest) => void;
  onOpenCreate: () => void;
}

export const RequestsScreen: React.FC<RequestsScreenProps> = ({
  requests,
  onSelectRequest,
  onOpenCreate,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Category filter
      if (selectedCategory !== 'all' && req.category !== selectedCategory) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && req.status !== selectedStatus) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = req.title.toLowerCase().includes(query);
        const matchesDesc = req.description.toLowerCase().includes(query);
        const matchesLocation = req.location.toLowerCase().includes(query);
        const matchesAuthor = req.authorName.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc && !matchesLocation && !matchesAuthor) {
          return false;
        }
      }
      return true;
    });
  }, [requests, selectedCategory, selectedStatus, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / itemsPerPage));
  const currentRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getCategoryIcon = (cat: RequestCategory) => {
    switch (cat) {
      case 'education':
        return <GraduationCap className="w-4 h-4 text-[#4648d4]" />;
      case 'food':
        return <Utensils className="w-4 h-4 text-[#825100]" />;
      case 'healthcare':
        return <HeartPulse className="w-4 h-4 text-[#ba1a1a]" />;
      case 'environment':
        return <Trees className="w-4 h-4 text-[#00685f]" />;
      case 'community':
        return <Shirt className="w-4 h-4 text-[#825100]" />;
      case 'infrastructure':
        return <Wrench className="w-4 h-4 text-[#4648d4]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#00685f]" />;
    }
  };

  const getCategoryColorStripe = (cat: RequestCategory) => {
    switch (cat) {
      case 'community':
        return 'bg-[#a36700]';
      case 'education':
        return 'bg-[#4648d4]';
      case 'healthcare':
        return 'bg-[#ba1a1a]';
      case 'environment':
        return 'bg-[#008378]';
      case 'food':
        return 'bg-[#825100]';
      case 'infrastructure':
        return 'bg-[#6063ee]';
      default:
        return 'bg-[#00685f]';
    }
  };

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'education', label: 'Education' },
    { id: 'food', label: 'Food' },
    { id: 'healthcare', label: 'Healthcare' },
    { id: 'environment', label: 'Environment' },
    { id: 'community', label: 'Community' },
    { id: 'infrastructure', label: 'Infrastructure' },
  ];

  return (
    <div className="pt-20 pb-24 md:pb-16 max-w-7xl mx-auto w-full px-4 md:px-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar (Search, Action & Filters) */}
      <aside className="w-full md:w-72 lg:w-80 shrink-0 flex flex-col gap-5">
        {/* Title & Description */}
        <div>
          <h1 className="font-headline text-2xl md:text-3xl font-bold text-[#0d1c2e]">
            Community Requests
          </h1>
          <p className="text-sm text-[#3d4947] mt-1 leading-relaxed">
            Discover and fulfill local needs. Connect with your community by offering your skills, resources, or time.
          </p>
        </div>

        {/* Create Request CTA */}
        <button
          onClick={onOpenCreate}
          className="bg-[#00685f] hover:bg-[#008378] text-white font-semibold text-sm px-4 py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-all w-full"
          id="sidebar-create-request-btn"
        >
          <Plus className="w-5 h-5" />
          <span>Create Request</span>
        </button>

        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6d7a77]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search requests..."
            className="w-full bg-[#eff4ff] border border-[#bcc9c6]/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-[#0d1c2e] placeholder-[#6d7a77] input-focus-ring transition-all"
            id="requests-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#3d4947] hover:text-[#0d1c2e]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Filter */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#3d4947] px-1">
            Categories
          </h3>
          <div className="flex flex-wrap md:flex-col gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full md:rounded-xl text-xs md:text-sm font-medium transition-all text-left flex items-center justify-between ${
                  selectedCategory === cat.id
                    ? 'bg-[#00685f] text-white shadow-xs'
                    : 'bg-[#eff4ff] text-[#0d1c2e] hover:bg-[#dce9ff] border border-[#bcc9c6]/30'
                }`}
              >
                <span>{cat.label}</span>
                {cat.id !== 'all' && (
                  <span className="text-[11px] opacity-70 ml-2">
                    {requests.filter(r => r.category === cat.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-2 pt-2 border-t border-[#bcc9c6]/30">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#3d4947] px-1">
            Status
          </h3>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { id: 'all', label: 'All' },
              { id: 'open', label: 'Open' },
              { id: 'in-progress', label: 'In Progress' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setSelectedStatus(st.id);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-center transition-all ${
                  selectedStatus === st.id
                    ? 'bg-[#00685f] text-white'
                    : 'bg-[#eff4ff] text-[#3d4947] hover:bg-[#dce9ff]'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Request Grid Area */}
      <div className="flex-grow flex flex-col justify-between">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-[#bcc9c6]/40 soft-shadow text-center flex flex-col items-center justify-center my-8">
            <div className="w-16 h-16 rounded-full bg-[#eff4ff] flex items-center justify-center text-[#00685f] mb-4">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="font-headline text-lg font-bold text-[#0d1c2e]">No requests found</h3>
            <p className="text-sm text-[#3d4947] max-w-sm mt-1 mb-6">
              Try adjusting your category filters or search query to find community initiatives.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSearchQuery('');
              }}
              className="bg-[#00685f] text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-[#008378] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {currentRequests.map((req) => (
              <article
                key={req.id}
                onClick={() => onSelectRequest(req)}
                className="bg-white rounded-2xl border border-[#bcc9c6]/50 p-5 soft-shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group cursor-pointer relative overflow-hidden"
              >
                {/* Top colored indicator stripe */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${getCategoryColorStripe(req.category)}`} />

                {/* Upper Row: Category Chip & Timestamp */}
                <div className="flex justify-between items-center mb-3 mt-1">
                  <span className="inline-flex items-center gap-1.5 bg-[#eff4ff] text-[#0d1c2e] text-xs font-semibold px-2.5 py-1 rounded-full border border-[#bcc9c6]/30 capitalize">
                    {getCategoryIcon(req.category)}
                    <span>{req.category}</span>
                  </span>

                  <span className="text-xs text-[#3d4947] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#6d7a77]" />
                    <span>{req.timeAgo}</span>
                  </span>
                </div>

                {/* Title */}
                <h3 className="font-headline text-base font-bold text-[#0d1c2e] mb-1.5 group-hover:text-[#00685f] transition-colors line-clamp-1">
                  {req.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#3d4947] line-clamp-2 leading-relaxed mb-4 flex-grow">
                  {req.description}
                </p>

                {/* Lower Row: Author, Volunteer Count & Status Action */}
                <div className="flex items-center justify-between border-t border-[#eff4ff] pt-3 mt-auto">
                  <div className="flex flex-col gap-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      {req.authorAvatar ? (
                        <img
                          src={req.authorAvatar}
                          alt={req.authorName}
                          className="w-6 h-6 rounded-full object-cover border border-[#bcc9c6]/40 shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#d5e3fc] flex items-center justify-center text-[10px] font-bold text-[#00685f] shrink-0">
                          {req.authorInitials}
                        </div>
                      )}
                      <span className="text-xs font-semibold text-[#0d1c2e] truncate">
                        {req.authorName}
                      </span>
                    </div>

                    <span className="text-[11px] text-[#3d4947] flex items-center gap-1">
                      <Users className="w-3 h-3 text-[#00685f]" />
                      <span>{req.volunteersCount} helping</span>
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-lg capitalize ${
                        req.status === 'open'
                          ? 'bg-[#00685f]/10 text-[#00685f]'
                          : req.status === 'in-progress'
                          ? 'bg-[#a36700]/10 text-[#825100]'
                          : 'bg-[#fef3c7] text-[#92400e]'
                      }`}
                    >
                      {req.status === 'in-progress' ? 'In Progress' : req.status}
                    </span>

                    <span className="text-xs font-semibold text-[#00685f] group-hover:underline">
                      View Details
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* Pagination Section */}
        {filteredRequests.length > 0 && (
          <section className="flex justify-center items-center gap-2 mt-8 pt-6 border-t border-[#bcc9c6]/30">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-lg border border-[#bcc9c6]/50 flex items-center justify-center text-[#3d4947] hover:bg-[#eff4ff] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-[#00685f] text-white shadow-xs'
                    : 'border border-[#bcc9c6]/50 text-[#0d1c2e] hover:bg-[#eff4ff]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-lg border border-[#bcc9c6]/50 flex items-center justify-center text-[#3d4947] hover:bg-[#eff4ff] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </section>
        )}
      </div>
    </div>
  );
};
