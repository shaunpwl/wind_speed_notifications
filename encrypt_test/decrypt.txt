// Nodejs encryption with CTR
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = new Buffer.from("12345678901234567890123456789012");
const iv = new Buffer.from("1234567890123456");

function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

console.log("key", key);
console.log("iv", iv);
console.log(
  decrypt({
    iv: iv,
    encryptedData:
      "204b54a95d363d86dc4f0f63be3dc12976ec4ee4fa594432c543d6c20947f690",
  })
);
