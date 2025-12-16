const AppScreen = require('../app.screen');
const ElementUtil = require('../../helpers/ElementUtil');
const GestureUtil = require('../../helpers/Gestures');

const SELECTORS = {
    PIN_TEXTFIELD: 'id=input_text',
    PIN_TEXTFIELD_ANTARBANK: 'id=pin_dialog_input_text',
    OK_PIN_BUTTON: 'id=button_2',
    CANCEL_PIN_BUTTON: 'id=button_1',
    OK_PIN_BUTTON_ANTARBANK: 'id=pin_ok_button',
    CANCEL_PIN_BUTTON_ANTARBANK: 'id=pin_cancel_button',
    PIN_1: 'id=pass1',
    PIN_2: 'id=pass2',
    PIN_3: 'id=pass3',
    PIN_4: 'id=pass4',
    PIN_5: 'id=pass5',
    PIN_6: 'id=pass6',
};

class PINScreen extends AppScreen {
    constructor () {
        super(SELECTORS.HOME_SCREEN);
    }
    get btnOK() {
        return $(SELECTORS.OK_PIN_BUTTON);
    }

    get btnCancel() {
        return $(SELECTORS.CANCEL_PIN_BUTTON);
    }

    get tfPIN() {
        return $(SELECTORS.PIN_TEXTFIELD);
    }

    get btnOKAntarBank() {
        return $(SELECTORS.OK_PIN_BUTTON_ANTARBANK);
    }

    get btnCancelAntarBank() {
        return $(SELECTORS.CANCEL_PIN_BUTTON_ANTARBANK);
    }

    get tfPINAntarBank() {
        return $(SELECTORS.PIN_TEXTFIELD_ANTARBANK);
    }
    get tfPIN1() {
        return $(SELECTORS.PIN_1);
    }
    get tfPIN2() {
        return $(SELECTORS.PIN_2);
    }
    get tfPIN3() {
        return $(SELECTORS.PIN_3);
    }
    get tfPIN4() {
        return $(SELECTORS.PIN_4);
    }
    get tfPIN5() {
        return $(SELECTORS.PIN_5);
    }
    get tfPIN6() {
        return $(SELECTORS.PIN_6);
    }

    clickButtonOK(){
        driver.pause(500);
        ElementUtil.doClick(this.btnOK);
        driver.pause(1000);
    }

    clickButtonCancel(date){
        ElementUtil.doClick(this.btnCancel);
        driver.pause(1000);
    }

    clickButtonOKAntarBank(){
        driver.pause(500);
        ElementUtil.doClick(this.btnOKAntarBank);
        driver.pause(1000);
    }

    clickButtonCancelAntarBank(date){
        ElementUtil.doClick(this.btnCancelAntarBank);
        driver.pause(1000);
    }
    setPINValue(pin){
        if (pin.length !== 6 || !/^[0-9]{6}$/.test(pin)) {
            throw new Error('PIN must be a 6-digit numeric string.');
        }

        // Map each digit to its respective PIN field
        const pinFields = [
            this.tfPIN1,
            this.tfPIN2,
            this.tfPIN3,
            this.tfPIN4,
            this.tfPIN5,
            this.tfPIN6,
        ];

        // Iterate through each digit and set the value in the corresponding field
        for (let i = 0; i < pin.length; i++) {
            pinFields[i].setValue(pin[i]);
        }
    }

    get pinCoordinates() {
        const method = process.env.DEVICE_BCA_PIN_METHOD;
        if (method === '1') {
            return {
                '1': { x: 163, y: 1600 },
                '2': { x: 542, y: 1570 },
                '3': { x: 742, y: 1570 },
                '4': { x: 163, y: 1888 },
                '5': { x: 542, y: 1888 },
                '6': { x: 742, y: 1888 },
                '7': { x: 163, y: 2014 },
                '8': { x: 542, y: 2000 },
                '9': { x: 742, y: 2000 },
                '0': { x: 542, y: 2111 },
            };
        } else if (method === '2') {
            return {
                '1': { x: 163, y: 1600 },
                '2': { x: 542, y: 1600 },
                '3': { x: 742, y: 1600 },
                '4': { x: 163, y: 1800 },
                '5': { x: 542, y: 1800 },
                '6': { x: 742, y: 1800 },
                '7': { x: 163, y: 2000 },
                '8': { x: 542, y: 2000 },
                '9': { x: 742, y: 2000 },
                '0': { x: 542, y: 2111 },
            };
        } else {
            // Default to method 1 if no method is selected
            return {
                '1': { x: 163, y: 1600 },
                '2': { x: 542, y: 1570 },
                '3': { x: 742, y: 1570 },
                '4': { x: 163, y: 1888 },
                '5': { x: 542, y: 1888 },
                '6': { x: 742, y: 1888 },
                '7': { x: 163, y: 2014 },
                '8': { x: 542, y: 2000 },
                '9': { x: 742, y: 2000 },
                '0': { x: 542, y: 2111 },
            };
        }
    }

    // Function to tap by coordinates
    tapByCoordinate(x, y) {
        driver.touchAction({
            action: 'tap',
            x: x,
            y: y
        });
    }

    // Function to tap based on PIN numbers
    tapByPin(pin) {
        try{
            this.tfPINAntarBank.setValue(pin);
            if(this.btnOKAntarBank.isDisplayed()){
                this.clickButtonOKAntarBank()
            }else{
                this.clickButtonOK()
            }
            return
        }catch(err){
            //not tfPinAntarBank
        }
        try{
            this.tfPINAntarBank.setValue(pin);
            if(this.btnOKAntarBank.isDisplayed()){
                this.clickButtonOKAntarBank()
            }else{
                this.clickButtonOK()
            }
            return;
        }catch(err){
            //not tfPin
        }
        const coordinates = this.pinCoordinates;

        for (const digit of pin) {
            if (coordinates[digit]) {
                const { x, y } = coordinates[digit];
                this.tapByCoordinate(x, y);
            } else {
                throw new Error(`No coordinates defined for digit: ${digit}`);
            }
        }
    }
}

module.exports = new PINScreen();