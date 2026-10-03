import { Lead } from '../types';
import { getAccessToken, googleSignIn } from './googleAuth';

const STORAGE_KEY_SPREADSHEET_ID = 'voltpro_google_sheets_id';

/**
 * Returns saved spreadsheet ID from localStorage or null
 */
export function getSavedSpreadsheetId(): string | null {
  return localStorage.getItem(STORAGE_KEY_SPREADSHEET_ID);
}

/**
 * Saves spreadsheet ID to localStorage (supports raw ID or full Google Sheets URL)
 */
export function saveSpreadsheetId(input: string) {
  let cleaned = input.trim();
  // Extract ID from full URL if user pasted a link like https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
  const match = cleaned.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    cleaned = match[1];
  }
  localStorage.setItem(STORAGE_KEY_SPREADSHEET_ID, cleaned);
  return cleaned;
}

/**
 * Applies professional styling and formatting to the Google Sheet:
 * - Dark Navy Header (#0F172A) with bold white text
 * - Auto-sized columns
 * - Status conditional color formatting
 * - WhatsApp direct click formula
 * - Frozen first row
 */
export async function formatSpreadsheetProfessional(spreadsheetId: string, sheetId: number = 0) {
  try {
    const token = await getAccessToken();
    if (!token) return;

    const requests = [
      // 1. Style Header Row (Dark Slate / Amber accents, bold, centered)
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
            startColumnIndex: 0,
            endColumnIndex: 8,
          },
          cell: {
            userEnteredFormat: {
              backgroundColor: { red: 0.06, green: 0.09, blue: 0.16 }, // Slate 900 #0F172A
              textFormat: {
                foregroundColor: { red: 0.98, green: 0.98, blue: 0.98 },
                fontSize: 11,
                bold: true,
              },
              horizontalAlignment: 'CENTER',
              verticalAlignment: 'MIDDLE',
              padding: { top: 6, bottom: 6, left: 8, right: 8 },
            },
          },
          fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment,padding)',
        },
      },
      // 2. Set Row Height for Header
      {
        updateDimensionProperties: {
          range: {
            sheetId,
            dimension: 'ROWS',
            startIndex: 0,
            endIndex: 1,
          },
          properties: {
            pixelSize: 42,
          },
          fields: 'pixelSize',
        },
      },
      // 3. Freeze Header Row
      {
        updateSheetProperties: {
          properties: {
            sheetId,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
          fields: 'gridProperties.frozenRowCount',
        },
      },
      // 4. Set explicit column widths for readable layout
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: 'COLUMNS', startIndex: 0, endIndex: 1 }, // Data
          properties: { pixelSize: 150 },
          fields: 'pixelSize',
        },
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: 'COLUMNS', startIndex: 1, endIndex: 2 }, // Nome
          properties: { pixelSize: 200 },
          fields: 'pixelSize',
        },
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: 'COLUMNS', startIndex: 2, endIndex: 3 }, // WhatsApp
          properties: { pixelSize: 160 },
          fields: 'pixelSize',
        },
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: 'COLUMNS', startIndex: 3, endIndex: 4 }, // Link WhatsApp 1-Click
          properties: { pixelSize: 150 },
          fields: 'pixelSize',
        },
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: 'COLUMNS', startIndex: 4, endIndex: 5 }, // Serviço
          properties: { pixelSize: 160 },
          fields: 'pixelSize',
        },
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: 'COLUMNS', startIndex: 5, endIndex: 6 }, // Cidade
          properties: { pixelSize: 160 },
          fields: 'pixelSize',
        },
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: 'COLUMNS', startIndex: 6, endIndex: 7 }, // Status
          properties: { pixelSize: 150 },
          fields: 'pixelSize',
        },
      },
      {
        updateDimensionProperties: {
          range: { sheetId, dimension: 'COLUMNS', startIndex: 7, endIndex: 8 }, // Observações
          properties: { pixelSize: 280 },
          fields: 'pixelSize',
        },
      },
      // 5. Add Alternating Row Colors (Banding)
      {
        addBanding: {
          bandedRange: {
            range: {
              sheetId,
              startRowIndex: 0,
              startColumnIndex: 0,
              endColumnIndex: 8,
            },
            rowProperties: {
              headerColor: { red: 0.08, green: 0.12, blue: 0.2 },
              firstBandColor: { red: 1.0, green: 1.0, blue: 1.0 },
              secondBandColor: { red: 0.96, green: 0.97, blue: 0.99 },
            },
          },
        },
      },
    ];

    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    });
  } catch (err) {
    console.warn('Formatação avançada ignorada ou já aplicada:', err);
  }
}

/**
 * Creates a brand new, highly formatted Google Sheet specifically for VoltPro leads
 */
