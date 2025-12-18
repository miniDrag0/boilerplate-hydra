
const LoginScreen = require('../../screenobjects/bcel/login.screen');
const HomeScreen = require('../../screenobjects/bcel/home.screen');

describe('Feature BCEL', () => {

    it('Login BCEL', () => {   
        driver.pause(1500); 
        LoginScreen.submitLogin("putri07");
        driver.pause(3500); 
        HomeScreen.clickLabelOneCash();
        // HomeScreen.clickLabelBalance();
        HomeScreen.clickButtonTransfer();
    });
    
});