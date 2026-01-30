
import React, { useState } from 'react';
import { VEHICLE_TYPES, MANUFACTURERS, MODELS_BY_MANUFACTURER, COLORS_3M_DB, ThreeMColor } from '../constants';
import { VehicleData, DesignPreferences } from '../types';
import { ChevronDown, Sparkles, Image as ImageIcon, Search, Palette, Info } from 'lucide-react';

interface Props {
  vehicle: VehicleData;
  design: DesignPreferences;
  onChangeVehicle: (v: Partial<VehicleData>) => void;
  onChangeDesign: (d: Partial<DesignPreferences>) => void;
  onGenerate: () => void;
  isLoading: boolean;
  canGenerate: boolean;
  hasReferenceImage: boolean;
}

const DesignForm: React.FC<Props> = ({ 
  vehicle, design, onChangeVehicle, onChangeDesign, onGenerate, isLoading, canGenerate, hasReferenceImage 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<ThreeMColor['category'] | 'All'>('All');
  
  const optionalLabel = hasReferenceImage ? " (Optional)" : "";
  const categories: (ThreeMColor['category'] | 'All')[] = ['All', 'Gloss', 'Satin', 'Matte', 'Color Flip', 'Texture', 'Chrome'];

  const filteredColors = COLORS_3M_DB.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleColor = (colorName: string) => {
    const newColors = design.colors.includes(colorName)
      ? design.colors.filter(c => c !== colorName)
      : [...design.colors, colorName];
    onChangeDesign({ colors: newColors });
  };

  return (
    <div className="flex flex-col gap-6 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-xl overflow-y-auto max-h-[calc(100vh-200px)] lg:max-h-none lg:sticky lg:top-24">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Sparkles className="text-orange-500 w-5 h-5" />
            Vehicle Configuration
          </span>
        </h2>
        {hasReferenceImage ? (
          <div className="flex items-center gap-2 text-green-500/80 text-[10px] font-bold uppercase tracking-widest">
            <ImageIcon className="w-3 h-3" />
            Active Design Context Loaded
          </div>
        ) : (
          <p className="text-zinc-400 text-sm">Define your base vehicle specs</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">Vehicle Type{optionalLabel}</label>
          <div className="relative">
            <select 
              value={vehicle.type}
              onChange={(e) => onChangeVehicle({ type: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3 text-white appearance-none focus:ring-2 focus:ring-orange-500/50 outline-none transition-all"
            >
              <option value="">Select Type</option>
              {VEHICLE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-zinc-500 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">Brand{optionalLabel}</label>
            <select 
              value={vehicle.manufacturer}
              onChange={(e) => onChangeVehicle({ manufacturer: e.target.value, model: '' })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3 text-white appearance-none outline-none focus:ring-2 focus:ring-orange-500/50"
            >
              <option value="">Select Brand</option>
              {MANUFACTURERS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">Year{optionalLabel}</label>
            <input 
              type="text" placeholder="2024" value={vehicle.year}
              onChange={(e) => onChangeVehicle({ year: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3 text-white outline-none focus:ring-2 focus:ring-orange-500/50"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">Model{optionalLabel}</label>
          <input 
            type="text" placeholder="e.g. Corvette C8" value={vehicle.model}
            onChange={(e) => onChangeVehicle({ model: e.target.value })}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-2.5 px-3 text-white outline-none focus:ring-2 focus:ring-orange-500/50"
          />
        </div>
      </div>

      <div className="h-px bg-zinc-800" />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Palette className="w-3 h-3 text-orange-500" />
            3M™ Wrap Film Library
          </label>
          <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-600">
            <Info className="w-3 h-3" /> 2080 SERIES
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Search color name or code (e.g. M203)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:ring-2 focus:ring-orange-500/50 outline-none transition-all placeholder:text-zinc-700"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  activeCategory === cat 
                  ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/20' 
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
          {filteredColors.map((color) => {
            const isSelected = design.colors.includes(`${color.name} (${color.code})`);
            return (
              <button
                key={color.code}
                onClick={() => toggleColor(`${color.name} (${color.code})`)}
                className={`group relative flex flex-col items-center gap-1.5 p-1 rounded-lg transition-all ${
                  isSelected ? 'bg-orange-500/10 ring-1 ring-orange-500' : 'hover:bg-zinc-800/50'
                }`}
              >
                <div 
                  className="w-full aspect-square rounded-md shadow-inner relative overflow-hidden"
                  style={{ background: color.hex, boxShadow: isSelected ? '0 0 15px rgba(249, 115, 22, 0.4)' : 'none' }}
                >
                   {color.category === 'Matte' && <div className="absolute inset-0 bg-white/5" />}
                   {color.category === 'Satin' && <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-white/10 to-transparent" />}
                   {color.category === 'Chrome' && <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-transparent to-black/20 mix-blend-overlay" />}
                   {isSelected && (
                     <div className="absolute inset-0 flex items-center justify-center bg-orange-500/20">
                        <Sparkles className="w-4 h-4 text-white" />
                     </div>
                   )}
                </div>
                <div className="text-center overflow-hidden w-full">
                  <p className="text-[8px] font-black text-white leading-none truncate">{color.code}</p>
                  <p className="text-[7px] font-medium text-zinc-500 truncate uppercase mt-0.5">{color.name}</p>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 p-2 bg-zinc-950 border border-zinc-800 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-2xl">
                  <p className="text-[9px] font-black text-orange-500 uppercase">{color.category}</p>
                  <p className="text-[10px] font-bold text-white">{color.name}</p>
                  <p className="text-[8px] text-zinc-500 mt-1">3M 2080 Series • {color.code}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-auto">
        <button
          onClick={onGenerate}
          disabled={isLoading || !canGenerate}
          className={`w-full py-5 rounded-xl font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 transition-all shadow-lg ${
            isLoading || !canGenerate 
            ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-400 hover:to-purple-500 text-white active:scale-[0.98]'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span className="animate-pulse">RENDERING BASE COAT...</span>
            </div>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>INITIALIZE 3M WRAP</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DesignForm;
