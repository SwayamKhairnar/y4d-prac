import React from 'react';
import { CommunityRequest, TabType } from '../types';
import { 
  FileText, 
  Search, 
  HeartHandshake, 
  MapPin, 
  Clock, 
  Users, 
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface HomeScreenProps {
  onNavigate: (tab: TabType) => void;
  onOpenCreate: () => void;
  onSelectRequest: (request: CommunityRequest) => void;
  recentRequests: CommunityRequest[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  onOpenCreate,
  onSelectRequest,
  recentRequests,
}) => {
  // Select top 3 featured requests with cover images for the home feed
  const displayRequests = recentRequests.filter(r => r.coverImage).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow pt-20 pb-20 md:pb-12 max-w-7xl mx-auto w-full px-4 md:px-8">
        {/* Hero Section */}
        <section className="py-8 md:py-14 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col gap-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eff4ff] border border-[#bcc9c6]/40 text-[#00685f] text-xs font-semibold w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Civic Mutual Aid Network</span>
            </div>

            <h1 className="font-headline text-3xl sm:text-4xl md:text-5xl font-bold text-[#0d1c2e] leading-[1.15] tracking-tight">
              Small actions can make a real difference.
            </h1>

            <p className="text-base sm:text-lg text-[#3d4947] leading-relaxed max-w-lg">
              Discover community requests and contribute your time, resources, or support. Connecting neighbors with civic initiatives.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => onNavigate('requests')}
                className="bg-[#00685f] hover:bg-[#008378] text-white font-semibold text-sm px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-95 transition-all text-center flex items-center justify-center gap-2"
                id="hero-browse-requests-btn"
              >
                <span>Browse Requests</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCreate}
                className="bg-white border border-[#bcc9c6] hover:bg-[#eff4ff] text-[#0d1c2e] font-semibold text-sm px-6 py-3.5 rounded-xl hover:shadow-sm hover:scale-[1.01] active:scale-95 transition-all text-center"
                id="hero-create-request-btn"
              >
                Create a Request
              </button>
            </div>

            {/* Micro Stats Banner */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#bcc9c6]/30">
              <div>
                <p className="font-headline text-2xl font-bold text-[#00685f]">100%</p>
                <p className="text-xs text-[#3d4947]">Direct Local Aid</p>
              </div>
              <div>
                <p className="font-headline text-2xl font-bold text-[#4648d4]">120+</p>
                <p className="text-xs text-[#3d4947]">Volunteers Active</p>
              </div>
              <div>
                <p className="font-headline text-2xl font-bold text-[#825100]">48 hrs</p>
                <p className="text-xs text-[#3d4947]">Avg Response</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden shadow-md border border-[#bcc9c6]/50 group">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTedcrGSnrW7_AQswsw7DzfKcovzs-ojk5fME1RjIFPdC8ZNobLWfTjhWvMdln55uyoo3gSmgpJW9bNKLGFC68ze8zl6FwtRY_wijZAlLuU2w2x53Lx5NzimcoepOnex4_sIX2bc5j024AaxJrTo_98lCIKHO0GqPHWwJNxb-O0v7JcpwHnIN-nzbme3EmULp1cY7AkemgSywLkMvwjp1yI_-h5okRVGeysGkIGH8kG9DQqmrl-TRN"
              alt="Community volunteers collaborating outdoors on neighborhood enhancement"
              className="object-cover w-full h-full group-hover:scale-102 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2e]/60 via-transparent to-transparent md:hidden" />
            <div className="absolute bottom-4 left-4 right-4 md:hidden text-white">
              <p className="font-headline text-sm font-bold">Community in Action</p>
              <p className="text-xs text-white/90">Neighbors coming together for local impact</p>
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-12 border-t border-[#bcc9c6]/30">
          <div className="text-center mb-8">
            <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#0d1c2e]">How it Works</h2>
            <p className="text-sm text-[#3d4947] mt-1">Simple steps to ask for assistance or lend a helping hand</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/40 soft-shadow flex flex-col items-center text-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#008378] text-white flex items-center justify-center mb-1 shadow-sm">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="font-headline text-lg font-bold text-[#0d1c2e]">1. Post a Request</h3>
              <p className="text-sm text-[#3d4947] leading-relaxed">
                Share what your neighborhood needs securely, from volunteer manpower to supplies and resource donations.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/40 soft-shadow flex flex-col items-center text-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#008378] text-white flex items-center justify-center mb-1 shadow-sm">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-headline text-lg font-bold text-[#0d1c2e]">2. Find a Way to Help</h3>
              <p className="text-sm text-[#3d4947] leading-relaxed">
                Browse local verified requests that match your schedule, skills, or available resources.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-6 border border-[#bcc9c6]/40 soft-shadow flex flex-col items-center text-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 rounded-2xl bg-[#008378] text-white flex items-center justify-center mb-1 shadow-sm">
                <HeartHandshake className="w-7 h-7" />
              </div>
              <h3 className="font-headline text-lg font-bold text-[#0d1c2e]">3. Make an Impact</h3>
              <p className="text-sm text-[#3d4947] leading-relaxed">
                Connect directly, deliver support, and track progress alongside fellow community members.
              </p>
            </div>
          </div>
        </section>

        {/* Recent Requests Section */}
        <section className="py-10 border-t border-[#bcc9c6]/30">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="font-headline text-2xl md:text-3xl font-bold text-[#0d1c2e]">Recent Requests</h2>
              <p className="text-xs md:text-sm text-[#3d4947] mt-0.5">Active initiatives needing community participation</p>
            </div>
            <button
              onClick={() => onNavigate('requests')}
              className="text-sm font-bold text-[#00685f] hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayRequests.map((req) => (
              <div
                key={req.id}
                onClick={() => onSelectRequest(req)}
                className="bg-white rounded-2xl border border-[#bcc9c6]/50 soft-shadow hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer group"
              >
                <div className="h-48 w-full bg-[#eff4ff] relative overflow-hidden">
                  <img
                    src={req.coverImage}
                    alt={req.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-[#0d1c2e] capitalize shadow-xs">
                    {req.category}
                  </div>
                  {req.urgency === 'high' && (
                    <div className="absolute top-3 left-3 bg-[#ba1a1a] text-white px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase">
                      Urgent
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col gap-2 flex-grow">
                  <h3 className="font-headline text-base font-bold text-[#0d1c2e] line-clamp-1 group-hover:text-[#00685f] transition-colors">
                    {req.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#3d4947] line-clamp-2 leading-relaxed">
                    {req.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-[#3d4947] mt-auto pt-2">
                    <MapPin className="w-3.5 h-3.5 text-[#00685f] shrink-0" />
                    <span className="truncate">{req.location}</span>
                  </div>

                  {req.donorsNeeded ? (
                    <div className="flex items-center gap-1.5 text-xs text-[#825100] font-medium">
                      <Clock className="w-3.5 h-3.5 shrink-0" />
                      <span>Needs {req.donorsNeeded} more donors</span>
                    </div>
                  ) : req.targetVolunteers ? (
                    <div className="flex items-center gap-1.5 text-xs text-[#00685f] font-medium">
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      <span>{req.volunteersCount}/{req.targetVolunteers} Volunteers</span>
                    </div>
                  ) : req.eventDate ? (
                    <div className="flex items-center gap-1.5 text-xs text-[#00685f] font-medium">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>{req.eventDate}</span>
                    </div>
                  ) : null}
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRequest(req);
                    }}
                    className="w-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#0d1c2e] font-semibold text-xs py-2.5 rounded-xl transition-colors border border-[#bcc9c6]/40 flex items-center justify-center gap-1.5"
                  >
                    <span>View Request</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#00685f]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-8 px-4 md:px-8 bg-white border-t border-[#bcc9c6]/40 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00685f] text-white flex items-center justify-center">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <span className="font-headline text-lg font-bold text-[#00685f]">Y4D Help Hub</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs font-medium text-[#3d4947]">
            <a href="#about" className="hover:text-[#00685f] transition-colors">About Us</a>
            <a href="#privacy" className="hover:text-[#00685f] transition-colors">Privacy Policy</a>
            <a href="#support" className="hover:text-[#00685f] transition-colors">Contact Support</a>
            <a href="#terms" className="hover:text-[#00685f] transition-colors">Terms of Service</a>
          </div>

          <div className="text-xs text-[#3d4947] text-center md:text-right">
            © 2024 Y4D Help Hub. Empowering Communities together.
          </div>
        </div>
      </footer>
    </div>
  );
};
