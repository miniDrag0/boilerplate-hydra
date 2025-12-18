require('dotenv').config();
const slack = require('wdio-slack-service');
const appiumPort = parseInt(process.env.PORT_BCEL, 10) || 4725;
exports.config = {
    // ====================
    // Runner and framework
    // Configuration
    // ====================
    runner: 'local',
    framework: 'jasmine',
    jasmineNodeOpts: {
        // Updated the timeout to 30 seconds due to possible longer appium calls
        // When using XPATH
        defaultTimeoutInterval: 990000,//change ke 90000 untuk production ini kepentingan debug
        helpers: [require.resolve('@babel/register')],
    },
    sync: true,
    logLevel: 'warn',
    deprecationWarnings: true,
    bail: 0,
    baseUrl: 'http://the-internet.herokuapp.com',
    waitforTimeout: 8000,//10000
    connectionRetryTimeout: 50000,//90000
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
                    // chromedriverAutodownload: true,
                    // For more arguments see
                    // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
                },
                logPath: './logs', // capture Appium server logs for debugging
                command: 'appium',
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
        const { exec } = require('child_process');

      // Perintah untuk uninstall uiautomator2.server
      const uninstallServerCommand = 'adb -s '+ process.env.DEVICE_BCEL +' uninstall io.appium.uiautomator2.server';

      // Perintah untuk uninstall uiautomator2.server.test
      const uninstallServerTestCommand = 'adb -s '+ process.env.DEVICE_BCEL +' uninstall io.appium.uiautomator2.server.test';

      // Eksekusi perintah adb
      exec(uninstallServerCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing '${uninstallServerCommand}': ${error.message}`);
        } else {
          console.log(`'${uninstallServerCommand}' executed successfully.`);
        }
      });

      exec(uninstallServerTestCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing '${uninstallServerTestCommand}': ${error.message}`);
        } else {
          console.log(`'${uninstallServerTestCommand}' executed successfully.`);
        }
      });
    }
};
