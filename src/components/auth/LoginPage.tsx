import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { UserRoleType } from '../../types';

interface LoginPageProps {
  onNavigate?: (view: 'home' | 'marketplace' | 'detail' | 'tracking' | 'buyer' | 'producer' | 'admin' | 'login' | 'register') => void;
  onNavigateToRegister?: () => void;
  onNavigateToMarketplace?: () => void;
  onLoginSuccess?: (role: UserRoleType) => void;
  onSuccessRedirect?: (role: UserRoleType) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onNavigate,
  onNavigateToRegister,
  onNavigateToMarketplace,
  onLoginSuccess,
  onSuccessRedirect,
}) => {
  const { login, authError, setDemoUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const navigateTo = (view: 'home' | 'marketplace' | 'detail' | 'tracking' | 'buyer' | 'producer' | 'admin' | 'login' | 'register') => {
    if (view === 'register' && onNavigateToRegister) {
      onNavigateToRegister();
    } else if (view === 'marketplace' && onNavigateToMarketplace) {
      onNavigateToMarketplace();
    } else if (onNavigate) {
      onNavigate(view);
    }
  };

  const handleSuccess = (role: UserRoleType) => {
    if (onLoginSuccess) {
      onLoginSuccess(role);
    } else if (onSuccessRedirect) {
      onSuccessRedirect(role);
    } else if (onNavigate) {
      onNavigate(role === 'ADMIN' ? 'admin' : role === 'PRODUCER' ? 'producer' : 'buyer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Veuillez renseigner votre email et mot de passe.');
      return;
    }

    setIsLoading(true);
    const success = await login(email.trim(), password);
    setIsLoading(false);

    if (success) {
      const saved = localStorage.getItem('agrilink_current_profile');
      const role: UserRoleType = saved ? JSON.parse(saved).role : 'BUYER';
      handleSuccess(role);
    }
  };

  const handleQuickDemo = (role: UserRoleType) => {
    setDemoUser(role);
    handleSuccess(role);
  };

  return (
    <div className="min-h-screen pt-16 sm:pt-20 pb-12 px-3.5 sm:px-6 lg:px-8 flex items-center justify-center bg-[#FAF8F2]">
      <div className="w-full max-w-5xl bg-white/95 rounded-2xl sm:rounded-3xl border border-[#c1c9be]/60 shadow-[0_16px_50px_rgba(22,69,37,0.08)] overflow-hidden transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* LEFT COLUMN: Visual & Value Proposition Showcase (Desktop & Tablet landscape) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#164525] via-[#1c552f] to-[#0e311a] text-white p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl" />
            <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-[#7d4600]/20 pointer-events-none blur-xl" />

            {/* Brand section */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-xs flex items-center justify-center text-[#97f5a5] border border-white/10 shadow-inner">
                  <span className="material-symbols-outlined text-[26px]">agriculture</span>
                </div>
                <div>
                  <span className="font-['Montserrat'] font-black text-[20px] tracking-tight block">Agri-Link</span>
                  <span className="text-[11px] text-[#97f5a5] font-semibold tracking-wider uppercase">Terroirs du Sénégal</span>
                </div>
              </div>

              <h2 className="font-['Montserrat'] font-extrabold text-[22px] sm:text-[25px] lg:text-[27px] leading-tight mb-3">
                L'approvisionnement agricole direct et transparent.
              </h2>
              <p className="text-[13px] sm:text-[14px] text-white/80 leading-relaxed font-['Inter']">
                Connectez-vous pour commander directement auprès des exploitants maraîchers et fruitiers du Sénégal.
              </p>
            </div>

            {/* Value Highlights */}
            <div className="relative z-10 my-6 space-y-3.5 border-t border-b border-white/10 py-5 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#97f5a5] shrink-0">
                  <span className="material-symbols-outlined text-[19px]">verified_user</span>
                </div>
                <div className="text-[13px]">
                  <span className="font-bold block">Séquestre 30% Garanti</span>
                  <span className="text-white/70 text-[12px]">Fonds protégés jusqu'à la livraison conforme</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#97f5a5] shrink-0">
                  <span className="material-symbols-outlined text-[19px]">qr_code_2</span>
                </div>
                <div className="text-[13px]">
                  <span className="font-bold block">Traçabilité Parcelles</span>
                  <span className="text-white/70 text-[12px]">QR code certifié pour chaque récolte</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#97f5a5] shrink-0">
                  <span className="material-symbols-outlined text-[19px]">payments</span>
                </div>
                <div className="text-[13px]">
                  <span className="font-bold block">Wave & Orange Money</span>
                  <span className="text-white/70 text-[12px]">Règlements fluides et instantanés</span>
                </div>
              </div>
            </div>

            {/* Footer Trust Markers */}
            <div className="relative z-10 flex items-center justify-between text-[11px] text-white/60 pt-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#97f5a5]">shield</span>
                Connexion chiffrée SSL
              </span>
              <span>Plateforme Nationale SN</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Form & Interaction */}
          <div className="lg:col-span-7 p-5 sm:p-8 md:p-10 flex flex-col justify-between bg-white">
            <div>
              {/* Back to Market & Section Badge */}
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
                  Espace Membre
                </span>
              </div>

              {/* Form Header */}
              <div className="mb-5 sm:mb-6">
                <h1 className="font-['Montserrat'] font-extrabold text-[22px] sm:text-[26px] text-[#164525] tracking-tight">
                  Heureux de vous revoir
                </h1>
                <p className="text-[13px] sm:text-[14px] text-[#555d50] mt-1 font-['Inter']">
                  Accédez à votre espace pour gérer vos commandes et récoltes
                </p>
              </div>

              {/* Demo Fast Switch Buttons */}
              <div className="mb-5 sm:mb-6 p-3 sm:p-3.5 bg-[#FAF8F2] rounded-xl sm:rounded-2xl border border-[#c1c9be]/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#7d4600] uppercase tracking-wider flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px] sm:text-[14px]">bolt</span>
                    Accès Démo Rapide (1-clic)
                  </span>
                  <span className="text-[10px] text-[#717970]">Mode évaluation</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('BUYER')}
                    className="min-h-[44px] py-1.5 px-1.5 sm:px-2 rounded-xl bg-white hover:bg-[#fff1e6] active:bg-[#ffe3cc] border border-[#c1c9be]/50 text-[11px] sm:text-[12px] font-semibold text-[#164525] flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#164525]">shopping_basket</span>
                    <span className="truncate max-w-full">Acheteur</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('PRODUCER')}
                    className="min-h-[44px] py-1.5 px-1.5 sm:px-2 rounded-xl bg-white hover:bg-[#fff1e6] active:bg-[#ffe3cc] border border-[#c1c9be]/50 text-[11px] sm:text-[12px] font-semibold text-[#7d4600] flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#7d4600]">agriculture</span>
                    <span className="truncate max-w-full">Producteur</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemo('ADMIN')}
                    className="min-h-[44px] py-1.5 px-1.5 sm:px-2 rounded-xl bg-white hover:bg-[#fff1e6] active:bg-[#ffe3cc] border border-[#c1c9be]/50 text-[11px] sm:text-[12px] font-semibold text-[#2b1700] flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all cursor-pointer shadow-2xs"
                  >
                    <span className="material-symbols-outlined text-[15px] sm:text-[16px] text-[#2b1700]">admin_panel_settings</span>
                    <span className="truncate max-w-full">Admin</span>
                  </button>
                </div>
              </div>

              {/* Error Feedback */}
              {(localError || authError) && (
                <div className="mb-5 p-3 sm:p-3.5 rounded-xl bg-[#fee2e2] border border-[#ef4444]/30 text-[#991b1b] text-[12px] sm:text-[13px] flex items-start gap-2.5">
                  <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-[#ef4444] shrink-0 mt-0.5">error</span>
                  <span className="leading-snug">{localError || authError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-email" className="block text-[13px] font-semibold text-[#2b1700] mb-1.5 font-['Inter']">
                    Adresse Email
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717970] text-[20px] pointer-events-none">
                      mail
                    </span>
                    <input
                      id="login-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="votre.email@exemple.sn"
                      className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-[#F3EBDD] border border-[#c1c9be]/60 focus:border-[#164525] focus:bg-white outline-none rounded-xl text-[14px] sm:text-[15px] text-[#2b1700] transition-colors min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5 flex-wrap gap-1">
                    <label htmlFor="login-password" className="block text-[13px] font-semibold text-[#2b1700] font-['Inter']">
                      Mot de passe
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotOpen(true)}
                      className="text-[12px] font-semibold text-[#164525] hover:underline cursor-pointer py-0.5"
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717970] text-[20px] pointer-events-none">
                      lock
                    </span>
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-11 pr-12 py-2.5 sm:py-3 bg-[#F3EBDD] border border-[#c1c9be]/60 focus:border-[#164525] focus:bg-white outline-none rounded-xl text-[14px] sm:text-[15px] text-[#2b1700] transition-colors min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-[#717970] hover:text-[#2b1700] w-10 h-10 flex items-center justify-center cursor-pointer rounded-lg hover:bg-black/5"
                      title={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      <span className="material-symbols-outlined text-[19px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <button
                  id="submit-login-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 min-h-[46px] sm:min-h-[48px] py-3 px-4 rounded-xl bg-[#164525] text-white font-['Montserrat'] font-bold text-[14px] sm:text-[15px] hover:bg-[#2f5d3a] active:bg-[#1a4023] transition-all shadow-[0_4px_20px_rgba(22,69,37,0.2)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <span>Se connecter</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Switch to Register */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-[#c1c9be]/40 text-center">
              <p className="text-[13px] sm:text-[14px] text-[#555d50]">
                Vous n'avez pas encore de compte ?{' '}
                <button
                  id="switch-to-register-btn"
                  onClick={() => navigateTo('register')}
                  className="font-bold text-[#164525] hover:underline cursor-pointer inline-flex items-center gap-0.5 mt-1 sm:mt-0"
                >
                  Créer un compte gratuitement
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        initialEmail={email}
      />
    </div>
  );
};
