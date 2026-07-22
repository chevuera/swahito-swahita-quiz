const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const totalQuestions = 500;

const families = [
  "Samen op de boerderij",
  "Huis en thuis",
  "Werkverdeling",
  "Dieren verzorgen",
  "Tuin en moestuin",
  "Geld en plannen",
  "Rust en ritme",
  "Liefde en nabijheid",
  "Grenzen en veiligheid",
  "Ruzie en herstel",
  "Toekomst en dromen",
  "Kinderen en gezin",
  "Vrienden en familie",
  "Seizoenen en tradities",
  "Dagelijkse gewoontes",
  "Taken in moeilijke weken",
  "Vertrouwen en openheid",
  "Plezier en speelsheid",
  "Keuzes en offers",
  "Oud worden samen"
];

const openings = [
  "Stel dat jullie morgen samen op een boerderij wonen",
  "Denk aan een rustige avond op jullie erf",
  "Als jullie een moeilijke week op de boerderij hebben",
  "Wanneer jullie echt een toekomst samen plannen",
  "Als Swahita zich veilig en thuis moet voelen bij jou",
  "Stel dat het leven samen kleiner, stiller en echter wordt",
  "Als jullie de boerderij stap voor stap opbouwen",
  "Wanneer liefde niet alleen gevoel maar ook dagelijks werk wordt",
  "Als jullie samen besluiten dit echt serieus te nemen",
  "Denk aan een gewone maand in jullie toekomstige boerderijleven"
];

const topics = [
  "de verdeling van vroege en late taken",
  "hoe jullie omgaan met rust na een lange dag",
  "wat thuisgevoel voor haar echt betekent",
  "hoe geldstress besproken moet worden",
  "hoe jullie ruzie willen uitpraten zonder afstand te maken",
  "welke dromen niet verloren mogen gaan in het praktische leven",
  "wat zij nodig heeft om zich vrij en geliefd te voelen",
  "hoe jullie dierenwelzijn belangrijker houden dan gemak",
  "hoe jullie gasten ontvangen zonder je eigen rust kwijt te raken",
  "wat een eerlijke werkverdeling voor haar is",
  "hoe jullie omgaan met onverwachte tegenslag",
  "welke dagelijkse rituelen jullie relatie sterk houden",
  "wat zij mooi zou vinden aan samen oud worden op die plek",
  "hoe jullie de balans houden tussen werk, liefde en stilte",
  "hoe je voorkomt dat zorgen belangrijker worden dan zachtheid",
  "wat jullie absoluut hetzelfde willen houden als nu",
  "welke offers het wel en niet waard zijn",
  "hoe jullie omgaan met verschil in tempo of energie",
  "wat veiligheid betekent als het leven druk en rommelig wordt",
  "hoe jullie een plek maken waar zij echt zichzelf kan zijn"
];

const angles = [
  "Kies het antwoord dat het meest laat zien dat je niet alleen aan de droom denkt, maar ook aan haar.",
  "Kies het antwoord dat het meest volwassen en liefdevol klinkt.",
  "Kies het antwoord dat het beste past bij een serieuze toekomst samen.",
  "Kies het antwoord dat het meeste rekening houdt met haar gevoel en jullie lange termijn.",
  "Kies het antwoord dat het meest warm, eerlijk en praktisch is.",
  "Kies het antwoord dat het meest laat zien dat liefde ook verantwoordelijkheid is.",
  "Kies het antwoord dat het best laat zien dat jullie een team willen zijn.",
  "Kies het antwoord dat het meeste veiligheid en vertrouwen uitstraalt.",
  "Kies het antwoord dat het meeste ruimte laat voor haar stem.",
  "Kies het antwoord dat het meest past bij een rustig en gezond leven samen."
];

const openPrompts = [
  "Wat zou jij het mooiste vinden aan samen wonen op een boerderij met mij?",
  "Welke dagelijkse gewoonte zou jij met mij willen opbouwen als we daar samen leven?",
  "Waar zou jij het meest bang voor zijn als we zo'n toekomst echt aangaan?",
  "Wat heb jij van mij nodig om je veilig en thuis te voelen op onze plek?",
  "Hoe zie jij een gewone gelukkige dag voor ons op de boerderij?",
  "Welke taak zou jij graag zelf doen en welke taak zou je liever aan mij overlaten?",
  "Wat moeten we nu al leren als we later echt samen zo willen leven?",
  "Hoe wil jij dat we omgaan met stress, geld of vermoeidheid als we samen wonen?",
  "Wat wil jij absoluut behouden van jezelf als we een leven samen opbouwen?",
  "Welke droom over onze toekomst wil jij dat ik serieuzer neem?"
];

const notes = [
  "Dit gaat over luisteren naar haar echte behoefte, niet over een mooi fantasiebeeld.",
  "De kern is samenwerking zonder controle.",
  "De onderlaag is: liefde wordt geloofwaardiger als het ook praktisch klopt.",
  "Dit gaat over veiligheid, eerlijkheid en teamgevoel.",
  "De beste richting houdt rekening met haar rust, autonomie en vertrouwen.",
  "De onderlaag is dat een toekomst samen alleen werkt als jullie allebei ruimte houden.",
  "Hier telt zachtheid meer dan bravoure.",
  "De beste keuze laat zien dat je haar serieus neemt in het dagelijks leven.",
  "Dit gaat minder over romantische woorden en meer over gedragen liefde.",
  "De kern is dat een boerderijdroom pas mooi is als zij zich daarin echt gezien voelt."
];

