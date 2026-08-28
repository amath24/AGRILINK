import React, { useState, useEffect } from 'react';
import { FilterState, ProductCategory, AvailabilityType } from '../../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  totalResults: number;
}

const CATEGORIES: ProductCategory[] = ['Fruits', 'Légumes', 'Céréales', 'Transformés'];
const LOCATIONS = [
  { label: 'Toutes les régions', value: '' },
  { label: 'Dakar', value: 'Dakar' },
  { label: 'Thiès', value: 'Thiès' },
  { label: 'Niayes', value: 'Niayes' },
  { label: 'Fatick', value: 'Fatick' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  totalResults,
}) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Prevent background scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileDrawerOpen]);

  const toggleCategory = (cat: ProductCategory) => {
    const nextCategories = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFilterChange({ ...filters, categories: nextCategories });
  };

  const setSingleCategory = (cat: ProductCategory | 'ALL') => {
    if (cat === 'ALL') {
      onFilterChange({ ...filters, categories: [] });
    } else {
      onFilterChange({ ...filters, categories: [cat] });
    }
  };

  const setLocation = (loc: string) => {
    onFilterChange({ ...filters, location: loc });
  };

  const toggleAvailability = (avail: AvailabilityType) => {
    const nextAvailability = filters.availability.includes(avail)
      ? filters.availability.filter((a) => a !== avail)
      : [...filters.availability, avail];
    onFilterChange({ ...filters, availability: nextAvailability });
  };

  const resetFilters = () => {
    onFilterChange({
      categories: [],
      location: '',
      availability: [],
      search: '',
    });
  };

  const activeFilterCount =
    filters.categories.length +
    (filters.location ? 1 : 0) +
    filters.availability.length +
    (filters.search ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <>
      {/* ========================================================================= */}
      {/* 📱 MOBILE COMPACT FILTER TOOLBAR (Products appear immediately below this) */}
      {/* ========================================================================= */}
      <div className="w-full md:hidden flex flex-col gap-2.5 mb-2">
        {/* Search & Filter Trigger Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-grow">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[18px]">
              search
            </span>
            <input
              id="mobile-search-input"
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Rechercher (ex: mangues, oignons...)"
              className="w-full pl-9 pr-8 py-2 bg-white border border-[#c1c9be]/80 focus:border-[#164525] outline-none rounded-xl font-['Inter'] text-[13px] text-[#2b1700] shadow-2xs min-h-[40px]"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, search: '' })}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#717970] hover:text-[#2b1700] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          <button
            type="button"
            id="mobile-open-filters-btn"
            onClick={() => setIsMobileDrawerOpen(true)}
            className={`min-h-[40px] px-3.5 rounded-xl border font-semibold text-[13px] flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
              hasActiveFilters
                ? 'bg-[#164525] text-white border-[#164525] shadow-xs'
                : 'bg-white text-[#2b1700] border-[#c1c9be]/80 hover:bg-[#F3EBDD]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">tune</span>
            <span>Filtres</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#fde047] text-[#5c3200] font-bold text-[11px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Quick Horizontal Category Scrollable Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          <button
            type="button"
            id="mobile-quick-cat-all"
            onClick={() => setSingleCategory('ALL')}
            className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              filters.categories.length === 0
                ? 'bg-[#164525] text-white shadow-2xs'
                : 'bg-white text-[#414941] border border-[#c1c9be]/60 hover:bg-[#F3EBDD]'
            }`}
          >
            🌱 Tous
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = filters.categories.length === 1 && filters.categories.includes(cat);
            const icon =
              cat === 'Fruits' ? '🥭' : cat === 'Légumes' ? '🥬' : cat === 'Céréales' ? '🌾' : '🍯';
            return (
              <button
                key={cat}
                type="button"
                id={`mobile-quick-cat-${cat}`}
                onClick={() => setSingleCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#164525] text-white shadow-2xs'
                    : 'bg-white text-[#414941] border border-[#c1c9be]/60 hover:bg-[#F3EBDD]'
                }`}
              >
                {icon} {cat}
              </button>
            );
          })}
        </div>

        {/* Summary header with direct product count and quick clear */}
        <div className="flex items-center justify-between text-[12px] text-[#555d50] pt-0.5 px-0.5">
          <span className="font-semibold text-[#164525]">
            {totalResults} {totalResults > 1 ? 'produits disponibles' : 'produit disponible'}
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              id="mobile-quick-reset-btn"
              onClick={resetFilters}
              className="text-[#991b1b] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Effacer filtres
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📱 MOBILE MODAL DRAWER (Opened when user taps "Filtres")                   */}
      {/* ========================================================================= */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div
            className="w-full bg-[#FAF8F2] rounded-t-3xl max-h-[85vh] flex flex-col shadow-2xl border-t border-[#c1c9be] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 bg-white border-b border-[#c1c9be]/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[22px] text-[#164525]">tune</span>
                <h3 className="font-['Montserrat'] font-bold text-[16px] text-[#2b1700]">
                  Filtres du catalogue
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[12px] text-[#991b1b] font-semibold hover:underline px-2 py-1"
                  >
                    Réinitialiser
                  </button>
                )}
                <button
                  type="button"
                  id="close-mobile-filter-drawer"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-[#F3EBDD] flex items-center justify-center text-[#2b1700] hover:bg-[#c1c9be]/50 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-5">
              {/* Catégories */}
              <div>
                <h4 className="font-['Inter'] text-[13px] font-bold text-[#414941] uppercase tracking-wider mb-2.5">
                  Catégories
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const isChecked = filters.categories.includes(cat);
                    return (
                      <label
                        key={cat}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-[#164525]/10 border-[#164525] text-[#164525] font-semibold'
                            : 'bg-white border-[#c1c9be]/60 text-[#2b1700]'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCategory(cat)}
                          className="rounded text-[#164525] focus:ring-[#164525] w-4 h-4 accent-[#164525]"
                        />
                        <span className="text-[13px]">{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Localisation */}
              <div className="border-t border-[#c1c9be]/40 pt-4">
                <h4 className="font-['Inter'] text-[13px] font-bold text-[#414941] uppercase tracking-wider mb-2.5">
                  Région / Zone
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LOCATIONS.map((loc) => {
                    const isSelected = filters.location === loc.value;
                    return (
                      <label
                        key={loc.value || 'all'}
                        className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#164525]/10 border-[#164525] text-[#164525] font-semibold'
                            : 'bg-white border-[#c1c9be]/60 text-[#2b1700]'
                        }`}
                      >
                        <input
                          type="radio"
                          name="mobile_location_filter"
                          checked={isSelected}
                          onChange={() => setLocation(loc.value)}
                          className="text-[#164525] focus:ring-[#164525] w-4 h-4 accent-[#164525]"
                        />
                        <span className="text-[13px]">{loc.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Disponibilité */}
              <div className="border-t border-[#c1c9be]/40 pt-4">
                <h4 className="font-['Inter'] text-[13px] font-bold text-[#414941] uppercase tracking-wider mb-2.5">
                  Disponibilité
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      filters.availability.includes('immediate')
                        ? 'bg-[#164525]/10 border-[#164525] text-[#164525] font-semibold'
                        : 'bg-white border-[#c1c9be]/60 text-[#2b1700]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.availability.includes('immediate')}
                      onChange={() => toggleAvailability('immediate')}
                      className="rounded text-[#164525] focus:ring-[#164525] w-4 h-4 accent-[#164525]"
                    />
                    <span className="text-[13px]">⚡ Immédiate</span>
                  </label>

                  <label
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      filters.availability.includes('preorder')
                        ? 'bg-[#7d4600]/10 border-[#7d4600] text-[#7d4600] font-semibold'
                        : 'bg-white border-[#c1c9be]/60 text-[#2b1700]'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.availability.includes('preorder')}
                      onChange={() => toggleAvailability('preorder')}
                      className="rounded text-[#7d4600] focus:ring-[#7d4600] w-4 h-4 accent-[#7d4600]"
                    />
                    <span className="text-[13px]">🌱 Précommande</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Apply Action */}
            <div className="p-4 bg-white border-t border-[#c1c9be]/50 shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full py-3 bg-[#164525] text-white font-['Montserrat'] font-bold text-[14px] rounded-xl hover:bg-[#2f5d3a] shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Afficher les résultats</span>
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[12px]">
                  {totalResults}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🖥️ DESKTOP SIDEBAR (Visible only on md: and above)                        */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col gap-6 sticky top-24 self-start">
        {/* Title & Stats */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Marketplace
            </h2>
            {hasActiveFilters && (
              <button
                id="reset-filters-btn"
                onClick={resetFilters}
                className="text-[12px] font-semibold text-[#164525] hover:underline cursor-pointer"
              >
                Réinitialiser
              </button>
            )}
          </div>

          {/* Desktop Search input */}
          <div className="relative w-full mb-3">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[18px]">
              search
            </span>
            <input
              id="desktop-search-input"
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#c1c9be]/80 focus:border-[#164525] outline-none rounded-xl font-['Inter'] text-[13px] text-[#2b1700] transition-colors"
            />
          </div>

          <p className="text-[13px] text-[#555d50] font-['Inter'] font-medium">
            {totalResults} {totalResults > 1 ? 'produits répertoriés' : 'produit répertorié'}
          </p>
        </div>

        {/* CATEGORIES */}
        <div className="flex flex-col gap-2">
          <h3 className="font-['Inter'] text-[13px] font-bold text-[#414941] uppercase tracking-wider">
            Catégories
          </h3>
          {CATEGORIES.map((cat) => {
            const isChecked = filters.categories.includes(cat);
            return (
              <label
                key={cat}
                className="flex items-center gap-2 cursor-pointer group py-0.5"
              >
                <input
                  id={`filter-cat-${cat}`}
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleCategory(cat)}
                  className="rounded text-[#164525] focus:ring-[#164525] border-[#c1c9be] bg-white w-4 h-4 transition-colors cursor-pointer accent-[#164525]"
                />
                <span
                  className={`font-['Inter'] text-[14px] transition-colors ${
                    isChecked
                      ? 'text-[#164525] font-bold'
                      : 'text-[#2b1700] group-hover:text-[#164525]'
                  }`}
                >
                  {cat}
                </span>
              </label>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#c1c9be]/50"></div>

        {/* LOCATION */}
        <div className="flex flex-col gap-2">
          <h3 className="font-['Inter'] text-[13px] font-bold text-[#414941] uppercase tracking-wider">
            Localisation
          </h3>
          {LOCATIONS.map((loc) => {
            const isSelected = filters.location === loc.value;
            return (
              <label
                key={loc.value || 'all'}
                className="flex items-center gap-2 cursor-pointer group py-0.5"
              >
                <input
                  id={`filter-loc-${loc.value || 'all'}`}
                  type="radio"
                  name="location_filter"
                  checked={isSelected}
                  onChange={() => setLocation(loc.value)}
                  className="text-[#164525] focus:ring-[#164525] border-[#c1c9be] bg-white w-4 h-4 transition-colors cursor-pointer accent-[#164525]"
                />
                <span
                  className={`font-['Inter'] text-[14px] transition-colors ${
                    isSelected
                      ? 'text-[#164525] font-bold'
                      : 'text-[#2b1700] group-hover:text-[#164525]'
                  }`}
                >
                  {loc.label}
                </span>
              </label>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#c1c9be]/50"></div>

        {/* AVAILABILITY */}
        <div className="flex flex-col gap-2">
          <h3 className="font-['Inter'] text-[13px] font-bold text-[#414941] uppercase tracking-wider">
            Disponibilité
          </h3>
          <label className="flex items-center gap-2 cursor-pointer group py-0.5">
            <input
              id="filter-avail-immediate"
              type="checkbox"
              checked={filters.availability.includes('immediate')}
              onChange={() => toggleAvailability('immediate')}
              className="rounded text-[#164525] focus:ring-[#164525] border-[#c1c9be] bg-white w-4 h-4 transition-colors cursor-pointer accent-[#164525]"
            />
            <span
              className={`font-['Inter'] text-[14px] transition-colors ${
                filters.availability.includes('immediate')
                  ? 'text-[#164525] font-bold'
                  : 'text-[#2b1700] group-hover:text-[#164525]'
              }`}
            >
              ⚡ Immédiate
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group py-0.5">
            <input
              id="filter-avail-preorder"
              type="checkbox"
              checked={filters.availability.includes('preorder')}
              onChange={() => toggleAvailability('preorder')}
              className="rounded text-[#7d4600] focus:ring-[#7d4600] border-[#c1c9be] bg-white w-4 h-4 transition-colors cursor-pointer accent-[#7d4600]"
            />
            <span
              className={`font-['Inter'] text-[14px] transition-colors ${
                filters.availability.includes('preorder')
                  ? 'text-[#7d4600] font-bold'
                  : 'text-[#2b1700] group-hover:text-[#7d4600]'
              }`}
            >
              🌱 Précommande
            </span>
          </label>
        </div>
      </aside>
    </>
  );
};
