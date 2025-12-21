const AppScreen = require('../app.screen');
const ElementUtil = require('../../helpers/ElementUtil');
const GestureUtil = require('../../helpers/Gestures');
const LoginScreen = require('./login.screen');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const SELECTORS = {
    REMAINING_BALANCE_CARD: '//android.view.View[contains(translate(@content-desc,"abcdefghijklmnopqrstuvwxyz","ABCDEFGHIJKLMNOPQRSTUVWXYZ"),"REMAINING BALANCE")]',
    ACCOUNT_SWITCH: '//android.widget.Switch',
    BALANCE_BADGE: '//android.widget.ImageView[contains(@content-desc,"LAK") and contains(@content-desc,"₭")]',
    BACK_BUTTON: '//android.widget.Button[@content-desc="Back"]',
    TRANSFER_BUTTON: '//android.widget.ImageView[@content-desc="Transfer"]',
    ACCOUNT_TEXTFIELD: '//android.widget.EditText',
    NEXT_BUTTON: '//android.view.View[@content-desc="Next"]',
    
    AMOUNT_TEXTFIELD: '//android.widget.EditText[1]',
    
    DESCRIPTION_TEXTFIELD: '//android.widget.EditText[3]',
    DONE_BUTTON: '(//android.view.View[@content-desc="Confirm"])[2]',
    HOME_BUTTON: '//android.view.View[@content-desc="Home"]',
};

class HomeScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }
   
    get remainingBalanceCard() {
        return $(SELECTORS.REMAINING_BALANCE_CARD);
    }
    get accountSwitch() {
        return $(SELECTORS.ACCOUNT_SWITCH);
    }
    get balanceBadge() {
        return $(SELECTORS.BALANCE_BADGE);
    }
    get btnBack() {
        return $(SELECTORS.BACK_BUTTON);
    }
    get btnTransfer() {
        return $(SELECTORS.TRANSFER_BUTTON);
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
    get tfDescription() {
        return $(SELECTORS.DESCRIPTION_TEXTFIELD);
    }
    get btnDone() {
        return $(SELECTORS.DONE_BUTTON);
    }
    get btnHome() {
        return $(SELECTORS.HOME_BUTTON);
    }
    




    async clickRemainingBalanceCard(){
        const card = await this.remainingBalanceCard;
        await ElementUtil.doClick(card);
    }

    async ensureSwitchEnabled(){
        const toggle = await this.accountSwitch;
        const checked = await toggle.getAttribute('checked');
        if (checked === 'false' || checked === null) {
            await ElementUtil.doClick(toggle);
        }
    }


    async getRemainingBalanceAmount(){
        const card = await this.remainingBalanceCard;
        await card.waitForDisplayed({
            timeout: 5000,
            timeoutMsg: 'Remaining balance card never appeared',
        });
        const desc = await card.getAttribute('content-desc');
        if (!desc) {
            throw new Error('Remaining balance card has no content-desc');
        }
        const match = desc.match(/₭\s*([\d,]+(?:\.\d+)?)/);
        if (!match) {
            throw new Error(`Remaining balance could not be extracted from "${desc}"`);
        }
        
        return match[1];
    }

    async getDynamicBalanceAfterSwitch(){
        await this.ensureSwitchEnabled();
        const badge = await this.balanceBadge;
        await badge.waitForDisplayed({
            timeout: 5000,
            timeoutMsg: 'Balance badge did not appear',
        });
        const desc = await badge.getAttribute('content-desc');
        if (!desc) {
            throw new Error('Balance badge has no content-desc');
        }
        const match = desc.match(/₭\s*([\d,]+(?:\.\d+)?)/);
        if (!match) {
            throw new Error(`Unable to parse balance from "${desc}"`);
        }
        await driver.back();
        return `₭ ${match[1]}`;
    }

    async enterAccount(account){
        await ElementUtil.doClick(this.btnTransfer);
        await ElementUtil.doClick(this.tfAccount);
        await ElementUtil.doSetValue(this.tfAccount, account);
        await ElementUtil.doClick(this.btnNext);
    }

    async enterAmountDescription(amount, description){
        await ElementUtil.doSetValue(this.tfAmount, amount);
        await ElementUtil.doClick(this.btnNext);
        await ElementUtil.doSetValue(this.tfDescription, description);
        await ElementUtil.doClick(this.btnNext);
    }

    formatAmountForSelector(amount){
        const numeric = Number(amount);
        if (Number.isNaN(numeric)) {
            throw new Error(`Amount "${amount}" is not numeric`);
        }
        return numeric.toLocaleString('en-US');
    }

    async verifyDisplayedAmount(expectedAmount, accountName){
        const formatted = this.formatAmountForSelector(expectedAmount);
        const expectedText = `${formatted} LAK`;
        const selector = `(//android.widget.TextView[@text="${expectedText}"])[1]`;
        const element = await $(selector);
        await element.waitForDisplayed({
            timeout: 2000,
            timeoutMsg: `Amount label "${expectedText}" did not appear`
        });
        const amountText = await element.getText();
        if (amountText === expectedText) {
            await ElementUtil.doClick(this.btnNext);
        }
        if (amountText !== expectedText) {
            throw new Error(`Displayed amount "${amountText}" did not match expected "${expectedText}"`);
        }
        return true;
    }

    async verifyDisplayedMutationSuccess(expectedAmount, accountName){
        const formatted = this.formatAmountForSelector(expectedAmount);
        const expectedText = `${formatted} LAK`;
        const selector = `(//android.widget.TextView[@text="${expectedText}"])[1]`;
        const element = await $(selector);
        await element.waitForDisplayed({
            timeout: 2000,
            timeoutMsg: `Amount label "${expectedText}" did not appear`
        });
        const amountText = await element.getText();
        await this.captureAmountScreenshot(accountName, amountText);
        if (amountText === expectedText) {
            await ElementUtil.doClick(this.btnDone);
        }
        if (amountText !== expectedText) {
            throw new Error(`Displayed amount "${amountText}" did not match expected "${expectedText}"`);
        }
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
            const image = await Jimp.read(filePath);
            await image.resize(800, Jimp.AUTO).quality(60).writeAsync(filePath);
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

    async verifyRecipientCardVisible(name){
        if (!name) throw new Error('Name must be provided for recipient verification');
        const upperName = name.toUpperCase().replace(/"/g,'').replace(/'/g,'');
        const selector = `//android.widget.ImageView[contains(translate(@content-desc,'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'),"${upperName}")]`;
        const element = await $(selector);
        await element.waitForDisplayed({ timeout: 5000 });
        return true;
    }

    formatAmountBadge(amount){
        const numeric = Number(amount);
        if (Number.isNaN(numeric)) {
            throw new Error(`Amount "${amount}" is not numeric`);
        }
        return numeric.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    }

    async verifyRecipientAndAmount(name, amount){
        if (!name) throw new Error('Recipient name is required');
        if (amount === undefined || amount === null) throw new Error('Amount is required');
        const formattedAmount = this.formatAmountBadge(amount);
        const upperName = name.toUpperCase().replace(/"/g,'').replace(/'/g,'');
        const selector = `//android.view.View[contains(translate(@content-desc,'abcdefghijklmnopqrstuvwxyz','ABCDEFGHIJKLMNOPQRSTUVWXYZ'),"${upperName}")]/following-sibling::android.view.View[contains(@content-desc,"₭ ${formattedAmount}")]`;
        const element = await $(selector);
        await element.waitForDisplayed({
            timeout: 5000,
            timeoutMsg: `Recipient card for "${name}" with amount "₭ ${formattedAmount}" did not appear`
        });
        await ElementUtil.doClick(this.btnDone);
        return true;
    }

    async verifyAmountAndCapture(amount, accountName){
        if (amount === undefined || amount === null) throw new Error('Amount is required');
        const formattedAmount = this.formatAmountBadge(amount);
        const selector = `//android.view.View[contains(@content-desc,"₭ ${formattedAmount}")]`;
        const element = await $(selector);
        await element.waitForDisplayed({
            timeout: 5000,
            timeoutMsg: `Amount "₭ ${formattedAmount}" did not appear`
        });
        const desc = await element.getAttribute('content-desc');
        const screenshotRef = desc || `₭ ${formattedAmount}`;
        await this.captureAmountScreenshot(accountName, screenshotRef);
        await ElementUtil.doClick(this.btnHome);
        return true;
    }
    
}

module.exports = new HomeScreen();
