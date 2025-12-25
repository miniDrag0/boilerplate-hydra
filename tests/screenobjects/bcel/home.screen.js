const AppScreen = require('../app.screen');
const ElementUtil = require('../../helpers/ElementUtil');
const GestureUtil = require('../../helpers/Gestures');
const LoginScreen = require('./login.screen');
const fs = require('fs');
const path = require('path');
const ImageUtil = require('../../helpers/ImageUtil');

const SELECTORS = {
    ONECASH_LABEL: '//android.widget.TextView[@text="OneCash Wallet"]',
    UNIONPAY_LABEL: '//android.widget.TextView[@text="UnionPay Chip Gold"]',
    TRANSFER_BUTTON: '//android.widget.TextView[@text="Transfer"]',
    SHOW_BALANCE_BUTTON: '//android.widget.TextView[@resource-id="show-balance-button"]',
    BALANCE_LABEL: '//android.widget.TextView[@resource-id="balance-list"]',
    ACCOUNT_TEXTFIELD: '//android.widget.EditText',
    NEXT_BUTTON: '//android.widget.TextView[@resource-id="next"]',
    AMOUNT_TEXTFIELD: '//android.widget.EditText[@resource-id="amount"]',
    AMOUNT_LABEL: '(//android.widget.TextView[contains(@text,"LAK")])[1]',
    QUESTION_1_LABEL: '//android.widget.TextView[@text="Question 1"]',
    ANSWER_1_TEXTFIELD: '//android.widget.EditText[@resource-id="ans1"]',
    ANSWER_2_TEXTFIELD: '//android.widget.EditText[@resource-id="ans2"]',
    ANSWER_3_TEXTFIELD: '//android.widget.EditText[@resource-id="ans3"]',
    DESCRIPTION_TEXTFIELD: '//android.widget.EditText[@resource-id="desc"]',
    DONE_BUTTON: '//android.widget.TextView[@resource-id="done"]',

};

const AMOUNT_LABEL_WAIT_TIMEOUT = 8000;
const AMOUNT_LABEL_SELECTORS = [
    '//android.widget.TextView[@text="Amount"]/following-sibling::android.widget.TextView[contains(@text,"LAK")][1]',
    '(//android.widget.TextView[contains(@text,"LAK")])[1]'
];

class HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }
    get lblOneCash() {
        return $(SELECTORS.ONECASH_LABEL);
    }
    get lblUnionPay() {
        return $(SELECTORS.UNIONPAY_LABEL);
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
    get tfAccount() {
        return $(SELECTORS.ACCOUNT_TEXTFIELD);
    }
    get btnNext() {
        return $(SELECTORS.NEXT_BUTTON);
    }
    get tfAmount() {
        return $(SELECTORS.AMOUNT_TEXTFIELD);
    }
    get lblAmount() {
        return $(SELECTORS.AMOUNT_LABEL);
    }
    get lblQuestion1() {
        return $(SELECTORS.QUESTION_1_LABEL);
    }
    get tfAnswer1() {
        return $(SELECTORS.ANSWER_1_TEXTFIELD);
    }
    get tfAnswer2() {
        return $(SELECTORS.ANSWER_2_TEXTFIELD);
    }
    get tfAnswer3() {
        return $(SELECTORS.ANSWER_3_TEXTFIELD);
    }
    get tfDescription() {
        return $(SELECTORS.DESCRIPTION_TEXTFIELD);
    }
    get btnDone() {
        return $(SELECTORS.DONE_BUTTON);
    }


    async clickLabelOneCash(){
        await ElementUtil.doClick(this.lblOneCash);
    }
    async clickLabelUnionPay(){
        await ElementUtil.doClick(this.lblUnionPay);
    }

    async clickButtonTransfer(){
        await ElementUtil.doClick(this.btnTransfer);
    }

    async clickLabelBalance(){
        await ElementUtil.doClick(this.btnShowBalance);
        const balanceText = await this.lblBalance.getText();
        console.log(balanceText);
        return balanceText;
    }

    async enterAccount(account){
        await ElementUtil.doSetValue(this.tfAccount, account);
        await ElementUtil.doClick(this.btnNext);
    }

    async enterAmount(amount){
        await ElementUtil.doSetValue(this.tfAmount, amount);
        await ElementUtil.doClick(this.btnNext);
    }

    parseAmountToNumber(amount){
        if (amount === undefined || amount === null) {
            throw new Error('Amount is required');
        }
        const sanitized = String(amount).replace(/[^0-9.\-]/g, '');
        if (!sanitized || sanitized === '-' || sanitized === '.') {
            throw new Error(`Amount "${amount}" is not numeric`);
        }
        const numeric = Number(sanitized);
        if (Number.isNaN(numeric)) {
            throw new Error(`Amount "${amount}" is not numeric`);
        }
        return numeric;
    }

    formatAmountForSelector(amount){
        const numeric = typeof amount === 'number' ? amount : this.parseAmountToNumber(amount);
        return numeric.toLocaleString('en-US');
    }

    parseNumericValueFromText(text){
        if (!text) {
            return null;
        }
        const sanitized = String(text).replace(/[^0-9.]/g, '');
        if (!sanitized) {
            return null;
        }
        const numeric = Number(sanitized);
        return Number.isNaN(numeric) ? null : numeric;
    }

    numericValuesMatch(expected, actual){
        if (expected === null || actual === null) {
            return false;
        }
        const difference = Math.abs(expected - actual);
        return difference < 0.0001;
    }

    async findAmountLabelElement(timeoutMsg){
        for (const selector of AMOUNT_LABEL_SELECTORS) {
            try {
                const element = await $(selector);
                await element.waitForDisplayed({
                    timeout: AMOUNT_LABEL_WAIT_TIMEOUT,
                    timeoutMsg
                });
                return element;
            } catch (err) {
                // continue to next selector
            }
        }
        throw new Error(timeoutMsg);
    }

    async verifyDisplayedAmount(expectedAmount, accountName){
        const expectedNumeric = this.parseAmountToNumber(expectedAmount);
        const formatted = this.formatAmountForSelector(expectedNumeric);
        const expectedText = `${formatted} LAK`;
        const timeoutMsg = `Amount label "${expectedText}" did not appear`;
        const element = await this.findAmountLabelElement(timeoutMsg);
        const amountText = await element.getText();
        const actualNumeric = this.parseNumericValueFromText(amountText);
        if (!this.numericValuesMatch(expectedNumeric, actualNumeric)) {
            throw new Error(`Displayed amount "${amountText}" did not match expected "${expectedText}"`);
        }
        await ElementUtil.doClick(this.btnNext);
        return true;
    }

    async verifyDisplayedMutationSuccess(expectedAmount, accountName){
        const expectedNumeric = this.parseAmountToNumber(expectedAmount);
        const formatted = this.formatAmountForSelector(expectedNumeric);
        const expectedText = `${formatted} LAK`;
        const timeoutMsg = `Amount label "${expectedText}" did not appear`;
        const element = await this.findAmountLabelElement(timeoutMsg);
        const amountText = await element.getText();
        await this.captureAmountScreenshot(accountName, amountText);
        const actualNumeric = this.parseNumericValueFromText(amountText);
        if (!this.numericValuesMatch(expectedNumeric, actualNumeric)) {
            throw new Error(`Displayed amount "${amountText}" did not match expected "${expectedText}"`);
        }
        await ElementUtil.doClick(this.btnDone);
        return true;
    }

    async captureAmountScreenshot(accountName, amountText){
        const dateFolder = this.getFormattedTimestamp().split('_')[0];
        const baseDir = process.env.SCREENSHOT_BASE_DIR ? path.resolve(process.env.SCREENSHOT_BASE_DIR) : path.resolve(__dirname, '../../bcel/screenshots/mutasi');
        const screenshotDir = path.join(baseDir, dateFolder);
        if (!fs.existsSync(screenshotDir)){
            fs.mkdirSync(screenshotDir, { recursive: true });
        }
        const timestamp = this.getFormattedTimestamp();
        const safeAccount = String(accountName || 'unknown').replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_-]/g,'');
        const fileName = `${timestamp}-${safeAccount}.png`;
        const filePath = path.join(screenshotDir, fileName);
        await driver.saveScreenshot(filePath);
        try {
            await ImageUtil.resizeImageToLimit(filePath);
        } catch (resizeErr) {
            console.warn('Screenshot resize failed:', resizeErr);
        }
        console.log(`Saved amount verification screenshot: ${filePath} (${amountText})`);
    }

    getFormattedTimestamp(){
        const now = new Date();
        const pad = (value) => String(value).padStart(2, '0');
        const datePart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
        const timePart = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
        return `${datePart}_${timePart}`;
    }

    async verifyRecipientNamePresent(name){
        if (!name) throw new Error('Name must be provided for recipient verification');
        const upperName = name.toUpperCase().replace(/"/g,'').replace(/'/g,'');
        const selector = `//android.widget.TextView[contains(translate(@text,'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'),"${upperName}")]`;
        const element = await $(selector);
        await element.waitForDisplayed({ timeout: 5000 });
        return true;
    }

    async fillInformation(answer1, answer2, answer3, description){
        let questionVisible = false;
        try {
            questionVisible = await this.lblQuestion1.isDisplayed();
        } catch (err) {
            questionVisible = false;
        }
        if(questionVisible){
            await ElementUtil.doSetValue(this.tfAnswer1, answer1);
            await ElementUtil.doClick(this.btnNext);
            await ElementUtil.doSetValue(this.tfAnswer2, answer2);
            await ElementUtil.doClick(this.btnNext);
            await ElementUtil.doSetValue(this.tfAnswer3, answer3);
            await ElementUtil.doClick(this.btnNext);
            await ElementUtil.doSetValue(this.tfDescription, description);
            await ElementUtil.doClick(this.btnNext);
        }else{
            await ElementUtil.doSetValue(this.tfDescription, description);
            await ElementUtil.doClick(this.btnNext);
        }
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
