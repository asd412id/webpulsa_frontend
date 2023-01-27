export const isBase64 = (/** @type {string} */ str) => {
  var base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
  return base64regex.test(getBuffer(str));
}

export const getBuffer = (base64Data) => {
  return base64Data?.replace(/^data:image\/[a-z]+;base64,/, "");
}

export const searchKey = (event) => {
  const key = event.key;
  return (!/^[a-zA-Z0-9\s]$/.test(key) &&
    key != "Backspace" &&
    key != "Delete" &&
    key != "Enter") ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey ||
    event.shiftKey;
}