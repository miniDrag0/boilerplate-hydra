const AppScreen = require('../app.screen');
const ElementUtil = require('../../helpers/ElementUtil');

const SELECTORS = {
    LOGIN_BUTTON: '*//android.widget.Button[@text="Login"]',
    PASS_TEXTFIELD: '//android.widget.EditText',
};

class LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }

    get btnLogin() {
        return $(SELECTORS.LOGIN_BUTTON);
    }
    get tfPwd() {
        return $(SELECTORS.PASS_TEXTFIELD);
    }

    async clickButtonLogin(){
        await driver.pause(500);
        await ElementUtil.doClick(this.btnLogin);
        await driver.pause(1000);
    }

    async inputPasswordLogin(password){
        await this.tfPwd.click();
        await this.tfPwd.setValue(password);
        // driver.pause(1000);
    }

    async submitLogin(password){
        if (!await this.btnLogin.isDisplayed()){
            // Updated deprecated launchApp to activateApp
            await driver.execute('mobile: activateApp', { appId: 'com.bcel.bcelone' });
            await driver.pause(1000);
        }
    
        await driver.pause(300)
        await this.inputPasswordLogin(password);
        await driver.pause(3000)
        await this.clickButtonLogin();
    }
}

module.exports = new LoginScreen();
