import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';

class RoleSelector extends StatefulWidget {
  final String userType;
  final Function(String) onRoleSelected;
  final InputDecoration? decoration;
  const RoleSelector({Key? key, required this.userType, required this.onRoleSelected, this.decoration}) : super(key: key);

  @override
  State<RoleSelector> createState() => _RoleSelectorState();
}

class _RoleSelectorState extends State<RoleSelector> {
  late List<String> roles;
  String? selectedRole;
  String customRole = '';
  late TextEditingController _displayController;

  @override
  void initState() {
    super.initState();
    if (widget.userType == 'student') {
      roles = [
        '팀장 / 조장',
        '발표자',
        'PPT 제작자',
        '자료조사 담당',
        '스크립트 작성자',
        '보고서 작성자',
        '리허설 진행자',
        '기타 (직접 입력)',
      ];
    } else {
      roles = [
        '기획자 (PM)',
        '프론트엔드 개발자',
        '백엔드 개발자',
        '디자이너 (UI/UX)',
        '데이터 분석가',
        '마케터',
        '인턴/보조',
        '기타 (직접 입력)',
      ];
    }
    _displayController = TextEditingController();
  }

  @override
  void dispose() {
    _displayController.dispose();
    super.dispose();
  }

  void _updateDisplayText() {
    String displayText = selectedRole == '기타 (직접 입력)'
        ? customRole
        : (selectedRole ?? '');
    _displayController.text = displayText;
  }

  void _onRoleSelected(String role) {
    setState(() {
      if (role == '기타 (직접 입력)') {
        selectedRole = role;
        customRole = '';
      } else {
        selectedRole = role;
        customRole = '';
      }
      widget.onRoleSelected(role);
      _updateDisplayText();
    });
  }

  void _showRolePicker() async {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom,
            left: 16, right: 16, top: 16,
          ),
          child: SingleChildScrollView(
            child: StatefulBuilder(
              builder: (context, setModalState) {
                return Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Wrap(
                      spacing: 8,
                      children: List<Widget>.generate(roles.length, (index) {
                        final isEtc = roles[index] == '기타 (직접 입력)';
                        return ChoiceChip(
                          label: Text(roles[index]),
                          selected: selectedRole == roles[index],
                          onSelected: (selected) {
                            setModalState(() {
                              if (isEtc) {
                                selectedRole = '기타 (직접 입력)';
                                customRole = '';
                                _onRoleSelected('기타 (직접 입력)');
                              } else {
                                selectedRole = roles[index];
                                customRole = '';
                                _onRoleSelected(selectedRole!);
                                Navigator.pop(context);
                              }
                            });
                          },
                        );
                      }),
                    ),
                    if (selectedRole == '기타 (직접 입력)')
                      Padding(
                        padding: const EdgeInsets.only(top: 8.0),
                        child: TextField(
                          autofocus: true,
                          decoration: InputDecoration(
                            labelText: '직접 입력',
                            border: OutlineInputBorder(),
                          ),
                          onChanged: (value) {
                            setModalState(() {
                              customRole = value;
                              // onChanged에서는 _onRoleSelected를 호출하지 않음
                            });
                          },
                          onSubmitted: (value) {
                            _onRoleSelected(value);
                            Navigator.pop(context);
                          },
                        ),
                      ),
                  ],
                );
              },
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: _showRolePicker,
      child: AbsorbPointer(
        child: TextField(
          controller: _displayController,
          decoration: widget.decoration,
          readOnly: true,
        ),
      ),
    );
  }
}