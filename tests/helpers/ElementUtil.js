class ElementUtil {
    static doClick(element) {
        element.waitForDisplayed();
        element.click();
    }

    static doSetValue(element, value) {
        element.waitForDisplayed();
        element.setValue(value);
    }
    
    static doGetText(element) {
        element.waitForDisplayed();
        return element.getText();
    }
    
    static doIsDisplayed(element) {
        return element.isDisplayed();
    }
}

module.exports = ElementUtil;

