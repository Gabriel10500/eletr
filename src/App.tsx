/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Lead, ServiceItem } from './types';
import { GateModal } from './components/GateModal';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesBento } from './components/ServicesBento';
import { ServiceEstimator } from './components/ServiceEstimator';
import { EmergencySection } from './components/EmergencySection';
import { SafetyStandards } from './components/SafetyStandards';
import { Testimonials } from './components/Testimonials';
import { BookingForm } from './components/BookingForm';
import { LeadsManagerModal } from './components/LeadsManagerModal';
import { Footer } from './components/Footer';
import { FloatingWhatsAppButton } from './components/FloatingWhatsAppButton';
import { sendLeadNotificationEmail, ADMIN_NOTIFICATION_EMAIL } from './services/gmailService';
import { appendLeadToSheet } from './services/sheetsService';
import { saveLeadToCloud, deleteLeadFromCloud, subscribeToCloudLeads } from './services/cloudLeadService';
import { initAuth, googleSignIn } from './services/googleAuth';

const INITIAL_MOCK_LEADS: Lead[] = [
  {
    id: 'lead_seed_1',
    name: 'Carlos Alberto',
    phone: '(11) 97120-4320',
    serviceType: 'residencial',
    city: 'São Paulo - SP',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'em_atendimento',
    notes: 'Precisa trocar disjuntores do quadro principal e instalar chuveiro.',
  },
  {
    id: 'lead_seed_2',
    name: 'Fernanda Martins',
    phone: '(11) 97455-8812',
    serviceType: 'emergencia',
    city: 'Santo André - SP',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'orcamento_enviado',
    notes: 'Queda de energia no andar superior com faísca na tomada.',
  },
  {
    id: 'lead_seed_3',
    name: 'Rodrigo Alcantara',
    phone: '(11) 99312-4409',
    serviceType: 'comercial',
    city: 'Barueri - SP',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'concluido',
    notes: 'Instalação de Wallbox de 32A na garagem.',
  }
];

