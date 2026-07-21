const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");

const realms = [
  ["Ministerie van Ochtendverlangen", "de minister van net-wakker-maar-al-verdacht-emotioneel gedrag"],
  ["Rechtbank der Kusmisdrijven", "de aanklager die zijn toga met te veel zelfvertrouwen draagt"],
  ["Bureaucratie van Begeerte", "een ambtenaar die verlangen stempelt alsof het een parkeervergunning is"],
  ["Kosmisch Loket", "een receptionist van het universum met chronisch plaatsvervangende schaamte"],
  ["Quantumromantiek", "een natuurkundige die weigert toe te geven dat hij gewoon verliefd is"],
  ["Erotische Diplomatie", "twee landen die officieel vrede tekenen maar onder tafel al flirten"],
  ["Commissie Normaal Doen", "een commissie die na drie minuten zelf niet meer normaal doet"],
  ["Vrije Republiek Swahito", "een democratie waar Swahita per ongeluk alle verkiezingen wint"],
  ["Nachtelijk Parlementsdebat", "een voorzitter die orde vraagt terwijl niemand nog objectief is"],
  ["Instituut voor Onredelijke Aantrekkingskracht", "een onderzoeksraad die haar meetlint kwijt is"],
  ["Hof van Ongepaste Timing", "een rechter die precies op het verkeerde moment romantisch wordt"],
  ["Dienst Binnenlandse Vlinders", "een opsporingsdienst die overal bewijs van jou vindt"],
  ["Archief van Verboden Glimlachen", "een archivaris die elk bewijsstuk te lang bekijkt"],
  ["Universiteit der Belachelijke Liefdeslogica", "een professor die zijn proefschrift aan haar ogen verloor"],
  ["Ruimtestation Swahita-9", "een commandant die de zwaartekracht persoonlijk verdenkt"],
  ["Gemeente Onbeheerste Tederheid", "een loketmedewerker die intimiteit per volgnummer uitdeelt"],
  ["De Centrale Bank van Kuskoersen", "een econoom die inflatie meet in gemiste appjes"],
  ["Het Nationaal Museum van Bijna-Zoenen", "een suppoost die de kunst te persoonlijk neemt"],
  ["Observatorium voor Haar Effect", "een astronoom die geen sterren meer vertrouwt"],
  ["De Liefdesdouane", "een grenswachter die alle blikken declareert"],
  ["Kabinet van Onhoudbare Gedachten", "een premier die aftreedt wegens interne Swahita-chaos"],
  ["Senaat der Onbeschaafde Fantasie", "een voorzitter die het woord 'decorum' verkeerd uitspreekt"],
  ["Crisiscentrum voor Te Leuke Vrouwen", "een crisisteam dat vooral koffie en ontkenning heeft"],
  ["Het Paleis van Wederzijdse Sabotage", "een lakei die romantische staatsgrepen aankondigt"],
  ["Afdeling Noodlanding in Haar Nek", "een piloot die alle protocollen ineens heel relatief vindt"],
  ["Bibliotheek van Ongepaste Vergelijkingen", "een bibliothecaris die verlangen onder filosofie sorteert"],
  ["Raad voor Affectieve Overmacht", "een panel dat objectiviteit plechtig begraaft"],
  ["Meteorologisch Bureau van Gemis", "een weerman die regen voorspelt als ze te lang offline is"],
  ["De Onderzeedienst van Diepe Gedachten", "een kapitein die onder water nog steeds haar naam hoort"],
  ["Het Circus der Rationele Excuses", "een spreekstalmeester die ratio door brandende hoepels jaagt"],
  ["Meldkamer van Te Veel Zin", "een centralist die alle alarmen persoonlijk begrijpt"],
  ["Kantoor voor Zachte Staatsgrepen", "een jurist die vrijwillige overgave in sierletters schrijft"],
  ["De Galactische Kusraad", "een senaat waar sterrenbeelden voor haar opstaan"],
  ["Het Hotel van Uitgestelde Zelfbeheersing", "een receptionist die kamers verhuurt aan slechte plannen"],
  ["Bordeel van Abstracte Begrippen", "een filosoof die eros en epistemologie te hard door elkaar haalt"],
  ["De Spoorwegen van Verlangen", "een conducteur die vertraging romantisch uitlegt"],
  ["De Belastingdienst der Binnenpret", "een inspecteur die glimlachen als vermogen ziet"],
  ["Keuringsdienst van Warme Blikken", "een keurmeester die zogenaamd onafhankelijk ruikt aan spanning"],
  ["Het Lab voor Onmogelijke Chemie", "een laborant die weigert het monster 'liefde' te labelen"],
  ["De Tuinbouwschool voor Witlof-erotiek", "een docent die groente ineens met gevaarlijke ernst behandelt"],
  ["De Piratenzender van Swahito", "een illegale radiohost die alleen haar naam uitzendt"],
  ["Het Hooggerechtshof van Appjes", "een griffier die leestekens als bewijsstukken behandelt"],
  ["De Koninklijke Academie voor Te Lang Kijken", "een docent die oogcontact als gevechtssport doceert"],
  ["Het Bureau voor Romantische Fraude", "een rechercheur die zijn eigen hart niet meer gelooft"],
  ["De Fabriek van Onhandige Complimenten", "een ploegbaas die tederheid in ploegendienst draait"],
  ["De Filosofische Snackbar", "een snackbarmedewerker die metafysica met knoflooksaus serveert"],
  ["Het Pretpark van Vrijwillige Ondergang", "een attractiechef die haar lach als achtbaan classificeert"],
  ["De Geheime Dienst van Haar Naam", "een agent die elke alias onmiddellijk verraadt"],
  ["De Stichting Tegen Al Te Simpele Liefde", "een bestuur dat ingewikkeld zijn tot kunstvorm verheft"],
  ["Het Nationaal Instituut voor Schaamteloos Gemis", "een directeur die alle rapporten met 'baby' ondertekent"]
];

