import React, { useState, useEffect } from 'react';
import { X, Save, Link, User, MessageCircle, Instagram, DollarSign } from 'lucide-react';
import { Client } from '../types/client';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (clientData: Omit<Client, 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  clientToEdit?: Client;
}

export const ClientFormModal: React.FC<ClientFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  clientToEdit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    ifoodLink: '',
    googleLink: '',
    instagram: '',
    whatsapp: '',
    notes: '',
    value: '',
  });

  // Initialize form data when modal opens or clientToEdit changes
  useEffect(() => {
    if (clientToEdit) {
      setFormData({
        name: clientToEdit.name,
        ifoodLink: clientToEdit.ifoodLink,
        googleLink: clientToEdit.googleLink,
        instagram: clientToEdit.instagram,
        whatsapp: clientToEdit.whatsapp,
        notes: clientToEdit.notes,
        value: clientToEdit.value?.toString() || '',
      });
    } else {
      setFormData({
        name: '',
        ifoodLink: '',
        googleLink: '',
        instagram: '',
        whatsapp: '',
        notes: '',
        value: '',
      });
    }
  }, [clientToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const clientData = {
      ...formData,
      value: formData.value ? parseFloat(formData.value) : undefined,
      status: clientToEdit?.status || ('not_contacted' as const),
      ...(clientToEdit && { id: clientToEdit.id }),
    };

    onSave(clientData);

    // Reset form only if adding new client
    if (!clientToEdit) {
      setFormData({
        name: '',
        ifoodLink: '',
        googleLink: '',
        instagram: '',
        whatsapp: '',
        notes: '',
        value: '',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!isOpen) return null;

  const isEditing = !!clientToEdit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>{isEditing ? 'Editar Cliente' : 'Adicionar Cliente'}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do Cliente *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nome do restaurante ou estabelecimento"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Link className="w-4 h-4 inline mr-1" />
              Link do iFood
            </label>
            <input
              type="url"
              name="ifoodLink"
              value={formData.ifoodLink}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.ifood.com.br/delivery/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Link className="w-4 h-4 inline mr-1" />
              Link do Google
            </label>
            <input
              type="url"
              name="googleLink"
              value={formData.googleLink}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.google.com/maps/place/..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <Instagram className="w-4 h-4 inline mr-1" />
              Instagram
            </label>
            <input
              type="url"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://www.instagram.com/usuario"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <MessageCircle className="w-4 h-4 inline mr-1" />
              WhatsApp
            </label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5511987654321 (com DDD e código do país)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <DollarSign className="w-4 h-4 inline mr-1" />
              Valor do Projeto (R$)
            </label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0,00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Observações
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Informações adicionais sobre o cliente..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Atualizar' : 'Salvar'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};