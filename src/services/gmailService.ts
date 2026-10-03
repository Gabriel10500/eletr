import { Lead } from '../types';
import { getAccessToken, googleSignIn } from './googleAuth';

export const ADMIN_NOTIFICATION_EMAIL = 'souzagabriel460@gmail.com';

/**
 * Creates RFC 2822 raw message base64url encoded for Gmail API
 */
function createRawEmail(to: string, subject: string, bodyText: string): string {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const messageParts = [
    `To: ${to}`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${utf8Subject}`,
    '',
    bodyText,
  ];
  const message = messageParts.join('\r\n');

  // Convert to base64url format
  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends an email notification to the electrician/admin (souzagabriel460@gmail.com)
 * with the full lead information captured on the site.
 */
export async function sendLeadNotificationEmail(
  lead: Lead,
  existingToken?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    let token = existingToken || (await getAccessToken());

    if (!token) {
      // Need user interaction to get token
      const authResult = await googleSignIn();
      token = authResult?.accessToken || null;
    }

    if (!token) {
      throw new Error('Não foi possível obter a autorização do Gmail.');
    }

    const serviceName =
      lead.serviceType === 'emergencia'
        ? '🚨 EMERGÊNCIA ELÉTRICA 24H'
        : lead.serviceType === 'residencial'
        ? 'Residencial (Casa / Apto)'
        : lead.serviceType === 'comercial'
        ? 'Comercial / Empresa'
        : 'Predial / Condomínio';

    const formattedDate = new Date(lead.createdAt).toLocaleString('pt-BR');
    const cleanPhone = lead.phone.replace(/\D/g, '');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
        <div style="background: #f59e0b; padding: 20px; text-align: center; color: #020617;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 800;">⚡ VoltPro Elétrica - Novo Cliente Cadastrado</h1>
          <p style="margin: 4px 0 0 0; font-size: 14px; font-weight: 600;">Notificação de Lead Recebida pelo Site</p>
        </div>
        <div style="padding: 24px;">
          <div style="background: #1e293b; padding: 18px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0 0 8px 0; font-size: 15px;"><strong style="color: #94a3b8;">Nome do Cliente:</strong> <span style="font-size: 18px; color: #ffffff; font-weight: bold;">${lead.name}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 15px;"><strong style="color: #94a3b8;">WhatsApp / Telefone:</strong> <span style="color: #38bdf8; font-weight: bold; font-family: monospace;">${lead.phone}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 15px;"><strong style="color: #94a3b8;">Tipo de Serviço:</strong> <span style="color: #fbbf24; font-weight: bold;">${serviceName}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 15px;"><strong style="color: #94a3b8;">Cidade / Região:</strong> <span style="color: #ffffff;">${lead.city || 'São Paulo - SP'}</span></p>
            <p style="margin: 0 0 8px 0; font-size: 15px;"><strong style="color: #94a3b8;">Data/Horário:</strong> <span style="color: #cbd5e1;">${formattedDate}</span></p>
            ${
              lead.notes
                ? `<div style="margin-top: 12px; padding: 10px; background: #090d16; border-radius: 6px; font-size: 14px; color: #e2e8f0;"><strong style="color: #fbbf24;">Detalhes/Demanda:</strong> ${lead.notes}</div>`
                : ''
            }
          </div>

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://wa.me/55${cleanPhone}?text=Ol%C3%A1%2C%20${encodeURIComponent(lead.name)}!%20Recebi%20seu%20contato%20pelo%20site%20da%20VoltPro%20El%C3%A9trica.%20Como%20posso%20lhe%20atender%20hoje%3F" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 15px; margin-right: 10px;">
              💬 Responder no WhatsApp
            </a>
            <a href="tel:${cleanPhone}" style="display: inline-block; background: #334155; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: bold; font-size: 15px;">
              📞 Ligar para Cliente
            </a>
          </div>

          <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 24px;">
            Este e-mail foi gerado automaticamente e enviado para <strong>${ADMIN_NOTIFICATION_EMAIL}</strong> pela plataforma VoltPro Elétrica.
          </p>
        </div>
      </div>
    `;

    const raw = createRawEmail(
      ADMIN_NOTIFICATION_EMAIL,
      `[Novo Lead VoltPro] ${lead.name} - ${serviceName}`,
      htmlBody
    );

    const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error('Gmail API Error:', errData);
      throw new Error(errData?.error?.message || `Erro ao enviar email (${res.status})`);
    }

    return { success: true };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Erro ao despachar notificação por e-mail';
    console.error('Falha no envio de e-mail:', errorMsg);
    return { success: false, error: errorMsg };
  }
}
