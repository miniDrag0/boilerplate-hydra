require('dotenv').config();
const path = require('path');
const slack = require('wdio-slack-service');
const appiumPort = parseInt(process.env.PORT_BCEL, 10) || 4725;
exports.config = {
    // ====================
    // Runner and framework
    // Configuration
    // ====================
    runner: 'local',
    framework: 'jasmine',
    jasmineOpts: {
        // Updated the timeout to 30 seconds due to possible longer appium calls
        // When using XPATH
        defaultTimeoutInterval: 990000,//change ke 90000 untuk production ini kepentingan debug
        helpers: [require.resolve('@babel/register')],
    },
    logLevel: 'warn',
    deprecationWarnings: true,
    bail: 0,
    baseUrl: 'http://the-internet.herokuapp.com',
    waitforTimeout: 30000,//10000 -> 30000
    connectionRetryTimeout: 90000,//50000 -> 90000
    connectionRetryCount: 1,
    reporters: ['spec'],

    // ====================
    // Appium Configuration
    // ====================
    services: [
        [
            'appium',
            {
            // For options see
            // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
                args: {
                    // Auto download ChromeDriver
                    relaxedSecurity: true,
                    port: appiumPort,
                    address: '127.0.0.1',
                    // chromedriverAutodownload: true,
                    // For more arguments see
                    // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
                },
                logPath: './logs', // capture Appium server logs for debugging
                command: path.join(__dirname, '..', 'appium-launcher.cmd'),
            },
        ],
      //   [slack, {
      //     webHookUrl: process.env.SLACK_HOOK || "https://hooks.slack.com/services/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", // Used to post notification to a particular channel
      //     notifyOnlyOnFailure: false, // Send notification only on test failure
      //     messageTitle: "STAGING MOBILE MANDIRI" // Name of the notification
      // }],
    ],
    port: appiumPort,

    beforeSession: function (capabilities, specs) {
        const { execSync } = require('child_process');

        // Perintah untuk uninstall uiautomator2.server
        const uninstallServerCommand = 'adb -s ' + process.env.DEVICE_BCEL + ' uninstall io.appium.uiautomator2.server';

        // Perintah untuk uninstall uiautomator2.server.test
        const uninstallServerTestCommand = 'adb -s ' + process.env.DEVICE_BCEL + ' uninstall io.appium.uiautomator2.server.test';

        // Eksekusi perintah adb secara sinkron
        try {
            execSync(uninstallServerCommand, { stdio: 'ignore' });
            console.log(`'${uninstallServerCommand}' executed successfully.`);
        } catch (error) {
            // Ignore error if package not installed
            console.log(`Note: '${uninstallServerCommand}' failed (possibly not installed).`);
        }

        try {
            execSync(uninstallServerTestCommand, { stdio: 'ignore' });
            console.log(`'${uninstallServerTestCommand}' executed successfully.`);
        } catch (error) {
            // Ignore error if package not installed
            console.log(`Note: '${uninstallServerTestCommand}' failed (possibly not installed).`);
        }
    }
};
