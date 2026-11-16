#!/usr/bin/env node
// Wrapper to run pinned HyperFrames CLI with motion-studio's bundled FFmpeg/FFprobe environment on any agent (Antigravity / Claude Code).
import { hfCli, hfEnv, run } from './lib.mjs';

const args = process.argv.slice(2);
const r = run('npx', ['-y', hfCli, ...args], { cwd: process.cwd(), env: hfEnv(), capture: false });
process.exitCode = r.status;
