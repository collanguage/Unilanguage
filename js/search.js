const dictionary = [
  {
    keys: ["universe", "cosmos", "宇宙", "世界", "univers", "monde"],
    page: "dictionary.html#universe"
  },
  {
    keys: ["human", "person", "人", "人类", "humain", "homme"],
    page: "dictionary.html#human"
  },
  {
    keys: ["language", "speech", "语言", "言语", "langue", "langage"],
    page: "dictionary.html#language"
  },
  {
    keys: ["knowledge", "know", "知识", "知", "connaissance", "savoir"],
    page: "dictionary.html#knowledge"
  },
  {
    keys: ["time", "时间", "时", "temps", "chrono"],
    page: "dictionary.html#time"
  },
  {
    keys: ["life", "生活", "生命", "vie", "living"],
    page: "dictionary.html#life"
  },
  {
    keys: ["nature", "自然", "nature"],
    page: "dictionary.html#nature"
  },
  {
    keys: ["emotion", "feeling", "情感", "感情", "émotion", "sentiment"],
    page: "dictionary.html#emotion"
  }
];

function searchWord(){
  const input = document.getElementById("searchInput");

  if(!input){
    return;
  }

  const value = input.value.trim().toLowerCase();

  if(value === ""){
    alert("Please enter a word.");
    return;
  }

  for(let item of dictionary){
    for(let key of item.keys){
      if(value === key.toLowerCase()){
        window.location.href = item.page;
        return;
      }
    }
  }

  for(let item of dictionary){
    for(let key of item.keys){
      if(key.toLowerCase().includes(value) || value.includes(key.toLowerCase())){
        window.location.href = item.page;
        return;
      }
    }
  }

  alert("Word not found yet. Opening dictionary.");
  window.location.href = "dictionary.html";
}

function filterDictionary(){
  const input = document.getElementById("dictSearch");

  if(!input){
    return;
  }

  const value = input.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".word-card");

  cards.forEach(card => {
    const words = card.getAttribute("data-word");

    if(!words){
      return;
    }

    if(value === ""){
      card.style.display = "block";
    }else if(words.toLowerCase().includes(value)){
      card.style.display = "block";
    }else{
      card.style.display = "none";
    }
  });
}

document.addEventListener("keydown", function(event){
  if(event.key === "Enter"){
    const searchInput = document.getElementById("searchInput");
    const dictSearch = document.getElementById("dictSearch");

    if(document.activeElement === searchInput){
      searchWord();
    }

    if(document.activeElement === dictSearch){
      filterDictionary();
    }
  }
});