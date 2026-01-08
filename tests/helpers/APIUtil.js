const axios = require('axios');
const fs = require('fs');
const util = require('util');
const sharp = require('sharp');
const path = require('path');
const { spawn } = require('child_process');
const exec = util.promisify(require('child_process').exec);

let BaseUrl = 'https://bankdrago.com';

const retryPattern = [2000, 5000, 10000, 6000, 9000, 15000, 18000];

function isBusy() {
  return isSendingMutasi;
}

async function getCurlResponse() {
  const url = `${BaseUrl}/api/v1/sessions`;
  const headers = {
    Cookie: '_mkra_stck=postgresql%3A1685200053.0876596'
  };
  const data = {
    email: 'bca.mobile.demo@gmail.com',
    password: 'willy1234'
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log('Response:', response.data);
    return response.data; // Mengembalikan data respons
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Melempar error untuk ditangani di class lainnya
  }
}

async function getCurlResponseV2(email, password) {
  const url = `${BaseUrl}/api/v1/sessions`;
  const headers = {
    Cookie: '_mkra_stck=postgresql%3A1685200053.0876596'
  };
  const data = {
    email: email,
    password: password
  };

  try {
    const response = await axios.post(url, data, { headers });
    // console.log('Response:', response.data);
    return response.data; // Mengembalikan data respons
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Melempar error untuk ditangani di class lainnya
  }
}

async function getCurlResponseLine(email, password) {
  const url = 'https://blockabot.me//api/v2/sessions'; 
  const headers = {
    Cookie: '_mkra_stck=postgresql%3A1685200053.0876596'
  };
  const data = {
    email: email,
    password: password
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log('Response:', response.data);
    return response.data; // Mengembalikan data respons
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Melempar error untuk ditangani di class lainnya
  }
}

async function getListAccounts(token) {
  const url = `${BaseUrl}/api/v2/apps/bank_accounts`;
  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
    Cookie: '_mkra_stck=postgresql%3A1685278243.7485914'
  };
    
  try {
    const response = await axios.get(url, { headers });
    console.log('Response:', response.data);
    return response.data
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getListActivities(token) {
  const url = `${BaseUrl}/api/v2/apps/activities`;
  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
    Cookie: '_mkra_stck=postgresql%3A1685278243.7485914'
  };
    
  try {
    const response = await axios.get(url, { headers });
    // console.log('Response:', response.data);
    return response.data.data;
  } catch (error) {
    console.error('Error:', error.message);
  }
}

