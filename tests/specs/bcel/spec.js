
const LoginScreen = require('../../screenobjects/bcel/login.screen');
const HomeScreen = require('../../screenobjects/bcel/home.screen');
const fs = require('fs');
const path = require('path');

const screenshotBaseDir = process.env.SCREENSHOT_BASE_DIR && process.env.SCREENSHOT_BASE_DIR.trim()
    ? path.resolve(process.env.SCREENSHOT_BASE_DIR.trim())
    : path.resolve(__dirname, '../../bcel/screenshots/mutasi');
const getDateFolder = () => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

describe('Feature BCEL', () => {

    it('Login BCEL', async () => {   
        console.log('[DEBUG] Starting Login...');
        const password = process.env.PASSWORD_APP;
        const transferCsvPath = process.env.TRANSFER_CSV_PATH;
        const question1 = process.env.MOTHER_BIRTHDAY;
        const question2 = process.env.HOUSE_NUMBER;
        const question3 = process.env.PHONE_FIRST;
        
        // Debugging logs to verify CSV data loading
        console.log(`[DEBUG] Data Loaded from CSV:`);
        console.log(`[DEBUG] Password: ${password}`);
        console.log(`[DEBUG] Mother Birthday: ${question1}`);
        console.log(`[DEBUG] House Number: ${question2}`);
        console.log(`[DEBUG] Phone First: ${question3}`);
        // console.log(`[DEBUG] Transfer CSV Path: ${transferCsvPath}`);

        if (!password) {
            throw new Error('PASSWORD_APP environment variable is not set');
        }

        // Logic to read transfer CSV
        let transfers = [];
        const parseTransferCsvContent = (csvContent) => {
            const lines = csvContent.split(/\r?\n/);
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                const parts = line.split(',');
                if (parts.length >= 3) {
                    transfers.push({
                        no: parts[0],
                        name: parts[1],
                        account: parts[2],
                        amount: parts[3]
                    });
                }
            }
        };

        if (process.env.TRANSFER_CSV_CONTENT) {
            parseTransferCsvContent(process.env.TRANSFER_CSV_CONTENT);
            console.log(`[DEBUG] Loaded ${transfers.length} transfers from TRANSFER_CSV_CONTENT.`);
        } else if (transferCsvPath) {
             try {
                 const csvContent = fs.readFileSync(transferCsvPath, 'utf8');
                 parseTransferCsvContent(csvContent);
                 console.log(`[DEBUG] Loaded ${transfers.length} transfers from TRANSFER_CSV_PATH.`);
             } catch (err) {
                 console.error('[DEBUG] Failed to read transfer CSV:', err);
             }
        }


        const runTransfer = async (transfer) => {
            console.log(`[DEBUG] Starting automation for transfer #${transfer.no} (${transfer.account})`);
            await LoginScreen.submitLogin(password);
            console.log('[DEBUG] Login Completed. Clicking LabelUnionPay...');
            await HomeScreen.clickLabelUnionPay();
            console.log('[DEBUG] Clicked LabelUnionPay. Clicking ButtonTransfer...');
            await HomeScreen.clickLabelBalance();
            await HomeScreen.clickButtonTransfer();
            console.log('[DEBUG] Clicked ButtonTransfer. Now entering account...');
            await HomeScreen.enterAccount(transfer.account);
            console.log('[DEBUG] Now entering amount...');
            await HomeScreen.verifyRecipientNamePresent(transfer.name);
            await HomeScreen.enterAmount(transfer.amount);
            await HomeScreen.fillInformation(question1, question2, question3,"Fund out");
            await HomeScreen.verifyDisplayedAmount(transfer.amount, transfer.name);
            await HomeScreen.verifyDisplayedMutationSuccess(transfer.amount, transfer.name);
            // add any additional steps (amount entry / confirmation) here
            console.log(`[DEBUG] Transfer #${transfer.no} (${transfer.account}) iteration done.`);
            
        };

        const failedTransfers = [];
        for (const transfer of transfers) {
            try {
                await runTransfer(transfer);
            } catch (err) {
                console.error(`[ERROR] Transfer #${transfer.no} failed:`, err.message);
                failedTransfers.push({
                    No: transfer.no,
                    Name: transfer.name,
                    Account: transfer.account,
                    Amount: transfer.amount,
                    Error: err.message
                });
                await driver.activateApp('com.bcel.bcelone');
                await driver.startActivity('com.bcel.bcelone', 'com.bcel.bcelone.BcelOneLogin');
            }
        }

        if (failedTransfers.length) {
            const failedFolder = path.join(screenshotBaseDir, getDateFolder());
            if (!fs.existsSync(failedFolder)) {
                fs.mkdirSync(failedFolder, { recursive: true });
            }
            const csvLines = [
                'No,Nama Akun,Nomor Akun,Amount,Error',
                ...failedTransfers.map(item =>
                    `${item.No},"${item.Name}",${item.Account},${item.Amount},"${item.Error.replace(/"/g,'""')}"`
                )
            ];
            const failedPath = path.join(failedFolder, `failed-transfers-${Date.now()}.csv`);
            fs.writeFileSync(failedPath, csvLines.join('\n'), 'utf8');
            console.log(`Saved failed transfer list to ${failedPath}`);
        }
    });
    
});