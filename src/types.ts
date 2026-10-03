export interface Lead {
  id: string;
  name: string;
  phone: string;
  serviceType: 'residencial' | 'comercial' | 'emergencia' | 'predial';
  city?: string;
  createdAt: string;
  status: 'novo' | 'em_atendimento' | 'orcamento_enviado' | 'concluido';
  notes?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  category: 'instalacao' | 'manutencao' | 'emergencia' | 'laudos';
  shortDesc: string;
  fullDesc: string;
  startingPrice: number;
  unit: string;
  timeEstimate: string;
  popular?: boolean;
  features: string[];
}

export interface EstimateSelection {
  serviceId: string;
  quantity: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  location: string;
  rating: number;
  comment: string;
  serviceProvided: string;
  date: string;
}
