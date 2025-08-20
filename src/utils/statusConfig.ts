import { StatusConfig } from '../types/client';

export const getStatusConfig = (status: string): StatusConfig => {
  const configs: Record<string, StatusConfig> = {
    not_contacted: {
      label: 'Não Contatado',
      color: '#6B7280',
      bgColor: 'bg-gray-100',
      icon: 'clock',
    },
    contacted: {
      label: 'Contatado',
      color: '#3B82F6',
      bgColor: 'bg-blue-100',
      icon: 'message-circle',
    },
    responded: {
      label: 'Respondeu',
      color: '#10B981',
      bgColor: 'bg-green-100',
      icon: 'check-circle',
    },
    proposal_sent: {
      label: 'Proposta Enviada',
      color: '#F59E0B',
      bgColor: 'bg-yellow-100',
      icon: 'dollar-sign',
    },
    closed: {
      label: 'Fechado',
      color: '#059669',
      bgColor: 'bg-emerald-100',
      icon: 'check-circle',
    },
    rejected: {
      label: 'Recusado',
      color: '#DC2626',
      bgColor: 'bg-red-100',
      icon: 'x-circle',
    },
  };

  return configs[status] || configs.not_contacted;
};