const lenses = [
  "satire op staatsrecht",
  "surrealistische fysica",
  "bureaucratische erotiek",
  "kosmische rechtspraak",
  "diplomatieke verleiding",
  "filosofische slapstick",
  "noir-onderzoek naar verlangen",
  "economische paniek om aantrekkingskracht",
  "wetenschappelijk falen door charmante data",
  "mythische romantiek met administratieve schade",
  "politieke staatsgreep met zachte gevolgen",
  "absurde etiquette rond te veel zin",
  "literaire sabotage van normaal doen",
  "juridische fictie over verboden glimlachen",
  "existentialistische karaoke van het hart",
  "spionage rond gemiste appjes",
  "ritueel bijgeloof over haar stem",
  "publieke orde rond prive-verlangen",
  "academisch klinkende onzin met echte kern",
  "poetische misdaad zonder slachtoffers"
];

const actions = [
  ["Swahito doet alsof hij rationeel is", "bekentenis onder intellectuele camouflage"],
  ["Swahita verschijnt in zijn hoofd zonder vergunning", "onvergunde aanwezigheid met verzachtende omstandigheden"],
  ["een appje verandert de luchtdruk", "meteorologische aansprakelijkheid wegens gemis"],
  ["een blik duurt drie seconden te lang", "overtreding van de openbare orde in zijn borstkas"],
  ["het woord 'baby' wordt als staatsdocument behandeld", "romantische legalisering van onzin"],
  ["zijn zelfbeheersing vraagt ontslag aan", "arbeidsconflict tussen wilskracht en verlangen"],
  ["de realiteit probeert normaal te blijven", "mislukte poging tot administratieve neutraliteit"],
  ["de commissie onderzoekt waarom hij glimlacht", "bewijsvergaring in een zaak die al verloren is"],
  ["een kus wordt hypothetisch besproken", "theoretische escalatie met praktische belangen"],
  ["het universum vraagt om toelichting", "kosmische klacht wegens teveel Swahita-effect"],
  ["zijn telefoon licht op als een religieus object", "digitale eredienst zonder vergunning"],
  ["een gedachte weigert terug te keren", "desertie ten gunste van Swahita"],
  ["een compliment raakt overgekwalificeerd", "taalkundige overbelasting door schoonheid"],
  ["een grap wordt te eerlijk", "humoristische infiltratie van waarheid"],
  ["de avond doet alsof hij onschuldig is", "nachtelijke medeplichtigheid aan verlangen"],
  ["een stilte krijgt bijbetekenis", "semantische smokkel van intimiteit"],
  ["hij wil stoer blijven", "decoratieve mannelijkheid met beperkte houdbaarheid"],
  ["zij zegt iets kleins", "miniatuuruitspraak met disproportioneel effect"],
  ["de zwaartekracht kiest partij", "natuurkundige corruptie door aantrekkingskracht"],
  ["zijn hart voert wanbeleid", "begrotingstekort door tederheid"]
];

