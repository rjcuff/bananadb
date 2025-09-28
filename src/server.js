import express from 'express';
import cors from 'cors';
import chokidar from 'chokidar';
import portfinder from 'portfinder';
import { LowSync } from 'lowdb';
import { JSONFileSync } from 'lowdb/node';
import { createRouter } from './router.js';
import chalk from 'chalk';
import figlet from 'figlet';



export function startServer({ file, port, enableCors = true }) {
  // 1) Load JSON file with lowdb (provide defaultData!)
  const adapter = new JSONFileSync(file);
  const db = new LowSync(adapter, {}); 
  db.read();

  // Initialize if empty / missing
  if (!db.data || typeof db.data !== 'object') {
    db.data = { items: [] }; // default collection for first run
    db.write();
  }

  // 2) Create express app
  const app = express();
  app.use(express.json());
  if (enableCors) app.use(cors());

  // 3) Hot-swappable router so we can rebuild on file changes
  let currentRouter = createRouter(db);
  app.use((req, res, next) => currentRouter(req, res, next));

  const rebuild = (reason = 'unknown') => {
    try {
      db.read();
      if (!db.data || typeof db.data !== 'object') db.data = { items: [] };
      currentRouter = createRouter(db);
      printEndpoints(db);
      console.log(`♻️  Reloaded routes due to: ${reason}`);
    } catch (e) {
      console.error('❌ Failed to reload DB:', e.message);
    }
  };

  // 4) Watch the db file for changes (live reload)
  chokidar.watch(file, { ignoreInitial: true }).on('all', () => rebuild('file change'));

  // 5) Start server with auto port selection
  portfinder.getPortPromise({ port }) 
    .then(freePort => {
      app.listen(freePort, () => {
        // Big BananaDB banner 🍌
        console.log(
          chalk.yellow(
            figlet.textSync('BananaDB', { horizontalLayout: 'default' })
          )
        );

        if (freePort !== port) {
          console.log(chalk.red(`⚠️  Port ${port} in use. Switched to ${freePort}.`));
        }

        console.log(chalk.green(`🍌 BananaDB running at:`), chalk.cyan(`http://localhost:${freePort}`));
        console.log(chalk.yellow('📂 Database file:'), chalk.white(file));
        console.log(chalk.magenta('🔌 Available endpoints:'));
        printEndpoints(db);
        console.log(chalk.gray('👀 Watching for changes…\n'));
      });
    })
    .catch(err => {
      console.error('❌ Could not find a free port:', err.message);
      process.exit(1);
    });


}

function printEndpoints(db) {
    const colls = Object.keys(db.data).filter((k) => Array.isArray(db.data[k]));
    if (!colls.length) {
      console.log(chalk.red('⚠️  No collections found.'));
      console.log(chalk.gray('   Add arrays to your JSON (e.g., { "items": [] }).'));
      return;
    }
  
    for (const c of colls) {
      console.log(chalk.blue.bold(`\n/${c}`));
      console.log(chalk.gray(`  GET     /${c}`));
      console.log(chalk.gray(`  GET     /${c}/:id`));
      console.log(chalk.gray(`  POST    /${c}`));
      console.log(chalk.gray(`  PATCH   /${c}/:id`));
      console.log(chalk.gray(`  DELETE  /${c}/:id`));
    }
  }
  
