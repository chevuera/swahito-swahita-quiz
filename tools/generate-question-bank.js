const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const questionsPerFamily = 25;

const stakes = [
  "omdat juist zulke momenten later het verschil maken tussen dromen en echt samenleven",
  "omdat dit precies het soort detail is waar vertrouwen groter of kleiner van wordt",
  "omdat hier vaak zichtbaar wordt of iemand zich veilig of juist alleen voelt",
  "omdat een toekomst niet stukgaat op een groot plan maar soms op honderd kleine reacties",
  "omdat dit laat zien of jouw liefde ook standhoudt buiten de mooie fantasie",
  "omdat hier vaak blijkt of jij haar echt ziet of vooral je eigen idee van later volgt",
  "omdat een boerderijleven alleen werkt als jullie hierin zacht en eerlijk blijven",
  "omdat juist dit soort gesprekken bepaalt of Swahita zich gedragen voelt",
  "omdat hier snel scheefgroei ontstaat als je niet bewust kiest",
  "omdat zulke kleine momenten later grote betekenis krijgen in hoe veilig een relatie voelt"
];

const emotionalSignals = [
  "Swahita zegt het rustig, maar je merkt dat het haar echt raakt",
  "je voelt dat ze geen perfect antwoord wil horen maar een oprecht antwoord",
  "haar toon blijft zacht, alleen je merkt dat dit voor haar niet oppervlakkig is",
  "ze vraagt het zonder drama, juist daardoor hoor je hoe serieus het is",
  "je ziet aan haar dat ze wil weten of jij hier echt betrouwbaar in bent",
  "er hangt geen ruzie in de lucht, wel de vraag of jullie elkaar hier echt verstaan",
  "dit is zo'n moment waarop zij vooral kijkt of jouw gedrag net zo warm is als je woorden",
  "je merkt dat ze probeert te peilen of jouw droom ook ruimte heeft voor haar werkelijkheid",
  "tussen de zinnen door voel je dat ze wil weten of ze bij jou kan landen",
  "de vraag klinkt klein, maar je voelt dat haar vertrouwen hier iets van afhangt"
];

const openClosers = [
  "Maak het persoonlijk, niet netjes.",
  "Laat merken wat jij haar daarin echt zou willen geven.",
  "Zorg dat het klinkt alsof je haar kent, niet alsof je een goed antwoord zoekt.",
  "Schrijf alsof zij dit straks echt van je leest en voelt of je het meent.",
  "Wees concreet genoeg dat zij zichzelf erin kan herkennen.",
  "Vertel het zo dat het over jullie twee gaat en niet over een algemeen stel.",
  "Antwoord alsof je niet wilt imponeren maar echt wilt aansluiten bij haar gevoel.",
  "Laat in je antwoord merken dat jij niet alleen een droom wilt, maar ook haar erbij wilt houden.",
  "Maak duidelijk wat jij daarin van jezelf zou vragen.",
  "Schrijf het alsof je haar iets geruststellends en waars geeft tegelijk."
];

const mcTemplates = [
  ({ index, context, concern, lens, stake, signal }) => `Vraag ${index}: Tijdens ${context} komt ineens dit op tafel: ${concern}. ${signal}. ${stake}. Welke reactie past dan het best bij ${lens}?`,
  ({ index, context, concern, lens, stake, signal }) => `Vraag ${index}: Jullie zijn bezig met ${context}. Swahita stelt een eerlijke vraag over ${concern}. ${signal}. ${stake}. Wat is dan de sterkste reactie als je denkt vanuit ${lens}?`,
  ({ index, context, concern, lens, stake, signal }) => `Vraag ${index}: Midden in ${context} voelen jullie dat het gesprek serieuzer wordt. Het gaat nu over ${concern}. ${signal}. Welke keuze past dan het best bij ${lens}?`,
  ({ index, context, concern, lens, stake, signal }) => `Vraag ${index}: Er is niets dramatisch aan de hand, maar bij ${context} blijkt wel waar jullie echt voor staan. Het onderwerp wordt ${concern}. ${stake}. Welk antwoord is dan het gezondst?`,
  ({ index, context, concern, lens, stake, signal }) => `Vraag ${index}: Stel je voor dat ${context} jullie dag bepaalt. Jullie moeten samen iets uitspreken over ${concern}. ${signal}. Waar zit dan de meest liefdevolle richting?`,
  ({ index, context, concern, lens, stake, signal }) => `Vraag ${index}: In een gesprek na ${context} blijkt dat jullie niet alleen over praktische dingen praten, maar ook over ${concern}. ${stake}. Welke reactie bewijst het best dat jij kiest voor ${lens}?`,
  ({ index, context, concern, lens, stake, signal }) => `Vraag ${index}: ${context} klinkt klein, maar het zegt veel over hoe jullie later willen leven. Het schuift door naar ${concern}. ${signal}. Wat is dan het beste antwoord?`,
  ({ index, context, concern, lens, stake }) => `Vraag ${index}: Jullie toekomst voelt dichtbij rond ${context}. Als het daarna gaat over ${concern}, ${stake}, welke reactie past het meest bij ${lens}?`,
  ({ index, context, concern, lens, signal }) => `Vraag ${index}: Bij ${context} merk je of romantiek ook overeind blijft in gewone dagen. Nu gaat het gesprek over ${concern}. ${signal}. Welke keuze is het meest volwassen?`,
  ({ index, context, concern, lens, stake }) => `Vraag ${index}: Terwijl ${context} speelt, wil Swahita weten hoe jij kijkt naar ${concern}. ${stake}. Wat antwoord je als je iets duurzaams wilt bouwen?`,
  ({ index, context, concern, lens, signal }) => `Vraag ${index}: Jullie praten niet groots of dramatisch, maar gewoon eerlijk bij ${context}. Dan komt ${concern} voorbij. ${signal}. Welke optie past het best bij ${lens}?`,
  ({ index, context, concern, lens, stake }) => `Vraag ${index}: Juist in ${context} wordt zichtbaar of jullie dezelfde kant op denken. Het onderwerp wordt ${concern}. ${stake}. Waar zit dan de meest veilige reactie?`,
  ({ index, context, concern, signal }) => `Vraag ${index}: Op een dag vol ${context} vraagt Swahita door over ${concern}. ${signal}. Welke reactie klinkt niet mooi op papier alleen, maar is in het echt ook goed?`,
  ({ index, context, concern, stake }) => `Vraag ${index}: ${context} zet jullie even stil. Jullie moeten uitspreken wat je bedoelt met ${concern}. ${stake}. Wat is dan de sterkste keuze?`,
  ({ index, context, concern, signal }) => `Vraag ${index}: Niet tijdens een droommoment maar juist bij ${context} praat je door over ${concern}. ${signal}. Welke reactie laat zien dat liefde ook praktisch betrouwbaar is?`,
  ({ index, context, concern, stake }) => `Vraag ${index}: Swahita kijkt naar hoe jij reageert bij ${context}. Daarna wil ze weten hoe je staat in ${concern}. ${stake}. Welke optie is het meest geruststellend?`,
  ({ index, context, concern, signal }) => `Vraag ${index}: Jullie denken na over later en precies bij ${context} blijkt hoe concreet dat later is. Het gesprek draait om ${concern}. ${signal}. Wat past het best bij een gezond samenleven?`,
  ({ index, context, concern, stake }) => `Vraag ${index}: Als ${context} eenmaal normaal wordt, wil je nog steeds goed met elkaar omgaan rond ${concern}. ${stake}. Welke reactie houdt het meest rekening met haar?`,
  ({ index, context, concern, signal }) => `Vraag ${index}: ${context} dwingt jullie niet tot ruzie, maar wel tot eerlijkheid. Het onderwerp wordt ${concern}. ${signal}. Welk antwoord klinkt dan het meest sterk en tegelijk zacht?`,
  ({ index, context, concern, stake }) => `Vraag ${index}: Bij ${context} blijkt of jullie later echt kunnen samenwerken. Swahita brengt ${concern} in. ${stake}. Welke richting is het meest liefdevol en helder?`
];

