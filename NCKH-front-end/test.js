
const QRCode = require("qrcode");
const GenarateQR = async (text) => {
    let obj = {
        name: 'duong',
        age: 12
    }
    let data = {
        name:"Employee Name",
        age:27,
        department:"Police",
        id:"aisuoiqu3234738jdhf100223"
    }
     
    // Converting the data into String format
    let stringdata = JSON.stringify(obj)
    QRCode.toFile("qrcode/data.jpg",stringdata, function (err) {
        if (err) throw err
  console.log('done')
    })
}

GenarateQR("abc");
