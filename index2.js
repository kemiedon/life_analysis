// index2.js
// GSAP & jQuery Integration for Ziwei Chart Generation and Analysis

$(function() {
  // GSAP Animation - Progressive Entry
  gsap.to("section", {
    opacity: 1,
    duration: 1,
    y: 0,
    stagger: 0.2,
    ease: "power2.out"
  });

  // Form Submission Handler
  $('#chartForm').on('submit', function(e) {
    e.preventDefault();
    
    // Show result zone with animation
    gsap.to("#resultZone", {
      display: "block",
      opacity: 1,
      duration: 0.8,
      y: 0,
      ease: "back.out"
    });
    
    // Collect form data
    let formData = {};
    $(this).serializeArray().forEach(item => {
      formData[item.name] = item.value;
    });
    
    // Generate 12-Palace Chart
    generateChartGrid(formData);
    
    // Call Gemini API for analysis
    fetchGeminiAnalysis(formData);
  });

  // Function: Generate 12-Palace Grid
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
    
    // Animate chart cards
    gsap.to(".palace-card", {
      opacity: 1,
      scale: 1,
      duration: 0.5,
      stagger: 0.05,
      ease: "back.out"
    });
  }

  // Function: Fetch Gemini API Analysis
  function fetchGeminiAnalysis(formData) {
    const apiKey = 'YOUR_GEMINI_API_KEY'; // 讓使用者提供了API KEY
    
    if (apiKey === 'YOUR_GEMINI_API_KEY') {
      $('#fullReport').html(`
        <div style="color: #FFB347; padding: 1rem; border-radius: 0.5rem; background: rgba(255, 179, 71, 0.1);">
          <strong>⚠ API KEY 未提供</strong><br>
          請在 index2.js 中事改 'YOUR_GEMINI_API_KEY' 为你的 Google Gemini API Key
        </div>
      `);
      return;
    }
    
    // Prepare Gemini API request
    const prompt = `
      請你作为一位專業的紫微斗數命理師。根據以下个人資料，求提供完整的紫微斗數命盤解析報告：
      
      【个人資料】
      - 姓名：${formData.name}
      - 性別：${formData.gender === 'male' ? '男' : '女'}
      - 出生日期：${formData.birthdate}
      - 出生時間：${formData.birthtime}
      - 出生地點：${formData.birthplace}
      
      【要求】
      1. 求提供該人的完整紫微斗數命盤解析
      2. 主要简述今年的整体运势
      3. 简述个人上的优势与挑战
      4. 提辛旧事项预测与发展建议
    `;
    
    // Gemini API Endpoint
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
        // Extract analysis from Gemini response
        const analysisText = response.candidates[0].content.parts[0].text;
        
        // Format and display the report
        let reportHTML = `
          <h3>🌌 命盤箱鼏分析</h3>
          <p>${analysisText.replace(/\n/g, '<br>')}</p>
        `;
        
        $('#fullReport').html(reportHTML);
        
        // Animate report appearance
        gsap.to("#fullReport", {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out"
        });
      },
      error: function(jqXHR, textStatus, errorThrown) {
        $('#fullReport').html(`
          <div style="color: #FF6B6B; padding: 1rem;">
            <strong>⚠ API 上訃失敗</strong><br>
            錉防訓息: ${textStatus} - ${errorThrown}
          </div>
        `);
      }
    });
  }
});

// Parallax Scroll Effect (Optional Enhancement)
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const scrollPosition = window.scrollY;
    section.style.transform = `translateY(${scrollPosition * 0.05}px)`;
  });
});