const openTemplates = [
  ({ index, context, prompt, angle, signal, closer }) => `Open vraag ${index}: Denk aan ${context}. ${signal}. ${prompt} Schrijf je antwoord zo dat ${angle}. ${closer}`,
  ({ index, context, prompt, angle, closer }) => `Open vraag ${index}: Stel dat ${context} jullie gewone realiteit is. ${prompt} Antwoord op een manier die laat voelen dat ${angle}. ${closer}`,
  ({ index, context, prompt, angle, signal, closer }) => `Open vraag ${index}: Jullie zitten midden in ${context}. ${signal}. ${prompt} Geef een antwoord waarin ${angle}. ${closer}`,
  ({ index, context, prompt, angle, closer }) => `Open vraag ${index}: Niet als fantasie maar als echt leven: ${context}. ${prompt} Formuleer het alsof ${angle}. ${closer}`,
  ({ index, context, prompt, angle, signal, closer }) => `Open vraag ${index}: Tijdens ${context} heb je geen mooi praatje nodig maar een eerlijk antwoord. ${signal}. ${prompt} Zorg dat ${angle}. ${closer}`,
  ({ index, context, prompt, angle, closer }) => `Open vraag ${index}: Neem ${context} als uitgangspunt. ${prompt} Schrijf vanuit het idee dat ${angle}. ${closer}`,
  ({ index, context, prompt, angle, signal, closer }) => `Open vraag ${index}: Als ${context} nu voor jullie zou spelen, wat zou je dan zeggen? ${signal}. ${prompt} Laat in je antwoord merken dat ${angle}. ${closer}`,
  ({ index, context, prompt, angle, closer }) => `Open vraag ${index}: Maak het concreet: ${context}. ${prompt} Reageer alsof ${angle}. ${closer}`,
  ({ index, context, prompt, angle, signal, closer }) => `Open vraag ${index}: Bij ${context} wordt duidelijk of woorden ook echt iets betekenen. ${signal}. ${prompt} Antwoord zodanig dat ${angle}. ${closer}`,
  ({ index, context, prompt, angle, closer }) => `Open vraag ${index}: Je hoeft niets perfects te zeggen, wel iets echts over ${context}. ${prompt} Zorg dat ${angle}. ${closer}`
];

const openAngles = [
  "je echt over jullie samen praat en niet alleen over het mooie plaatje",
  "haar gevoel, veiligheid en vrijheid merkbaar meetellen in wat je zegt",
  "het klinkt alsof je haar serieus neemt in het echte dagelijkse leven",
  "je antwoord warm is maar ook concreet en geloofwaardig blijft",
  "je laat merken dat liefde voor jou ook uit afstemming en zorg bestaat"
];

const globalDecoys = [
  "Gewoon hopen dat het zichzelf oplost zodra jullie eenmaal samen wonen.",
  "Vooral kiezen wat het snelst klaar is, ook als het gevoelsmatig wringt.",
  "Aannemen dat liefde vanzelf duidelijk maakt wie wat nodig heeft.",
  "Pas praten als iemand echt over zijn grens heen is gegaan.",
  "Niet te moeilijk doen en kijken of zij zich later wel aanpast.",
  "De sfeer goed houden door het lastige deel nog even uit te stellen.",
  "Doorpakken zonder steeds weer te checken hoe het voor haar voelt.",
  "Er vooral een mooi plaatje van maken en de onderlaag later uitzoeken."
];

