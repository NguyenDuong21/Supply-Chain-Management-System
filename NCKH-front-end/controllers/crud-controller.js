let User = require("../models/user");
let LoHang = require("../models/lohang");
let Role = require("../models/Role");
const axios = require('axios');
const { conn, mssql } = require("../utils/database");
const req = require("express/lib/request");
var Jimp = require("jimp");
var fs = require('fs')
var qrCode = require('qrcode-reader');

exports.index = (req, res) => {
  res.render("login", { layout: false });
  // let user = new User(conn);
  // user.get_user().then((result) => {
  //     console.log(result);
  //     return res.render('index', { user: result });
  // }).catch(err => console.log(err));
};
exports.login = async (req, res) => {
  const tendn = req.body.tendangnhap;
  const matkhau = req.body.password;
  const pool = await conn;
  const user = new User(pool, mssql);
  let result = await user.checkUserLogin(tendn, matkhau);

  if (result.recordset.length > 0) {
    // C1: check role load crud
    req.session.User = result.recordset[0];
    if (result.recordset[0].idRoles == "u01") {
      return res.redirect("/homeadmin");
    }
    if (result.recordset[0].idRoles == "u02") {
      return res.redirect("/homethanhtra");
      // return  res.render("thanhtra");
    }
    if (result.recordset[0].idRoles == "u03") {
      return res.redirect("/homethuhoach");
    }
    if (result.recordset[0].idRoles == "u04") {
      return res.redirect("/homedonggoi");
    }
    if (result.recordset[0].idRoles == "u05") {
      return res.redirect("/homephanphoi");
    }
    if (result.recordset[0].idRoles == "u06") {
      return res.redirect("/homethumua");
    }
  } else {
    return res.send("Tài khoản mật khẩu không chính xác");
  }
};
exports.uploadTT = async (req, res) => {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  var buffer = fs.readFileSync('uploads/' + file.filename);
Jimp.read(buffer, function(err, image) {
    if (err) {
        console.error(err);
    }
    // Creating an instance of qrcode-reader module
    let qrcode = new qrCode();
    qrcode.callback = function(err, value) {
        if (err) {
            console.error(err);
        }
        // Printing the decrypted value
        console.log(value.result);
    };
    // Decoding the QR code
    qrcode.decode(image.bitmap);
  });
  res.redirect('/homethanhtra');
}
exports.readQrcode = (req, res) => {
  var buffer = fs.readFileSync('uploads/Employee.png');
  Jimp.read(buffer, function(err, image) {
    if (err) {
        console.error(err);
    }
    // Creating an instance of qrcode-reader module
    let qrcode = new qrCode();
    qrcode.callback = function(err, value) {
        if (err) {
            console.error(err);
        }
        // Printing the decrypted value
        console.log(value.result);
    };
    // Decoding the QR code
    qrcode.decode(image.bitmap);
  });
}
exports.viewbatch = async (req, res) => {
  const pool = await conn;
  const lohang = new LoHang(pool, mssql);
  let malo = req.query.batchno;
  let result = await lohang.laygiaidoan(malo);
  const data = result.recordset[0];
  const arrPromist = [];
  for(const prop in data)
  {
    if(data[prop])
      arrPromist.push( axios({
        method: 'post',
        url: 'http://localhost:5000/getTran',
        data: {
            dataHas: data[prop]
        }
      }).then(res => res.data));
  }
  Promise.all(arrPromist).then(function(values) {
    let objData = {};
    for(var i = 0; i < values.length; i++) 
    {
      if(values[i])
        objData[values[i].type] = values[i];
    }
    console.log(objData);
    res.render('view-batch', {dulieu: objData, malohang: malo});
  });
};
exports.insertLohang = async (req, res) => {
  const pool = await conn;
  const lohang = new LoHang(pool, mssql);
  let { mahash } = req.body;
  const inserted = await lohang.insertLoHang(mahash);
  res.send(inserted);
};
exports.insertGiaiDoan = async (req, res) => {
  const pool = await conn;
  const lohang = new LoHang(pool, mssql);
  let { mahash } = req.body;
  const inserted = await lohang.insertGiaidoan(mahash);
  res.send(inserted);
};
exports.updateGiaiDoan = async (req, res) => {
  const pool = await conn;
  const lohang = new LoHang(pool, mssql);
  let { mahash,giaidoan,malo } = req.body;
  const inserted = await lohang.updateGiaiDoan(mahash,giaidoan,malo);
  res.send(inserted);
};
exports.insertStatusLohang = async (req, res) => {
  const pool = await conn;
  const lohang = new LoHang(pool, mssql);
  let { mahash } = req.body;
  const inserted = await lohang.insertStatusLoHang(mahash);
  res.send(inserted);
};
exports.updateStatusLohang = async (req, res) => {
  const pool = await conn;
  const lohang = new LoHang(pool, mssql);
  let { mahashlohang, loaistatus, giatri } = req.body;
  const inserted = await lohang.updateStatusLohang(mahashlohang, loaistatus, giatri);
  res.send(inserted);
};
exports.adminPage = async (req, res) => {
  const pool = await conn;
  const user = new User(pool, mssql);
  let result = await user.get_nUser();
  let result2 = await user.get_per();
  const data = result.recordset;
  const per1 = result2.recordset;
  const lohang = await user.get_lohang_hash();
  const tblUser = await user.get_tblUser();
  const lohangStatus = await user.get_lohang();
  const solohang = lohang.recordset.length;
  let objStatus = {};
  
  const arrPromist = [];
  lohang.recordset.forEach(function (el) {
    arrPromist.push( axios({
        method: 'post',
        url: 'http://localhost:5000/getTran',
        data: {
            dataHas: el.mahash
        }
      }).then(res => res.data));
  });
  Promise.all(arrPromist).then(function(values) {
    for(var i = 0; i < values.length; i++) 
    {
      for(let j=0; j< lohangStatus.recordset.length; j++)
      {
        if(values[i] != null)
        {
          if(lohangStatus.recordset[j]['idlohang'] == values[i].TxID)
          {
            objStatus[values[i].TxID]= {
              'statusthanhtra' : lohangStatus.recordset[j]['statusthanhtra'],
              'statusdonvithuhoach' : lohangStatus.recordset[j]['statusdonvithuhoach'],
              'statusdonvidonggoi' : lohangStatus.recordset[j]['statusdonvidonggoi'],
              'statusphanphoi' : lohangStatus.recordset[j]['statusphanphoi'],
              'statusthumua' : lohangStatus.recordset[j]['statusthumua']
            }
            
          }
        }
          
      }
    }
    res.render("admin",{data:data, per1:per1,solo:solohang, lohang:values,tblUser:tblUser.recordset, objStatusView:objStatus});
  });

  // const userinfor =  res.locals.user
  // const pool = await conn;
  // const user = new User(pool,mssql);
  // let result = await user.get_nUser()
  // let result2 = await user.get_per()
  // const data = result.recordset;
  // const per1 = result2.recordset;
  // const lohang = await user.get_lohang();
  // const tblUser = await user.get_tblUser();

  // const userinfor =  res.locals.user

  // res.render("admin",{data:data, per1:per1,lohang:lohang.recordset,tblUser:tblUser.recordset});
  
};
exports.thanhtraPage = async (req, res) => {
  const pool = await conn;
  const user = new User(pool, mssql);
  let result = await user.get_nUser();
  let result2 = await user.get_per();
  const data = result.recordset;
  const per1 = result2.recordset;
  const lohang = await user.get_lohang_hash();
  const tblUser = await user.get_tblUser();
  const lohangStatus = await user.get_lohang();
  if (!res.locals.user) {
    return res.redirect("/");
  }
  const userinfor = res.locals.user;
  let objStatus = {};
  
  const arrPromist = [];
  lohang.recordset.forEach(function (el) {
    arrPromist.push( axios({
        method: 'post',
        url: 'http://localhost:5000/getTran',
        data: {
            dataHas: el.mahash
        }
      }).then(res => res.data));
  });
  Promise.all(arrPromist).then(function(values) {
    for(var i = 0; i < values.length; i++) 
    {

      for(let j=0; j< lohangStatus.recordset.length; j++)
      {
        if(lohangStatus.recordset[j]['idlohang'] == values[i].TxID)
        {
          objStatus[values[i].TxID]= {
            'statusthanhtra' : lohangStatus.recordset[j]['statusthanhtra'],
            'statusdonvithuhoach' : lohangStatus.recordset[j]['statusdonvithuhoach'],
            'statusdonvidonggoi' : lohangStatus.recordset[j]['statusdonvidonggoi'],
            'statusphanphoi' : lohangStatus.recordset[j]['statusphanphoi'],
            'statusthumua' : lohangStatus.recordset[j]['statusthumua']
          }
          
        }
      }
    }
    res.render("thanhtra",{userinfor,data:data, per1:per1,lohang:values,tblUser:tblUser.recordset, objStatusView:objStatus});
  });
};

