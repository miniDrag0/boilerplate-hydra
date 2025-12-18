
const LoginScreen = require('../../screenobjects/bcel/login.screen');
const HomeScreen = require('../../screenobjects/bcel/home.screen');

describe('Feature BCEL', () => {

    it('Login BCEL', async () => {   
        await driver.pause(1500); 
        await LoginScreen.submitLogin("putri07");
        await driver.pause(3500); 
        await HomeScreen.clickLabelOneCash();
        // HomeScreen.clickLabelBalance();
        await HomeScreen.clickButtonTransfer();
    });
    
});