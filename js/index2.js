// index2.js - GSAP & jQuery Integration for Ziwei Chart
$(function() {
  gsap.to("section", {
    opacity: 1,
    duration: 1,
    y: 0,
    stagger: 0.2,
    ease: "power2.out"
  });

  $('#chartForm').on('submit', function(e) {
    e.preventDefault();
    gsap.to("#resultZone", {
      display: "block",
      opacity: 1,
      duration: 0.8,
      y: 0,
      ease: "back.out"
    });
    
    let formData = {};
    $(this).serializeArray().forEach(item => {
      formData[item.name] = item.value;
    });
    
    generateChartGrid(formData);
    fetchGeminiAnalysis(formData);
  });

  function generateChartGrid(data) {
    const palaces = [
      '命宮', '父母宮', '福德宮', '片冶宮',
      '男女宮', '子女宮', '夫妻宮', '兄弟宮',
      '師古宮', '岳緒宮', '祗約宮', '誘会宮'
    ];
    
    let chartHTML = '';
    palaces.forEach((palace, index) => {
      chartHTML += `
        <div class="palace-card">
          <span class="palace-name">${palace}</span>
          <i class="fas fa-star" style="color: #D9B15F; margin: 0.5rem 0;"></i>
          <span class="palace-index">#${index + 1}</span>
        </div>
      `;
    });
    
    $('#chartGrid').html(chartHTML);
    gsap.to(".palace-card", {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: "back.out"
    });
  }

  function fetchGeminiAnalysis(formData) {
    const apiKey = 'YOUR_GEMINI_API_KEY';
    
    if (apiKey === 'YOUR_GEMINI_API_KEY') {
      $('#fullReport').html(`
        <div style="color: #FFB347; padding: 1rem; border-radius: 0.5rem; background: rgba(255, 179, 71, 0.1);">
          <strong>⚠ API KEY 未提供</strong><br>
          請在 js/index2.js 中修改 'YOUR_GEMINI_API_KEY'<br>
          這是你的 Google Gemini API Key
        </div>
      `);
      return;
    }
    
    const prompt = `
      請你作为一位專業的紫微斗數命理師。根據以下个人資料，求提供完整的紫微斗数命盤解析報告:
      姓名: ${formData.name}
      性別: ${formData.gender === 'male' ? '男' : '女'}
      出生日期: ${formData.birthdate}
      出生時間: ${formData.birthtime}
      出生地點: ${formData.birthplace}
    `;
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    
    $.ajax({
      url: url,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
      success: function(response) {
        const analysisText = response.candidates[0].content.parts[0].text;
        let reportHTML = `<h3>🌌 命盤箱鼏分析</h3><p>${analysisText.replace(/\n/g, '<br>')}</p>`;
        $('#fullReport').html(reportHTML);
        gsap.to("#fullReport", {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      },
      error: function() {
        $('#fullReport').html('<div style="color: #FF6B6B; padding: 1rem;"><strong>⚠ API 上訃失敗</strong></div>');
      }
    });
  }
});

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const scrollPosition = window.scrollY;
    section.style.transform = `translateY(${scrollPosition * 0.05}px)`;
  });
});
