
import React, { useState, useEffect } from 'react';
import { Settings, X, Save, Server, Key, Box, Globe } from 'lucide-react';
import { AISettings, AIProvider, DEFAULT_SETTINGS, STORAGE_KEY_SETTINGS } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<AISettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      }
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    onClose();
  };

  const handleProviderChange = (provider: AIProvider) => {
    let newDefaults = { ...settings, provider };
    // Set reasonable defaults when switching
    if (provider === AIProvider.OPENAI) {
      if (settings.baseUrl === DEFAULT_SETTINGS.baseUrl) { // Only reset if it looks like default
          newDefaults.baseUrl = 'http://localhost:11434/v1';
          newDefaults.model = 'llama3';
      }
    } else if (provider === AIProvider.GEMINI_ENV || provider === AIProvider.GEMINI_CUSTOM) {
       newDefaults.model = 'gemini-2.5-flash';
    }
    setSettings(newDefaults);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-800">
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Settings className="text-blue-400" size={20} />
            AI 设置
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          
          {/* Provider Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">模型服务商 Provider</label>
            <div className="grid grid-cols-1 gap-2">
               <button 
                  onClick={() => handleProviderChange(AIProvider.GEMINI_ENV)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${settings.provider === AIProvider.GEMINI_ENV ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800/80'}`}
               >
                 <Globe size={18} />
                 <div>
                   <div className="font-bold text-sm">内置 Gemini (默认)</div>
                   <div className="text-xs opacity-70">使用应用预设的 API Key</div>
                 </div>
               </button>

               <button 
                  onClick={() => handleProviderChange(AIProvider.GEMINI_CUSTOM)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${settings.provider === AIProvider.GEMINI_CUSTOM ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800/80'}`}
               >
                 <Key size={18} />
                 <div>
                   <div className="font-bold text-sm">自定义 Gemini Key</div>
                   <div className="text-xs opacity-70">使用您自己的 Google API Key</div>
                 </div>
               </button>

               <button 
                  onClick={() => handleProviderChange(AIProvider.OPENAI)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${settings.provider === AIProvider.OPENAI ? 'bg-blue-600/20 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800/80'}`}
               >
                 <Server size={18} />
                 <div>
                   <div className="font-bold text-sm">OpenAI / OLLaMA</div>
                   <div className="text-xs opacity-70">兼容接口 (本地模型或第三方)</div>
                 </div>
               </button>
            </div>
          </div>

          {/* Conditional Inputs */}
          {settings.provider === AIProvider.GEMINI_CUSTOM && (
            <div className="space-y-2 animate-fade-in">
               <label className="text-sm font-medium text-slate-300">API Key</label>
               <input 
                  type="password" 
                  value={settings.apiKey}
                  onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="AIza..."
               />
            </div>
          )}

          {settings.provider === AIProvider.OPENAI && (
            <div className="space-y-4 animate-fade-in">
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-300">Base URL</label>
                 <input 
                    type="text" 
                    value={settings.baseUrl}
                    onChange={(e) => setSettings({...settings, baseUrl: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                    placeholder="http://localhost:11434/v1"
                 />
                 <p className="text-xs text-slate-500">OLLaMA 默认: http://localhost:11434/v1</p>
               </div>
               <div className="space-y-2">
                 <label className="text-sm font-medium text-slate-300">API Key (可选)</label>
                 <input 
                    type="password" 
                    value={settings.apiKey}
                    onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="sk-..."
                 />
               </div>
            </div>
          )}

          <div className="space-y-2">
             <label className="text-sm font-medium text-slate-300">模型名称 Model Name</label>
             <div className="relative">
               <Box className="absolute left-3 top-2.5 text-slate-500" size={16} />
               <input 
                  type="text" 
                  value={settings.model}
                  onChange={(e) => setSettings({...settings, model: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder={settings.provider === AIProvider.OPENAI ? "llama3" : "gemini-2.5-flash"}
               />
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 bg-slate-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white font-medium transition-colors"
          >
            取消
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg shadow-lg flex items-center gap-2 transition-colors"
          >
            <Save size={18} /> 保存设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
