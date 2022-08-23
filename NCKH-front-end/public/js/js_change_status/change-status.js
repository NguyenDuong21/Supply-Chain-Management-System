window.addEventListener('DOMContentLoaded', (event) => {
    const statustt = document.querySelectorAll(".statusthanhtra")
    const statusth = document.querySelectorAll(".statusdonvithuhoach")
    const statusdg = document.querySelectorAll(".statusdonvidonggoi")
    const statuspp = document.querySelectorAll(".statusphanphoi")
    const statustm = document.querySelectorAll(".statusthumua")
    const statuslh = document.querySelectorAll(".statuslohang")
    change_status(statustt)
    change_status(statusth)
    change_status(statusdg)
    change_status(statuspp)
    change_status(statustm)
    change_status(statuslh)

    function change_status(status){
        for(let i= 0; i<status.length;i++){
            var stt =   status[i].textContent
            console.log(stt);
            if(stt==1){
              status[i].textContent = "Chưa xử lý"
              status[i].classList.add("status1");
            }
            if(stt==2){
              status[i].textContent = "Đang xử lý"
              status[i].classList.add("status2");
            }
            if(stt==3){
              status[i].textContent = "Đã xử lý"
              status[i].classList.add("status3");
            }
          }
    }
});
function formatDate(input) {
  var array = (input || '').toString().split(/\-/g);
  return '' + array[2] + '/' + array[1] + '/' + array[0];
};