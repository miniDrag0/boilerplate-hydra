const LoginScreen = require('../../screenobjects/bca/login.screen');
const HomeScreen = require('../../screenobjects/bca/home.screen');
const InfoScreen = require('../../screenobjects/bca/info.screen');
const MutasiScreen = require('../../screenobjects/bca/mutasi.screen');
const PinScreen = require('../../screenobjects/bca/pin.screen');
const TransferScreen = require('../../screenobjects/bca/transfer.screen');
const MutasiDetailScreen = require('../../screenobjects/bca/mutasi.detail.screen');
const APIUtil = require('../../helpers/APIUtil');
const Gestures = require('../../helpers/Gestures');

process.env.RUNNING_PROCESS="BCA";

Gestures.setScreenSize(process.env.DEVICE_BCA);

describe('Feature MBCA', () => {
    let access_token = "";
    let last_mutations = [];
    let access_pass = "";
    let access_pin = "";
    let last_balance = "";
    let flush_instruction = "";
    let transfer_task = "";
    let isInitialDataFetched = false; // Penanda permintaan data awal
    let msgPopUp = "";
    beforeEach(async () => {
        // Kode yang akan dijalankan Persiapan scraping data dimulai
        console.log('Ambil scraping data terbaru');
        // while(APIUtil.isBusy()){
        //     console.log('Tunggu mutasi terkirim');
        //     driver.pause(3000);
        // }
        // try {
        //     const data = await APIUtil.getCurlResponseV2(process.env.EMAIL_ACCOUNT_BCA, process.env.PASS_ACCOUNT_BCA);
        //     access_token = data.data.access_token;    
        //     last_mutations = data.data.last_mutations;  
        //     access_pin = data.data.bank_pin;  
        //     access_pass = data.data.bank_login;
        //     if(access_pin =="" || access_pass==""){
        //         process.exit(991);
        //     }
        //     isInitialDataFetched = true;
        // } catch (error) {
        //     console.error('Gagal mengambil data dari API:', error);
        //     isInitialDataFetched = false;
        // }             
        // Lakukan persiapan atau inisialisasi umum di sini
        driver.pause(700);
        // let currActivity = await driver.getCurrentActivity();
        // // Fetch the list of activities
        // let activities = await APIUtil.getListActivities(access_token);
        // // Check if currActivity contains any of the activities
        // let isActivityMissing = activities.every(activity => 
        //     !currActivity.includes(activity.content) // Check if currActivity doesn't contain any activity content
        // );
        
        // if (isActivityMissing) {
        //     driver.activateApp('com.bca');
        //     driver.pause(1000);
        // }
        // driver.activateApp('com.bca');
        // driver.launchApp();
        // await driver.execute('mobile: activateApp', { appId: 'com.bca' });
        await driver.activateApp('com.bca');
        driver.pause(1000);
    });

    it('Mutasi bca', () => {
        driver.pause(500);
        // if (!isInitialDataFetched) {
        //     throw new Error('Scraping di-skip karena data awal gagal fetch 504'); // Melewatkan scraping dengan info kesalahan
        // }

         LoginScreen.clickButtonMBCA();
         LoginScreen.tfEdit.setValue(access_pass);//data.bank_password
         LoginScreen.clickButtonOk();
    });
    
    for(var i=1; i<=118; i++){ //450
        it('Cek Saldo bca + Transfer VA', () => {
                HomeScreen.clickButtonInfo(access_pass);
                //Get Balance
                last_balance = InfoScreen.clickLabelSaldo();
                // last_balance = "15000";

                const MAX_WAIT_TIME = 1000; // Batasan waktu maksimum dalam milidetik (contoh: 5 detik)
                let elapsedTime = 0;

                while ((last_balance === null || last_balance === "") && elapsedTime < MAX_WAIT_TIME) {
                driver.pause(1500); // Delay untuk mendapatkan saldo
                elapsedTime += 100; // Menambah waktu yang telah berlalu
                }

                if (last_balance === null || last_balance === "") {
                    console.error('Gagal mendapatkan saldo dalam batas waktu yang ditentukan.');
                } else {
                    console.log('Saldo ditemukan:', last_balance);
                    //Kirim Call API utk Balance dan cek apakah perlu Pembayaran transfer atau tidak
                    const dataBalance = APIUtil.scrapeBankBalances(access_token, last_balance);
                    dataBalance.then(response => {
                        if(response.hasOwnProperty('flush_instruction')){
                            flush_instruction = response.flush_instruction;
                        }
                        if(response.hasOwnProperty('transfer_tasks')){
                            transfer_task = response.transfer_tasks;   
                        }
                    });
                }

                driver.pause(1500) //delay untuk get flush instruction
                if (flush_instruction && flush_instruction.virtual_account !== null && flush_instruction.virtual_account !== "") {
                    console.log(flush_instruction);
                    // Prepare Transfer
                    HomeScreen.clickButtonHome(access_pass);
                    HomeScreen.clickButtonTransfer();
                
                    if (flush_instruction.virtual_account.bank_name === "BCA") {
                        TransferScreen.setTransferRekeningVAV2(flush_instruction.virtual_account.number, flush_instruction.virtual_account.amount, access_pin, "Pembayaran", access_token, flush_instruction.id);
                    } else {
                        TransferScreen.setTransferRekeningAntarBankV4(flush_instruction.virtual_account.name,flush_instruction.virtual_account.bank_name, flush_instruction.virtual_account.number, flush_instruction.virtual_account.amount, access_pin, "Money Transfer", access_token, flush_instruction.id);
                        driver.pause(3000);
                    }
                } else if (flush_instruction && flush_instruction !== null && flush_instruction !== "") {
                    // Prepare Transfer
                    HomeScreen.clickButtonHome(access_pass);
                    HomeScreen.clickButtonTransfer();
                
                    if (flush_instruction.bank_name === "BCA") {
                        TransferScreen.enterRekening(flush_instruction.account_number, access_pin);
                        TransferScreen.setTransferRekeningV3(flush_instruction.account_number, flush_instruction.amount, access_pin, "Pembayaran", access_token, flush_instruction.id);
                    } else {
                        TransferScreen.setTransferRekeningAntarBankV4(flush_instruction.virtual_account.name,flush_instruction.virtual_account.bank_name, flush_instruction.virtual_account.number, flush_instruction.virtual_account.amount, access_pin, "Money Transfer", access_token, flush_instruction.id);
                        driver.pause(3000);
                    }
                } else {
                    InfoScreen.clickCloseSaldoButton(); // Handle Close Pop Up kalau nyangkut tidak bisa ditutup
                }                    
            //Persiapan untuk scraping mutasi  
            HomeScreen.clickButtonHome(access_pass);  
            HomeScreen.clickButtonInfo(); 
            InfoScreen.clickLabelMutasi();
        });

        it('Retry Mutasi bca - '+i, () => {
            if (!isInitialDataFetched) {
                throw new Error('Scraping di-skip karena data awal gagal fetch 504'); // Melewatkan scrapper dengan mengangkat kesalahan
            }

            // HomeScreen.clickButtonHome(access_pass);
            // HomeScreen.clickButtonInfo(); 
            // InfoScreen.clickLabelMutasi();
            // console.log(getDateAfterSevenDays());
            // MutasiScreen.clickLabelStartDate("28 December 2023");
            // MutasiScreen.clickLabelOkDate();
            MutasiScreen.clickButtonSend(access_pass);
            PinScreen.tfPIN.setValue(access_pin);//data.bank_pin
            driver.pause(1000);//temporary
            PinScreen.clickButtonOK();
            //Remove mutasi pdf yang ada di directory HP Android
            //APIUtil.removeAllFilesInBCAMobileFolder(process.env.DEVICE_BCA);
            driver.pause(4000);
            MutasiDetailScreen.printMutasiScrollV2(access_token, last_mutations);
            APIUtil.postCurlHeartbeat(access_token);

            //Return ke Mutasi Page
            msgPopUp = MutasiDetailScreen.handleBackMutasi();
            console.log(msgPopUp);
            // InfoScreen.clickLabelMutasi();
            driver.pause(2500); //handle long waiting di mutasi
            

            // MutasiScreen.clickLabelStartDate("15 November 2023");
            // MutasiScreen.clickLabelOkDate();
        });
    }
    
    // it('Send PDF Mutasi', () => {
    //     APIUtil.downloadLatestFile(process.env.DEVICE_BCA, access_token, "tests/pdf/bca.pdf");
    // });
});


function getDateAfterSevenDays() {
    const currentDate = new Date(); // Get the current date
    const targetDate = new Date(); // Create a new date object
    
    targetDate.setDate(currentDate.getDate() - 7); // Set the target date to 7 days before the current date
    
    // Format the date as "dd MMM yyyy"
    const formattedDate = `${String(targetDate.getDate()).padStart(2, '0')} ${targetDate.toLocaleString('default', { month: 'short' })} ${targetDate.getFullYear()}`;
    
    return formattedDate;
  }