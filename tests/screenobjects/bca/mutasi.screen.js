const AppScreen = require('../app.screen');
const ElementUtil = require('../../helpers/ElementUtil');
const HomeScreen = require('../../screenobjects/bca/home.screen');
const InfoScreen = require('../../screenobjects/bca/info.screen');
const LoginScreen = require('../../screenobjects/bca/login.screen');

const SELECTORS = {
    TRANSAKSI_LABEL: 'id=jenis_transaksi_inputtext',
    START_DATE_LABEL: 'id=mutasi_rekening_et_startdate',
    END_DATE_LABEL: 'id=mutasi_rekening_et_enddate',
    OK_DATE_LABEL: 'id=android:id/button1',
    CANCEL_DATE_LABEL: 'id=button2',
    SEND_BUTTON: 'id=button_title_right',
    POPUP_BUTTON: '~PopUp Button - Back',
    MBCA_BUTTON: 'id=main_btn_bca', //button BCA di home
    INFO_BUTTON: '~Icon m-Info',
    HOME_SCREEN: '~Home-screen'
};

class MutasiScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }

    get lblTransaksi() {
        return $(SELECTORS.TRANSAKSI_LABEL);
    }

    get lblStartDate() {
        return $(SELECTORS.START_DATE_LABEL);
    }

    get lblEndDate() {
        return $(SELECTORS.END_DATE_LABEL);
    }

    get lblOkDate() {
        return $(SELECTORS.OK_DATE_LABEL);
    }

    get lblCancelDate() {
        return $(SELECTORS.CANCEL_DATE_LABEL);
    }

    get btnSend() {
        return $(SELECTORS.SEND_BUTTON);
    }

    get btnPopUp() {
        return $(SELECTORS.POPUP_BUTTON);
    }

    get btnMBCA() {
        return $(SELECTORS.MBCA_BUTTON);
    }

    get btnInfo() {
        return $(SELECTORS.INFO_BUTTON);
    }

    clickLabelTransaksi(){
        ElementUtil.doClick(this.lblTransaksi);
        driver.pause(1000);
    }

    clickLabelStartDate(date){
        ElementUtil.doClick(this.lblStartDate);
        ElementUtil.doClick($('~'+date));
        driver.pause(1000);
    }

    clickLabelEndDate(date){
        ElementUtil.doClick(this.lblEndDate);
        ElementUtil.doClick($('~'+date));
        driver.pause(1000);
    }

    clickLabelOkDate(){
        ElementUtil.doClick(this.lblOkDate);
        driver.pause(1000);
    }

    clickLabelCancelDate(){
        ElementUtil.doClick(this.lblCancelDate);
        driver.pause(1000);
    }

    clickButtonSend(pass) {
        if($$('id=main_btn_bca').length !== 0){
            LoginScreen.clickButtonMBCA();
            LoginScreen.tfEdit.setValue(pass);//data.bank_password
            LoginScreen.clickButtonOk(); 
            HomeScreen.clickButtonInfo(); 
            InfoScreen.clickLabelMutasi();
        }else{
            if($$('id=button_title_right').length === 0) { //check kalau masih nyangkut
                driver.back();
                if (this.btnInfo.isDisplayed()){
                    HomeScreen.clickButtonLogout();
                }
            }
        }
        for (let i = 0; i < 15; i++) {
          try {
            ElementUtil.doClick(this.btnSend);
            if (this.btnPopUp.isDisplayed()) {
              ElementUtil.doClick(this.btnPopUp);
            } else {
            //   driver.back(); // klik back jika tombol send tidak ditemukan
              break;
            }
          } catch (error) {
            console.error('Error occurred while clicking the button:', error);
            // driver.back(); // klik back jika terjadi kesalahan
            break;
          }
        }
    }
}

module.exports = new MutasiScreen();
