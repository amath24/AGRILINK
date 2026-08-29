import React, { useState } from 'react';
import { PaymentRecord } from '../../../types';

interface AdminPaymentsTabProps {
  payments: PaymentRecord[];
  onOpenReceipt?: (payment: PaymentRecord) => void;
}

export const AdminPaymentsTab: React.FC<AdminPaymentsTabProps> = ({
  payments = [],
}) => {
  const [methodFilter, setMethodFilter] = useState<'all' | 'wave' | 'orange_money'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPayment, setSelectedPayment] = useState<PaymentRecord | null>(null);

  const safePayments = payments || [];

  const filteredPayments = safePayments.filter((p) => {
    if (methodFilter !== 'all' && p.moyenPaiement !== methodFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTx = p.numeroTransaction.toLowerCase().includes(q);
      const matchFacture = p.numeroFacture.toLowerCase().includes(q);
      const matchProd = p.produitNom.toLowerCase().includes(q);
      return matchTx || matchFacture || matchProd;
    }
    return true;
  });

  const totalPaye = safePayments.reduce((acc, p) => acc + (p.montant || 0), 0);
  const totalWave = safePayments.filter((p) => p.moyenPaiement === 'wave').reduce((acc, p) => acc + p.montant, 0);
  const totalOrangeMoney = safePayments.filter((p) => p.moyenPaiement === 'orange_money').reduce((acc, p) => acc + p.montant, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Cartes d'opérateurs Wave / Orange Money */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Flux de Paiements & Séquestre
          </h1>
          <p className="text-[14px] text-[#717970]">
            Transactions Mobile Money sécurisées (Wave & Orange Money) avec simulation séquestre
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#164525]/10 text-[#164525] text-[12px] font-bold">
            <span className="material-symbols-outlined text-[16px]">lock</span>
            Séquestre 30% / 70% Actif
          </span>
        </div>
      </div>

      {/* Cartes Opérateurs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 shadow-xs">
          <div className="text-[12px] font-bold text-[#717970] uppercase">Total Transactions</div>
          <div className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700] mt-1">
            {totalPaye.toLocaleString('fr-FR')} <span className="text-[14px] font-normal">FCFA</span>
          </div>
          <div className="text-[12px] text-[#717970] mt-1">{safePayments.length} opérations enregistrées</div>
        </div>

        <div className="bg-white border border-[#1BA4E8]/30 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#1BA4E8] uppercase">Wave Sénégal</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#1BA4E8]/10 text-[#1BA4E8]">0% Frais</span>
          </div>
          <div className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700] mt-1">
            {totalWave.toLocaleString('fr-FR')} <span className="text-[14px] font-normal">FCFA</span>
          </div>
          <div className="text-[12px] text-[#717970] mt-1">Paiements instantanés Wave QR</div>
        </div>

        <div className="bg-white border border-[#FF6600]/30 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold text-[#FF6600] uppercase">Orange Money</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#FF6600]/10 text-[#FF6600]">API OM</span>
          </div>
          <div className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700] mt-1">
            {totalOrangeMoney.toLocaleString('fr-FR')} <span className="text-[14px] font-normal">FCFA</span>
          </div>
          <div className="text-[12px] text-[#717970] mt-1">Paiements par code OTP Orange</div>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[20px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="N° Transaction, facture, produit..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value as any)}
            className="px-3.5 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
          >
            <option value="all">Toutes les méthodes ({safePayments.length})</option>
            <option value="wave">Wave Sénégal</option>
            <option value="orange_money">Orange Money</option>
          </select>
        </div>
      </div>

      {/* Tableau des Paiements */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be]/60 text-[12px] font-bold text-[#717970] uppercase tracking-wider">
                <th className="py-3.5 px-4">Référence Transaction</th>
                <th className="py-3.5 px-4">Facture & Produit</th>
                <th className="py-3.5 px-4 text-right">Montant</th>
                <th className="py-3.5 px-4">Type Paiement</th>
                <th className="py-3.5 px-4">Méthode</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Reçu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/30 text-[13px]">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#717970]">
                    <span className="material-symbols-outlined text-[36px] mb-2 text-[#717970]/60">credit_card_off</span>
                    <p>Aucun paiement trouvé pour cette recherche.</p>
                  </td>
                </tr>
              ) : (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#164525]">
                      {p.numeroTransaction}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#2b1700]">{p.numeroFacture}</div>
                      <div className="text-[11px] text-[#717970]">{p.produitNom}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#2b1700]">
                      {p.montant.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FAF8F2] border border-[#c1c9be] text-[#414941]">
                        {p.typePaiement === 'acompte' ? 'Acompte (30%)' : p.typePaiement === 'solde' ? 'Solde (70%)' : 'Intégral'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.moyenPaiement === 'wave' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1BA4E8]/10 text-[#1BA4E8] font-bold text-[11px]">
                          Wave
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FF6600]/10 text-[#FF6600] font-bold text-[11px]">
                          Orange Money
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-[#717970] text-[12px]">{p.datePaiement}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#164525]/10 text-[#164525]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#164525]"></span>
                        {p.statut === 'validé' ? 'Validé (Séquestre)' : 'En attente'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayment(p)}
                        className="px-2.5 py-1 bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] hover:bg-[#eae4d5] rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Détails
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détail Paiement */}
      {selectedPayment && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#c1c9be] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/40">
              <div>
                <span className="text-[11px] font-mono text-[#717970]">REÇU DE TRANSACTION</span>
                <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#164525]">
                  {selectedPayment.numeroTransaction}
                </h3>
              </div>
              <button
                onClick={() => setSelectedPayment(null)}
                className="p-1.5 rounded-lg text-[#717970] hover:bg-[#FAF8F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-[13px]">
              <div className="p-3 bg-[#FAF8F2] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#717970]">Montant Transféré</div>
                  <div className="font-bold text-[#164525] text-[20px]">{selectedPayment.montant.toLocaleString('fr-FR')} FCFA</div>
                </div>
                <span className="font-bold uppercase text-[12px] px-2 py-1 rounded-lg bg-white border border-[#c1c9be]">
                  {selectedPayment.moyenPaiement}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">N° Facture</div>
                  <div className="font-semibold text-[#2b1700]">{selectedPayment.numeroFacture}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Date & Heure</div>
                  <div className="font-semibold text-[#2b1700]">{selectedPayment.datePaiement}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] rounded-xl">
                <div className="text-[11px] text-[#717970]">Produit concerné</div>
                <div className="font-bold text-[#2b1700]">{selectedPayment.produitNom}</div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#c1c9be]/40 flex justify-end">
              <button
                onClick={() => setSelectedPayment(null)}
                className="px-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] text-[#2b1700] rounded-xl text-[13px] font-medium hover:bg-[#eae4d5] cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
