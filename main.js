const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const { exec, execSync } = require('child_process');
const fs = require('fs');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
      // preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
  // win.webContents.openDevTools() // Optional: for debugging
}

let runningProcess = null;
let runningScrcpyProcess = null;

const runMutasiBcel = (event, args) => {
  if (runningProcess) {
    event.reply('command-output', 'Process is already running.');
    return;
  }

  const port = args && args.port ? args.port : null;
  
  // Device Detection
  let deviceId = args && args.deviceId ? args.deviceId : null;
  let androidVersion = null;

  if (!deviceId) {
    try {
      event.sender.send('command-output', 'Detecting connected devices...');
      const devicesOutput = execSync('adb devices -l').toString();
      
      const lines = devicesOutput.split(/\r?\n/);
      const foundDevices = [];

      for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine || trimmedLine.startsWith('List of devices')) continue;
          
          const parts = trimmedLine.split(/\s+/);
          // Check for 'device' state
          // Format usually: ID state product:X model:Y device:Z ...
          // parts[0] is ID, parts[1] is state
          if (parts.length >= 2 && parts[1] === 'device') {
              const id = parts[0];
              let model = 'Unknown';
              // Find model in parts
              const modelPart = parts.find(p => p.startsWith('model:'));
              if (modelPart) {
                  model = modelPart.replace('model:', '').replace(/_/g, ' ');
              }
              foundDevices.push({ id, model });
          }
      }

      if (foundDevices.length === 0) {
          console.log('No device detected.');
          event.sender.send('command-output', 'No device detected via ADB.');
          event.reply('process-finished', 1);
          return;
      } else if (foundDevices.length === 1) {
          deviceId = foundDevices[0].id;
          event.sender.send('command-output', `Found device: ${deviceId} (${foundDevices[0].model})`);
      } else {
          // Multiple devices
          console.log('Multiple devices detected. Asking user to select.');
          event.sender.send('command-output', `Found ${foundDevices.length} devices. Please select one.`);
          event.sender.send('request-device-selection', { devices: foundDevices, originalArgs: args });
          return;
      }
    } catch (error) {
      console.error('Error detecting device:', error);
      event.sender.send('command-output', `Error detecting device: ${error.message}`);
      event.reply('process-finished', 1);
      return;
    }
  }

  // If we are here, we have a deviceId (either passed in args or auto-detected single)
  if (deviceId) {
      try {
          // Double check version if not passed
          androidVersion = execSync(`adb -s ${deviceId} shell getprop ro.build.version.release`).toString().trim();
          
          event.sender.send('command-output', `Using Device: ${deviceId}, Android: ${androidVersion}`);
          console.log(`Detected Device: ${deviceId}, Android: ${androidVersion}`);
          event.sender.send('device-info-update', { deviceId, androidVersion });
      } catch (e) {
          console.error('Error getting android version:', e);
          event.sender.send('command-output', `Warning: Could not get Android version for ${deviceId}`);
      }
  }

  console.log(`Received run-mutasi-bcel command. Port: ${port}`);
  
  // Use local wdio binary to avoid npm script resolution issues
  // We target the JS file directly to avoid .bin shim issues in packaged environment
  const wdioPath = path.join(__dirname, 'node_modules', '@wdio', 'cli', 'bin', 'wdio.js');
  const configPath = path.join(__dirname, 'config', 'wdio.mutasi.bcel.conf.js');
  
  let command;
  if (fs.existsSync(wdioPath)) {
      // Use "node" explicitly. Assumes node is in system PATH (required for appium/wdio anyway)
      command = `node "${wdioPath}" run "${configPath}"`;
  } else {
      console.warn('Local wdio not found at:', wdioPath);
      // Fallback only if absolutely necessary, but this likely means the build is broken
      command = `npx wdio run "${configPath}"`; 
  }

  // Double check if we are in dev or prod
  // In prod (packaged), we might need to adjust paths if they are not standard
  // but with our copy logic, they should be in resources/app/ (which is __dirname)

  console.log(`Executing command: ${command}`);

  
  // Create environment variables object merging existing process.env
  const env = { ...process.env };
  if (port) env.PORT_BCEL = port;
  if (deviceId) env.DEVICE_BCEL = deviceId;
  if (androidVersion) env.DEVICE_BCEL_OS_VERSION = androidVersion;

  runningProcess = exec(command, { cwd: __dirname, env: env });

  runningProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    // Optional: send output back to renderer to show in log area
    event.reply('command-output', data);
  });

  runningProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    event.reply('command-output', data);
  });

  runningProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    event.reply('command-output', `Process exited with code ${code}`);
    event.reply('process-finished', code); // Notify renderer that process finished
    runningProcess = null;
  });
};