const familyConfigs = [
  {
    family: "Samen op de boerderij",
    lens: "een gezamenlijk leven waarin zij zich echt gekozen voelt",
    contexts: [
      "een vroege zondagochtend waarop de stallen nog gedaan moeten worden",
      "de eerste week dat jullie echt op het erf slapen",
      "een avond waarop het buiten stil is maar binnen alles nog nieuw voelt",
      "een dag waarop werk, dieren en huishouden tegelijk aandacht vragen",
      "het moment dat jullie merken dat de droom nu geen idee meer is maar een levensvorm"
    ],
    concerns: [
      "hoe je voorkomt dat de boerderijdroom belangrijker wordt dan jullie relatie",
      "wat jullie doen als een van jullie harder gaat dan de ander",
      "hoe romantiek overeind blijft tussen modder, planning en vermoeidheid",
      "welke afspraken nodig zijn om niet langs elkaar heen te gaan leven",
      "hoe je de droom klein genoeg houdt om er ook echt gelukkig in te worden"
    ],
    ideals: [
      "De droom steeds terugbrengen naar de vraag of zij zich in dit leven nog vrij en blij voelt.",
      "Niet stoer doen over tempo, maar open bespreken wat haalbaar is voor jullie allebei.",
      "Zelfs op drukke dagen bewust tijd maken voor nabijheid, humor en afstemming.",
      "Plannen zo concreet maken dat niemand hoeft te raden wat van hem of haar verwacht wordt.",
      "Lievere een kleiner leven samen dat klopt dan een groots plan dat jullie leegtrekt."
    ],
    pitfalls: [
      "Vol overtuiging zeggen dat liefde alle praktische chaos later wel opvangt.",
      "Het tempo bepalen op basis van jouw enthousiasme in plaats van jullie draagkracht.",
      "Denken dat samenwonen vanzelf genoeg romantiek oplevert.",
      "Afspraken vaag houden om het luchtig te laten voelen.",
      "Meer trots halen uit het boerderijbeeld dan uit hoe jullie echt samen zijn.",
      "Doorgaan, ook als zij subtiel laat merken dat het te veel wordt."
    ],
    openPrompts: [
      "Wat zou jij willen dat altijd hetzelfde blijft tussen ons, ook als het leven veel praktischer wordt?",
      "Welke gewoonte zouden wij volgens jou moeten hebben om op zo'n plek niet van elkaar weg te groeien?",
      "Waar zou jij bang voor zijn als wij te veel op de droom focussen en te weinig op elkaar?",
      "Wanneer zou jij op een boerderij echt voelen: dit is ook mijn leven, niet alleen dat van hem?",
      "Wat zou jij van mij nodig hebben om zo'n leven niet zwaar maar veilig te laten voelen?"
    ],
    notes: [
      "Hier gaat het niet om het decor maar om hoe jullie elkaar onderweg vasthouden.",
      "De goede richting kiest haar welzijn boven jouw enthousiasme.",
      "Een toekomst samen moet ook op een drukke dag nog zacht aanvoelen.",
      "Wat telt is of jullie de droom samen dragen in plaats van erin verdwijnen.",
      "Een boerderij is pas romantisch als zij zich daarin niet kwijt hoeft te raken."
    ]
  },
  {
    family: "Huis en thuis",
    lens: "een thuis waarin zij zich veilig, rustig en welkom voelt",
    contexts: [
      "een gesprek over hoe jullie huis ruikt, klinkt en aanvoelt na een lange werkdag",
      "het inrichten van een woonkamer die niet alleen praktisch maar ook warm moet zijn",
      "de eerste keer dat een dag thuis rommelig en chaotisch eindigt",
      "een avond waarop jullie bespreken wie waar tot rust komt",
      "het zoeken naar een ritme waarin thuis niet alleen een werkplek is"
    ],
    concerns: [
      "wat thuisgevoel voor haar concreet betekent",
      "hoe je een huis maakt dat niet alleen van jou voelt",
      "welke ruimte zij nodig heeft om op te laden",
      "hoe je met rommel, drukte en prikkels omgaat zonder spanning op te bouwen",
      "wat ervoor zorgt dat binnenkomen aanvoelt als landen in plaats van overleven"
    ],
    ideals: [
      "Haar serieus vragen wat haar lichaam en hoofd nodig hebben om echt thuis te kunnen zakken.",
      "Het huis inrichten vanuit jullie allebei, niet vanuit jouw smaak als standaard.",
      "Ruimte beschermen waarin zij niet hoeft te presteren maar gewoon mag bijkomen.",
      "Rommel en onrust op tijd bespreken zodat het geen stille irritatie wordt.",
      "Van thuis een plek maken waar zachtheid, voorspelbaarheid en aandacht voelbaar zijn."
    ],
    pitfalls: [
      "Zeggen dat thuisgevoel vanzelf komt als jullie elkaar maar lief vinden.",
      "Aannemen dat zij wel went aan hoe jij het altijd hebt gedaan.",
      "Rust verwarren met stilte zonder te vragen wat zij nodig heeft.",
      "Onhandigheden laten opstapelen tot het ineens over iets heel anders lijkt te gaan.",
      "Praktisch inrichten zonder rekening te houden met sfeer of veiligheid.",
      "Denken dat binnenkomen automatisch ontspannend is voor iedereen."
    ],
    openPrompts: [
      "Hoe ziet een huis eruit waarin jij meteen minder spanning in je lijf voelt?",
      "Wat zou ik moeten begrijpen over jouw idee van thuis voordat we ooit gaan samenwonen?",
      "Welke kleine dingen zouden volgens jou maken dat ons huis warm voelt in plaats van alleen handig?",
      "Wanneer zou jij merken dat een huis echt ook van jou is?",
      "Wat moet ik absoluut niet onderschatten aan jouw behoefte aan rust of eigen ruimte?"
    ],
    notes: [
      "Thuis gaat niet alleen over muren maar over regulatie, rust en herkenning.",
      "Het goede antwoord behandelt haar gevoel van veiligheid als iets concreets.",
      "Een gedeeld huis werkt alleen als het niet stilletjes om jou draait.",
      "Warmte in huis begint vaak bij aandacht voor kleine prikkels.",
      "Je bouwt geen thuis met spullen alleen, maar met afgestemde gewoontes."
    ]
  },
  {
    family: "Werkverdeling",
    lens: "eerlijkheid zonder scorebord en zonder stille overbelasting",
    contexts: [
      "een week waarin er buiten veel moet gebeuren en binnen ook alles blijft liggen",
      "een planningsoverleg over wie de vroege taken en wie de late taken doet",
      "een periode waarin een van jullie merkbaar minder energie heeft",
      "een dag waarop iets onverwachts de hele taakverdeling omgooit",
      "een gesprek over wat eerlijk voelt en wat alleen op papier eerlijk lijkt"
    ],
    concerns: [
      "hoe je voorkomt dat een taakverdeling scheef groeit zonder dat iemand het hardop zegt",
      "wat je doet als inzet en energie niet elke week gelijk zijn",
      "hoe je eerlijk blijft zonder dat alles een rekensom wordt",
      "welke taken je bewust wilt benoemen omdat ze anders onzichtbaar blijven",
      "hoe je elkaar helpt zonder elkaar ongemerkt te gaan dragen"
    ],
    ideals: [
      "Regelmatig opnieuw afstemmen of de verdeling nog eerlijk voelt in plaats van alleen logisch lijkt.",
      "Energieverschillen serieus nemen en de taken daarop aanpassen zonder schuldspel.",
      "Eerlijkheid zoeken in draaglast, niet in het mathematisch precies tellen van klusjes.",
      "Ook mentale en onzichtbare taken benoemen zodat die niet automatisch bij haar belanden.",
      "Elkaar ondersteunen zonder vanzelfsprekend te maken dat een van jullie altijd opvangt."
    ],
    pitfalls: [
      "Zeggen dat iedereen gewoon even hard moet aanpakken.",
      "Alleen kijken naar zichtbare klussen en de rest niet meetellen.",
      "De verdeling laten zoals die ooit begon omdat veranderen gedoe is.",
      "Eerlijkheid gelijkstellen aan exact de helft, ongeacht ieders belastbaarheid.",
      "Wachten tot irritatie ontploft voordat je het bespreekt.",
      "Dingen overnemen zonder af te stemmen en dat dan zorg noemen."
    ],
    openPrompts: [
      "Wat zou voor jou voelen als een eerlijke taakverdeling, ook als onze weken heel verschillend zijn?",
      "Welke taken wil jij dat we altijd hardop blijven benoemen zodat ze niet onzichtbaar worden?",
      "Hoe wil jij dat ik reageer als jij merkt dat iets te veel op jouw schouders terechtkomt?",
      "Wat is voor jou het verschil tussen helpen en echt samen dragen?",
      "Wanneer zou jij je in werkverdeling niet gezien voelen door mij?"
    ],
    notes: [
      "Eerlijk betekent hier vooral: draaglijk, zichtbaar en bespreekbaar.",
      "Een goede verdeling houdt rekening met energie, niet alleen met uren.",
      "Wat je niet benoemt, kan later ongemerkt scheef trekken.",
      "Zij hoeft niet eerst uitgeput te raken voordat jij gaat afstemmen.",
      "Samenwerken lukt pas echt als niemand voortdurend hoeft te compenseren."
    ]
  },
  {
    family: "Dieren verzorgen",
    lens: "zorg die betrouwbaar is voor de dieren en leefbaar voor jullie",
    contexts: [
      "een ochtend waarop de dieren eerder aandacht nodig hebben dan gepland",
      "een gesprek na een dag waarin een dier onverwacht extra zorg vroeg",
      "het uitzoeken van routines voor voeren, schoonmaken en opletten",
      "een periode waarin slecht weer alles zwaarder maakt",
      "de vraag hoe jullie dierenzorg combineren met jullie eigen grenzen"
    ],
    concerns: [
      "hoe je voorkomt dat dierenzorg op wilskracht alleen draait",
      "wat je doet als de zorg meer wordt dan gedacht",
      "hoe je verantwoordelijkheid verdeelt zonder slordigheid of bitterheid",
      "wat je laat voorgaan als gemak botst met goede zorg",
      "hoe je trouw blijft aan zorg zonder jezelf of haar op te branden"
    ],
    ideals: [
      "Routines bouwen die betrouwbaar zijn voor de dieren én haalbaar voor jullie allebei.",
      "Op tijd erkennen wanneer extra zorg extra hulp, tijd of aanpassing vraagt.",
      "Verantwoordelijkheid helder verdelen zodat niets tussen jullie in valt.",
      "Het welzijn van de dieren belangrijker maken dan wat voor jullie even het makkelijkst is.",
      "Zorg serieus nemen zonder te doen alsof uitputting erbij hoort."
    ],
    pitfalls: [
      "Aannemen dat liefde voor dieren genoeg is om alle zorg vol te houden.",
      "Improviseren zolang het meestal wel goed gaat.",
      "Taken bij de ander laten landen omdat die er handiger in lijkt.",
      "Voor gemak kiezen en hopen dat de dieren daar weinig van merken.",
      "Doorzetten tot iemand op is in plaats van eerder bijsturen.",
      "Niet hardop zeggen wanneer de zorg te zwaar begint te worden."
    ],
    openPrompts: [
      "Wat vind jij belangrijker: romantisch dierenleven of betrouwbare zorg, en waarom?",
      "Hoe zouden wij volgens jou moeten merken dat we te veel hooi op onze vork nemen in de zorg voor dieren?",
      "Welke afspraak zou jij per se willen maken voordat we samen dieren verzorgen?",
      "Wat maakt dierenzorg voor jou mooi, en wat zou het zwaar kunnen maken?",
      "Hoe wil jij dat we omgaan met schuldgevoel als iets niet perfect lukt?"
    ],
    notes: [
      "Dierenzorg test betrouwbaarheid, niet alleen goede bedoelingen.",
      "De juiste keuze beschermt dierenwelzijn zonder haar op te offeren.",
      "Zorg is geen heldenrol maar een ritme dat vol te houden moet zijn.",
      "Wie duidelijk verdeelt, voorkomt fouten en wrok.",
      "Goede zorg begint vaak bij vroeg genoeg toegeven dat iets te veel wordt."
    ]
  },
  {
    family: "Tuin en moestuin",
    lens: "samen iets laten groeien zonder dat het een bron van druk wordt",
    contexts: [
      "een voorjaar waarin alles tegelijk gezaaid en gepland lijkt te moeten worden",
      "een gesprek terwijl jullie kijken naar wat wel en niet is aangeslagen",
      "een avond waarop de tuinwerkzaamheden maar niet af lijken",
      "het verdelen van onderhoud, oogst en opruimen door het seizoen heen",
      "een moment waarop de moestuin meer ambitie oproept dan rust"
    ],
    concerns: [
      "hoe je plezier bewaart als niet alles lukt",
      "wat je doet als de tuin meer werk vraagt dan voorzien",
      "hoe je voorkomt dat een mooi project een verplichting wordt",
      "hoe jullie beslissen wat belangrijk is en wat best mag mislukken",
      "wat er nodig is om samen trots te zijn zonder perfectionisme"
    ],
    ideals: [
      "Plezier en haalbaarheid belangrijker maken dan overal maximale opbrengst uit persen.",
      "Ambitie tijdig terugschalen wanneer het project zwaarder wordt dan goed voelt.",
      "De tuin als gedeeld ritme behandelen, niet als een extra bron van druk.",
      "Samen kiezen waar de aandacht heen gaat in plaats van alles tegelijk te willen redden.",
      "Ruimte laten voor mislukking zonder dat het meteen als falen voelt."
    ],
    pitfalls: [
      "Doen alsof alles alleen maar leuk hoort te zijn.",
      "Steeds uitbreiden omdat het idee mooier is dan het onderhoud.",
      "De lat zo hoog leggen dat ontspanning onmogelijk wordt.",
      "Stiekem hopen dat de ander de minder leuke taken wel oppakt.",
      "Succes meten in opbrengst in plaats van in hoe het voor jullie voelt.",
      "Geen keuzes maken en daardoor overal half achterlopen."
    ],
    openPrompts: [
      "Wat zou jij willen dat een tuin ons geeft behalve groente of bloemen?",
      "Wanneer zou een moestuin voor jou niet meer gezond voelen maar vooral extra druk geven?",
      "Hoe zouden wij omgaan met dingen die mislukken zonder dat de sfeer daardoor zakt?",
      "Wat zou jij liever klein en fijn houden dan groot en indrukwekkend maken?",
      "Welke tuinmomenten zouden volgens jou juist goed zijn voor ons als stel?"
    ],
    notes: [
      "Samen groeien lukt niet als alles in prestatie verandert.",
      "De beste richting bewaakt rust net zo goed als opbrengst.",
      "Niet alles wat kan, hoeft ook.",
      "Een tuin kan verbinden of opvreten; het verschil zit in jullie keuzes.",
      "Mildheid hoort ook bij iets opbouwen."
    ]
  },
  {
    family: "Geld en plannen",
    lens: "financiele eerlijkheid zonder geheimen, schaamte of stoerdoenerij",
    contexts: [
      "een avond met begrotingen, lijstjes en kosten waar niemand echt zin in heeft",
      "de vraag hoeveel risico jullie samen eigenlijk willen dragen",
      "een maand waarin onverwachte uitgaven ineens alles spannender maken",
      "een gesprek over wat verstandig is en wat vooral droomtaal is",
      "het plannen van een toekomst die mooi moet zijn maar ook betaalbaar"
    ],
    concerns: [
      "hoe open je moet zijn over geldstress",
      "wat je doet als verlangen en budget niet in hetzelfde tempo lopen",
      "hoe jullie beslissingen nemen zonder dat geld het hele gesprek kaapt",
      "welke risico's je wel en niet met elkaar wilt nemen",
      "hoe je voorkomt dat schaamte rond geld tot afstand leidt"
    ],
    ideals: [
      "Geldstress vroeg bespreken zodat die niet onder tafel jullie toon gaat bepalen.",
      "Dromen aanpassen aan wat verantwoord is zonder liefde eruit te halen.",
      "Financiele keuzes maken als team in plaats van als degene die het hardst durft.",
      "Expliciet zijn over welke risico's nog goed voelen en welke niet.",
      "Kwetsbaar durven zijn over zorgen of schaamte rond geld."
    ],
    pitfalls: [
      "Zeggen dat het later vanzelf wel uitkomt als jullie er maar in geloven.",
      "Plannen maken op bravoure in plaats van op cijfers.",
      "Uit ongemak vaag blijven totdat er echt stress ontstaat.",
      "Doorduwen omdat een droom anders minder indrukwekkend lijkt.",
      "Doen alsof risico automatisch romantisch is.",
      "Geld als technisch onderwerp behandelen zonder de emotionele lading mee te nemen."
    ],
    openPrompts: [
      "Hoe wil jij dat wij over geld praten zonder dat het kil of beschamend wordt?",
      "Welk soort risico zou jij met mij wel durven nemen, en welk soort juist niet?",
      "Wanneer zou jij voelen dat ik financieel te veel door mijn droom word geleid?",
      "Wat heb jij van mij nodig om je veilig te voelen in gesprekken over geld?",
      "Hoe zouden wij volgens jou verstandig kunnen zijn zonder alle romantiek eruit te halen?"
    ],
    notes: [
      "Geldgesprekken gaan net zo goed over veiligheid als over cijfers.",
      "De juiste keuze maakt eerlijkheid belangrijker dan bravoure.",
      "Plannen mogen warm zijn, maar niet mistig.",
      "Financiele openheid voorkomt later veel relationele schade.",
      "Samen rekenen is ook samen reguleren."
    ]
  },
  {
    family: "Rust en ritme",
    lens: "een dagelijks leven dat energie geeft in plaats van opvreet",
    contexts: [
      "een week waarin jullie merken hoe belangrijk slaap en timing eigenlijk zijn",
      "het zoeken naar een ritme tussen vroeg opstaan en genoeg herstellen",
      "een periode waarin drukte langzaam normaal begint te voelen",
      "een gesprek over hoe jullie dagen niet alleen productief maar ook leefbaar blijven",
      "een avond waarop duidelijk wordt dat tempo ook een relatie-onderwerp is"
    ],
    concerns: [
      "hoe je voorkomt dat drukte het vaste klimaat van jullie leven wordt",
      "wat herstel voor haar nodig heeft",
      "hoe jullie omgaan met verschillende energieniveaus",
      "welke ritmes jullie relatie beschermen",
      "wat er moet veranderen zodra vermoeidheid niet meer incidenteel is"
    ],
    ideals: [
      "Herstel net zo serieus plannen als werk, omdat uitputting niet romantisch is.",
      "Verschil in energie bespreken zonder oordeel of schuld.",
      "Ritmes bouwen die rust voorspelbaar maken in plaats van toevallig.",
      "Bewaken dat jullie relatie niet alleen bestaat tussen taken door.",
      "Ingrijpen zodra vermoeidheid structureel wordt in plaats van het te normaliseren."
    ],
    pitfalls: [
      "Zeggen dat je later wel uitrust als alles eenmaal loopt.",
      "Energieverschil zien als karakterzwakte of gebrek aan inzet.",
      "Rust alleen nemen als alles echt af is.",
      "Doen alsof liefde vanzelf sterk blijft als jullie altijd moe zijn.",
      "Vermoeidheid laten opstapelen omdat niemand de rem wil zijn.",
      "Plannen alsof elke week hetzelfde van jullie vraagt."
    ],
    openPrompts: [
      "Wat is voor jou een teken dat ons leven te vol begint te raken?",
      "Welke vorm van rust heb jij nodig die ik misschien sneller zou onderschatten?",
      "Hoe zou jij willen dat wij omgaan met verschillende energieniveaus?",
      "Welke dagelijkse of wekelijkse routine zou onze relatie volgens jou beschermen?",
      "Wat moet ik doen als ik merk dat jij langzaam over je grens heen gaat?"
    ],
    notes: [
      "Rust is hier geen luxe maar onderhoud van jullie leven samen.",
      "Een gezond ritme voorkomt dat liefde alleen nog logistiek wordt.",
      "Vermoeidheid moet bespreekbaar zijn voordat zij gedrag wordt.",
      "Herstel verdient net zoveel bewustzijn als ambitie.",
      "De beste keuze eert haar tempo zonder jouw dromen weg te gooien."
    ]
  },
  {
    family: "Liefde en nabijheid",
    lens: "verbinding die ook blijft bestaan wanneer het gewone leven rommelig wordt",
    contexts: [
      "een dag waarop jullie vooral functioneerden en pas laat echt contact hebben",
      "een week waarin er weinig ruimte leek voor spontaniteit",
      "een rustig moment waarin jullie merken dat intimiteit onderhoud nodig heeft",
      "een gesprek over hoe nabijheid eruitziet als je moe, druk of afgeleid bent",
      "een avond waarop de vraag opkomt hoe je elkaar niet kwijtraakt in het praktische"
    ],
    concerns: [
      "hoe je liefde voelbaar houdt in gewone dagen",
      "wat intimiteit nodig heeft behalve aantrekkingskracht",
      "hoe je aandacht geeft als je zelf vol zit",
      "hoe jullie signaleren dat verbinding aan het verdunnen is",
      "wat ervoor zorgt dat nabijheid veilig blijft en niet plichtmatig wordt"
    ],
    ideals: [
      "Bewust kleine momenten van echte aandacht maken, juist wanneer dagen vol zijn.",
      "Intimiteit behandelen als iets dat veiligheid, ontspanning en afstemming nodig heeft.",
      "Ook met een vol hoofd eerlijk zeggen waar je zit in plaats van half aanwezig te zijn.",
      "Op tijd opmerken wanneer jullie vooral nog regelen in plaats van echt verbinden.",
      "Nabijheid zacht en vrijwillig houden, nooit iets wat moet presteren."
    ],
    pitfalls: [
      "Aannemen dat liefde zichzelf wel blijft voelen zolang de relatie officieel goed zit.",
      "Intimiteit zien als bewijs dat het goed gaat in plaats van iets dat zorg vraagt.",
      "Je afsluiten en hopen dat zij wel begrijpt waarom.",
      "Pas reageren als afstand al pijnlijk groot is.",
      "Nabijheid forceren op momenten waarop veiligheid of rust ontbreekt.",
      "Denken dat praktische samenwerking genoeg is als emotionele voeding wegvalt."
    ],
    openPrompts: [
      "Waardoor voel jij je in gewone, saaie dagen toch geliefd door mij?",
      "Wat zou jij nodig hebben om nabijheid niet te laten verdwijnen in drukte?",
      "Wanneer merk jij meestal als een relatie meer functioneert dan echt leeft?",
      "Hoe wil jij dat ik contact maak als jij moe bent en niet veel woorden hebt?",
      "Wat maakt intimiteit voor jou veilig in plaats van alleen spannend of leuk?"
    ],
    notes: [
      "Nabijheid leeft vaak in kleine herhalingen, niet alleen in grote momenten.",
      "De goede keuze ziet verbinding als werk van aandacht, niet van toeval.",
      "Intimiteit zonder veiligheid is geen echte nabijheid.",
      "Ook liefde verdroogt als niemand water geeft.",
      "Gewone dagen zijn precies waar verbondenheid getest wordt."
    ]
  },
  {
    family: "Grenzen en veiligheid",
    lens: "respect voor haar grenzen zonder dat zij eerst hard hoeft te vechten",
    contexts: [
      "een gesprek over wat te veel is, ook als er nog niets spectaculairs misgaat",
      "een moment waarop zij subtiel aangeeft dat iets haar spanning geeft",
      "een periode waarin jullie veel tegelijk willen en dus grenzen nodig hebben",
      "een situatie waarin jij enthousiast bent maar zij nog niet zeker voelt",
      "een rustige avond waarin het gaat over hoe zij zich beschermd kan voelen"
    ],
    concerns: [
      "hoe jij reageert op haar terughoudendheid",
      "wat veiligheid betekent als woorden alleen niet genoeg zijn",
      "hoe je voorkomt dat jouw tempo haar grens wordt",
      "wat je doet als zij iets lastig vindt om direct te zeggen",
      "hoe jullie omgaan met nee, twijfel of behoefte aan ruimte"
    ],
    ideals: [
      "Haar terughoudendheid serieus nemen zonder haar te laten bewijzen dat die terecht is.",
      "Veiligheid laten zien in gedrag, voorspelbaarheid en respect, niet alleen in mooie zinnen.",
      "Jouw tempo vertragen zodra blijkt dat haar gevoel nog niet mee is.",
      "Ook zachte signalen oppikken in plaats van te wachten op een harde grens.",
      "Ruimte geven aan nee of twijfel zonder gekwetste druk terug te leggen."
    ],
    pitfalls: [
      "Zeggen dat ze het gewoon directer moet zeggen als iets niet fijn voelt.",
      "Je goede intenties als bewijs gebruiken dat zij veilig zou moeten zijn.",
      "Doorduwen omdat je geen slechte bedoelingen hebt.",
      "Alleen luisteren naar expliciete grenzen en subtiele signalen negeren.",
      "Twijfel interpreteren als iets wat jij moet ompraten.",
      "Ruimte geven laten klinken als afstand of straf."
    ],
    openPrompts: [
      "Wat maakt dat jij je echt veilig voelt bij iemand, los van wat diegene zegt?",
      "Hoe wil jij dat ik reageer als jij nog geen duidelijk ja voelt?",
      "Wat zou voor jou een teken zijn dat mijn enthousiasme te groot wordt voor jouw tempo?",
      "Welke zachte signalen wil jij dat ik serieus neem zonder discussie?",
      "Wat betekent ruimte voor jou als iets je overweldigt of onrustig maakt?"
    ],
    notes: [
      "Veiligheid bestaat vaak uit hoe vroeg je haar signalen al respecteert.",
      "Het juiste antwoord vertraagt eerder dan dat het overtuigt.",
      "Grenzen hoeven niet luid te zijn om echt te zijn.",
      "Haar veiligheid is geen toets van jouw ego maar een basisvoorwaarde.",
      "Respect klinkt niet alleen zacht, het gedraagt zich ook zacht."
    ]
  },
  {
    family: "Ruzie en herstel",
    lens: "conflict kunnen dragen zonder elkaar te vernederen of kwijt te raken",
    contexts: [
      "een botsing na een vermoeiende dag waarop jullie allebei korter reageren",
      "een gesprek over hoe je terugkomt na harde woorden of misverstanden",
      "een moment waarop irritatie eigenlijk over iets ouds blijkt te gaan",
      "een avond waarop een klein conflict groter dreigt te worden",
      "een nagesprek over wat helpen zou als het weer eens schuurt"
    ],
    concerns: [
      "hoe je ruzie stopt voordat het gemeen wordt",
      "wat herstel nodig heeft nadat iemand zich geraakt voelde",
      "hoe je luistert zonder meteen te verdedigen",
      "wanneer je even afstand neemt en wanneer je juist blijft",
      "hoe je verantwoordelijkheid neemt zonder toneel van schuld"
    ],
    ideals: [
      "Op tijd vertragen wanneer de toon harder wordt, zodat het gesprek niet ontspoort.",
      "Na pijn eerst erkennen wat zij voelde voordat je uitlegt wat jij bedoelde.",
      "Luisteren om te begrijpen in plaats van direct je eigen onschuld te regelen.",
      "Afstand alleen nemen als die helpt reguleren, niet als vermijding of straf.",
      "Verantwoordelijkheid nemen in concreet gedrag en niet alleen in sorry-zinnen."
    ],
    pitfalls: [
      "Blijven praten tot iemand breekt omdat je het meteen opgelost wilt hebben.",
      "Snel uitleggen dat je het niet zo bedoelde en daarmee haar ervaring wegduwen.",
      "Luisteren als voorbereiding op jouw tegenargument.",
      "Verdwijnen onder het mom van rust terwijl zij in onzekerheid blijft zitten.",
      "Een excuus geven zonder iets te veranderen.",
      "Doen alsof ruzie vanzelf wegzakt als je het onderwerp maar laat liggen."
    ],
    openPrompts: [
      "Wat helpt jou het meest als je je geraakt voelt door iemand van wie je houdt?",
      "Hoe wil jij dat we pauze nemen in ruzie zonder dat het voelt alsof ik wegloop?",
      "Wat is voor jou het verschil tussen uitleg en jezelf verdedigen?",
      "Wanneer voelt een excuus echt, en wanneer juist leeg?",
      "Wat zou jij van mij nodig hebben om na conflict weer veilig dichtbij te komen?"
    ],
    notes: [
      "Herstel begint meestal met erkenning, niet met slim uitleggen.",
      "Ruzie zegt veel, maar herstel zegt meestal nog meer.",
      "Een volwassen reactie kiest niet voor winnen maar voor terugvinden.",
      "Pauze kan goed zijn, zolang die niet als verlaten voelt.",
      "Je toon is in conflict vaak net zo belangrijk als je argument."
    ]
  },
  {
    family: "Toekomst en dromen",
    lens: "een toekomstbeeld dat jullie allebei draagt in plaats van eenrichtingsverkeer wordt",
    contexts: [
      "een laat gesprek over waar jullie over vijf of tien jaar hopen te staan",
      "een moment waarop een grote droom ineens heel concreet begint te worden",
      "een wandeling waarin jullie praten over wat later niet verloren mag gaan",
      "het afwegen van verlangen tegenover haalbaarheid",
      "een avond waarop jullie merken dat toekomstpraat ook spanning kan geven"
    ],
    concerns: [
      "hoe je voorkomt dat toekomstplannen haar moeten inhalen",
      "welke dromen echt van jullie samen zijn en welke vooral van jou",
      "wat je doet als verlangen en realiteit nog niet op elkaar passen",
      "hoe je ruimte laat voor verandering zonder stuurloos te worden",
      "wat belangrijker is: grootsheid of duurzaamheid"
    ],
    ideals: [
      "Toekomstplannen steeds toetsen aan wat voor haar echt goed en wenselijk voelt.",
      "Onderscheiden wat een gezamenlijke droom is en wat vooral jouw project is.",
      "Verlangen serieus nemen zonder realiteit weg te romantiseren.",
      "Richting houden én openblijven voor het feit dat mensen onderweg veranderen.",
      "Kiezen voor een toekomst die lang goed blijft in plaats van kort indrukwekkend is."
    ],
    pitfalls: [
      "De toekomst presenteren als iets waar zij alleen nog ja op hoeft te zeggen.",
      "Jouw droomtaal als neutraal uitgangspunt behandelen.",
      "Realistische vragen zien als gebrek aan liefde of visie.",
      "Zo flexibel blijven dat niets werkelijk gedragen wordt.",
      "Groot denken verwarren met verstandig denken.",
      "Doorduwen omdat terugschalen voelt als falen."
    ],
    openPrompts: [
      "Welke toekomst droom van ons wil jij dat ik serieuzer neem dan ik nu doe?",
      "Waar ben jij bang voor als een gezamenlijk plan eigenlijk vooral mijn plan blijkt?",
      "Wat mag volgens jou nooit sneuvelen wanneer wij later dingen opbouwen?",
      "Hoe zou jij merken dat een droom ons goed doet in plaats van opjaagt?",
      "Wat is voor jou aantrekkelijker: iets groots of iets dat lang gezond blijft?"
    ],
    notes: [
      "Een mooie toekomst is er een waarin zij zichzelf niet hoeft kwijt te raken.",
      "Gedeelde dromen herken je aan wederkerigheid, niet aan enthousiasme alleen.",
      "Haalbaarheid is geen killjoy maar een vorm van zorg.",
      "Ook liefdevolle plannen mogen door de realiteit heen getest worden.",
      "Niet alles wat groots klinkt, is ook diep of duurzaam."
    ]
  },
  {
    family: "Kinderen en gezin",
    lens: "zorgvuldigheid rond een onderwerp dat identiteit, rust en toekomst raakt",
    contexts: [
      "een gesprek over of en hoe jullie ooit een gezin voor je zien",
      "een moment waarop jullie merken dat verwachtingen over kinderen kunnen verschillen",
      "een avond waarin het gaat over opvoeden, zorg en draagkracht",
      "het nadenken over hoe een gezin jullie relatie zou veranderen",
      "een kwetsbaar gesprek over verlangens die niet licht voelen"
    ],
    concerns: [
      "hoe je praat over kinderen zonder druk op haar te leggen",
      "wat draagkracht en timing hierin betekenen",
      "hoe je ruimte laat voor twijfel of verschil van gevoel",
      "welke rolverdeling je vreest of juist hoopt te voorkomen",
      "hoe je een gezin denkt zonder haar als vanzelfsprekende drager te zien"
    ],
    ideals: [
      "Over kinderen praten als iets wat alleen veilig is zonder druk of haast.",
      "Draagkracht, timing en gezondheid serieus meenemen in plaats van alleen verlangen.",
      "Twijfel of verschil zien als iets om zorgvuldig mee om te gaan, niet als obstakel dat weg moet.",
      "Open benoemen welke lasten of scheefgroei je later wilt voorkomen.",
      "Haar nooit automatisch aanwijzen als degene die het meeste opvangt."
    ],
    pitfalls: [
      "Doen alsof liefde vanzelf richting geeft aan zo'n groot onderwerp.",
      "Druk leggen via toekomstbeelden of subtiele verwachting.",
      "Twijfel interpreteren als iets dat jij wel recht kunt praten.",
      "Niet nadenken over draagkracht omdat dat de fantasie minder leuk maakt.",
      "Stilzwijgend aannemen dat zorg uiteindelijk meer op haar neerkomt.",
      "Timing behandelen alsof die alleen logistiek is."
    ],
    openPrompts: [
      "Wat maakt praten over kinderen voor jou veilig of juist spannend?",
      "Wat zou jij nodig hebben om zo'n onderwerp met mij zonder druk te kunnen bespreken?",
      "Welke zorg of ongelijkheid zou jij absoluut niet willen in een toekomstig gezin?",
      "Hoe belangrijk is timing voor jou in dit onderwerp, en waarom?",
      "Wat wil jij dat ik begrijp over jouw gevoel bij zorg dragen, vrijheid en toekomst?"
    ],
    notes: [
      "Dit onderwerp vraagt zachtheid, geen overtuigingskracht.",
      "Draagkracht is hier net zo belangrijk als verlangen.",
      "De juiste toon geeft ruimte aan verschil zonder afstand te maken.",
      "Niet invullen is hier een vorm van respect.",
      "Een gezin denk je niet eerlijk als haar vrijheid buiten beeld valt."
    ]
  },
  {
    family: "Vrienden en familie",
    lens: "een relatie die open blijft naar anderen zonder zichzelf te verliezen",
    contexts: [
      "een gesprek over bezoek, grenzen en verwachtingen van buitenaf",
      "een situatie waarin familie of vrienden vanzelf veel invloed lijken te krijgen",
      "het zoeken naar balans tussen sociaal zijn en jullie eigen rust",
      "een avond waarop het gaat over loyaal zijn zonder je relatie op de tweede plek te zetten",
      "een moment waarop blijkt dat jullie allebei iets anders gewend zijn rond familie"
    ],
    concerns: [
      "hoe jullie grenzen stellen naar familie of vrienden",
      "wat jullie doen als anderen veel mening hebben over jullie keuzes",
      "hoe je ruimte maakt voor bezoek zonder dat thuis onveilig voelt",
      "hoe loyaal je bent aan elkaar in sociale spanning",
      "hoe je rekening houdt met verschil in sociale behoefte"
    ],
    ideals: [
      "Samen afspreken welke grenzen jullie naar buiten toe willen beschermen.",
      "Mening van anderen horen zonder jullie relatie daardoor te laten besturen.",
      "Bezoek alleen zo organiseren dat thuis ook voor haar veilig en comfortabel blijft.",
      "In sociale druk zichtbaar naast haar blijven staan in plaats van neutraal weg te kijken.",
      "Verschil in sociale behoefte meenemen als echte factor en niet als detail."
    ],
    pitfalls: [
      "Iedereen tevreden proberen te houden behalve elkaar.",
      "Andermans oordeel stiekem zwaarder laten wegen dan haar gevoel.",
      "Bezoek vanzelfsprekend maken omdat jij daar minder last van hebt.",
      "In spanning met familie op veilig spelen door je niet uit te spreken.",
      "Haar behoefte aan rust sociaal onvriendelijk noemen.",
      "Geen gezamenlijke lijn hebben en dat pas merken als het al botst."
    ],
    openPrompts: [
      "Wat zou jij willen dat ik doe als familie of vrienden druk zetten op iets wat tussen ons ligt?",
      "Hoeveel open huis en hoeveel bescherming van onze rust voelt goed voor jou?",
      "Wanneer voel jij je gesteund door mij in sociale situaties, en wanneer niet?",
      "Waarin verschillen onze gewoontes rond familie volgens jou het meest?",
      "Welke grens naar buiten toe zou jij belangrijk vinden om samen te bewaken?"
    ],
    notes: [
      "Een relatie heeft buitenwereld nodig, maar ook bescherming.",
      "De goede keuze laat zien dat jij niet oplost in sociale druk.",
      "Loyaliteit betekent soms zacht maar duidelijk begrenzen.",
      "Gastvrijheid is niet waardevol als zij zich daardoor niet meer thuis voelt.",
      "Wat jullie samen afspreken moet buiten ook herkenbaar blijven."
    ]
  },
  {
    family: "Seizoenen en tradities",
    lens: "rituelen bouwen die betekenis geven zonder dwingend te worden",
    contexts: [
      "het bedenken van gewoontes voor winter, zomer en alles daartussenin",
      "een gesprek over feestdagen, terugkerende momenten en wat jullie daarvan willen maken",
      "de vraag welke tradities jullie willen erven en welke juist niet",
      "een seizoen waarin jullie merken hoe goed rituelen kunnen dragen",
      "een avond waarop het gaat over herhaling, gezelligheid en vrijheid"
    ],
    concerns: [
      "hoe tradities iets van jullie samen worden",
      "wat je doet als gewoontes verplicht beginnen te voelen",
      "welke momenten je bewust betekenis wilt geven",
      "hoe je ruimte laat voor haar smaak en geschiedenis",
      "wat de waarde is van herhaling zonder verstarring"
    ],
    ideals: [
      "Tradities samen vormen in plaats van automatisch jouw oude patronen te volgen.",
      "Op tijd loslaten wat meer plicht dan vreugde begint te worden.",
      "Bewust kiezen welke terugkerende momenten jullie willen laden met aandacht.",
      "Haar geschiedenis en voorkeur net zo veel gewicht geven als de jouwe.",
      "Rituelen gebruiken als anker, niet als keurslijf."
    ],
    pitfalls: [
      "Vanzelf aannemen dat oude tradities neutraal zijn.",
      "Doorzetten omdat iets nu eenmaal elk jaar zo gaat.",
      "Alles bijzonder willen maken zodat niets nog licht voelt.",
      "Niet vragen wat zij juist fijn of beladen vindt.",
      "Traditie verwarren met controle over hoe dingen horen te gaan.",
      "Herhaling alleen gezellig vinden zolang iedereen zich aanpast."
    ],
    openPrompts: [
      "Welke traditie zou jij samen willen opbouwen die echt van ons voelt?",
      "Wat uit jouw eigen geschiedenis zou jij later wel of juist niet willen meenemen?",
      "Wanneer wordt een gezellige gewoonte voor jou eerder een verplichting?",
      "Welke seizoensmomenten zouden volgens jou goed zijn om bewust samen te markeren?",
      "Wat moet ik begrijpen over jouw smaak of gevoeligheden rond feest en traditie?"
    ],
    notes: [
      "Rituelen zijn het mooist wanneer ze gekozen zijn, niet opgelegd.",
      "De beste keuze geeft haar verleden en voorkeur evenveel plek.",
      "Tradities horen te dragen, niet dicht te drukken.",
      "Herhaling wordt pas waardevol als er vrijheid in blijft zitten.",
      "Ook gezelligheid heeft afstemming nodig."
    ]
  },
  {
    family: "Dagelijkse gewoontes",
    lens: "kleine patronen die vertrouwen en zachtheid stapelen",
    contexts: [
      "een doordeweekse ochtend waarop alles snel moet maar de toon toch iets doet",
      "de manier waarop jullie elkaar begroeten, afstemmen en afsluiten op gewone dagen",
      "een gesprek over mini-gewoontes die een huis of relatie kleur geven",
      "een dag waarin niets bijzonders gebeurt maar juist daarom veel zichtbaar wordt",
      "het zoeken naar rituelen die klein zijn maar veel betekenen"
    ],
    concerns: [
      "welke kleine dingen haar veel zekerheid geven",
      "hoe je aandacht laat voelen zonder het groot te maken",
      "wat gewone dagen draaglijk en warm maakt",
      "hoe jullie op slechte dagen toch netjes met elkaar omgaan",
      "welke gewoontes later het verschil maken tussen huisgenoten en geliefden"
    ],
    ideals: [
      "Kleine vormen van aandacht serieus nemen omdat zij vaak het klimaat van de relatie bepalen.",
      "Geen groot theater maken van liefde, maar wel consequent laten merken dat zij telt.",
      "Gewone dagen zacht organiseren in plaats van alleen efficiënt.",
      "Ook op slechte dagen bewaken hoe jullie tegen elkaar praten.",
      "Gewoontes kiezen die verbinding houden tussen alle praktische dingen door."
    ],
    pitfalls: [
      "Denken dat kleine dingen onbelangrijk zijn zolang de grote lijn goed is.",
      "Aandacht alleen geven als het jou uitkomt of spontaan invalt.",
      "Efficientie steeds laten winnen van sfeer.",
      "Moeheid als excuus gebruiken voor een harde toon.",
      "Alleen bij problemen investeren in contact.",
      "Liefde groot praten maar klein leven."
    ],
    openPrompts: [
      "Welke kleine gewoonte van een partner zegt voor jou eigenlijk heel veel?",
      "Wat zou jij dagelijks willen voelen, ook op drukke of saaie dagen?",
      "Wanneer merk jij dat gewone dagen warm zijn in plaats van alleen functioneel?",
      "Welke mini-rituelen zouden wij moeten hebben om ons verbonden te blijven voelen?",
      "Wat moet ik niet onderschatten aan toon, timing of aandacht in het dagelijks leven?"
    ],
    notes: [
      "Het dagelijks leven is vaak waar vertrouwen echt wordt opgebouwd.",
      "Kleine patronen kunnen meer troost geven dan grote woorden.",
      "De juiste keuze waardeert het gewone als relationeel terrein.",
      "Warmte zit vaak in herhaling, niet alleen in intensiteit.",
      "Hoe jullie doen op saaie dagen zegt veel over later."
    ]
  },
  {
    family: "Taken in moeilijke weken",
    lens: "soepel en liefdevol kunnen herschikken wanneer het leven tegenzit",
    contexts: [
      "een week met ziekte, stress of onverwachte tegenslag",
      "een periode waarin alles zwaarder voelt dan normaal",
      "een paar dagen waarop jullie gebruikelijke systeem niet meer werkt",
      "een situatie waarin draagkracht plotseling scheef valt",
      "een moeilijke week waarin je merkt of jullie echt een team zijn"
    ],
    concerns: [
      "hoe flexibel je bent wanneer de normale verdeling niet meer past",
      "wat je laat vallen en wat je beschermt als er te veel tegelijk is",
      "hoe je zorg geeft zonder jezelf tot redder te maken",
      "wanneer je hulp van buiten nodig hebt",
      "hoe je voorkomt dat moeilijke weken blijvende wrok worden"
    ],
    ideals: [
      "In moeilijke weken opnieuw verdelen in plaats van star vasthouden aan het oude schema.",
      "Samen bepalen wat nu echt belangrijk is en wat tijdelijk minder perfect mag.",
      "Ondersteunen zonder heldenrol, zodat zorg niet in scheefgroei verandert.",
      "Hulp durven organiseren wanneer jullie het samen niet goed rond krijgen.",
      "Na een zware week napraten zodat niemand stil blijft zitten met bitterheid."
    ],
    pitfalls: [
      "Het normale systeem koste wat kost proberen vol te houden.",
      "Alles belangrijk blijven noemen zodat niets echt prioriteit krijgt.",
      "Meer doen zonder iets te zeggen en verwachten dat zij dat vanzelf snapt.",
      "Hulp pas overwegen als iemand al bijna instort.",
      "Na afloop meteen doorrennen zonder te evalueren.",
      "Doen alsof moeilijke weken geen invloed horen te hebben op hoe jullie je voelen."
    ],
    openPrompts: [
      "Wat wil jij dat er in een moeilijke week direct anders mag worden aan onze manier van leven?",
      "Hoe zou jij willen dat ik zorg geef zonder jou klein te maken of mezelf op te branden?",
      "Wanneer moeten wij volgens jou hulp van buiten durven vragen?",
      "Wat zou in zware weken voor jou een teken van teamgevoel zijn?",
      "Hoe voorkom je volgens jou dat stressweken stille verwijten achterlaten?"
    ],
    notes: [
      "Moeilijke weken vragen niet om perfectie maar om beweeglijkheid.",
      "Een team herken je vaak pas wanneer het schema faalt.",
      "De juiste reactie beschermt zowel de relatie als de draagkracht.",
      "Niet alles hoeft overeind te blijven om goed voor elkaar te zorgen.",
      "Nazorg na stress is net zo belangrijk als de stressweek zelf."
    ]
  },
  {
    family: "Vertrouwen en openheid",
    lens: "eerlijkheid die niet hard is maar wel helder",
    contexts: [
      "een gesprek over wat je wel, niet of nog niet makkelijk zegt",
      "een moment waarop zwijgen veiliger lijkt dan eerlijk zijn",
      "een avond waarop jullie bespreken wat openheid eigenlijk vraagt",
      "een situatie waarin een klein geheim groter voelt dan het lijkt",
      "de vraag hoe transparant je moet zijn om echt vertrouwd te blijven"
    ],
    concerns: [
      "hoe je moeilijke dingen op tijd zegt",
      "wat eerlijkheid onderscheidt van botheid",
      "hoe je open blijft zonder alles in paniek eruit te gooien",
      "wat vertrouwen aantast in kleine stapjes",
      "hoe jullie een sfeer bouwen waarin waarheid niet meteen gevaarlijk voelt"
    ],
    ideals: [
      "Moeilijke dingen vroeg genoeg delen zodat ze niet eerst een schaduwleven gaan leiden.",
      "Eerlijk zijn met zorg voor toon, timing en haar draagvlak.",
      "Openheid oefenen zonder alles ongefilterd over haar heen te storten.",
      "Kleine onduidelijkheden serieus nemen omdat vertrouwen vaak daar scheurt.",
      "Een klimaat bouwen waarin waarheid bespreekbaar is zonder straf of spot."
    ],
    pitfalls: [
      "Dingen verzwijgen tot ze te groot voelen om nog rustig te bespreken.",
      "Botheid verkopen als eerlijkheid.",
      "Alles meteen eruit gooien zonder te voelen wat haar nu helpt.",
      "Alleen naar grote leugens kijken en kleine verschuivingen negeren.",
      "Zeggen dat openheid belangrijk is maar defensief reageren op haar waarheid.",
      "Eerlijkheid gebruiken om spanning af te voeren in plaats van verbinding te bouwen."
    ],
    openPrompts: [
      "Wanneer voelt eerlijkheid voor jou verbindend, en wanneer juist onveilig?",
      "Wat zou jij nodig hebben om ook lastige dingen aan mij te durven zeggen?",
      "Welke kleine vormen van onduidelijkheid tasten vertrouwen voor jou aan?",
      "Hoe wil jij dat ik een moeilijk gesprek open zonder je te overvallen?",
      "Wat is voor jou het verschil tussen open zijn en emotioneel dumpen?"
    ],
    notes: [
      "Vertrouwen groeit vaak in de manier waarop je met kleine waarheden omgaat.",
      "Openheid zonder zorg kan alsnog onveilig voelen.",
      "De beste keuze combineert waarheid met relationele verantwoordelijkheid.",
      "Te laat eerlijk zijn is vaak ook een vorm van afstand.",
      "Wat zij veilig durft te zeggen, zegt veel over jullie klimaat."
    ]
  },
  {
    family: "Plezier en speelsheid",
    lens: "lichtheid bewaren zonder de diepte kwijt te raken",
    contexts: [
      "een periode waarin alles functioneel dreigt te worden",
      "een avond waarop jullie merken dat lachen en luchtigheid ook onderhoud vragen",
      "een gesprek over hoe plezier past in een serieus toekomstplan",
      "een dag waarop spontaniteit botst met planning",
      "de vraag hoe je samen nog speels blijft als het leven voller wordt"
    ],
    concerns: [
      "hoe jullie plezier niet uitstellen tot later",
      "wat speelsheid nodig heeft om veilig te blijven",
      "hoe je luchtigheid gebruikt zonder moeilijke dingen weg te lachen",
      "hoe spontaan je kunt zijn zonder chaos te veroorzaken",
      "waarom plezier ook relationele voeding is"
    ],
    ideals: [
      "Bewust ruimte houden voor lol en lichtheid in plaats van die steeds door te schuiven.",
      "Speelsheid bouwen op veiligheid en wederzijds gemak, niet op prikken of testen.",
      "Humor gebruiken om te verbinden, niet om lastige onderwerpen weg te poetsen.",
      "Spontaniteit welkom maken zonder dat het jullie basisritme sloopt.",
      "Plezier serieus nemen als iets wat de relatie voedt."
    ],
    pitfalls: [
      "Plezier zien als iets voor als alles eindelijk af is.",
      "Plagen of spanning opzoeken onder het mom van speelsheid.",
      "Humor gebruiken om niet echt te hoeven praten.",
      "Chaos verwarren met levendigheid.",
      "Denken dat serieuze liefde vanzelf ook leuke liefde blijft.",
      "Luchtigheid alleen laten bestaan als zij zich aanpast aan jouw stijl."
    ],
    openPrompts: [
      "Wat voor soort plezier voelt voor jou verbindend in plaats van vermoeiend?",
      "Hoe zouden wij volgens jou luchtigheid kunnen houden zonder onvolwassen te worden?",
      "Wanneer wordt grapjes maken voor jou een manier om iets te ontwijken?",
      "Welke spontane dingen zouden onze relatie voeden zonder ons leven rommelig te maken?",
      "Waarom is plezier volgens jou niet zomaar bijzaak in een relatie?"
    ],
    notes: [
      "Lichtheid is geen luxe; het houdt relaties ademend.",
      "Veilige speelsheid vraagt net zo goed afstemming.",
      "De goede richting laat lol bestaan naast verantwoordelijkheid.",
      "Humor mag openen, niet verdoven.",
      "Ook toekomstplannen hebben lucht nodig."
    ]
  },
  {
    family: "Keuzes en offers",
    lens: "samen bewust kiezen wat het waard is en wat niet",
    contexts: [
      "een gesprek over wat jullie willen opgeven en wat juist niet",
      "een moment waarop twee goede dingen niet allebei tegelijk kunnen",
      "het afwegen van comfort tegenover betekenis",
      "een avond waarop duidelijk wordt dat elke keuze ook iets kost",
      "de vraag welke offers liefdevol zijn en welke alleen maar stoer klinken"
    ],
    concerns: [
      "hoe je onderscheid maakt tussen gezonde offers en domme uitputting",
      "wie de prijs van een keuze straks echt betaalt",
      "wat niet onderhandelbaar is voor haar welzijn",
      "hoe je samen beslist wanneer niet alles kan",
      "hoe je voorkomt dat een droom op haar kosten doorgaat"
    ],
    ideals: [
      "Offers alleen goed vinden wanneer ze bewust gekozen en eerlijk verdeeld zijn.",
      "Kijken wie de werkelijke prijs betaalt in energie, vrijheid of rust.",
      "Haar basiswelzijn niet behandelen als iets dat voor een plan kan wijken.",
      "Samen prioriteren in plaats van automatisch jouw verlangen centraal te zetten.",
      "Een droom durven bijstellen zodra blijkt dat de kosten relationeel te hoog worden."
    ],
    pitfalls: [
      "Lijden romantiseren als bewijs van liefde of toewijding.",
      "Vergeten te kijken op wiens schouders het offer landt.",
      "Doen alsof alles even belangrijk is.",
      "Jouw belangrijkste wens als vanzelf het uitgangspunt nemen.",
      "Te laat toegeven dat iets te veel kost.",
      "Opoffering bewonderen terwijl herstel uit beeld raakt."
    ],
    openPrompts: [
      "Welk offer zou voor jou liefdevol voelen, en welk offer juist niet meer gezond?",
      "Waar wil jij later nooit op inleveren, ook niet voor een gezamenlijke droom?",
      "Hoe merk je dat een keuze vooral op de ander begint te leunen?",
      "Wat zou ik moeten begrijpen over jouw grenzen rond vrijheid, rust of ruimte?",
      "Wanneer is terugschalen volgens jou geen falen maar wijsheid?"
    ],
    notes: [
      "Niet ieder offer is edel; sommige zijn gewoon scheef.",
      "De beste keuze vraagt wie de prijs voelt, niet alleen wat het oplevert.",
      "Liefdevolle keuzes laten ruimte over om mens te blijven.",
      "Ook toewijding heeft grenzen nodig.",
      "Wat je samen wilt, moet niet stilletjes door haar betaald worden."
    ]
  },
  {
    family: "Oud worden samen",
    lens: "een lange toekomst denken vanuit zachtheid, waardigheid en trouw",
    contexts: [
      "een gesprek over hoe jullie willen leven als de jaren zwaarder of stiller worden",
      "een moment waarop jullie nadenken over gezondheid, zorg en ouder worden",
      "een rustige avond waarin later ineens dichtbij voelt",
      "de vraag wat jullie absoluut willen behouden als de energie verandert",
      "een toekomstgesprek waarin niet alleen dromen maar ook kwetsbaarheid meetelt"
    ],
    concerns: [
      "wat jullie relatie sterk houdt op de lange termijn",
      "hoe je omgaat met veranderende lichamen en mogelijkheden",
      "wat zorg voor elkaar later waardig maakt",
      "welke vormen van trouw je nu al wilt oefenen",
      "hoe je later niet alleen samen blijft, maar ook goed samen blijft"
    ],
    ideals: [
      "Nu al bouwen aan gewoontes van zorg, respect en humor die later blijven dragen.",
      "Verandering in lichaam of energie zien als iets om samen lief op aan te passen.",
      "Zorg later waardig maken door aandacht, overleg en wederzijds respect.",
      "Trouw niet alleen voelen maar oefenen in dagelijkse betrouwbaarheid.",
      "Niet alleen mikken op lang samen zijn, maar op lang goed samen zijn."
    ],
    pitfalls: [
      "Oud worden romantiseren zonder na te denken over echte kwetsbaarheid.",
      "Aannemen dat liefde later vanzelf wel weet hoe te zorgen.",
      "Verandering behandelen als verlies in plaats van als iets om op aan te passen.",
      "Trouw groot benoemen maar klein leven.",
      "Later zien als een vaag decor zonder concrete keuzes nu.",
      "Alleen aan samen oud worden denken vanuit plaatjes van rust en niet vanuit werkelijkheid."
    ],
    openPrompts: [
      "Wat hoop jij dat er tussen ons hetzelfde blijft als we later ouder worden?",
      "Welke vorm van zorg of trouw vind jij het mooist als je aan later denkt?",
      "Waar ben jij bang voor als mensen samen oud worden maar elkaar onderweg niet blijven zien?",
      "Wat zouden wij nu al moeten oefenen om later zacht voor elkaar te blijven?",
      "Hoe ziet waardigheid er volgens jou uit in een lange relatie?"
    ],
    notes: [
      "Lang samen zijn is iets anders dan lang goed samen zijn.",
      "Later wordt vaak gebouwd in kleine dingen van nu.",
      "De beste keuze eert kwetsbaarheid zonder het te dramatiseren.",
      "Trouw blijkt vaak uit gedrag dat heel gewoon oogt.",
      "Ook een verre toekomst vraagt nu al concrete liefde."
    ]
  }
];