const stakes = [
  "de inzet is een kus die formeel nog niet bestaat",
  "de inzet is een ochtend waarin normaal doen al bij voorbaat kansloos is",
  "de inzet is een appje dat zich gedraagt als staatsgreep",
  "de inzet is een blik die per ongeluk grondgebied verovert",
  "de inzet is een stilte met teveel ondertiteling",
  "de inzet is een compliment dat zijn eigen veiligheidsplan nodig heeft",
  "de inzet is een lach die de notulen onbruikbaar maakt",
  "de inzet is een gemis dat weigert netjes te wachten",
  "de inzet is een gedachte die niet terug wil naar kantoor",
  "de inzet is een avond die te onschuldig kijkt",
  "de inzet is een grenspost tussen stoer doen en smelten",
  "de inzet is een hypothetische aanraking met veel te veel jurisprudentie",
  "de inzet is een herinnering die parfum draagt",
  "de inzet is een grap die ineens bekentenis blijkt",
  "de inzet is een route naar dichterbij zonder vergunning",
  "de inzet is een droom die zich voordoet als beleidsmemo",
  "de inzet is een verlangen dat te goed gekleed is voor de gelegenheid",
  "de inzet is een wetenschappelijke meting die begint te blozen",
  "de inzet is een parlementaire crisis in zijn buik",
  "de inzet is een diplomatiek incident rond haar naam",
  "de inzet is een moreel verantwoord slecht plan",
  "de inzet is een festival van bijbedoelingen zonder entreebewijs",
  "de inzet is een rechtbank waar de hamer jaloers is op de spanning",
  "de inzet is een ministerie dat alle dossiers kwijtraakt zodra zij lacht",
  "de inzet is een telefoon die verdacht religieus oplicht",
  "de inzet is een collectieve arbeidsovereenkomst voor vlinders",
  "de inzet is een embargo op afstandelijkheid dat niemand wil handhaven",
  "de inzet is een kamer die ineens te klein wordt voor alle chemie",
  "de inzet is een excuus om dichterbij te lezen tussen de regels"
];

