// Nodejs encryption with CTR
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = new Buffer.from("12345678901234567890123456789012");
const iv = new Buffer.from("1234567890123456");

function encrypt(text) {
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

function decrypt(text) {
  let iv = Buffer.from(text.iv, "hex");
  let encryptedText = Buffer.from(text.encryptedData, "hex");
  let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

console.log("key", JSON.stringify(key));
console.log("iv", JSON.stringify(iv));
console.log("key", JSON.stringify(key));
console.log("iv", JSON.stringify(iv));
var hw = encrypt("Some serious stuff");
console.log(hw);
console.log(decrypt(hw));
