#!/usr/bin/env node
/**
 * Limpeza resiliente de diretórios de resultados Playwright no Windows.
 * Remove atributos read-only/hidden/system antes de apagar.
 * Usa retry com exponential backoff para contornar locks (OneDrive, antivírus, etc).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const DIRS_TO_CLEAN = [
  '.pw-out',
  '.pw-test-results',
  '.pw-test-results-run2',
  '.pw-test-results-run3',
  '.pw-test-results-run4',
  'test-results',
  'playwright-report',
];

const MAX_RETRIES = 5;
const INITIAL_DELAY_MS = 200;

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function clearAttributes(dirPath) {
  if (process.platform !== 'win32') return;
  try {
    const { execSync } = await import('child_process');
    execSync(`attrib -R -H -S "${dirPath}" /S /D`, { windowsHide: true });
  } catch {
    // ignorar
  }
}

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
      console.warn(`[cleanup] Aviso: não foi possível remover ${target}: ${err.message}`);
    }
  }
}

async function main() {
  console.log('[cleanup] Limpando diretórios de resultados...');
  for (const dir of DIRS_TO_CLEAN) {
    const full = path.join(ROOT, dir);
    if (fs.existsSync(full)) {
      await removeRecursive(full);
      console.log(`[cleanup] Removido: ${dir}`);
    }
  }
  console.log('[cleanup] Concluído.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
