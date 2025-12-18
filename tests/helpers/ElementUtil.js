class ElementUtil {
    static async doClick(element) {
        if (!element) {
            throw new Error('ElementUtil.doClick received undefined/null element');
        }
        await element.waitForDisplayed();
        await element.click();
    }

    static async doSetValue(element, value) {
        await element.waitForDisplayed();
        await element.setValue(value);
    }
    
    static async doGetText(element) {
        await element.waitForDisplayed();
        return await element.getText();
    }
    
    static async doIsDisplayed(element) {
        return await element.isDisplayed();
    }
}

module.exports = ElementUtil;


