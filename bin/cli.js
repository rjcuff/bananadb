#!/usr/bin/env node
import { Command } from 'commander';
import { startServer } from '../src/server.js';

const program = new Command();

program
  .name('bananadb')
  .description('🍌 A lightweight JSON database and REST API mock server')
  .option('-p, --port <number>', 'Port to run the server', '3000')
  // primary flag
  .option('-d, --db <file>', 'JSON file to serve', 'db.json')
  // alias for familiarity with json-server
  .option('-w, --watch <file>', 'Alias for --db (JSON file to serve)')
  .option('--no-cors', 'Disable CORS (enabled by default)');

program.parse(process.argv);
const opts = program.opts();
const port = parseInt(opts.port, 10);
const dbFile = opts.watch || opts.db;

startServer({ file: dbFile, port, enableCors: opts.cors });
