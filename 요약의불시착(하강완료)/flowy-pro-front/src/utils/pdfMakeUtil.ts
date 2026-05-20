import pdfMake from 'pdfmake/build/pdfmake';
// import pdfFonts from 'pdfmake/build/vfs_fonts';

// base64로 변환한 TTF 파일을 vfs에 추가 (아래 부분에 실제 base64 데이터로 교체 필요)
pdfMake.vfs['NanumHuman-Regular.ttf'] = '...base64...';
pdfMake.vfs['NanumHuman-Bold.ttf'] = '...base64...'

pdfMake.fonts = {
  NanumHuman: {
    normal: 'NanumHuman-Regular.ttf',
    bold: 'NanumHuman-Bold.ttf'
  }
}; 

