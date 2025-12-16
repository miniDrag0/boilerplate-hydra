const AppScreen = require('../app.screen');
const ElementUtil = require('../../helpers/ElementUtil');
const LoginScreen = require('./login.screen');

const SELECTORS = {
    NAME_LABEL: 'id=cis_name_text_view',
    HOME_BUTTON: '~BottomNav Icon - Home',
    INFO_BUTTON: '~Icon m-Info',
    TRANSFER_BUTTON: '~Icon m-Transfer',
    POPUP_BUTTON: '~PopUp Button - Back',
    LOGOUT_BUTTON: 'id=button_title_right_logout',
    ACCEPT_BUTTON: '~PopUp Button - Logout',
    OK_BUTTON: '~PopUp Button - OK',
};

class HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }

    get btnInfo() {
        return $(SELECTORS.INFO_BUTTON);
    }

    get btnHome() {
        return $(SELECTORS.HOME_BUTTON);
    }

    get btnTransfer() {
        return $(SELECTORS.TRANSFER_BUTTON);
    }

    get btnPopUp() {
        return $(SELECTORS.POPUP_BUTTON);
    }

    get btnLogout() {
        return $(SELECTORS.LOGOUT_BUTTON);
    }

    get btnAcceptLogout() {
        return $(SELECTORS.ACCEPT_BUTTON);
    }

    get btnOKPopUp() {
        return $(SELECTORS.OK_BUTTON);
    }

    clickButtonInfo(pass){
        if($$('id=main_btn_bca').length !== 0){
            LoginScreen.clickButtonMBCA();
            driver.pause(1000);
            LoginScreen.tfEdit.setValue(pass);//data.bank_password
            LoginScreen.clickButtonOk(); 
            ElementUtil.doClick(this.btnInfo);
        }else if($$(SELECTORS.POPUP_BUTTON).length !== 0) { //Handle jika nyangkut yang perlu back
            if(this.btnPopUp.isDisplayed()){
                this.btnPopUp.click();  //Click Pop Up Button Back
                if($$('id=button_title_right').length !== 0) { //check kalau masih nyangkut
                    driver.back(); //Click Back ke M Info
                }
            }
        }else if($$(SELECTORS.OK_BUTTON).length !== 0) { //Handle jika nyangkut yang perlu click OK
            if(this.btnOKPopUp.isDisplayed()){
                this.btnOKPopUp.click();  //Click Pop Up Button OK
            }
        }else{
            const isDisplayed = this.btnInfo.isDisplayed();

            if (isDisplayed) {
                ElementUtil.doClick(this.btnInfo);
            } else {
                console.log('Tombol btnInfo tidak terlihat, tidak dapat diklik.');
            }
        }        
    }

    clickButtonTransfer(){
        const isDisplayed = this.btnTransfer.isDisplayed();

        if (isDisplayed) {
            ElementUtil.doClick(this.btnTransfer);
        } else {
            console.log('Tombol btnTransfer tidak terlihat, tidak dapat diklik.');
        }
    }

    clickButtonLogout(){
        ElementUtil.doClick(this.btnLogout);
        ElementUtil.doClick(this.btnAcceptLogout);
        // driver.pause(1000);
    }

    clickButtonHome(access_pass, retryCount = 0){
        if (LoginScreen.btnMBCA.isDisplayed()){
            LoginScreen.clickButtonMBCA();
            driver.pause(1000);
            LoginScreen.tfEdit.setValue(access_pass);//data.bank_password
            LoginScreen.clickButtonOk(); 
        }
        try {
            ElementUtil.doClick(this.btnHome);
        } catch (error) {
            if (retryCount < 10) { 
                driver.back();
                driver.pause(1000);
                this.clickButtonHome(access_pass, retryCount + 1); 
            } else {
                throw new Error("Failed click tombol Home ");
            }
        }
    }


}

module.exports = new HomeScreen();
