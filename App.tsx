
import React, { useState } from 'react';
import ParticleBackground from './components/ParticleBackground';
import InputForm from './components/InputForm';
import TicketPreview from './components/TicketPreview';
import SettingsModal from './components/SettingsModal';
import { TicketData } from './types';
import { Rocket, Settings } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<'input' | 'preview'>('input');
  const [ticketData, setTicketData] = useState<TicketData | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleFormSubmit = (data: TicketData) => {
    setTicketData(data);
    setMode('preview');
  };

  const handleEdit = () => {
    setMode('input');
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden text-white font-sans selection:bg-blue-500 selection:text-white">
      <ParticleBackground />
      
      {/* Header */}
      <header className="pt-8 pb-4 px-4 flex justify-between items-center animate-fade-in-down print:hidden container mx-auto">
        <div className="flex items-center gap-3">
            <div className="bg-blue-600/20 p-3 rounded-full backdrop-blur border border-blue-400/30">
                <Rocket className="text-blue-400" size={32} />
            </div>
            <div>
                <h1 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-white to-purple-300">
                长者行程卡
                </h1>
                <p className="text-blue-200/60 text-sm tracking-widest uppercase mt-1">Elder Journey Card</p>
            </div>
        </div>
        
        <button 
            onClick={() => setShowSettings(true)}
            className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-all backdrop-blur"
            title="设置 Settings"
        >
            <Settings size={24} />
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20 relative z-10">
        {mode === 'input' ? (
          <InputForm onSubmit={handleFormSubmit} />
        ) : (
          ticketData && <TicketPreview data={ticketData} onEdit={handleEdit} />
        )}
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 w-full text-center py-4 text-slate-500 text-xs print:hidden bg-slate-900/80 backdrop-blur-md border-t border-slate-800 z-0">
        <p>让出行更清晰，让关爱更贴心</p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

      {/* Tailwind Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default App;
