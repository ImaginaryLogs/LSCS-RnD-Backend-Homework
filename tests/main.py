import requests, json, unittest

def is_valid_error(self, result: requests.Response, expected_message: str = r""):
    body = json.loads(result.content)
    self.assertEqual(result.status_code, 400)
    self.assertEqual(result.headers['content-type'], "application/json; charset=utf-8")
    self.assertIsNotNone(body["message"]);
    self.assertRegex(body["message"], expected_message)

class Test_Create_Question(unittest.TestCase):
    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        self.test_url = 'http://localhost:8080/create/'
    
    def test_no_content(self):
        req_body = {
            "question": "",
            "choices": [""],
            "correct_answer": ""
        }
        result = requests.post(self.test_url, json=req_body)
        is_valid_error(self, result, r"^Invalid Question.")
        
    def test_valid_question_rest_invalid(self):
        req_body = {
            "question": "Why did the chicken cross the road?",
            "choices": [""],
            "correct_answer": ""
        }  
        result = requests.post(self.test_url, json=req_body)
        is_valid_error(self, result, r"^Invalid Choices.")

    def test_valid_question_one_choice(self):
        req_body = {
            "question": "Why did the chicken cross the road?",
            "choices": ["To get to the other side"],
            "correct_answer": ""
        }  
        result = requests.post(self.test_url, json=req_body)
        is_valid_error(self, result, r"^Invalid Choices.")
        
    def test_valid_question_choices_invalid_answer(self):
        req_body = {
            "question": "Why did the chicken cross the road?",
            "choices": ["To get to the other side", "To go to school"],
            "correct_answer": ""
        }
        result = requests.post(self.test_url, json=req_body)
        is_valid_error(self, result, r"^Invalid Answer.")
 
class Test_Get_Questions(unittest.TestCase):
    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        self.test_url = 'http://localhost:8080/get/'
    
    def test_get_questions(self):
        result = requests.get('http://localhost:8080/list/')
        self.assertEqual(result.status_code, 200);
        self.assertIsNotNone(json.loads(result.content))
  
                
if __name__ == '__main__':
    unittest.main(verbosity=1)
