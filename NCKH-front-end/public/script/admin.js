
$("#duyet").on("click", function(e){
    var start = new Date().getTime();
    const data = {
        type: "lohang",
        "farmerRegistrationNo": "123456788",
                    "farmerName": "Nguyễn Xuân Dương",
                    "farmerAddress": "Hà Nội",
                    "exporterName": "Công ty TNHH abc",
                    "donggoi": "Công ty TNHH xyz"
    };
    fetch('http://localhost:5000/gettransaction', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            var end = new Date().getTime();
            var time = end - start;
            console.log(data);
            console.log('Execution time duyet: ' + time);

        })
        .catch((error) => {
        console.error('Error:', error);
        });
});
$("#tree").on("click", function(e){
    var start = new Date().getTime();
    const data = {
        dataHas: "b26613d2a22050dce33d4e82b1f1997b5f0c9fbcbde0cef0cd8258c0bee660ab"
    };
    fetch('http://localhost:5000/getTran', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            var end = new Date().getTime();
            var time = end - start;
            console.log(data);

            console.log('Execution time tree: ' + time);

        })
        .catch((error) => {
        console.error('Error:', error);
        });
})
$('#create').on('click', function(e){
    e.preventDefault();
    
        let type = "lohang";
        let farmerRegistrationNo = $('#farmerRegistrationNo').val();
        let farmerName = $('#farmerName').val();
        let farmerAddress = $('#farmerAddress').val();
        let exporterName = $('#exporterName').val();
        let donggoi = $('#importerName').val();
        let privateKey = '138a70fdc13710218470344510556d71d8544adb63daadd2ca4be2e9121e1dd0';
        const data = { type,farmerRegistrationNo, farmerName, farmerAddress, exporterName, donggoi,privateKey};
    
        fetch('http://localhost:5000/themlo', {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            $.ajax({
                url:'http://localhost:3000/insertlohang',
                method:'post',
                data: {mahash:data.message}
            }).done(function(res){
            });
            $.ajax({
                url:'http://localhost:3000/insertgiaidoan',
                method:'post',
                data: {mahash:data.message}
            }).done(function(res){
            });
            $.ajax({
                url:'http://localhost:3000/insertStatusLohang',
                method:'post',
                data: {mahash:data.message}
            }).done(function(res){
                window.location.href = window.location.href;
            });
        })
        .catch((error) => {
        console.error('Error:', error);
        });
    
});