import { useState, useEffect } from 'react';
import { Client } from '../types/client';

const STORAGE_KEY = 'ifood_clients';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);

  // Load clients from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsedClients = JSON.parse(stored).map((client: any) => ({
          ...client,
          createdAt: new Date(client.createdAt),
          updatedAt: new Date(client.updatedAt),
        }));
        setClients(parsedClients);
      } catch (error) {
        console.error('Error loading clients:', error);
      }
    }
  }, []);

  // Save clients to localStorage whenever clients change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
  }, [clients]);

  const addClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setClients(prev => [newClient, ...prev]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev =>
      prev.map(client =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
  };

  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(client => client.id !== clientId));
  };

  const exportClients = () => {
    const dataStr = JSON.stringify(clients, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clientes-ifood-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importClients = async (file: File) => {
    try {
      const text = await file.text();
      const importedClients = JSON.parse(text);
      
      // Validate and convert dates
      const validatedClients = importedClients.map((client: any) => ({
        ...client,
        createdAt: new Date(client.createdAt),
        updatedAt: new Date(client.updatedAt),
        // Ensure all required fields exist
        instagram: client.instagram || '',
      }));
      
      setClients(validatedClients);
      return { success: true, count: validatedClients.length };
    } catch (error) {
      console.error('Error importing clients:', error);
      return { success: false, error: 'Arquivo inválido ou corrompido' };
    }
  };

  return {
    clients,
    addClient,
    updateClient,
    deleteClient,
    exportClients,
    importClients,
  };
};