# Sistema de Controle Financeiro Pessoal (Web & PWA)

Sistema completo de finanças pessoais integrado ao **Google Sheets** como banco de dados em nuvem. Compatível com dispositivos **Android (PWA)** e navegadores de **PC**.

---

## 🚀 Como Executar Localmente

### Opção 1: Abrir diretamente no navegador
Basta dar dois cliques no arquivo [`index.html`](file:///c:/Users/João%20Nicolas/Documents/antigravity/kind-oppenheimer/index.html) ou abri-lo no Google Chrome, Microsoft Edge ou Brave.

### Opção 2: Servidor local (ideal para testar instalação PWA no celular)
No PowerShell, dentro desta pasta:
```powershell
npx serve .
# ou
python -m http.server 8080
```
Depois acesse `http://localhost:8080` no PC ou pelo IP da sua rede local no celular Android (ex: `http://192.168.x.x:8080`).

---

## 📊 Como Conectar com sua Planilha Google

1. Crie uma nova planilha no seu [Google Drive](https://sheets.new).
2. Na barra de menus, clique em **Extensões** > **Apps Script**.
3. Copie o código presente no arquivo [`google-apps-script.js`](file:///c:/Users/João%20Nicolas/Documents/antigravity/kind-oppenheimer/google-apps-script.js) e cole no editor.
4. Clique em **Salvar (💾)**.
5. No canto superior direito, clique em **Implantar** > **Nova implantação**:
   - Tipo: **App da Web**
   - Executar como: **Eu (seu e-mail)**
   - Quem tem acesso: **Qualquer pessoa** *(necessário para permitir acesso do app)*
6. Clique em **Implantar** e copie a **URL do app da web** gerada (termina com `/exec`).
7. No aplicativo de Finanças, abra o menu lateral retrátil, clique em **"Conectar URL da Planilha"** e cole a URL.

Pronto! Todos os seus lançamentos e cadastros serão sincronizados automaticamente com o Google Sheets.

---

## 📱 Instalação no Android (PWA)

1. Abra o sistema no Google Chrome do seu celular Android.
2. Toque nos três pontinhos no canto superior direito.
3. Selecione **"Instalar aplicativo"** ou **"Adicionar à tela inicial"**.
4. O app será instalado com ícone próprio e abrirá em tela cheia como um app nativo.

---

## 🎨 Cores e Identidade Visual

- Fundo: Preto profundo (`#0a0a0a` e `#121212`)
- Bordas e divisores: Neutro sóbrio (`#262626`)
- Texto e realces: Branco puro (`#ffffff` e `#f4f4f5`)
- Entradas e saldos positivos: Verde sólido (`#16a34a`)
- Saídas e despesas: Vermelho sólido (`#dc2626`)
