(function () {
  "use strict";
  const bar = document.querySelector(".portal-bar");
  const protectedKeys = new Set(), conflictedKeys = new Set();
  try { localStorage.setItem("englishwords-last-course", JSON.stringify({ option:Number(bar?.dataset.course), at:Date.now() })); } catch (_) {}
  function warn(message) {
    const existing = document.getElementById("storage-warning");
    if (existing) { if (message) existing.textContent = message; return; }
    const note = document.createElement("p");
    note.id = "storage-warning"; note.className = "storage-warning"; note.setAttribute("role","status");
    note.textContent = message || "학습 기록을 저장할 수 없습니다. 현재 학습은 계속할 수 있지만, 창을 닫기 전에 설정에서 기록을 백업해 주세요.";
    bar?.after(note);
  }
  window.LearningData = {
    read(key) { try { return localStorage.getItem(key); } catch (_) { warn(); return null; } },
    write(key,value) { if (conflictedKeys.has(key)) return false; try { localStorage.setItem(key,value); return true; } catch (_) { warn(); return false; } },
    warn,
    mount({ dialog,key,getState,validate }) {
      protectedKeys.add(key);
      const section = document.createElement("section");
      section.className = "data-backup";
      section.innerHTML = '<b>학습 기록 백업</b><p>진도와 복습 일정을 파일로 보관하세요. 가져오기는 현재 기록을 교체하며, 교체 전 기록은 자동으로 내려받습니다.</p><div class="data-backup-actions"><button type="button" data-backup="export">백업 내려받기</button><button type="button" data-backup="import">백업 가져오기</button><input type="file" accept=".json,application/json" aria-label="학습 기록 백업 파일"></div><p role="status" class="backup-status"></p>';
      (dialog.querySelector("form") || dialog).append(section);
      const status = section.querySelector(".backup-status"), input = section.querySelector("input");
      function download() {
        const blob = new Blob([JSON.stringify({ format:"englishwords-backup-v1",app:key,exportedAt:new Date().toISOString(),state:getState() },null,2)],{type:"application/json"});
        const url = URL.createObjectURL(blob), link = document.createElement("a");
        link.href = url; link.download = key + "-" + new Date().toISOString().slice(0,10) + ".json";
        link.click(); setTimeout(() => URL.revokeObjectURL(url),1000);
      }
      section.querySelector('[data-backup="export"]').onclick = () => { download(); status.textContent = "백업 파일을 내려받았습니다."; };
      section.querySelector('[data-backup="import"]').onclick = () => input.click();
      input.onchange = async () => {
        const file = input.files[0]; if (!file) return;
        try {
          if (file.size > 12*1024*1024) throw new Error("파일이 너무 큽니다.");
          const backup = JSON.parse(await file.text());
          if (backup.format !== "englishwords-backup-v1" || backup.app !== key || !validate(backup.state)) throw new Error("이 학습기의 올바른 백업 파일이 아닙니다.");
          if (!window.confirm("백업 파일로 현재 학습 기록을 교체할까요? 현재 기록은 먼저 파일로 내려받습니다.")) return;
          download();
          if (!window.LearningData.write(key,JSON.stringify(backup.state))) throw new Error("저장 공간을 확인한 후 다시 시도하세요.");
          window.dispatchEvent(new Event("learning-data-imported"));
          location.reload();
        } catch (error) { status.textContent = error.message || "백업 파일을 읽을 수 없습니다."; }
        finally { input.value = ""; }
      };
    }
  };
  window.addEventListener("storage", event => {
    if (event.key !== null && !protectedKeys.has(event.key)) return;
    if (event.oldValue === event.newValue) return;
    for (const key of protectedKeys) if (event.key === null || event.key === key) conflictedKeys.add(key);
    warn("다른 탭에서 이 학습기의 기록이 변경되었습니다. 덮어쓰기를 막기 위해 현재 탭의 저장을 멈췄습니다. 필요한 내용은 설정에서 백업한 뒤 새로고침해 최신 기록을 불러오세요.");
  });
})();
