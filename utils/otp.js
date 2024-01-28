const OTP = () => {
  const buffer = new Uint8Array(4);
  crypto.getRandomValues(buffer);
  let otp = "";
  for (let i = 0; i < 4; i++) {
    const randomDigit = buffer[i] % 10;
    otp += randomDigit.toString();
  }
  return otp;
};

module.exports = { OTP };
