// 컴포넌트 로드
fetch('/src/header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header').innerHTML = data;
        // header.css 동적 로드
        const headerStyle = document.createElement('link');
        headerStyle.rel = 'stylesheet';
        headerStyle.href = '/src/css/header.css';
        document.head.appendChild(headerStyle);
    });

fetch('/src/footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
        // footer.css 동적 로드
        const footerStyle = document.createElement('link');
        footerStyle.rel = 'stylesheet';
        footerStyle.href = '/src/css/footer.css';
        document.head.appendChild(footerStyle);
    });

// favicon 동적 로드
const faviconStyle = document.createElement('link');
faviconStyle.rel = 'icon';
faviconStyle.href = '/src/favicon/favicon.ico';
document.head.appendChild(faviconStyle);