
const QRCode = require("qrcode");
var qrCode = require('qrcode-reader');
var Jimp = require("jimp");
var fs = require('fs')
let User = require("../models/user");
let LoHang = require("../models/lohang");
let Role = require("../models/Role");
const axios = require('axios');
const { conn, mssql } = require("../utils/database");
function formatDate(input) {
    var array = (input || '').toString().split(/\-/g);
    return '' + array[2] + '/' + array[1] + '/' + array[0];
};
const GenarateQR = async (text) => {
    let obj = {
        name: 'duong',
        age: 12
    }
    let data = {
        name: "Employee Name",
        age: 27,
        department: "Police",
        id: "aisuoiqu3234738jdhf100223"
    }

    // Converting the data into String format
    let stringdata = JSON.stringify(obj)
    QRCode.toFile("qrcode/data.jpg", stringdata, function (err) {
        if (err) throw err
        console.log('done')
    })
}

const genQrThanhtra = (req, res) => {
    let type = "thanhtra";
    const { giongcay, loaiphanbon, muavu } = req.body;
    let privateKey = '138a70fdc13710218470344510556d71d8544adb63daadd2ca4be2e9121e1dd0';
    const data = { type, giongcay, loaiphanbon, muavu, privateKey };
    let stringdata = JSON.stringify(data);
    let namefile = `qrcode/thanhtra${Date.now()}.jpg`;
    QRCode.toFile(namefile, stringdata, function (err) {
        if (err) throw err
        console.log('done');
        res.redirect('/genQr');
    })
    return;
}
const genQrThuHoach = (req, res) => {
    let type = "thuhoach";
    const { loaisanpham, sanluong, donvitinh } = req.body;
    let privateKey = '138a70fdc13710218470344510556d71d8544adb63daadd2ca4be2e9121e1dd0';
    const data = { type, loaisanpham, sanluong, donvitinh, privateKey };
    let stringdata = JSON.stringify(data);
    let namefile = `qrcode/thuhoach${Date.now()}.jpg`;
    QRCode.toFile(namefile, stringdata, function (err) {
        if (err) throw err
        console.log('done');
        res.redirect('/genQr');
    })
    return;
}
const genQrDongGoi = (req, res) => {
    let type = "donggoi";
    const { madonvi, diacchi, soluong, donvitinh } = req.body;
    let ngaynhan = formatDate(req.body.ngaynhan);
    let ngaydonggoi = formatDate(req.body.ngaydonggoi);
    let hansudung = formatDate(req.body.hansudung);
    let privateKey = '138a70fdc13710218470344510556d71d8544adb63daadd2ca4be2e9121e1dd0';
    const data = { type, madonvi, diacchi, ngaynhan, soluong, donvitinh, ngaydonggoi, hansudung, privateKey };
    let stringdata = JSON.stringify(data);
    let namefile = `qrcode/donggoi${Date.now()}.jpg`;
    QRCode.toFile(namefile, stringdata, function (err) {
        if (err) throw err
        console.log('done');
        res.redirect('/genQr');
    })
    return;
}
const genQrPhanPhoi = (req, res) => {
    let type = "phanphoi";
    const { madonvi, phuongtien, bienso, diachigiao, soluonggiao, donvitinh } = req.body;
    let ngaygiao = formatDate(req.body.ngaygiao);
    let privateKey = '138a70fdc13710218470344510556d71d8544adb63daadd2ca4be2e9121e1dd0';
    const data = { type, madonvi, phuongtien, bienso, diachigiao, ngaygiao, soluonggiao, donvitinh, privateKey };
    let stringdata = JSON.stringify(data);
    let namefile = `qrcode/phanphoi${Date.now()}.jpg`;
    QRCode.toFile(namefile, stringdata, function (err) {
        if (err) throw err
        console.log('done');
        res.redirect('/genQr');
    })
    return;
}
const genQrThuMua = (req, res) => {
    let type = "thumua1";
    const { madonvi, diachi, soluongnhan, donvitinh } = req.body;
    let ngaynhan = formatDate(req.body.ngaynhan);
    let privateKey = '138a70fdc13710218470344510556d71d8544adb63daadd2ca4be2e9121e1dd0';
    const data = { type, madonvi, diachi, ngaynhan, soluongnhan, donvitinh, privateKey };
    let stringdata = JSON.stringify(data);
    let namefile = `qrcode/thumua${Date.now()}.jpg`;
    QRCode.toFile(namefile, stringdata, function (err) {
        if (err) throw err
        console.log('done');
        res.redirect('/genQr');
    })
    return;
}
const scanQrThanhtra = (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    var buffer = fs.readFileSync('uploads/' + file.filename);
    Jimp.read(buffer, function (err, image) {
        if (err) {
            console.error(err);
        }
        // Creating an instance of qrcode-reader module
        let qrcode = new qrCode();
        qrcode.callback = function (err, value) {
            if (err) {
                console.error(err);
            }
            // Printing the decrypted value
            const { type, giongcay, loaiphanbon, muavu, privateKey } = JSON.parse(value.result);
            const malo = req.body.malo;
            axios('http://localhost:5000/themthanhtra', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                data: { type, giongcay, loaiphanbon, muavu, privateKey },
            })
                .then(async (response) => {
                    const data= response.data;
                    const pool = await conn;
                    const lohang = new LoHang(pool, mssql);
                    const inserted = await lohang.updateGiaiDoan(data.message,'thanhtra',malo);
                    const updated = await lohang.updateStatusLohang(malo, 'statusthanhtra', 3);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };
        // Decoding the QR code
        qrcode.decode(image.bitmap);
    });
    res.redirect('/homethanhtra');
}
const scanQrThuHoach = (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    var buffer = fs.readFileSync('uploads/' + file.filename);
    Jimp.read(buffer, function (err, image) {
        if (err) {
            console.error(err);
        }
        // Creating an instance of qrcode-reader module
        let qrcode = new qrCode();
        qrcode.callback = function (err, value) {
            if (err) {
                console.error(err);
            }
            // Printing the decrypted value
            const { type,loaisanpham, sanluong, donvitinh, privateKey} = JSON.parse(value.result);
            const malo = req.body.malo;
            axios('http://localhost:5000/themthuhoach', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                data: { type,loaisanpham, sanluong, donvitinh, privateKey},
            })
                .then(async (response) => {
                    const data= response.data;
                    console.log(data);
                    const pool = await conn;
                    const lohang = new LoHang(pool, mssql);
                    const inserted = await lohang.updateGiaiDoan(data.message,'thuhoach',malo);
                    const updated = await lohang.updateStatusLohang(malo, 'statusdonvithuhoach', 3);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };
        // Decoding the QR code
        qrcode.decode(image.bitmap);
    });
    res.redirect('/homethuhoach');
}
const scanQrDongGoi = (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    var buffer = fs.readFileSync('uploads/' + file.filename);
    Jimp.read(buffer, function (err, image) {
        if (err) {
            console.error(err);
        }
        // Creating an instance of qrcode-reader module
        let qrcode = new qrCode();
        qrcode.callback = function (err, value) {
            if (err) {
                console.error(err);
            }
            // Printing the decrypted value
            const { type,madonvi, diacchi, ngaynhan,soluong,donvitinh,ngaydonggoi,hansudung, privateKey} = JSON.parse(value.result);
            const malo = req.body.malo;
            axios('http://localhost:5000/themdonggoi', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                data: { type,madonvi, diacchi, ngaynhan,soluong,donvitinh,ngaydonggoi,hansudung, privateKey},
            })
                .then(async (response) => {
                    const data= response.data;
                    const pool = await conn;
                    const lohang = new LoHang(pool, mssql);
                    const inserted = await lohang.updateGiaiDoan(data.message,'donggoi',malo);
                    const updated = await lohang.updateStatusLohang(malo, 'statusdonvidonggoi', 3);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };
        // Decoding the QR code
        qrcode.decode(image.bitmap);
    });
    res.redirect('/homedonggoi');
}
const scanQrPhanPhoi = (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    var buffer = fs.readFileSync('uploads/' + file.filename);
    Jimp.read(buffer, function (err, image) {
        if (err) {
            console.error(err);
        }
        // Creating an instance of qrcode-reader module
        let qrcode = new qrCode();
        qrcode.callback = function (err, value) {
            if (err) {
                console.error(err);
            }
            // Printing the decrypted value
            const{ type,madonvi, phuongtien, bienso,diachigiao,ngaygiao,soluonggiao,donvitinh, privateKey} = JSON.parse(value.result);
            const malo = req.body.malo;
            axios('http://localhost:5000/themphanphoi', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                data:{ type,madonvi, phuongtien, bienso,diachigiao,ngaygiao,soluonggiao,donvitinh, privateKey},
            })
                .then(async (response) => {
                    const data= response.data;
                    const pool = await conn;
                    const lohang = new LoHang(pool, mssql);
                    const inserted = await lohang.updateGiaiDoan(data.message,'phanphoi',malo);
                    const updated = await lohang.updateStatusLohang(malo, 'statusphanphoi', 3);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };
        // Decoding the QR code
        qrcode.decode(image.bitmap);
    });
    res.redirect('/homephanphoi');
}
const scanQrThuMua = (req, res, next) => {
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    var buffer = fs.readFileSync('uploads/' + file.filename);
    Jimp.read(buffer, function (err, image) {
        if (err) {
            console.error(err);
        }
        // Creating an instance of qrcode-reader module
        let qrcode = new qrCode();
        qrcode.callback = function (err, value) {
            if (err) {
                console.error(err);
            }
            // Printing the decrypted value
            let { type,madonvi, diachi, ngaynhan,soluongnhan,donvitinh, privateKey} = JSON.parse(value.result);
            type = 'thumua';
            const malo = req.body.malo;
            axios('http://localhost:5000/themthumua', {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                },
                data: { type,madonvi, diachi, ngaynhan,soluongnhan,donvitinh, privateKey},
            })
                .then(async (response) => {
                    const data= response.data;
                    const pool = await conn;
                    const lohang = new LoHang(pool, mssql);
                    const inserted = await lohang.updateGiaiDoan(data.message,'thumua',malo);
                    const updated = await lohang.updateStatusLohang(malo, 'statusthumua', 3);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
        };
        // Decoding the QR code
        qrcode.decode(image.bitmap);
    });
    res.redirect('/homethumua');
}
 
module.exports = { genQrThanhtra, genQrThuHoach, genQrDongGoi, genQrPhanPhoi, genQrThuMua, scanQrThanhtra ,scanQrThuHoach,scanQrDongGoi,scanQrPhanPhoi,scanQrThuMua}