const turns = [
  "de elegante draai zit in vrijwillige overgave zonder gezichtsverlies",
  "de beste lezing maakt de grap groter en de liefde stiller",
  "de juiste richting weigert te kiezen tussen intelligentie en zin",
  "de kern is dat belachelijk doen soms de eerlijkste route is",
  "de oplossing moet tegelijk brutaal, teder en licht onwettig voelen",
  "de redenering wint pas als ze ook een beetje schaamteloos is",
  "de grap mag absurd zijn, maar de onderlaag moet kloppen",
  "de uitkomst moet klinken alsof ratio nog net haar jas kon pakken",
  "de mooiste conclusie laat Swahita groter worden dan het systeem",
  "de vraag is pas af als Swahito er niet helemaal onschuldig uitkomt",
  "de beste optie laat verlangen slim genoeg zijn om niet plat te worden",
  "de satire moet doen alsof ze streng is en ondertussen knipogen",
  "de conclusie moet een klein misdrijf tegen saaiheid plegen",
  "de lezing moet de bureaucratie vernederen zonder de liefde te vernederen",
  "de juiste keuze heeft instemming, humor en een gevaarlijk net pak aan",
  "de vraag moet voelen als een rechtszaak die eindigt in binnenpret",
  "de hypothese moet de chaos niet oplossen maar goed aankleden",
  "de beste route is niet bezit maar vrijwillig dichtbij willen zijn",
  "de elegantste grap laat zien dat Swahita geen categorie maar een gebeurtenis is",
  "de uitkomst moet bewijzen dat hoog niveau en lage bijbedoelingen samen kunnen",
  "de conclusie mag zondig glimlachen maar moet fatsoenlijk blijven staan",
  "de clou moet absurdistisch zijn zonder willekeurig te worden",
  "de waarheid moet via een omweg komen omdat directe routes te braaf zijn",
  "de beste interpretatie laat Swahito verliezen en daar blij mee zijn",
  "de grap moet niet uitleggen waarom liefde werkt, maar demonstreren dat ze wint",
  "de juiste richting moet klinken als flirten met een masterdiploma in onzin",
  "de spanning moet stijlvol blijven, alsof de kamer zelf discreet wegkijkt",
  "de lezing moet niet alles oplossen, alleen genoeg om haar te laten lachen",
  "de conclusie moet lijken op bewijsvoering en eindigen als bekentenis",
  "de beste optie moet het absurde serieus nemen zonder serieus te worden",
  "de antwoordrichting moet een kleine staatsgreep tegen verveling zijn"
];

const corrects = [
  "De enige volwassen conclusie is dat vrijwillige overgave soms verdacht veel op vrijheid lijkt.",
  "Hij moet geen controle eisen, maar elegant erkennen dat zij de vergadering al gewonnen heeft.",
  "De situatie is alleen oplosbaar door te lachen en daarna gevaarlijk lief te kijken.",
  "Dit is geen crisis maar een beleidswijziging richting dichterbij.",
  "De juiste hypothese is dat normaal doen onder deze omstandigheden juridisch niet haalbaar is.",
  "De liefde wint hier niet door bewijs, maar door de manier waarop alle bewijsstukken blozen.",
  "Alle instanties falen omdat Swahita niet in een formulier past.",
  "Swahito moet bezwaar maken en hopen dat het bezwaar ongegrond wordt verklaard.",
  "Het verstandigste is: niet versimpelen wat juist leuk is omdat het ingewikkeld blijft.",
  "De ethisch verantwoorde route is wederzijdse instemming, slechte grappen en goede intenties."
];

const decoys = [
  "Een tijdelijke werkgroep starten en het verlangen parkeren tot kwartaal drie.",
  "De realiteit verzoeken voortaan alleen nog zakelijke gevoelens te leveren.",
  "Alle glimlachen archiveren onder 'mogelijk maar niet bewezen'.",
  "Een commissie benoemen die vooral haar eigen verwarring onderzoekt.",
  "Doen alsof dit een logistiek probleem is met emotionele bijvangst.",
  "De zaak opschorten tot koffie, alsof koffie ooit objectief is geweest.",
  "Het hart onder curatele stellen wegens bestuurlijke nalatigheid.",
  "De romantiek terugsturen wegens ontbrekend formulier.",
  "Een veiligheidshelm verplichten bij oogcontact langer dan twee seconden.",
  "Alle metaforen verbieden tot de kamer is afgekoeld.",
  "Het onderwerp behandelen als een excelbestand met te veel tabbladen.",
  "Een persconferentie geven zonder iets wezenlijks te zeggen.",
  "Een bordje plaatsen: pas op, emotioneel glad wegdek.",
  "Een audit uitvoeren op het woord 'baby'.",
  "Een protocol schrijven dat niemand tijdens het zoenen kan naleven.",
  "De spanning nationaliseren en daarna privatiseren.",
  "Het bewijs vernietigen door precies nog een keer te kijken.",
  "Een keurmerk aanvragen voor overdreven beheerst gedrag.",
  "De zaak verwijzen naar de afdeling 'niet mijn probleem maar wel mijn type'.",
  "Een academisch artikel schrijven en per ongeluk haar naam in de titel zetten."
];

