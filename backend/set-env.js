// set-env.js
// Usage: node set-env.js [env] [command...]
const [,, env, ...cmd] = process.argv;
if (!env || cmd.length === 0) {
  console.error('Usage: node set-env.js <env> <command...>');
  process.exit(1);
}
const { spawn } = require('child_process');
const child = spawn(cmd[0], cmd.slice(1), {
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: env }
});
child.on('exit', code => process.exit(code));
