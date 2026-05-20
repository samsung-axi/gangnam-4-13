#%%
import pandas as pd
import numpy as np

file='all_grades_companies_multivariate.csv'



#%%

def add_derived_variables(df):
    # 파생 변수 생성
    df["부채비율"] = df["총부채"] / df["자본금"]
    df["부채비율"] = df["총부채"] / df["자본금"]
    df["ROA"] = df["당기순이익"] / df["총자산"]
    df["ROE"] = df["당기순이익"] / df["자본총계"]
    df["매출총자산회전율"] = df["매출액"] / df["총자산"]
    df["이자총자산비율"] = df["이자발생부채"] / df["총자산"]
    df["이자매출비율"] = df["이자발생부채"] / df["매출액"]
    df["현금흐름대비이자"] = df["영업활동현금흐름"] / (df["이자발생부채"] + 1.0)
    df["이자대비현금흐름"] = df["이자발생부채"] / (df["영업활동현금흐름"] + 1.0)
    df["로그총자산"] = np.log10(df["총자산"])
    df["로그총부채"] = np.log10(df["총부채"])


    return df

#%%
if __name__ == "__main__":
    df=pd.read_csv(file)
    df=add_derived_variables(df)
    df.to_csv("../generated_data/multivariate_generated_companies_derived.csv", index=False)

