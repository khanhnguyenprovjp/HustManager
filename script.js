// --- 1. CẤU HÌNH FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyC9CF25rfbVC8xH2eazDlj-QAb4ZRZQwmI",
  authDomain: "hust-manage.firebaseapp.com",
  databaseURL: "https://hust-manage-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hust-manage",
  storageBucket: "hust-manage.firebasestorage.app",
  messagingSenderId: "260277703946",
  appId: "1:260277703946:web:07f69929f07c85c47a96f3",
  measurementId: "G-1PKJ2RKLKG"
};

try { firebase.initializeApp(firebaseConfig); } catch(e) {}
const db = firebase.database();
let currentUser = null;
let currentClassId = null;

// KHỞI TẠO ADMIN
function initAdmin() {
    db.ref('users/kdtapcode').set({ username: "kdtapcode", pass: "123456", role: "ADMIN", name: "Quản trị viên" });
}
initAdmin();

function safeVal(val) { return (val === undefined || val === null || val === 'undefined') ? '' : val; }

// --- AUTH ---
function handleLogin() {
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value;
    db.ref('users/' + u).once('value').then(snapshot => {
        if (!snapshot.exists()) return alert("Tài khoản không tồn tại!");
        const data = snapshot.val();
        if (data.pass !== p) return alert("Sai mật khẩu!");
        currentUser = data;
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('mainDashboard').style.display = 'block';
        document.getElementById('welcomeText').innerText = `Xin chào: ${data.name} (${data.role})`;
        setupDashboard();
    });
}
function handleLogout() { location.reload(); }

function setupDashboard() {
    document.getElementById('adminPanel').style.display = 'none';
    document.getElementById('teacherView').style.display = 'none';
    document.getElementById('studentView').style.display = 'none';

    if (currentUser.role === 'ADMIN') {
        document.getElementById('adminPanel').style.display = 'block';
        loadAdminData();
    } 
    else if (currentUser.role === 'LECTURER') {
        document.getElementById('teacherView').style.display = 'block';
        loadTeacherClasses();
        loadReviews();
    } else {
        document.getElementById('studentView').style.display = 'block';
        loadStudentGrades();
    }
}

// ==========================================
// 2. ADMIN (BẢNG NHẬP LIỆU)
// ==========================================
function showAdminTab(tabId) {
    document.querySelectorAll('.admin-view').forEach(el => el.style.display = 'none');
    document.getElementById('tab' + tabId.charAt(0).toUpperCase() + tabId.slice(1)).style.display = 'block';
}

function loadAdminData() {
    db.ref('users').orderByChild('role').equalTo('LECTURER').on('value', snapshot => {
        const tbody = document.getElementById('teacherTableBody');
        tbody.innerHTML = '';
        snapshot.forEach(child => {
            const u = child.val();
            const userKey = child.key;
            db.ref('lecturers/' + u.id).once('value', lecSnap => {
                const lec = lecSnap.val() || {};
                tbody.innerHTML += `<tr><td><input type="text" value="${safeVal(u.id)}"></td><td><input type="text" value="${safeVal(u.name)}"></td><td><input type="text" value="${safeVal(lec.subjectCode)}"></td><td><input type="text" value="${safeVal(lec.subjectName)}"></td><td><input type="text" value="${safeVal(u.username)}"></td><td><input type="text" value="${safeVal(u.pass)}"></td><td><button class="btn-del-row" onclick="deleteUser('${userKey}','${u.id}','TEACHER')">×</button></td></tr>`;
            });
        });
        setTimeout(() => addRow('TEACHER'), 500);
    });

    db.ref('users').orderByChild('role').equalTo('STUDENT').on('value', snapshot => {
        const tbody = document.getElementById('studentTableBody');
        tbody.innerHTML = '';
        snapshot.forEach(child => {
            const u = child.val();
            const userKey = child.key;
            tbody.innerHTML += `<tr><td><input type="text" value="${safeVal(u.id)}"></td><td><input type="text" value="${safeVal(u.name)}"></td><td><input type="text" value="${safeVal(u.adminClass)}"></td><td><input type="text" value="${safeVal(u.username)}"></td><td><input type="text" value="${safeVal(u.pass)}"></td><td><button class="btn-del-row" onclick="deleteUser('${userKey}','${u.id}','STUDENT')">×</button></td></tr>`;
        });
        setTimeout(() => addRow('STUDENT'), 500);
    });

    db.ref('classes').on('value', snapshot => {
        const tbody = document.getElementById('classTableBody');
        tbody.innerHTML = '';
        snapshot.forEach(child => {
            const c = child.val();
            tbody.innerHTML += `<tr><td><input type="text" value="${safeVal(c.lecturerId)}"></td><td><input type="text" value="${safeVal(c.subjectCode)}"></td><td><input type="text" value="${safeVal(c.subjectName)}"></td><td><input type="text" value="${safeVal(c.classCode)}"></td><td><input type="text" value="${safeVal(c.className)}"></td><td><button class="btn-del-row" onclick="deleteClass('${child.key}')">×</button></td></tr>`;
        });
        setTimeout(() => addRow('CLASS'), 500);
    });
}

