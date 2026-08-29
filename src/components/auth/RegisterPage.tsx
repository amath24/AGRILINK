import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRoleType, BuyerCategoryCode } from '../../types';

interface RegisterPageProps {
  onNavigate?: (view: 'home' | 'marketplace' | 'detail' | 'tracking' | 'buyer' | 'producer' | 'admin' | 'login' | 'register') => void;
  onNavigateToLogin?: () => void;
  onNavigateToMarketplace?: () => void;
  onRegisterSuccess?: (role: UserRoleType) => void;
  onSuccessRedirect?: (role: UserRoleType) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  onNavigate,
  onNavigateToLogin,
  onNavigateToMarketplace,
  onRegisterSuccess,
  onSuccessRedirect,
}) => {
  const { register, authError } = useAuth();

  // Form State
  const [role, setRole] = useState<UserRoleType>('BUYER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+221 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Producer-specific fields
  const [farmName, setFarmName] = useState('');
  const [producerDescription, setProducerDescription] = useState('');
  const [producerLocation, setProducerLocation] = useState('Sangalkam, Rufisque');

  // Buyer-specific fields
  const [buyerType, setBuyerType] = useState<BuyerCategoryCode>('RESTAURANT');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Dakar');

  // Admin-specific fields
  const [adminDepartment, setAdminDepartment] = useState('Supervision Générale');
  const [adminAccessCode, setAdminAccessCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const navigateTo = (view: 'home' | 'marketplace' | 'detail' | 'tracking' | 'buyer' | 'producer' | 'admin' | 'login' | 'register') => {
    if (view === 'login' && onNavigateToLogin) {
      onNavigateToLogin();
    } else if (view === 'marketplace' && onNavigateToMarketplace) {
      onNavigateToMarketplace();
    } else if (onNavigate) {
      onNavigate(view);
    }
  };

  const handleSuccess = (userRole: UserRoleType) => {
    if (onRegisterSuccess) {
      onRegisterSuccess(userRole);
    } else if (onSuccessRedirect) {
      onSuccessRedirect(userRole);
    } else if (onNavigate) {
      onNavigate(userRole === 'ADMIN' ? 'admin' : userRole === 'PRODUCER' ? 'producer' : 'buyer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    // Form Validations
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !phone.trim()) {
      setLocalError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Le mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Les mots de passe ne correspondent pas.');
      return;
    }

    if (role === 'PRODUCER' && !farmName.trim()) {
      setLocalError('Veuillez préciser le nom de votre exploitation agricole.');
      return;
    }

    setIsLoading(true);

    const success = await register({
      email: email.trim(),
      password,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim(),
      role,
      // Producer data
      farmName: role === 'PRODUCER' ? farmName.trim() : undefined,
      description: role === 'PRODUCER' ? producerDescription.trim() : undefined,
      location: role === 'PRODUCER' ? producerLocation.trim() : undefined,
      // Buyer data
      buyerType: role === 'BUYER' ? buyerType : undefined,
      address: role === 'BUYER' ? address.trim() : undefined,
      city: role === 'BUYER' ? city.trim() : undefined,
      companyName: role === 'BUYER' && companyName.trim() ? companyName.trim() : undefined,
    });

    setIsLoading(false);

    if (success) {
      setRegistrationSuccess(true);
      setTimeout(() => {
        handleSuccess(role);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-16 px-3.5 sm:px-6 lg:px-8 flex items-center justify-center bg-[#FAF8F2]">
      <div className="w-full max-w-5xl bg-white/95 rounded-2xl sm:rounded-3xl border border-[#c1c9be]/60 shadow-[0_16px_50px_rgba(22,69,37,0.08)] overflow-hidden transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">

          {/* LEFT COLUMN: Dynamic Value Proposition (Adapts to Acheteur / Producteur / Admin) */}
          <div className={`lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-white relative overflow-hidden transition-colors duration-300 ${
            role === 'PRODUCER'
              ? 'bg-gradient-to-br from-[#7d4600] via-[#8c4f02] to-[#542d00]'
              : role === 'ADMIN'
              ? 'bg-gradient-to-br from-[#2b1700] via-[#3a2000] to-[#1c0f00]'
              : 'bg-gradient-to-br from-[#164525] via-[#1c552f] to-[#0e311a]'
          }`}>
            {/* Background elements */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
            <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-black/10 pointer-events-none blur-xl" />

            {/* Brand top */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-white border border-white/15 shadow-inner">
                  <span className="material-symbols-outlined text-[26px]">
                    {role === 'PRODUCER' ? 'agriculture' : role === 'ADMIN' ? 'admin_panel_settings' : 'shopping_basket'}
                  </span>
                </div>
                <div>
                  <span className="font-['Montserrat'] font-black text-[20px] tracking-tight block">Agri-Link</span>
                  <span className="text-[11px] text-white/80 font-semibold tracking-wider uppercase">
                    {role === 'PRODUCER' 
                      ? 'Espace Producteur' 
                      : role === 'ADMIN' 
                      ? 'Espace Administration' 
                      : 'Espace Acheteur & Client'}
                  </span>
                </div>
              </div>

              <h2 className="font-['Montserrat'] font-extrabold text-[22px] sm:text-[25px] lg:text-[27px] leading-tight mb-3">
                {role === 'PRODUCER' 
                  ? 'Valorisez vos récoltes avec des débouchés garantis.' 
                  : role === 'ADMIN'
                  ? 'Supervisez la chaîne de valeur agricole en temps réel.'
                  : 'Approvisionnez-vous directement auprès des fermes du Sénégal.'}
              </h2>
              <p className="text-[13px] sm:text-[14px] text-white/80 leading-relaxed font-['Inter']">
                {role === 'PRODUCER'
                  ? 'Planifiez vos cultures, publiez vos estimations de récolte et recevez des précommandes fermes avec acompte garanti.'
                  : role === 'ADMIN'
                  ? 'Gérez les approbations des producteurs, contrôlez les transactions sous séquestre et suivez les flux d’approvisionnement.'
                  : 'Accédez aux récoltes maraîchères et fruitières au prix de gros ou demi-gros, avec garantie de conformité et livraison.'}
              </p>
            </div>

            {/* Feature highlights tailored by role */}
            <div className="relative z-10 my-6 space-y-3.5 border-t border-b border-white/10 py-5 hidden sm:block">
              {role === 'PRODUCER' ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#fed7aa] shrink-0">
                      <span className="material-symbols-outlined text-[19px]">handshake</span>
                    </div>
                    <div className="text-[13px]">
                      <span className="font-bold block">Acompte 30% Garanti</span>
                      <span className="text-white/70 text-[12px]">Fonds bloqués dès la réservation de votre récolte</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#fed7aa] shrink-0">
                      <span className="material-symbols-outlined text-[19px]">qr_code_2</span>
                    </div>
                    <div className="text-[13px]">
                      <span className="font-bold block">Traçabilité & Certificat QR</span>
                      <span className="text-white/70 text-[12px]">Mise en valeur de votre région et de vos méthodes de culture</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#fed7aa] shrink-0">
                      <span className="material-symbols-outlined text-[19px]">store</span>
                    </div>
                    <div className="text-[13px]">
                      <span className="font-bold block">Réseau d'Acheteurs Qualifiés</span>
                      <span className="text-white/70 text-[12px]">Restaurants, traiteurs, supermarchés et ménages</span>
                    </div>
                  </div>
                </>
              ) : role === 'ADMIN' ? (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#fcd34d] shrink-0">
                      <span className="material-symbols-outlined text-[19px]">verified_user</span>
                    </div>
                    <div className="text-[13px]">
                      <span className="font-bold block">Validation & Conformité</span>
                      <span className="text-white/70 text-[12px]">Accréditation des fermes et contrôle qualité des lots</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#fcd34d] shrink-0">
                      <span className="material-symbols-outlined text-[19px]">account_balance_wallet</span>
                    </div>
                    <div className="text-[13px]">
                      <span className="font-bold block">Surveillance du Séquestre</span>
                      <span className="text-white/70 text-[12px]">Contrôle des flux Wave & Orange Money</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#fcd34d] shrink-0">
                      <span className="material-symbols-outlined text-[19px]">query_stats</span>
                    </div>
                    <div className="text-[13px]">
                      <span className="font-bold block">Tableaux de Bord Nationaux</span>
                      <span className="text-white/70 text-[12px]">Statistiques consolidées de récoltes et livraisons</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#97f5a5] shrink-0">
                      <span className="material-symbols-outlined text-[19px]">price_check</span>
                    </div>
                    <div className="text-[13px]">
                      <span className="font-bold block">Prix Direct Exploitation</span>
                      <span className="text-white/70 text-[12px]">Économisez jusqu'à 25% sans intermédiaires superflus</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#97f5a5] shrink-0">
                      <span className="material-symbols-outlined text-[19px]">verified_user</span>
                    </div>
                    <div className="text-[13px]">
                      <span className="font-bold block">Protection Séquestre 30%</span>
                      <span className="text-white/70 text-[12px]">Solde versé uniquement après inspection conforme</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#97f5a5] shrink-0">
                      <span className="material-symbols-outlined text-[19px]">local_shipping</span>
                    </div>
                    <div className="text-[13px]">
                      <span className="font-bold block">Suivi & Logistique</span>
                      <span className="text-white/70 text-[12px]">Livraison directe ou retrait sécurisé en point relais</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Trust Markers */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-white/60 pt-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">shield</span>
                Inscription 100% Gratuite
              </span>
              <span>Réseau National SN</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Responsive Multi-Section Form */}
          <div className="lg:col-span-7 p-5 sm:p-8 md:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Back to Market */}
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <button
                  type="button"
                  onClick={() => navigateTo('marketplace')}
                  className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold text-[#555d50] hover:text-[#164525] transition-colors py-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  <span>Retour au Marché</span>
                </button>
                <span className="text-[11px] font-semibold text-[#717970] bg-[#FAF8F2] px-2.5 py-1 rounded-full border border-[#c1c9be]/50">
                  Nouveau Compte
                </span>
              </div>

              {/* Header Title */}
              <div className="mb-4 sm:mb-5">
                <h1 className="font-['Montserrat'] font-extrabold text-[22px] sm:text-[25px] text-[#164525] tracking-tight">
                  Rejoindre Agri-Link
                </h1>
                <p className="text-[12px] sm:text-[13px] text-[#555d50] mt-1 font-['Inter']">
                  Créez votre compte pour accéder aux offres et précommandes agricoles
                </p>
              </div>

              {/* Role Selector 3 Tabs */}
              <div className="mb-5 sm:mb-6">
                <label className="block text-[12px] sm:text-[13px] font-semibold text-[#2b1700] mb-2">
                  Sélectionnez le type de compte :
                </label>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-[#F3EBDD] rounded-xl sm:rounded-2xl">
                  <button
                    type="button"
                    id="role-select-buyer-btn"
                    onClick={() => setRole('BUYER')}
                    className={`min-h-[46px] py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-[13px] font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
                      role === 'BUYER'
                        ? 'bg-[#164525] text-white shadow-sm'
                        : 'text-[#414941] hover:text-[#164525] hover:bg-white/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">shopping_basket</span>
                    <span className="leading-tight truncate">Acheteur</span>
                  </button>

                  <button
                    type="button"
                    id="role-select-producer-btn"
                    onClick={() => setRole('PRODUCER')}
                    className={`min-h-[46px] py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-[13px] font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
                      role === 'PRODUCER'
                        ? 'bg-[#7d4600] text-white shadow-sm'
                        : 'text-[#414941] hover:text-[#7d4600] hover:bg-white/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">agriculture</span>
                    <span className="leading-tight truncate">Producteur</span>
                  </button>

                  <button
                    type="button"
                    id="role-select-admin-btn"
                    onClick={() => setRole('ADMIN')}
                    className={`min-h-[46px] py-2 sm:py-2.5 px-1.5 sm:px-3 rounded-lg sm:rounded-xl text-[11px] sm:text-[13px] font-bold transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer text-center ${
                      role === 'ADMIN'
                        ? 'bg-[#2b1700] text-white shadow-sm'
                        : 'text-[#414941] hover:text-[#2b1700] hover:bg-white/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] sm:text-[20px]">admin_panel_settings</span>
                    <span className="leading-tight truncate">Admin</span>
                  </button>
                </div>
              </div>

              {/* Success Feedback */}
              {registrationSuccess && (
                <div className="mb-5 p-3.5 sm:p-4 rounded-xl bg-[#dcfce7] border border-[#22c55e]/40 text-[#15803d] text-[13px] flex items-center gap-2.5 animate-in fade-in duration-200">
                  <span className="material-symbols-outlined text-[22px] text-[#16a34a] shrink-0">check_circle</span>
                  <div>
                    <p className="font-bold">Compte créé avec succès !</p>
                    <p className="text-[12px] text-[#166534]">Redirection vers votre espace {role === 'ADMIN' ? 'Administration' : role === 'PRODUCER' ? 'Producteur' : 'Acheteur'}...</p>
                  </div>
                </div>
              )}

              {/* Error Feedback */}
              {(localError || authError) && !registrationSuccess && (
                <div className="mb-5 p-3 sm:p-3.5 rounded-xl bg-[#fee2e2] border border-[#ef4444]/30 text-[#991b1b] text-[12px] sm:text-[13px] flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-[#ef4444] shrink-0 mt-0.5">error</span>
                  <span className="leading-snug">{localError || authError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                {/* Identity Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="reg-firstname" className="block text-[12px] sm:text-[13px] font-semibold text-[#2b1700] mb-1">
                      Prénom *
                    </label>
                    <input
                      id="reg-firstname"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Moussa"
                      className="w-full px-3.5 py-2.5 bg-[#F3EBDD] border border-[#c1c9be]/60 focus:border-[#164525] focus:bg-white outline-none rounded-xl text-[14px] text-[#2b1700] min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-lastname" className="block text-[12px] sm:text-[13px] font-semibold text-[#2b1700] mb-1">
                      Nom *
                    </label>
                    <input
                      id="reg-lastname"
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Diop"
                      className="w-full px-3.5 py-2.5 bg-[#F3EBDD] border border-[#c1c9be]/60 focus:border-[#164525] focus:bg-white outline-none rounded-xl text-[14px] text-[#2b1700] min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="reg-email" className="block text-[12px] sm:text-[13px] font-semibold text-[#2b1700] mb-1">
                      Email *
                    </label>
                    <input
                      id="reg-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="moussa.diop@exemple.sn"
                      className="w-full px-3.5 py-2.5 bg-[#F3EBDD] border border-[#c1c9be]/60 focus:border-[#164525] focus:bg-white outline-none rounded-xl text-[14px] text-[#2b1700] min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label htmlFor="reg-phone" className="block text-[12px] sm:text-[13px] font-semibold text-[#2b1700] mb-1">
                      Téléphone (Wave / OM) *
                    </label>
                    <input
                      id="reg-phone"
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+221 77 000 00 00"
                      className="w-full px-3.5 py-2.5 bg-[#F3EBDD] border border-[#c1c9be]/60 focus:border-[#164525] focus:bg-white outline-none rounded-xl text-[14px] text-[#2b1700] min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Conditional Role-Specific Section */}
                {role === 'PRODUCER' ? (
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#7d4600]/5 border border-[#7d4600]/20 space-y-3">
                    <div className="flex items-center gap-2 text-[#7d4600] font-bold text-[13px] sm:text-[14px]">
                      <span className="material-symbols-outlined text-[18px]">yard</span>
                      Détails de l'exploitation agricole
                    </div>

                    <div>
                      <label htmlFor="reg-farm-name" className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                        Nom de l'exploitation / Ferme *
                      </label>
                      <input
                        id="reg-farm-name"
                        type="text"
                        required
                        value={farmName}
                        onChange={(e) => setFarmName(e.target.value)}
                        placeholder="Ex: Ferme Maraîchère des Niayes"
                        className="w-full px-3 py-2.5 bg-white border border-[#c1c9be]/60 focus:border-[#7d4600] outline-none rounded-xl text-[13px] sm:text-[14px] text-[#2b1700] min-h-[42px]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-farm-location" className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                          Zone / Région
                        </label>
                        <input
                          id="reg-farm-location"
                          type="text"
                          value={producerLocation}
                          onChange={(e) => setProducerLocation(e.target.value)}
                          placeholder="Sangalkam, Rufisque"
                          className="w-full px-3 py-2.5 bg-white border border-[#c1c9be]/60 focus:border-[#7d4600] outline-none rounded-xl text-[13px] sm:text-[14px] text-[#2b1700] min-h-[42px]"
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-farm-desc" className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                          Cultures principales
                        </label>
                        <input
                          id="reg-farm-desc"
                          type="text"
                          value={producerDescription}
                          onChange={(e) => setProducerDescription(e.target.value)}
                          placeholder="Oignons, Tomates, Mangues bio..."
                          className="w-full px-3 py-2.5 bg-white border border-[#c1c9be]/60 focus:border-[#7d4600] outline-none rounded-xl text-[13px] sm:text-[14px] text-[#2b1700] min-h-[42px]"
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-[#7d4600] italic leading-tight pt-1">
                      * Les profils producteurs sont validés avec notre équipe pour garantir l'origine certifiée des lots.
                    </p>
                  </div>
                ) : role === 'BUYER' ? (
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#164525]/5 border border-[#164525]/20 space-y-3">
                    <div className="flex items-center gap-2 text-[#164525] font-bold text-[13px] sm:text-[14px]">
                      <span className="material-symbols-outlined text-[18px]">storefront</span>
                      Profil Acheteur & Besoins
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-buyer-type" className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                          Catégorie d'acheteur
                        </label>
                        <select
                          id="reg-buyer-type"
                          value={buyerType}
                          onChange={(e) => setBuyerType(e.target.value as BuyerCategoryCode)}
                          className="w-full px-3 py-2.5 bg-white border border-[#c1c9be]/60 focus:border-[#164525] outline-none rounded-xl text-[13px] sm:text-[14px] text-[#2b1700] min-h-[42px] cursor-pointer"
                        >
                          <option value="INDIVIDUAL">Particulier / Ménage</option>
                          <option value="RESTAURANT">Restaurant / Traiteur</option>
                          <option value="HOTEL">Hôtel / Résidence</option>
                          <option value="SUPERMARKET">Supermarché / Boutique</option>
                          <option value="PROFESSIONAL">Grossiste / Négociant</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="reg-company-name" className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                          Nom établissement (facultatif)
                        </label>
                        <input
                          id="reg-company-name"
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="Ex: Restaurant Le Teranga"
                          className="w-full px-3 py-2.5 bg-white border border-[#c1c9be]/60 focus:border-[#164525] outline-none rounded-xl text-[13px] sm:text-[14px] text-[#2b1700] min-h-[42px]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-city" className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                          Ville
                        </label>
                        <input
                          id="reg-city"
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Dakar, Thiès, Saint-Louis..."
                          className="w-full px-3 py-2.5 bg-white border border-[#c1c9be]/60 focus:border-[#164525] outline-none rounded-xl text-[13px] sm:text-[14px] text-[#2b1700] min-h-[42px]"
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-address" className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                          Adresse / Quartier
                        </label>
                        <input
                          id="reg-address"
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Almadies, Rue 14"
                          className="w-full px-3 py-2.5 bg-white border border-[#c1c9be]/60 focus:border-[#164525] outline-none rounded-xl text-[13px] sm:text-[14px] text-[#2b1700] min-h-[42px]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-[#2b1700]/5 border border-[#2b1700]/20 space-y-3">
                    <div className="flex items-center gap-2 text-[#2b1700] font-bold text-[13px] sm:text-[14px]">
                      <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                      Profil Administrateur de la Plateforme
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor="reg-admin-dept" className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                          Département / Fonction
                        </label>
                        <select
                          id="reg-admin-dept"
                          value={adminDepartment}
                          onChange={(e) => setAdminDepartment(e.target.value)}
                          className="w-full px-3 py-2.5 bg-white border border-[#c1c9be]/60 focus:border-[#2b1700] outline-none rounded-xl text-[13px] sm:text-[14px] text-[#2b1700] min-h-[42px] cursor-pointer"
                        >
                          <option value="Supervision Générale">Supervision Générale</option>
                          <option value="Agronomie & Validation">Agronomie & Validation</option>
                          <option value="Finance & Séquestre">Finance & Séquestre</option>
                          <option value="Support & Logistique">Support & Logistique</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="reg-admin-code" className="block text-[12px] font-semibold text-[#2b1700] mb-1">
                          Code d'activation (Facultatif)
                        </label>
                        <input
                          id="reg-admin-code"
                          type="text"
                          value={adminAccessCode}
                          onChange={(e) => setAdminAccessCode(e.target.value)}
                          placeholder="AGRI-2025"
                          className="w-full px-3 py-2.5 bg-white border border-[#c1c9be]/60 focus:border-[#2b1700] outline-none rounded-xl text-[13px] sm:text-[14px] text-[#2b1700] min-h-[42px]"
                        />
                      </div>
                    </div>
                    <p className="text-[12px] text-[#2b1700]/80 leading-relaxed">
                      Ce compte aura accès complet à la console de gestion (utilisateurs, validation des producteurs, supervision des précommandes et gestion des incidents).
                    </p>
                  </div>
                )}

                {/* Password Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label htmlFor="reg-password" className="block text-[12px] sm:text-[13px] font-semibold text-[#2b1700] mb-1">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <input
                        id="reg-password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Min. 6 caractères"
                        className="w-full pl-3.5 pr-11 py-2.5 bg-[#F3EBDD] border border-[#c1c9be]/60 focus:border-[#164525] focus:bg-white outline-none rounded-xl text-[14px] text-[#2b1700] min-h-[44px]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-[#717970] hover:text-[#2b1700] w-10 h-10 flex items-center justify-center rounded-lg hover:bg-black/5 cursor-pointer"
                        title={showPassword ? 'Masquer' : 'Afficher'}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="reg-conf-password" className="block text-[12px] sm:text-[13px] font-semibold text-[#2b1700] mb-1">
                      Confirmer mot de passe *
                    </label>
                    <input
                      id="reg-conf-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Répétez le mot de passe"
                      className="w-full px-3.5 py-2.5 bg-[#F3EBDD] border border-[#c1c9be]/60 focus:border-[#164525] focus:bg-white outline-none rounded-xl text-[14px] text-[#2b1700] min-h-[44px]"
                    />
                  </div>
                </div>

                <button
                  id="submit-register-btn"
                  type="submit"
                  disabled={isLoading || registrationSuccess}
                  className={`w-full mt-3 sm:mt-4 min-h-[46px] sm:min-h-[48px] py-3 px-4 rounded-xl text-white font-['Montserrat'] font-bold text-[14px] sm:text-[15px] transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer ${
                    role === 'PRODUCER' 
                      ? 'bg-[#7d4600] hover:bg-[#925200] active:bg-[#683a00] shadow-[0_4px_20px_rgba(125,70,0,0.2)]'
                      : role === 'ADMIN'
                      ? 'bg-[#2b1700] hover:bg-[#452500] active:bg-[#1f1000] shadow-[0_4px_20px_rgba(43,23,0,0.2)]'
                      : 'bg-[#164525] hover:bg-[#2f5d3a] active:bg-[#1a4023] shadow-[0_4px_20px_rgba(22,69,37,0.2)]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Création de votre compte...</span>
                    </>
                  ) : registrationSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-[18px]">check_circle</span>
                      <span>Compte créé !</span>
                    </>
                  ) : (
                    <>
                      <span>Créer mon compte {role === 'PRODUCER' ? 'Producteur' : role === 'ADMIN' ? 'Admin' : 'Acheteur'}</span>
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Switch to Login */}
            <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-[#c1c9be]/40 text-center">
              <p className="text-[13px] sm:text-[14px] text-[#555d50]">
                Vous avez déjà un compte ?{' '}
                <button
                  id="switch-to-login-btn"
                  onClick={() => navigateTo('login')}
                  className="font-bold text-[#164525] hover:underline cursor-pointer inline-flex items-center gap-0.5 mt-1 sm:mt-0"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

