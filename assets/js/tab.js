// tab.js
/**
 * 탭 전환 시 해당 탭을 보이게 하고, 현재 시나리오에 맞춰
 * iframe[data-src-template]을 {scenario} 치환 후 src에 할당합니다.
 */
function openCity(evt, cityName) {
  document.querySelectorAll('.tabcontent').forEach(c => c.style.display = 'none');
  document.querySelectorAll('.tablinks').forEach(t => t.classList.remove('active'));

  document.getElementById(cityName).style.display = 'block';
  evt.currentTarget.classList.add('active');

  // ⏺ 현재 시나리오 값 가져와 그래프 로드
  const scenario = document.getElementById('scenario-select').value;
  document
    .querySelectorAll(`#${cityName} iframe[data-src-template]`)
    .forEach(frame => {
      const tpl = frame.dataset.srcTemplate;
      frame.src = tpl.replace('{scenario}', scenario);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  // 첫 탭 자동 클릭 → 그래프 최초 로드
  const firstTab = document.querySelector('.tablinks');
  if (firstTab) firstTab.click();
});
