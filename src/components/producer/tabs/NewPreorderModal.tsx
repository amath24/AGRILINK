import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CropProduction, ProductCategory, Product } from '../../../types';

interface NewPreorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productions: CropProduction[];
  preselectedProduction?: CropProduction | null;
  onPublishPreorder: (product: Product, productionId?: string) => void;
}

export const NewPreorderModal: React.FC<NewPreorderModalProps> = ({
  isOpen,
  onClose,
  productions,
  preselectedProduction,
  onPublishPreorder,
}) => {
  const [selectedProdId, setSelectedProdId] = useState<string>('');
  const [produitNom, setProduitNom] = useState('');
  const [categorie, setCategorie] = useState<ProductCategory>('Légumes');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
  );
  const [description, setDescription] = useState(
    'Culture maraîchère biologique en zone des Niayes. Récolte garantie ultra-fraîche, cueillie à maturité optimale.'
  );
  const [quantitePrevue, setQuantitePrevue] = useState<number>(500);
  const [quantiteDisponible, setQuantiteDisponible] = useState<number>(350);
  const [prix, setPrix] = useState<number>(500);
  const [unite, setUnite] = useState('kg');
  const [dateDisponibilite, setDateDisponibilite] = useState('15 Septembre 2026');
  const [quantiteMinimale, setQuantiteMinimale] = useState<number>(5);
  const [acomptePct, setAcomptePct] = useState<number>(30);
  const [lieuLivraison, setLieuLivraison] = useState('Point Relais Dakar & Livraison Directe');
  const [conditionsVente, setConditionsVente] = useState(
    'Acompte sécurisé sous séquestre Agri-Link (30%). Solde versé à la livraison après contrôle qualité.'
  );
  const [isBio, setIsBio] = useState(true);
  const [isTracable, setIsTracable] = useState(true);
  const [error, setError] = useState('');

  // Sample quick images
  const sampleImages = [
    {
      name: 'Tomates',
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Oignons',
      url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Pommes de terre',
      url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Mangues',
      url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    },
    {
      name: 'Bissap',
      url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    },
  ];

  useEffect(() => {
    if (preselectedProduction) {
      setSelectedProdId(preselectedProduction.id);
      setProduitNom(preselectedProduction.produitNom);
      setCategorie(preselectedProduction.produitCategorie);
      setQuantitePrevue(preselectedProduction.quantitePrevue);
      const remaining =
        preselectedProduction.quantitePrevue -
        preselectedProduction.quantiteReservee;
      setQuantiteDisponible(remaining > 0 ? remaining : preselectedProduction.quantitePrevue);
      setUnite(preselectedProduction.unite);
      setDateDisponibilite(preselectedProduction.dateEstimeeRecolte);
    } else if (productions.length > 0) {
      const first = productions[0];
      setSelectedProdId(first.id);
      setProduitNom(first.produitNom);
      setCategorie(first.produitCategorie);
      setQuantitePrevue(first.quantitePrevue);
      setQuantiteDisponible(first.quantitePrevue - first.quantiteReservee);
      setUnite(first.unite);
      setDateDisponibilite(first.dateEstimeeRecolte);
    }
  }, [preselectedProduction, productions, isOpen]);

  const handleSelectProduction = (prodId: string) => {
    setSelectedProdId(prodId);
    const prod = productions.find((p) => p.id === prodId);
    if (prod) {
      setProduitNom(prod.produitNom);
      setCategorie(prod.produitCategorie);
      setQuantitePrevue(prod.quantitePrevue);
      setQuantiteDisponible(prod.quantitePrevue - prod.quantiteReservee);
      setUnite(prod.unite);
      setDateDisponibilite(prod.dateEstimeeRecolte);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!produitNom.trim()) {
      setError('Veuillez spécifier le nom du produit.');
      return;
    }
    if (prix <= 0) {
      setError('Le prix unitaire doit être positif.');
      return;
    }
    if (quantiteDisponible <= 0) {
      setError('La quantité disponible pour précommande doit être supérieure à 0.');
      return;
    }

    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      nom: produitNom.trim(),
      image: photoUrl,
      categorie,
      description: description.trim(),
      prix,
      unite,
      quantiteDisponible,
      quantitePrevue,
      quantiteMinimale,
      dateDisponibilite,
      producteur: 'Ferme des Niayes',
      localisation: 'Rufisque - Sangalkam, Zone des Niayes',
      region: 'Niayes',
      statutPrecommande: 'ouverte',
      typeDisponibilite: 'preorder',
      acomptePourcentage: acomptePct,
      isBio,
      isTracable,
      rating: 5.0,
      avisCount: 1,
      producteurDescription: 'Exploitation agro-écologique de référence dans les Niayes.',
    };

    onPublishPreorder(newProduct, selectedProdId || undefined);
    onClose();
  };

  return ReactDOM.createPortal(
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div style={{ display: 'flex', width: '100%', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
        <div
          className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 sm:p-8 text-left shadow-2xl border border-[#c1c9be]"
          onClick={(e) => e.stopPropagation()}
        >
        <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#164525] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">publish</span>
            </div>
            <div>
              <h2 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                Publier une Offre de Précommande
              </h2>
              <p className="text-[12px] text-[#164525] font-semibold">
                « Vendre avant de produire » • Sécurisez vos récoltes avec acompte de 30%
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#717970] hover:text-[#2b1700] p-1.5 rounded-full hover:bg-[#FAF8F2] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          {/* Link to existing crop cycle */}
          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
              Lier à un cycle de culture en cours (optionnel)
            </label>
            <select
              value={selectedProdId}
              onChange={(e) => handleSelectProduction(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
            >
              <option value="">-- Nouvelle production indépendante --</option>
              {productions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.produitNom} ({p.parcelleNom} - {p.quantitePrevue} {p.unite} prévus pour {p.dateEstimeeRecolte})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Nom commercial du produit *
              </label>
              <input
                type="text"
                required
                value={produitNom}
                onChange={(e) => setProduitNom(e.target.value)}
                placeholder="Ex: Tomates fraîches des Niayes"
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
                Catégorie *
              </label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value as ProductCategory)}
                className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
              >
                <option value="Légumes">Légumes</option>
                <option value="Fruits">Fruits</option>
                <option value="Céréales">Céréales</option>
                <option value="Transformés">Transformés</option>
              </select>
            </div>
          </div>

          {/* Photo Selector */}
          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
              Photo du produit (URL ou sélection rapide)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-[11px] text-[#717970] whitespace-nowrap">Suggestions :</span>
              {sampleImages.map((img, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setPhotoUrl(img.url)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                    photoUrl === img.url
                      ? 'bg-[#164525] text-white border-[#164525]'
                      : 'bg-[#FAF8F2] text-[#414941] border-[#c1c9be]'
                  }`}
                >
                  {img.name}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[13px] font-semibold text-[#2b1700] mb-1">
              Description de la récolte
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[14px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
            />
          </div>

          {/* Quantities & Price */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                Qté totale prévue *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantitePrevue}
                onChange={(e) =>
                  setQuantitePrevue(parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                Qté en précommande *
              </label>
              <input
                type="number"
                min="1"
                required
                value={quantiteDisponible}
                onChange={(e) =>
                  setQuantiteDisponible(parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                Prix unitaire (FCFA) *
              </label>
              <input
                type="number"
                min="10"
                required
                value={prix}
                onChange={(e) => setPrix(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none font-semibold text-[#164525]"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                Unité
              </label>
              <select
                value={unite}
                onChange={(e) => setUnite(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              >
                <option value="kg">kg</option>
                <option value="Sac (50kg)">Sac (50kg)</option>
                <option value="Carton (5kg)">Carton (5kg)</option>
                <option value="Bouteille (1L)">Bouteille (1L)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                Date prévue disponibilité *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: 15 Septembre 2026"
                value={dateDisponibilite}
                onChange={(e) => setDateDisponibilite(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                Quantité minimale d'achat
              </label>
              <input
                type="number"
                min="1"
                value={quantiteMinimale}
                onChange={(e) =>
                  setQuantiteMinimale(parseInt(e.target.value) || 1)
                }
                className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                Taux de l'acompte (%)
              </label>
              <select
                value={acomptePct}
                onChange={(e) => setAcomptePct(parseInt(e.target.value) || 30)}
                className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              >
                <option value={30}>30% (Standard Agri-Link)</option>
                <option value={40}>40%</option>
                <option value={50}>50%</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                Lieu de livraison / retrait
              </label>
              <input
                type="text"
                value={lieuLivraison}
                onChange={(e) => setLieuLivraison(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                Conditions de vente
              </label>
              <input
                type="text"
                value={conditionsVente}
                onChange={(e) => setConditionsVente(e.target.value)}
                className="w-full px-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
              />
            </div>
          </div>

          {/* Badges & Trust */}
          <div className="flex items-center gap-4 pt-2">
            <label className="flex items-center gap-2 text-[13px] text-[#2b1700] cursor-pointer">
              <input
                type="checkbox"
                checked={isBio}
                onChange={(e) => setIsBio(e.target.checked)}
                className="accent-[#164525] w-4 h-4 rounded"
              />
              <span className="font-medium">Certifié Bio / Agroécologique</span>
            </label>
            <label className="flex items-center gap-2 text-[13px] text-[#2b1700] cursor-pointer">
              <input
                type="checkbox"
                checked={isTracable}
                onChange={(e) => setIsTracable(e.target.checked)}
                className="accent-[#164525] w-4 h-4 rounded"
              />
              <span className="font-medium">Traçabilité QR Code active</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#c1c9be]/50 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-[#c1c9be] text-[#717970] font-semibold text-[13px] hover:bg-[#FAF8F2] cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#164525] text-white font-bold text-[13px] hover:bg-[#2f5d3a] transition-all cursor-pointer shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              Publier la précommande
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>,
    document.body
  );
};
