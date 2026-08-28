import React from 'react';

interface FooterProps {
  onNavigate?: (view: 'marketplace' | 'about' | 'tracking' | 'register') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#ffffff] w-full py-8 sm:py-10 px-4 md:px-16 border-t border-[#c1c9be]/60 mt-auto">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[20px] sm:text-[22px] font-['Montserrat'] font-extrabold text-[#164525]">
              Agri-Link
            </span>
            <span className="bg-[#bdf1a4] text-[#164525] px-2.5 py-0.5 rounded-full text-[11px] font-bold">
              Direct Producteurs Sénégal
            </span>
          </div>
          <p className="text-[12px] text-[#717970] font-['Inter'] text-center md:text-left max-w-md">
            Plateforme sénégalaise de vente directe et de précommandes agricoles sécurisées avec séquestre 30%.
          </p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 sm:gap-6 text-[13px] sm:text-[14px] font-['Inter'] text-[#414941]">
          {onNavigate ? (
            <>
              <button
                id="footer-marketplace-btn"
                type="button"
                onClick={() => onNavigate('marketplace')}
                className="hover:text-[#164525] font-semibold cursor-pointer transition-colors"
              >
                Offres &amp; Marché
              </button>

              <button
                id="footer-about-btn"
                type="button"
                onClick={() => onNavigate('about')}
                className="hover:text-[#164525] font-semibold cursor-pointer transition-colors text-[#164525] bg-[#164525]/5 px-3 py-1 rounded-lg border border-[#164525]/15"
              >
                À Propos de nous
              </button>

              <button
                id="footer-tracking-btn"
                type="button"
                onClick={() => onNavigate('tracking')}
                className="hover:text-[#164525] font-semibold cursor-pointer transition-colors"
              >
                Suivi de Commande
              </button>

              <button
                id="footer-register-btn"
                type="button"
                onClick={() => onNavigate('register')}
                className="hover:text-[#7d4600] font-bold cursor-pointer transition-colors text-[#7d4600]"
              >
                Devenir Producteur
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4 text-[12px] text-[#717970]">
              <span className="text-[#164525] font-semibold">Paiements Wave &amp; Orange Money</span>
              <span>•</span>
              <span>Séquestre 30%</span>
              <span>•</span>
              <span>Traçabilité QR</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-[1440px] mx-auto mt-6 pt-4 border-t border-[#c1c9be]/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#717970]">
        <span>© {new Date().getFullYear()} Agri-Link Sénégal. Tous droits réservés.</span>
        <span>Niayes • Thiès • Casamance • Vallée du Fleuve</span>
      </div>
    </footer>
  );
};
