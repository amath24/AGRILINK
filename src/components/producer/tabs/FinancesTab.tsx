import React, { useState } from 'react';
import { ProducerFinanceSummary, FinancialTransaction } from '../../../types';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface FinancesTabProps {
  financeSummary: ProducerFinanceSummary;
  transactions: FinancialTransaction[];
}

export const FinancesTab: React.FC<FinancesTabProps> = ({
  financeSummary,
  transactions,
}) => {
  const [filterType, setFilterType] = useState<string>('all');

  const filteredTransactions = transactions.filter((t) => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const margeBrute =
    financeSummary.revenusTotaux - financeSummary.coutsProductionTotaux;
  const margePct = Math.round(
    (margeBrute / (financeSummary.revenusTotaux || 1)) * 100
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#164525] text-[28px]">
              account_balance_wallet
            </span>
            <h1 className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700]">
              Finances & Trésorerie Agricole
            </h1>
          </div>
          <p className="text-[13px] text-[#717970] mt-1">
            Gestion des flux financiers, acomptes sécurisés par séquestre et marge nette sur récoltes.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717970]">
              Chiffre d'Affaires Réalisé
            </span>
            <span className="material-symbols-outlined text-[#164525] text-[20px]">
              monetization_on
            </span>
          </div>
          <div className="font-['Montserrat'] text-[22px] font-bold text-[#164525]">
            {financeSummary.revenusTotaux.toLocaleString('fr-FR')} FCFA
          </div>
          <span className="text-[11px] text-[#717970] mt-1 block">
            Commandes livrées & soldées
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717970]">
              Acomptes Reçus (Séquestre)
            </span>
            <span className="material-symbols-outlined text-[#7d4600] text-[20px]">
              savings
            </span>
          </div>
          <div className="font-['Montserrat'] text-[22px] font-bold text-[#7d4600]">
            {financeSummary.acomptesRecus.toLocaleString('fr-FR')} FCFA
          </div>
          <span className="text-[11px] text-[#717970] mt-1 block">
            30% débloqués à l'engagement
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717970]">
              Soldes en Attente (70%)
            </span>
            <span className="material-symbols-outlined text-purple-700 text-[20px]">
              pending_actions
            </span>
          </div>
          <div className="font-['Montserrat'] text-[22px] font-bold text-purple-900">
            {financeSummary.soldesEnAttente.toLocaleString('fr-FR')} FCFA
          </div>
          <span className="text-[11px] text-[#717970] mt-1 block">
            À percevoir à la livraison
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#c1c9be] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#717970]">
              Marge Nette Estimée
            </span>
            <span className="material-symbols-outlined text-emerald-700 text-[20px]">
              trending_up
            </span>
          </div>
          <div className="font-['Montserrat'] text-[22px] font-bold text-emerald-800">
            {margeBrute.toLocaleString('fr-FR')} FCFA
          </div>
          <span className="text-[11px] text-[#164525] font-semibold mt-1 block">
            Taux de marge brute : {margePct}%
          </span>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
            Évolution Mensuelle (Revenus vs Dépenses)
          </h2>
          <span className="text-[12px] text-[#717970]">Exercice 2026</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={financeSummary.graphiqueMensuel}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="mois" stroke="#717970" fontSize={12} />
              <YAxis stroke="#717970" fontSize={12} />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toLocaleString('fr-FR')} FCFA`,
                ]}
              />
              <Legend />
              <Bar dataKey="revenus" name="Revenus (FCFA)" fill="#164525" radius={[4, 4, 0, 0]} />
              <Bar dataKey="depenses" name="Dépenses / Intrants (FCFA)" fill="#7d4600" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white border border-[#c1c9be] rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#c1c9be]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-['Montserrat'] text-[15px] font-bold text-[#2b1700]">
            Historique des Transactions & Règlements
          </h3>

          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'Toutes' },
              { id: 'Acompte', label: 'Acomptes' },
              { id: 'Solde', label: 'Soldes' },
              { id: 'Dépense Intrant', label: 'Dépenses' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                  filterType === f.id
                    ? 'bg-[#164525] text-white'
                    : 'bg-[#FAF8F2] text-[#414941] hover:bg-[#eae4d5]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be] text-[#717970] font-semibold text-[12px] uppercase">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Libellé / Réf.</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Mode de Règlement</th>
                <th className="py-3 px-4">Montant</th>
                <th className="py-3 px-4 text-right">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/40">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#717970]">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[36px] text-[#c1c9be]">account_balance_wallet</span>
                      <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">Aucune transaction enregistrée</h3>
                      <p className="text-[13px] text-[#717970] max-w-sm">Les paiements d'acomptes et les déblocages de fonds apparaîtront automatiquement dans ce journal.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                const isIncome = tx.type === 'Acompte' || tx.type === 'Solde' || tx.type === 'Paiement direct';

                return (
                  <tr key={tx.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3 px-4 text-[#717970] text-[12px]">
                      {tx.date}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-[#2b1700] block">{tx.libelle}</strong>
                      {tx.reference && (
                        <span className="text-[11px] text-[#717970] font-mono">
                          {tx.reference}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-[#FAF8F2] border border-[#c1c9be]/60 text-[11px] font-medium">
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#414941] text-[12px]">
                      {tx.moyenPaiement}
                    </td>
                    <td
                      className={`py-3 px-4 font-bold ${
                        isIncome ? 'text-[#164525]' : 'text-red-700'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {tx.montant.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {tx.statut}
                      </span>
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
