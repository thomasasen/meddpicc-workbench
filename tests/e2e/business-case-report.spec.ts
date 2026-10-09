import { expect,test } from '@playwright/test'
const route='/meddpicc-workbench/#/tools/quick-payback'
test('Business Case: CRM Demo, redesigned chart, valid PDF report download',async({page})=>{
 await page.goto(route)
 await page.getByRole('button',{name:'Softwareprojekt & Kunden-Metrics'}).click()
 await page.getByRole('button',{name:'CRM-/SaaS-Beispiel mit Kunden-Metrics'}).click()
 await expect(page.getByTestId('sustained-payback')).toHaveText('Monat 35')
 await expect(page.getByRole('img',{name:'Kumulierter Nutzen im Projektverlauf'})).toBeVisible()
 await expect(page.getByTestId('model-roi')).toContainText('%')
 await page.getByLabel('Kunde (optional)').fill('Beispielwerke Industrie GmbH')
 await page.getByLabel('Projektbezeichnung').fill('CRM Transformation 2027')
 const promise=page.waitForEvent('download')
 await page.getByRole('button',{name:'Business-Case-Bericht (PDF)'}).click()
 const download=await promise
 expect(download.suggestedFilename()).toBe('business-case-softwareprojekt.pdf')
 const path=await download.path()
 expect(path).toBeTruthy()
 const fs=await import('node:fs/promises')
 const bytes=await fs.readFile(path!)
 expect(bytes.toString('latin1',0,8)).toBe('%PDF-1.4')
 expect(bytes.length).toBeGreaterThan(7000)
 await expect(page.getByText('PDF-Bericht mit Finanzmodell und Annahmen erstellt.')).toBeVisible()
})
test('Business Case: responsive chart and report UI has no page overflow',async({page})=>{
 for(const width of [375,768,1280]){
  await page.setViewportSize({width,height:840})
  await page.goto(route)
  await page.getByRole('button',{name:'Softwareprojekt & Kunden-Metrics'}).click()
  await page.getByRole('button',{name:'Einfaches Beispiel laden'}).click()
  await expect(page.getByTestId('sustained-payback')).toHaveText('Monat 18')
  await expect(page.getByRole('button',{name:'Business-Case-Bericht (PDF)'})).toBeVisible()
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(0)
 }
})
