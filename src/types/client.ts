export interface Client {
  id: string;
  name: string;
  ifoodLink: string;
  googleLink: string;
  instagram: string;
  whatsapp: string;
  status: 'not_contacted' | 'contacted' | 'responded' | 'proposal_sent' | 'closed' | 'rejected';
  notes: string;
  paymentMethod?: string;
  value?: number;
  interestLevel?: number; // 1-5 scale
  createdAt: Date;
  updatedAt: Date;
}

export interface StatusConfig {
  label: string;
  color: string;
  bgColor: string;
  icon: string;
}