export default function App() {
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [isGateOpen, setIsGateOpen] = useState(false);
  const [isLeadsManagerOpen, setIsLeadsManagerOpen] = useState(false);

  // Initialize and load saved state from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('voltpro_current_lead');
      const savedLeads = localStorage.getItem('voltpro_leads_history');

      let parsedLeads: Lead[] = [];
      if (savedLeads) {
        try {
          parsedLeads = JSON.parse(savedLeads);
          parsedLeads = parsedLeads.filter(
            (l) => !l.phone.includes('98765') && !l.phone.includes('98124-7731')
          );
        } catch {
          parsedLeads = INITIAL_MOCK_LEADS;
        }
      } else {
        parsedLeads = INITIAL_MOCK_LEADS;
      }
      setAllLeads(parsedLeads);

      // Subscribe to Real-Time Cloud Leads from Firebase Firestore
      const unsubscribeCloud = subscribeToCloudLeads((cloudLeads) => {
        if (cloudLeads && cloudLeads.length > 0) {
          setAllLeads(cloudLeads);
          localStorage.setItem('voltpro_leads_history', JSON.stringify(cloudLeads));
        }
      });

      if (savedUser) {
        try {
          const userObj = JSON.parse(savedUser);
          if (userObj.phone && (userObj.phone.includes('98765') || userObj.phone.includes('98124-7731'))) {
            localStorage.removeItem('voltpro_current_lead');
            setCurrentLead(null);
            setIsGateOpen(true);
          } else {
            setCurrentLead(userObj);
            setIsGateOpen(false);
          }
        } catch {
          setIsGateOpen(true);
        }
      } else {
        setIsGateOpen(true);
      }

      return () => {
        unsubscribeCloud();
      };
    } catch {
      setIsGateOpen(true);
    }
  }, []);

  // When user finishes the gate identification
  const handleGateComplete = (lead: Lead) => {
    setCurrentLead(lead);
    setIsGateOpen(false);
    localStorage.setItem('voltpro_current_lead', JSON.stringify(lead));

    setAllLeads((prev) => {
      const existingIdx = prev.findIndex((l) => l.phone === lead.phone);
      let updated: Lead[];
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = { ...updated[existingIdx], ...lead };
      } else {
        updated = [lead, ...prev];
      }
      localStorage.setItem('voltpro_leads_history', JSON.stringify(updated));
      return updated;
    });

    // 1. Save directly into Cloud Firestore database (accessible from ANY device/browser)
    saveLeadToCloud(lead).catch((err) => {
      console.warn('Erro ao salvar lead na nuvem:', err);
    });

    // 2. Automatically send lead notification to souzagabriel460@gmail.com
    sendLeadNotificationEmail(lead).catch((err) => {
      console.warn('Envio em segundo plano para o Gmail aguardando autorização:', err);
    });

    // 3. Automatically append lead to Google Sheets
    appendLeadToSheet(lead).catch((err) => {
      console.warn('Sincronização com Google Sheets aguardando autorização:', err);
    });
  };

  const handleUpdateLeadStatus = (id: string, status: Lead['status']) => {
    let targetLead: Lead | undefined;
    setAllLeads((prev) => {
      const updated = prev.map((l) => {
        if (l.id === id) {
          targetLead = { ...l, status };
          return targetLead;
        }
        return l;
      });
      localStorage.setItem('voltpro_leads_history', JSON.stringify(updated));
      return updated;
    });

    if (targetLead) {
      saveLeadToCloud(targetLead).catch((err) => {
        console.warn('Erro ao atualizar lead na nuvem:', err);
      });
    }
  };

  const handleDeleteLead = (id: string) => {
    setAllLeads((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      localStorage.setItem('voltpro_leads_history', JSON.stringify(updated));
      return updated;
    });

    deleteLeadFromCloud(id).catch((err) => {
      console.warn('Erro ao excluir lead da nuvem:', err);
    });
  };

  const handleLeadUpdated = (updatedLead: Lead) => {
    setCurrentLead(updatedLead);
    localStorage.setItem('voltpro_current_lead', JSON.stringify(updatedLead));
    setAllLeads((prev) => {
      const updated = prev.map((l) => (l.id === updatedLead.id ? updatedLead : l));
      localStorage.setItem('voltpro_leads_history', JSON.stringify(updated));
      return updated;
    });

    // 1. Update in Cloud Firestore
    saveLeadToCloud(updatedLead).catch((err) => {
      console.warn('Erro ao atualizar na nuvem:', err);
    });

    // 2. Also send updated info to souzagabriel460@gmail.com
    sendLeadNotificationEmail(updatedLead).catch((err) => {
      console.warn('Atualização de lead para Gmail aguardando:', err);
    });

    // 3. Also sync updated lead to Google Sheets
    appendLeadToSheet(updatedLead).catch((err) => {
      console.warn('Sincronização com Google Sheets aguardando:', err);
    });
  };

  const handleSelectServiceForContact = (service: ServiceItem) => {
    const contactSection = document.getElementById('contato');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenBooking = () => {
    const contactSection = document.getElementById('contato');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* 
        The Gate Modal:
        "antes de entra a pesso coloca seu nome e numero"
        Displays automatically if the user hasn't identified themselves yet.
      */}
      <GateModal
        isOpen={isGateOpen}
        onComplete={handleGateComplete}
      />

      {/* Electrician Leads CRM Modal */}
      <LeadsManagerModal
        isOpen={isLeadsManagerOpen}
        onClose={() => setIsLeadsManagerOpen(false)}
        leads={allLeads}
        onUpdateStatus={handleUpdateLeadStatus}
        onDeleteLead={handleDeleteLead}
      />

      {/* Top Bar Contract Navigation */}
      <Navbar
        currentLead={currentLead}
        onOpenLeadsManager={() => setIsLeadsManagerOpen(true)}
        onEditLead={() => setIsGateOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        <Hero
          currentLead={currentLead}
          onOpenBooking={handleOpenBooking}
        />

        <ServicesBento
          currentLead={currentLead}
          onSelectServiceForContact={handleSelectServiceForContact}
        />

        <ServiceEstimator
          currentLead={currentLead}
          onOpenGateIfMissing={() => setIsGateOpen(true)}
        />

        <EmergencySection
          currentLead={currentLead}
        />

        <SafetyStandards />

        <Testimonials />

        <BookingForm
          currentLead={currentLead}
          onOpenGateIfMissing={() => setIsGateOpen(true)}
          onLeadUpdated={handleLeadUpdated}
        />
      </main>

      {/* Quiet Compliant Footer */}
      <Footer
        onOpenLeadsManager={() => setIsLeadsManagerOpen(true)}
      />

      {/* Floating Fast WhatsApp Action */}
      <FloatingWhatsAppButton currentLead={currentLead} />
    </div>
  );
}
