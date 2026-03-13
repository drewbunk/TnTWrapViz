
import React, { useState } from 'react';
import { Image as ImageIcon, Wand2, Sparkles, LayoutGrid, Type, Check } from 'lucide-react';
import { DESIGN_STYLES } from '../constants';

interface Props {
  onEditImage: (prompt: string) => void;
  isLoading: boolean;
  referenceImage: string | null;
}

const MediaLab: React.FC<Props> = ({ onEditImage, isLoading, referenceImage }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleApply = () => {
    let finalPrompt = prompt;
    if (selectedStyle && !prompt) {
      finalPrompt = `Apply a professional ${selectedStyle} design using the currently active 3M colors.`;
    } else if (selectedStyle && prompt) {
      finalPrompt = `Style: ${selectedStyle}. Instructions: ${prompt}`;
    }
    onEditImage(finalPrompt);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-6 overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none">
      <div className="flex items-center justify-between">
        <div className="flex-1 py-2 rounded-lg text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-purple-500">
          <ImageIcon className="w-4 h-4" /> IMAGE EDITOR
        </div>
      </div>

      <div className="space-y-6">
        {/* Style Selection Grid */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <LayoutGrid className="w-3 h-3 text-purple-500" />
            PRESET VISUAL STYLES
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DESIGN_STYLES.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(selectedStyle === style ? null : style)}
                className={`p-3 rounded-xl border text-[10px] font-bold uppercase tracking-wide text-left transition-all relative ${
                  selectedStyle === style 
                  ? 'bg-purple-500/10 border-purple-500 text-white shadow-lg shadow-purple-500/10' 
                  : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                }`}
              >
                {style.replace(' (Plain Wrap)', '')}
                {selectedStyle === style && <Check className="absolute top-2 right-2 w-3 h-3 text-purple-500" />}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-zinc-800" />

        {/* Custom Instructions */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
            <Type className="w-3 h-3 text-red-600" />
            CUSTOM INSTRUCTIONS
          </label>
          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. 'Add carbon fiber detailing to the roof and mirrors' or 'Place a thin red pinstripe along the side profile'..."
            className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white text-sm focus:ring-2 focus:ring-purple-500/50 outline-none resize-none placeholder:text-zinc-700 transition-all"
          />
        </div>

        <button 
          disabled={isLoading || (!prompt && !selectedStyle) || !referenceImage}
          onClick={handleApply}
          className={`w-full py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl ${
            isLoading || (!prompt && !selectedStyle) || !referenceImage
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-red-600 to-purple-600 text-white hover:from-red-500 hover:to-purple-500 active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="animate-pulse tracking-widest">APPLYING DESIGN...</span>
            </div>
          ) : (
            <>
              <Wand2 className="w-4 h-4" />
              {selectedStyle && !prompt ? 'APPLY STYLE PRESET' : 'GENERATE CUSTOM WRAP'}
            </>
          )}
        </button>

        {!referenceImage && (
          <div className="p-4 bg-red-600/5 border border-red-600/20 rounded-xl">
            <p className="text-[10px] text-center text-red-600 font-bold uppercase tracking-widest italic">
              * Active context missing. Select a design from the vault or upload a photo to begin editing.
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-zinc-800">
         <div className="flex items-center gap-3 text-zinc-600">
            <Sparkles className="w-4 h-4" />
            <p className="text-[10px] font-medium leading-relaxed uppercase tracking-tighter">
              A.I. Design Lab Mode Activated
            </p>
         </div>
      </div>
    </div>
  );
};

export default MediaLab;
