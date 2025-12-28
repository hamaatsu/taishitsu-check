document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("sendToLineButton");

  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    // ▼▼▼ 1. 基本情報の取得 ▼▼▼
    const age = document.getElementById("userAge").value;
    const gender = document.getElementById("userGender").value;
    const pref = document.getElementById("userPref").value;
    const symptom = document.getElementById("userSymptom").value;
    const duration = document.getElementById("userDuration").value;
    const medicine = document.getElementById("userMedicine").value;
    // ★追加：その他欄の取得
    const note = document.getElementById("userNote").value;

    // ▼▼▼ 2. 全ての質問項目を取得して処理 ▼▼▼
    const allQuestions = document.querySelectorAll('.question-item input[type="checkbox"]');
    
    let symptomList = [];

    allQuestions.forEach(input => {
      let text = input.parentElement.innerText || input.parentElement.textContent;
      text = text.replace(/[\n\r]+|^\s+|\s+$/g, ''); 

      // チェックがあれば「+」、なければ「-」
      const mark = input.checked ? "+" : "-";
      symptomList.push(`${text}${mark}`);
    });

    // ▼▼▼ 3. LINEに送る文章を作成 ▼▼▼
    const messageText = `【基本情報】
年齢：${age || "未入力"}歳
性別：${gender || "未入力"}
地域：${pref || "未入力"}
困っている症状：${symptom || "なし"}
いつから：${duration || "不明"}
服用薬：${medicine || "なし"}

【その他】
${note || "なし"}

【回答データ】
${symptomList.join('\n')}

この内容で漢方相談をお願いします。`;

    // ▼▼▼ 4. LINEを起動する ▼▼▼
    const yourLineId = "@281clqmv"; 
    const encodedMsg = encodeURIComponent(messageText);
    
    window.location.href = `https://line.me/R/oaMessage/${yourLineId}/?${encodedMsg}`;
  });
});