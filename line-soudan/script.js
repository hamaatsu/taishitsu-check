document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("sendToLineButton");

  if (!btn) return;

  // ▼▼▼ 妊娠・授乳欄：性別が男性のときは非表示にする ▼▼▼
  const genderSelect = document.getElementById("userGender");
  const pregnancyGroup = document.getElementById("pregnancyGroup");
  const pregnancyChecks = Array.prototype.slice.call(document.querySelectorAll(".pregnancy-check"));

  if (genderSelect && pregnancyGroup) {
    const togglePregnancy = () => {
      const hide = genderSelect.value === "男性";
      pregnancyGroup.style.display = hide ? "none" : "";
      if (hide) pregnancyChecks.forEach(c => { c.checked = false; });
    };
    genderSelect.addEventListener("change", togglePregnancy);
    togglePregnancy();
  }

  // ▼▼▼ 妊娠・授乳欄：「いずれも該当しない」と他の項目は同時に選べない ▼▼▼
  const pregnancyNone = document.getElementById("pregnancyNone");
  if (pregnancyNone) {
    const others = pregnancyChecks.filter(c => c !== pregnancyNone);
    pregnancyNone.addEventListener("change", () => {
      if (pregnancyNone.checked) others.forEach(c => { c.checked = false; });
    });
    others.forEach(c => {
      c.addEventListener("change", () => {
        if (c.checked) pregnancyNone.checked = false;
      });
    });
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();

    // ▼▼▼ 0. 同意チェック（必須・未チェックなら送信しない） ▼▼▼
    const agree = document.getElementById("agreeCheck");
    if (agree && !agree.checked) {
      alert("「上記の内容に同意します（必須）」にチェックを入れてください。");
      agree.focus();
      return;
    }

    // ▼▼▼ 0-2. お名前・ふりがな（必須・未入力なら送信しない） ▼▼▼
    const nameInput = document.getElementById("userName");
    if (nameInput && !nameInput.value.trim()) {
      alert("お名前をご入力ください。");
      nameInput.focus();
      return;
    }

    const kanaInput = document.getElementById("userKana");
    if (kanaInput && !kanaInput.value.trim()) {
      alert("ふりがなをご入力ください。");
      kanaInput.focus();
      return;
    }

    // ▼▼▼ 0-3. 妊娠・授乳（必須・女性のみ表示） ▼▼▼
    const pregnancyShown = pregnancyGroup && pregnancyGroup.style.display !== "none";
    const pregnancySelected = pregnancyChecks.filter(c => c.checked).map(c => c.value);
    if (pregnancyShown && pregnancySelected.length === 0) {
      alert("妊娠・授乳についてご回答ください。あてはまるものがない場合は「いずれも該当しない」をお選びください。");
      pregnancyGroup.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    // ▼▼▼ 1. 基本情報の取得 ▼▼▼
    const name = nameInput ? nameInput.value.trim() : "";
    const kana = kanaInput ? kanaInput.value.trim() : "";
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
    // 男性で妊娠・授乳欄を出していない場合は、その行ごと送らない
    const pregnancyLine = pregnancyShown ? `\n妊娠・授乳：${pregnancySelected.join("・")}` : "";

    const messageText = `【基本情報】
お名前：${name || "未入力"}
ふりがな：${kana || "未入力"}
年齢：${age || "未入力"}歳
性別：${gender || "未入力"}
地域：${pref || "未入力"}
困っている症状：${symptom || "なし"}
いつから：${duration || "不明"}
服用薬：${medicine || "なし"}${pregnancyLine}

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