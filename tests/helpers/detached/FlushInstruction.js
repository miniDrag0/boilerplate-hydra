
const APIUtil = require('../APIUtil');

const [,, token, imagePath, amount, id, success = true, errorMsg = ""] = process.argv;

(async () => {
  try {
    const response = await APIUtil.updateFlushInstruction(
      token,
      imagePath,
      amount,
      id,
      success === 'true',
      errorMsg
    );
    console.log("Report sukses:", JSON.stringify(response, null, 2));
  } catch (err) {
    console.error("Report gagal:", err.message);
  }
})();
