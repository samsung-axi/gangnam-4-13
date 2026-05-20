from langchain.tools import Tool

class User:
    def __init__(self):
        self.name = ""
        self.age = 0
        self.gender = ""
        self.job = ""
        self.location = ""

    def get_user_info(self):
        """사용자의 정보를 반환합니다."""
        return f"Name: {self.name}, Age: {self.age}, Gender: {self.gender}, Job: {self.job}, Location: {self.location}".encode('utf-8').decode('utf-8')
    
    def set_name(self, name):
        """사용자의 이름을 설정합니다."""
        self.name = name.encode('utf-8').decode('utf-8')

    def set_age(self, age):
        """사용자의 나이를 설정합니다."""
        self.age = age
    
    def set_gender(self, gender):
        """사용자의 성별을 설정합니다."""
        self.gender = gender.encode('utf-8').decode('utf-8')
    
    def set_job(self, job):
        """사용자의 직업을 설정합니다."""
        self.job = job.encode('utf-8').decode('utf-8')
    
    def set_location(self, location):
        """사용자의 거주지를 설정합니다."""
        self.location = location.encode('utf-8').decode('utf-8')
