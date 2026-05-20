## 🙌 안녕하세요. Pick, Fit 백엔드입니다.
## 🛠 기능 엿보기
- [마이페이지](#MyPage)
- [Virtual Try On](#Virtual)
- [위시리스트](#Wishlist)
- [OAuth2 구글로그인](#Google)
- [S3 이미지 업로드](#S3)


## 주요 기능

## MyPage
인증된 사용자의 이메일을 확인 후 서비스 레이어를 통해 사용자 정보를 업데이트 , 수정된 사용자 정보 반환됩니다.
```js
@PutMapping("/user")
public UserDTO updateUserDetails(@RequestBody UserDTO userDTO, Authentication authentication) {
    if (authentication == null) {
        throw new RuntimeException("Unauthorized");
    }

    String email = authentication.getName(); // 이메일 추출
    logger.info("PUT /api/user - 요청 수신: email={}, userDTO={}", email, userDTO);

    UserEntity updatedUser = userService.updateUserDetails(userDTO); // 서비스 레이어 호출
    return UserDTO.fromEntity(updatedUser); // DTO 변환 로직
}

```
## Virtual
가상 착용 요청 처리하며, 이미지 URL과 카테고리 정보를 받아 임시 JSON 파일을 생성한 후 FastAPI로 전달하기 위해 준비하는 로직입니다.
```js
 @PostMapping("/process") // POST 요청을 처리
    public ResponseEntity<?> processTryOn(@RequestBody TrymeonDTO trymeonDTO) {
        String clothImageUrl = trymeonDTO.getClothImageUrl(); // DTO에서 옷 이미지 URL을 추출
        String personImageUrl = trymeonDTO.getPersonImageUrl(); // DTO에서 모델 이미지 URL을 추출
        String bigCategory = trymeonDTO.getBigCategory(); // DTO에서 대분류 카테고리를 추출

           File tempJsonFile; // FastAPI로 보낼 JSON 파일 선언
        try {
            tempJsonFile = File.createTempFile("data", ".json"); // 임시 JSON 파일 생성
            try (FileWriter writer = new FileWriter(tempJsonFile)) { // 파일에 데이터를 쓰기 위한 FileWriter 생성
                writer.write(String.format(
                        "{\"person_url\":\"%s\",\"cloth_url\":\"%s\",\"category_analysis\": {\"big_category\": \"%s\"}}",
                        personImageUrl, clothImageUrl, bigCategory // JSON 형식의 데이터 작성
                ));
            }
```
### 호출 된 json 파일 url load
```
contents = await file.read()
    data = json.loads(contents)
    person_url = data.get("person_url")
    cloth_url = data.get("cloth_url")
    category_analysis = data.get("category_analysis", {})
    big_category = category_analysis.get("big_category")
```
### CatVTON Pipeline
```
def apply_virtual_tryon(catvton_pipeline, person_image, clothing_image, mask_image, output_path):
    generator = torch.Generator(device="cuda").manual_seed(seed)
    results = catvton_pipeline(
        person_image,
        clothing_image,
        mask_image,
        num_inference_steps=50,
        guidance_scale=2.5,
        height=1024,
        width=768,
        generator=generator,
        eta=1.0
    )
    repaint_result = repaint(person_image, mask_image, results[0])
    repaint_result.save(output_path)
    return output_path
```
### EndPoint
```
apply_virtual_tryon(app.state.catvton_pipeline, person_image, clothing_image, mask_image, output_path)
return {"message": "Done", "url": f"/static/{output_file_name}"}
```js
ResponseEntity<String> response = restTemplate.exchange(
                    catVtonApiUrl + "/upload/", // FastAPI의 업로드 엔드포인트
                    HttpMethod.POST, // POST 요청
                    requestEntity, // 요청 데이터
                    String.class // 응답 데이터를 문자열로 받음
            );

// FastAPI 응답 검증 및 저장
if (imageUrl == null || imageUrl.isEmpty()) {
    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Invalid response from FastAPI.");
}

TrymeonEntity savedImage = trymeonService.saveTrymeonImage( // 결과 이미지를 데이터베이스에 저장
        imageUrl, // 결과 이미지 URL
        trymeonDTO.getUserEmail(), // 사용자 이메일
        trymeonDTO.getProductId() // 상품 ID
);
```python
### 위시리스트 등록 기준
1. **필수 입력값**:
   - 사용자 이메일 (`userEmail`)
   - 상품 ID (`productId`)
   - 상품 이미지 URL (`imageUrl`)
   - 상품 제목 (`title`)

2. **등록 조건**:
   - 동일한 상품이 이미 활성화(`isDeleted=false`)된 상태라면 중복 등록이 불가능합니다.
   - 동일한 상품이 삭제 상태(`isDeleted=true`)라면 복구됩니다.

3. **새로운 데이터 등록**:
   - 입력된 데이터를 기반으로 새 위시리스트 항목을 생성하여 저장합니다.
   - 새 항목은 기본적으로 활성 상태(`isDeleted=false`)로 저장됩니다.
```
### Wishlist
원하는 상품을 추가하는 기능, 기존 항목의 상태에 따라 복구 또는 새로 생성하게 됩니다.
```js
@Transactional
public WishlistEntity addToWishlist(WishlistDto wishlistDto) {
    if (wishlistDto == null) {
        throw new IllegalArgumentException("위시리스트 요청 데이터가 비어 있습니다.");
    }

    // 필수 값 검증
    if (wishlistDto.getUserEmail() == null || wishlistDto.getUserEmail().isEmpty()) {
        throw new IllegalArgumentException("유효하지 않은 이메일입니다.");
    }
    if (wishlistDto.getProductId() == null) {
        throw new IllegalArgumentException("상품 ID가 누락되었습니다.");
    }

    // 기존 위시리스트 항목 조회
    Optional<WishlistEntity> optionalProduct = wishlistRepository.findByProductIdAndUserEmail(
            wishlistDto.getProductId(),
            wishlistDto.getUserEmail()
    );

    if (optionalProduct.isPresent()) {
        WishlistEntity existingProduct = optionalProduct.get();

        if (existingProduct.isDeleted()) {
            // 삭제 상태인 항목 복구
            existingProduct.setDeleted(false);
            existingProduct.setImageUrl(wishlistDto.getImageUrl());
            existingProduct.setUserName(wishlistDto.getUserName());
            existingProduct.setPrice(wishlistDto.getPrice());
            existingProduct.setTitle(wishlistDto.getTitle());
            return wishlistRepository.save(existingProduct);
        } else {
            // 이미 활성화된 항목 처리
            throw new IllegalStateException("이미 활성 상태로 등록된 위시리스트 항목입니다.");
        }
    }

    // 새로운 위시리스트 항목 생성
    WishlistEntity newProduct = new WishlistEntity();
    newProduct.setUserEmail(wishlistDto.getUserEmail());
    newProduct.setImageUrl(wishlistDto.getImageUrl());
    newProduct.setUserName(wishlistDto.getUserName());
    newProduct.setPrice(wishlistDto.getPrice());
    newProduct.setProductId(wishlistDto.getProductId());
    newProduct.setTitle(wishlistDto.getTitle());
    newProduct.setDeleted(false); // 기본적으로 활성 상태로 저장

    return wishlistRepository.save(newProduct);
}
```
### Google
로그인 성공 시, 사용자 정보를 저장/업데이트하고 메인 페이지로 이동되고
로그아웃시 OAuth2 계정 연결 해제, 인증 쿠키 삭제됩니다.
```js
@Override
public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                    Authentication authentication) throws IOException {
    String targetUrl = "http://localhost:3000"; // 로그인 후 리다이렉트할 URL

    OAuth2UserPrincipal principal = getOAuth2UserPrincipal(authentication);
    if (principal != null) {
        String userEmail = principal.getUserInfo().getEmail();
        String userName = principal.getUserInfo().getName();

        // 사용자 정보 저장 또는 업데이트
        userService.handleOAuth2Login(new UserDTO(userEmail, userName));
    }

    // 리다이렉트 처리
    getRedirectStrategy().sendRedirect(request, response, targetUrl);
}

```
## S3
파일을 업로드 하면 S3 버킷에 파일을 저장하고 Public URL 반환, 반환받은 URL을 DB에 저장됩니다.
```js
@RestController
@RequestMapping("/api")
public class UploadController {

    private static final Logger logger = LoggerFactory.getLogger(UploadController.class);
    private final UploadService uploadService;

    public UploadController(UploadService uploadService) {
        this.uploadService = uploadService;
    }

    /**
     * S3 파일 업로드 API
     * @param file      업로드할 파일 (MultipartFile)
     * @param userEmail 사용자 이메일
     * @return S3 파일 URL
     */
    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file,
                                             @RequestParam("email") String userEmail) {
        logger.info("S3 파일 업로드 요청: 파일명={}, 사용자 이메일={}", file.getOriginalFilename(), userEmail);

        // S3에 파일 업로드 및 URL 반환
        String fileUrl = uploadService.uploadFile(userEmail, file);

        logger.info("S3 업로드 성공 및 DB 저장 완료: URL={}", fileUrl);
        return ResponseEntity.ok(fileUrl);
    }
}
```

### Link   
- [🙋‍♂️ MyPage 코드 보러가기](https://github.com/Pick-Fit/Back-end/blob/main/PickFit/src/main/java/com/pickfit/pickfit/oauth2/model/controller/UserController.java)
- [🙋‍♂️ Virtual 코드 보러가기](https://github.com/Pick-Fit/Back-end/tree/main/PickFit/src/main/java/com/pickfit/pickfit/trymeon)  
- [🙋‍♂️ Wishlist 코드 보러가기](https://github.com/Pick-Fit/Back-end/tree/main/PickFit/src/main/java/com/pickfit/pickfit/wishlist)
- [🙋‍♂️ Google 로그인 코드 보러가기](https://github.com/Pick-Fit/Back-end/tree/main/PickFit/src/main/java/com/pickfit/pickfit/oauth2)
- [🙋‍♂️ S3 이미지 업로드 코드 보러가기](https://github.com/Pick-Fit/Back-end/tree/main/PickFit/src/main/java/com/pickfit/pickfit/multipartupload)