let isSendingMutasi=false;
async function sendCurlRequest(token, data) {
    if(isSendingMutasi)return;
    isSendingMutasi=true;
    const url = `${BaseUrl}/api/v1/scrap_bank_mutations`;
    const headers = {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      Cookie: '_mkra_stck=postgresql%3A1685278243.7485914'
    };
    
    let attempt = 1;
    while (attempt>0 && attempt<retryPattern.length*2) {
      try {
        const response = await axios.post(url, data, { headers, timeout: 15000 });
        console.log('Scrap Bank Mutations Response:', response.data);
        attempt=-1;
      } catch (error) {
        console.error(`Scrap Bank Mutations Attempt ${attempt} failed: ${error.message}`);

        const cycleIndex = (attempt - 1) % retryPattern.length;
        const delay = retryPattern[cycleIndex];

        console.log(`Scrap Bank Mutations Retry in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));

        attempt++;
      }
    }
    if(attempt>0){
      console.log(`Semua percobaan mengirim mutasi gagal...`);
    }
    isSendingMutasi=false;
  }

async function getImageBase64(imagePath) {
    // Baca file gambar dari path
    const imageBuffer = fs.readFileSync(imagePath);

    // Konversi ke format base64
    const base64Image = imageBuffer.toString('base64');

    return base64Image;
}

async function getPDFBase64(pdfPath) {
  try {
      // Baca file PDF dari path
      const pdfBuffer = fs.readFileSync(pdfPath);

      // Konversi ke format base64
      const base64PDF = pdfBuffer.toString('base64');

      return base64PDF;
  } catch (error) {
      throw new Error(`Error reading PDF file: ${error.message}`);
  }
}

async function updateFlushInstruction(token, imagePath, amount, id,success=true,failMsg="") {
    const apiUrl = `${BaseUrl}/api/v1/scrap_flush_instructions/`+id;
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token,
        'Cookie': '_mkra_stck=postgresql%3A1694486285.5364673',
    };

    // Get data gambar base64 dari path
    // const imagePath = 'screenshot/bca/image.png';
    const base64Image = await getImageBase64(imagePath);
    fs.access(imagePath, fs.constants.F_OK, (err) => {
      if (err) {
          console.error(`File tidak ditemukan atau tidak dapat diakses: ${imagePath}`);
      } else {
          console.log(`File ada: ${imagePath}`);
      }
    });

    const imageBuffer = Buffer.from(base64Image, 'base64');

    const originalSize = Buffer.byteLength(imageBuffer);
    console.log(`Ukuran sebelum kompresi: ${originalSize} bytes`);

    // Kompres gambar menggunakan sharp
    const compressedImageBuffer = await sharp(imageBuffer)
        .jpeg({ quality: 50 }) // Atur kualitas kompresi sesuai kebutuhan, di sini 50%
        .toBuffer();

    const compressedSize = Buffer.byteLength(compressedImageBuffer);
    console.log(`Ukuran setelah kompresi: ${compressedSize} bytes`)

    // Kembali ke base64 setelah kompresi
    const compressedBase64Image = compressedImageBuffer.toString('base64');
    const dir = path.dirname(imagePath);
    const newFilePath = path.join(dir, 'testcomp.png');

    fs.writeFileSync(newFilePath, compressedImageBuffer);
        

    const data = {
        "status": success?"success":"failed",
        "actual_flushed_amount": success?amount:0,
        "proof": 'data:image/png;base64,' + compressedBase64Image,
        "message":failMsg
    };

    // const requestJson = JSON.stringify(data, null, 2);
    // // Tulis data JSON ke file teks
    // fs.writeFileSync('request.txt', requestJson, 'utf-8');

    // Mencetak data permintaan sebelum pengiriman
    // console.log('Update Flush Instruction request data:', data);
    let attempt = 1;
    while (true) {
      try {
        const response = await axios.put(apiUrl, data, { headers, timeout: 15000 });
        console.log('Update Flush Instruction response:', response.data);
        return; // keluar saat sukses
      } catch (error) {
        console.error(`Update Flush Instruction Attempt ${attempt} failed: ${error.message}`);

        const cycleIndex = (attempt - 1) % retryPattern.length;
        const delay = retryPattern[cycleIndex];

        console.log(`Update Flush Instruction Retry in ${delay / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delay));

        attempt++;
      }
    }
}


async function updateFlushInstructionDetached(token, imagePath, amount, id,success=true,failMsg="") {
  const uploadScript = path.join(__dirname,'detached', 'FlushInstruction.js');

  const logPath = path.join(__dirname,"log", id+'flush-log.txt');

  const dir = path.dirname(logPath);
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // `recursive: true` untuk buat nested folders
  }
  const out = fs.openSync(logPath, 'a');
  const err = fs.openSync(logPath, 'a');

  const child = spawn('node', [
    uploadScript,
    token,
    imagePath,
    amount,
    id,
    success.toString(),
    failMsg
  ], {
    detached: true,
    stdio: ['inherit', out, err] // arahkan stdout dan stderr ke file
  });

  child.unref(); // biar jalan sendiri, tidak ditunggu parent
  return "ok";
}

