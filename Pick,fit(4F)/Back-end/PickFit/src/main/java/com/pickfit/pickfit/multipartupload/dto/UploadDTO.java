package com.pickfit.pickfit.multipartupload.dto;

public class UploadDTO {
    private String fileName; // 파일의 이름 (필요한 경우)
    private byte[] fileData; // 파일의 데이터 (바이트 배열 형태로 저장)

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getFileData() {
        return fileData;
    }

    public void setFileData(byte[] fileData) {
        this.fileData = fileData;
    }

    @Override
    public String toString() {
        return "UploadDTO{" +
                "fileName='" + fileName + '\'' +
                '}';
    }
}
