import React, { useState } from 'react';
import { PaymentRecord, Preorder } from '../../types';

interface BuyerPaymentsTabProps {
  payments: PaymentRecord[];
  preorders: Preorder[];
  onOpenReceipt: (payment: PaymentRecord) => void;
}

export const BuyerPaymentsTab: React.FC<BuyerPaymentsTabProps> = ({
  payments = [],
  preorders = [],
  onOpenReceipt,
}) => {
  const [filterMoyen, setFilterMoyen] = useState<'all' | 'wave' | 'orange_money'>('all');
  const [search, setSearch] = useState('');

  const safePayments = payments || [];
  const safePreorders = preorders || [];

  const filteredPayments = safePayments.filter((p) => {
    if (filterMoyen !== 'all' && p.moyenPaiement !== filterMoyen) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        p.produitNom.toLowerCase().includes(q) ||
        p.numeroTransaction.toLowerCase().includes(q) ||
        p.numeroFacture.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPaye = safePayments.reduce((acc, p) => acc + (p.montant || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white border border-[#c1c9be] rounded-2xl p-5 shadow-sm">
          <span className="text-[12px] font-semibold text-[#717970] uppercase tracking-wider block mb-1">
            Total des Paiements Traités
          </span>
          <div className="font-['Montserrat'] text-[24px] font-bold text-[#164525]">
            {totalPaye.toLocaleString('fr-FR')} FCFA
          </div>
          <p className="text-[12px] text-[#414941] mt-1 flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#164525]">verified</span>
            {payments.length} transactions sécurisées
          </p>
        </div>

        <div className="bg-white border border-[#c1c9be] rounded-2xl p-5 shadow-sm">
          <span className="text-[12px] font-semibold text-[#717970] uppercase tracking-wider block mb-1">
            Garantie Séquestre
          </span>
          <div className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
            100% Sécurisé
          </div>
          <p className="text-[12px] text-[#717970] mt-1">
            Fonds garantis jusqu'à réception conforme des marchandises
          </p>
        </div>

        <div className="bg-white border border-[#c1c9be] rounded-2xl p-5 shadow-sm">
          <span className="text-[12px] font-semibold text-[#717970] uppercase tracking-wider block mb-1">
            Moyens Utilisés
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2.5 py-1 bg-[#1e90ff]/15 text-[#0066cc] rounded-lg text-[12px] font-bold">
              Wave ({payments.filter((p) => p.moyenPaiement === 'wave').length})
            </span>
            <span className="px-2.5 py-1 bg-[#ff6600]/15 text-[#cc5200] rounded-lg text-[12px] font-bold">
              Orange Money ({payments.filter((p) => p.moyenPaiement === 'orange_money').length})
            </span>
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
            Historique des Paiements & Factures
          </h1>
          <p className="text-[13px] text-[#717970] mt-0.5">
            Retrouvez tous vos reçus de versement d'acomptes et règlements finaux
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Filter by method */}
          <div className="flex border border-[#c1c9be] rounded-full overflow-hidden bg-[#FAF8F2] p-0.5">
            <button
              onClick={() => setFilterMoyen('all')}
              className={`px-3 py-1 text-[12px] font-medium rounded-full transition-colors cursor-pointer ${
                filterMoyen === 'all' ? 'bg-[#164525] text-white' : 'text-[#414941]'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterMoyen('wave')}
              className={`px-3 py-1 text-[12px] font-medium rounded-full transition-colors cursor-pointer ${
                filterMoyen === 'wave' ? 'bg-[#164525] text-white' : 'text-[#414941]'
              }`}
            >
              Wave
            </button>
            <button
              onClick={() => setFilterMoyen('orange_money')}
              className={`px-3 py-1 text-[12px] font-medium rounded-full transition-colors cursor-pointer ${
                filterMoyen === 'orange_money' ? 'bg-[#164525] text-white' : 'text-[#414941]'
              }`}
            >
              Orange Money
            </button>
          </div>

          <div className="relative flex-grow md:w-56">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#717970] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="N° Facture, transaction..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#FAF8F2] border border-[#c1c9be] rounded-full text-[12px] text-[#2b1700] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-[#c1c9be] overflow-hidden shadow-sm">
        {filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-[#717970]">
            <p>Aucun paiement ne correspond à ces critères.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#FAF8F2] border-b border-[#c1c9be] text-[#717970] font-semibold">
                <tr>
                  <th className="py-3 px-4">N° Facture / Date</th>
                  <th className="py-3 px-4">Désignation</th>
                  <th className="py-3 px-4">Moyen de Paiement</th>
                  <th className="py-3 px-4">Montant</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c1c9be]/40 text-[#414941]">
                {filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-mono font-bold text-[#164525] block">
                        {p.numeroFacture}
                      </span>
                      <span className="text-[11px] text-[#717970]">{p.datePaiement}</span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-[#2b1700] block">{p.produitNom}</span>
                      <span className="font-mono text-[11px] text-[#717970]">
                        Tx: {p.numeroTransaction}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          p.moyenPaiement === 'wave'
                            ? 'bg-[#1e90ff]/15 text-[#0066cc]'
                            : 'bg-[#ff6600]/15 text-[#cc5200]'
                        }`}
                      >
                        {p.moyenPaiement === 'wave' ? 'Wave Mobile' : 'Orange Money'}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-['Montserrat'] font-bold text-[#164525] text-[14px]">
                      {p.montant.toLocaleString('fr-FR')} FCFA
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-[#164525] bg-[#bbefc1] px-2 py-0.5 rounded-full text-[11px] font-bold">
                        <span className="material-symbols-outlined text-[13px]">check</span>
                        Validé
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onOpenReceipt(p)}
                        className="inline-flex items-center gap-1 bg-white border border-[#164525] text-[#164525] hover:bg-[#164525] hover:text-white px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[15px]">receipt</span>
                        Reçu / PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
