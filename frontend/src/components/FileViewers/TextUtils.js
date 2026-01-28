// src/utils/textUtils.js

/**
 * A smart decoder that inspects an ArrayBuffer for a Byte Order Mark (BOM)
 * and decodes it using the correct encoding (UTF-8, UTF-16LE, UTF-16BE).
 * Defaults to UTF-8 if no BOM is found.
 * @param {ArrayBuffer} arrayBuffer The raw file buffer.
 * @returns {string} The decoded text content.
 */
export function decodeArrayBufferWithBOM(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  let encoding = "utf-8"; // Default encoding

  if (bytes.length >= 2) {
    // Check for UTF-16 LE BOM (FF FE)
    if (bytes[0] === 0xff && bytes[1] === 0xfe) {
      encoding = "utf-16le";
    }
    // Check for UTF-16 BE BOM (FE FF)
    else if (bytes[0] === 0xfe && bytes[1] === 0xff) {
      encoding = "utf-16be";
    }
    // Check for UTF-8 BOM (EF BB BF)
    else if (bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) {
      encoding = "utf-8";
    }
  }

  const decoder = new TextDecoder(encoding);
  // The decoder automatically strips the BOM during the decoding process.
  return decoder.decode(arrayBuffer);
}
