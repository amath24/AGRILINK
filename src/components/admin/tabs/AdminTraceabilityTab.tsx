import React, { useState } from 'react';
import { ProducerCrop } from '../../../types';

interface AdminTraceabilityTabProps {
  crops: ProducerCrop[];
}

export const AdminTraceabilityTab: React.FC<AdminTraceabilityTabProps> = ({
  crops = [],
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<ProducerCrop | null>(crops[0] || null);

  const safeCrops = crops || [];

  const filteredCrops = safeCrops.filter((c) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchLot = (c.lotId || '').toLowerCase().includes(q);
      const matchCulture = c.nomCulture.toLowerCase().includes(q);
      const matchParcelle = c.parcelle.toLowerCase().includes(q);
      return matchLot || matchCulture || matchParcelle;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Traçabilité des Récoltes & Suivi Parcellaire
          </h1>
          <p className="text-[14px] text-[#717970]">
            Garantie d'origine, respect des normes agroécologiques et certification des lots
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#164525]/10 text-[#164525] text-[12px] font-bold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Traçabilité Numérique Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste des Lots / Cultures */}
        <div className="lg:col-span-1 bg-white border border-[#c1c9be]/60 rounded-2xl p-4 flex flex-col gap-4 shadow-xs">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher lot, culture..."
              className="w-full pl-9 pr-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto max-h-[500px]">
            {filteredCrops.length === 0 ? (
              <div className="p-6 text-center text-[#717970] text-[13px]">
                Aucun lot trouvé.
              </div>
            ) : (
              filteredCrops.map((crop) => {
                const isSelected = selectedCrop?.id === crop.id;
                return (
                  <button
                    key={crop.id}
                    onClick={() => setSelectedCrop(crop)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#164525]/10 border-[#164525] text-[#164525]'
                        : 'bg-[#FAF8F2]/60 border-[#c1c9be]/40 hover:bg-[#FAF8F2]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[14px] text-[#2b1700]">{crop.nomCulture}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white border border-[#c1c9be]/60 text-[#717970]">
                        {crop.lotId || `LOT-${crop.id.slice(0, 4)}`}
                      </span>
                    </div>
                    <div className="text-[12px] text-[#717970] mt-1">
                      {crop.parcelle} • {crop.superficie} ha
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#c1c9be]/30 text-[11px]">
                      <span className="font-semibold text-[#164525]">{crop.rendementEstime} {crop.unite}</span>
                      <span className="text-[#717970]">Récolte : {crop.dateRecolteEstimee}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Fiche Détaillée du Lot Sélectionné */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {selectedCrop ? (
            <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#c1c9be]/40">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold bg-[#164525] text-white px-2.5 py-0.5 rounded-md">
                      LOT CERTIFIÉ AGRI-LINK
                    </span>
                    <span className="text-[12px] text-[#717970] font-mono">{selectedCrop.lotId || 'LOT-2026-001'}</span>
                  </div>
                  <h2 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700] mt-1">
                    {selectedCrop.nomCulture}
                  </h2>
                  <p className="text-[13px] text-[#717970]">{selectedCrop.parcelle} — Stade : <span className="font-bold text-[#164525]">{selectedCrop.stadeCroissance}</span></p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl flex items-center justify-center p-1">
                    <span className="material-symbols-outlined text-[40px] text-[#164525]">qr_code_2</span>
                  </div>
                </div>
              </div>

              {/* Étapes du cycle de culture */}
              <div>
                <h3 className="font-bold text-[14px] text-[#2b1700] mb-3">Cycle de Vie & Chronologie de Culture</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#c1c9be]/40">
                    <div className="text-[11px] text-[#717970]">1. Semis / Plantation</div>
                    <div className="font-bold text-[#2b1700] mt-0.5">{selectedCrop.dateSemis}</div>
                    <div className="text-[10px] text-[#164525] font-semibold mt-1">✓ Semences certifiées</div>
                  </div>
                  <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#c1c9be]/40">
                    <div className="text-[11px] text-[#717970]">2. Stade Actuel</div>
                    <div className="font-bold text-[#2b1700] mt-0.5">{selectedCrop.stadeCroissance}</div>
                    <div className="text-[10px] text-[#164525] font-semibold mt-1">✓ Contrôle effectué</div>
                  </div>
                  <div className="p-3 bg-[#FAF8F2] rounded-xl border border-[#c1c9be]/40">
                    <div className="text-[11px] text-[#717970]">3. Récolte Estimée</div>
                    <div className="font-bold text-[#2b1700] mt-0.5">{selectedCrop.dateRecolteEstimee}</div>
                    <div className="text-[10px] text-[#7d4600] font-semibold mt-1">Prêt pour livraison</div>
                  </div>
                  <div className="p-3 bg-[#164525]/10 rounded-xl border border-[#164525]/30">
                    <div className="text-[11px] text-[#164525] font-semibold">4. Rendement Attendu</div>
                    <div className="font-bold text-[#164525] text-[16px] mt-0.5">{selectedCrop.rendementEstime} {selectedCrop.unite}</div>
                    <div className="text-[10px] text-[#164525] font-medium mt-1">{selectedCrop.superficie} Hectares</div>
                  </div>
                </div>
              </div>

              {/* Journal des Intrants et Traitements */}
              <div>
                <h3 className="font-bold text-[14px] text-[#2b1700] mb-3">Traitements Phytosanitaires & Intrants Appliqués</h3>
                <div className="p-4 bg-[#FAF8F2] rounded-xl border border-[#c1c9be]/40 space-y-2">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-[#2b1700]">Fertilisation :</span>
                    <span className="text-[#414941]">Compost organique certifié bio (100% naturel)</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-[#2b1700]">Irrigation :</span>
                    <span className="text-[#414941]">Goutte-à-goutte économe en eau</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-[#2b1700]">Protection des cultures :</span>
                    <span className="text-[#164525] font-semibold">Biopesticides à base d'huile de Neem</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-12 text-center text-[#717970]">
              <span className="material-symbols-outlined text-[48px] text-[#717970]/50 mb-2">qr_code_scanner</span>
              <p>Sélectionnez un lot pour visualiser la chaîne de traçabilité.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
