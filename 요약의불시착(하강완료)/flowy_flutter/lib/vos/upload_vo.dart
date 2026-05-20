class UploadVO {
  final String subj;
  final List<Map<String, String>> infoN;
  final String loc;
  final String df;

  // 생성자
  const UploadVO({
    required this.subj,
    required this.infoN,
    required this.loc,
    required this.df,
  });

  // toString() 메서드 오버라이드 (디버깅 용도)
  @override
  String toString() {
    return 'UploadVO(subj: $subj, infoN: $infoN, loc: $loc, df: $df)';
  }

  // JSON 직렬화를 위한 메서드
  Map<String, dynamic> toJson() => {
    'subj': subj,
    'info_n': infoN.map((map) => Map<String, String>.from(map)).toList(),
    'loc': loc,
    'dt': df,
  };

  // JSON 역직렬화를 위한 팩토리 메서드
  factory UploadVO.fromJson(Map<String, dynamic> json) {
    return UploadVO(
      subj: json['subj'],
      infoN: List<Map<String, String>>.from(
        (json['infoN'] as List).map(
              (item) => Map<String, String>.from(item),
        ),
      ),
      loc: json['loc'],
      df: json['df'],
    );
  }
}
