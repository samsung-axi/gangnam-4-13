import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:file_selector/file_selector.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:record3/screens/loading.dart';
import 'package:record3/screens/review_screen.dart';
import 'package:record3/vos/upload_vo.dart';

class UploadScreen extends StatefulWidget {
  final UploadVO uploadVo;
  final XFile? recordFile;

  const UploadScreen({
    super.key,
    required this.uploadVo,
    required this.recordFile,
  });

  @override
  _UploadScreenState createState() => _UploadScreenState();
}

class _UploadScreenState extends State<UploadScreen> {
  String _uploadStatus = '파일을 선택하세요';

  String formatDate(String dateString) {
    try {
      DateTime dateTime = DateTime.parse(dateString);
      return DateFormat('yyyy년 MM월 dd일 HH:mm').format(dateTime);
    } catch (e) {
      return dateString;
    }
  }

  Future<void> _uploadFile() async {
    print("start");
    final dio = Dio(
      BaseOptions(
        connectTimeout: const Duration(seconds: 200),
        receiveTimeout: const Duration(seconds: 200),
      ),
    );
    final uri = 'https://namely-amusing-eft.ngrok-free.app/api/v1/analyze';

    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => const CircleScreen()),
    );

    try {
      String uploadJson = jsonEncode(widget.uploadVo.toJson());
      print(uploadJson);

      FormData formData = FormData.fromMap({
        'data': uploadJson,
        'rc_file': await MultipartFile.fromFile(
          widget.recordFile!.path,
          filename: widget.recordFile!.name,
          contentType: DioMediaType('audio', 'wav'),
        ),
      });

      final response = await dio.post(
        uri,
        data: formData,
        options: Options(
          contentType: 'multipart/form-data',
          headers: {'ngrok-skip-browser-warning': '69420'},
        ),
      );

      Navigator.pop(context);

      if (response.statusCode == 200) {
        setState(() {
          _uploadStatus = '(파일 업로드 성공!  ${response}) ';
          print(_uploadStatus);
        });
        final data = response.data;
        print(data);
        Navigator.push(
          context,
          MaterialPageRoute(builder: (context) => ReviewScreen(data: data)),
        );
      } else {
        setState(() {
          _uploadStatus = '업로드 실패: ${response.statusCode}';
          print(_uploadStatus);
        });
      }
    } catch (e) {
      Navigator.pop(context);
      setState(() {
        _uploadStatus = '업로드 중 오류 발생: $e';
        print(_uploadStatus);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final height = MediaQuery.of(context).size.height;
    return Scaffold(
      backgroundColor: const Color(0xF5F8FCFF),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: true,
        title: const Text(
          '회의 정보',
          style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
        ),
        iconTheme: const IconThemeData(color: Colors.black),
      ),
      body: SafeArea(
        child: Padding(
          padding: EdgeInsets.symmetric(
            horizontal: width * 0.06,
            vertical: height * 0.02,
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const SizedBox(height: 8),
                const Text(
                  '회의 정보',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 8),
                Card(
                  color: const Color(0xFFE9EEF5),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  elevation: 0,
                  child: Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(18),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '회의 주제 :',
                          style: TextStyle(
                            color: Colors.black54,
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          widget.uploadVo.subj,
                          style: TextStyle(color: Colors.black87, fontSize: 15),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          '회의 일시 :',
                          style: TextStyle(
                            color: Colors.black54,
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          formatDate(widget.uploadVo.df),
                          style: TextStyle(color: Colors.black87, fontSize: 15),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          '회의 장소 :',
                          style: TextStyle(
                            color: Colors.black54,
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          formatDate(widget.uploadVo.loc),
                          style: TextStyle(color: Colors.black87, fontSize: 15),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          '참석자 정보 :',
                          style: TextStyle(
                            color: Colors.black54,
                            fontSize: 15,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 4),
                        SingleChildScrollView(
                          child: Text(
                            widget.uploadVo.infoN
                                .map(
                                  (attendee) =>
                                      '${attendee['name']} - ${attendee['role']}',
                                )
                                .join('\n'),
                            style: TextStyle(
                              color: Colors.black87,
                              fontSize: 15,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 50),

                const Text(
                  '파일 업로드',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
                Container(
                  height: 150,
                  color: Colors.black12,
                  child: Center(
                    child: Text(
                      '선택된 파일: ${widget.recordFile?.name}',
                      style: const TextStyle(color: Colors.black, fontSize: 18),
                    ),
                  ),
                ),
                const SizedBox(height: 50),
              ],
            ),
          ),
        ),
      ),
      bottomNavigationBar: Padding(
        padding: const EdgeInsets.fromLTRB(24, 0, 24, 16),
        child: SizedBox(
          width: double.infinity,
          height: 48,
          child: ElevatedButton(
            onPressed: _uploadFile,
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF1F72DE),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(10),
              ),
            ),
            child: const Text(
              '다음',
              style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
