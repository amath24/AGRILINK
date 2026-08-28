import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

export const AdminStatisticsTab: React.FC = () => {
  const monthlyData = [
    { mois: 'Jan', ventes: 4200000, commissions: 210000, precommandes: 18 },
    { mois: 'Fév', ventes: 5600000, commissions: 280000, precommandes: 24 },
    { mois: 'Mar', ventes: 7100000, commissions: 355000, precommandes: 32 },
    { mois: 'Avr', ventes: 8900000, commissions: 445000, precommandes: 41 },
    { mois: 'Mai', ventes: 11500000, commissions: 575000, precommandes: 52 },
    { mois: 'Juin', ventes: 14850000, commissions: 742500, precommandes: 68 },
  ];

  const categoryDistribution = [
    { name: 'Oignons & Échalotes', value: 38, color: '#164525' },
    { name: 'Tomates Industrielles', value: 24, color: '#e76f51' },
    { name: 'Pommes de terre', value: 18, color: '#e9c46a' },
    { name: 'Mangues & Fruits', value: 12, color: '#2a9d8f' },
    { name: 'Autres cultures', value: 8, color: '#264653' },
  ];

  const regionalData = [
    { region: 'Niayes (Thiès / Dakar)', producteurs: 42, part: '52%' },
    { region: 'Vallée du Fleuve (Saint-Louis)', producteurs: 24, part: '30%' },
    { region: 'Casamance (Ziguinchor)', producteurs: 10, part: '12%' },
    { region: 'Bassin Arachidier (Kaolack)', producteurs: 5, part: '6%' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Statistiques & Analyses Avancées
          </h1>
          <p className="text-[14px] text-[#717970]">
            Performance financière, croissance des volumes agricoles et indicateurs d'impact
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
          <span className="material-symbols-outlined text-[#164525] text-[18px]">calendar_today</span>
          <span className="font-bold text-[#2b1700]">Année 2026 (Semestre 1)</span>
        </div>
      </div>

      {/* Cartes KPI clés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 shadow-xs">
          <div className="text-[12px] font-bold text-[#717970] uppercase">Panier Moyen</div>
          <div className="font-['Montserrat'] text-[22px] font-bold text-[#164525] mt-1">
            218 000 FCFA
          </div>
          <div className="text-[11px] text-[#164525] font-semibold mt-1">↑ +14% vs trimestre précédent</div>
        </div>

        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 shadow-xs">
          <div className="text-[12px] font-bold text-[#717970] uppercase">Taux de Séquestre Réussi</div>
          <div className="font-['Montserrat'] text-[22px] font-bold text-[#164525] mt-1">
            99.4 %
          </div>
          <div className="text-[11px] text-[#717970] mt-1">Zéro défaut de paiement acheteur</div>
        </div>

        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 shadow-xs">
          <div className="text-[12px] font-bold text-[#717970] uppercase">Délai Moyen de Livraison</div>
          <div className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700] mt-1">
            24 Heures
          </div>
          <div className="text-[11px] text-[#164525] font-semibold mt-1">Post-récolte immédiate</div>
        </div>

        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-5 shadow-xs">
          <div className="text-[12px] font-bold text-[#717970] uppercase">Taux de Réachat B2B</div>
          <div className="font-['Montserrat'] text-[22px] font-bold text-[#2b1700] mt-1">
            87.5 %
          </div>
          <div className="text-[11px] text-[#164525] font-semibold mt-1">Clients récurrents (restaurants)</div>
        </div>
      </div>

      {/* Graphiques principaux */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution Volume Ventes et Commissions */}
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div>
            <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
              Croissance du Volume des Ventes (FCFA)
            </h3>
            <p className="text-[12px] text-[#717970]">
              Volume mensuel brut d'échanges agricoles contractualisés
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fill: '#717970', fontSize: 12 }} />
                <YAxis
                  tick={{ fill: '#717970', fontSize: 11 }}
                  tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString('fr-FR')} FCFA`, 'Ventes']}
                  contentStyle={{
                    backgroundColor: '#FAF8F2',
                    borderRadius: '12px',
                    border: '1px solid #c1c9be',
                  }}
                />
                <Bar dataKey="ventes" fill="#164525" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Évolution des Précommandes & Commissions */}
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div>
            <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
              Commissions Plateforme Agri-Link (5%)
            </h3>
            <p className="text-[12px] text-[#717970]">
              Revenus générés par le modèle de commissionnement sécurisé
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mois" tick={{ fill: '#717970', fontSize: 12 }} />
                <YAxis
                  tick={{ fill: '#717970', fontSize: 11 }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`${Number(val).toLocaleString('fr-FR')} FCFA`, 'Commission']}
                  contentStyle={{
                    backgroundColor: '#FAF8F2',
                    borderRadius: '12px',
                    border: '1px solid #c1c9be',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="commissions"
                  stroke="#e76f51"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#e76f51' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Répartition par catégorie & Carte des bassins de production */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition des Ventes par Produit */}
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div>
            <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
              Répartition des Ventes par Filière
            </h3>
            <p className="text-[12px] text-[#717970]">
              Parts de marché des différentes récoltes vendues
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-48 w-48 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: any) => [`${val}%`, 'Part']}
                    contentStyle={{
                      backgroundColor: '#FAF8F2',
                      borderRadius: '8px',
                      border: '1px solid #c1c9be',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-2 w-full text-[13px]">
              {categoryDistribution.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }}></span>
                    <span className="text-[#2b1700] font-medium">{cat.name}</span>
                  </div>
                  <span className="font-bold text-[#2b1700]">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bassins de Production */}
        <div className="bg-white border border-[#c1c9be]/60 rounded-2xl p-6 shadow-xs flex flex-col gap-4">
          <div>
            <h3 className="font-['Montserrat'] text-[16px] font-bold text-[#2b1700]">
              Origine Régionale des Producteurs
            </h3>
            <p className="text-[12px] text-[#717970]">
              Concentration géographique des exploitations partenaires
            </p>
          </div>

          <div className="space-y-3">
            {regionalData.map((reg, idx) => (
              <div key={idx} className="p-3 bg-[#FAF8F2] rounded-xl border border-[#c1c9be]/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#164525] text-[20px]">pin_drop</span>
                  <div>
                    <div className="font-bold text-[#2b1700] text-[13px]">{reg.region}</div>
                    <div className="text-[11px] text-[#717970]">{reg.producteurs} exploitations certifiées</div>
                  </div>
                </div>
                <span className="font-bold text-[#164525] text-[14px]">{reg.part}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
