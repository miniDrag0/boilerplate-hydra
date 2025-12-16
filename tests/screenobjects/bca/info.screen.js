const AppScreen = require('../app.screen');
const HomeScreen = require('../bca/home.screen');
const ElementUtil = require('../../helpers/ElementUtil');

const SELECTORS = {
    MUTASI_LABEL: '//android.view.ViewGroup[@content-desc="menu info mutasi rekening "]',
    SALDO_LABEL: '//android.view.ViewGroup[@content-desc="menu info saldo "]/android.widget.TextView',
    POPUP_BUTTON: '~PopUp Button - Back',
    BALANCE_LABEL: '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.widget.ScrollView/android.widget.LinearLayout/android.widget.HorizontalScrollView/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.TableLayout/android.widget.TableRow/android.widget.TextView[3]',
    // '/hierarchy/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.view.ViewGroup/android.webkit.WebView/android.webkit.WebView/android.view.View/android.view.View/android.view.View/android.view.View[3]/android.widget.TextView',
    POPUP_OK_BUTTON: '~PopUp Button - OK'
};

class InfoScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }

    get lblMutasi() {
        return $(SELECTORS.MUTASI_LABEL);
    }

    get lblSaldo() {
        return $(SELECTORS.SALDO_LABEL);
    }

    get lblBalance() {
        return $(SELECTORS.BALANCE_LABEL);
    }

    get btnPopUp() {
        return $(SELECTORS.POPUP_BUTTON);
    }

    get btnPopUpOk() {
        return $(SELECTORS.POPUP_OK_BUTTON);
    }

    clickLabelSaldo(){
        let balance = "";
        for (let i = 0; i < 10; i++) {
            ElementUtil.doClick(this.lblSaldo);
            if(this.btnPopUp.isDisplayed()){
                ElementUtil.doClick(this.btnPopUp);
            }else{
                break;
            }
        }

        try {
            if(this.lblBalance.isDisplayed()){
                balance = this.removePunctuation(this.lblBalance.getText());    
                ElementUtil.doClick(this.btnPopUpOk);
            }
            // balance = this.removePunctuation(this.lblBalance.getText());
        } catch (error) {
            console.error('Gagal mendapatkan teks atau mengklik elemen:', error);
            // Anda dapat melakukan tindakan lanjutan jika diperlukan, seperti menangani kesalahan atau melanjutkan eksekusi kode.
        }
        
        return balance;
    }

    clickLabelSaldoV2(){
        let balance = "";
        let retryCount=0;
        while(balance==="" && retryCount<15){
            if(!this.lblSaldo.isDisplayed()){
                HomeScreen.clickButtonHome("");  
                HomeScreen.clickButtonInfo(); 
                driver.pause(1000);
            }
            ElementUtil.doClick(this.lblSaldo);
            driver.pause(200);
            if(this.btnPopUp.isDisplayed()){
                ElementUtil.doClick(this.btnPopUp);
            }else if(this.lblBalance.isDisplayed()){
                balance = this.removePunctuation(this.lblBalance.getText());    
                ElementUtil.doClick(this.btnPopUpOk);
            }
            retryCount++;
        }
        return balance;
        
    }

    clickCloseSaldoButton(){
        for (let i = 0; i < 10; i++) {
            // ElementUtil.doClick(this.btnPopUpOk);
            if(this.btnPopUpOk.isDisplayed()){
                ElementUtil.doClick(this.btnPopUpOk);
            }else{
                break;
            }
        }
    }

    removePunctuation(input) {
        // Menghapus tanda titik (.) dan digit setelahnya
        let withoutDecimal = input.replace(/\.\d+/, '');
    
        // Menghapus tanda koma (,) dari angka
        let withoutCommas = withoutDecimal.replace(/,/g, '');
    
        return withoutCommas;
    }

    clickLabelMutasi(){
        for (let i = 0; i < 10; i++) {
            ElementUtil.doClick(this.lblMutasi);
            if(this.btnPopUp.isDisplayed()){
                ElementUtil.doClick(this.btnPopUp);
            }else{
                break;
            }
        }
        // ElementUtil.doClick(this.lblMutasi);
        // driver.pause(500);
    }
}

module.exports = new InfoScreen();