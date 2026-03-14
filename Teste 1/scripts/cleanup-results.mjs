#!/usr/bin/env node
/**
 * Limpeza resiliente de artefatos Playwright.
 * Remove diretorios do projeto (.pw-out, test-results, playwright-report) e
 * do diretorio temporario do sistema (screenshots, traces, relatorio HTML).
 * Usa retry com backoff e atributos Windows (attrib) para contornar locks.
 */
import fs from 'fs';
import os from 'os';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const LOCAL_RUNTIME_DIR = path.join(os.tmpdir(), 'imts-teste1-playwright');

// Diretorios do projeto e do TEMP (local) usados pelo Playwright
const DIRS_TO_CLEAN = [
  path.join(ROOT, '.pw-out'),
  path.join(ROOT, '.pw-test-results'),
  path.join(ROOT, 'test-results'),
  path.join(ROOT, 'playwright-report'),
  path.join(LOCAL_RUNTIME_DIR, 'artifacts'),
  path.join(LOCAL_RUNTIME_DIR, 'report'),
];

const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 200;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Remove atributos read-only, hidden e system do caminho no Windows.
 * Necessario para permitir exclusao em pastas com locks (OneDrive, antivirus).
 */
async function clearAttributes(dirPath) {
  if (process.platform !== 'win32') return;
  try {
    const { execSync } = await import('child_process');
    execSync(`attrib -R -H -S "${dirPath}" /S /D`, { windowsHide: true });
  } catch {
    // ignorar
  }
}

/**
 * Remove arquivo ou diretorio recursivamente.
 * Em falha, tenta novamente com delay exponencial (até MAX_RETRIES).
 */
async function removeRecursive(target, retries = MAX_RETRIES) {
  if (!fs.existsSync(target)) return;
  const delay = INITIAL_DELAY_MS * Math.pow(2, MAX_RETRIES - retries);
  if (retries < MAX_RETRIES) await sleep(delay);

  try {
    if (process.platform === 'win32') await clearAttributes(target);
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(target)) {
        await removeRecursive(path.join(target, name), MAX_RETRIES);
      }
      fs.rmdirSync(target);
    } else {
      fs.unlinkSync(target);
    }
  } catch (err) {
    if (retries > 0) {
      await removeRecursive(target, retries - 1);
    } else {
      console.warn(`[cleanup] Aviso: nao foi possivel remover ${target}: ${err.message}`);
    }
  }
}

async function main() {
  console.log('[cleanup] Limpando diretorios de resultados...');
  for (const dir of DIRS_TO_CLEAN) {
    if (fs.existsSync(dir)) {
      await removeRecursive(dir);
      console.log(`[cleanup] Removido: ${dir}`);
    }
  }
  console.log('[cleanup] Concluido.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
