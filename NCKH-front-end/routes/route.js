const express = require('express');
const multer = require('multer');
const crudController = require('../controllers/crud-controller');
const genQrController = require('../controllers/genQr');
let router = express.Router();
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() +'.jpg')
    }
  });
var upload = multer({ storage: storage });
router.get("/", crudController.index);
router.post("/", crudController.login);
router.post('/insertlohang',crudController.insertLohang);
router.post('/insertgiaidoan',crudController.insertGiaiDoan);
router.post('/updategiaidoan',crudController.updateGiaiDoan);
router.post('/insertStatusLohang',crudController.insertStatusLohang);
router.post('/updateStatusLohang',crudController.updateStatusLohang);
router.post('/scanQrThanhtra', upload.single('myFile'),genQrController.scanQrThanhtra)
router.post('/scanQrThuHoach', upload.single('myFile'),genQrController.scanQrThuHoach)
router.post('/scanQrDongGoi', upload.single('myFile'),genQrController.scanQrDongGoi)
router.post('/scanQrPhanPhoi', upload.single('myFile'),genQrController.scanQrPhanPhoi)
router.post('/scanQrThuMua', upload.single('myFile'),genQrController.scanQrThuMua)
router.get("/homeadmin", crudController.adminPage);
router.get("/homethanhtra", crudController.thanhtraPage);
router.get("/homethuhoach", crudController.thuhoachPage);
router.get("/homedonggoi", crudController.donggoiPage);
router.get("/homephanphoi", crudController.phanphoiPage);
router.get("/homethumua", crudController.thumuaPage);
router.get("/view-batch", crudController.viewbatch);
router.get("/roles", crudController.getRoles);
router.get("/create", crudController.create);
router.get('/edit', crudController.edit);
router.get('/delete', crudController.delete);
router.get('/fetch', crudController.fetch);
router.post('/uploadimg', upload.single('myFile'), crudController.uploadTT);
router.get('/readqrcode', crudController.readQrcode);
router.get("/genQr", crudController.genQr);
router.post("/genQrThanhTra", genQrController.genQrThanhtra);
router.post("/genQrThuHoach", genQrController.genQrThuHoach);
router.post("/genQrDongGoi", genQrController.genQrDongGoi);
router.post("/genQrPhanPhoi", genQrController.genQrPhanPhoi);
router.post("/genQrThuMua", genQrController.genQrThuMua);

module.exports = router;