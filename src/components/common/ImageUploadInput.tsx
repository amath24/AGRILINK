import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';

interface ImageUploadInputProps {
  value: string;
  onChange: (dataUrlOrUrl: string) => void;
  label?: string;
  required?: boolean;
}

const PRESET_IMAGES = [
  {
    name: 'Tomates fraîches',
    url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Oignons violets',
    url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Pommes de terre',
    url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Mangues Kent',
    url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Bissap rouge',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Piments frais',
    url: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Papayes solo',
    url: 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?auto=format&fit=crop&w=600&q=80',
  },
  {
    name: 'Maïs doux',
    url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
  },
];

export const ImageUploadInput: React.FC<ImageUploadInputProps> = ({
  value,
  onChange,
  label = 'Photo du produit',
  required = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Compress image file to optimized Base64 Data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Le fichier sélectionné doit être une image (JPG, PNG, WEBP, etc.).');
      return;
    }

    setErrorMessage(null);
    setIsCompressing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          onChange(compressedDataUrl);
        } else {
          onChange(e.target?.result as string);
        }
        setIsCompressing(false);
      };
      img.onerror = () => {
        setIsCompressing(false);
        setErrorMessage("Impossible de lire l'image sélectionnée.");
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setIsCompressing(false);
      setErrorMessage('Erreur lors de la lecture du fichier.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="block text-[13px] font-semibold text-[#2b1700]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {/* Source Mode Tabs */}
        <div className="flex items-center gap-1 bg-[#FAF8F2] p-1 rounded-lg border border-[#c1c9be]">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'upload'
                ? 'bg-[#164525] text-white shadow-xs'
                : 'text-[#414941] hover:text-[#164525]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">upload_file</span>
            Appareil
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preset')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'preset'
                ? 'bg-[#164525] text-white shadow-xs'
                : 'text-[#414941] hover:text-[#164525]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            Modèles
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === 'url'
                ? 'bg-[#164525] text-white shadow-xs'
                : 'text-[#414941] hover:text-[#164525]'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">link</span>
            Lien web
          </button>
        </div>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Preview Section */}
      {value ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-[#164525]/30 bg-[#FAF8F2] p-2 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-36 h-28 rounded-xl overflow-hidden bg-stone-200 shrink-0">
            <img
              src={value}
              alt="Aperçu du produit"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isCompressing && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-[11px]">
                <span className="material-symbols-outlined animate-spin text-[20px] mb-1">sync</span>
                Optimisation...
              </div>
            )}
          </div>
          <div className="flex-1 w-full flex flex-col justify-between py-1">
            <div>
              <div className="flex items-center gap-1 text-[12px] font-bold text-[#164525]">
                <span className="material-symbols-outlined text-[16px] text-emerald-600">check_circle</span>
                Image prête pour la publication
              </div>
              <p className="text-[11px] text-[#717970] mt-0.5 line-clamp-1">
                {value.startsWith('data:') ? 'Photo chargée depuis votre appareil (compressée)' : value}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-white border border-[#c1c9be] hover:border-[#164525] text-[#164525] rounded-xl text-[12px] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[15px]">photo_camera</span>
                Changer
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-[12px] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">delete</span>
                Retirer
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Tab: Device Upload */}
      {activeTab === 'upload' && !value && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
            isDragging
              ? 'border-[#164525] bg-[#164525]/10 scale-[1.01]'
              : 'border-[#c1c9be] hover:border-[#164525] bg-[#FAF8F2]'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 rounded-full bg-[#164525]/10 text-[#164525] flex items-center justify-center mb-2">
            <span className="material-symbols-outlined text-[26px]">add_a_photo</span>
          </div>
          <p className="text-[13px] font-bold text-[#2b1700]">
            Cliquez pour choisir une photo ou glissez-déposez
          </p>
          <p className="text-[11px] text-[#717970] mt-0.5">
            Formats acceptés : JPG, PNG, WEBP • Optimisation automatique
          </p>

          <div className="flex items-center gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-[#164525] text-white text-[12px] font-semibold px-3.5 py-1.5 rounded-xl hover:bg-[#2f5d3a] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">folder_open</span>
              Parcourir mes fichiers
            </button>
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="bg-white border border-[#c1c9be] text-[#2b1700] text-[12px] font-semibold px-3.5 py-1.5 rounded-xl hover:bg-[#eae4d5] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              Prendre une photo
            </button>
          </div>
        </div>
      )}

      {/* Tab: Presets */}
      {activeTab === 'preset' && (
        <div className="bg-[#FAF8F2] p-3 rounded-2xl border border-[#c1c9be]">
          <p className="text-[12px] font-semibold text-[#2b1700] mb-2">
            Sélectionnez une photo modèle de haute qualité :
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {PRESET_IMAGES.map((img, i) => (
              <button
                type="button"
                key={i}
                onClick={() => onChange(img.url)}
                className={`group relative rounded-xl overflow-hidden border transition-all text-left p-1 cursor-pointer ${
                  value === img.url
                    ? 'border-[#164525] ring-2 ring-[#164525]/30 bg-white'
                    : 'border-[#c1c9be] bg-white hover:border-[#164525]'
                }`}
              >
                <div className="w-full h-16 rounded-lg overflow-hidden bg-stone-100 mb-1">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="text-[11px] font-medium text-[#2b1700] block truncate px-1">
                  {img.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Web URL */}
      {activeTab === 'url' && (
        <div className="bg-[#FAF8F2] p-3 rounded-2xl border border-[#c1c9be] flex flex-col gap-2">
          <label className="text-[12px] font-semibold text-[#2b1700]">
            Entrez l'URL publique de votre image :
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="flex-1 px-3 py-2 bg-white border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-xl text-[12px] font-semibold transition-colors cursor-pointer"
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="text-[12px] text-red-600 flex items-center gap-1.5 mt-1 bg-red-50 p-2 rounded-lg border border-red-200">
          <span className="material-symbols-outlined text-[16px]">error</span>
          {errorMessage}
        </div>
      )}
    </div>
  );
};
