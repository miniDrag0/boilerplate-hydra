const AppScreen = require('../app.screen');
const ElementUtil = require('../../helpers/ElementUtil');
const GestureUtil = require('../../helpers/Gestures');
const LoginScreen = require('./login.screen');

const SELECTORS = {
    ONECASH_LABEL: '//android.widget.TextView[@text="OneCash Wallet"]',
    TRANSFER_BUTTON: 'id=TRANSFERbutton',
    SHOW_BALANCE_BUTTON: 'id=show-balance-button',
    BALANCE_LABEL: 'id=balance-list',
};

class HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }
    get lblOneCash() {
        return $(SELECTORS.ONECASH_LABEL);
    }
    get lblBalance() {
        return $(SELECTORS.BALANCE_LABEL);
    }
    get btnTransfer() {
        return $(SELECTORS.TRANSFER_BUTTON);
    }
    get btnShowBalance() {
        return $(SELECTORS.SHOW_BALANCE_BUTTON);
    }


    async clickLabelOneCash(){
        await ElementUtil.doClick(this.lblOneCash);
    }

    async clickButtonTransfer(){
        await ElementUtil.doClick(this.btnTransfer);
    }

    async clickLabelBalance(){
        await ElementUtil.doClick(this.btnShowBalance);
        console.log(await this.lblBalance.getText());
    }



    async clickButtonSaldo(){
        await $('android=new UiScrollable(new UiSelector().resourceIdMatches(\".*:id/nsv_home\").scrollable(true)).scrollIntoView(new UiSelector().resourceIdMatches(\".*:id/rv_widget\"))');

        const elem = await $(SELECTORS.SALDO_BUTTON);
        await elem.click();

    }


    clickButtonHistory(access_pass){
        try {
            if (LoginScreen.btnLogin.isDisplayed()){
                LoginScreen.submitLogin(access_pass)
            }
            let maxAttempts = 10;
            while (maxAttempts > 0) {
                GestureUtil.swipeUp(0.2);
                if (this.cardView.isDisplayed()) {
                    ElementUtil.doClick(this.cardView);
                    return;
                }
                maxAttempts--;
            }
            // Jika maxAttempts mencapai 0 dan cardView belum ditemukan, restart aplikasi
            if (maxAttempts === 0) {
                console.warn('Max attempts reached. Restarting the app...');
                ElementUtil.doClick(this.btnNavScroll);
                ElementUtil.doClick(this.cardView);
            }
        } catch (error) {
            console.error('Error parsing Element:', error);
            driver.launchApp();
        }
        
    }

    clickButtonHistoryV2(access_pass){
        try {
            if (LoginScreen.btnLogin.isDisplayed()){
                LoginScreen.submitLogin(access_pass)
            }
        
            ElementUtil.doClick(this.btnViewBalance);
        } catch (error) {
            console.error('Error parsing Element:', error);
            driver.launchApp();
        }
        
    }

    clickButtonSaldo() {
        let maxAttempts = 10;
        while (maxAttempts > 0) {
            GestureUtil.swipeUp(0.2);
            if (this.btnSaldo.isDisplayed()) {
                ElementUtil.doClick(this.btnSaldo);
                return;
            }
            maxAttempts--;
        }
        console.log("Tombol saldo tidak ditemukan setelah 10 kali swipe up.");
    }

    clickLabelSaldo(){
        // this.clickButtonSaldo();
        let balance = "";
        try {
            GestureUtil.swipeUp(0.2);
            if(!this.lblBalance.isDisplayed()){
                this.clickButtonSaldo();   
            }
            balance = this.removePunctuation(this.lblBalance.getText());    
            // balance = this.removePunctuation(this.lblBalance.getText());
        } catch (error) {
            console.error('Gagal mendapatkan teks atau mengklik elemen:', error);
        }
        
        return balance;
    }

    clickLabelSaldoV2(){
        let balance = "";
        try {
            if(this.lblBalanceView.getText().includes('*')){
                ElementUtil.doClick(this.btnShowHideBalance);  
            }
            balance = this.removePunctuation(this.lblBalanceView.getText());    
        } catch (error) {
            console.error('Gagal mendapatkan teks atau mengklik elemen:', error);
        }
        
        return balance;
    }

    removePunctuation(input) {
        // Hapus semua karakter selain angka
        let cleanNumber = input.replace(/\D/g, '');

        let withoutRp = cleanNumber.replace(/^Rp\s*/, '');
        let numberWithoutLastTwoDigits = withoutRp.slice(0, -2);
        return numberWithoutLastTwoDigits;

    }

    clickButtonBayar(){
        ElementUtil.doClick(this.btnBayar);
    }

    clickButtonTransferRupiah(){
        ElementUtil.doClick(this.btnTransfer);
    }

    // VA transfer flow (kept separate to avoid overriding the main transfer button click)
    clickButtonTransferVA(VANumber){
        if (!this.tfVA || !this.listVA || this.listVA.length === 0) {
            throw new Error('VA transfer elements not defined on HomeScreen');
        }
        ElementUtil.doClick(this.tfVA);
        this.tfVA.setValue(VANumber.substring(0, 5));
        GestureUtil.swipeUp(1)
        GestureUtil.swipeUp(1)
        GestureUtil.swipeUp(1)
        GestureUtil.swipeUp(1)
        GestureUtil.swipeUp(1)
        GestureUtil.swipeUp(1)
        GestureUtil.swipeUp(1)
        ElementUtil.doClick(this.listVA[0]);
    }
    
}

module.exports = new HomeScreen();
