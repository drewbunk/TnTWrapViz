
import React, { useState } from 'react';
import { DesignObject, GenerationState } from '../types';
import { Download, Share2, ZoomIn, Tag, X, Sparkles, Image as ImageIcon, Rotate3d, Wand2, MessageSquare } from 'lucide-react';
import { WATERMARK_TEXT } from '../constants';
import ThreeSixtyViewer from './ThreeSixtyViewer';

interface Props {
  designs: DesignObject[];
  generationState: GenerationState;
  onGenerate360: (design: DesignObject) => void;
  onPromote: (design: DesignObject, destination: 'editor' | 'agent') => void;
}

const Gallery: React.FC<Props> = ({ designs, generationState, onGenerate360, onPromote }) => {
  const [selectedDesign, setSelectedDesign] = useState<DesignObject | null>(null);

  const handleDownload = async (url: string, id: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `wrap-${id}.png`;
      link.click();
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-orbitron font-bold tracking-tight text-white flex items-center gap-3">
          CREATION VAULT
          <span className="bg-zinc-800 text-zinc-400 text-xs px-2.5 py-1 rounded-full font-sans font-medium uppercase tracking-widest">
            {designs.length} DESIGNS
          </span>
        </h2>
      </div>

      {designs.length === 0 && generationState === GenerationState.IDLE && (
        <div className="border-2 border-dashed border-zinc-800 rounded-3xl h-[400px] flex flex-col items-center justify-center text-zinc-500 gap-4 bg-zinc-900/50">
          <div className="p-4 bg-zinc-800 rounded-full">
            <Tag className="w-8 h-8 opacity-20" />
          </div>
          <p className="font-medium">No visualizations created yet</p>
        </div>
      )}

      {(generationState !== GenerationState.IDLE && generationState !== GenerationState.SUCCESS) && (
        <div className="relative group overflow-hidden rounded-3xl aspect-video bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center gap-6 animate-pulse">
           <div className="relative">
              <div className="w-20 h-20 border-4 border-orange-500/10 border-t-orange-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-orange-500 fill-current" />
              </div>
           </div>
           <div className="text-center space-y-2">
             <p className="text-xl font-orbitron text-white tracking-widest uppercase italic">
               {generationState === GenerationState.GENERATING_360 ? 'Neural Perspective Render...' : 'Pro-Fidelity Wrap Processing...'}
             </p>
             <div className="flex items-center justify-center gap-2">
               <span className="h-1 w-8 bg-orange-500/20 rounded-full" />
               <p className="text-[10px] text-orange-500/60 font-black uppercase tracking-[0.3em]">
                 GEMINI 3 PRO ENGINE ACTIVE
               </p>
               <span className="h-1 w-8 bg-orange-500/20 rounded-full" />
             </div>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {designs.map((design) => (
          <div key={design.id} className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl transition-all hover:border-orange-500/30">
            <div className="relative aspect-video bg-black">
              <img src={design.url} alt={design.concept.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
              
              <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur-md rounded text-[9px] font-bold text-white uppercase flex items-center gap-1.5 z-10">
                <ImageIcon className="w-2.5 h-2.5" />
                VAULT ENTRY #{design.id.slice(-4)}
              </div>

              {/* Action Buttons Layer */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
                <button 
                  onClick={() => setSelectedDesign(design)} 
                  className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-all active:scale-95"
                  title="Expand View"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onPromote(design, 'editor')}
                  className="p-3 bg-purple-500/20 backdrop-blur-md border border-purple-500/50 rounded-full text-purple-400 hover:bg-purple-500 hover:text-white transition-all active:scale-95"
                  title="Send to Image Editor"
                >
                  <Wand2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => onPromote(design, 'agent')}
                  className="p-3 bg-blue-500/20 backdrop-blur-md border border-blue-500/50 rounded-full text-blue-400 hover:bg-blue-500 hover:text-white transition-all active:scale-95"
                  title="Discuss with Agent Zero"
                >
                  <MessageSquare className="w-5 h-5" />
                </button>
                {!design.frames && (
                  <button 
                    onClick={() => onGenerate360(design)}
                    className="p-3 bg-orange-500/20 backdrop-blur-md border border-orange-500/50 rounded-full text-orange-400 hover:bg-orange-500 hover:text-white transition-all active:scale-95"
                    title="Generate 360 View"
                  >
                    <Rotate3d className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="absolute bottom-3 right-3 pointer-events-none opacity-40">
                <span className="text-[8px] font-orbitron text-white uppercase tracking-widest">{WATERMARK_TEXT}</span>
              </div>
            </div>
            <div className="p-5 flex justify-between items-start">
              <div className="flex-1 truncate">
                <h3 className="text-sm font-bold text-white truncate uppercase tracking-wide">{design.concept.name}</h3>
                <p className="text-zinc-500 text-[10px] mt-1 truncate italic">{design.formData.style}</p>
              </div>
              <div className="flex gap-1">
                {design.formData.colors.slice(0, 2).map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-full border border-white/10" title={c} />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedDesign && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setSelectedDesign(null)} />
          <div className="relative w-full max-w-5xl bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 flex flex-col lg:flex-row max-h-[90vh]">
            <div className="lg:w-2/3 bg-black flex items-center justify-center relative min-h-[400px]">
              {selectedDesign.frames ? (
                <ThreeSixtyViewer frames={selectedDesign.frames} />
              ) : (
                <img src={selectedDesign.url} className="max-w-full max-h-full object-contain" alt="Selected design" />
              )}
              <button onClick={() => setSelectedDesign(null)} className="absolute top-6 right-6 p-2 bg-black/50 hover:bg-red-500 text-white rounded-full z-10"><X /></button>
            </div>
            <div className="lg:w-1/3 p-8 overflow-y-auto bg-zinc-900 border-l border-zinc-800 space-y-6">
                <h3 className="text-2xl font-orbitron font-bold text-white leading-tight uppercase">{selectedDesign.concept.name}</h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Specifications</h4>
                    <p className="text-zinc-300 text-sm leading-relaxed">{selectedDesign.concept.rationale}</p>
                  </div>
                  <div className="p-3 bg-zinc-800/50 rounded-xl border border-zinc-800">
                    <h4 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2">3M Color Engine Selection</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDesign.formData.colors.map((c, i) => (
                        <span key={i} className="px-2 py-1 bg-zinc-800 text-[10px] font-bold text-orange-500 rounded border border-orange-500/20">{c}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="pt-4 grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => {
                      onPromote(selectedDesign, 'editor');
                      setSelectedDesign(null);
                    }} 
                    className="flex items-center justify-center gap-2 bg-purple-600 text-white font-bold py-3 rounded-xl hover:bg-purple-500 transition-all text-xs uppercase tracking-widest"
                  >
                    <Wand2 className="w-4 h-4" /> Open in Image Editor
                  </button>
                  <button 
                    onClick={() => {
                      onPromote(selectedDesign, 'agent');
                      setSelectedDesign(null);
                    }} 
                    className="flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition-all text-xs uppercase tracking-widest"
                  >
                    <MessageSquare className="w-4 h-4" /> Discuss with Agent Zero
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleDownload(selectedDesign.url, selectedDesign.id)} className="flex items-center justify-center gap-2 bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-all text-xs uppercase tracking-widest">
                      <Download className="w-4 h-4" /> Save
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-zinc-800 text-white font-bold py-3 rounded-xl hover:bg-zinc-700 transition-all text-xs uppercase tracking-widest">
                      <Share2 className="w-4 h-4" /> Share
                    </button>
                  </div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
