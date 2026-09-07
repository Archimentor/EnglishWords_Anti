(function () {
  const options = { 2:["02 2안","2안 영단어 마스터"], 3:["03 3안","3안 Wordline"], 4:["04 4안","4안 영문법 마스터"], 5:["05 5안","5안 Grammar Blueprint"] };
  try {
    const last = JSON.parse(localStorage.getItem("englishwords-last-course"));
    if (!options[last?.option]) return;
    const link = document.getElementById("last-course");
    link.href = "./" + encodeURIComponent(options[last.option][0]) + "/";
    link.textContent = "최근 이용한 " + options[last.option][1] + " 이어가기 →";
    link.hidden = false;
  } catch (_) { /* Recent activity is optional. */ }
})();
