const { config } = require('./wdio.bca.conf');
const path = require('path');

// ============
// Specs
// ============
config.specs = [
    path.join(__dirname, '../tests/specs/bca/mutasi.spec.scroll.js')
];

// ============
// Capabilities
// ============
// For all capabilities please check
// http://appium.io/docs/en/writing-running-appium/caps/#general-capabilities
config.capabilities = [
    {
        // The defaults you need to have in your config
        platformName: 'Android',
        maxInstances: 1,
        // For W3C the appium capabilities need to have an extension prefix
        // http://appium.io/docs/en/writing-running-appium/caps/
        // This is `appium:` for all Appium Capabilities which can be found here
        'appium:deviceName': process.env.DEVICE_BCA,
        'appium:platformVersion': process.env.DEVICE_BCA_OS_VERSION,
        'appium:orientation': 'PORTRAIT',
        'appium:udid': process.env.DEVICE_BCA,
        // `automationName` will be mandatory, see
        // https://github.com/appium/appium/releases/tag/v1.13.0
        'appium:automationName': 'UiAutomator2',
        // The path to the app
        // Read the reset strategies very well, they differ per platform, see
        // http://appium.io/docs/en/writing-running-appium/other/reset-strategies/
        'appium:noReset': true,
        'appium:newCommandTimeout': 240,
        'appium:appPackage':'com.bca',
        'appium:appActivity':'com.bca.mobile.MainActivity'  //com.gojek.home.splash.GojekSplashActivity
    },
];

exports.config = config;
