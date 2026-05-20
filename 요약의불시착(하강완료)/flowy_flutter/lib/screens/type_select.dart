import 'package:flutter/material.dart';
import 'package:record3/screens/insert_info.dart'; // InputScreen 경로 맞게 수정

class SelectTypeScreen extends StatefulWidget {
  @override
  _SelectTypeScreenState createState() => _SelectTypeScreenState();
}

class _SelectTypeScreenState extends State<SelectTypeScreen> {
  String? _selectedType;

  void _selectType(String type) {
    setState(() {
      _selectedType = type;
    });
  }

  void _goToNextScreen() {
    if (_selectedType != null) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => InputScreen(userType: _selectedType!),
        ),
      );
    }
  }

  Widget _buildTypeCard({
    required String type,
    required String imagePath,
    required String title,
    required String description,
    required Color color,
  }) {
    bool isSelected = _selectedType == type;
    return AnimatedScale(
      scale: isSelected ? 1.08 : 1.0,
      duration: Duration(milliseconds: 200),
      child: GestureDetector(
        onTap: () => _selectType(type),
        child: Container(
          width: 320,
          margin: EdgeInsets.symmetric(vertical: 12),
          padding: EdgeInsets.symmetric(vertical: 16, horizontal: 16),
          decoration: BoxDecoration(
            color: isSelected ? color.withOpacity(0.12) : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isSelected ? color : Colors.grey.shade300,
              width: 2,
            ),
            boxShadow: [
              BoxShadow(
                color: isSelected ? color.withOpacity(0.2) : Colors.black12,
                blurRadius: 8,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(imagePath, width: 60, height: 60),
              SizedBox(height: 10),
              Text(
                title,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? color : Colors.black87,
                ),
              ),
              SizedBox(height: 6),
              Text(
                description,
                style: TextStyle(fontSize: 15, color: Colors.black54),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('사용자 유형 선택'),
        backgroundColor: Color.fromRGBO(237, 244, 252, 1),
      ),
      backgroundColor: Color.fromRGBO(237, 244, 252, 1),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // SizedBox(height: 32),
              Text(
                '당신은 어떤 유형인가요?',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w500),
              ),
              SizedBox(height: 35),
              _buildTypeCard(
                type: 'student',
                imagePath: 'assets/type1.png',
                title: '학생',
                description: '팀 프로젝트, 스터디 등\n학교 생활을 위한 회의에 적합해요.',
                color: Colors.blue,
              ),
              SizedBox(height: 24),
              _buildTypeCard(
                type: 'worker',
                imagePath: 'assets/type2.png',
                title: '직장인',
                description: '업무 협업, 소규모 회의 등\n직장 생활을 위한 회의에 적합해요.',
                color: Colors.green,
              ),
              SizedBox(height: 28),
              SizedBox(
                width: 320,
                child: ElevatedButton(
                  onPressed: _selectedType != null ? _goToNextScreen : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFF1F72DE),
                    padding: EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(50),
                    ),
                  ),
                  child: Text(
                    '다음',
                    style: TextStyle(fontSize: 18, color: Colors.white),
                  ),
                ),
              ),
              SizedBox(height: 10),
            ],
          ),
        ),
      ),
    );
  }
}
