import React, { useState, useRef } from 'react';
import { CommunityRequest, RequestCategory } from '../types';
import { 
  X, 
  UploadCloud, 
  MapPin, 
  ChevronDown, 
  ImageIcon, 
  FileVideo, 
  FileText, 
  Plus, 
  Sparkles,
  Check
} from 'lucide-react';

interface CreateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newRequest: Omit<CommunityRequest, 'id' | 'createdAt' | 'volunteers' | 'comments' | 'volunteersCount'>) => Promise<void> | void;
}

export const CreateRequestModal: React.FC<CreateRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RequestCategory>('environment');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [supportingMedia, setSupportingMedia] = useState<string[]>([
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCe0pAdadsDKqU8DMNTc9tFI51IdboZqS5sUT2nEUMy5C6dkEz-Leb20k0fNmgX1tCssbmxEJ9x1sq30_TdhpKHZoL5lpH189VpxpGYkUFM6-tSS766UbzaJAmGW4DWx1qrSQxpR40foci2cqAH4gp9zBACLE59hn8q_wCrDZyJoBwUCv6YklrkOirlQtAebV2tB8TmY6NUbiybUizBQNUQYD8msxZo2OMVwSJKJPN6JCM-e_9p0qdU'
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setSupportingMedia((prev) => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeMedia = (index: number) => {
    setSupportingMedia((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        category,
        status: 'pending',
        location: location.trim() || 'Neighborhood Community Center',
        description: description.trim(),
        timeAgo: 'Just now',
        authorName: 'Alex Rivera',
        authorRole: 'Active Citizen',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAS60oIU04TF4Ht79DToy_rrS0gVKTfKNd9sEV4j2-PH6Tq2P3_cBv34QIrFJhNQzkSfPNENBJ9L0ZTEodSqhgQbIya5EjeoBu977fs7qz1mIwPOnTX2G5NWnrjeztE9UwiME6VUpuumaMNflP7Xk4oVGBOQMR93ickch75Bf9MtXoqAzygzzYlKLQxO116IyHzlIvR25BTdrv1iP_mX3cYXVLLF363o35e7R-23zgQNz1LkUFnUjws',
        authorInitials: 'AR',
        coverImage: supportingMedia[0] || undefined,
        supportingMedia,
        isUserAuthor: true,
        isUserHelping: false,
      });

      // Reset & close
      setTitle('');
      setDescription('');
      setLocation('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="bg-white w-full max-w-3xl rounded-2xl border border-[#bcc9c6]/50 shadow-2xl p-6 sm:p-8 my-8 relative animate-in fade-in zoom-in-95 duration-200"
        id="create-request-modal"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#3d4947] hover:bg-[#eff4ff] hover:text-[#0d1c2e] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#0d1c2e]">
            Create a Community Request
          </h2>
          <p className="text-sm text-[#3d4947] mt-1">
            Submit a formal request for civic assistance, neighborhood volunteers, or resources.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bento-style Grid for Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Request Title */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#3d4947]" htmlFor="req-title">
                Request Title <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                id="req-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Park Cleanup Supplies Needed"
                className="w-full bg-[#f8f9ff] border border-[#bcc9c6]/60 rounded-xl px-4 py-2.5 text-sm text-[#0d1c2e] placeholder-[#6d7a77] input-focus-ring transition-all"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-[#3d4947]" htmlFor="req-category">
                Category <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="relative">
                <select
                  id="req-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as RequestCategory)}
                  className="w-full bg-[#f8f9ff] border border-[#bcc9c6]/60 rounded-xl px-4 py-2.5 text-sm text-[#0d1c2e] appearance-none input-focus-ring transition-all pr-10 cursor-pointer"
                >
                  <option value="environment">Environment</option>
                  <option value="education">Education</option>
                  <option value="food">Food Security</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="community">Community Assistance</option>
                </select>
                <ChevronDown className="w-4 h-4 text-[#3d4947] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Location */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-[#3d4947]" htmlFor="req-location">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#00685f] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="req-location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Address or Neighborhood (e.g. Elm Street Park)"
                  className="w-full bg-[#f8f9ff] border border-[#bcc9c6]/60 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#0d1c2e] placeholder-[#6d7a77] input-focus-ring transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-semibold text-[#3d4947]" htmlFor="req-desc">
                Description <span className="text-[#ba1a1a]">*</span>
              </label>
              <textarea
                id="req-desc"
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the community need in detail, including needed skills, items, or volunteer schedule..."
                className="w-full bg-[#f8f9ff] border border-[#bcc9c6]/60 rounded-xl px-4 py-2.5 text-sm text-[#0d1c2e] placeholder-[#6d7a77] input-focus-ring transition-all resize-y"
              />
            </div>
          </div>

          {/* Supporting Media Upload Section */}
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#3d4947]">
              Supporting Media & Photos
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFileUpload(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-[#00685f] bg-[#eff4ff]'
                  : 'border-[#bcc9c6]/70 bg-[#f8f9ff]/60 hover:bg-[#f8f9ff]'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*,.pdf"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />

              <div className="w-12 h-12 rounded-full bg-[#eff4ff] text-[#00685f] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>

              <p className="text-sm text-[#0d1c2e] font-medium mb-1">
                Drag and drop or <span className="text-[#00685f] font-semibold underline underline-offset-4">browse files</span>
              </p>
              <p className="text-xs text-[#3d4947] mb-3">
                Add photos, site conditions, or support documents
              </p>

              <div className="flex items-center gap-3 text-xs text-[#6d7a77]">
                <span className="flex items-center gap-1">
                  <ImageIcon className="w-3.5 h-3.5" /> JPG / PNG
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FileVideo className="w-3.5 h-3.5" /> MP4
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" /> PDF
                </span>
              </div>
            </div>

            {/* Media Thumbnails Preview */}
            {supportingMedia.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2 pt-1">
                {supportingMedia.map((url, i) => (
                  <div
                    key={i}
                    className="w-24 h-24 rounded-xl border border-[#bcc9c6]/60 bg-[#eff4ff] relative shrink-0 overflow-hidden group shadow-xs"
                  >
                    <img
                      src={url}
                      alt={`Preview attachment ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMedia(i);
                      }}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/60 hover:bg-[#ba1a1a] text-white rounded-full flex items-center justify-center transition-colors shadow-xs"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Add slot */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-[#bcc9c6]/70 flex flex-col items-center justify-center text-[#3d4947] hover:bg-[#eff4ff] hover:border-[#00685f] transition-colors shrink-0"
                >
                  <Plus className="w-5 h-5 text-[#00685f]" />
                  <span className="text-[10px] font-semibold mt-1">Add More</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-3 pt-6 border-t border-[#eff4ff]">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl border border-[#bcc9c6] text-[#3d4947] text-sm font-semibold hover:bg-[#eff4ff] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-2.5 rounded-xl bg-[#00685f] hover:bg-[#008378] disabled:opacity-50 text-white text-sm font-semibold shadow-sm hover:shadow-md active:scale-95 transition-all"
              id="publish-request-btn"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