function deleteUser(key,id,type) { if(confirm("Xóa?")){ db.ref('users/'+key).remove(); if(type==='TEACHER') db.ref('lecturers/'+id).remove(); if(type==='STUDENT') db.ref('students/'+id).remove(); } }
function deleteClass(key) { if(confirm("Xóa lớp?")) db.ref('classes/'+key).remove(); }

function addRow(type) {
    let id, html;
    if(type==='TEACHER') { id='teacherTableBody'; html=`<td><input></td><td><input></td><td><input></td><td><input></td><td><input></td><td><input></td><td><button class="btn-del-row" onclick="removeRow(this)">×</button></td>`; }
    else if(type==='STUDENT') { id='studentTableBody'; html=`<td><input></td><td><input></td><td><input></td><td><input></td><td><input></td><td><button class="btn-del-row" onclick="removeRow(this)">×</button></td>`; }
    else { id='classTableBody'; html=`<td><input></td><td><input></td><td><input></td><td><input></td><td><input></td><td><button class="btn-del-row" onclick="removeRow(this)">×</button></td>`; }
    const tr=document.createElement('tr'); tr.innerHTML=html; document.getElementById(id).appendChild(tr);
}
function removeRow(btn) { btn.parentElement.parentElement.remove(); }

function saveList(type) {
    const rows = document.getElementById(type === 'TEACHER' ? 'teacherTableBody' : (type === 'STUDENT' ? 'studentTableBody' : 'classTableBody')).querySelectorAll('tr');
    let count = 0;
    rows.forEach(row => {
        const i = row.querySelectorAll('input');
        if(type==='TEACHER') { const vals=Array.from(i).map(x=>x.value.trim()); if(vals[0]&&vals[4]) { db.ref('users/'+vals[4]).set({username:vals[4],pass:vals[5],role:"LECTURER",name:vals[1],id:vals[0]}); db.ref('lecturers/'+vals[0]).set({name:vals[1],subjectCode:vals[2],subjectName:vals[3]}); count++; } }
        else if(type==='STUDENT') { const vals=Array.from(i).map(x=>x.value.trim()); if(vals[0]&&vals[3]) { db.ref('users/'+vals[3]).set({username:vals[3],pass:vals[4],role:"STUDENT",name:vals[1],id:vals[0],adminClass:vals[2]}); db.ref('students/'+vals[0]).set({name:vals[1],adminClass:vals[2]}); count++; } }
        else { const vals=Array.from(i).map(x=>x.value.trim()); if(vals[0]&&vals[3]) { db.ref('classes/'+vals[1]+"_"+vals[3]).set({lecturerId:vals[0],subjectCode:vals[1],subjectName:vals[2],classCode:vals[3],className:vals[4]}); count++; } }
    });
    alert(`Đã lưu ${count} mục.`);
}

// ==========================================
// 3. LOGIC GIẢNG VIÊN (CẬP NHẬT HIỂN THỊ)
// ==========================================
function loadTeacherClasses() {
    const myId = currentUser.id;
    const grid = document.getElementById('classGrid');
    db.ref('classes').on('value', snapshot => {
        grid.innerHTML = '';
        snapshot.forEach(child => {
            const cls = child.val();
            if (cls.lecturerId === myId) {
                // CẬP NHẬT: Hiển thị "Mã Lớp: ..." rõ ràng
                grid.innerHTML += `
                    <div class="class-card" onclick="openGradeModal('${child.key}', '${cls.subjectName}')">
                        <h4>${cls.subjectName}</h4>
                        <p>Mã Lớp: ${cls.classCode}</p>
                    </div>`;
            }
        });
    });
}

function loadReviews() {
    const myId = currentUser.id; 
    const box = document.getElementById('reviewBox');
    db.ref('reviews/' + myId).on('value', snapshot => {
        box.innerHTML = '';
        if(!snapshot.exists()) { box.innerHTML = '<p style="text-align:center; color:gray">Chưa có tin nhắn.</p>'; return; }
        
        snapshot.forEach(child => {
            const msg = child.val();
            const msgKey = child.key;
            
            let replyHtml = msg.reply 
                ? `<div style="color:green; margin-top:5px; font-weight:bold;">✅ Đã trả lời: ${msg.reply}</div>`
                : `<div class="msg-reply-box">
                     <input type="text" id="reply_input_${msgKey}" placeholder="Nhập câu trả lời...">
                     <button class="btn-reply" onclick="submitReply('${myId}', '${msgKey}')">Trả lời</button>
                   </div>`;

            // CẬP NHẬT: Định dạng hiển thị "Mã Lớp: 123, Giải tích 1"
            box.innerHTML += `
                <div class="msg-card">
                    <button class="btn-delete-msg" onclick="deleteReview('${myId}', '${msgKey}')">×</button>
                    <div><b>SV: ${msg.studentName} (${msg.studentId})</b> <span class="msg-time">${new Date(msg.timestamp).toLocaleDateString()}</span></div>
                    <div>Mã Lớp: ${msg.classCode}, ${msg.subjectName}</div>
                    <div style="background:#eee; padding:5px; margin-top:5px;">"${msg.content}"</div>
                    ${replyHtml}
                </div>`;
        });
    });
}

