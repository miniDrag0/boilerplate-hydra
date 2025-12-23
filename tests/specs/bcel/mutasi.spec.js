
const LoginScreen = require('../../screenobjects/bcel/login.screen');
const HomeScreen = require('../../screenobjects/bcel/home.screen');

describe('Feature BCEL', () => {

    it('Login BCEL', async () => {   
        console.log('[DEBUG] Starting Login...');
        // await driver.pause(1500); 
        await LoginScreen.submitLogin("putri07");
        console.log('[DEBUG] Login Completed. Clicking LabelOneCash...');
        // await driver.pause(3500); 
        await HomeScreen.clickLabelOneCash();
        console.log('[DEBUG] Clicked LabelOneCash. Clicking ButtonTransfer...');
        await HomeScreen.clickLabelBalance();
        await HomeScreen.clickButtonTransfer();
        console.log('[DEBUG] Clicked ButtonTransfer. Done.');
    });
    
});