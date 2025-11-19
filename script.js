    let radarChart = null; // レーダーチャートのインスタンス保存用

    // 8タイプの名称
    const TYPES = ["気虚", "気滞", "血虚", "瘀血", "水滞", "陰虚", "陽虚", "陽熱"];

    // 質問ごとの配点表
    // キー：data-qid の値
    // 値： [気虚, 気滞, 血虚, 瘀血, 水滞, 陰虚, 陽虚, 陽熱]
    const QUESTION_SCORES = {
      // 【1】感情・眠り
      q_emotion_irritability:      [0, 3, 0, 1, 0, 0, 0, 2],
      q_emotion_anger:             [0, 3, 0, 1, 0, 0, 0, 2],
      q_emotion_anxiety:           [2, 1, 1, 0, 0, 1, 1, 0],
      q_emotion_tension:           [1, 1, 1, 0, 0, 1, 0, 0],
      q_emotion_sigh_chest:        [0, 3, 0, 1, 0, 0, 0, 0],
      q_sleep_many_dreams:         [1, 1, 1, 0, 0, 2, 0, 0],
      q_sleep_shallow:             [1, 0, 1, 0, 0, 2, 0, 1],
      q_sleep_daytime_sleepy:      [2, 0, 1, 0, 0, 0, 1, 0],
      q_sleep_hot_insomnia:        [0, 0, 0, 0, 0, 1, 0, 3],

      // 【2】体の傾向
      q_tendency_cold_handsfeet:   [1, 0, 0, 0, 1, 0, 3, 0],
      q_tendency_facial_flushing:  [0, 1, 0, 0, 0, 0, 0, 3],
      q_tendency_upper_hot_lower_cold: [0, 1, 0, 0, 1, 0, 1, 3],
      q_tendency_edema:            [0, 0, 0, 0, 3, 0, 1, 0],
      q_tendency_heavy:            [1, 1, 0, 0, 3, 0, 1, 0],
      q_tendency_sweat:            [0, 0, 0, 0, 0, 0, 0, 2],
      q_tendency_easy_fatigue:     [3, 0, 0, 0, 1, 0, 2, 0],
      q_tendency_pale_face:        [0, 0, 3, 1, 0, 0, 0, 0],
      q_tendency_short_breath:     [3, 0, 1, 0, 0, 0, 1, 0],

      // 【3】体の状態
      q_state_stiff_shoulder_neck: [0, 2, 0, 2, 0, 0, 0, 0],
      q_state_fixed_pain:          [0, 0, 0, 3, 0, 0, 0, 0],
      q_state_numb_handsfeet:      [0, 0, 2, 1, 0, 0, 0, 0],
      q_state_dry_skin:            [0, 0, 1, 0, 0, 3, 0, 1],
      q_state_spots_dullness:      [0, 0, 2, 2, 0, 0, 0, 0],
      q_state_acne:                [0, 1, 0, 2, 0, 0, 0, 3],
      q_state_inflammation_redness:[0, 0, 0, 1, 0, 0, 0, 3],
      q_state_hot_flash:           [0, 0, 0, 0, 0, 2, 0, 3],
      q_state_night_sweat:         [0, 0, 0, 0, 0, 3, 0, 2],

      // 【4】舌・口・目
      q_tongue_pale:               [1, 0, 0, 0, 2, 0, 2, 0],
      q_tongue_red:                [0, 0, 0, 0, 0, 1, 0, 3],
      q_tongue_teethmarks:         [1, 0, 0, 0, 1, 0, 2, 0],
      q_tongue_coat_white_thick:   [0, 0, 0, 0, 3, 0, 1, 0],
      q_tongue_coat_yellow_thick:  [0, 0, 0, 1, 0, 0, 0, 3],
      q_tongue_dry_cracked:        [0, 0, 0, 0, 0, 3, 0, 1],
      q_mouth_dry:                 [0, 0, 0, 0, 0, 3, 0, 1],
      q_eye_fatigue:               [1, 1, 2, 0, 0, 0, 0, 0],
      q_eye_red:                   [0, 0, 0, 0, 0, 0, 0, 3],

      // 【5】消化・便通・食欲
      q_digest_poor_appetite:      [2, 0, 1, 0, 0, 0, 2, 0],
      q_digest_postprandial_sleepy:[2, 0, 0, 0, 2, 0, 1, 0],
      q_digest_bloating:           [1, 2, 0, 0, 2, 0, 0, 0],
      q_digest_soft_stool:         [0, 0, 0, 0, 2, 0, 2, 0],
      q_digest_diarrhea:           [0, 0, 0, 0, 1, 0, 3, 0],
      q_digest_constipation:       [0, 2, 0, 2, 0, 0, 0, 1],
      q_digest_alt_diarrhea_constipation:[0, 2, 0, 1, 1, 0, 1, 0],

      // 【6】月経（該当者のみ）
      q_menses_short_cycle:        [0, 0, 0, 0, 0, 0, 0, 3],
      q_menses_long_cycle:         [2, 0, 2, 0, 0, 1, 2, 0],
      q_menses_irregular:          [1, 2, 1, 0, 0, 0, 1, 0],
      q_menses_heavy:              [0, 0, 0, 1, 0, 0, 0, 2],
      q_menses_light:              [2, 0, 3, 0, 0, 1, 1, 0],
      q_menses_bright_red:         [0, 0, 0, 0, 0, 0, 0, 2],
      q_menses_dark_clots:         [0, 0, 0, 3, 0, 0, 0, 0],
      q_menses_strong_pain:        [0, 1, 0, 3, 0, 0, 0, 1],
      q_menses_pain_relieve_warm:  [0, 0, 0, 2, 0, 0, 1, 0],
      q_menses_pain_worse_cold:    [0, 0, 0, 2, 1, 0, 2, 0],
      q_menses_premenstrual_breast:[0, 2, 0, 0, 1, 0, 0, 0],
      q_menses_premenstrual_irritability:[0, 3, 0, 1, 0, 0, 0, 2],
      q_menses_premenstrual_edema: [0, 1, 0, 0, 3, 0, 1, 0]
    };

    function calculateScores() {
      const rawScores = new Array(TYPES.length).fill(0);
      const maxScores = new Array(TYPES.length).fill(0);

      // 質問ごとの理論上の最大値（正規化用）
      Object.values(QUESTION_SCORES).forEach(arr => {
        arr.forEach((val, idx) => {
          if (val > 0) maxScores[idx] += val;
        });
      });

      const checkedInputs = document.querySelectorAll('input[data-qid]:checked');

      // 何もチェックされていないときは警告
      if (checkedInputs.length === 0) {
        alert("少なくとも1つは当てはまる項目にチェックを入れてください。");
        return null;
      }

      checkedInputs.forEach(input => {
        const qid = input.getAttribute('data-qid');
        const scoreArray = QUESTION_SCORES[qid];
        if (!scoreArray) return;
        scoreArray.forEach((val, idx) => {
          rawScores[idx] += val;
        });
      });

      const normalizedScores = rawScores.map((val, idx) => {
        const max = maxScores[idx];
        if (max === 0) return 0;
        return Math.round((val / max) * 100);
      });

      return normalizedScores;
    }

    function renderResults(scores) {
      // 前回のチャートがあれば一度破棄
      if (radarChart) {
        radarChart.destroy();
        radarChart = null;
      }

      // スコアを高い順に並べて上位3つを取り出す
      const paired = TYPES.map((name, idx) => ({
        name,
        score: scores[idx]
      })).sort((a, b) => b.score - a.score);

      const top3 = paired.slice(0, 3);
      const topResultsEl = document.getElementById("topResults");
      const allScoresEl = document.getElementById("allScores");

      if (topResultsEl) {
        let html = '<div class="results-card">';
        html += '  <div class="results-header">判定結果</div>';
        html += '  <div class="results-main">';
        html += '    <div class="results-main-left">';
        html += '      <p class="results-main-title">あなたの体質タイプ（上位3つ）</p>';
        html += '      <ol class="top-type-list">';

        top3.forEach((item, idx) => {
          html += `
            <li class="top-type-item">
              <span class="rank-badge">No.${idx + 1}</span>
              <span class="type-label">${item.name}タイプ</span>
              <span class="type-score">${item.score}点 / 100</span>
            </li>
          `;
        });

        html += '      </ol>';
        html += '    </div>'; // results-main-left

        html += '    <div class="results-main-right">';
        html += '      <p class="results-subtitle">体質バランス</p>';
        html += '      <div class="radar-wrap"><canvas id="typeRadar"></canvas></div>';
        html += '    </div>'; // results-main-right

        html += '  </div>'; // results-main
        html += '</div>';   // results-card

        topResultsEl.innerHTML = html;
      }

      // allScores は今回は使わないので空にしておく
      if (allScoresEl) {
        allScoresEl.innerHTML = "";
      }

      // レーダーチャートを描画（毎回新しく作る）
      const radarCanvas = document.getElementById("typeRadar");
      if (radarCanvas) {
        const ctx = radarCanvas.getContext("2d");

        const data = {
          labels: TYPES,
          datasets: [{
            label: "体質スコア",
            data: scores,          // 0〜100
            fill: true,
            backgroundColor: "rgba(201,161,106,0.18)",
            borderColor: "#c9a16a",
            pointBackgroundColor: "#c9a16a",
            pointBorderColor: "#ffffff",
            pointRadius: 3
          }]
        };

        const options = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 100,
              ticks: {
                stepSize: 20,
                color: "rgba(0, 0, 0, 0.1)",
                backdropColor: "transparent"
              },
              grid: {
                color: "rgba(0,0,0,0.06)"
              },
              angleLines: {
                color: "rgba(0,0,0,0.06)"
              },
              pointLabels: {
                font: { size: 11 }
              }
            }
          }
        };

        radarChart = new Chart(ctx, {
          type: "radar",
          data,
          options
        });
      }

      // ここで体質バッジエリアを表示させる
      const infoArea = document.getElementById("taishitsuInfoArea");
      if (infoArea) {
        infoArea.style.display = "block";
      }

      // 結果までスクロール
      if (topResultsEl) {
        topResultsEl.scrollIntoView({ behavior: "smooth" });
      }
    }

    document.addEventListener("DOMContentLoaded", () => {
      const btn = document.getElementById("diagnoseButton");
      if (!btn) return;

      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const scores = calculateScores();
        if (!scores) return;
        renderResults(scores);
      });
    });