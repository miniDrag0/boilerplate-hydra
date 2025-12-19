
const LoginScreen = require('../../screenobjects/bcel/login.screen');
const HomeScreen = require('../../screenobjects/bcel/home.screen');

describe('Feature BCEL', () => {

    it('Login BCEL', async () => {   
        console.log('[DEBUG] Starting Login...');
        const password = process.env.PASSWORD_APP;
        
        // Debugging logs to verify CSV data loading
        console.log(`[DEBUG] Data Loaded from CSV:`);
        console.log(`[DEBUG] Password: ${password}`);
        console.log(`[DEBUG] Mother Birthday: ${process.env.MOTHER_BIRTHDAY}`);
        console.log(`[DEBUG] House Number: ${process.env.HOUSE_NUMBER}`);
        console.log(`[DEBUG] Phone First: ${process.env.PHONE_FIRST}`);

        if (!password) {
            throw new Error('PASSWORD_APP environment variable is not set');
        }
        // await driver.pause(1500); 
        await LoginScreen.submitLogin(password);
        console.log('[DEBUG] Login Completed. Clicking LabelOneCash...');
        // await driver.pause(3500); 
        await HomeScreen.clickLabelOneCash();
        console.log('[DEBUG] Clicked LabelOneCash. Clicking ButtonTransfer...');
        await HomeScreen.clickLabelBalance();
        await HomeScreen.clickButtonTransfer();
        console.log('[DEBUG] Clicked ButtonTransfer. Done.');
    });
    
});