import numpy as np

# NPY 파일에서 벡터 로드
def load_vectors(file_path):
    return np.load(file_path)

# 두 벡터 간의 코사인 유사도를 계산하는 함수
def cosine_similarity(vec1, vec2):
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def main():
    first_index = 0
    second_index = 1

    # 벡터 파일 경로
    vectors_file = 'vectorize_test/job_vectors.npy'
    
    # 벡터 로드
    job_vectors = load_vectors(vectors_file)
    
    # 벡터화된 첫 번째와 두 번째 항목의 벡터 확인
    first_vector = job_vectors[first_index]
    second_vector = job_vectors[second_index]
    
    print(f"{first_index}번째 인덱스 항목의 벡터:", first_vector)
    print(f"{second_index}번째 인덱스 항목의 벡터:", second_vector)

    # 두 벡터 간의 유사도 계산
    similarity = cosine_similarity(first_vector, second_vector)
    print(f"{first_index}번째와 {second_index}번째 인덱스 항목 간의 코사인 유사도:", similarity * 100, "%")  # 유사도 출력 

if __name__ == "__main__":
    main()