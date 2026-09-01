"""Build the browser-ready A1-C1 curriculum from open lexical sources.

The generated file is a mechanical derivative of:
- CEFR-J Vocabulary Profile 1.5 (A1-B2)
- Octanove Vocabulary Profile 1.0 (C1)
- Open English-Korean Dictionary (Korean meanings, IPA, frequency)
- Openjam (open English definitions and examples)

Example:
  python scripts/build_cefr_curriculum.py \
    --cefrj path/to/cefrj-vocabulary-profile-1.5.csv \
    --octanove path/to/octanove-vocabulary-profile-c1c2-1.0.csv \
    --dictionary path/to/words.json \
    --openjam path/to/words_en.json \
    --curated data/curated-core.js \
    --output data/cefr-curriculum.js
"""

from __future__ import annotations

import argparse
import csv
import json
from collections import defaultdict
from pathlib import Path


LEVEL_ORDER = {"A1": 0, "A2": 1, "B1": 2, "B2": 3, "C1": 4}
POS_KO = {
    "noun": "명사",
    "adjective": "형용사",
    "verb": "동사",
    "vern": "동사",
    "adverb": "부사",
    "pronoun": "대명사",
    "preposition": "전치사",
    "determiner": "한정사",
    "conjunction": "접속사",
    "number": "수사",
    "modal auxiliary": "조동사",
    "be-verb": "be동사",
    "do-verb": "do동사",
    "have-verb": "have동사",
    "interjection": "감탄사",
    "infinitive-to": "to부정사",
    "": "표현",
}

