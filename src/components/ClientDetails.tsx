import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Edit3, Save, Calendar, MessageCircle, CheckCircle, X, Clock, DollarSign, XCircle, User, Phone, Instagram } from 'lucide-react';
import { Client } from '../types/client';
import { getStatusConfig } from '../utils/statusConfig';
import { ClientFormModal } from './ClientFormModal';

interface ClientDetailsProps {
  client: Client;
  onBack: () => void;
  onUpdateClient: (updatedClient: Client) => void;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({
  client,
  onBack,
  onUpdateClient,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState(client.notes);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const statusConfig = getStatusConfig(client.status);

  const statusOptions = [
    { value: 'not_contacted', label: 'Não Contatado', icon: Clock, color: '#6B7280' },
    { value: 'contacted', label: 'Contatado', icon: MessageCircle, color: '#3B82F6' },
    { value: 'responded', label: 'Respondeu', icon: CheckCircle, color: '#10B981' },
    { value: 'proposal_sent', label: 'Proposta Enviada', icon: DollarSign, color: '#F59E0B' },
    { value: 'closed', label: 'Fechado', icon: CheckCircle, color: '#059669' },
    { value: 'rejected', label: 'Recusado', icon: XCircle, color: '#DC2626' },
  ];

  const handleStatusChange = (newStatus: Client['status']) => {
    onUpdateClient({
      ...client,
      status: newStatus,
      updatedAt: new Date(),
    });
  };

  const handleSaveNotes = () => {
    onUpdateClient({
      ...client,
      notes,
      updatedAt: new Date(),
    });
    setIsEditing(false);
  };

  const handleOpenLink = (url: string) => {
    window.open(url, '_blank');
  };

  const handleOpenWhatsApp = (whatsapp: string) => {
    // Remove any non-digit characters and format for WhatsApp
    const cleanNumber = whatsapp.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/${cleanNumber}`;
    window.open(whatsappUrl, '_blank');
  };
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-gray-900">{client.name}</h1>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="flex items-center space-x-2 px-3 py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Editar</span>
              </button>
            </div>
            <div
              className={`px-4 py-2 rounded-full text-sm font-medium ${statusConfig.bgColor}`}
              style={{ color: statusConfig.color }}
            >
              {statusConfig.label}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Links</h3>
                <div className="space-y-3">
                  {client.ifoodLink && (
                    <button
                      onClick={() => handleOpenLink(client.ifoodLink)}
                      className="flex items-center space-x-3 w-full p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <div className="bg-red-500 p-2 rounded-full">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">iFood</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {client.ifoodLink}
                        </div>
                      </div>
                    </button>
                  )}
                  
                  {client.googleLink && (
                    <button
                      onClick={() => handleOpenLink(client.googleLink)}
                      className="flex items-center space-x-3 w-full p-3 border border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <div className="bg-green-500 p-2 rounded-full">
                        <ExternalLink className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Google</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {client.googleLink}
                        </div>
                      </div>
                    </button>
                  )}
                  
                  {client.instagram && (
                    <button
                      onClick={() => handleOpenLink(client.instagram)}
                      className="flex items-center space-x-3 w-full p-3 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                    >
                      <div className="bg-purple-500 p-2 rounded-full">
                        <Instagram className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">Instagram</div>
                        <div className="text-sm text-gray-600 truncate max-w-xs">
                          {client.instagram}
                        </div>
                      </div>
                    </button>
                  )}
                  
                  {client.whatsapp && (
                    <button
                      onClick={() => handleOpenWhatsApp(client.whatsapp)}
                      className="flex items-center space-x-3 w-full p-3 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors"
                    >
                      <div className="bg-teal-500 p-2 rounded-full">
                        <MessageCircle className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">WhatsApp</div>
                        <div className="text-sm text-gray-600">
                          {client.whatsapp}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Criado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Edit3 className="w-4 h-4" />
                    <span>Atualizado em {new Date(client.updatedAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status do Progresso</h3>
                <div className="space-y-2">
                  {statusOptions.map((option) => {
                    const Icon = option.icon;
                    const isActive = client.status === option.value;
                    
                    return (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value as Client['status'])}
                        className={`flex items-center space-x-3 w-full p-3 rounded-lg border-2 transition-all ${
                          isActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: isActive ? option.color : '#6B7280' }}
                        />
                        <span className={`font-medium ${
                          isActive ? 'text-blue-900' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">Observações</h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Editar</span>
                    </button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Adicione observações sobre o cliente..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveNotes}
                        className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        <span>Salvar</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setNotes(client.notes);
                        }}
                        className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancelar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700">
                      {client.notes || 'Nenhuma observação adicionada ainda.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ClientFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={(clientData) => {
          onUpdateClient({
            ...clientData as Client,
            updatedAt: new Date(),
          });
          setIsEditModalOpen(false);
        }}
        clientToEdit={client}
      />
    </div>
  );
};