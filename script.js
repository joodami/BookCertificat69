const GAS_URL = "https://script.google.com/macros/s/AKfycbzT3q3QJ3B-nrINQoCLMkdSnBB8z66w536fiC_M_o1aOB5487pwGXiKPudvCfDeyEIZ/exec";

function post(data){
  return fetch(GAS_URL,{
    method:"POST",
    body:new URLSearchParams(data)
  }).then(r=>r.json());
}

// ------------------------------

function updateStartNumber(){
  post({action:"getLastEndNumber"})
    .then(last=>{
      startNumber.value = (last || 0) + 1;
    });
}

function checkNumberValid(){
  const startNum = parseInt(startNumber.value);
  const endNum = parseInt(endNumber.value);

  endNumberMessage.textContent = "";
  saveButton.disabled = true;

  if(!endNum) return;
  if(endNum <= startNum){
    endNumberMessage.textContent = "❌ เลขสิ้นสุดต้องมากกว่าเลขเริ่มต้น";
    return;
  }

  post({
    action:"checkDuplicate",
    startNum,
    endNum
  }).then(r=>{
    if(r.status === "error"){
      endNumberMessage.textContent = "❌ เลขทับซ้อน";
    }else{
      saveButton.disabled = false;
    }
  });
}

dataForm.addEventListener("submit",e=>{
  e.preventDefault();

  post({
    action:"saveData",
    "เลขที่เริ่มต้น": startNumber.value,
    "เลขที่สิ้นสุด": endNumber.value,
    "ให้ไว้ ณ วันที่": dateField.value,
    "โครงการ/กิจกรรม": project.value,
    "ผู้รับผิดชอบ": owner.value
  }).then(r=>{
    if(r.status==="error"){
      alert(r.message);
      return;
    }
    resultMessage.innerHTML = r.message;
    new bootstrap.Modal(resultModal).show();
    dataForm.reset();
    updateStartNumber();
  });
});

endNumber.addEventListener("input",checkNumberValid);
window.addEventListener("DOMContentLoaded",updateStartNumber);
