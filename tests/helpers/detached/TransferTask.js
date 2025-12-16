
const APIUtil = require('../APIUtil');

const [,, token, imagePath, id, success = true, errorMsg = "", errorCode = -1] = process.argv;

(async () => {
  try {
    const response = await APIUtil.updateActuatorTransferTask(
      token,
      imagePath,
      id,
      success === 'true',
      errorMsg,
      parseInt(errorCode)
    );
    console.log("Report sukses:", JSON.stringify(response, null, 2));
  } catch (err) {
    console.error("Report gagal:", err.message);
  }
})();
