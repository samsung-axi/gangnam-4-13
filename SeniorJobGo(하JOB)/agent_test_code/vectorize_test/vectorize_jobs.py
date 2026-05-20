from sklearn.feature_extraction.text import TfidfVectorizer
import json
import numpy as np
from numpy.linalg import norm  # 추가된 임포트

# JSON 파일에서 일자리 데이터 로드
def load_job_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        return data.get('채용공고목록', [])

# 일자리 데이터를 벡터화
def vectorize_jobs(job_data):
    descriptions = [job['상세정보']['직무내용'] for job in job_data if '상세정보' in job and '직무내용' in job['상세정보']]
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform(descriptions)
    return vectors

# 두 벡터 간의 코사인 유사도를 계산하는 함수
def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (norm(vec1) * norm(vec2))  # 코사인 유사도 계산

def main():
    first_index = 0
    second_index = 3

    job_data = load_job_data('vectorize_test/jobs_with_details.json')
    job_vectors = vectorize_jobs(job_data)
    print("Job vectors shape:", job_vectors.shape)

    # 벡터를 NumPy 배열로 변환하여 저장
    job_vectors_array = job_vectors.toarray()  # 희소 행렬을 밀집 배열로 변환
    np.save('vectorize_test/job_vectors.npy', job_vectors_array)  # NPY 파일로 저장

    # 벡터화된 첫 번째 항목의 벡터 확인
    first_vector = job_vectors_array[first_index]
    print(f"{first_index}번째 인덱스 항목의 벡터:", first_vector)

    # 벡터화된 두 번째 항목의 벡터 확인
    second_vector = job_vectors_array[second_index]
    print(f"{second_index}번째 인덱스 항목의 벡터:", second_vector)

    # 두 벡터 간의 유사도 계산
    similarity = cosine_similarity(first_vector, second_vector)
    print(f"{first_index}번째 인덱스와 {second_index}번째 인덱스 항목 간의 코사인 유사도:", similarity * 100, "%")  # 유사도 출력 

if __name__ == "__main__":
    main()