const openPrompts = [
  "Formuleer de meest absurde maar toch verdedigbare wet die Swahito en Swahita samen overtreden.",
  "Geef de titel van het proefschrift dat Swahito nooit afmaakt omdat Swahita binnenkomt.",
  "Bedenk de naam van het loket waar je terechtkunt voor acute nabijheidsdrang.",
  "Schrijf de waarschuwing die op Swahita zou moeten staan als ze officieel te charmant werd verklaard.",
  "Welke slogan gebruikt de liefdesstaat als de verkiezingen volledig ontsporen?",
  "Welke bijsluiter hoort bij Swahito als hij te lang naar Swahita kijkt?",
  "Wat is de openingszin van een rechtszaak tegen een kus die nog niet gebeurd is?",
  "Welke economische term verklaart dat zijn concentratie keldert zodra zij leuk doet?",
  "Welke verkeersregel geldt op de snelweg tussen haar glimlach en zijn slechte plannen?",
  "Welke ceremoniele functie krijgt witlof in de monarchie van hun liefde?"
];

function pick(list, index, stride = 1) {
  return list[(index * stride) % list.length];
}

function shuffleOptions(options, correctIndex, seed) {
  const items = options.map((text, index) => ({ text, correct: index === correctIndex }));
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = (seed + i * 17) % (i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return {
    options: items.map((item) => item.text),
    answer: items.findIndex((item) => item.correct)
  };
}

function makeMultipleChoice(index, realm, action, lens, stake, turn) {
  const correct = pick(corrects, index, 7);
  const optionSet = [
    correct,
    pick(decoys, index, 3),
    pick(decoys, index + 9, 5),
    pick(decoys, index + 17, 7)
  ];
  const shuffled = shuffleOptions(optionSet, 0, index);

  return {
    id: `q-${String(index + 1).padStart(4, "0")}`,
    family: realm[0],
    title: `${realm[0]} ${Math.floor(index / realms.length) + 1}`,
    scenario: `In ${realm[0]} onderzoekt ${realm[1]} hoe ${action[0]}; ${stake}. Vanuit ${lens}: wat is de meest elegante conclusie als ${turn}?`,
    options: shuffled.options,
    answer: shuffled.answer,
    note: action[1]
  };
}

function makeOpen(index, realm, action, lens, stake, turn) {
  const prompt = pick(openPrompts, index, 11);
  return {
    id: `q-${String(index + 1).padStart(4, "0")}`,
    family: realm[0],
    type: "open",
    title: `${realm[0]} ${Math.floor(index / realms.length) + 1}`,
    scenario: `Open vraag uit ${realm[0]}: ${prompt} Gebruik ${lens}, verwerk dat ${action[0]}, en onthoud: ${stake}; ${turn}.`,
    sample: `${action[1]}; bij voorkeur in een zin die tegelijk belachelijk en waar is.`,
    note: `De richting is absurdistisch, maar de onderlaag is: ${action[1]}.`
  };
}

function makeQuestion(index) {
  const realm = pick(realms, index);
  const action = pick(actions, index, 13);
  const lens = pick(lenses, index, 19);
  const stake = pick(stakes, index, 17);
  const turn = pick(turns, index, 23);
  return index % 7 === 0
    ? makeOpen(index, realm, action, lens, stake, turn)
    : makeMultipleChoice(index, realm, action, lens, stake, turn);
}

const questions = Array.from({ length: 1000 }, (_, index) => makeQuestion(index));
const seenScenarios = new Set();
const duplicates = questions.filter((question) => {
  if (seenScenarios.has(question.scenario)) return true;
  seenScenarios.add(question.scenario);
  return false;
});

if (duplicates.length > 0) {
  throw new Error(`Duplicate scenarios found: ${duplicates.length}`);
}

const output = `window.questionBank = ${JSON.stringify(questions, null, 2)};\n`;
fs.writeFileSync(path.join(root, "questions.js"), output, "utf8");
console.log(`Generated ${questions.length} questions.`);
