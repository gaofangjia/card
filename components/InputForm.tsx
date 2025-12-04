import React, { useState } from 'react';
import { TicketData, TransportType, INITIAL_TICKET } from '../types';
import { parseTicketText } from '../services/geminiService';
import { Sparkles, Train, Plane, Calendar, Clock, MapPin, User, Armchair, Copy } from 'lucide-react';

interface InputFormProps {
  onSubmit: (data: TicketData) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<TicketData>(INITIAL_TICKET);
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);

  const handleChange = (field: keyof TicketData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSmartParse = async () => {
    if (!rawText.trim()) return;
    setIsParsing(true);
    const result = await parseTicketText(rawText);
    if (result) {
      setFormData(result);
    } else {
      alert("无法识别信息，请手动输入");
    }
    setIsParsing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClass = "w-full bg-slate-800/50 border border-slate-600 rounded-xl px-4 py-3 text-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all";
  const labelClass = "block text-blue-200 text-sm font-medium mb-1 ml-1";

  return (
    <div className="w-full max-w-2xl mx-auto p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">创建新的行程</h2>
        <p className="text-slate-300">手动填写或粘贴短信，生成大字版行程卡</p>
      </div>

      {/* Type Selector */}
      <div className="grid grid-cols-2 gap-4 mb-8 p-1 bg-slate-900/50 rounded-2xl">
        <button
          onClick={() => setFormData({ ...formData, type: TransportType.TRAIN })}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
            formData.type === TransportType.TRAIN 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Train size={24} /> 火车票
        </button>
        <button
          onClick={() => setFormData({ ...formData, type: TransportType.FLIGHT })}
          className={`flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${
            formData.type === TransportType.FLIGHT 
              ? 'bg-sky-600 text-white shadow-lg' 
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Plane size={24} /> 机票
        </button>
      </div>

      {/* Smart Parse Section */}
      <div className="mb-10 bg-indigo-900/30 p-4 rounded-2xl border border-indigo-500/30">
        <label className="flex items-center gap-2 text-indigo-200 font-bold mb-2">
          <Sparkles size={18} className="text-yellow-400" /> 智能识别 (AI)
        </label>
        <div className="flex gap-2">
          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="粘贴短信内容，例如：'您预订的 10月1日 G123次列车 北京南-上海虹桥...'"
            className="flex-1 bg-slate-900/50 border border-indigo-500/20 rounded-xl p-3 text-sm text-white focus:ring-2 focus:ring-indigo-400 outline-none resize-none h-20"
          />
          <button
            onClick={handleSmartParse}
            disabled={isParsing || !rawText.trim()}
            className="px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors flex flex-col items-center justify-center gap-1 w-24"
          >
            {isParsing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles size={20} />
                <span className="text-xs">识别</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Manual Inputs */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
           <div>
             <label className={labelClass}>出发地 Origin</label>
             <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input required type="text" value={formData.origin} onChange={e => handleChange('origin', e.target.value)} className={`${inputClass} pl-10`} placeholder="北京" />
             </div>
           </div>
           <div>
             <label className={labelClass}>目的地 Destination</label>
             <div className="relative">
                <MapPin className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input required type="text" value={formData.destination} onChange={e => handleChange('destination', e.target.value)} className={`${inputClass} pl-10`} placeholder="上海" />
             </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
           <div>
             <label className={labelClass}>班次 Number</label>
             <div className="relative">
                <Copy className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input required type="text" value={formData.number} onChange={e => handleChange('number', e.target.value)} className={`${inputClass} pl-10`} placeholder={formData.type === TransportType.TRAIN ? "G123" : "CA1234"} />
             </div>
           </div>
           <div>
             <label className={labelClass}>座位/登机口 Seat/Gate</label>
             <div className="relative">
                <Armchair className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input required type="text" value={formData.gateOrSeat} onChange={e => handleChange('gateOrSeat', e.target.value)} className={`${inputClass} pl-10`} placeholder="01A" />
             </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
           <div>
             <label className={labelClass}>日期 Date</label>
             <div className="relative">
                <Calendar className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input required type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)} className={`${inputClass} pl-10`} />
             </div>
           </div>
           <div>
             <label className={labelClass}>时间 Time</label>
             <div className="relative">
                <Clock className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input required type="time" value={formData.time} onChange={e => handleChange('time', e.target.value)} className={`${inputClass} pl-10`} />
             </div>
           </div>
        </div>

        <div>
             <label className={labelClass}>乘客姓名 Passenger Name</label>
             <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-400" size={20} />
                <input required type="text" value={formData.passengerName} onChange={e => handleChange('passengerName', e.target.value)} className={`${inputClass} pl-10`} placeholder="张三" />
             </div>
        </div>

        <div>
             <label className={labelClass}>备注 Note (选填)</label>
             <input type="text" value={formData.extraInfo || ''} onChange={e => handleChange('extraInfo', e.target.value)} className={inputClass} placeholder="例如：提前2小时到达" />
        </div>

        <button type="submit" className="w-full mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all flex justify-center items-center gap-2 text-xl">
           生成行程卡 <Sparkles />
        </button>
      </form>
    </div>
  );
};

export default InputForm;