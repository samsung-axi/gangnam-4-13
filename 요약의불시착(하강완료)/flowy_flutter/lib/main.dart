import 'package:flutter/material.dart';
import 'package:record3/screens/type_select.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(home: WelcomeScreen());
  }
}

class WelcomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.of(context).size.width;
    final height = MediaQuery.of(context).size.height;
    return Scaffold(
      resizeToAvoidBottomInset: false,
      appBar: AppBar(
        backgroundColor: const Color.fromRGBO(237, 244, 252, 1),
        elevation: 0,
      ),
      backgroundColor: const Color.fromRGBO(237, 244, 252, 1),
      body: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              SizedBox(height: height * 0.08),
              ClipRRect(
                borderRadius: BorderRadius.circular(width * 0.13),
                child: Image.asset(
                  'assets/logo.png',
                  height: width < 500 ? width * 0.9 : 420,
                  width: width < 500 ? width * 0.9 : 420,
                  fit: BoxFit.contain,
                ),
              ),
              SizedBox(height: height * 0.06),
              SizedBox(
                width: width < 500 ? width * 0.8 : 350,
                child: ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => SelectTypeScreen(),
                      ),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF1F72DE),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(50),
                    ),
                    padding: EdgeInsets.symmetric(
                      vertical: width < 500 ? 16 : 18,
                      horizontal: 16,
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    '시작하기',
                    style: TextStyle(color: Colors.white, fontSize: 18),
                  ),
                ),
              ),
              SizedBox(height: height * 0.15),
            ],
          ),
        ),
      ),
    );
  }
}
