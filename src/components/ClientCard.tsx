import React from 'react';
import { ExternalLink, User } from 'lucide-react';
import { Client } from '../types/client';
import { getStatusConfig } from '../utils/statusConfig';

interface ClientCardProps {
  client: Client;
  onClick: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onClick }) => {
  const statusConfig = getStatusConfig(client.status);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 cursor-pointer border-l-4"
      style={{ borderLeftColor: statusConfig.color }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor}`}
          style={{ color: statusConfig.color }}
        >
          {statusConfig.label}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <ExternalLink className="w-4 h-4" />
          <span>Links disponíveis</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {client.ifoodLink && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-red-100 text-red-800 text-xs">
              iFood
            </span>
          )}
          {client.googleLink && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-green-100 text-green-800 text-xs">
              Google
            </span>
          )}
          {client.instagram && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-purple-100 text-purple-800 text-xs">
              Instagram
            </span>
          )}
          {client.whatsapp && (
            <span className="inline-flex items-center px-2 py-1 rounded bg-teal-100 text-teal-800 text-xs">
              WhatsApp
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Criado em {new Date(client.createdAt).toLocaleDateString('pt-BR')}
      </div>
    </div>
  );
};