import { useState, useEffect } from 'react';
import { Client } from '../types';
import { INITIAL_CLIENTS } from '../data/initialData';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [activeClient, setActiveClient] = useState<Client | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('s_clientes');
    if (saved) {
      try {
        setClients(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved clients');
      }
    } else {
      setClients(INITIAL_CLIENTS);
      localStorage.setItem('s_clientes', JSON.stringify(INITIAL_CLIENTS));
    }
  }, []);

  const saveClientsToStorage = (updatedList: Client[]) => {
    setClients(updatedList);
    localStorage.setItem('s_clientes', JSON.stringify(updatedList));
  };

  const handleSaveClient = (client: Client) => {
    const exists = clients.some(c => c.id === client.id);
    const updatedList = exists
      ? clients.map(c => (c.id === client.id ? client : c))
      : [client, ...clients];

    saveClientsToStorage(updatedList);
    setActiveClient(null);
  };

  const handleDeleteClient = (id: string) => {
    const updatedList = clients.filter(c => c.id !== id);
    saveClientsToStorage(updatedList);
    setActiveClient(null);
  };

  const handleExportClients = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(clients, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "clientes_export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return {
    clients,
    activeClient,
    setActiveClient,
    handleSaveClient,
    handleDeleteClient,
    handleExportClients
  };
}