export interface Client {
  id: string;
  name: string;
  ifoodLink: string;
  googleLink: string;
  whatsapp: string;
  status: 'not_contacted' | 'contacted' | 'responded' | 'proposal_sent' | 'closed' | 'rejected';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}