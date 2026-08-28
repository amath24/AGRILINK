import React, { useState } from 'react';
import { FarmProfile } from '../../../types';

interface FarmProfileTabProps {
  farmProfile: FarmProfile;
  onUpdateFarmProfile: (profile: FarmProfile) => void;
}

export const FarmProfileTab: React.FC<FarmProfileTabProps> = ({
  farmProfile,
  onUpdateFarmProfile,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FarmProfile>(farmProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateFarmProfile(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleCertificationToggle = (cert: string) => {
    setFormData((prev) => {
      const exists = prev.certifications.includes(cert);
      return {
        ...prev,
        certifications: exists
          ? prev.certifications.filter((c) => c !== cert)
          : [...prev.certifications, cert],
      };
    });
  };

  const availableCerts = [
    'Bio Sénégal Teranga',
    'AgroÉcologie Niayes Label',
    'Traçabilité QR Agri-Link',
    'Commerce Équitable Local',
    'Global G.A.P Sénégal',
    'Zéro Résidu Chimique',
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              agriculture
            </span>
            <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Mon Exploitation Agricole
            </h1>
          </div>
          <p className="text-[13px] text-[#717970] mt-1">
            Gérez les informations d'identité, la localisation, les labels et les spécifications de votre domaine.
          </p>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#164525] text-white text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-[#2f5d3a] transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Modifier mon exploitation
          </button>
        ) : (
          <button
            onClick={() => {
              setFormData(farmProfile);
              setIsEditing(false);
            }}
            className="bg-[#FAF8F2] text-[#717970] border border-[#c1c9be] text-[13px] font-semibold px-4 py-2.5 rounded-full hover:bg-[#eee9df] transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
            Annuler
          </button>
        )}
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-[#e6f7ec] border border-[#164525]/30 text-[#164525] flex items-center gap-3">
          <span className="material-symbols-outlined text-[24px]">check_circle</span>
          <span className="text-[14px] font-semibold">
            Les informations de votre exploitation ont été mises à jour avec succès !
          </span>
        </div>
      )}

      {/* Main Form / Display Card */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 sm:p-8 shadow-sm">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Nom Exploitation */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
                  Nom de l'exploitation *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nomExploitation}
                  onChange={(e) =>
                    setFormData({ ...formData, nomExploitation: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
                />
              </div>

              {/* Gérant */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
                  Nom du responsable / gérant *
                </label>
                <input
                  type="text"
                  required
                  value={formData.gerant}
                  onChange={(e) =>
                    setFormData({ ...formData, gerant: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
                />
              </div>

              {/* Localisation */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
                  Localisation & Commune *
                </label>
                <input
                  type="text"
                  required
                  value={formData.localisation}
                  onChange={(e) =>
                    setFormData({ ...formData, localisation: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
                />
              </div>

              {/* Région */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
                  Région agricole *
                </label>
                <select
                  value={formData.region}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      region: e.target.value as FarmProfile['region'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
                >
                  <option value="Niayes">Niayes (Dakar / Rufisque)</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Dakar">Dakar Urbain</option>
                  <option value="Fatick">Fatick</option>
                  <option value="Saint-Louis">Saint-Louis / Vallée du Fleuve</option>
                </select>
              </div>

              {/* Superficie & Unité */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
                    Superficie *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formData.superficie}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        superficie: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
                    Unité
                  </label>
                  <select
                    value={formData.uniteSuperficie}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        uniteSuperficie: e.target.value as 'ha' | 'm²',
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
                  >
                    <option value="ha">Hectares (ha)</option>
                    <option value="m²">Mètres carrés (m²)</option>
                  </select>
                </div>
              </div>

              {/* Type de production */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
                  Type de production *
                </label>
                <select
                  value={formData.typeProduction}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      typeProduction: e.target.value as FarmProfile['typeProduction'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
                >
                  <option value="Biologique certifié">Biologique certifié</option>
                  <option value="Raisonné / Agroécologique">Raisonné / Agroécologique</option>
                  <option value="Conventionnel">Conventionnel</option>
                </select>
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
                  Téléphone direct *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
                  Email de contact
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
                Description de l'exploitation
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            {/* Certifications & Labels */}
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-2">
                Certifications & Labels reconnus
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableCerts.map((cert) => {
                  const isChecked = formData.certifications.includes(cert);
                  return (
                    <button
                      type="button"
                      key={cert}
                      onClick={() => handleCertificationToggle(cert)}
                      className={`p-2.5 rounded-xl border text-left text-[12px] font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isChecked
                          ? 'bg-[#164525]/10 border-[#164525] text-[#164525]'
                          : 'bg-[#FAF8F2] border-[#c1c9be] text-[#717970]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {isChecked ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                      {cert}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Informations complémentaires */}
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1.5">
                Informations complémentaires (irrigation, stockage, équipements)
              </label>
              <textarea
                rows={2}
                value={formData.informationsComplementaires}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    informationsComplementaires: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#c1c9be]/50">
              <button
                type="button"
                onClick={() => {
                  setFormData(farmProfile);
                  setIsEditing(false);
                }}
                className="px-5 py-2.5 rounded-full border border-[#c1c9be] text-[#717970] font-semibold text-[13px] hover:bg-[#FAF8F2] cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-[#164525] text-white font-bold text-[13px] hover:bg-[#2f5d3a] transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                Enregistrer les modifications
              </button>
            </div>
          </form>
        ) : (
          /* View Mode */
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-[#c1c9be]/50">
              <div className="bg-[#FAF8F2] p-4 rounded-xl border border-[#c1c9be]/50">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717970] block mb-1">
                  Superficie Totale
                </span>
                <span className="font-['Montserrat'] text-[22px] font-bold text-[#164525]">
                  {farmProfile.superficie} {farmProfile.uniteSuperficie}
                </span>
                <span className="text-[11px] text-[#717970] block mt-1">
                  Zone des Niayes (Rufisque)
                </span>
              </div>

              <div className="bg-[#FAF8F2] p-4 rounded-xl border border-[#c1c9be]/50">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717970] block mb-1">
                  Méthode Agricole
                </span>
                <span className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] block">
                  {farmProfile.typeProduction}
                </span>
                <span className="text-[11px] text-[#164525] font-medium block mt-1">
                  Engrais 100% organiques & zéro intrant chimique
                </span>
              </div>

              <div className="bg-[#FAF8F2] p-4 rounded-xl border border-[#c1c9be]/50">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#717970] block mb-1">
                  Responsable Exploitation
                </span>
                <span className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700] block">
                  {farmProfile.gerant}
                </span>
                <span className="text-[11px] text-[#717970] block mt-1">
                  Actif depuis {farmProfile.anneeCreation}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-['Montserrat'] text-[15px] font-bold text-[#2b1700] mb-2">
                  Description de l'activité
                </h3>
                <p className="text-[13px] text-[#414941] leading-relaxed bg-[#FAF8F2] p-4 rounded-xl border border-[#c1c9be]/40">
                  {farmProfile.description}
                </p>
              </div>

              <div>
                <h3 className="font-['Montserrat'] text-[15px] font-bold text-[#2b1700] mb-2">
                  Équipements & Infrastructure
                </h3>
                <p className="text-[13px] text-[#414941] leading-relaxed bg-[#FAF8F2] p-4 rounded-xl border border-[#c1c9be]/40">
                  {farmProfile.informationsComplementaires}
                </p>
              </div>
            </div>

            {/* Labels and Certifications */}
            <div>
              <h3 className="font-['Montserrat'] text-[15px] font-bold text-[#2b1700] mb-3">
                Labels et Certifications vérifiés
              </h3>
              <div className="flex flex-wrap gap-2.5">
                {farmProfile.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#164525]/10 text-[#164525] text-[12px] font-bold border border-[#164525]/30"
                  >
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Coordinates & Contact */}
            <div className="p-4 rounded-xl bg-[#FAF8F2] border border-[#c1c9be]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#164525] text-[24px]">
                  pin_drop
                </span>
                <div>
                  <span className="font-semibold text-[13px] text-[#2b1700] block">
                    {farmProfile.localisation}
                  </span>
                  <span className="text-[11px] font-mono text-[#717970]">
                    GPS : {farmProfile.coordonneesGPS}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[13px]">
                <div className="flex items-center gap-1.5 text-[#164525] font-semibold">
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  {farmProfile.telephone}
                </div>
                <div className="flex items-center gap-1.5 text-[#717970]">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  {farmProfile.email}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
