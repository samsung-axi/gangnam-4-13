document.getElementById('inputText').addEventListener('input', function() {
    document.getElementById('resetButton').style.display = this.value ? 'block' : 'none';
});

document.getElementById('resetButton').addEventListener('click', function() {
    document.getElementById('inputText').value = '';
    this.style.display = 'none';
});

document.getElementById('transformButton').addEventListener('click', handleTransform);

document.getElementById('copyButton').addEventListener('click', handleCopy);

document.getElementById('soundButton').addEventListener('click', handleSpeak);

async function handleTransform() {
    const inputText = document.getElementById('inputText').value;
    const selectedStyle = document.getElementById('styleSelect').value;
    const outputTextarea = document.getElementById('outputText');
    
    if (!inputText.trim()) {
        outputTextarea.value = '변환할 텍스트를 입력해주세요.';
        return;
    }

    try {
        outputTextarea.value = '변환 중...';
        
        const response = await fetch('/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: inputText,
                style: selectedStyle
            })
        });

        if (!response.ok) {
            throw new Error('API 요청 실패');
        }

        const data = await response.json();
        outputTextarea.value = data.converted_text;

    } catch (error) {
        console.error('Error:', error);
        outputTextarea.value = '변환 중 오류가 발생했습니다.';
    }
}

async function handleCopy() {
    const outputText = document.getElementById('outputText').value;
    try {
        await navigator.clipboard.writeText(outputText);
        document.getElementById('copyMessage').style.display = 'block';
        setTimeout(() => {
            document.getElementById('copyMessage').style.display = 'none';
        }, 2000);
    } catch (err) {
        console.error('복사에 실패했습니다:', err);
        // 폴백: 구형 방식 사용
        document.getElementById('outputText').select();
        document.execCommand('copy');
    }
}

function handleSpeak() {
    const utterance = new SpeechSynthesisUtterance(document.getElementById('outputText').value);
    utterance.lang = 'ko-KR';
    window.speechSynthesis.speak(utterance);
}