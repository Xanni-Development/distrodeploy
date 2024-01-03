const { spawn } = require('node:child_process');
const discord = require("discord.js");

var vm_state = 0;
const token = "redacted"

thread = null;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

var vm_buf = "";

async function update_msg(discord_vm_msg, dmsg){
  process.stdout.write("\tUpdating VM Discord Message!\n");

  vm_buf = vm_buf.slice(Math.max(vm_buf.length - 1500, 0));

  var msg = "\`\`\`ansi\n"+ vm_buf + "\n\`\`\`";

  await discord_vm_msg.edit(`${msg}`);
  await sleep(500);
}

async function vm_start(client, msg){
  vm_state = 1;
  msg.reply("Starting VM..");

  var old_vm_buf = "";

  discord_vm_msg = await msg.channel.send("\`\`\`ansi\nVM Buffer\n\`\`\`");

  // vm = spawn('qemu-system-x86_64', ['--enable-kvm', '-smp', 'cores=8,threads=2', '-m', '512', '-nographic', '-hda', 'drive.img', '-nic', 'none', '-monitor', 'none']);
  vm = spawn('qemu-system-x86_64', ['-smp', 'cores=8,threads=2', '-m', '512', '-nographic', '-hda', 'drive.img', '-nic', 'none', '-monitor', 'none']);
  //vm = spawn('qemu-system-x86_64', ['-smp', 'cores=8,threads=2', '-m', '512', '-nographic', '-hda', 'drive.img']);

  vm.stdout.on('data', async (data) => {
    vm_buf = vm_buf.concat(data);
    process.stdout.write(data);
  });

  vm.on('close', async () => {
    vm_state = 0;
    clearInterval(thread);
    await msg.reply("VM Died!\n");
    //await discord_vm_msg.delete(); (breaks stuff, uaf)
  });

  thread = setInterval(async () => {   
    if(vm_state == 1){
      if(vm_buf !== old_vm_buf){
        await update_msg(discord_vm_msg, msg);
        old_vm_buf = vm_buf;
      }
    }
  }, 1000);
}
 (edited)
[11:02 AM]
function vm_stop(client, msg){
  vm_state = 0;
  clearInterval(thread);

  msg.reply("Stopping VM..");
  vm.kill("SIGKILL");
}

function banner(){
  process.stdout.write(`__     ___           _
\\ \\   / / |__   ___ | |_
 \\ \\ / /| '_ \\ / _ \\| __|
  \\ V / | |_) | (_) | |_
   \\_/  |_.__/ \\___/ \\__|\n\n`);
}

function init_discord(){
  process.stdout.write(" Connecting to discord..\n");

  const client = new discord.Client({intents: [discord.GatewayIntentBits.Guilds, discord.GatewayIntentBits.GuildMessages, discord.GatewayIntentBits.MessageContent]});

  client.on('ready', () => {
    process.stdout.write(" \tConnected!\n\n");
  });

  client.on('messageCreate', async function(msg) {
    if(msg.author.bot)
      return;

    process.stdout.write(` MSG: ${msg.content}\n`);

    if(msg.content == "!help"){
      msg.reply("!vm_start\n!vm_stop");
    }
    else if(msg.content == "!vm_start"){
      if(vm_state == 0){
        vm_start(client, msg);
      }
      else{
        msg.reply("Already Running!");
      }
    }
    else if(msg.content == "!vm_stop"){
      if(vm_state == 1){
        vm_stop(client, msg);
      }
      else{
        msg.reply("Not Running!");
      }
    }
    else if(vm_state == 1){
      if(msg.content.startsWith('!') == true){

        vm_buf = "";
        discord_vm_msg = await msg.channel.send("\`\`\`ansi\nVM Buffer\n\`\`\`");
        vm.stdin.write(msg.content.slice(1, msg.content.length) + "\n");
      }
    }
  });

  client.login(token);
}

banner();
init_discord();


// bugs
// incompatible ansi escapes
// random missing output

// todo
// ctrl+c support
// user specific vms
// throw away vm
// drive copy into ramfs
