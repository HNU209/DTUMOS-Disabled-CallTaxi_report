// stats-loader.js
/**
 * stats-loader.js: 시나리오별 통계 로드 및 현재 탭 그래프 재실행
 */

// 1) stats.csv 로드 및 스팬·테이블 갱신
async function loadAndApplyStats(scenario = 'Baseline') {
  const csvUrl = `./assets/data/${scenario}/stats.csv`;
  try {
    const res = await fetch(csvUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    const lines = text.trim().split('\n');
    const [headerLine, dataLine, ...tableLines] = lines;
    const headers = headerLine.split(',').map(h => h.trim());
    const values  = dataLine.split(',').map(v => v.trim());
    const stats   = {};
    headers.forEach((h, i) => stats[h] = values[i] || '-');

    // 스팬 업데이트
    document.getElementById('total-calls').textContent        = stats['total_calls'] || '-';
    document.getElementById('service-failures').textContent = stats['service_failures'] || '-';
    document.getElementById('service-failure-rate').textContent       = stats['service_failure_rate'] || '-';
    document.getElementById('request-failures').textContent = stats['request_failures'] || '-';
    document.getElementById('request-failure-rate').textContent       = stats['request_failure_rate'] || '-';
    document.getElementById('vehicles-driven').textContent    = stats['vehicles_driven'] || '-';

    // 테이블 갱신 (추가적 정보 표시)
    const tbody = document.querySelector('#stats-table tbody');
    if (tbody) {
      tbody.innerHTML = '';
      tableLines.forEach(line => {
        const cols = line.split(',').map(c => c.trim());
        const tr = document.createElement('tr');
        cols.forEach(c => {
          const td = document.createElement('td');
          td.textContent = c;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error('Failed to load stats.csv for scenario:', scenario, err);
  }
}

// 2) 초기화 및 이벤트 바인딩
document.addEventListener('DOMContentLoaded', async () => {
  const select = document.getElementById('scenario-select');

  // 첫 로드시 스팬·테이블 로드
  await loadAndApplyStats(select.value);
  // 첫 탭 그래프 로드
  const firstTab = document.querySelector('.tablinks');
  if (firstTab) firstTab.click();

  // 시나리오 변경 시 동작
  select.addEventListener('change', async e => {
    const scenario = e.target.value;
    await loadAndApplyStats(scenario);

    // 현재 활성 탭 그래프 재실행
    const curTab = document.querySelector('.tablinks.active');
    if (curTab) {
      const match    = curTab.getAttribute('onclick').match(/'(.+)'/);
      const cityName = match ? match[1] : null;
      if (cityName && typeof openCity === 'function') {
        openCity({ currentTarget: curTab }, cityName);
      }
    }
  });
});