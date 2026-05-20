class Test:
    def op_case1():
        import langchain_test.langchain_check_operation_test.case1 as test_code
        test_code.test()

    def op_case2():
        import langchain_test.langchain_check_operation_test.case2 as test_code
        test_code.test()

    def op_case3():
        import langchain_test.langchain_check_operation_test.case3 as test_code
        test_code.test()

    def task_case1():
        import langchain_test.langchain_task_execution_test.case1 as test_code
        test_code.main()

    def task_print_test():
        import langchain_test.langchain_task_execution_test.print_test as test_code
        test_code.main()

    def json_res_case1():
        import prompt_modification_test.json_response_test.case1 as test_code
        test_code.main()

    def json_res_case2():
        import prompt_modification_test.json_response_test.case2 as test_code
        test_code.main()

    def json_res_case3():
        import prompt_modification_test.json_response_test.case3 as test_code
        test_code.main()

    def json_func_case1():
        import prompt_modification_test.json_functionality_test.case1 as test_code
        test_code.main()

    def json_func_case2():
        import prompt_modification_test.json_functionality_test.case2 as test_code
        test_code.main()

    def json_func_case3():
        import prompt_modification_test.json_functionality_test.case3 as test_code
        test_code.main()

    def json_func_case4():
        import prompt_modification_test.json_functionality_test.case4 as test_code
        test_code.main()

    def langchain_test1():
        import utilize_langchain.test1 as test_code
        test_code.test()

    def langchain_test2():
        import utilize_langchain.test2 as test_code
        test_code.test()

    def vectorize_test():
        import vectorize_test.vectorize_jobs as test_code
        test_code.main()

    def load_vectors():
        import vectorize_test.load_vectors as test_code
        test_code.main()

    def recommend_jobs():
        import vectorize_test.recommend_jobs as test_code
        test_code.main()

    def langgraph_test():
        import langgraph_test.test1 as test_code
        test_code.main()

    def langgraph_test2():
        import langgraph_test.test2 as test_code
        test_code.main()

    def console_chat_test():
        import other_test.sjc_test as test_code
        test_code.run_console_chat()

def main():
    # 언어 모델 테스트
    # Test.op_case1()
    # Test.op_case2()
    # Test.op_case3()

    # 태스크 테스트
    # Test.task_case1()
    # Test.task_print_test()

    #--------------------#

    # JSON 응답 테스트
    # Test.json_res_case1()
    # Test.json_res_case2()
    # Test.json_res_case3()

    # JSON 함수 테스트
    # Test.json_func_case1()
    # Test.json_func_case2()
    # Test.json_func_case3()
    # Test.json_func_case4()

    #--------------------#

    # 랭체인 테스트
    # Test.langchain_test1()
    # Test.langchain_test2()

    #--------------------#

    # 벡터화 테스트
    # Test.vectorize_test()
    # Test.load_vectors()
    # Test.recommend_jobs()

    #--------------------#

    # LangGraph 테스트
    # Test.langgraph_test()
    # Test.langgraph_test2()

    #--------------------#

    # 콘솔 챗봇 테스트
    Test.console_chat_test()
    pass

if __name__ == "__main__":
    main()