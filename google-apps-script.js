/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - API DE INTEGRAÇÃO COM O GOOGLE SHEETS
 * =========================================================================
 * 
 * INSTRUÇÕES:
 * 1. Abra sua planilha do Google (https://sheets.new)
 * 2. Clique no menu: Extensões > Apps Script
 * 3. Substitua o conteúdo do editor por este código
 * 4. Clique em "Implantar" (Deploy) > "Nova implantação" (New deployment)
 * 5. Tipo: "App da Web" (Web app)
 * 6. Executar como: "Eu" (seu e-mail)
 * 7. Quem tem acesso: "Qualquer pessoa" (Anyone) -> ESSENCIAL para funcionar no PWA
 * 8. Copie a URL do Web App gerada e cole nas configurações do aplicativo.
 */

function setupSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 1. Aba de Lançamentos
  let sheetLancamentos = ss.getSheetByName("Lancamentos");
  if (!sheetLancamentos) {
    sheetLancamentos = ss.insertSheet("Lancamentos");
    sheetLancamentos.appendRow([
      "ID", "Data", "Tipo", "Descricao", "Categoria", "Valor", "Status", "OrigemRecorrente"
    ]);
    sheetLancamentos.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#e2e8f0");
  }

  // 2. Aba de Recorrentes
  let sheetRecorrentes = ss.getSheetByName("Recorrentes");
  if (!sheetRecorrentes) {
    sheetRecorrentes = ss.insertSheet("Recorrentes");
    sheetRecorrentes.appendRow([
      "ID", "Tipo", "Descricao", "Categoria", "Valor", "SemValorFixo", "DiaVencimento", "Ativo"
    ]);
    sheetRecorrentes.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#e2e8f0");
  }
}

// GET: Retorna todos os dados para o aplicativo
function doGet(e) {
  setupSheets();
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const lancData = ss.getSheetByName("Lancamentos").getDataRange().getValues();
  const recData = ss.getSheetByName("Recorrentes").getDataRange().getValues();

  const lancamentos = [];
  for (let i = 1; i < lancData.length; i++) {
    const row = lancData[i];
    if (row[0]) {
      let dataFormatada = row[1];
      if (row[1] instanceof Date) {
        dataFormatada = Utilities.formatDate(row[1], Session.getScriptTimeZone(), "yyyy-MM-dd");
      }
      lancamentos.push({
        id: String(row[0]),
        data: String(dataFormatada),
        tipo: String(row[2]),
        descricao: String(row[3]),
        categoria: String(row[4]),
        valor: Number(row[5]) || 0,
        status: String(row[6]),
        origemRecorrente: String(row[7] || '')
      });
    }
  }

  const recorrentes = [];
  for (let i = 1; i < recData.length; i++) {
    const row = recData[i];
    if (row[0]) {
      recorrentes.push({
        id: String(row[0]),
        tipo: String(row[1]),
        descricao: String(row[2]),
        categoria: String(row[3]),
        valor: Number(row[4]) || 0,
        semValorFixo: Boolean(row[5]),
        diaVencimento: Number(row[6]) || 1,
        ativo: row[7] === true || String(row[7]).toLowerCase() === 'true'
      });
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    lancamentos: lancamentos,
    recorrentes: recorrentes
  })).setMimeType(ContentService.MimeType.JSON);
}

// POST: Recebe atualizações e sincroniza com a planilha
function doPost(e) {
  setupSheets();
  try {
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    if (body.action === "syncAll") {
      const sLanc = ss.getSheetByName("Lancamentos");
      const sRec = ss.getSheetByName("Recorrentes");

      // Limpar registros mantendo cabeçalho
      if (sLanc.getLastRow() > 1) {
        sLanc.getRange(2, 1, sLanc.getLastRow() - 1, 8).clearContent();
      }
      if (sRec.getLastRow() > 1) {
        sRec.getRange(2, 1, sRec.getLastRow() - 1, 8).clearContent();
      }

      // Inserir lançamentos
      if (body.lancamentos && body.lancamentos.length > 0) {
        const rowsL = body.lancamentos.map(l => [
          l.id, l.data, l.tipo, l.descricao, l.categoria, l.valor, l.status, l.origemRecorrente || ''
        ]);
        sLanc.getRange(2, 1, rowsL.length, 8).setValues(rowsL);
      }

      // Inserir recorrentes
      if (body.recorrentes && body.recorrentes.length > 0) {
        const rowsR = body.recorrentes.map(r => [
          r.id, r.tipo, r.descricao, r.categoria, r.valor, r.semValorFixo, r.diaVencimento, r.ativo
        ]);
        sRec.getRange(2, 1, rowsR.length, 8).setValues(rowsR);
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Dados sincronizados com sucesso na planilha!"
      })).setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: "Ação não suportada"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