ipcMain.on('run-mutasi-bcel', runMutasiBcel);
// Backward compatibility if the renderer still sends the previous channel name
ipcMain.on('run-mutasi-bca', runMutasiBcel);

const stopMutasiBcel = (event) => {
  if (runningProcess) {
    console.log('Stopping process...');
    // For Windows, we might need a more aggressive kill if the child process spawns grandchildren
    if (process.platform === 'win32') {
      exec(`taskkill /pid ${runningProcess.pid} /T /F`, (err, stdout, stderr) => {
        if (err) {
          console.error(`Error killing process: ${err}`);
          event.reply('command-output', `Error stopping process: ${err.message}`);
        } else {
           console.log('Process killed successfully');
           // runningProcess will be set to null in the 'close' event handler
        }
      });
    } else {
      runningProcess.kill();
    }
  } else {
    event.reply('command-output', 'No process running to stop.');
  }

  // Also kill scrcpy if it's running
  if (runningScrcpyProcess) {
      console.log('Stopping scrcpy process...');
      if (process.platform === 'win32') {
          exec(`taskkill /pid ${runningScrcpyProcess.pid} /T /F`, (err) => {
              if (err) console.error(`Error killing scrcpy: ${err}`);
              else console.log('scrcpy killed successfully');
          });
      } else {
          runningScrcpyProcess.kill();
      }
      runningScrcpyProcess = null;
  }
};

ipcMain.on('stop-mutasi-bcel', stopMutasiBcel);
ipcMain.on('stop-mutasi-bca', stopMutasiBcel);

ipcMain.on('save-log', async (event, content) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    filters: [
      { name: 'Text Files', extensions: ['txt', 'log'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (!canceled && filePath) {
    fs.writeFile(filePath, content, (err) => {
      if (err) {
        event.reply('command-output', `Failed to save log: ${err.message}`);
      } else {
        event.reply('command-output', `Log saved to ${filePath}`);
      }
    });
  }
});

ipcMain.on('run-scrcpy', (event, args) => {
    console.log('Received run-scrcpy command');
    const deviceId = args && args.deviceId && args.deviceId !== 'Device ID will be auto-filled' ? args.deviceId : null;
    
    // Check for local scrcpy
    const localScrcpyPath = path.join(__dirname, 'scrcpy', 'scrcpy-win64-v2.4', 'scrcpy.exe');
    let command = 'scrcpy'; // Default to global
    
    if (fs.existsSync(localScrcpyPath)) {
        console.log(`Found local scrcpy at: ${localScrcpyPath}`);
        command = `"${localScrcpyPath}"`;
    } else {
        console.log('Local scrcpy not found, trying global scrcpy...');
    }

    if (deviceId) {
        command += ` -s ${deviceId}`;
    }

    // Attempt to fix encoding issues by limiting resolution or using a different encoder if needed.
    // Adding --max-size 1920 often helps with "java.lang.IllegalArgumentException" on some devices.
    command += ' --max-size 1920';

    console.log(`Executing: ${command}`);

    const scrcpyProcess = exec(command, (error, stdout, stderr) => {
        // exec callback handles the 'close' of the shell, so 'error' here means the command failed to spawn OR exited with non-zero code.
        // However, scrcpy might print errors to stderr but still run (or crash later).
        
        if (error) {
             // Differentiate between command not found and runtime error
             if (error.code === 127 || error.message.includes('not recognized')) {
                 console.error(`scrcpy not found: ${error.message}`);
                 event.reply('command-output', `Error launching scrcpy: Command not found. Make sure scrcpy is installed.`);
             } else {
                 console.error(`scrcpy exited with error: ${error.message}`);
                 // Don't spam the UI if it was just a clean exit or known error we're already capturing via stderr
             }
             return;
        }
    });

    // Capture stderr separately for real-time error logging
    scrcpyProcess.stderr.on('data', (data) => {
        console.error(`scrcpy stderr: ${data}`);
        // Filter out common non-critical warnings if desired, or just show everything.
        // For the specific Java error, it will show up here.
        event.reply('command-output', `[scrcpy] ${data}`);
    });

    scrcpyProcess.stdout.on('data', (data) => {
         console.log(`scrcpy stdout: ${data}`);
         // event.reply('command-output', `[scrcpy] ${data}`); // Optional: show stdout
    });

    runningScrcpyProcess = scrcpyProcess;

    scrcpyProcess.on('spawn', () => {
         event.reply('command-output', 'scrcpy started successfully.');
    });

    scrcpyProcess.on('close', (code) => {
        console.log(`scrcpy exited with code ${code}`);
        event.reply('command-output', `scrcpy closed (code: ${code})`);
        runningScrcpyProcess = null;
    });
});

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

