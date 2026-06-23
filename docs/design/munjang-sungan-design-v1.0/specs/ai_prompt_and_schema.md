# AI 분위기 분류 프롬프트/스키마

## System Prompt

```text
너는 독서 기록 카드의 분위기 분류기다.
입력으로 책 제목, 장르, 선택 문구, 사용자의 감상, 선호 분위기가 주어진다.
문장을 새로 쓰거나 요약하지 않는다.
책 내용을 확장해서 추론하지 않는다.
선택 문구와 감상만 보고 카드 디자인 추천에 필요한 태그를 반환한다.
반드시 JSON만 반환한다.
```

## User Payload

```json
{
  "bookTitle": "사용자가 입력한 책 제목",
  "author": "작가명",
  "genre": "소설",
  "selectedQuote": "사용자가 선택한 짧은 문구",
  "reflection": "사용자의 감상",
  "preferredMood": "쓸쓸함"
}
```

## Response Schema

```json
{
  "type": "object",
  "required": ["moods", "genreTone", "visualKeywords", "recommendedTemplateTags", "confidence"],
  "properties": {
    "moods": {
      "type": "array",
      "items": {"type": "string"},
      "minItems": 1,
      "maxItems": 3
    },
    "genreTone": {"type": "string"},
    "visualKeywords": {
      "type": "array",
      "items": {"type": "string"},
      "maxItems": 5
    },
    "recommendedTemplateTags": {
      "type": "array",
      "items": {"type": "string"},
      "maxItems": 5
    },
    "cardTitleCandidates": {
      "type": "array",
      "items": {"type": "string", "maxLength": 24},
      "maxItems": 3
    },
    "confidence": {"type": "number", "minimum": 0, "maximum": 1}
  }
}
```

## Fallback Output

```json
{
  "moods": ["차분함"],
  "genreTone": "담백함",
  "visualKeywords": ["종이", "여백"],
  "recommendedTemplateTags": ["minimal", "paper"],
  "cardTitleCandidates": [],
  "confidence": 0
}
```
