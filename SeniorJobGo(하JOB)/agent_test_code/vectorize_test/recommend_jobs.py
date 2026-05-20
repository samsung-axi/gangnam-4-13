import json
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# JSON 파일에서 일자리 데이터 로드
def load_job_data(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        return data.get('채용공고목록', [])

# 추천할 공고를 찾는 함수
def recommend_job(job_data, job_index):
    descriptions = [job['상세정보']['직무내용'] for job in job_data if '상세정보' in job and '직무내용' in job['상세정보']]
    
    # TF-IDF 벡터화
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(descriptions)
    
    # 선택한 공고의 벡터
    job_vector = tfidf_matrix[job_index]
    
    # 모든 공고와의 유사도 계산
    cosine_similarities = cosine_similarity(job_vector, tfidf_matrix).flatten()
    
    # 유사도 기준으로 인덱스 정렬
    similar_indices = cosine_similarities.argsort()[-6:-1][::-1]  # 가장 유사한 5개 공고
    
    return similar_indices, cosine_similarities[similar_indices]

def main():
    job_data = load_job_data('vectorize_test/jobs_with_details.json')
    
    # 추천할 공고의 인덱스 (예: 0번째 공고)
    job_index = input("추천할 공고의 인덱스를 입력하세요: ")
    
    try:
        job_index = int(job_index)
    except ValueError:
        print("유효한 숫자를 입력하세요.")
        return
    
    # 추천 공고 찾기
    recommended_indices, similarities = recommend_job(job_data, job_index)
    
    print(f"추천된 공고 (인덱스 {job_index}): {job_data[job_index]['채용제목']}")
    for idx, sim in zip(recommended_indices, similarities):
        print(f"공고번호: {job_data[idx]['공고번호']}, 유사도: {sim:.4f}, 제목: {job_data[idx]['채용제목']}") 

if __name__ == "__main__":
    main()