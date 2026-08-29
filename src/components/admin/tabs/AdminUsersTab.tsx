import React, { useState } from 'react';
import { AdminUser, UserRole, UserAccountStatus } from '../../../types';

interface AdminUsersTabProps {
  users: AdminUser[];
  onUpdateUserStatus: (userId: string, status: UserAccountStatus) => void;
  onAddUser?: (user: AdminUser) => void;
}

export const AdminUsersTab: React.FC<AdminUsersTabProps> = ({
  users = [],
  onUpdateUserStatus,
}) => {
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | UserAccountStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const safeUsers = users || [];

  const filteredUsers = safeUsers.filter((u) => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (statusFilter !== 'all' && u.statut !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = `${u.prenom} ${u.nom}`.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchTel = u.telephone.includes(q);
      const matchOrg = (u.organisation || '').toLowerCase().includes(q);
      return matchName || matchEmail || matchTel || matchOrg;
    }
    return true;
  });

  const countActifs = safeUsers.filter((u) => u.statut === 'Actif').length;
  const countAttente = safeUsers.filter((u) => u.statut === 'En attente').length;
  const countSuspendus = safeUsers.filter((u) => u.statut === 'Suspendu').length;

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Statistiques Rapides */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-['Montserrat'] text-[24px] font-bold text-[#2b1700]">
            Gestion des Utilisateurs
          </h1>
          <p className="text-[14px] text-[#717970]">
            Supervision et contrôle des comptes producteurs, acheteurs et administrateurs
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#164525]"></span>
            <span className="font-bold text-[#2b1700]">{countActifs}</span>
            <span className="text-[#717970]">Actifs</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e76f51]"></span>
            <span className="font-bold text-[#2b1700]">{countAttente}</span>
            <span className="text-[#717970]">En attente</span>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#c1c9be]/60 text-[13px]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c1c9be]"></span>
            <span className="font-bold text-[#2b1700]">{countSuspendus}</span>
            <span className="text-[#717970]">Suspendus</span>
          </div>
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
            placeholder="Rechercher par nom, email, téléphone..."
            className="w-full pl-10 pr-4 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Filtre Rôle */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les types ({safeUsers.length})</option>
            <option value="Producteur">Producteurs ({safeUsers.filter(u => u.role === 'Producteur').length})</option>
            <option value="Acheteur">Acheteurs ({safeUsers.filter(u => u.role === 'Acheteur').length})</option>
            <option value="Administrateur">Admins ({safeUsers.filter(u => u.role === 'Administrateur').length})</option>
          </select>

          {/* Filtre Statut */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-[#FAF8F2] border border-[#c1c9be] rounded-xl text-[13px] text-[#2b1700] focus:border-[#164525] focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les statuts</option>
            <option value="Actif">Actif</option>
            <option value="En attente">En attente</option>
            <option value="Suspendu">Suspendu</option>
          </select>
        </div>
      </div>

      {/* Tableau des Utilisateurs */}
      <div className="bg-white border border-[#c1c9be]/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#c1c9be]/60 text-[12px] font-bold text-[#717970] uppercase tracking-wider">
                <th className="py-3.5 px-4">Utilisateur & Organisation</th>
                <th className="py-3.5 px-4">Email</th>
                <th className="py-3.5 px-4">Téléphone</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">Date d'inscription</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c1c9be]/30 text-[13px]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#717970]">
                    <span className="material-symbols-outlined text-[36px] mb-2 text-[#717970]/60">person_off</span>
                    <p>Aucun utilisateur ne correspond à vos filtres.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#FAF8F2]/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#164525] text-white flex items-center justify-center font-bold text-[12px]">
                          {user.prenom.charAt(0)}{user.nom.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-[#2b1700]">{user.prenom} {user.nom}</div>
                          <div className="text-[11px] text-[#717970]">{user.organisation || user.localisation}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#414941]">{user.email}</td>
                    <td className="py-3.5 px-4 text-[#414941] font-mono text-[12px]">{user.telephone}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        user.role === 'Producteur' ? 'bg-[#164525]/10 text-[#164525]' :
                        user.role === 'Acheteur' ? 'bg-[#e07a5f]/15 text-[#b04a30]' :
                        'bg-[#3d5a80]/15 text-[#203a58]'
                      }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {user.role === 'Producteur' ? 'agriculture' : user.role === 'Acheteur' ? 'shopping_bag' : 'security'}
                        </span>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#717970]">{user.dateInscription}</td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        user.statut === 'Actif' ? 'bg-[#164525]/10 text-[#164525]' :
                        user.statut === 'En attente' ? 'bg-[#e76f51]/15 text-[#e76f51]' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          user.statut === 'Actif' ? 'bg-[#164525]' :
                          user.statut === 'En attente' ? 'bg-[#e76f51]' :
                          'bg-gray-400'
                        }`}></span>
                        {user.statut}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 text-[#414941] hover:text-[#164525] hover:bg-[#FAF8F2] rounded-lg transition-colors cursor-pointer"
                          title="Voir les détails"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        
                        {user.statut === 'Suspendu' || user.statut === 'En attente' ? (
                          <button
                            onClick={() => onUpdateUserStatus(user.id, 'Actif')}
                            className="px-2.5 py-1 bg-[#164525] text-white rounded-lg text-[11px] font-bold hover:bg-[#2f5d3a] transition-colors cursor-pointer"
                            title="Activer le compte"
                          >
                            Activer
                          </button>
                        ) : (
                          <button
                            onClick={() => onUpdateUserStatus(user.id, 'Suspendu')}
                            className="px-2.5 py-1 bg-[#FAF8F2] border border-[#c1c9be] text-[#717970] hover:text-[#b04a30] hover:border-[#b04a30] rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
                            title="Suspendre le compte"
                          >
                            Suspendre
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détail Utilisateur */}
      {selectedUser && (
        <div className="modal-backdrop">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#c1c9be] shadow-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-[#c1c9be]/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#164525] text-white flex items-center justify-center font-bold text-[14px]">
                  {selectedUser.prenom.charAt(0)}{selectedUser.nom.charAt(0)}
                </div>
                <div>
                  <h3 className="font-['Montserrat'] text-[18px] font-bold text-[#2b1700]">
                    {selectedUser.prenom} {selectedUser.nom}
                  </h3>
                  <span className="text-[12px] text-[#717970]">{selectedUser.role}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-[#717970] hover:bg-[#FAF8F2] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 space-y-3 text-[13px]">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Email</div>
                  <div className="font-semibold text-[#2b1700] break-all">{selectedUser.email}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Téléphone</div>
                  <div className="font-semibold text-[#2b1700]">{selectedUser.telephone}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] rounded-xl">
                <div className="text-[11px] text-[#717970]">Organisation / Exploitation</div>
                <div className="font-semibold text-[#2b1700]">{selectedUser.organisation || 'N/A'}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Localisation</div>
                  <div className="font-semibold text-[#2b1700]">{selectedUser.localisation}</div>
                </div>
                <div className="p-3 bg-[#FAF8F2] rounded-xl">
                  <div className="text-[11px] text-[#717970]">Date d'inscription</div>
                  <div className="font-semibold text-[#2b1700]">{selectedUser.dateInscription}</div>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F2] rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-[#717970]">Statut actuel du compte</div>
                  <div className="font-bold text-[#2b1700]">{selectedUser.statut}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onUpdateUserStatus(selectedUser.id, 'Actif');
                      setSelectedUser({ ...selectedUser, statut: 'Actif' });
                    }}
                    className="px-3 py-1 bg-[#164525] text-white rounded-lg text-[12px] font-bold hover:bg-[#2f5d3a] cursor-pointer"
                  >
                    Activer
                  </button>
                  <button
                    onClick={() => {
                      onUpdateUserStatus(selectedUser.id, 'Suspendu');
                      setSelectedUser({ ...selectedUser, statut: 'Suspendu' });
                    }}
                    className="px-3 py-1 bg-[#e76f51] text-white rounded-lg text-[12px] font-bold hover:bg-[#d65f42] cursor-pointer"
                  >
                    Suspendre
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#c1c9be]/40 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
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
