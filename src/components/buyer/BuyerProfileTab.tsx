import React, { useState } from 'react';
import { BuyerProfile } from '../../types';

interface BuyerProfileTabProps {
  buyerProfile: BuyerProfile;
  onUpdateProfile: (updated: BuyerProfile) => void;
}

export const BuyerProfileTab: React.FC<BuyerProfileTabProps> = ({
  buyerProfile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<BuyerProfile>({ ...buyerProfile });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {savedSuccess && (
        <div className="bg-[#bbefc1] border border-[#164525] text-[#164525] p-4 rounded-xl flex items-center gap-3 shadow-md">
          <span className="material-symbols-outlined text-[24px]">check_circle</span>
          <span className="text-[14px] font-medium">
            Vos informations de profil et adresses de livraison ont été mises à jour avec succès !
          </span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-[#c1c9be] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#164525] text-white flex items-center justify-center text-[24px] font-bold shadow-sm">
            {formData.prenom.charAt(0)}{formData.nom.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
                {formData.prenom} {formData.nom}
              </h1>
              <span className="bg-[#bbefc1] text-[#164525] text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                {formData.typeAcheteur}
              </span>
            </div>
            <p className="text-[13px] text-[#717970] mt-0.5">
              Code client : <span className="font-mono font-bold text-[#164525]">{formData.codeClient}</span> • Membre depuis {formData.dateInscription}
            </p>
          </div>
        </div>

        <div className="text-[12px] bg-[#FAF8F2] p-3 rounded-xl border border-[#E5DCCB] text-[#414941]">
          <strong className="text-[#164525] block">Compte Acheteur Vérifié</strong>
          <span>Accès prioritaire aux réservations de récoltes</span>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-[#c1c9be] shadow-sm flex flex-col gap-6">
        <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] border-b border-[#c1c9be]/50 pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#164525]">badge</span>
          Informations Générales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Prénom */}
          <div>
            <label className="text-[13px] font-semibold text-[#414941] block mb-1.5">
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.prenom}
              onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] outline-none focus:border-[#164525]"
            />
          </div>

          {/* Nom */}
          <div>
            <label className="text-[13px] font-semibold text-[#414941] block mb-1.5">
              Nom de famille <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] outline-none focus:border-[#164525]"
            />
          </div>

          {/* Type d'acheteur */}
          <div>
            <label className="text-[13px] font-semibold text-[#414941] block mb-1.5">
              Type de profil / Activité <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.typeAcheteur}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  typeAcheteur: e.target.value as BuyerProfile['typeAcheteur'],
                })
              }
              className="w-full px-4 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] outline-none focus:border-[#164525]"
            >
              <option value="Particulier">Particulier / Ménage</option>
              <option value="Restaurant / Traiteur">Restaurant / Traiteur</option>
              <option value="Hôtel">Hôtel / Hébergement</option>
              <option value="Grossiste / Revendeur">Grossiste / Revendeur Marché</option>
              <option value="Supermarché">Supermarché / Supérette</option>
            </select>
          </div>

          {/* Nom Entreprise */}
          <div>
            <label className="text-[13px] font-semibold text-[#414941] block mb-1.5">
              Nom de l'établissement / Entreprise (Optionnel)
            </label>
            <input
              type="text"
              value={formData.nomEntreprise || ''}
              onChange={(e) => setFormData({ ...formData, nomEntreprise: e.target.value })}
              placeholder="Ex: Restaurant Le Teranga"
              className="w-full px-4 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] outline-none focus:border-[#164525]"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="text-[13px] font-semibold text-[#414941] block mb-1.5">
              Numéro de téléphone (Mobile Money) <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={formData.telephone}
              onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              required
              placeholder="+221 77 XXX XX XX"
              className="w-full px-4 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] outline-none focus:border-[#164525]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-[13px] font-semibold text-[#414941] block mb-1.5">
              Adresse Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full px-4 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] outline-none focus:border-[#164525]"
            />
          </div>
        </div>

        {/* Section Livraison */}
        <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] border-b border-[#c1c9be]/50 pb-3 pt-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#164525]">local_shipping</span>
          Adresse de Livraison par Défaut
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Région */}
          <div>
            <label className="text-[13px] font-semibold text-[#414941] block mb-1.5">
              Région <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] outline-none focus:border-[#164525]"
            >
              <option value="Dakar">Dakar</option>
              <option value="Thiès">Thiès</option>
              <option value="Fatick">Fatick</option>
              <option value="Saint-Louis">Saint-Louis</option>
              <option value="Ziguinchor">Ziguinchor</option>
            </select>
          </div>

          {/* Ville */}
          <div>
            <label className="text-[13px] font-semibold text-[#414941] block mb-1.5">
              Ville / Commune <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ville}
              onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
              required
              placeholder="Ex: Dakar"
              className="w-full px-4 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] outline-none focus:border-[#164525]"
            />
          </div>

          {/* Quartier */}
          <div>
            <label className="text-[13px] font-semibold text-[#414941] block mb-1.5">
              Quartier / Repère <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.quartier}
              onChange={(e) => setFormData({ ...formData, quartier: e.target.value })}
              required
              placeholder="Ex: Fann Résidence / Point E"
              className="w-full px-4 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] outline-none focus:border-[#164525]"
            />
          </div>

          {/* Adresse Complète */}
          <div className="md:col-span-3">
            <label className="text-[13px] font-semibold text-[#414941] block mb-1.5">
              Adresse exacte ou instructions de livraison
            </label>
            <input
              type="text"
              value={formData.adresseLivraison}
              onChange={(e) => setFormData({ ...formData, adresseLivraison: e.target.value })}
              required
              placeholder="Ex: Avenue Cheikh Anta Diop, Villa 14 face UCAD"
              className="w-full px-4 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] outline-none focus:border-[#164525]"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-[#c1c9be]/50">
          <button
            type="submit"
            className="bg-[#164525] text-white font-['Montserrat'] font-bold text-[14px] px-8 py-3 rounded-full hover:bg-[#2f5d3a] hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};