function submitReply(lecturerId, msgKey) {
    const text = document.getElementById(`reply_input_${msgKey}`).value.trim();
    if(!text) return;
    db.ref(`reviews/${lecturerId}/${msgKey}`).update({ reply: text });
}

function deleteReview(lecturerId, msgKey) {
    if(confirm("Xóa tin nhắn phúc khảo này?")) db.ref(`reviews/${lecturerId}/${msgKey}`).remove();
}

function openGradeModal(classId, title) { currentClassId = classId; document.getElementById('gradeModal').style.display='block'; document.getElementById('modalClassName').innerText=title; loadGrades(); }
function closeGradeModal() { document.getElementById('gradeModal').style.display='none'; }
function saveGrade() {
    const mssv = document.getElementById('inputMSSV').value.trim(), qt = parseFloat(document.getElementById('inputQT').value), ck = parseFloat(document.getElementById('inputCK').value);
    if (!mssv) return alert("Thiếu MSSV!");
    db.ref('students/'+mssv).once('value').then(snap=>{
        const total = (qt*0.3 + ck*0.7).toFixed(1);
        const char = total>=8.5?'A':(total>=7?'B':(total>=5.5?'C':(total>=4?'D':'F')));
        db.ref(`grades/${currentClassId}/${mssv}`).set({mssv, name:snap.val()?snap.val().name:"Unknown", qt, ck, total, char});
        document.getElementById('inputMSSV').value='';
    });
}
function loadGrades() {
    db.ref(`grades/${currentClassId}`).on('value', s=>{
        document.getElementById('gradeTableBody').innerHTML = '';
        s.forEach(c=>{ const g=c.val(); document.getElementById('gradeTableBody').innerHTML += `<tr><td>${g.mssv}</td><td>${g.name}</td><td>${g.qt}</td><td>${g.ck}</td><td>${g.total}</td><td>${g.char}</td><td><button style="color:red" onclick="db.ref('grades/${currentClassId}/${g.mssv}').remove()">X</button></td></tr>`; });
    });
}

// ==========================================
// 4. LOGIC SINH VIÊN
// ==========================================
function loadStudentGrades() {
    const myMSSV = currentUser.id;
    const tbody = document.getElementById('studentResultBody');
    tbody.innerHTML = '<tr><td colspan="9">Đang tải...</td></tr>';

    db.ref('classes').once('value', classSnap => {
        tbody.innerHTML = '';
        classSnap.forEach(cls => {
            const classKey = cls.key, d = cls.val();
            db.ref(`grades/${classKey}/${myMSSV}`).once('value', gradeSnap => {
                if (gradeSnap.exists()) {
                    const g = gradeSnap.val();
                    db.ref(`reviews/${d.lecturerId}`).orderByChild('studentId').equalTo(myMSSV).once('value', revSnap => {
                        let replyText = "Chưa có phản hồi";
                        let canSend = true; 
                        let lastMsgTime = 0;

                        if (revSnap.exists()) {
                            revSnap.forEach(r => {
                                const msg = r.val();
                                if (msg.classCode === d.classCode) {
                                    if (msg.reply) replyText = `<span style="color:green; font-weight:bold">${msg.reply}</span>`;
                                    if (msg.timestamp > lastMsgTime) lastMsgTime = msg.timestamp;
                                }
                            });
                        }
                        
                        const now = Date.now();
                        if (now - lastMsgTime < 86400000) canSend = false;

                        db.ref(`lecturers/${d.lecturerId}`).once('value', gv => {
                            tbody.innerHTML += `
                                <tr>
                                    <td>${d.subjectCode}</td><td><b>${d.subjectName}</b></td><td>${d.classCode}</td>
                                    <td>${g.qt}</td><td>${g.ck}</td><td><b>${g.total}</b></td>
                                    <td>${gv.val()?gv.val().name:'Unknown'}</td>
                                    <td>${replyText}</td>
                                    <td>
                                        <div class="request-box">
                                            <input type="text" id="req_${classKey}" placeholder="Nội dung...">
                                            <button class="btn-send-req" onclick="sendReview('${d.lecturerId}','${d.classCode}','${d.subjectName}','${classKey}', ${canSend})">
                                                Gửi
                                            </button>
                                        </div>
                                    </td>
                                </tr>`;
                        });
                    });
                }
            });
        });
    });
}

function sendReview(lecturerId, classCode, subjectName, classKey, canSend) {
    if (!canSend) return alert("Bạn chỉ được gửi 1 tin nhắn mỗi 24 giờ cho môn học này!");
    const content = document.getElementById(`req_${classKey}`).value.trim();
    if (!content) return alert("Vui lòng nhập nội dung!");

    db.ref(`reviews/${lecturerId}`).push({
        studentId: currentUser.id, studentName: currentUser.name, classCode, subjectName, content, timestamp: Date.now(), reply: "" 
    }).then(() => {
        alert("Đã gửi thành công!");
        loadStudentGrades();
    });
}