LEVEL_META = {
    "A1": {
        "id": "a1",
        "code": "CEFR A1",
        "name": "A1 기초",
        "title": "생활 영어의 출발",
        "school": "기초·초등 입문",
        "description": "가족, 학교, 수와 시간처럼 가장 구체적인 일상을 이해하는 단계",
        "ghost": "A",
        "unitPrefix": "생활 기초",
        "unitFocus": "눈으로 보고 바로 이해하는 기본 어휘",
    },
    "A2": {
        "id": "a2",
        "code": "CEFR A2",
        "name": "A2 초급",
        "title": "일상 표현 확장",
        "school": "초등 완성",
        "description": "일상 과제와 익숙한 상황을 문장으로 설명하는 단계",
        "ghost": "B",
        "unitPrefix": "일상 확장",
        "unitFocus": "익숙한 상황을 구체적으로 설명하는 어휘",
    },
    "B1": {
        "id": "b1",
        "code": "CEFR B1",
        "name": "B1 중급",
        "title": "독립적인 의사소통",
        "school": "중등 기본",
        "description": "의견과 이유를 연결하고 일반적인 글의 요지를 파악하는 단계",
        "ghost": "C",
        "unitPrefix": "독립 표현",
        "unitFocus": "이유와 경험을 연결해 표현하는 어휘",
    },
    "B2": {
        "id": "b2",
        "code": "CEFR B2",
        "name": "B2 중상급",
        "title": "복합 지문 독해",
        "school": "중등 심화·고등 기본",
        "description": "추상적 주제와 논증의 세부 관계를 정확히 읽는 단계",
        "ghost": "D",
        "unitPrefix": "복합 독해",
        "unitFocus": "논리와 추상 개념을 구별하는 어휘",
    },
    "C1": {
        "id": "c1",
        "code": "CEFR C1",
        "name": "C1 고급",
        "title": "고급·학술 영어",
        "school": "고등 심화·수능 이후",
        "description": "함축, 논지, 전문적·학술적 표현을 유연하게 이해하는 단계",
        "ghost": "E",
        "unitPrefix": "고급 학술",
        "unitFocus": "함축과 정교한 논지를 추적하는 고급 어휘",
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cefrj", type=Path, required=True)
    parser.add_argument("--octanove", type=Path, required=True)
    parser.add_argument("--dictionary", type=Path, required=True)
    parser.add_argument("--openjam", type=Path, required=True)
    parser.add_argument("--curated", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    return parser.parse_args()


def load_profile(path: Path, allowed_levels: set[str]) -> list[dict[str, str]]:
    with path.open(encoding="utf-8-sig", newline="") as handle:
        return [row for row in csv.DictReader(handle) if row.get("CEFR") in allowed_levels]


def load_curated(path: Path) -> dict[str, dict[str, str]]:
    curated: dict[str, dict[str, str]] = {}
    for line in path.read_text(encoding="utf-8").splitlines():
        candidate = line.strip().rstrip(",")
        if not candidate.startswith('"') or not candidate.endswith('"'):
            continue
        try:
            value = json.loads(candidate)
        except json.JSONDecodeError:
            continue
        parts = value.split("|")
        if len(parts) != 5:
            continue
        word, meaning, pos, example, example_meaning = parts
        curated[word.lower()] = {
            "meaning": meaning,
            "pos": pos,
            "example": example,
            "exampleMeaning": example_meaning,
        }
    return curated


def build_rows(args: argparse.Namespace) -> tuple[list[list[object]], dict[str, int]]:
    dictionary = json.loads(args.dictionary.read_text(encoding="utf-8"))
    openjam_items = json.loads(args.openjam.read_text(encoding="utf-8"))
    openjam = {item["english"].lower(): item for item in openjam_items}
    curated = load_curated(args.curated)

    entries: dict[str, dict[str, object]] = {}
    pos_by_word: dict[str, set[str]] = defaultdict(set)

    profile_rows = load_profile(args.cefrj, {"A1", "A2", "B1", "B2"})
    profile_rows += load_profile(args.octanove, {"C1"})

    for source in profile_rows:
        word = source["headword"].strip().lower()
        level = source["CEFR"]
        if not word or len(word) > 48:
            continue
        existing = entries.get(word)
        if existing is None or LEVEL_ORDER[level] < LEVEL_ORDER[str(existing["level"])]:
            entries[word] = {"word": word, "level": level}
        pos_by_word[word].add(source.get("pos", ""))

    rows_by_level: dict[str, list[dict[str, object]]] = defaultdict(list)
    for word, entry in entries.items():
        dictionary_entry = dictionary.get(word)
        if not dictionary_entry or not dictionary_entry.get("meaning_ko"):
            continue

        level = str(entry["level"])
        curated_entry = curated.get(word, {})
        openjam_entry = openjam.get(word, {})
        senses = openjam_entry.get("senses") or []
        first_sense = senses[0] if senses else {}

        source_pos = sorted(pos_by_word[word], key=lambda value: (value == "", value))
        pos = "·".join(dict.fromkeys(POS_KO.get(value, value or "표현") for value in source_pos))
        if curated_entry.get("pos"):
            pos = str(curated_entry["pos"])

        meaning = str(curated_entry.get("meaning") or dictionary_entry["meaning_ko"])
        definition = str(
            first_sense.get("definition_en")
            or dictionary_entry.get("meaning_en")
            or ""
        )
        example = str(curated_entry.get("example") or first_sense.get("example_en") or "")
        example_meaning = str(curated_entry.get("exampleMeaning") or "")
        rank = dictionary_entry.get("freq_rank")
        if not isinstance(rank, int):
            rank = 999999

        rows_by_level[level].append({
            "word": word,
            "meaning": meaning,
            "pos": pos,
            "ipa": str(dictionary_entry.get("ipa") or ""),
            "definition": definition,
            "example": example,
            "exampleMeaning": example_meaning,
            "rank": rank,
        })

    output_rows: list[list[object]] = []
    counts: dict[str, int] = {}
    for level in LEVEL_ORDER:
        level_rows = sorted(rows_by_level[level], key=lambda row: (int(row["rank"]), str(row["word"])))
        counts[level] = len(level_rows)
        for row in level_rows:
            output_rows.append([
                level,
                row["word"],
                row["meaning"],
                row["pos"],
                row["ipa"],
                row["definition"],
                row["example"],
                row["exampleMeaning"],
                row["rank"],
            ])
    return output_rows, counts


def write_output(path: Path, rows: list[list[object]], counts: dict[str, int]) -> None:
    cumulative = 0
    levels: list[dict[str, object]] = []
    for level in LEVEL_ORDER:
        cumulative += counts[level]
        levels.append({
            **LEVEL_META[level],
            "cefr": level,
            "count": counts[level],
            "cumulative": cumulative,
        })

    header = """/*
 * GENERATED FILE — do not hand edit.
 * wordline A1-C1 curriculum, built from openly licensed lexical resources.
 * See THIRD_PARTY_NOTICES.md and scripts/build_cefr_curriculum.py.
 */
"""
    meta = {
        "version": 2,
        "unitSize": 20,
        "total": len(rows),
        "counts": counts,
        "cumulative": {item["cefr"]: item["cumulative"] for item in levels},
    }
    serialized_rows = json.dumps(rows, ensure_ascii=False, separators=(",", ":"))
    serialized_levels = json.dumps(levels, ensure_ascii=False, separators=(",", ":"))
    serialized_meta = json.dumps(meta, ensure_ascii=False, separators=(",", ":"))

    runtime = f"""{header}const WORDLINE_DATA_META={serialized_meta};
const WORDLINE_LEVELS={serialized_levels};
const WORDLINE_WORD_ROWS={serialized_rows};

const WORDLINE_WORDS=WORDLINE_WORD_ROWS.map((row,index)=>{{
  const [cefr,word,meaning,pos,ipa,definitionEn,example,exampleMeaning,frequencyRank]=row;
  const stage=WORDLINE_LEVELS.find(item=>item.cefr===cefr);
  return {{
    id:`${{stage.id}}-${{String(index+1).padStart(4,"0")}}`,
    word,meaning,pos,ipa,definitionEn,example,exampleMeaning,frequencyRank,
    cefr,stageId:stage.id,stageName:stage.name
  }};
}});

const WORDLINE_CURRICULUM=WORDLINE_LEVELS.map((stage,stageIndex)=>{{
  const stageWords=WORDLINE_WORDS.filter(word=>word.stageId===stage.id);
  const units=[];
  for(let offset=0;offset<stageWords.length;offset+=WORDLINE_DATA_META.unitSize){{
    const unitIndex=Math.floor(offset/WORDLINE_DATA_META.unitSize);
    const id=`${{stage.id}}-${{unitIndex+1}}`;
    const unitTitle=`${{stage.unitPrefix}} ${{String(unitIndex+1).padStart(2,"0")}}`;
    const words=stageWords.slice(offset,offset+WORDLINE_DATA_META.unitSize).map(word=>{{
      word.unitId=id;
      word.unitTitle=unitTitle;
      return word;
    }});
    units.push({{id,index:unitIndex,title:unitTitle,focus:stage.unitFocus,words}});
  }}
  return {{...stage,index:stageIndex,units}};
}});
"""
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(runtime, encoding="utf-8")


def main() -> None:
    args = parse_args()
    rows, counts = build_rows(args)
    write_output(args.output, rows, counts)
    print(json.dumps({"total": len(rows), "counts": counts}, ensure_ascii=False))


if __name__ == "__main__":
    main()
