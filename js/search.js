const dictionary=[
 {keys:["sky","skies","heaven","天空","天","昊","盖","ciel","firmament","苍穹","穹苍"],page:"words/sky.html"},
 {keys:["space","spatial","spatial semantics","空间","空间语义","盖天","position","direction","boundary","above","cover"],page:"protocol/protocol.space.html"},
 {keys:["sky utp","utp sky","sky translation","translation sky","sky evaluation","翻译评测","sky 翻译","天空翻译","盖 翻译"],page:"translation/sky.utp.html"},
 {keys:["utp","translation protocol","translation laboratory","翻译实验室","翻译协议"],page:"translation-protocol.html"},
 {keys:["protocol","protocol book","semantic protocol","协议","协议书","语义协议"],page:"protocol.html"},
 {keys:["dictionary","language book","词典","语言书"],page:"dictionary.html"},
 {keys:["universe","cosmos","宇宙","世界","univers","monde"],page:"dictionary.html#universe"},
 {keys:["man","male","human","person","男","男人","男子","氓","meng","mang","humain","homme"],page:"words/man.html"},
 {keys:["experiment 001a","001a","ai annotation","blind annotation","exploratory ai annotation","实验001a","ai盲标","探索性ai标注"],page:"experiments/001a/ai-annotation-record.html"},
 {keys:["language","speech","语言","言语","langue","langage"],page:"dictionary.html#language"},
 {keys:["knowledge","know","知识","知","connaissance","savoir"],page:"dictionary.html#knowledge"},
 {keys:["sound","voice","声音","声","响","son"],page:"dictionary.html#sound"}
];
function normalized(value){return value.trim().toLocaleLowerCase();}
function findEntry(query){const value=normalized(query);if(!value)return null;return dictionary.find(entry=>entry.keys.some(key=>normalized(key)===value))||dictionary.find(entry=>entry.keys.some(key=>normalized(key).includes(value)||value.includes(normalized(key))));}
function searchWord(){const input=document.getElementById("searchInput");const message=document.getElementById("searchMessage");if(!input)return;const value=input.value;if(!normalized(value)){if(message)message.textContent="Please enter a word. · 请输入一个词。";return;}const result=findEntry(value);if(result){window.location.href=result.page;}else{if(message)message.textContent="No exact entry yet. Open the dictionary or try another form. · 暂无准确词条，请打开词典或尝试其他形式。";}}
function filterDictionary(){const input=document.getElementById("dictSearch");const message=document.getElementById("dictMessage");const cards=[...document.querySelectorAll(".word-card")];if(!input||!cards.length)return;const value=normalized(input.value);let visible=0;cards.forEach(card=>{const match=!value||normalized(card.dataset.word||card.textContent).includes(value);card.hidden=!match;if(match)visible++;});if(message)message.textContent=visible?`${visible} result(s) · ${visible} 个结果`:`No entry found. · 未找到词条。`;}
document.addEventListener("DOMContentLoaded",()=>{const searchInput=document.getElementById("searchInput");if(searchInput)searchInput.addEventListener("keydown",event=>{if(event.key==="Enter")searchWord();});const dictInput=document.getElementById("dictSearch");if(dictInput){dictInput.addEventListener("input",filterDictionary);dictInput.addEventListener("keydown",event=>{if(event.key==="Enter")filterDictionary();});}});
