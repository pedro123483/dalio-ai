import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 100 });
  const page = await browser.newPage();

  await page.goto('https://www.gov.br/centraldebalancos/#/demonstracoes');
  await page.getByText('Consulta avançada').click();

  /***************** 2. Seleciona Tipo = “Balanço Patrimonial (BP)” *****/
  const tipoDropdown = page.locator('p-dropdown[formcontrolname="tipoDemonstracao"]');
  await tipoDropdown.locator('.ui-dropdown-label').click();
  await page.waitForSelector('.ui-dropdown-items');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');

  /***************** 3. Seleciona Ano = 2022 ****************************/
  const anoDropdown = page.locator('p-dropdown[formcontrolname="ano"]');
  await anoDropdown.locator('.ui-dropdown-label').click();
  await page.waitForSelector('.ui-dropdown-items');
  const anos = await page.locator('.ui-dropdown-item').allTextContents();
  const index2022 = anos.findIndex((t) => t.includes('2022'));
  if (index2022 !== -1) {
    for (let i = 0; i <= index2022; i++) await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
  } else {
    console.warn('⚠️ Ano 2022 não encontrado – usando ano padrão da tela.');
  }

  await page.getByRole('button', { name: 'Consultar' }).click();
  await page.waitForSelector('button:has-text("pdf")');

  /***************** Pasta de download **********************************/
  const downloadDir = path.join(process.cwd(), 'balances');
  if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

  /***************** 5. Loop páginas 1 → 30 *****************************/
  for (let pageNum = 1; pageNum <= 30; pageNum++) {
    console.log(`📄 Página ${pageNum}`);

    const pdfButtons = await page.locator('button:has-text("pdf")').all();
    console.log(`   ↳ ${pdfButtons.length} arquivos encontrados`);

    for (let i = 0; i < pdfButtons.length; i++) {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        pdfButtons[i].click(),
      ]);
      const filename = download.suggestedFilename();
      const filePath = path.join(downloadDir, `p${pageNum}_${i + 1}_${filename}`);
      await download.saveAs(filePath);
      console.log(`   ✔️  Salvo: ${filePath}`);
    }

    const nextPageLink = page.locator(
      `a.ui-paginator-page:text-is("${pageNum + 1}")`
    );

    if (await nextPageLink.count() === 0) {
      console.log('🚩 Não há mais páginas – encerrando.');
      break;
    }

    await nextPageLink.first().click();
    await page.waitForSelector('button:has-text("pdf")');
  }

  await browser.close();
})();
