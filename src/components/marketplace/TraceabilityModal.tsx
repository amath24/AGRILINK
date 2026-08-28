import React from 'react';
import { Product } from '../../types';

interface TraceabilityModalProps {
  product: Product;
  onClose: () => void;
}

export const TraceabilityModal: React.FC<TraceabilityModalProps> = ({ product, onClose }) => {
  return (
    <div
      id="traceability-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        id="traceability-modal-content"
        className="bg-[#FAF8F2] border border-[#c1c9be] rounded-2xl sm:rounded-3xl w-full max-w-lg min-w-[300px] sm:min-w-[500px] shadow-2xl max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white border-b border-[#c1c9be]/60 px-5 sm:px-6 py-4 flex justify-between items-center sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[24px]">qr_code_scanner</span>
            <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#164525]">
              Traçabilité Numérique
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#717970] hover:text-[#2b1700] p-1 rounded-full hover:bg-[#fff1e6] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 flex flex-col gap-4">
          {/* Header Lot */}
          <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-[#c1c9be]">
            <img
              src={product.image}
              alt={product.nom}
              className="w-14 h-14 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
                {product.nom}
              </h3>
              <p className="text-[13px] text-[#717970]">{product.producteur}</p>
              <p className="text-[12px] font-mono text-[#164525] font-bold">
                LOT ID: SN-AGRI-{(product.id).toUpperCase().slice(0, 8)}-2025
              </p>
            </div>
          </div>

          {/* Trace steps */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#c1c9be]/50">
              <span className="w-6 h-6 rounded-full bg-[#164525] text-white flex items-center justify-center text-[12px] shrink-0 mt-0.5">
                🌱
              </span>
              <div>
                <h4 className="font-semibold text-[14px] text-[#2b1700]">Semences Certifiées</h4>
                <p className="text-[12px] text-[#414941]">Semences locales biologiques sans OGM enregistrées au registre national.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#c1c9be]/50">
              <span className="w-6 h-6 rounded-full bg-[#164525] text-white flex items-center justify-center text-[12px] shrink-0 mt-0.5">
                💧
              </span>
              <div>
                <h4 className="font-semibold text-[14px] text-[#2b1700]">Irrigation & Sol</h4>
                <p className="text-[12px] text-[#414941]">Parcelle à {product.localisation} irriguée au goutte-à-goutte, fertilisation organique 100% naturelle.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-[#c1c9be]/50">
              <span className="w-6 h-6 rounded-full bg-[#164525] text-white flex items-center justify-center text-[12px] shrink-0 mt-0.5">
                📦
              </span>
              <div>
                <h4 className="font-semibold text-[14px] text-[#2b1700]">Date prévisionnelle de récolte</h4>
                <p className="text-[12px] text-[#164525] font-semibold">{product.dateDisponibilite}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#164525] text-white font-semibold py-2.5 rounded-full hover:bg-[#2f5d3a] transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