async function updateBankStatements(token, filePath) {
  const apiUrl = `${BaseUrl}/api/v1/bank_statements`;
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'Cookie': '_mkra_stck=postgresql%3A1694486285.5364673',
  };

  // Get data pdf base64 dari path
  const base64PDF = await getPDFBase64(filePath);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`File tidak ditemukan atau tidak dapat diakses: ${filePath}`);
    } else {
        console.log(`File ada: ${filePath}`);
    }
});


  const data = {
      "statement_file_data": 'data:application/pdf;base64,' + base64PDF,
  };

  // const requestJson = JSON.stringify(data, null, 2);
  // // Tulis data JSON ke file teks
  // fs.writeFileSync('request.txt', requestJson, 'utf-8');

  // Mencetak data permintaan sebelum pengiriman
  // console.log('Update Flush Instruction request data:', data);

  let maxRetries = 3;
  let retryDelay = 2000
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
        const response = await axios.put(apiUrl, data,
          { 
            headers,
            timeout: 15000 
          });
        console.log('Update Bank Statement response:', response.data);
        return response.data;
    } catch (error) {
      if(error.message && (error.message.includes('ECONNABORTED') || error.message.includes('ECONNRESET') || error.message.includes('timeout'))){
          if (error.message.includes('ECONNABORTED') || error.message.includes('timeout')) {
            console.error('Update Bank Statement Request timed out');
          } else if (error.message.includes('ECONNRESET')) {
              console.error('Update Bank Statement Connection was reset. Retrying...');
          }
          if (attempt < maxRetries) {
              await new Promise(res => setTimeout(res, retryDelay * attempt)); // Exponential backoff
              continue;
          }
      } else {
        console.error('Error:', error.message);
        throw error; // Melempar error untuk ditangani di class lainnya
      }
    }
  }
}

async function scrapeBankBalances(token, balance) {
  const apiUrl = `${BaseUrl}/api/v1/scrap_bank_balances`;
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'Cookie': '_mkra_stck=postgresql%3A1694488511.181181',
  };

  const data = {
      "balance": balance
  };

  let maxRetries = 3;
  let retryDelay = 2000
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(apiUrl, data,
        { 
          headers,
          timeout: 15000 
        });
      // console.log('Get Scrap Balance response:', response.data);
      return response.data;
    } catch (error) {
      if(error.message && (error.message.includes('ECONNABORTED') || error.message.includes('ECONNRESET') || error.message.includes('timeout'))){
          if (error.message.includes('ECONNABORTED') || error.message.includes('timeout')) {
            console.error('Scrap Balance Request timed out');
          } else if (error.message.includes('ECONNRESET')) {
              console.error('Scrap Balance Connection was reset. Retrying...');
          }
          if (attempt < maxRetries) {
              await new Promise(res => setTimeout(res, retryDelay * attempt)); // Exponential backoff
              continue;
          }
      } else {
        console.error('Error:', error.message);
        throw error; // Melempar error untuk ditangani di class lainnya
      }
    }
  }
}


async function getActuatorTransferTask(token) {
  const apiUrl = 'https://bankdrago.com/api/v1/withdrawals/transfer_actuators';
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'Cookie': '_mkra_stck=postgresql%3A1694488511.181181',
  };

  const data = {
  };

  let maxRetries = 3;
  let retryDelay = 2000
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.post(apiUrl, data,
        { 
          headers,
          timeout: 15000 
        });
      console.log('Get Actuator Transfer Task response:', response.data);
      return response.data;
    } catch (error) {
      if(error.message && (error.message.includes('ECONNABORTED') || error.message.includes('ECONNRESET') || error.message.includes('timeout'))){
          if (error.message.includes('ECONNABORTED') || error.message.includes('timeout')) {
            console.error('Actuator Transfer Task Request timed out');
          } else if (error.message.includes('ECONNRESET')) {
              console.error('Actuator Transfer Task Connection was reset. Retrying...');
          }
          if (attempt < maxRetries) {
              await new Promise(res => setTimeout(res, retryDelay * attempt)); // Exponential backoff
              continue;
          }
      } else {
        console.error('Error:', error.message);
        throw error; // Melempar error untuk ditangani di class lainnya
      }
    }
  }
}


