import React, { useState } from 'react';
import { TraceabilityLot } from '../../../types';

interface TraceabilityTabProps {
  lots: TraceabilityLot[];
  onAddLot?: (lot: TraceabilityLot) => void;
}

export const TraceabilityTab: React.FC<TraceabilityTabProps> = ({ lots }) => {
  const [selectedLot, setSelectedLot] = useState<TraceabilityLot | null>(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              qr_code_2
            </span>
            <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Traçabilité & Passeport Produits (QR Code)
            </h1>
          </div>
          <p className="text-[13px] text-[#717970] mt-1">
            Garantissez une transparence totale aux acheteurs : semences, fertilisants biologiques, parcelle et dates de récolte certifiées.
          </p>
        </div>
      </div>

      {/* Grid of Traceability Lots */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(lots || []).length === 0 ? (
          <div className="col-span-full bg-white border border-[#c1c9be] rounded-2xl p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-[#FAF8F2] text-[#717970] rounded-full flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-[32px]">qr_code_scanner</span>
            </div>
            <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] mb-1">
              Aucun lot de traçabilité
            </h3>
            <p className="text-[13px] text-[#717970] max-w-sm">
              Lors de la déclaration de vos récoltes et productions, vos lots certifiés et leurs QR codes seront générés automatiquement.
            </p>
          </div>
        ) : (
          lots.map((lot) => (
          <div
            key={lot.id}
            className="bg-white border border-[#c1c9be] rounded-2xl p-5 shadow-sm hover:border-[#164525] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#717970]">
                    Lot #{lot.numeroLot}
                  </span>
                  <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700] mt-0.5">
                    {lot.produitNom}
                  </h3>
                </div>
                <div className="w-12 h-12 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl flex items-center justify-center p-1 cursor-pointer hover:bg-white transition-colors"
                  onClick={() => setSelectedLot(lot)}
                  title="Agrandir QR Code"
                >
                  <img
                    src={lot.qrCodeUrl}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#c1c9be]/50 mb-3 text-[12px] flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="text-[#717970]">Parcelle d'origine :</span>
                  <strong className="text-[#2b1700]">{lot.parcelleNom}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717970]">Semence certifiée :</span>
                  <span className="text-[#414941]">{lot.semence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717970]">Date de récolte :</span>
                  <span className="font-semibold text-[#164525]">{lot.dateRecolte}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#717970]">Quantité du lot :</span>
                  <span className="font-bold text-[#2b1700]">
                    {lot.quantiteLot} {lot.unite}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-[#717970] block mb-1">
                  Intrants & Soins apportés :
                </span>
                <div className="flex flex-wrap gap-1">
                  {lot.intrantsBio.map((intrant, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-medium bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded-md"
                    >
                      {intrant}
                    </span>
                  ))}
                </div>
              </div>

              {lot.certifications.length > 0 && (
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#164525] text-[16px]">
                    verified
                  </span>
                  <span className="text-[11px] font-bold text-[#164525]">
                    {lot.certifications.join(' • ')}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#c1c9be]/40 mt-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedLot(lot)}
                className="w-full py-2 rounded-xl bg-[#164525] text-white font-bold text-[12px] hover:bg-[#2f5d3a] transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">qr_code</span>
                Afficher le QR Code & Fiche
              </button>
            </div>
          </div>
        ))
        )}
      </div>

      {/* QR Code & Lot Detail Modal */}
      {selectedLot && (
        <div className="fixed inset-0 z-50 w-full h-full flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 border border-[#c1c9be] shadow-2xl text-center">
            <div className="flex justify-between items-start pb-2">
              <span className="text-[11px] font-bold text-[#164525] bg-[#164525]/10 px-2.5 py-0.5 rounded-full">
                Certificat de Traçabilité Agri-Link
              </span>
              <button
                onClick={() => setSelectedLot(null)}
                className="text-[#717970] hover:text-[#2b1700] p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="my-4 flex flex-col items-center">
              <div className="p-3 bg-[#FAF8F2] border-2 border-[#164525] rounded-2xl shadow-inner inline-block">
                <img
                  src={selectedLot.qrCodeUrl}
                  alt="QR Code"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] mt-3">
                Lot #{selectedLot.numeroLot}
              </h3>
              <p className="text-[13px] text-[#164525] font-semibold">
                {selectedLot.produitNom} ({selectedLot.quantiteLot} {selectedLot.unite})
              </p>
            </div>

            <div className="bg-[#FAF8F2] p-3 rounded-xl border border-[#c1c9be]/60 text-[12px] text-left flex flex-col gap-1 mb-4">
              <div>
                <strong>Exploitation :</strong> Ferme des Niayes (Sangalkam, Rufisque)
              </div>
              <div>
                <strong>Parcelle :</strong> {selectedLot.parcelleNom}
              </div>
              <div>
                <strong>Semence :</strong> {selectedLot.semence}
              </div>
              <div>
                <strong>Date de récolte :</strong> {selectedLot.dateRecolte}
              </div>
              <div>
                <strong>Transporteur certifié :</strong> Diallo Logistique Teranga
              </div>
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-full border border-[#c1c9be] text-[#2b1700] font-semibold text-[12px] hover:bg-[#FAF8F2] cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                Imprimer l'étiquette
              </button>
              <button
                onClick={() => setSelectedLot(null)}
                className="px-5 py-2 rounded-full bg-[#164525] text-white font-bold text-[12px] hover:bg-[#2f5d3a] cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
