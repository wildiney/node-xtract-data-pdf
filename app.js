let fs = require('fs');
let PDFParser = require('pdf2json');

fs.readdir('./pdfs', function(err, items) {
  console.log(items);

  for (var i = 0; i < items.length; i++) {
    convert(items[i]);
  }
});

function convert(item) {
  let pdfParser = new PDFParser();
  let file = [];

  pdfParser.loadPDF('pdfs/'+item);
  pdfParser.on('pdfParser_dataError', errData =>
    console.error(errData.parserError)
  );
  pdfParser.on('pdfParser_dataReady', pdfData => {
    content = pdfData;
    file['proposta'] = content.formImage.Pages[0].Texts[2].R[0].T;
    file['data'] = decodeURI(
      content.formImage.Pages[0].Texts[8].R[0].T +
        content.formImage.Pages[0].Texts[9].R[0].T +
        content.formImage.Pages[0].Texts[10].R[0].T +
        content.formImage.Pages[0].Texts[11].R[0].T
    );
    file['data'] = file['data'].replace(/%2F/g, '/');
    file['descritivo'] =
      content.formImage.Pages[0].Texts[13].R[0].T +
      content.formImage.Pages[0].Texts[14].R[0].T +
      content.formImage.Pages[0].Texts[15].R[0].T;
    file['descritivo'] = file['descritivo'].replace('%20', '');
    file['lauda_total'] = content.formImage.Pages[0].Texts[24].R[0].T;
    file['lauda_valor'] = content.formImage.Pages[0].Texts[26].R[0].T;
    file['lauda_valor'] = file['lauda_valor']
      .replace(/R%24%20/, '')
      .replace(/%2C/, '.');
    file['subtotal'] = file['lauda_total'] * file['lauda_valor'];
    file['total'] = content.formImage.Pages[0].Texts[31].R[0].T;
    file['total'] = file['total'].replace(/%2C/, '.');

    console.log(file);
    //fs.writeFile("pdf2json.json", JSON.stringify(pdfData), function(err){
    //  if(err){
    //    return console.log(err);
    //  }
    //  console.log("File saved");
    //});
  });
}