async function updateActuatorTransferTask(token, imagePath, id,success=true,errorMsg="",errorCode=-1) {
  const apiUrl = `${BaseUrl}/api/v1/withdrawals/transfer_actuators/`+id;
  console.log(apiUrl);
  const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
  };

  // Get data gambar base64 dari path
  // const imagePath = 'screenshot/bca/image.png';
  const base64Image = await getImageBase64(imagePath);
  fs.access(imagePath, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`File tidak ditemukan atau tidak dapat diakses: ${imagePath}`);
    } else {
        console.log(`File ada: ${imagePath}`);
    }
  });

  const imageBuffer = Buffer.from(base64Image, 'base64');

  const originalSize = Buffer.byteLength(imageBuffer);
  console.log(`Ukuran sebelum kompresi: ${originalSize} bytes`);

  // Kompres gambar menggunakan sharp
  const compressedImageBuffer = await sharp(imageBuffer)
      .jpeg({ quality: 5 }) // Atur kualitas kompresi sesuai kebutuhan, di sini 50%
      .toBuffer();

  const compressedSize = Buffer.byteLength(compressedImageBuffer);
  console.log(`Ukuran setelah kompresi: ${compressedSize} bytes`)

  // Kembali ke base64 setelah kompresi
  const compressedBase64Image = compressedImageBuffer.toString('base64');
  const dir = path.dirname(imagePath);
  const newFilePath = path.join(dir, 'testcomp.png');

  fs.writeFileSync(newFilePath, compressedImageBuffer);
       

  const data = {
      "status": success?"success":"failed",
      "error": errorMsg,
      "proof": 'data:application/png;base64,' + compressedBase64Image,
  };

  if(errorCode!=-1){
    data.error_code = errorCode;
  }
  // const requestJson = JSON.stringify(data, null, 2);
  // // Tulis data JSON ke file teks
  // fs.writeFileSync('request.txt', requestJson, 'utf-8');

  // Mencetak data permintaan sebelum pengiriman
  // console.log('Update Flush Instruction request data:', data);
  let attempt = 1;
  while (true) {
    try {
      const response = await axios.put(apiUrl, data, { headers, timeout: 15000 });
      console.log('Update Transfer Task response:', response.data);
      return; // keluar saat sukses
    } catch (error) {
      console.error(`Update Transfer Task Attempt ${attempt} failed: ${error.message}`);

      const cycleIndex = (attempt - 1) % retryPattern.length;
      const delay = retryPattern[cycleIndex];

      console.log(`Update Transfer Task Retry in ${delay / 1000} seconds...`);
      await new Promise(res => setTimeout(res, delay));

      attempt++;
    }
  }
}

async function updateActuatorTransferTaskDetached(token, imagePath, id, success = true, errorMsg = "", errorCode = -1) {
  const uploadScript = path.join(__dirname,'detached', 'TransferTask.js');

  const logPath = path.join(__dirname,"log", id+'flush-log.txt');

  const dir = path.dirname(logPath);
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // `recursive: true` untuk buat nested folders
  }
  const out = fs.openSync(logPath, 'a');
  const err = fs.openSync(logPath, 'a');

  const child = spawn('node', [
    uploadScript,
    token,
    imagePath,
    id,
    success.toString(),
    errorMsg,
    errorCode.toString()
  ], {
    detached: true,
    stdio: ['inherit', out, err] // arahkan stdout dan stderr ke file
  });

  child.unref(); // biar jalan sendiri, tidak ditunggu parent
  return "ok";
}

async function postCurlHeartbeat(token) {
  const url = `${BaseUrl}/api/v1/heartbeat`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token,
    'Cookie': '_mkra_stck=postgresql%3A1694486285.5364673',
};

  try {
    const response = await axios.post(url, null, 
      { 
        headers,
        timeout: 15000 
      });
    console.log('Heartbeat Response:', response.data);
    return response.data; // Mengembalikan data respons
  } catch (error) {
    console.error('Error:', error.message);
    throw error; // Melempar error untuk ditangani di class lainnya
  }
}

// Fungsi untuk menghapus semua file dalam folder "BCA Mobile"
async function removeAllFilesInBCAMobileFolder(device) {
  try {
    await runADBCommand(`adb -s ${device} shell rm "/sdcard/Download/BCA\\ Mobile/*"`);
    console.log('Semua file di folder "BCA Mobile" berhasil dihapus.');
  } catch (error) {
    console.log(`Error removing files: ${error.message} atau tidak ada mutasi`);
  }
}

// Fungsi untuk mendapatkan file terbaru dari direktori
async function getLatestFile(device) {
  try {
    const latestFile = await runADBCommand(`adb -s ${device} shell ls -t "/sdcard/Download/BCA\\ Mobile/" | head -n 1`);
    return latestFile.trim();
  } catch (error) {
    throw new Error(`Error getting latest file: ${error}`);
  }
}

