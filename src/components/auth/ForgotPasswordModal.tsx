import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  initialEmail = '',
}) => {
  const { sendPasswordReset, authError } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setLocalError('Veuillez saisir une adresse email valide.');
      return;
    }
    setLocalError(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    const success = await sendPasswordReset(email.trim());
    setIsSubmitting(false);

    if (success) {
      setSuccessMessage('Un lien de réinitialisation vous a été envoyé par email. Veuillez vérifier votre boîte de réception.');
    } else {
      setLocalError(authError || 'Impossible d’envoyer le lien de réinitialisation.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3.5 sm:p-4 bg-[#2b1700]/50 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-[#FAF8F2] w-full max-w-md rounded-2xl sm:rounded-3xl border border-[#c1c9be]/60 shadow-2xl p-5 sm:p-8 my-auto transition-all">
        <div className="flex justify-between items-start mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#164525]/10 text-[#164525] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px] sm:text-[24px]">lock_reset</span>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#717970] hover:text-[#2b1700] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        <h3 className="font-['Montserrat'] font-bold text-[19px] sm:text-[22px] text-[#164525] mb-1">
          Mot de passe oublié ?
        </h3>
        <p className="text-[13px] sm:text-[14px] text-[#555d50] mb-5 sm:mb-6 leading-relaxed">
          Saisissez l'adresse email associée à votre compte Agri-Link pour recevoir les instructions de réinitialisation sécurisée.
        </p>

        {successMessage ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#e8f5e9] border border-[#22c55e]/30 text-[#164525] text-[13px] sm:text-[14px] flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[20px] text-[#22c55e] shrink-0 mt-0.5">check_circle</span>
              <p className="leading-snug">{successMessage}</p>
            </div>
            <button
              onClick={onClose}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-[#164525] text-white font-semibold text-[14px] hover:bg-[#2f5d3a] transition-all cursor-pointer"
            >
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {localError && (
              <div className="p-3 rounded-xl bg-[#fee2e2] border border-[#ef4444]/30 text-[#991b1b] text-[12px] sm:text-[13px] flex items-start gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#ef4444] shrink-0 mt-0.5">error</span>
                <span>{localError}</span>
              </div>
            )}

            <div>
              <label htmlFor="reset-email" className="block text-[12px] sm:text-[13px] font-semibold text-[#2b1700] mb-1.5">
                Adresse email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#717970] text-[20px] pointer-events-none">
                  mail
                </span>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.sn"
                  className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-[#F3EBDD] border border-[#c1c9be]/60 focus:border-[#164525] focus:bg-white outline-none rounded-xl text-[14px] sm:text-[15px] text-[#2b1700] transition-colors min-h-[44px]"
                />
              </div>
            </div>

            <div className="flex gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl border border-[#c1c9be] text-[#414941] font-semibold text-[13px] sm:text-[14px] hover:bg-[#fff1e6] transition-colors cursor-pointer text-center"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 min-h-[44px] py-2.5 px-3 sm:px-4 rounded-xl bg-[#164525] text-white font-semibold text-[13px] sm:text-[14px] hover:bg-[#2f5d3a] transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer text-center"
              >
                {isSubmitting ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Envoi...</span>
                  </>
                ) : (
                  <span>Envoyer</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
