let globalLohang;
function editActivityPhanPhoi(lohang)
{
    globalLohang = lohang;
    $('#malo').val(lohang);
    console.log(globalLohang);
}
$("#save").on('click', function(e){
    e.preventDefault();
    let type = "phanphoi";
    let madonvi = $('#madonvi').val();
    let phuongtien = $('#phuongtien').val();
    let bienso = $('#bienso').val();
    let diachigiao = $('#diachigiao').val();
    let ngaygiao = formatDate($('#ngaygiao').val());
    let soluonggiao = $('#soluonggiao').val();
    let donvitinh = $('#donvitinh').val();
    let privateKey = '138a70fdc13710218470344510556d71d8544adb63daadd2ca4be2e9121e1dd0';
    const data = { type,madonvi, phuongtien, bienso,diachigiao,ngaygiao,soluonggiao,donvitinh, privateKey};

    fetch('http://localhost:5000/themphanphoi', {
    method: 'POST', // or 'PUT'
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        $.ajax({
            url:'http://localhost:3000/updategiaidoan',
            method:'post',
            data: {mahash:data.message, giaidoan: 'phanphoi', malo:globalLohang}
        }).done(function(res){
        });

        $.ajax({
            url:'http://localhost:3000/updateStatusLohang',
            method:'post',
            data: {mahashlohang: globalLohang, loaistatus: 'statusphanphoi', giatri:3}
        }).done(function(res){
            window.location.href = window.location.href;
        });
    })
    .catch((error) => {
    console.error('Error:', error);
    });
})