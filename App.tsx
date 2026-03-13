
import React, { useState } from 'react';
import DesignForm from './components/DesignForm';
import Gallery from './components/Gallery';
import LeadModal from './components/LeadModal';
import MediaUploader from './components/MediaUploader';
import MediaLab from './components/MediaLab';
import AIAgent from './components/AIAgent';
import { VehicleData, DesignPreferences, DesignObject, GenerationState, Lead, ChatMessage } from './types';
import { 
  generateDesignConcepts, 
  generateProImage, 
  editImage, 
  chatWithThinking,
  generate360Perspectives,
  identifyVehicle
} from './services/geminiService';
import { FREE_LIMIT, COLORS_3M_DB, DESIGN_STYLES } from './constants';
import { Zap, Layout, Wand2, MessageCircle, AlertTriangle, RotateCcw, Shield } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'studio' | 'editor' | 'agent'>('studio');
  const [vehicle, setVehicle] = useState<VehicleData>({ type: '', manufacturer: '', model: '', year: '' });
  const [design, setDesign] = useState<DesignPreferences>({ style: 'Solid Color (Plain Wrap)', colors: [], theme: 'Clean' });
  const [designs, setDesigns] = useState<DesignObject[]>([]);
  const [generationState, setGenerationState] = useState<GenerationState>(GenerationState.IDLE);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const canGenerate = !!(
    (referenceImage || (vehicle.type && vehicle.manufacturer && vehicle.model)) && 
    design.colors.length > 0
  );

  const checkApiKey = async () => {
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
      await window.aistudio.openSelectKey();
      return true;
    }
    return true;
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setVehicle({ type: '', manufacturer: '', model: '', year: '' });
    setDesign({ style: 'Solid Color (Plain Wrap)', colors: [], theme: 'Clean' });
    setReferenceImage(null);
    setMessages([]);
    setErrorMessage(null);
    setActiveTab('studio');
    setShowResetConfirm(false);
  };

  const handleFileSelect = async (base64: string) => {
    setReferenceImage(base64);
    setGenerationState(GenerationState.THINKING);
    try {
      const detectedVehicle = await identifyVehicle(base64);
      setVehicle(detectedVehicle);
    } catch (err) {
      console.error("Failed to identify vehicle", err);
    } finally {
      setGenerationState(GenerationState.IDLE);
    }
  };

  const handleGenerateDesign = async () => {
    if (designs.length >= FREE_LIMIT) {
      setShowLimitModal(true);
      return;
    }

    setErrorMessage(null);
    try {
      await checkApiKey();
      setGenerationState(GenerationState.GENERATING_CONCEPTS);
      const studioDesign = { ...design, style: 'Solid Color (Plain Wrap)', theme: 'High-end showcase' };
      const concepts = await generateDesignConcepts(vehicle, studioDesign, !!referenceImage, referenceImage || undefined);
      
      setGenerationState(GenerationState.GENERATING_IMAGE);
      const vehicleName = referenceImage 
        ? "the vehicle in the photo" 
        : `${vehicle.year} ${vehicle.manufacturer} ${vehicle.model} ${vehicle.type}`;

      const prompt = referenceImage 
        ? `Apply a professional 3M ${studioDesign.style}. ${concepts[0].description}. Colors: ${studioDesign.colors.join(', ')}.`
        : `${vehicleName} with a clean 3M ${studioDesign.style}. ${concepts[0].description}. Cinematic automotive photography in a professional studio. Colors: ${studioDesign.colors.join(', ')}.`;
      
      const imageUrl = await generateProImage(prompt, vehicle, '16:9', '1K', referenceImage || undefined);

      const newDesign: DesignObject = {
        id: Date.now().toString(),
        url: imageUrl,
        type: 'image',
        formData: { ...vehicle, ...studioDesign },
        concept: concepts[0],
        timestamp: new Date().toISOString()
      };

      setDesigns(prev => [newDesign, ...prev]);
      setGenerationState(GenerationState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Something went wrong with the generation.");
      setGenerationState(GenerationState.ERROR);
    } finally {
      setTimeout(() => setGenerationState(GenerationState.IDLE), 5000);
    }
  };

  const handleGenerate360 = async (designToAugment: DesignObject) => {
    setErrorMessage(null);
    try {
      await checkApiKey();
      setGenerationState(GenerationState.GENERATING_360);
      const prompt = `${designToAugment.concept.name}. Style: ${designToAugment.formData.style}. Colors: ${designToAugment.formData.colors.join(', ')}.`;
      const frames = await generate360Perspectives(designToAugment.url, prompt, designToAugment.formData);
      setDesigns(prev => prev.map(d => d.id === designToAugment.id ? { ...d, frames } : d));
      setGenerationState(GenerationState.SUCCESS);
    } catch (err) {
      setGenerationState(GenerationState.ERROR);
    } finally {
      setTimeout(() => setGenerationState(GenerationState.IDLE), 5000);
    }
  };

  const handleEditImage = async (prompt: string) => {
    if (!referenceImage) return;
    setErrorMessage(null);
    try {
      setGenerationState(GenerationState.GENERATING_IMAGE);
      const editedUrl = await editImage(referenceImage, prompt, vehicle);
      const newDesign: DesignObject = {
        id: Date.now().toString(),
        url: editedUrl,
        type: 'image',
        formData: { ...vehicle, ...design },
        concept: { name: "Creative Iteration", description: prompt, rationale: "Custom design refined in the Image Lab." },
        timestamp: new Date().toISOString()
      };
      setDesigns(prev => [newDesign, ...prev]);
      setGenerationState(GenerationState.SUCCESS);
    } catch (err) {
      setGenerationState(GenerationState.ERROR);
    } finally {
      setTimeout(() => setGenerationState(GenerationState.IDLE), 5000);
    }
  };

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setGenerationState(GenerationState.THINKING);
    try {
      const response = await chatWithThinking(text, messages, referenceImage || undefined);
      const botMsg: ChatMessage = { role: 'model', text: response };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Error connecting to Agent Zero." }]);
    } finally {
      setGenerationState(GenerationState.IDLE);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    const lower = suggestion.toLowerCase();
    const detectedColors = COLORS_3M_DB
      .filter(c => lower.includes(c.name.toLowerCase()) || lower.includes(c.code.toLowerCase()))
      .map(c => `${c.name} (${c.code})`);

    const detectedStyle = DESIGN_STYLES.find(s => lower.includes(s.toLowerCase().split('(')[0].trim())) || design.style;

    if (detectedColors.length > 0) {
      setDesign(prev => ({ ...prev, colors: detectedColors, style: detectedStyle }));
      setActiveTab('studio');
      setMessages(prev => [...prev, { role: 'model', text: `Strategy applied: ${detectedStyle} with ${detectedColors.join(', ')}. Ready to visualize in the Base Coat tab.` }]);
    }
  };

  const promoteToWorkspace = (design: DesignObject, destination: 'editor' | 'agent') => {
    setReferenceImage(design.url);
    setActiveTab(destination);
    if (design.formData) {
      setVehicle({ type: design.formData.type, manufacturer: design.formData.manufacturer, model: design.formData.model, year: design.formData.year });
    }
    if (destination === 'agent') {
      handleSendMessage(`Analyze this design: "${design.concept.name}". Give me a brief strategic critique.`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <nav className="h-20 border-b border-zinc-900 px-6 lg:px-12 flex items-center justify-between sticky top-0 bg-zinc-950/80 backdrop-blur-md z-50">
        <a href="https://thatzawraparizona.com/" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center shadow-lg overflow-hidden border border-zinc-800">
            <img 
              src="https://ais-dev-rtwwqqtzqschh3j2hrmvb2-99742305336.us-east1.run.app/logo.png" 
              alt="Tread & Torque Logo" 
              className="w-full h-full object-contain p-1"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<div class="text-red-600 font-black italic">T&T</div>';
              }}
            />
          </div>
          <div>
            <h1 className="text-xl font-orbitron font-black tracking-tighter italic whitespace-nowrap">
              TREAD & <span className="text-red-600">TORQUE</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">PRO WRAP VISUALIZER</p>
          </div>
        </a>
        
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
             <button onClick={() => setActiveTab('studio')} className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'studio' ? 'bg-zinc-800 text-red-600' : 'text-zinc-500 hover:text-white'}`}>
               <Layout className="w-4 h-4" /> 1. BASE COAT
             </button>
             <button onClick={() => setActiveTab('editor')} className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'editor' ? 'bg-zinc-800 text-purple-500' : 'text-zinc-500 hover:text-white'}`}>
               <Wand2 className="w-4 h-4" /> 2. DESIGN LAB
             </button>
             <button onClick={() => setActiveTab('agent')} className={`px-5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${activeTab === 'agent' ? 'bg-zinc-800 text-blue-500' : 'text-zinc-500 hover:text-white'}`}>
               <MessageCircle className="w-4 h-4" /> 3. AGENT ZERO
             </button>
          </div>

          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-400 hover:text-red-600 hover:border-red-600/50 transition-all uppercase tracking-widest"
          >
            <RotateCcw className="w-3 h-3" />
            New Project
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6 lg:p-12 overflow-x-hidden">
        {errorMessage && (
          <div className="max-w-[1700px] mx-auto mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
              <AlertTriangle className="text-red-500 w-5 h-5" />
              <p className="text-sm text-red-200">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="max-w-[1700px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-6">
            <MediaUploader 
              currentImage={referenceImage} 
              onFileSelect={handleFileSelect} 
              onClear={() => setReferenceImage(null)} 
            />
            
            {activeTab === 'studio' && (
              <DesignForm 
                vehicle={vehicle} design={design}
                onChangeVehicle={(v) => setVehicle(prev => ({ ...prev, ...v }))}
                onChangeDesign={(d) => setDesign(prev => ({ ...prev, ...d }))}
                onGenerate={handleGenerateDesign}
                isLoading={generationState === GenerationState.GENERATING_IMAGE || generationState === GenerationState.GENERATING_CONCEPTS}
                canGenerate={canGenerate}
                hasReferenceImage={!!referenceImage}
              />
            )}
            
            {activeTab === 'editor' && (
              <MediaLab 
                onEditImage={handleEditImage}
                isLoading={generationState === GenerationState.GENERATING_IMAGE}
                referenceImage={referenceImage}
              />
            )}

            {activeTab === 'agent' && (
              <AIAgent 
                messages={messages}
                onSendMessage={handleSendMessage}
                onSelectSuggestion={handleSuggestionSelect}
                isLoading={generationState === GenerationState.THINKING}
                referenceImage={referenceImage}
              />
            )}
          </div>

          <div className="lg:col-span-8">
            <Gallery 
              designs={designs} 
              generationState={generationState}
              onGenerate360={handleGenerate360}
              onPromote={promoteToWorkspace}
            />
          </div>
        </div>
      </main>

      {showLimitModal && <LeadModal type="limit" onClose={() => setShowLimitModal(false)} onSubmit={() => {}} />}
      
      {showResetConfirm && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowResetConfirm(false)} />
          <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl p-8 border border-zinc-800 shadow-2xl text-center space-y-6">
            <div className="inline-flex p-4 bg-red-600/10 rounded-full">
              <RotateCcw className="w-10 h-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-orbitron font-black text-white italic uppercase">New Project?</h2>
              <p className="text-zinc-400 text-sm leading-relaxed">
                This will clear your current workspace and chat history. Your saved gallery will remain.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={confirmReset}
                className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl transition-all uppercase tracking-widest text-xs"
              >
                Confirm Reset
              </button>
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 font-black rounded-xl transition-all uppercase tracking-widest text-xs"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
