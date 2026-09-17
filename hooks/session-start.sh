#!/bin/bash
# NE:        proje-kiti oturum başlangıcı kancası — plugin açıksa HER oturumda,
#            hangi klasörde olursa olsun, ajana kitin varlığını ve anlatım ölçütünü hatırlatır.
# AKIŞ:      Claude Code SessionStart → hooks.json → bu betik → stdout'taki JSON bağlama eklenir.
# NEDEN VAR: Kit projesi olmayan bir klasörde (CLAUDE.md yok) ajan kiti bilmez; kurallar yalnızca
#            beceri çağrılınca ya da proje kurulunca yüklenirdi. Kullanıcı "plugin açıksa hep bilmeli" dedi.
# KARARLAR:  Kuralın KOPYASI enjekte edilmez — özet + tam yol. Kural tek yerde kalır
#            (11-agent-workflow.md → "HER KAVRAM ÖĞRETİLİR"). Biçim agent-skills eklentisiyle aynı (jq + priority/message).
# DİKKAT:    jq yoksa sessizce INFO döner, oturum kırılmaz. Metin kısa tutulur — her oturumda yüklenir.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
STD="$ROOT/skills/yeni-proje/dosyalar/docs/standards"
VERSION=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' "$ROOT/.claude-plugin/plugin.json" 2>/dev/null | head -1)

if ! command -v jq >/dev/null 2>&1; then
  echo '{"priority": "INFO", "message": "proje-kiti: jq bulunamadı; oturum kancası çalışmadı (brew install jq). Beceriler yine kullanılabilir."}'
  exit 0
fi

read -r -d '' MESSAGE <<MSG
proje-kiti ${VERSION} yüklü. Bu oturumda, klasör ne olursa olsun geçerli:

ANLATIM ÖLÇÜTÜ — kullanıcıya bir şey anlatırken işe yeni başlamış bir junior'a ders anlatır gibi:
sorunla başla · tek bir örneği baştan sona taşı · ilk geçen HER terimi geçtiği yerde aç
(ad ve TR/EN eş anlamlıları → gerçek hayat benzetmesi → yazılım dünyasındaki tanımı ve başka
teknolojideki karşılığı → bu projede nerede) · kodu satır satır Türkçe yorumla · sonunda kararı
veren soruyu bırak. Dört başlığa birer cümle yazmak, madde yığını, gerekçesiz "best practice budur"
= kural ihlali. Uzunluk sınırı yok, eksiklik sınırı var. Bir boşluğu "adı + nereye" diye listelemek
anlatım değildir. Tam kural: ${STD}/11-agent-workflow.md → "HER KAVRAM ÖĞRETİLİR".

KİT NEREDE — bu klasör kit projesi değilse (CLAUDE.md yok) standartlar şurada:
${STD}/ (00-stack … 18-seo). Yeni proje: /yeni-proje · kite kural: /kit-senkron · PDF: /pdf-uret.
Kit projesindeysen projenin CLAUDE.md'si ve docs/standards/ zaten yüklüdür; bu not onların yerine geçmez.
MSG

jq -cn --arg message "$MESSAGE" '{priority: "IMPORTANT", message: $message}'
