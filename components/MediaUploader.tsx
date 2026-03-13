
import React, { useRef } from 'react';
import { Camera, Upload, X, CheckCircle2, Zap } from 'lucide-react';

interface Props {
  onFileSelect: (base64: string) => void;
  currentImage: string | null;
  onClear: () => void;
}

const MediaUploader: React.FC<Props> = ({ onFileSelect, currentImage, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onFileSelect(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isFromVault = currentImage?.startsWith('data:'); // Usually true for our base64, but we can add meta if needed.

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 overflow-hidden shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          {currentImage ? <CheckCircle2 className="w-3 h-3 text-green-500" /> : <Upload className="w-3 h-3" />}
          ACTIVE CONTEXT
        </h3>
        {currentImage && (
          <button onClick={onClear} className="text-zinc-500 hover:text-white transition-colors" title="Clear Workspace">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!currentImage ? (
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-6 rounded-xl border border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-zinc-400 group"
          >
            <Upload className="w-5 h-5 mb-2 group-hover:text-red-600 transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Upload</span>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center py-6 rounded-xl border border-zinc-800 bg-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-zinc-400 group"
          >
            <Camera className="w-5 h-5 mb-2 group-hover:text-purple-500 transition-colors" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Camera</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="relative aspect-video rounded-xl overflow-hidden group border border-zinc-800">
          <img src={currentImage} alt="Reference" className="w-full h-full object-cover" />
          
          <div className="absolute top-2 right-2 flex items-center gap-2">
            <div className="px-2 py-1 bg-red-600/90 text-white text-[8px] font-black uppercase tracking-[0.2em] rounded backdrop-blur-sm flex items-center gap-1.5 shadow-lg animate-fade-in">
              <Zap className="w-2.5 h-2.5 fill-current" />
              PROJECT READY
            </div>
          </div>

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
             <button 
               onClick={() => fileInputRef.current?.click()}
               className="px-4 py-2 bg-white text-zinc-950 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-xl"
             >
               Replace with New
             </button>
             <p className="text-[8px] text-white/50 font-bold uppercase">Current Design Active</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
