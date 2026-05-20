// common/utils/popup.js

export function openImagePreview(base64OrUrl) {
    const win = window.open();
    if (win) {
      win.document.write(`<img src="${base64OrUrl}" style="max-width: 100%;" />`);
    } else {
      alert('팝업이 차단되어 미리보기를 열 수 없습니다.');
    }
  }
  