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

function validateTextField(input, messageEl, text){
  if(!input.value.trim()){
    messageEl.textContent = `❌ กรุณากรอก${text}`;
    return false;
  }
  messageEl.textContent = "";
  return true;
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

// 🔴 ตรวจทุกช่องก่อน submit
dataForm.addEventListener("submit",e=>{
  e.preventDefault();

  const validDate = validateTextField(dateField, dateMessage, "วันที่");
  const validProject = validateTextField(project, projectMessage, "โครงการ/กิจกรรม");
  const validOwner = validateTextField(owner, ownerMessage, "ผู้รับผิดชอบ");

  if(!validDate || !validProject || !validOwner){
    saveButton.disabled = true;
    return;
  }

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

// ตรวจทันทีที่พิมพ์
endNumber.addEventListener("input",checkNumberValid);
dateField.addEventListener("input",()=>validateTextField(dateField,dateMessage,"วันที่"));
project.addEventListener("input",()=>validateTextField(project,projectMessage,"โครงการ/กิจกรรม"));
owner.addEventListener("input",()=>validateTextField(owner,ownerMessage,"ผู้รับผิดชอบ"));

window.addEventListener("DOMContentLoaded",updateStartNumber);