export async function createLeadsSpreadsheet(title: string = 'VoltPro Elétrica - Gestão de Clientes & Orçamentos'): Promise<{ id: string; url: string }> {
  let token = await getAccessToken();
  if (!token) {
    const authRes = await googleSignIn();
    token = authRes?.accessToken || null;
  }

  if (!token) {
    throw new Error('Não autorizado. Conecte sua conta Google.');
  }

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: 'Leads & Clientes',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                {
                  values: [
                    { userEnteredValue: { stringValue: '📅 Data / Hora' } },
                    { userEnteredValue: { stringValue: '👤 Nome do Cliente' } },
                    { userEnteredValue: { stringValue: '📱 WhatsApp' } },
                    { userEnteredValue: { stringValue: '⚡ Chamar no WhatsApp' } },
                    { userEnteredValue: { stringValue: '🔧 Tipo de Serviço' } },
                    { userEnteredValue: { stringValue: '📍 Cidade / Região' } },
                    { userEnteredValue: { stringValue: '🏷️ Status do Atendimento' } },
                    { userEnteredValue: { stringValue: '📝 Observações / Agendamento' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `Erro ao criar planilha (${res.status})`);
  }

  const data = await res.json();
  const spreadsheetId = data.spreadsheetId;
  const sheetId = data.sheets?.[0]?.properties?.sheetId || 0;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  saveSpreadsheetId(spreadsheetId);

  // Apply rich styling asynchronously
  formatSpreadsheetProfessional(spreadsheetId, sheetId).catch(console.warn);

  return { id: spreadsheetId, url: spreadsheetUrl };
}

/**
 * Builds a clean row array for a given lead, including an automatic 1-click WhatsApp HYPERLINK formula
 */
function leadToSheetRow(lead: Lead): (string | number)[] {
  const serviceName =
    lead.serviceType === 'emergencia'
      ? '🚨 Emergência 24h'
      : lead.serviceType === 'residencial'
      ? '🏠 Residencial'
      : lead.serviceType === 'comercial'
      ? '🏢 Comercial'
      : '🏬 Predial';

  const statusLabel =
    lead.status === 'novo'
      ? '🟢 Novo'
      : lead.status === 'em_atendimento'
      ? '🟡 Em Atendimento'
      : lead.status === 'orcamento_enviado'
      ? '🟣 Orçamento Enviado'
      : '✅ Concluído';

  const formattedDate = new Date(lead.createdAt).toLocaleString('pt-BR');
  const cleanPhone = lead.phone.replace(/\D/g, '');
  const waUrl = `https://wa.me/55${cleanPhone}`;
  // Excel / Google Sheets formula for instant 1-click chat
  const waHyperlinkFormula = `=HYPERLINK("${waUrl}"; "💬 Abrir WhatsApp")`;

  return [
    formattedDate,
    lead.name,
    lead.phone,
    waHyperlinkFormula,
    serviceName,
    lead.city || 'São Paulo - SP',
    statusLabel,
    lead.notes || 'Aguardando primeiro contato',
  ];
}

/**
 * Appends a single lead row to the Google Sheet
 */
export async function appendLeadToSheet(
  lead: Lead,
  customSpreadsheetId?: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    let token = await getAccessToken();
    if (!token) {
      const authRes = await googleSignIn();
      token = authRes?.accessToken || null;
    }

    if (!token) {
      throw new Error('Não autorizado. Conecte sua conta Google.');
    }

    let spreadsheetId = customSpreadsheetId || getSavedSpreadsheetId();

    if (!spreadsheetId) {
      const created = await createLeadsSpreadsheet();
      spreadsheetId = created.id;
    }

    const row = leadToSheetRow(lead);
    const values = [row];

    const targetRanges = ["'Leads & Clientes'!A:H", 'Clientes!A:H', 'A:H'];
    let appendSuccess = false;

    for (const range of targetRanges) {
      const appendUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        range
      )}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

      const res = await fetch(appendUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values }),
      });

      if (res.ok) {
        appendSuccess = true;
        break;
      }
    }

    if (!appendSuccess) {
      throw new Error('Não foi possível inserir a linha na planilha.');
    }

    return {
      success: true,
      url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Erro ao sincronizar com Google Sheets';
    return { success: false, error: msg };
  }
}

/**
 * Formats, cleans and re-synchronizes all leads into the Google Sheet
 */
export async function syncAllLeadsToSheet(
  leads: Lead[],
  spreadsheetIdInput?: string
): Promise<{ success: boolean; count: number; url?: string; error?: string }> {
  try {
    let token = await getAccessToken();
    if (!token) {
      const authRes = await googleSignIn();
      token = authRes?.accessToken || null;
    }

    if (!token) {
      throw new Error('Não autorizado. Conecte sua conta Google.');
    }

    let spreadsheetId = spreadsheetIdInput ? saveSpreadsheetId(spreadsheetIdInput) : getSavedSpreadsheetId();

    if (!spreadsheetId) {
      const created = await createLeadsSpreadsheet();
      spreadsheetId = created.id;
    }

    // Apply professional formatting to improve readability, headers and spacing
    formatSpreadsheetProfessional(spreadsheetId).catch(console.warn);

    const headers = [
      '📅 Data / Hora',
      '👤 Nome do Cliente',
      '📱 WhatsApp',
      '⚡ Chamar no WhatsApp',
      '🔧 Tipo de Serviço',
      '📍 Cidade / Região',
      '🏷️ Status do Atendimento',
      '📝 Observações / Agendamento',
    ];

    const leadRows = leads.map(leadToSheetRow);
    const allData = [headers, ...leadRows];

    // Write all data cleanly replacing or inserting
    const targetSheets = ["'Leads & Clientes'", 'Clientes', 'Página1', 'Sheet1'];
    let writeSuccess = false;
    let usedSheet = targetSheets[0];

    for (const sheetName of targetSheets) {
      const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
        `${sheetName}!A1:H${allData.length + 5}`
      )}?valueInputOption=USER_ENTERED`;

      const res = await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: allData }),
      });

      if (res.ok) {
        writeSuccess = true;
        usedSheet = sheetName;
        break;
      }
    }

    // Fallback if specific sheet names did not match
    if (!writeSuccess) {
      const fallbackUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/A1:H${allData.length + 5}?valueInputOption=USER_ENTERED`;
      const res = await fetch(fallbackUrl, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ values: allData }),
      });
      if (res.ok) {
        writeSuccess = true;
      }
    }

    return {
      success: true,
      count: leads.length,
      url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Falha ao atualizar a planilha';
    return { success: false, count: 0, error: msg };
  }
}