// Fungsi untuk men-download file terbaru
async function downloadLatestFile(device, token, path) {
  try {
    const latestFileName = await getLatestFile(device);
    await runADBCommand(`adb -s ${device} pull "/sdcard/Download/BCA Mobile/${latestFileName}" tests/pdf/bca.pdf`);
    console.log(`File berhasil diunduh: ${latestFileName}`);
    await updateBankStatements(token, path)
    // Lakukan operasi lain dengan file PDF yang telah diunduh di sini
  } catch (error) {
    console.error(`Error downloading file: ${error.message}`);
  }
}

// Fungsi untuk menjalankan perintah ADB
async function runADBCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Error: ${stderr}`);
        return;
      }
      resolve(stdout);
    });
  });
}

// Contoh penggunaan: menjalankan perintah 'adb devices'
async function exampleADBCommand() {
  try {
    const output = await runADBCommand('adb devices');
    console.log('Output ADB Devices:', output);
    // Lakukan operasi lain dengan output dari perintah ADB di sini
  } catch (error) {
    console.error('Error executing ADB command:', error);
  }
}


async function getPendingTasks(token) {
  const url = 'https://blockabot.me/api/v2/tasks';
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: '', // Empty string as per the curl request
    });

    if (!response.ok) {
      console.error(`Response status: ${response.status}`);
      console.error(`Response text: ${await response.text()}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response received:', data);

    // Process and return the data
    return data.data.map(task => ({
      id: task.id,
      phoneNumber: task.phone_number,
      status: task.status_id,
      lastChecked: task.last_checked_at,
    }));
  } catch (error) {
    console.error('Error retrieving pending tasks:', error);
    throw error;
  }
}

async function updateTask(token, id, status) {
  const url = `https://blockabot.me/api/v2/tasks/${id}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
  const data = {
    status_id: status
  };

  console.log(url);
  console.log(data);

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log('Successfully update status task:', await response.json());

    // Perform other actions as needed
  } catch (error) {
    console.error('Error update status task:', error);
    throw error;
  }
}

async function saveScreenshot(driver, imagePath) {
  const dir = path.dirname(imagePath);
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
  }
  
  try {
    await driver.saveScreenshot(imagePath);

    const stats = fs.statSync(imagePath);
    if (stats.size > 500 * 1024) {
        const buffer = fs.readFileSync(imagePath);
        // Resize to width 720 to reduce size while maintaining readability
        await sharp(buffer)
            .resize({ width: 720, withoutEnlargement: true })
            .toFile(imagePath + ".tmp");
        
        fs.unlinkSync(imagePath);
        fs.renameSync(imagePath + ".tmp", imagePath);
    }
  } catch (err) {
      console.error('Error saving/compressing screenshot:', err);
  }
}

async function screenSaveScreenshot(screen, imagePath) {
  const dir = path.dirname(imagePath);
  if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
  }
  
  try {
    await screen.saveScreenshot(imagePath);

    const stats = fs.statSync(imagePath);
    if (stats.size > 500 * 1024) {
        const buffer = fs.readFileSync(imagePath);
        await sharp(buffer)
            .resize({ width: 720, withoutEnlargement: true })
            .toFile(imagePath + ".tmp");
        
        fs.unlinkSync(imagePath);
        fs.renameSync(imagePath + ".tmp", imagePath);
    }
  } catch (err) {
      console.error('Error saving/compressing screenshot:', err);
  }
}


module.exports = {isBusy, getCurlResponse, sendCurlRequest, getCurlResponseV2, getListAccounts, updateFlushInstruction, updateFlushInstructionDetached, getActuatorTransferTask, updateActuatorTransferTask, updateActuatorTransferTaskDetached, scrapeBankBalances, postCurlHeartbeat, downloadLatestFile, exampleADBCommand, removeAllFilesInBCAMobileFolder, getListActivities, getPendingTasks, getCurlResponseLine, updateTask, saveScreenshot, screenSaveScreenshot };
