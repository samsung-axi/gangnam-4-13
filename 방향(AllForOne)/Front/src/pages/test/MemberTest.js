import axios from "axios"
import { useEffect, useState } from "react"

function MemberTest() {

    const [memberList, setMemberList] = useState([])

    useEffect(() => {
        const getMemberList = async () => {
            const response = await axios.get("http://localhost:8080/members")
            console.log(response.data)
            setMemberList(response.data)
        }
        getMemberList()
    }, [])

    return (
        <>
            <h1>멤버 조회 테스트</h1>
            <ul>
                {memberList.map((member, index) => (
                    <li key={index}>
                        <p>이름 : {member.name}</p>
                        <p>이메일 : {member.email}</p>
                        <p>성별 : {member.gender}</p>
                        <p>출생연도 : {member.birthyear}</p>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default MemberTest