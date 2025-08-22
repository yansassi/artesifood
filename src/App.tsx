import React, { useState } from 'react';
import { Plus, Users, Search, CheckCircle, TrendingUp, Download, Upload, ExternalLink, Camera, DollarSign, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Client } from './types/client';
import { ClientFormModal } from './components/ClientFormModal';
import { ClientDetails } from './components/ClientDetails';
import { useClients } from './hooks/useClients';
import { getStatusConfig } from './utils/statusConfig';

function App() {
  const { clients, addClient, updateClient, deleteClient, exportClients, importClients } = useClients();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterInterestLevel, setFilterInterestLevel] = useState<string>('all');
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 50;

  const filteredClients = clients.filter(client =>
    (client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     (/\d/.test(searchTerm) && (client.whatsapp || '').replace(/\D/g, '').includes(searchTerm.replace(/\D/g, '')))) &&
    (filterStatus === 'all' || client.status === filterStatus) &&
    (filterInterestLevel === 'all' || 
     (filterInterestLevel === 'unrated' && (!client.interestLevel || client.interestLevel === 0)) ||
     (filterInterestLevel !== 'unrated' && client.interestLevel === parseInt(filterInterestLevel)))
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
  const startIndex = (currentPage - 1) * clientsPerPage;
  const endIndex = startIndex + clientsPerPage;
  const currentClients = filteredClients.slice(startIndex, endIndex);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterInterestLevel]);

  const stats = {
    total: clients.length,
    contacted: clients.filter(c => ['contacted', 'responded', 'proposal_sent', 'closed'].includes(c.status)).length,
    closed: clients.filter(c => c.status === 'closed').length,
    totalRevenue: clients
      .filter(c => c.status === 'closed')
      .reduce((sum, client) => sum + (client.value || 0), 0),
    statusPercentages: {
      not_contacted: clients.length > 0 ? (clients.filter(c => c.status === 'not_contacted').length / clients.length) * 100 : 0,
      contacted: clients.length > 0 ? (clients.filter(c => c.status === 'contacted').length / clients.length) * 100 : 0,
      responded: clients.length > 0 ? (clients.filter(c => c.status === 'responded').length / clients.length) * 100 : 0,
      proposal_sent: clients.length > 0 ? (clients.filter(c => c.status === 'proposal_sent').length / clients.length) * 100 : 0,
      closed: clients.length > 0 ? (clients.filter(c => c.status === 'closed').length / clients.length) * 100 : 0,
      rejected: clients.length > 0 ? (clients.filter(c => c.status === 'rejected').length / clients.length) * 100 : 0,
    },
    statusCounts: {
      not_contacted: clients.filter(c => c.status === 'not_contacted').length,
      contacted: clients.filter(c => c.status === 'contacted').length,
      responded: clients.filter(c => c.status === 'responded').length,
      proposal_sent: clients.filter(c => c.status === 'proposal_sent').length,
      closed: clients.filter(c => c.status === 'closed').length,
      rejected: clients.filter(c => c.status === 'rejected').length,
    },
    interestLevelPercentages: {
      unrated: clients.length > 0 ? (clients.filter(c => !c.interestLevel || c.interestLevel === 0).length / clients.length) * 100 : 0,
      level1: clients.length > 0 ? (clients.filter(c => c.interestLevel === 1).length / clients.length) * 100 : 0,
      level2: clients.length > 0 ? (clients.filter(c => c.interestLevel === 2).length / clients.length) * 100 : 0,
      level3: clients.length > 0 ? (clients.filter(c => c.interestLevel === 3).length / clients.length) * 100 : 0,
      level4: clients.length > 0 ? (clients.filter(c => c.interestLevel === 4).length / clients.length) * 100 : 0,
      level5: clients.length > 0 ? (clients.filter(c => c.interestLevel === 5).length / clients.length) * 100 : 0,
    },
    interestLevelCounts: {
      unrated: clients.filter(c => !c.interestLevel || c.interestLevel === 0).length,
      level1: clients.filter(c => c.interestLevel === 1).length,
      level2: clients.filter(c => c.interestLevel === 2).length,
      level3: clients.filter(c => c.interestLevel === 3).length,
      level4: clients.filter(c => c.interestLevel === 4).length,
      level5: clients.filter(c => c.interestLevel === 5).length,
    },
  };

  const handleAddClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    addClient(clientData);
    setIsModalOpen(false);
  };

  const handleSaveClient = (clientData: Omit<Client, 'createdAt' | 'updatedAt'> & { id?: string }) => {
    if (clientData.id) {
      // Editing existing client
      updateClient({
        ...clientData as Client,
        updatedAt: new Date(),
      });
    } else {
      // Adding new client
      addClient(clientData);
    }
    setIsModalOpen(false);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const result = await importClients(file);
    if (result.success) {
      setImportMessage(result.message || `${result.count} clientes importados com sucesso!`);
      setTimeout(() => setImportMessage(null), 3000);
    } else {
      setImportMessage(`Erro: ${result.error}`);
      setTimeout(() => setImportMessage(null), 3000);
    }

    // Reset file input
    event.target.value = '';
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  if (selectedClient) {
    return (
      <ClientDetails
        client={selectedClient}
        onBack={() => setSelectedClient(null)}
        onUpdateClient={(updatedClient) => {
          updateClient(updatedClient);
          setSelectedClient(updatedClient);
        }}
        onDeleteClient={(clientId) => {
          deleteClient(clientId);
          setSelectedClient(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-lg">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Gerenciador de Clientes iFood
                </h1>
                <p className="text-gray-600">
                  Gerencie seus clientes e acompanhe o progresso dos projetos
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportClients}
                  className="flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
                
                <label className="flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-md cursor-pointer">
                  <Upload className="w-4 h-4" />
                  <span>Importar</span>
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
              
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span>Adicionar Cliente</span>
              </button>
            </div>
          </div>
          
          {importMessage && (
            <div className={`mt-4 p-3 rounded-lg ${
              importMessage.includes('Erro') 
                ? 'bg-red-100 text-red-700 border border-red-200' 
                : 'bg-green-100 text-green-700 border border-green-200'
            }`}>
              {importMessage}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-gray-600">Total de Clientes</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-3 rounded-full">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.contacted}</p>
                <p className="text-gray-600">Em Progresso</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.closed}</p>
                <p className="text-gray-600">Projetos Fechados</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-100 p-3 rounded-full">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-gray-600">Faturamento Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        {clients.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribuição por Status</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Não Contatado</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {stats.statusCounts.not_contacted}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.statusPercentages.not_contacted.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-600">Contatado</span>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {stats.statusCounts.contacted}
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {stats.statusPercentages.contacted.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-600">Respondeu</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {stats.statusCounts.responded}
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {stats.statusPercentages.responded.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-yellow-600">Proposta Enviada</span>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    {stats.statusCounts.proposal_sent}
                  </span>
                </div>
                <div className="text-2xl font-bold text-yellow-900">
                  {stats.statusPercentages.proposal_sent.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-emerald-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-emerald-600">Fechado</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                    {stats.statusCounts.closed}
                  </span>
                </div>
                <div className="text-2xl font-bold text-emerald-900">
                  {stats.statusPercentages.closed.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-600">Recusado</span>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {stats.statusCounts.rejected}
                  </span>
                </div>
                <div className="text-2xl font-bold text-red-900">
                  {stats.statusPercentages.rejected.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interest Level Breakdown */}
        {clients.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribuição por Nível de Interesse</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-gray-400">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Sem Avaliação</span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                    {stats.interestLevelCounts.unrated}
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.interestLevelPercentages.unrated.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-red-400">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-red-600">1 Estrela</span>
                    <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                    {stats.interestLevelCounts.level1}
                  </span>
                </div>
                <div className="text-2xl font-bold text-red-900">
                  {stats.interestLevelPercentages.level1.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-orange-400">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-orange-600">2 Estrelas</span>
                    <div className="flex">
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                    </div>
                  </div>
                  <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                    {stats.interestLevelCounts.level2}
                  </span>
                </div>
                <div className="text-2xl font-bold text-orange-900">
                  {stats.interestLevelPercentages.level2.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-yellow-600">3 Estrelas</span>
                    <div className="flex">
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                    </div>
                  </div>
                  <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                    {stats.interestLevelCounts.level3}
                  </span>
                </div>
                <div className="text-2xl font-bold text-yellow-900">
                  {stats.interestLevelPercentages.level3.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-400">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-blue-600">4 Estrelas</span>
                    <div className="flex">
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {stats.interestLevelCounts.level4}
                  </span>
                </div>
                <div className="text-2xl font-bold text-blue-900">
                  {stats.interestLevelPercentages.level4.toFixed(1)}%
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-400">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-medium text-green-600">5 Estrelas</span>
                    <div className="flex">
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                      <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {stats.interestLevelCounts.level5}
                  </span>
                </div>
                <div className="text-2xl font-bold text-green-900">
                  {stats.interestLevelPercentages.level5.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou WhatsApp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="min-w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos os Status</option>
              <option value="not_contacted">Não Contatado</option>
              <option value="contacted">Contatado</option>
              <option value="responded">Respondeu</option>
              <option value="proposal_sent">Proposta Enviada</option>
              <option value="closed">Fechado</option>
              <option value="rejected">Recusado</option>
            </select>
          </div>
          
          <div className="min-w-48">
            <select
              value={filterInterestLevel}
              onChange={(e) => setFilterInterestLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos os Níveis</option>
              <option value="unrated">Sem Avaliação</option>
              <option value="1">1 Estrela</option>
              <option value="2">2 Estrelas</option>
              <option value="3">3 Estrelas</option>
              <option value="4">4 Estrelas</option>
              <option value="5">5 Estrelas</option>
            </select>
          </div>
        </div>

        {/* Results info */}
        {filteredClients.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Mostrando {startIndex + 1}-{Math.min(endIndex, filteredClients.length)} de {filteredClients.length} clientes
          </div>
        )}

        {/* Client Table */}
        {currentClients.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {clients.length === 0 ? 'Nenhum cliente cadastrado' : 'Nenhum cliente encontrado'}
            </h3>
            <p className="text-gray-600 mb-6">
              {clients.length === 0 
                ? 'Comece adicionando seu primeiro cliente para começar a gerenciar seus projetos.'
                : 'Tente ajustar sua busca ou adicionar um novo cliente.'
              }
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md mx-auto"
            >
              <Plus className="w-5 h-5" />
              <span>Adicionar Primeiro Cliente</span>
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        iFood
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Google
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instagram
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        WhatsApp
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Observações
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Criado Em
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentClients.map((client) => {
                      const statusConfig = getStatusConfig(client.status);
                      return (
                        <tr
                          key={client.id}
                          onClick={() => setSelectedClient(client)}
                          className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {client.ifoodLink ? (
                              <a
                                href={client.ifoodLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span className="text-xs">Link</span>
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {client.googleLink ? (
                              <a
                                href={client.googleLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span className="text-xs">Link</span>
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {client.instagram ? (
                              <a
                                href={client.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span className="text-xs">Link</span>
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {client.whatsapp ? (
                              <a
                                href={`https://wa.me/${(() => {
                                  const cleanNumber = (client.whatsapp || '').replace(/\D/g, '');
                                  return cleanNumber.startsWith('55') ? cleanNumber : `55${cleanNumber}`;
                                })()}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center space-x-1 text-teal-600 hover:text-teal-700 transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span className="text-xs">Link</span>
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.bgColor}`}
                              style={{ color: statusConfig.color }}
                            >
                              {statusConfig.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900 max-w-xs truncate">
                              {client.notes || '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Próximo
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Página <span className="font-medium">{currentPage}</span> de{' '}
                      <span className="font-medium">{totalPages}</span>
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      
                      {getPageNumbers().map((page, index) => (
                        <React.Fragment key={index}>
                          {page === '...' ? (
                            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          ) : (
                            <button
                              onClick={() => handlePageChange(page as number)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === page
                                  ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                  : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )}
                        </React.Fragment>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClient}
      />
    </div>
  );
}

export default App;