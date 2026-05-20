// common/upload/ModelUploader.js
import React from 'react';

export default function ModelUploader({ onChange }) {
  return (
    <label
      style={{
        background: '#eee',
        padding: '6px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        marginLeft: '10px',
      }}
    >
      모델 업로드
      <input type="file" accept=".glb,.gltf" onChange={onChange} style={{ display: 'none' }} />
    </label>
  );
}
