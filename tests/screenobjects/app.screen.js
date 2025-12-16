class AppScreen {
    constructor(selector) {
        this.selector = selector;
    }

    /**
     * Wait for the screen to be visible
     *
     * @param {boolean} isShown
     * @return {Promise<boolean>}
     */
    async waitForIsShown(isShown = true) {
        return $(this.selector).waitForDisplayed({
            reverse: !isShown,
        });
    }
}

module.exports = AppScreen;