function rotate(list, index) {
  return list[index % list.length];
}

function sentenceCase(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function uniqueOptions(correct, familyPitfalls, seed) {
  const candidates = [...familyPitfalls, ...globalDecoys];
  const options = [correct];
  let cursor = seed;

  while (options.length < 4) {
    const candidate = candidates[cursor % candidates.length];
    if (!options.includes(candidate)) {
      options.push(candidate);
    }
    cursor += 3;
  }

  const decorated = options.map((text) => ({ text, correct: text === correct }));
  for (let i = decorated.length - 1; i > 0; i -= 1) {
    const j = (seed * 17 + i * 5) % (i + 1);
    [decorated[i], decorated[j]] = [decorated[j], decorated[i]];
  }

  return {
    options: decorated.map((item) => item.text),
    answer: decorated.findIndex((item) => item.correct)
  };
}

function makeMultipleChoice(config, familyIndex, localIndex) {
  const row = Math.floor(localIndex / 5);
  const col = localIndex % 5;
  const index = familyIndex * questionsPerFamily + localIndex + 1;
  const context = config.contexts[row];
  const concern = config.concerns[col];
  const correct = rotate(config.ideals, row + col);
  const stake = sentenceCase(rotate(stakes, familyIndex + row + col));
  const signal = sentenceCase(rotate(emotionalSignals, familyIndex * 2 + row + col));
  const scenario = rotate(mcTemplates, familyIndex * questionsPerFamily + localIndex)({
    index,
    context,
    concern,
    lens: config.lens,
    stake,
    signal
  });
  const shuffled = uniqueOptions(correct, config.pitfalls, index);

  return {
    id: `q-${String(index).padStart(4, "0")}`,
    family: config.family,
    title: `${config.family} ${localIndex + 1}`,
    scenario,
    options: shuffled.options,
    answer: shuffled.answer,
    note: rotate(config.notes, row * 2 + col)
  };
}

function makeOpen(config, familyIndex, localIndex, openSlot) {
  const row = Math.floor(localIndex / 5);
  const col = localIndex % 5;
  const index = familyIndex * questionsPerFamily + localIndex + 1;
  const context = config.contexts[row];
  const prompt = rotate(config.openPrompts, openSlot + col);
  const angle = rotate(openAngles, familyIndex + openSlot + row + col);
  const signal = sentenceCase(rotate(emotionalSignals, familyIndex + openSlot + row));
  const closer = rotate(openClosers, familyIndex * 3 + openSlot + col);
  const scenario = rotate(openTemplates, familyIndex * 5 + openSlot)({
    index,
    context,
    prompt,
    angle,
    signal,
    closer
  });

  return {
    id: `q-${String(index).padStart(4, "0")}`,
    family: config.family,
    type: "open",
    title: `${config.family} ${localIndex + 1}`,
    scenario,
    sample: "Een eerlijk antwoord dat concreet, persoonlijk en afgestemd voelt op haar beleving.",
    note: rotate(config.notes, row + col)
  };
}

function makeFamilyQuestions(config, familyIndex) {
  const openIndices = new Set([0, 6, 12, 18, 24]);
  let openSlot = 0;
  const items = [];

  for (let localIndex = 0; localIndex < questionsPerFamily; localIndex += 1) {
    if (openIndices.has(localIndex)) {
      items.push(makeOpen(config, familyIndex, localIndex, openSlot));
      openSlot += 1;
    } else {
      items.push(makeMultipleChoice(config, familyIndex, localIndex));
    }
  }

  return items;
}

const questions = familyConfigs.flatMap((config, familyIndex) =>
  makeFamilyQuestions(config, familyIndex)
);

const scenarioSet = new Set();
const normalizedSet = new Set();

for (const question of questions) {
  const normalized = question.scenario
    .toLowerCase()
    .replace(/^open vraag \d+:\s*/, "")
    .replace(/^vraag \d+:\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

  if (scenarioSet.has(question.scenario)) {
    throw new Error(`Exact duplicate scenario found: ${question.scenario}`);
  }
  if (normalizedSet.has(normalized)) {
    throw new Error(`Normalized duplicate scenario found: ${question.scenario}`);
  }

  scenarioSet.add(question.scenario);
  normalizedSet.add(normalized);
}

const output = `window.questionBank = ${JSON.stringify(questions, null, 2)};\n`;
fs.writeFileSync(path.join(root, "questions.js"), output, "utf8");
console.log(`Generated ${questions.length} questions.`);
