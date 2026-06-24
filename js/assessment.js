/* ===== 压力知觉量表 (PSS-4) 测评逻辑 ===== */

const questions = [
  {
    id: 'q1',
    text: '在过去一个月里，你有多少次感到无法控制生活中重要的事情？',
    options: [
      { value: 0, label: '从不' },
      { value: 1, label: '偶尔' },
      { value: 2, label: '有时' },
      { value: 3, label: '经常' },
      { value: 4, label: '总是' }
    ]
  },
  {
    id: 'q2',
    text: '在过去一个月里，你有多少次对自己处理个人问题的能力感到自信？',
    options: [
      { value: 4, label: '从不' },
      { value: 3, label: '偶尔' },
      { value: 2, label: '有时' },
      { value: 1, label: '经常' },
      { value: 0, label: '总是' }
    ]
  },
  {
    id: 'q3',
    text: '在过去一个月里，你有多少次感到事情在按照你的想法进行？',
    options: [
      { value: 4, label: '从不' },
      { value: 3, label: '偶尔' },
      { value: 2, label: '有时' },
      { value: 1, label: '经常' },
      { value: 0, label: '总是' }
    ]
  },
  {
    id: 'q4',
    text: '在过去一个月里，你有多少次感到困难堆积如山，无法克服？',
    options: [
      { value: 0, label: '从不' },
      { value: 1, label: '偶尔' },
      { value: 2, label: '有时' },
      { value: 3, label: '经常' },
      { value: 4, label: '总是' }
    ]
  }
];

let answers = {};

/* ===== Render Questions ===== */
function renderQuestions() {
  const container = document.getElementById('questions-container');
  if (!container) return;

  container.innerHTML = '';

  questions.forEach((q, index) => {
    const block = document.createElement('div');
    block.className = 'question-block';

    const qNum = document.createElement('span');
    qNum.style.cssText = 'font-size:12px;color:#a0aec0;margin-bottom:8px;display:block';
    qNum.textContent = '第 ' + (index + 1) + ' 题 / 共 4 题';

    const qText = document.createElement('div');
    qText.className = 'question-text';
    qText.textContent = q.text;

    const optionsRow = document.createElement('div');
    optionsRow.className = 'options-row';

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.setAttribute('data-qid', q.id);
      btn.setAttribute('data-value', opt.value);
      btn.innerHTML = opt.label + '<span class="option-label"></span>';

      btn.addEventListener('click', function() {
        selectOption(q.id, opt.value, optionsRow);
      });

      if (answers[q.id] === opt.value) {
        btn.classList.add('selected');
      }

      optionsRow.appendChild(btn);
    });

    block.appendChild(qNum);
    block.appendChild(qText);
    block.appendChild(optionsRow);
    container.appendChild(block);
  });

  updateSubmitButton();
}

function selectOption(qid, value, optionsRow) {
  answers[qid] = value;

  optionsRow.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  const selected = optionsRow.querySelector('[data-value="' + value + '"]');
  if (selected) selected.classList.add('selected');

  updateSubmitButton();
}

function updateSubmitButton() {
  const btn = document.getElementById('submit-assessment');
  if (!btn) return;

  if (Object.keys(answers).length === questions.length) {
    btn.disabled = false;
    btn.textContent = '查看测评结果';
  } else {
    btn.disabled = true;
    btn.textContent = '请完成全部' + questions.length + '道题';
  }
}

function calculateScore() {
  return Object.values(answers).reduce((sum, val) => sum + val, 0);
}

function getResultLevel(score) {
  if (score <= 4) return {
    level: 'low',
    title: '压力水平较低',
    colorClass: 'low',
    desc: '你目前的压力感知处于较低水平，说明你对生活中的挑战有较好的掌控感，能够从容应对日常事务。继续保持现有的心态和应对方式。',
    tips: [
      '保持规律的运动和充足的睡眠',
      '定期进行正念冥想或深呼吸练习',
      '与信任的人保持开放的沟通',
      '设定合理的工作和生活边界'
    ]
  };
  if (score <= 8) return {
    level: 'medium',
    title: '压力水平适中',
    colorClass: 'medium',
    desc: '你感受到一定程度的压力，这在现代生活中很常见。适度的压力可以激发动力，但如果持续上升可能会影响身心健康。建议关注压力信号，适时调整。',
    tips: [
      '每天留出15分钟独处放空的时间',
      '识别并记录压力来源，逐一分析应对策略',
      '尝试渐进式肌肉放松法缓解身体紧张',
      '合理安排优先级，避免多任务并行',
      '考虑参加压力管理专题课程'
    ]
  };
  return {
    level: 'high',
    title: '压力水平偏高',
    colorClass: 'high',
    desc: '你感知到较高的压力水平，可能已经对日常生活和工作产生了明显影响。这并不意味着你不够强大，而是提醒你：是时候认真关注自己的心理健康了。建议尽快采取系统的减压措施。',
    tips: [
      '每天进行20分钟以上的中等强度运动',
      '学习并练习腹式呼吸和正念减压技术',
      '减少咖啡因和酒精的摄入',
      '建立规律的生活作息，保证7-8小时睡眠',
      '勇敢地向专业心理咨询师或EAP服务求助',
      '重新审视工作负荷，学会合理拒绝和授权'
    ]
  };
}

function showResults() {
  const score = calculateScore();
  const result = getResultLevel(score);

  document.getElementById('assessment-form').style.display = 'none';
  const resultSection = document.getElementById('result-section');
  resultSection.style.display = 'block';
  resultSection.classList.add('show');

  document.getElementById('result-score').textContent = score + ' / 16';
  document.getElementById('result-score').className = 'result-score ' + result.colorClass;
  document.getElementById('result-title').textContent = result.title;
  document.getElementById('result-desc').textContent = result.desc;

  const tipsList = document.getElementById('result-tips-list');
  tipsList.innerHTML = '';
  result.tips.forEach(tip => {
    const li = document.createElement('li');
    li.textContent = tip;
    tipsList.appendChild(li);
  });

  resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function resetAssessment() {
  answers = {};
  document.getElementById('assessment-form').style.display = 'block';
  document.getElementById('result-section').style.display = 'none';
  document.getElementById('result-section').classList.remove('show');
  renderQuestions();
  document.getElementById('assessment-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('questions-container')) {
    renderQuestions();

    document.getElementById('submit-assessment').addEventListener('click', showResults);
    document.getElementById('retry-btn').addEventListener('click', resetAssessment);
  }
});
