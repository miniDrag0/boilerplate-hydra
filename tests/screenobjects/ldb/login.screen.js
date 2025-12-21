const AppScreen = require('../app.screen');
const ElementUtil = require('../../helpers/ElementUtil');

const SELECTORS = {
    LOGIN_BUTTON: '//android.widget.ImageView[@content-desc="Login"]',
    BUTTON_DONT_SHOW_AGAIN: '//android.widget.Button[@content-desc="Don\'t show again"]',
};

class LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }

    get btnLogin() {
        return $(SELECTORS.LOGIN_BUTTON);
    }

    get btnDontShowAgain() {
        return $(SELECTORS.BUTTON_DONT_SHOW_AGAIN);
    }

    async clickButtonLogin(){
        await driver.pause(500);
        await this.btnLogin.click();
        await driver.pause(1000);
    }


    async submitLogin(password){
        try {
            await this.btnDontShowAgain.click();
        } catch (error) {
            // ignore
        }
        if (!await this.btnLogin.isDisplayed()){
            // Updated deprecated launchApp to activateApp
            await driver.execute('mobile: activateApp', { appId: 'com.ldb.wallet' });
            await driver.pause(1000);
        }
    
        await clickButtonLogin();
        await this.inputPin(password);

    }

    async inputPin(pin) {
        const digits = String(pin).split('');

        for (const digit of digits) {
            const selector = `//android.view.View[@content-desc="${digit}"]`;
            const button = await $(selector);
            await button.waitForDisplayed({ timeout: 5000 });
            await button.click();
        }
    }
}

module.exports = new LoginScreen();
