import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import gridfs

# 호스트 머신의 IP 주소로 변경 (예: 192.168.1.100)
MONGODB_URL = "mongodb:// 192.168.0.236:27017"
client = AsyncIOMotorClient(MONGODB_URL)
db = client["miniproject"]  # 데이터베이스 이름
collection = db["miniproject"]  # 컬렉션 이름
fs = gridfs.GridFS(db)


async def upload_image(file_path, filename):
    with open(file_path, 'rb') as f:
        data = f.read()
    file_id = fs.put(data, filename=filename)
    print(f"파일이 업로드되었습니다. 파일 ID: {file_id}")

async def main():
    # 업로드할 이미지 파일 경로와 저장할 파일 이름을 지정하세요
    await upload_image('path/to/your/image.jpg', 'image.jpg')

if __name__ == "__main__":
    asyncio.run(main())