import React, { useState, useEffect } from 'react';
import { X, MessageCircle, Send, MessageSquare } from 'lucide-react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');

  useEffect(() => {
    // Fetch configuration from localStorage
    const storedWA = localStorage.getItem('peps_whatsapp_number') || '692907796';
    const storedTG = localStorage.getItem('peps_telegram_username') || 'BuySwissPeptide';
    
    setWhatsappNumber(storedWA);
    setTelegramUsername(storedTG);

    // Show popup after 1.5 seconds when visitor lands on the page
    const timer = setTimeout(() => {
      // Show popup only if chat widget is not already open
      if (!localStorage.getItem('peps_chat_popup_dismissed')) {
        setShowPopup(true);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Listen to localstorage updates in case they change in AdminPortal
  useEffect(() => {
    const handleStorageChange = () => {
      const storedWA = localStorage.getItem('peps_whatsapp_number') || '692907796';
      const storedTG = localStorage.getItem('peps_telegram_username') || 'BuySwissPeptide';
      setWhatsappNumber(storedWA);
      setTelegramUsername(storedTG);
    };

    window.addEventListener('storage', handleStorageChange);
    // Interval check for inside single-page context transitions since storage event only fires across tabs
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleDismissPopup = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPopup(false);
    localStorage.setItem('peps_chat_popup_dismissed', 'true');
  };

  const handleToggleWidget = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setShowPopup(false);
      localStorage.setItem('peps_chat_popup_dismissed', 'true');
    }
  };

  const getWhatsAppLink = () => {
    if (!whatsappNumber) return '#';
    // If it's already a full link, use it
    if (whatsappNumber.includes('http') || whatsappNumber.includes('wa.me')) {
      return whatsappNumber;
    }
    // Clean spaces, plus sign, brackets, dashes to build clean wa.me link
    const cleanNum = whatsappNumber.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNum}`;
  };

  const getTelegramLink = () => {
    if (!telegramUsername) return '#';
    // If it's already a full link, use it
    if (telegramUsername.includes('http') || telegramUsername.includes('t.me')) {
      return telegramUsername;
    }
    // Remove leading '@' sign if present
    const cleanTG = telegramUsername.replace(/^@/, '').trim();
    return `https://t.me/${cleanTG}`;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-sans flex flex-col items-end select-none">
      {/* Speech Bubble Popup */}
      {showPopup && !isOpen && (
        <div 
          onClick={handleToggleWidget}
          className="relative mb-3.5 bg-white text-[#0B1E33] border border-gray-150 px-4 py-3 rounded-2xl shadow-xl max-w-[260px] animate-bounce duration-1000 cursor-pointer text-left transition-all hover:scale-102 hover:shadow-2xl"
        >
          {/* Close button for popup */}
          <button 
            onClick={handleDismissPopup}
            className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-200 flex items-center justify-center transition-all p-0"
            title="Close"
          >
            <X className="w-2.5 h-2.5" />
          </button>
          
          <div className="pr-3 py-1">
            <p className="text-xs font-semibold text-gray-800 leading-snug">
              Hi there, chat with us directly here!
            </p>
          </div>
          
          {/* Down-facing arrow tail */}
          <div className="absolute right-6 -bottom-1.5 w-3 h-3 bg-white border-r border-b border-gray-150 transform rotate-45"></div>
        </div>
      )}

      {/* Main Multi-channel Chat Modal Options box */}
      {isOpen && (
        <div className="flex flex-col gap-3 mb-3 animate-fadeIn">
          {/* WhatsApp option */}
          <a 
            href={getWhatsAppLink()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:shadow-[#25D366]/40 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-[#25D366]"
            title="WhatsApp Helpline"
          >
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
            </svg>
          </a>

          {/* Telegram option */}
          <a 
            href={getTelegramLink()} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="w-14 h-14 rounded-full bg-[#0088cc] text-white flex items-center justify-center shadow-2xl hover:shadow-[#0088cc]/40 hover:scale-110 active:scale-95 transition-all cursor-pointer border border-[#0088cc]"
            title="Telegram Channel"
          >
            <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm5.556 8.356l-1.922 9.078c-.144.644-.522.8-.1056.456l-2.933-2.156-1.411 1.356c-.156.156-.289.289-.589.289l.211-2.989 5.433-4.911c.233-.211-.056-.322-.367-.111L10.022 13.04l-2.9-.911c-.633-.2-.644-.633.133-.933l11.333-4.378c.522-.2.978.111.756 1.138z" />
            </svg>
          </a>
        </div>
      )}

      {/* Main Activator floating circular button */}
      <button 
        onClick={handleToggleWidget}
        className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all shadow-xl hover:shadow-2xl cursor-pointer ${
          isOpen 
            ? 'bg-slate-900 ring-4 ring-slate-100' 
            : 'bg-[#DE5246] hover:bg-black active:scale-95 animate-pulse-slow'
        }`}
        title="Chat Assistance Help Desk"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform rotate-0" />
        ) : (
          <MessageCircle className="w-6 h-6 animate-none" />
        )}
      </button>
    </div>
  );
}