exports.thuhoachPage = async (req, res) => {
  const pool = await conn;
  const user = new User(pool, mssql);
  let result = await user.get_nUser();
  let result2 = await user.get_per();
  const data = result.recordset;
  const per1 = result2.recordset;
  const lohang = await user.get_lohang_hash();
  const tblUser = await user.get_tblUser();
  const lohangStatus = await user.get_lohang();
  if (!res.locals.user) {
    return res.redirect("/");
  }
  const userinfor = res.locals.user;
  let objStatus = {};
  
  const arrPromist = [];
  lohang.recordset.forEach(function (el) {
    arrPromist.push( axios({
        method: 'post',
        url: 'http://localhost:5000/getTran',
        data: {
            dataHas: el.mahash
        }
      }).then(res => res.data));
  });
  Promise.all(arrPromist).then(function(values) {
    for(var i = 0; i < values.length; i++) 
    {

      for(let j=0; j< lohangStatus.recordset.length; j++)
      {
        if(lohangStatus.recordset[j]['idlohang'] == values[i].TxID)
        {
          objStatus[values[i].TxID]= {
            'statusthanhtra' : lohangStatus.recordset[j]['statusthanhtra'],
            'statusdonvithuhoach' : lohangStatus.recordset[j]['statusdonvithuhoach'],
            'statusdonvidonggoi' : lohangStatus.recordset[j]['statusdonvidonggoi'],
            'statusphanphoi' : lohangStatus.recordset[j]['statusphanphoi'],
            'statusthumua' : lohangStatus.recordset[j]['statusthumua']
          }
          
        }
      }
    }
    res.render("thuhoach",{userinfor,data:data, per1:per1,lohang:values,tblUser:tblUser.recordset, objStatusView:objStatus});
  });
};
exports.donggoiPage = async (req, res) => {
  if (!res.locals.user) {
    return res.redirect("/");
  }
  const pool = await conn;
  const user = new User(pool, mssql);
  let result = await user.get_nUser();
  let result2 = await user.get_per();
  const data = result.recordset;
  const per1 = result2.recordset;
  const lohang = await user.get_lohang_hash();
  const tblUser = await user.get_tblUser();
  const lohangStatus = await user.get_lohang();
  const userinfor = res.locals.user;

  let objStatus = {};
  
  const arrPromist = [];
  lohang.recordset.forEach(function (el) {
    arrPromist.push( axios({
        method: 'post',
        url: 'http://localhost:5000/getTran',
        data: {
            dataHas: el.mahash
        }
      }).then(res => res.data));
  });
  Promise.all(arrPromist).then(function(values) {
    for(var i = 0; i < values.length; i++) 
    {

      for(let j=0; j< lohangStatus.recordset.length; j++)
      {
        if(lohangStatus.recordset[j]['idlohang'] == values[i].TxID)
        {
          objStatus[values[i].TxID]= {
            'statusthanhtra' : lohangStatus.recordset[j]['statusthanhtra'],
            'statusdonvithuhoach' : lohangStatus.recordset[j]['statusdonvithuhoach'],
            'statusdonvidonggoi' : lohangStatus.recordset[j]['statusdonvidonggoi'],
            'statusphanphoi' : lohangStatus.recordset[j]['statusphanphoi'],
            'statusthumua' : lohangStatus.recordset[j]['statusthumua']
          }
          
        }
      }
    }
    res.render("donggoi",{userinfor,data:data, per1:per1,lohang:values,tblUser:tblUser.recordset, objStatusView:objStatus});
  });

};
exports.phanphoiPage = async (req, res) => {
  if (!res.locals.user) {
    return res.redirect("/");
  }
  const pool = await conn;
  const user = new User(pool, mssql);
  let result = await user.get_nUser();
  let result2 = await user.get_per();
  const data = result.recordset;
  const per1 = result2.recordset;
  const lohang = await user.get_lohang_hash();
  const tblUser = await user.get_tblUser();
  const lohangStatus = await user.get_lohang();
  const userinfor = res.locals.user;

  let objStatus = {};
  
  const arrPromist = [];
  lohang.recordset.forEach(function (el) {
    arrPromist.push( axios({
        method: 'post',
        url: 'http://localhost:5000/getTran',
        data: {
            dataHas: el.mahash
        }
      }).then(res => res.data));
  });
  Promise.all(arrPromist).then(function(values) {
    for(var i = 0; i < values.length; i++) 
    {

      for(let j=0; j< lohangStatus.recordset.length; j++)
      {
        if(lohangStatus.recordset[j]['idlohang'] == values[i].TxID)
        {
          objStatus[values[i].TxID]= {
            'statusthanhtra' : lohangStatus.recordset[j]['statusthanhtra'],
            'statusdonvithuhoach' : lohangStatus.recordset[j]['statusdonvithuhoach'],
            'statusdonvidonggoi' : lohangStatus.recordset[j]['statusdonvidonggoi'],
            'statusphanphoi' : lohangStatus.recordset[j]['statusphanphoi'],
            'statusthumua' : lohangStatus.recordset[j]['statusthumua']
          }
          
        }
      }
    }
    res.render("phanphoi",{userinfor,data:data, per1:per1,lohang:values,tblUser:tblUser.recordset, objStatusView:objStatus});
  });

};
exports.thumuaPage = async (req, res) => {
  if (!res.locals.user) {
    return res.redirect("/");
  }
  const pool = await conn;
  const user = new User(pool, mssql);
  let result = await user.get_nUser();
  let result2 = await user.get_per();
  const data = result.recordset;
  const per1 = result2.recordset;
  const lohang = await user.get_lohang_hash();
  const tblUser = await user.get_tblUser();
  const lohangStatus = await user.get_lohang();
  const userinfor = res.locals.user;

  let objStatus = {};
  
  const arrPromist = [];
  lohang.recordset.forEach(function (el) {
    arrPromist.push( axios({
        method: 'post',
        url: 'http://localhost:5000/getTran',
        data: {
            dataHas: el.mahash
        }
      }).then(res => res.data));
  });
  Promise.all(arrPromist).then(function(values) {
    for(var i = 0; i < values.length; i++) 
    {

      for(let j=0; j< lohangStatus.recordset.length; j++)
      {
        if(lohangStatus.recordset[j]['idlohang'] == values[i].TxID)
        {
          objStatus[values[i].TxID]= {
            'statusthanhtra' : lohangStatus.recordset[j]['statusthanhtra'],
            'statusdonvithuhoach' : lohangStatus.recordset[j]['statusdonvithuhoach'],
            'statusdonvidonggoi' : lohangStatus.recordset[j]['statusdonvidonggoi'],
            'statusphanphoi' : lohangStatus.recordset[j]['statusphanphoi'],
            'statusthumua' : lohangStatus.recordset[j]['statusthumua']
          }
          
        }
      }
    }
    res.render("thumua",{userinfor,data:data, per1:per1,lohang:values,tblUser:tblUser.recordset, objStatusView:objStatus});
  });

};

exports.getRoles = async (req, res) => {
  const pool = await conn;
  let roles = new Role(pool);
  let allRoles = await roles.getAllRole();
  res.json(allRoles);
};
exports.create = (req, res) => {
  res.send(crudModel.createCrud() + req.query.id);
};
exports.delete = (req, res) => {
  res.send(crudModel.deleteCrud());
};
exports.edit = (req, res) => {
  res.send(crudModel.editCrud());
};
exports.fetch = (req, res) => {
  res.send(crudModel.fetchCrud());
};
exports.genQr = (req, res) => {
  res.render('genQrcode');
}