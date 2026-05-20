import { useState } from 'react';

export default function BackgroundUploader({ onUpload }) {
    const [fileName, setFileName] = useState('');

    const handleChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            onUpload(url);
            setFileName(file.name);
        }
    };

    return (
        <div>
            <h4>배경 업로더</h4>
            <input type="file" accept="image/*" onChange={handleChange} />
            {fileName && <div>선택됨: {fileName}</div>}
        </div>
    );
}
