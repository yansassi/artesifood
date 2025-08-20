import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
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
    // Prepare data for Excel export
    const excelData = clients.map(client => ({
      'Nome': client.name,
      'Link iFood': client.ifoodLink,
      'Link Google': client.googleLink,
      'Instagram': client.instagram,
      'WhatsApp': client.whatsapp,
      'Status': getStatusLabel(client.status),
      'Observações': client.notes,
      'Criado em': new Date(client.createdAt).toLocaleDateString('pt-BR'),
      'Atualizado em': new Date(client.updatedAt).toLocaleDateString('pt-BR'),
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 25 }, // Nome
      { wch: 40 }, // Link iFood
      { wch: 40 }, // Link Google
      { wch: 30 }, // Instagram
      { wch: 15 }, // WhatsApp
      { wch: 15 }, // Status
      { wch: 50 }, // Observações
      { wch: 12 }, // Criado em
      { wch: 12 }, // Atualizado em
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Clientes');

    // Generate Excel file and download
    const fileName = `clientes-ifood-${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const importClients = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      
      // Get first worksheet
      const worksheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[worksheetName];
      
      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Map Excel data back to Client format
      const importedClients: Client[] = jsonData.map((row: any, index: number) => ({
        id: `imported-${Date.now()}-${index}`,
        name: row['Nome'] || '',
        ifoodLink: row['Link iFood'] || '',
        googleLink: row['Link Google'] || '',
        instagram: row['Instagram'] || '',
        whatsapp: row['WhatsApp'] || '',
        status: getStatusFromLabel(row['Status']) || 'not_contacted',
        notes: row['Observações'] || '',
        createdAt: parseExcelDate(row['Criado em']) || new Date(),
        updatedAt: parseExcelDate(row['Atualizado em']) || new Date(),
      }));
      
      setClients(importedClients);
      return { success: true, count: importedClients.length };
    } catch (error) {
      console.error('Error importing clients:', error);
      return { success: false, error: 'Arquivo Excel inválido ou corrompido' };
    }
  };

  // Helper function to get status label
  const getStatusLabel = (status: Client['status']): string => {
    const statusLabels: Record<Client['status'], string> = {
      not_contacted: 'Não Contatado',
      contacted: 'Contatado',
      responded: 'Respondeu',
      proposal_sent: 'Proposta Enviada',
      closed: 'Fechado',
      rejected: 'Recusado',
    };
    return statusLabels[status];
  };

  // Helper function to get status from label
  const getStatusFromLabel = (label: string): Client['status'] | null => {
    const labelToStatus: Record<string, Client['status']> = {
      'Não Contatado': 'not_contacted',
      'Contatado': 'contacted',
      'Respondeu': 'responded',
      'Proposta Enviada': 'proposal_sent',
      'Fechado': 'closed',
      'Recusado': 'rejected',
    };
    return labelToStatus[label] || null;
  };

  // Helper function to parse Excel date
  const parseExcelDate = (dateStr: string): Date | null => {
    if (!dateStr) return null;
    
    // Try to parse Brazilian date format (DD/MM/YYYY)
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    
    // Fallback to standard date parsing
    const parsed = new Date(dateStr);
    return isNaN(parsed.getTime()) ? null : parsed;
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