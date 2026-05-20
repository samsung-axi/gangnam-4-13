import 'package:flutter/material.dart';
import 'package:record3/main.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class ReviewScreen extends StatefulWidget {
  final Map<String, dynamic> data;

  const ReviewScreen({super.key, required this.data});

  @override
  State<ReviewScreen> createState() => _ReviewScreenState();
}

class _ReviewScreenState extends State<ReviewScreen> {
  Future<void> sendMail() async {
    final meetingInfo = widget.data['meeting_info'];
    String subj = meetingInfo['subj'];
    String dt = meetingInfo['dt'];
    String place = meetingInfo['loc'];
    List<dynamic> attendees = meetingInfo['info_n'];

    List<Map<String, String>> attendeeList =
        attendees
            .map<Map<String, String>>(
              (attendee) => {
                'name': attendee['name'],
                'email': attendee['email'],
                'role': attendee['role'],
              },
            )
            .toList();

    final url = Uri.parse(
      'https://namely-amusing-eft.ngrok-free.app/api/email/send-email',
    );
    final jsonData = jsonEncode({
      'meeting_info': {
        'subj': subj,
        'dt': dt,
        'loc': place,
        'info_n': attendeeList,
        'summary_result': cleanString(widget.data['summary_result']),
        'action_items_result':
            (() {
              List<dynamic> items;
              if (widget.data['action_items_result'] is List) {
                items = widget.data['action_items_result'];
              } else if (widget.data['action_items_result'] is Map &&
                  widget.data['action_items_result']['tasks'] is List) {
                items = widget.data['action_items_result']['tasks'];
              } else {
                items = [];
              }
              return items.map((item) {
                final mapItem = Map<String, dynamic>.from(item);
                final newItem = <String, dynamic>{};
                newItem['assignee'] = mapItem['name'];
                newItem['role'] = mapItem['role'];
                newItem['task'] = mapItem['tasks'];
                return newItem;
              }).toList();
            })(),
        'feedback_result': cleanString(widget.data['feedback_result']),
      },
    });

    print('메일 발송 시 전송되는 json 데이터:');
    print(jsonData);

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
      },
      body: jsonData,
    );

    if (response.statusCode == 200) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('메일 발송 성공!')));
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('메일 발송 실패: \n${response.body}')));
    }
  }

  String cleanString(dynamic value) {
    if (value is String) {
      return value
          .replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n')
          .replaceAll(RegExp(r'<br></br>', caseSensitive: false), '\n');
    } else if (value is Map || value is List) {
      return jsonEncode(value)
          .replaceAll(RegExp(r'<br\s*/?>', caseSensitive: false), '\n')
          .replaceAll(RegExp(r'<br></br>', caseSensitive: false), '\n');
    }
    return value.toString();
  }

  @override
  Widget build(BuildContext context) {
    print('회의 Review로 넘어온 데이터:');
    print(widget.data);
    return Scaffold(
      backgroundColor: Color(0xFFF3F7FB),
      appBar: AppBar(
        backgroundColor: Color(0xFFF3F7FB),
        elevation: 0,
        title: Text('회의 Review', style: TextStyle(color: Colors.black)),
        centerTitle: true,
        iconTheme: IconThemeData(color: Colors.black),
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '회의 정보',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Color(0xFFE6ECF2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '회의 주제 : ${widget.data['meeting_info']['subj']}',
                    style: TextStyle(color: Colors.black54),
                  ),
                  Text(
                    '회의 일시 : ${widget.data['meeting_info']['dt']}',
                    style: TextStyle(color: Colors.black54),
                  ),
                  Text(
                    '회의 장소 : ${widget.data['meeting_info']['loc']}',
                    style: TextStyle(color: Colors.black54),
                  ),
                  SizedBox(height: 12),
                  Text(
                    '참석자 정보',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                  ),
                  SizedBox(height: 8),
                  ...((widget.data['meeting_info']['info_n'] as List<dynamic>)
                      .map((item) {
                        return Container(
                          margin: EdgeInsets.only(bottom: 12),
                          padding: EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(8),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black12,
                                blurRadius: 4,
                                offset: Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '이름: ${item['name']}',
                                style: TextStyle(
                                  fontWeight: FontWeight.w600,
                                  fontSize: 14,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                '이메일: ${item['email']}',
                                style: TextStyle(
                                  color: Colors.black54,
                                  fontSize: 13,
                                ),
                              ),
                              SizedBox(height: 2),
                              Text(
                                '역할: ${item['role']}',
                                style: TextStyle(
                                  color: Colors.black54,
                                  fontSize: 13,
                                ),
                              ),
                            ],
                          ),
                        );
                      })
                      .toList()),
                ],
              ),
            ),

            SizedBox(height: 24),
            Text(
              '회의 요약',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Color(0xFFE6ECF2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children:
                    (widget.data['summary_result']['summary'] as List<dynamic>)
                        .map<Widget>((summaryItem) {
                          return Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Row(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '• ',
                                  style: TextStyle(
                                    color: Colors.black45,
                                    fontSize: 16,
                                  ),
                                ),
                                Expanded(
                                  child: Text(
                                    summaryItem.toString(),
                                    style: TextStyle(
                                      color: Colors.black45,
                                      fontSize: 14,
                                      height: 1.3,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          );
                        })
                        .toList(),
              ),
            ),
            SizedBox(height: 24),
            Text(
              '역할 분담',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Color(0xFFE6ECF2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children:
                    (widget.data['action_items_result']['tasks']
                            as List<dynamic>)
                        .map((task) {
                          final name = task['name'];
                          final role = task['role'];
                          final taskList =
                              (task['tasks'] as List<dynamic>).cast<String>();

                          return Padding(
                            padding: const EdgeInsets.only(bottom: 12),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '$name ($role)',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 14,
                                  ),
                                ),
                                ...taskList
                                    .map(
                                      (t) => Text(
                                        '- $t',
                                        style: TextStyle(color: Colors.black54),
                                      ),
                                    )
                                    .toList(),
                              ],
                            ),
                          );
                        })
                        .toList(),
              ),
            ),
            SizedBox(height: 24),
            Text(
              '회의 피드백',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            SizedBox(height: 8),
            SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Color(0xFFE6ECF2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '필요 비율: ${widget.data['feedback_result']['necessary_ratio']}%, '
                    '불필요 비율: ${widget.data['feedback_result']['unnecessary_ratio']}%',
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                  ),
                  SizedBox(height: 12),
                  ...((widget.data['feedback_result']['representative_unnecessary']
                          as List<dynamic>)
                      .map((item) {
                        final sentence = item['sentence'];
                        final reason = item['reason'];
                        return Padding(
                          padding: const EdgeInsets.only(bottom: 12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '문장: $sentence',
                                style: TextStyle(
                                  color: Colors.black87,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                              SizedBox(height: 4),
                              Text(
                                '피드백: $reason',
                                style: TextStyle(
                                  color: Colors.black54,
                                  fontStyle: FontStyle.italic,
                                ),
                              ),
                            ],
                          ),
                        );
                      })
                      .toList()),
                ],
              ),
            ),
            SizedBox(height: 32),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: sendMail,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFF2583D7),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                      ),
                      padding: EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: Text(
                      '메일 발송',
                      style: TextStyle(fontSize: 18, color: Colors.white),
                    ),
                  ),
                ),
                SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      Navigator.pushAndRemoveUntil(
                        context,
                        MaterialPageRoute(
                          builder: (context) => WelcomeScreen(),
                        ),
                        (route) => false,
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.white,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(24),
                        side: BorderSide(color: Color(0xFF2583D7)),
                      ),
                      padding: EdgeInsets.symmetric(vertical: 16),
                    ),
                    child: Text(
                      '홈화면 이동',
                      style: TextStyle(fontSize: 18, color: Color(0xFF2583D7)),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
