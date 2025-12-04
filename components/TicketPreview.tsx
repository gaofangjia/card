import React, { useRef } from 'react';
import { TicketData, TransportType } from '../types';
import { Download, Printer, ArrowLeft, Edit3, Train, Plane } from 'lucide-react';

// Use a declaration to satisfy TS for the external library loaded via CDN
declare global {
  interface Window {
    html2canvas: any;
  }
}

interface TicketPreviewProps {
  data: TicketData;
  onEdit: () => void;
}

const TicketPreview: React.FC<TicketPreviewProps> = ({ data, onEdit }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (printRef.current && window.html2canvas) {
      try {
        const canvas = await window.html2canvas(printRef.current, {
          scale: 2, // Higher quality
          backgroundColor: '#ffffff',
          useCORS: true
        });
        const link = document.createElement('a');
        link.download = `${data.passengerName || '行程'}-${data.date}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        console.error("Download failed", err);
        alert("下载失败，请重试");
      }
    } else {
        alert("组件加载中，请稍后...");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const isTrain = data.type === TransportType.TRAIN;

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-4 animate-fade-in-up">
      <div className="flex justify-between w-full mb-6 print:hidden">
        <button 
          onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur hover:bg-white/20 text-white rounded-full transition-all"
        >
          <ArrowLeft size={20} /> 返回编辑
        </button>
        <div className="flex gap-4">
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg transition-all"
          >
            <Download size={20} /> 保存图片
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-full shadow-lg transition-all"
          >
            <Printer size={20} /> 打印
          </button>
        </div>
      </div>

      {/* The Printable Card */}
      <div 
        id="printable-area"
        ref={printRef}
        className="w-full bg-white text-black rounded-3xl overflow-hidden shadow-2xl relative border-8 border-gray-100 overflow-x-auto"
        style={{ aspectRatio: '1.6/1', minHeight: '600px', minWidth: '1000px' }}
      >
        {/* Header / Banner */}
        <div className={`w-full h-32 ${isTrain ? 'bg-gradient-to-r from-blue-700 to-blue-900' : 'bg-gradient-to-r from-sky-600 to-sky-800'} flex items-center justify-between px-10 text-white`}>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-white/20 rounded-full">
                {isTrain ? <Train size={48} /> : <Plane size={48} />}
             </div>
             <div>
               <h1 className="text-4xl font-black tracking-widest">{isTrain ? '铁路出行指南' : '航空登机向导'}</h1>
               <p className="text-xl opacity-90 mt-1">祝您旅途平安愉快</p>
             </div>
          </div>
          <div className="text-right">
             <div className="text-5xl font-mono font-bold tracking-tighter">{data.number || '---'}</div>
             <div className="text-lg opacity-80 uppercase tracking-widest mt-1">{isTrain ? '车次 Train No.' : '航班 Flight No.'}</div>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-10 flex flex-col h-[calc(100%-8rem)] justify-between">
            
            {/* Stations / Cities - Adjusted Size */}
            <div className="flex justify-between items-center border-b-4 border-dashed border-gray-300 pb-8">
                <div className="text-left w-2/5">
                    <p className="text-gray-500 text-2xl font-bold mb-2">出发 Origin</p>
                    <h2 className="text-5xl font-black text-gray-900 leading-tight break-words">{data.origin || '---'}</h2>
                </div>
                
                <div className="flex flex-col items-center justify-center w-1/5 opacity-30">
                     <div className="w-full h-2 bg-gray-900 rounded-full relative">
                        <div className="absolute -right-2 -top-2 w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-gray-900 border-b-8 border-b-transparent"></div>
                     </div>
                </div>

                <div className="text-right w-2/5">
                    <p className="text-gray-500 text-2xl font-bold mb-2">到达 Destination</p>
                    <h2 className="text-5xl font-black text-gray-900 leading-tight break-words">{data.destination || '---'}</h2>
                </div>
            </div>

            {/* Crucial Info Grid */}
            <div className="grid grid-cols-2 gap-8 mt-6">
                
                {/* Date & Time */}
                <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                    <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-gray-500 text-2xl font-bold">日期 Date</span>
                    </div>
                    <div className="text-5xl font-black text-gray-800">{data.date}</div>
                    
                    <div className="mt-6 flex items-baseline gap-4 mb-2">
                        <span className="text-gray-500 text-2xl font-bold">时间 Time</span>
                    </div>
                    <div className="text-6xl font-black text-blue-700">{data.time}</div>
                </div>

                {/* Seat / Gate / Name */}
                <div className="bg-gray-50 p-6 rounded-2xl border-2 border-gray-100 flex flex-col justify-between">
                     <div>
                        <p className="text-gray-500 text-2xl font-bold mb-2">{isTrain ? '座位 Seat' : '登机口/座 Gate/Seat'}</p>
                        <div className="text-7xl font-black text-red-600">{data.gateOrSeat || '---'}</div>
                     </div>
                     
                     <div className="mt-6">
                        <p className="text-gray-500 text-xl font-bold mb-1">乘客 Passenger</p>
                        <div className="text-4xl font-bold text-gray-800 truncate">{data.passengerName || '---'}</div>
                     </div>
                </div>
            </div>

            {/* Footer / Extra Info - Only for Trains */}
            {isTrain && (
              <div className="mt-8 bg-yellow-50 border-l-8 border-yellow-400 p-4 rounded-r-xl">
                   <h3 className="text-xl font-bold text-yellow-800 mb-1">重要提示 Note:</h3>
                   <p className="text-2xl font-medium text-gray-800">
                      {data.extraInfo || '请提前 30 分钟到达车站候车。'}
                   </p>
              </div>
            )}

        </div>
      </div>
      
      <p className="text-gray-400 mt-8 text-sm print:hidden flex items-center gap-2">
         <Edit3 size={16} /> 提示：点击左上角“返回编辑”可修改信息
      </p>
    </div>
  );
};

export default TicketPreview;