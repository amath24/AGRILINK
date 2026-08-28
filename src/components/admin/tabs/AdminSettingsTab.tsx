import React, { useState } from 'react';
import { PlatformSettings } from '../../../types';

interface AdminSettingsTabProps {
  settings: PlatformSettings;
  onSaveSettings: (settings: PlatformSettings) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<PlatformSettings>(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Paramètres Généraux de la Plateforme
          </h1>
          <p className="text-[14px] text-[#717970]">
            Configuration des taux de commission, règles du séquestre et passerelles de paiement
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#164525] text-white text-[13px] font-semibold animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            Paramètres enregistrés !
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Section 1: Règles Financières & Séquestre */}
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#c1c9be]/40">
            <span className="material-symbols-outlined text-[#164525] text-[22px]">payments</span>
            <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
              Règles Financières & Acomptes Séquestrés
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#2b1700] mb-1">
                Taux d'Acompte Obligatoire à la Précommande (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={formData.tauxAcomptePourcent}
                  onChange={(e) =>
                    setFormData({ ...formData, tauxAcomptePourcent: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] font-bold text-[#2b1700] focus:border-[#164525] focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-[#717970]">%</span>
              </div>
              <p className="text-[11px] text-[#717970] mt-1">
                Acompte gelé sous séquestre Agri-Link jusqu'à confirmation de récolte.
              </p>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#2b1700] mb-1">
                Commission Plateforme Agri-Link (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={20}
                  step={0.5}
                  value={formData.commissionPlateformePourcent}
                  onChange={(e) =>
                    setFormData({ ...formData, commissionPlateformePourcent: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] font-bold text-[#164525] focus:border-[#164525] focus:outline-none"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-bold text-[#717970]">%</span>
              </div>
              <p className="text-[11px] text-[#717970] mt-1">
                Frais de service prélevés automatiquement lors du versement du solde au producteur.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Passerelles Mobile Money */}
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#c1c9be]/40">
            <span className="material-symbols-outlined text-[#164525] text-[22px]">contactless</span>
            <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
              Passerelles de Paiement Sénégal
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 bg-[#FAF8F2] border border-[#c1c9be]/40 rounded-xl cursor-pointer hover:bg-[#FAF8F2]/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#1BA4E8]/15 text-[#1BA4E8] flex items-center justify-center font-bold text-[14px]">
                  W
                </div>
                <div>
                  <div className="font-bold text-[#2b1700] text-[13px]">Wave Sénégal</div>
                  <div className="text-[11px] text-[#717970]">Paiement instantané par QR Code et Deep Link mobile</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.paiementWaveActif}
                onChange={(e) => setFormData({ ...formData, paiementWaveActif: e.target.checked })}
                className="w-5 h-5 accent-[#164525] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-[#FAF8F2] border border-[#c1c9be]/40 rounded-xl cursor-pointer hover:bg-[#FAF8F2]/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FF6600]/15 text-[#FF6600] flex items-center justify-center font-bold text-[14px]">
                  OM
                </div>
                <div>
                  <div className="font-bold text-[#2b1700] text-[13px]">Orange Money Sénégal</div>
                  <div className="text-[11px] text-[#717970]">Validation via code secret OTP #144#</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.paiementOrangeMoneyActif}
                onChange={(e) =>
                  setFormData({ ...formData, paiementOrangeMoneyActif: e.target.checked })
                }
                className="w-5 h-5 accent-[#164525] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Section 3: Règles Opérationnelles */}
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-3 pb-3 border-b border-[#c1c9be]/40">
            <span className="material-symbols-outlined text-[#164525] text-[22px]">verified_user</span>
            <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
              Validation & Politiques Qualité
            </h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3.5 bg-[#FAF8F2] border border-[#c1c9be]/40 rounded-xl cursor-pointer">
              <div>
                <div className="font-bold text-[#2b1700] text-[13px]">Validation Manuelle des Producteurs</div>
                <div className="text-[11px] text-[#717970]">
                  Exiger la vérification des pièces d'exploitation par un admin avant publication
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.validationProducteurRequise}
                onChange={(e) =>
                  setFormData({ ...formData, validationProducteurRequise: e.target.checked })
                }
                className="w-5 h-5 accent-[#164525] rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 bg-[#FAF8F2] border border-[#c1c9be]/40 rounded-xl cursor-pointer">
              <div>
                <div className="font-bold text-[#2b1700] text-[13px]">Alertes et Notifications SMS</div>
                <div className="text-[11px] text-[#717970]">
                  Envoi d'un SMS au producteur et acheteur à chaque changement de statut
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.notificationsSmsActives}
                onChange={(e) =>
                  setFormData({ ...formData, notificationsSmsActives: e.target.checked })
                }
                className="w-5 h-5 accent-[#164525] rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Bouton de Sauvegarde */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            className="px-6 py-3 bg-[#164525] text-white font-bold rounded-xl text-[14px] hover:bg-[#2f5d3a] shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};
