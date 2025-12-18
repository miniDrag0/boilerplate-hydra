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

    clickButtonLogin(){
        driver.pause(500);
        ElementUtil.doClick(this.btnLogin);
        driver.pause(1000);
    }

    inputPasswordLogin(password){
        this.tfPwd.click();
        this.tfPwd.setValue(password);
        // driver.pause(1000);
    }

    submitLogin(password){
        if (!this.btnLogin.isDisplayed()){
            driver.launchApp();
            driver.pause(1000);
        }
    
        driver.pause(300)
        this.inputPasswordLogin(password);
        driver.pause(3000)
        this.clickButtonLogin();
    }
}

module.exports = new LoginScreen();
