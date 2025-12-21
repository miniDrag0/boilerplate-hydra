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
        await this.btnLogin.click();
    }


    async dismissDontShowAgain(){
        try {
            await this.btnDontShowAgain.waitForDisplayed({ timeout: 1000 });
            await this.btnDontShowAgain.click();
        } catch (error) {
            // ignore if not present
        }
    }

    async ensureAppActive(){
        if (!await this.btnLogin.isDisplayed()){
            await driver.execute('mobile: activateApp', { appId: 'com.ldb.wallet' });
        }
        await this.btnLogin.waitForDisplayed({ timeout: 1000 });
    }

    async submitLogin(password){
        await this.dismissDontShowAgain();
        await this.ensureAppActive();
        await this.clickButtonLogin();
        await this.inputPin(password);
       
    }

    async loginIfNeeded(password){
        let loginVisible = false;
        try {
            loginVisible = await this.btnLogin.isDisplayed();
        } catch (err) {
            loginVisible = false;
        }
        if (loginVisible) {
            await this.submitLogin(password);
        }
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
