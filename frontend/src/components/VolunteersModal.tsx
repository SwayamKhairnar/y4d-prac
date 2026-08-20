import React from 'react';
import { CommunityRequest } from '../types';
import { X, Users, Calendar, Award } from 'lucide-react';

interface VolunteersModalProps {
  request: CommunityRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VolunteersModal: React.FC<VolunteersModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !request) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl border border-[#bcc9c6]/50 shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#3d4947] hover:bg-[#eff4ff] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#eff4ff]">
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] text-[#00685f] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-[#0d1c2e]">
              Active Volunteers ({request.volunteersCount})
            </h3>
            <p className="text-xs text-[#3d4947] line-clamp-1">{request.title}</p>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
          {request.volunteers.map((vol, i) => (
            <div
              key={vol.id || i}
              className="flex items-center justify-between p-3 rounded-xl bg-[#f8f9ff] border border-[#bcc9c6]/30 hover:bg-[#eff4ff] transition-colors"
            >
              <div className="flex items-center gap-3">
                <img
                  src={vol.avatar}
                  alt={vol.name}
                  className="w-10 h-10 rounded-full object-cover border border-[#bcc9c6]/50"
                />
                <div>
                  <p className="font-semibold text-sm text-[#0d1c2e]">{vol.name}</p>
                  <p className="text-xs text-[#6d7a77] flex items-center gap-1">
                    <Award className="w-3 h-3 text-[#00685f]" />
                    <span>{vol.role || 'Civic Volunteer'}</span>
                  </p>
                </div>
              </div>

              {vol.joinedDate && (
                <span className="text-[11px] text-[#6d7a77] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{vol.joinedDate}</span>
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#eff4ff] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#00685f] hover:bg-[#008378] text-white text-xs font-semibold rounded-xl transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
