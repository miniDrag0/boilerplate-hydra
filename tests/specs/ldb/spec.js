
const LoginScreen = require('../../screenobjects/ldb/login.screen');
const HomeScreen = require('../../screenobjects/ldb/home.screen');
const fs = require('fs');
const path = require('path');

const screenshotBaseDir = process.env.SCREENSHOT_BASE_DIR && process.env.SCREENSHOT_BASE_DIR.trim()
    ? path.resolve(process.env.SCREENSHOT_BASE_DIR.trim())
    : path.resolve(__dirname, '../../ldb/screenshots/mutasi');
const INSUFFICIENT_BALANCE_THRESHOLD = 50000;
const parseCurrencyValue = (valueText) => {
    const normalized = valueText.replace(/[^\d.]/g, '');
    if (!normalized) {
        throw new Error(`Unable to parse currency value from "${valueText}"`);
    }
    const numeric = Number(normalized);
    if (Number.isNaN(numeric)) {
        throw new Error(`Unable to parse currency value from "${valueText}"`);
    }
    return numeric;
};
const getDateFolder = () => {
    const now = new Date();
    const pad = (value) => String(value).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

const prepareFailedTransfersCsv = () => {
    const failedFolder = path.join(screenshotBaseDir, getDateFolder());
    if (!fs.existsSync(failedFolder)) {
        fs.mkdirSync(failedFolder, { recursive: true });
    }
    return failedFolder;
};

const failedTransfers = [];
let failedCsvPath = null;
let failedCsvHeaderWritten = false;
let hasSavedFailedCsv = false;

const getFailedCsvPath = () => {
    if (!failedCsvPath) {
        const folder = prepareFailedTransfersCsv();
        failedCsvPath = path.join(folder, `failed-transfers-${Date.now()}.csv`);
    }
    return failedCsvPath;
};

const appendFailedTransferLine = (transfer, errorMessage) => {
    const targetPath = getFailedCsvPath();
    if (!failedCsvHeaderWritten) {
        fs.writeFileSync(targetPath, 'No,Nama Akun,Nomor Akun,Amount,Error\n', 'utf8');
        failedCsvHeaderWritten = true;
    }
    const line = `${transfer.no},"${transfer.name}",${transfer.account},${transfer.amount},"${errorMessage.replace(/"/g, '""')}"`;
    fs.appendFileSync(targetPath, `${line}\n`, 'utf8');
};

const writeFailedTransfersCsv = () => {
    if (!failedCsvPath || hasSavedFailedCsv) return;
    console.log(`Saved failed transfer list to ${failedCsvPath}`);
    hasSavedFailedCsv = true;
};

const registerFailedTransfersExitHook = () => {
    const flushCsv = () => writeFailedTransfersCsv();
    process.once('exit', flushCsv);
    process.once('SIGINT', () => flushCsv());
    process.once('SIGTERM', () => flushCsv());
    process.once('uncaughtException', (err) => {
        console.error('[ERROR] uncaughtException detected', err);
        flushCsv();
        process.exit(1);
    });
};
registerFailedTransfersExitHook();

describe('Feature LDB', () => {

    beforeEach(() => {
        failedTransfers.length = 0;
        failedCsvPath = null;
        failedCsvHeaderWritten = false;
        hasSavedFailedCsv = false;
    });

    it('Login LDB', async () => {   
        console.log('[DEBUG] Starting Login...');
        const password = process.env.PASSWORD_APP;
        
        // Debugging logs to verify CSV data loading
        console.log(`[DEBUG] Data Loaded from CSV:`);
        console.log(`[DEBUG] Password: ${password}`);
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
            // console.log(`[DEBUG] Loaded ${transfers.length} transfers from TRANSFER_CSV_CONTENT.`);
        } else if (transferCsvPath) {
             try {
                 const csvContent = fs.readFileSync(transferCsvPath, 'utf8');
                 parseTransferCsvContent(csvContent);
                //  console.log(`[DEBUG] Loaded ${transfers.length} transfers from TRANSFER_CSV_PATH.`);
             } catch (err) {
                 console.error('[DEBUG] Failed to read transfer CSV:', err);
             }
        }


        const runTransfer = async (transfer) => {
            console.log(`[DEBUG] Starting automation for transfer #${transfer.no} (${transfer.account})`);
            await LoginScreen.submitLogin(password);
            await HomeScreen.clickRemainingBalanceCard();
            await HomeScreen.ensureSwitchEnabled();
            const remainingBalance = await HomeScreen.getDynamicBalanceAfterSwitch();
            console.log(`[DEBUG] Remaining balance: ${remainingBalance}`);
            const numericRemainingBalance = parseCurrencyValue(remainingBalance);
            const numericTransferAmount = parseCurrencyValue(transfer.amount);
            if (numericRemainingBalance - numericTransferAmount < INSUFFICIENT_BALANCE_THRESHOLD) {
                throw new Error('insufficient balance');
            }
            await HomeScreen.enterAccount(transfer.account);
            await HomeScreen.verifyRecipientCardVisible(transfer.name);
            await HomeScreen.enterAmountDescription(transfer.amount, "Fund out");
            await HomeScreen.verifyRecipientAndAmount(transfer.name, transfer.amount);
            await LoginScreen.inputPin(password);
            await HomeScreen.verifyAmountAndCapture(transfer.amount, transfer.name);
            // console.log(await HomeScreen.getRemainingBalanceAmount());
            // await HomeScreen.clickButtonTransfer();
            // // console.log('[DEBUG] Clicked ButtonTransfer. Now entering account...');
            // await HomeScreen.enterAccount(transfer.account);
            // // console.log('[DEBUG] Now entering amount...');
        };

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
                    appendFailedTransferLine(transfer, err.message);
            } finally {
                await driver.activateApp('com.ldb.wallet');
                await driver.startActivity('com.ldb.wallet', 'com.ldb.wallet.MainActivity');
            }
        }
    });

    afterAll(() => {
        writeFailedTransfersCsv();
    });
    
});