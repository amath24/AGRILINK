import React from 'react';
import { ProductCategory } from '../../types';

interface AboutViewProps {
  onNavigateToMarketplace: (category?: ProductCategory) => void;
  onNavigateToRegister: () => void;
  onNavigateToTracking?: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigateToMarketplace,
  onNavigateToRegister,
  onNavigateToTracking,
}) => {
  return (
    <div className="flex-grow flex flex-col bg-[#FAF8F2]">
      {/* ========================================================================= */}
      {/* 🌿 HERO SECTION À PROPOS                                                  */}
      {/* ========================================================================= */}
      <section className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 pt-8 sm:pt-14 pb-8 sm:pb-12 text-center">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-[#bdf1a4] text-[#164525] px-3.5 py-1 rounded-full text-[11px] sm:text-[12px] font-bold">
            <span className="material-symbols-outlined text-[15px]">eco</span>
            <span>Notre Mission &amp; Engagement Agricole</span>
          </div>

          <h1 className="font-['Montserrat'] text-[24px] sm:text-[38px] lg:text-[44px] font-extrabold text-[#2b1700] leading-tight">
            Connecter directement les fermes du Sénégal à votre table.
          </h1>

          <p className="font-['Inter'] text-[14px] sm:text-[16px] text-[#414941] leading-relaxed">
            <strong>Agri-Link</strong> est la première plateforme sénégalaise de vente directe et de précommandes agricoles sécurisées. Nous supprimons les intermédiaires spéculatifs pour garantir des prix justes aux producteurs et des récoltes ultra-fraîches aux acheteurs.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              id="about-explore-catalog-btn"
              onClick={() => onNavigateToMarketplace()}
              className="bg-[#164525] text-white px-6 py-3 rounded-xl text-[13px] sm:text-[14px] font-bold hover:bg-[#2f5d3a] transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>Découvrir les Offres &amp; Récoltes</span>
            </button>

            <button
              id="about-register-producer-btn"
              onClick={onNavigateToRegister}
              className="bg-white text-[#7d4600] border border-[#7d4600]/40 px-5 py-3 rounded-xl text-[13px] sm:text-[14px] font-bold hover:bg-[#7d4600]/10 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">agriculture</span>
              <span>Devenir Producteur Partenaire</span>
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 📊 CHIFFRES CLÉS & IMPACT                                                 */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-6 sm:py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white p-5 rounded-2xl border border-[#c1c9be]/60 text-center shadow-xs">
            <span className="font-['Montserrat'] text-[26px] sm:text-[34px] font-extrabold text-[#164525] block">
              100%
            </span>
            <span className="font-['Inter'] text-[12px] sm:text-[13px] text-[#555d50] font-medium mt-1 block">
              Direct Producteurs Locaux
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#c1c9be]/60 text-center shadow-xs">
            <span className="font-['Montserrat'] text-[26px] sm:text-[34px] font-extrabold text-[#7d4600] block">
              30%
            </span>
            <span className="font-['Inter'] text-[12px] sm:text-[13px] text-[#555d50] font-medium mt-1 block">
              Acompte Séquestre Garanti
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#c1c9be]/60 text-center shadow-xs">
            <span className="font-['Montserrat'] text-[26px] sm:text-[34px] font-extrabold text-[#164525] block">
              0 FCFA
            </span>
            <span className="font-['Inter'] text-[12px] sm:text-[13px] text-[#555d50] font-medium mt-1 block">
              Frais d'Accès pour Consulter
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#c1c9be]/60 text-center shadow-xs">
            <span className="font-['Montserrat'] text-[26px] sm:text-[34px] font-extrabold text-[#7d4600] block">
              QR Code
            </span>
            <span className="font-['Inter'] text-[12px] sm:text-[13px] text-[#555d50] font-medium mt-1 block">
              Traçabilité Numérique par Lot
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🛡️ LES 4 PILIERS DU MODÈLE AGRI-LINK                                      */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-12">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="text-[12px] font-bold uppercase tracking-wider text-[#164525] mb-1">
            Transparence &amp; Équité
          </div>
          <h2 className="font-['Montserrat'] text-[22px] sm:text-[30px] font-extrabold text-[#2b1700]">
            Comment Agri-Link révolutionne la filière agricole
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Pilier 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#c1c9be]/70 shadow-xs flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#e8f5e9] text-[#164525] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">trending_down</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-['Montserrat'] text-[16px] sm:text-[18px] font-bold text-[#2b1700]">
                Élimination des Intermédiaires Abusifs
              </h3>
              <p className="font-['Inter'] text-[13px] text-[#414941] leading-relaxed">
                Les marges excessives des revendeurs informels étouffent souvent le producteur tout en augmentant la facture de l'acheteur. Avec Agri-Link, le prix affiché rémunère dignement la ferme et reste très compétitif pour vous.
              </p>
            </div>
          </div>

          {/* Pilier 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#c1c9be]/70 shadow-xs flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#bdf1a4] text-[#164525] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">lock</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-['Montserrat'] text-[16px] sm:text-[18px] font-bold text-[#2b1700]">
                Système d'Acompte 30% sous Séquestre
              </h3>
              <p className="font-['Inter'] text-[13px] text-[#414941] leading-relaxed">
                Pour les récoltes à venir, vous ne réglez qu'un acompte de 30% qui reste sécurisé sur un compte tiers de confiance. Le solde de 70% n'est débloqué qu'au moment de la livraison et après vérification de la qualité.
              </p>
            </div>
          </div>

          {/* Pilier 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#c1c9be]/70 shadow-xs flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#ffeed9] text-[#7d4600] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">qr_code_2</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-['Montserrat'] text-[16px] sm:text-[18px] font-bold text-[#2b1700]">
                Traçabilité Complète par QR Code
              </h3>
              <p className="font-['Inter'] text-[13px] text-[#414941] leading-relaxed">
                Chaque lot est audité : localisation de la parcelle (Niayes, Thiès, Casamance...), nom de l'exploitant, date de semis et de récolte, respect des pratiques agroécologiques. Vous savez exactement d'où vient ce que vous consommez.
              </p>
            </div>
          </div>

          {/* Pilier 4 */}
          <div className="bg-white p-6 rounded-2xl border border-[#c1c9be]/70 shadow-xs flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#fae8ff] text-[#86198f] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[26px]">payments</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-['Montserrat'] text-[16px] sm:text-[18px] font-bold text-[#2b1700]">
                Paiements Mobiles Locaux (Wave &amp; OM)
              </h3>
              <p className="font-['Inter'] text-[13px] text-[#414941] leading-relaxed">
                Aucune carte bancaire requise. Les transactions s'effectuent simplement via votre numéro Wave ou Orange Money, avec génération immédiate d'un reçu numérique et d'un code de suivi sécurisé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🗺️ LES PRINCIPALES RÉGIONS AGRICOLES COUVERTES                            */}
      {/* ========================================================================= */}
      <section className="bg-[#fff1e6] py-10 sm:py-14 border-t border-[#c1c9be]/40">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="font-['Montserrat'] text-[22px] sm:text-[28px] font-extrabold text-[#2b1700]">
              Présents dans les grands bassins agricoles du Sénégal
            </h2>
            <p className="font-['Inter'] text-[13px] sm:text-[15px] text-[#414941] mt-1">
              Des circuits courts assurant la fraîcheur des produits vers Dakar et les centres urbains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-[#E5DCCB] shadow-2xs">
              <span className="text-[24px] mb-2 block">🌿</span>
              <h3 className="font-['Montserrat'] font-bold text-[15px] text-[#2b1700]">Zone des Niayes</h3>
              <p className="text-[12px] text-[#555d50] mt-1">
                Légumes maraîchers d'excellence : oignons, tomates cerises, carottes, choux et salades.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E5DCCB] shadow-2xs">
              <span className="text-[24px] mb-2 block">🥭</span>
              <h3 className="font-['Montserrat'] font-bold text-[15px] text-[#2b1700]">Région de Thiès &amp; Mbour</h3>
              <p className="text-[12px] text-[#555d50] mt-1">
                Vergers fruitiers réputés : mangues Kent, papayes solo, agrumes et manioc doux.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E5DCCB] shadow-2xs">
              <span className="text-[24px] mb-2 block">🌾</span>
              <h3 className="font-['Montserrat'] font-bold text-[15px] text-[#2b1700]">Vallée du Fleuve</h3>
              <p className="text-[12px] text-[#555d50] mt-1">
                Riz local parfumé de la vallée, maïs blanc, mil souna et sorgho de qualité supérieure.
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-[#E5DCCB] shadow-2xs">
              <span className="text-[24px] mb-2 block">🍯</span>
              <h3 className="font-['Montserrat'] font-bold text-[15px] text-[#2b1700]">Casamance &amp; Fatick</h3>
              <p className="text-[12px] text-[#555d50] mt-1">
                Huiles d'arachide artisanales, miel sauvage de mangrove, fonio et produits transformés.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🚀 BANNIÈRE D'APPEL À L'ACTION                                            */}
      {/* ========================================================================= */}
      <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-10 sm:py-16 text-center">
        <div className="bg-[#164525] text-white p-8 sm:p-12 rounded-3xl shadow-xl max-w-4xl mx-auto space-y-4">
          <h2 className="font-['Montserrat'] text-[22px] sm:text-[32px] font-extrabold">
            Consultez librement les offres dès aujourd'hui
          </h2>
          <p className="font-['Inter'] text-[13px] sm:text-[15px] text-[#bdf1a4] max-w-xl mx-auto">
            Aucune obligation d'inscription préalable. Parcourez l'ensemble du catalogue, filtrez par région et réservez en quelques clics.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigateToMarketplace()}
              className="bg-[#fde047] text-[#5c3200] px-7 py-3 rounded-xl font-['Montserrat'] font-bold text-[14px] hover:bg-[#facc15] transition-all shadow-md cursor-pointer active:scale-95"
            >
              Accéder à la Marketplace
            </button>
            {onNavigateToTracking && (
              <button
                onClick={onNavigateToTracking}
                className="bg-white/15 text-white border border-white/30 px-5 py-3 rounded-xl font-['Montserrat'] font-bold text-[14px] hover:bg-white/25 transition-all cursor-pointer"
              >
                Suivre une commande
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
