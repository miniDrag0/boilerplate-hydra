require('dotenv').config();
const path = require('path');
const slack = require('wdio-slack-service');
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
    connectionRetryTimeout: 80000,//90000
    connectionRetryCount: 3,
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
                    port: Number(process.env.PORT_BCA),
                    // chromedriverAutodownload: true,
                    // For more arguments see
                    // https://github.com/webdriverio/webdriverio/tree/master/packages/wdio-appium-service
                },
                command: path.join(__dirname, '..', 'appium-launcher.cmd'),
            },
        ],
      //   [slack, {
      //     webHookUrl: process.env.SLACK_HOOK, // Used to post notification to a particular channel
      //     notifyOnlyOnFailure: false, // Send notification only on test failure
      //     messageTitle: "STAGING MOBILE BCA" // Name of the notification
      // }],
    ],
    port: Number(process.env.PORT_BCA),

    beforeSession: function (capabilities, specs) {
        const { exec } = require('child_process');

      // Perintah untuk uninstall uiautomator2.server
      const uninstallServerCommand = 'adb -s '+ process.env.DEVICE_BCA +' uninstall io.appium.uiautomator2.server';

      // Perintah untuk uninstall uiautomator2.server.test
      const uninstallServerTestCommand = 'adb -s '+ process.env.DEVICE_BCA +' uninstall io.appium.uiautomator2.server.test';

      const optimizeDeviceCommand = 'adb -s '+ process.env.DEVICE_BCA +' shell "' +
        'svc power stayon true && ' +
        'settings put global window_animation_scale 0 && ' +
        'settings put global transition_animation_scale 0 && ' +
        'settings put global animator_duration_scale 0 && ' +
        'cmd deviceidle whitelist +io.appium.settings && ' +
        'cmd deviceidle whitelist +io.appium.uiautomator2.server && ' +
        'cmd deviceidle whitelist +io.appium.uiautomator2.server.test ' +
      '"';

      exec(optimizeDeviceCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing '${optimizeDeviceCommand}': ${error.message}`);
        } else {
          console.log(`'${optimizeDeviceCommand}' executed successfully.`);
        }
      });
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

      // driver.pause(2500);
      // driver.launchApp();
    },

  //   afterSession: function (capabilities, specs) {
  //     const { exec } = require('child_process');

  //   // Perintah untuk uninstall uiautomator2.server
  //   const uninstallServerCommand = 'adb -s '+ process.env.DEVICE_BCA +' uninstall io.appium.uiautomator2.server';

  //   // Perintah untuk uninstall uiautomator2.server.test
  //   const uninstallServerTestCommand = 'adb -s '+ process.env.DEVICE_BCA +' uninstall io.appium.uiautomator2.server.test';

  //   // Eksekusi perintah adb
  //   exec(uninstallServerCommand, (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`Error executing '${uninstallServerCommand}': ${error.message}`);
  //     } else {
  //       console.log(`'${uninstallServerCommand}' executed successfully.`);
  //     }
  //   });

  //   exec(uninstallServerTestCommand, (error, stdout, stderr) => {
  //     if (error) {
  //       console.error(`Error executing '${uninstallServerTestCommand}': ${error.message}`);
  //     } else {
  //       console.log(`'${uninstallServerTestCommand}' executed successfully.`);
  //     }
  //   });
  // },
};
