import 'package:file_selector/file_selector.dart';
import 'package:flutter/material.dart';
import 'package:flutter_sound/flutter_sound.dart';
import 'package:path_provider/path_provider.dart';
import 'dart:io';
import 'dart:async';
import 'package:permission_handler/permission_handler.dart';

class RecordingScreen extends StatefulWidget {
  @override
  _RecordingScreenState createState() => _RecordingScreenState();
}

class _RecordingScreenState extends State<RecordingScreen> {
  FlutterSoundRecorder? _recorder;
  bool _isRecording = false;
  bool _isPaused = false;
  int _recordButtonCount = 0;
  String? _filePath;
  StreamSubscription? _recorderSubscription;

  @override
  void initState() {
    super.initState();
    _initRecorder();
  }

  Future<void> _initRecorder() async {
    // 마이크 권한 요청
    var status = await Permission.microphone.request();
    if (!status.isGranted) {
      // 권한이 없으면 안내 후 리턴
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('마이크 권한이 필요합니다.')));
      return;
    }
    _recorder = FlutterSoundRecorder();
    await _recorder!.openRecorder();
    await _recorder!.setSubscriptionDuration(const Duration(milliseconds: 500));
  }

  Future<String> _getTempFilePath() async {
    final dir = await getTemporaryDirectory();
    return '${dir.path}/temp_record.m4a';
  }

  Future<void> _startOrResumeRecording() async {
    if (_filePath == null) {
      _filePath = await _getTempFilePath();
    }
    if (_isPaused) {
      await _recorder!.resumeRecorder();
    } else {
      await _recorder!.startRecorder(toFile: _filePath, codec: Codec.aacMP4);
    }
    setState(() {
      _isRecording = true;
      _isPaused = false;
    });
  }

  Future<void> _pauseRecording() async {
    await _recorder!.pauseRecorder();
    setState(() {
      _isPaused = true;
      _isRecording = false;
    });
  }

  Future<void> _stopRecording() async {
    await _recorder!.stopRecorder();
    setState(() {
      _isRecording = false;
      _isPaused = false;
    });
  }

  void _onRecordButtonPressed() async {
    _recordButtonCount++;
    if (_recordButtonCount % 2 == 1) {
      // 홀수: 녹음 시작/재개
      await _startOrResumeRecording();
    } else {
      // 짝수: 일시정지
      await _pauseRecording();
    }
  }

  void _onCompleteButtonPressed() async {
    if (_isRecording || _isPaused) {
      await _stopRecording();
    }
    // 파일은 _filePath에 임시 저장됨
    bool exists = false;
    if (_filePath != null) {
      final file = File(_filePath!);
      exists = await file.exists();
    }
    if (!exists) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('녹음이 아직 완료되지 않았어요.\n회의 녹음을 완료한 후에 다음 단계로 진행해 주세요.'),
        ),
      );
      return;
    }
    // XFile로 변환 후 경로 출력
    final xfile = XFile(_filePath!);
    print('XFile 경로: \\${xfile.path}');
    print('녹음 파일 경로: \\$_filePath');
    print('파일 존재 여부: \\$exists');
    ScaffoldMessenger.of(
      context,
    ).showSnackBar(SnackBar(content: Text('녹음이 완료되어 임시 저장되었습니다.')));
    // 분석 중입니다 페이지로 이동
    // Navigator.push(
    //   context,
    //   MaterialPageRoute(builder: (context) => AnalyzingScreen()),
    // );
    Navigator.pop(context, xfile);
    // TODO: 분석 완료 후 결과 페이지로 이동
  }

  void _onCancelButtonPressed() async {
    await _stopRecording();
    Navigator.pop(context);
  }

  @override
  void dispose() {
    _stopRecording();
    _recorder?.closeRecorder();
    _recorder = null;
    _recorderSubscription?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('녹음하기')),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
              icon: Icon(
                _isRecording ? Icons.pause_circle_filled : Icons.mic,
                size: 64,
                color: Colors.red,
              ),
              onPressed: _onRecordButtonPressed,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _onCompleteButtonPressed,
              child: Text('녹음 완료'),
            ),
            SizedBox(height: 10),
            ElevatedButton(
              onPressed: _onCancelButtonPressed,
              child: Text('녹음 취소'),
              style: ElevatedButton.styleFrom(backgroundColor: Colors.grey),
            ),
          ],
        ),
      ),
    );
  }
}
