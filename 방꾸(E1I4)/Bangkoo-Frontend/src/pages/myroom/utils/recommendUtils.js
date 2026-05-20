// 작성자 : 김병훈

import { recommendFromImage } from "../../../api/Recomendation/recommend";

export async function fetchRediskeyForImage(file){
    if(!file){
        throw new Error("이미지를 선택하세요");
    }
    const {redisKey} = await recommendFromImage(file);
    return redisKey;
}