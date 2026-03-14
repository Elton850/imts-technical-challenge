#!/usr/bin/env node
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

const reportDir = path.join(os.tmpdir(), 'imts-teste1-playwright', 'report');
const child = spawn('npx', ['playwright', 'show-report', reportDir], {
  stdio: 'inherit',
  shell: true,
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