const corrects = [
  "Eerst samen bespreken wat voor leven zij echt wil, en daar de plannen op bouwen.",
  "Zorgen dat taken eerlijk voelen en dat niemand stilletjes overbelast raakt.",
  "Ruimte maken voor rust, openheid en kleine momenten van aandacht, ook op drukke dagen.",
  "Niet aannemen dat liefde genoeg is, maar samen duidelijke afspraken maken die zacht blijven.",
  "Haar serieus vragen wat thuis voor haar betekent en dat belangrijker maken dan mijn fantasie.",
  "Praktisch plannen combineren met emotionele afstemming, zodat we een team blijven.",
  "Kiezen voor een leven dat haalbaar en warm is, in plaats van groots en uitputtend.",
  "Bij spanning eerst eerlijk praten, luisteren en pas daarna beslissen.",
  "Een toekomst bouwen waarin zij zich vrij, veilig en geliefd voelt.",
  "Steeds opnieuw afstemmen of dit leven nog steeds goed voelt voor ons allebei."
];

const decoys = [
  "Gewoon hard werken en ervan uitgaan dat de rest vanzelf wel volgt.",
  "De praktische details later uitzoeken, zolang het romantische gevoel maar sterk blijft.",
  "Besluiten nemen op basis van wat het snelst of goedkoopst is.",
  "Ervan uitgaan dat zij zich vanzelf wel aanpast aan het leven daar.",
  "Problemen pas bespreken zodra ze echt groot zijn geworden.",
  "Taken verdelen op gevoel en hopen dat het eerlijk uitpakt.",
  "Vooral focussen op hoe mooi het plaatje is en minder op het ritme erachter.",
  "Denken dat vermoeidheid vanzelf minder wordt zodra jullie eenmaal samen zijn.",
  "Lastige gesprekken vermijden om de sfeer goed te houden.",
  "Gewoon doen wat praktisch lijkt, ook als het emotioneel wringt.",
  "De zwaarste taken nemen zonder te zeggen dat het te veel wordt.",
  "Aannemen dat liefde automatisch duidelijk maakt wat de ander nodig heeft.",
  "Vooral kijken naar wat anderen een goed leven samen zouden vinden.",
  "Doorzetten zonder regelmatig te checken of zij nog gelukkig is in dat plan.",
  "De toekomst vastleggen voordat jullie goed hebben uitgepraat wat zij eigenlijk wil."
];

function pick(list, index, stride = 1) {
  return list[(index * stride) % list.length];
}

function uniqueOptions(correct, wrongs, seed) {
  const set = new Set([correct]);
  for (const wrong of wrongs) {
    if (wrong !== correct) {
      set.add(wrong);
    }
    if (set.size === 4) {
      break;
    }
  }

  let offset = 0;
  while (set.size < 4) {
    set.add(decoys[(seed + offset) % decoys.length]);
    offset += 1;
  }

  const items = [...set].map((text) => ({ text, correct: text === correct }));
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = (seed * 11 + i * 7) % (i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }

  return {
    options: items.map((item) => item.text),
    answer: items.findIndex((item) => item.correct)
  };
}

function makeScenario(index) {
  const opening = pick(openings, index, 3);
  const topic = pick(topics, index, 5);
  const angle = pick(angles, index, 7);
  return `Vraag ${index + 1}: ${opening}, en jullie praten over ${topic}. ${angle}`;
}

function makeMultipleChoice(index) {
  const family = pick(families, index);
  const correct = pick(corrects, index, 3);
  const wrongs = [
    pick(decoys, index, 2),
    pick(decoys, index + 4, 5),
    pick(decoys, index + 9, 7),
    pick(decoys, index + 13, 11)
  ];
  const shuffled = uniqueOptions(correct, wrongs, index);

  return {
    id: `q-${String(index + 1).padStart(4, "0")}`,
    family,
    title: `${family} ${Math.floor(index / families.length) + 1}`,
    scenario: makeScenario(index),
    options: shuffled.options,
    answer: shuffled.answer,
    note: pick(notes, index, 9)
  };
}

function makeOpen(index) {
  const family = pick(families, index);
  const prompt = pick(openPrompts, index, 4);
  const topic = pick(topics, index, 8);
  const note = pick(notes, index, 6);
  return {
    id: `q-${String(index + 1).padStart(4, "0")}`,
    family,
    type: "open",
    title: `${family} ${Math.floor(index / families.length) + 1}`,
    scenario: `Open vraag ${index + 1}: ${prompt} Denk daarbij vooral aan ${topic}. Antwoord alsof je echt nadenkt over ons, jouw gevoel en een toekomst op een boerderij.`,
    sample: "Een eerlijk antwoord dat iets zegt over verlangen, zorg, grenzen of dagelijks leven samen.",
    note
  };
}

function makeQuestion(index) {
  return index % 5 === 0 ? makeOpen(index) : makeMultipleChoice(index);
}

const questions = Array.from({ length: totalQuestions }, (_, index) => makeQuestion(index));
const seenScenarios = new Set();

for (const question of questions) {
  if (seenScenarios.has(question.scenario)) {
    throw new Error(`Duplicate scenario found: ${question.scenario}`);
  }
  seenScenarios.add(question.scenario);
}

const output = `window.questionBank = ${JSON.stringify(questions, null, 2)};\n`;
fs.writeFileSync(path.join(root, "questions.js"), output, "utf8");
console.log(`Generated ${questions.length} questions.`);
