import 'dart:async';
import 'package:flutter/material.dart';

class CircleScreen extends StatefulWidget {
  const CircleScreen({super.key});

  @override
  _CircleScreenState createState() => _CircleScreenState();
}

class _CircleScreenState extends State<CircleScreen>
    with SingleTickerProviderStateMixin {
  int dotCount = 1;

  int elapsedSeconds = 0;
  Timer? _timer;
  late AnimationController _rotationController;

  @override
  void initState() {
    super.initState();
    _rotationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..repeat();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      setState(() {
        dotCount = dotCount % 3 + 1;
        elapsedSeconds++;
      });
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _rotationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF1F7FE),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            RotationTransition(
              turns: _rotationController,
              child: Image.asset('assets/loading.png', width: 80, height: 80),
            ),
            const SizedBox(height: 32),
            Text(
              '분석 중',
              style: const TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2261B6),
              ),
            ),
            const SizedBox(height: 24),
            Text(
              '${elapsedSeconds}초${'.' * dotCount}',
              style: const TextStyle(
                fontSize: 20,
                color: Color(0xFF2261B6),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
