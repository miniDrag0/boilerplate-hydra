const AppScreen = require('../app.screen');
const ElementUtil = require('../../helpers/ElementUtil');

const SELECTORS = {
    MBCA_BUTTON: 'id=main_btn_bca',
    EDIT_TEXTFIELD: 'id=login_edit_text',
    CANCEL_BUTTON: 'id=login_cancel_button',
    OK_BUTTON: 'id=login_ok_button',
    HOME_SCREEN: '~Home-screen'
};

class LoginScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }

    get btnMBCA() {
        return $(SELECTORS.MBCA_BUTTON);
    }
    get tfEdit() {
        return $(SELECTORS.EDIT_TEXTFIELD);
    }
    get btnCancel() {
        return $(SELECTORS.CANCEL_BUTTON);
    }
    get btnOK() {
        return $(SELECTORS.OK_BUTTON);
    }

    clickButtonMBCA(){
        // if(driver.getCurrentActivity() !== ".mobile.MainActivity"){
        //     driver.launchApp();
        // }
        driver.pause(1000);
        ElementUtil.doClick(this.btnMBCA);
        
    }

    clickButtonOk(){
        ElementUtil.doClick(this.btnOK);
        // driver.pause(1000);
    }

    enterPasskey(key){
        ElementUtil.doSetValue(this.tfEdit, key);
        // driver.pause(1000);
    }
}

module.exports = new LoginScreen();
