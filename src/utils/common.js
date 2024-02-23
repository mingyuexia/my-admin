class EventBus {
    constructor() {
      this.listeners = {};
    }
  
    on(eventName, callback) {
      if (!this.listeners[eventName]) {
        this.listeners[eventName] = [];
      }
      this.listeners[eventName].push(callback);
    }
  
    off(eventName, callback) {
      if (this.listeners[eventName]) {
        this.listeners[eventName] = this.listeners[eventName].filter(cb => cb !== callback);
      }
    }
  
    emit(eventName, data) {
      if (this.listeners[eventName]) {
        this.listeners[eventName].forEach(callback => {
          callback(data);
        });
      }
    }
  }
  
  const eventBus = new EventBus();

  export default eventBus
  
//   // 订阅事件
//   const callbackA = data => console.log('Callback A:', data);
//   eventBus.on('eventA', callbackA);
  
//   // 发布事件
//   eventBus.emit('eventA', 'Hello, Event A!');
  
//   // 移除事件订阅
//   eventBus.off('eventA', callbackA);
  
//   // 发布事件，此时不会触发 Callback A
//   eventBus.emit('eventA', 'This should not be logged.');
  

function simpleEncrypt(text, key) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return btoa(result); // 使用Base64编码
}

function simpleDecrypt(encryptedText, key) {
  try{
    const decodedText = atob(encryptedText); // 解码Base64
    let result = '';
    for (let i = 0; i < decodedText.length; i++) {
      const charCode = decodedText.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    return result;
  }catch{
    console.log('decrypt error');
  }
}

export { simpleEncrypt, simpleDecrypt };