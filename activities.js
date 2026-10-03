/* ============================================================
   E-HISTORY — MINI ACTIVITY ENGINE
   ============================================================
   QUICK MAP
   1. ACTIVITY_DATA — content for all 9 mini activities
   2. Current activity page / DOM references
   3. Language and prerequisite helpers
   4. Activity rendering
   5. Answer and feedback logic
   6. Completion / score saving
   7. Language re-rendering
   8. Initial access check

   EDITING TIP:
   Most activity content changes belong inside ACTIVITY_DATA.
   ============================================================ */

/* ==================== 1. ACTIVITY CONTENT DATABASE ==================== */

const ACTIVITY_DATA = {
    "l1a1": {
        "title": [
            "Pag-uuri: Simbolismo, Tradisyon, o Kuwentong-bayan",
            "Classification: Symbolism, Tradition, or Folklore"
        ],
        "instruction": [
            "Piliin ang tamang kategorya para sa bawat halimbawa.",
            "Choose the correct category for each example."
        ],
        "choices": [
            [
                "symbolism",
                "Simbolismo",
                "Symbolism"
            ],
            [
                "tradition",
                "Tradisyon",
                "Tradition"
            ],
            [
                "folklore",
                "Kuwentong-bayan",
                "Folklore"
            ]
        ],
        "items": [
            [
                "Watawat ng Pilipinas",
                "Philippine Flag",
                "symbolism",
                "Ang watawat ay sagisag ng pagkakakilanlan at kasaysayan.",
                "The flag is a symbol of identity and history."
            ],
            [
                "Bantayog ng isang bayani",
                "Monument to a hero",
                "symbolism",
                "Ang bantayog ay isang sagisag na nagpapanatili ng alaala.",
                "A monument is a symbol that preserves memory."
            ],
            [
                "Kaugaliang ipinapasa sa bawat henerasyon",
                "A custom passed through generations",
                "tradition",
                "Ang kaugaliang naipapasa sa henerasyon ay tradisyon.",
                "A custom passed through generations is a tradition."
            ],
            [
                "Pagdiriwang ng tradisyunal na pista ng pamayanan",
                "A community’s traditional festival",
                "tradition",
                "Ang patuloy na gawaing pangkultura ay halimbawa ng tradisyon.",
                "A continuing cultural practice is an example of tradition."
            ],
            [
                "Alamat",
                "Legend",
                "folklore",
                "Ang alamat ay isang anyo ng kuwentong-bayan.",
                "A legend is a form of folklore."
            ],
            [
                "Epiko",
                "Epic",
                "folklore",
                "Ang epiko ay kabilang sa kuwentong-bayan at tradisyong pasalita.",
                "An epic belongs to folklore and oral tradition."
            ]
        ]
    },
    "l1a2": {
        "title": [
            "May Kamalayang Pangkasaysayan o Wala?",
            "Historically Conscious or Not?"
        ],
        "instruction": [
            "Suriin ang sitwasyon at tukuyin kung nagpapakita ito ng kamalayang pangkasaysayan.",
            "Analyze the situation and decide whether it demonstrates historical consciousness."
        ],
        "choices": [
            [
                "aware",
                "May Kamalayang Pangkasaysayan",
                "Demonstrates Historical Consciousness"
            ],
            [
                "not",
                "Hindi Nagpapakita",
                "Does Not Demonstrate It"
            ]
        ],
        "items": [
            [
                "Inihahambing ni Ana ang iba’t ibang batis bago maniwala sa isang historical post.",
                "Ana compares different sources before believing a historical post.",
                "aware",
                "Mapanuri at gumagamit siya ng iba’t ibang batis.",
                "She is critical and uses multiple sources."
            ],
            [
                "Sinulatan ni Marco ang lumang bantayog dahil wala raw itong halaga.",
                "Marco wrote on an old monument because he thinks it has no value.",
                "not",
                "Hindi nito pinahahalagahan ang pamanang pangkasaysayan.",
                "This does not value historical heritage."
            ],
            [
                "Iniuugnay ni Lea ang dating desisyon ng komunidad sa kalagayan nito ngayon.",
                "Lea connects a past community decision with its present condition.",
                "aware",
                "Iniuugnay niya ang nakaraan at kasalukuyan.",
                "She connects the past and present."
            ],
            [
                "Sabi ni Paulo, hindi na mahalaga ang tradisyon dahil moderno na ang panahon.",
                "Paulo says traditions no longer matter because society is modern.",
                "not",
                "Ang pagwawalang-halaga sa tradisyon ay hindi wastong kamalayang pangkasaysayan.",
                "Dismissing tradition does not demonstrate sound historical consciousness."
            ],
            [
                "Tumulong si Mia sa pangangalaga ng isang makasaysayang lugar.",
                "Mia helped preserve a historical site.",
                "aware",
                "Pinahahalagahan niya ang pamanang kultural at aktibong nakikilahok.",
                "She values cultural heritage and participates actively."
            ],
            [
                "Agad ibinahagi ni Carlo ang isang historical claim nang hindi sinusuri ang ibang batis.",
                "Carlo immediately shared a historical claim without checking other sources.",
                "not",
                "Kailangang maging mapanuri sa impormasyon.",
                "Historical information should be examined critically."
            ]
        ]
    },
    "l1a3": {
        "title": [
            "Aral ng Nakaraan, Pasya sa Kasalukuyan",
            "Lessons from the Past, Decisions in the Present"
        ],
        "instruction": [
            "Piliin ang pasyang pinakamahusay na gumagamit ng aral mula sa nakaraan.",
            "Choose the decision that best applies a lesson from the past."
        ],
        "choices": [
            [
                "A",
                "Pasya A",
                "Decision A"
            ],
            [
                "B",
                "Pasya B",
                "Decision B"
            ],
            [
                "C",
                "Pasya C",
                "Decision C"
            ]
        ],
        "items": [
            [
                "May lumang pook na nais gibain para sa bagong gusali. Ano ang mas responsableng hakbang?",
                "An old historical site may be demolished for a new building. What is the more responsible action?",
                "B",
                "A|Gibain agad dahil luma na.|Demolish it immediately because it is old.;B|Suriin muna ang kahalagahang pangkasaysayan at humanap ng paraang mapangalagaan ito.|Assess its historical value first and look for ways to preserve it.;C|Huwag pansinin ang usapin.|Ignore the issue.",
                "Ang pag-aaral muna sa kahalagahan ng pook ay gumagamit ng kamalayang pangkasaysayan.",
                "Assessing the site’s historical value first applies historical consciousness."
            ],
            [
                "May kumakalat na salungat na bersyon ng isang pangyayari. Ano ang dapat gawin?",
                "Conflicting versions of an event are circulating. What should you do?",
                "C",
                "A|Piliin ang pinaka-popular na bersyon.|Choose the most popular version.;B|Paniwalaan ang unang nabasa.|Believe the first version you read.;C|Ihambing ang mga batis at konteksto bago bumuo ng konklusyon.|Compare sources and context before forming a conclusion.",
                "Ang paghahambing ng batis ay mapanuring paggamit ng kasaysayan.",
                "Comparing sources is a critical use of history."
            ],
            [
                "May tradisyong hindi na nauunawaan ng kabataan. Ano ang mabuting tugon?",
                "Young people no longer understand a community tradition. What is a good response?",
                "A",
                "A|Alamin ang pinagmulan at kahulugan bago magpasya kung paano ito ipagpapatuloy.|Learn its origin and meaning before deciding how it should continue.;B|Itigil agad dahil luma na.|Stop it immediately because it is old.;C|Kopyahin lamang nang walang pag-unawa.|Copy it without understanding.",
                "Mahalagang maunawaan ang konteksto ng tradisyon.",
                "It is important to understand the context of a tradition."
            ],
            [
                "Nagkaroon noon ng problemang dulot ng maling impormasyon. Ano ang aral para sa kasalukuyan?",
                "A past problem was worsened by misinformation. What lesson applies today?",
                "B",
                "A|Magbahagi agad ng anumang post.|Share any post immediately.;B|Beripikahin ang impormasyon bago ito ibahagi.|Verify information before sharing it.;C|Iwasan ang lahat ng balita.|Avoid all news.",
                "Ang aral ng nakaraan ay maaaring gumabay sa mas responsableng desisyon ngayon.",
                "Lessons from the past can guide more responsible decisions today."
            ],
            [
                "Nais ng barangay na gumawa ng bagong monumento. Ano ang dapat isaalang-alang?",
                "A barangay wants to create a new monument. What should be considered?",
                "C",
                "A|Presyo lamang.|Only the price.;B|Kulay lamang.|Only the color.;C|Ang makasaysayang kahulugan at kung ano ang kinakatawan nito.|Its historical meaning and what it represents.",
                "Ang monumento ay simbolong may kahulugang pangkasaysayan.",
                "A monument is a symbol with historical meaning."
            ],
            [
                "May desisyong pampamayanan na kahawig ng isang dating pagkakamali. Ano ang pinakamainam?",
                "A community decision resembles a past mistake. What is best?",
                "A",
                "A|Suriin ang nangyari noon upang maiwasang maulit ang parehong pagkakamali.|Study what happened before to avoid repeating the same mistake.;B|Balewalain ang nakaraan.|Ignore the past.;C|Ulitin ang dating paraan nang walang pagsusuri.|Repeat the old approach without analysis.",
                "Ginagamit dito ang aral ng nakaraan bilang gabay sa kasalukuyan.",
                "Here, a lesson from the past guides present decision-making."
            ]
        ]
    },
    "l2a1": {
        "title": [
            "Ilaya o Ilawod?",
            "Ilaya or Ilawod?"
        ],
        "instruction": [
            "Tukuyin kung ang halimbawa ay mas nauugnay sa Ilaya o Ilawod.",
            "Identify whether each example is more closely related to Ilaya or Ilawod."
        ],
        "choices": [
            [
                "ilaya",
                "Ilaya",
                "Ilaya"
            ],
            [
                "ilawod",
                "Ilawod",
                "Ilawod"
            ]
        ],
        "items": [
            [
                "Kabundukan at burol",
                "Mountains and hills",
                "ilaya",
                "Ang Ilaya ay nauugnay sa mataas na lugar.",
                "Ilaya is associated with highland areas."
            ],
            [
                "Pagtatanim, pangangaso, at pag-aalaga ng hayop",
                "Farming, hunting, and animal raising",
                "ilaya",
                "Ito ang karaniwang kabuhayan sa Ilaya.",
                "These are common livelihoods in Ilaya."
            ],
            [
                "Baybayin at dalampasigan",
                "Coastal areas and seashores",
                "ilawod",
                "Ang Ilawod ay nasa mababang lupa at malapit sa tubig.",
                "Ilawod is in lowlands and near water."
            ],
            [
                "Pangingisda at paggawa ng bangka",
                "Fishing and boat making",
                "ilawod",
                "Ito ang karaniwang kabuhayan sa Ilawod.",
                "These are common livelihoods in Ilawod."
            ],
            [
                "Pamayanang upstream ng ilog",
                "Community upstream of a river",
                "ilaya",
                "Ang salitang Ilaya ay tumutukoy sa itaas o upstream.",
                "Ilaya refers to the upper or upstream area."
            ],
            [
                "Pamayanang nasa tabing-dagat",
                "Community by the sea",
                "ilawod",
                "Ang Ilawod ay nauugnay sa tabing-dagat o dalampasigan.",
                "Ilawod is associated with coastal or seashore communities."
            ]
        ]
    },
    "l2a2": {
        "title": [
            "Kilalanin ang Pamayanan at Konsepto",
            "Identify the Community and Concept"
        ],
        "instruction": [
            "Piliin ang konseptong inilalarawan.",
            "Choose the concept being described."
        ],
        "choices": [
            [
                "A",
                "A",
                "A"
            ],
            [
                "B",
                "B",
                "B"
            ],
            [
                "C",
                "C",
                "C"
            ],
            [
                "D",
                "D",
                "D"
            ]
        ],
        "items": [
            [
                "Katutubong pangkat sa kabundukan ng Cordillera.",
                "Indigenous group in the Cordillera highlands.",
                "A",
                "A|Igorot|Igorot;B|Badjao|Badjao;C|Moro|Moro;D|Binukot|Binukot",
                "Igorot ang pangkat na naninirahan sa kabundukan ng Cordillera.",
                "The Igorot live in the Cordillera highlands."
            ],
            [
                "Tradisyong inaalagaan at inihihiwalay ang isang dalaga; mula sa salitang “bukot.”",
                "Tradition in which a young woman is cared for and secluded; from the word “bukot.”",
                "D",
                "A|Vinta|Vinta;B|Bangsa|Bangsa;C|Badjao|Badjao;D|Binukot|Binukot",
                "Binukot ang tradisyong inilalarawan.",
                "The described tradition is Binukot."
            ],
            [
                "Makukulay na bangka na sumasalamin sa kultura ng Moro.",
                "Colorful boats reflecting Moro culture.",
                "B",
                "A|Lepa-lepa|Lepa-lepa;B|Vinta|Vinta;C|Bukot|Bukot;D|Hilot|Hilot",
                "Vinta ang makukulay na bangka.",
                "Vinta is the colorful boat."
            ],
            [
                "Tawag sa bangkang bahay ng Badjao.",
                "Term for the Badjao houseboat.",
                "C",
                "A|Vinta|Vinta;B|Bangsa|Bangsa;C|Lepa-lepa|Lepa-lepa;D|Asammal|Asammal",
                "Lepa-lepa ang tawag sa bangkang bahay.",
                "Lepa-lepa is the term for the houseboat."
            ],
            [
                "Konsepto ng pagkabansa na naging sentro ng pangarap ng Moro.",
                "Concept of nationhood central to Moro aspirations.",
                "A",
                "A|Bangsa|Bangsa;B|Ilawod|Ilawod;C|Akalummuh|Akalummuh;D|Bukot|Bukot",
                "Bangsa ang konsepto ng pagkabansa.",
                "Bangsa is the concept of nationhood."
            ],
            [
                "Kilala bilang sea gypsies at nomadic people.",
                "Known as sea gypsies and nomadic people.",
                "D",
                "A|Igorot|Igorot;B|Binukot|Binukot;C|Moro|Moro;D|Badjao|Badjao",
                "Badjao ang kilala bilang sea gypsies.",
                "The Badjao are known as sea gypsies."
            ]
        ]
    },
    "l2a3": {
        "title": [
            "Kultura at Heograpiya: Iugnay ang Konsepto",
            "Culture and Geography: Connect the Concept"
        ],
        "instruction": [
            "Piliin ang tamang kahulugan o ugnayan ng bawat termino.",
            "Choose the correct meaning or relationship for each term."
        ],
        "choices": [
            [
                "A",
                "A",
                "A"
            ],
            [
                "B",
                "B",
                "B"
            ],
            [
                "C",
                "C",
                "C"
            ]
        ],
        "items": [
            [
                "Lindur amdam",
                "Lindur amdam",
                "B",
                "A|Makukulay na bangka|Colorful boat;B|Patuloy na pag-iyak ng mga kamag-anak sa pagkamatay ng mahal sa buhay|Continued crying of relatives after a loved one’s death;C|Konsepto ng pagkabansa|Concept of nationhood",
                "Ito ang kahulugan ng Lindur amdam.",
                "This is the meaning of Lindur amdam."
            ],
            [
                "Akalummuh",
                "Akalummuh",
                "C",
                "A|Digmaan sa dagat|Sea war;B|Bangkang bahay|Houseboat;C|Pagpapahalaga sa pagiging dalisay ng babae bago ikasal|Valuing a woman’s purity before marriage",
                "Akalummuh ang pagpapahalagang ito.",
                "This value is Akalummuh."
            ],
            [
                "Asammal",
                "Asammal",
                "A",
                "A|Hindi pagsunod sa pagpapahalagang Akalummuh|Failure to follow the value of Akalummuh;B|Makukulay na bangka|Colorful boat;C|Tradisyon ng Binukot|Binukot tradition",
                "Asammal ang hindi pagsunod sa pagpapahalagang ito.",
                "Asammal is the failure to follow this value."
            ],
            [
                "Guerras Peraticas / The Sulu Zone",
                "Guerras Peraticas / The Sulu Zone",
                "B",
                "A|Pangingisda ng Badjao|Badjao fishing;B|Digmaan sa dagat ng Moro at Espanyol|Sea wars between Moro and Spanish forces;C|Pag-aalaga ng hayop sa Ilaya|Animal raising in Ilaya",
                "Tumutukoy ito sa sea wars ng Moro at Espanyol.",
                "It refers to the sea wars between Moro and Spanish forces."
            ],
            [
                "Bangsa Moro",
                "Bangsa Moro",
                "C",
                "A|Cordillera Tribe|Cordillera Tribe;B|Islamic boat|Islamic boat;C|Moro Nation o Moro People|Moro Nation or Moro People",
                "Ito ang kahulugan ng Bangsa Moro.",
                "This is the meaning of Bangsa Moro."
            ],
            [
                "Heograpiya at kabuhayan",
                "Geography and livelihood",
                "A",
                "A|Ang katangian ng lugar ay nakaaapekto sa mga gawaing maaaring pagkakitaan.|The characteristics of a place affect possible livelihoods.;B|Walang epekto ang lokasyon sa kabuhayan.|Location has no effect on livelihood.;C|Pare-pareho ang kabuhayan sa lahat ng lugar.|Livelihood is the same everywhere.",
                "Ipinakikita nito ang ugnayan ng heograpiya at kultura/kabuhayan.",
                "This shows the relationship between geography and culture/livelihood."
            ]
        ]
    },
    "l3a1": {
        "title": [
            "Hiyas, Anting-anting, o Ginhawa?",
            "Hiyas, Anting-anting, or Ginhawa?"
        ],
        "instruction": [
            "Tukuyin ang konseptong inilalarawan.",
            "Identify the concept being described."
        ],
        "choices": [
            [
                "hiyas",
                "Hiyas",
                "Hiyas"
            ],
            [
                "anting",
                "Anting-anting",
                "Anting-anting"
            ],
            [
                "ginhawa",
                "Ginhawa",
                "Ginhawa"
            ]
        ],
        "items": [
            [
                "Alahas na nagsisilbing palamuti at simbolo ng katayuan.",
                "Jewelry used as adornment and a symbol of status.",
                "hiyas",
                "Ito ay Hiyas.",
                "This is Hiyas."
            ],
            [
                "Bagay na pinaniniwalaang nagbibigay ng proteksiyon o suwerte.",
                "An object believed to give protection or luck.",
                "anting",
                "Ito ay Anting-anting o agimat.",
                "This is an Anting-anting or agimat."
            ],
            [
                "Balanseng kalagayan ng katawan, isip, at damdamin.",
                "A balanced state of body, mind, and emotions.",
                "ginhawa",
                "Ito ang konsepto ng Ginhawa.",
                "This is the concept of Ginhawa."
            ],
            [
                "Isang palamuti na maaari ring magpahiwatig ng katayuan sa lipunan.",
                "An adornment that may also indicate social status.",
                "hiyas",
                "Hiyas ang konseptong inilalarawan.",
                "The concept described is Hiyas."
            ],
            [
                "Isang bagay na isinusuot o iniingatan dahil pinaniniwalaang may proteksiyon.",
                "An object worn or kept because it is believed to offer protection.",
                "anting",
                "Anting-anting ang inilalarawan.",
                "The item described is an Anting-anting."
            ],
            [
                "Kaginhawaan na hindi lamang pisikal kundi kasama ang isip at damdamin.",
                "Well-being that includes not only the body but also the mind and emotions.",
                "ginhawa",
                "Ginhawa ang balanseng kalagayang ito.",
                "This balanced condition is Ginhawa."
            ]
        ]
    },
    "l3a2": {
        "title": [
            "Tradisyonal na Pagpapagaling",
            "Traditional Healing Challenge"
        ],
        "instruction": [
            "Piliin ang tradisyonal na paraan o taong inilalarawan.",
            "Choose the traditional healing method or person being described."
        ],
        "choices": [
            [
                "A",
                "A",
                "A"
            ],
            [
                "B",
                "B",
                "B"
            ],
            [
                "C",
                "C",
                "C"
            ],
            [
                "D",
                "D",
                "D"
            ]
        ],
        "items": [
            [
                "Katutubong manggagamot o espiritwal na pinuno na gumagamit ng halamang gamot, ritwal, at panalangin.",
                "Indigenous healer or spiritual leader using medicinal plants, rituals, and prayer.",
                "A",
                "A|Baylan|Baylan;B|Hilot|Hilot;C|Tawas|Tawas;D|Pausok|Pausok",
                "Baylan ang inilalarawan.",
                "The person described is a Baylan."
            ],
            [
                "Paraan ng pagpapagaling na gumagamit ng laway.",
                "Healing method that uses saliva.",
                "B",
                "A|Kamangyan|Kamangyan;B|Tutho|Tutho;C|Hilot|Hilot;D|Tawas|Tawas",
                "Tutho ang gumagamit ng laway.",
                "Tutho uses saliva."
            ],
            [
                "Gumagamit ng masahe, paghaplos, at pagmamanipula ng katawan.",
                "Uses massage, stroking, and body manipulation.",
                "C",
                "A|Pausok|Pausok;B|Tawas|Tawas;C|Hilot|Hilot;D|Tutho|Tutho",
                "Hilot ang inilalarawan.",
                "The method described is Hilot."
            ],
            [
                "Tradisyonal na pagtukoy sa pinaniniwalaang sanhi ng karamdaman gamit ang materyal na sinusuri pagkatapos.",
                "Traditional way of identifying a believed cause of illness using a material examined afterward.",
                "D",
                "A|Baylan|Baylan;B|Kamangyan|Kamangyan;C|Pausok|Pausok;D|Tawas|Tawas",
                "Tawas ang inilalarawan.",
                "The method described is Tawas."
            ],
            [
                "Gumagamit ng usok mula sa sinusunog na halamang gamot, dahon, o iba pang materyales.",
                "Uses smoke from burned medicinal plants, leaves, or other materials.",
                "A",
                "A|Pausok|Pausok;B|Hilot|Hilot;C|Tutho|Tutho;D|Tawas|Tawas",
                "Pausok ang gumagamit ng usok bilang bahagi ng ritwal o pagpapagaling.",
                "Pausok uses smoke as part of ritual or healing."
            ],
            [
                "Mabangong dagta o resin na sinusunog upang makalikha ng mabangong usok.",
                "Fragrant resin burned to create aromatic smoke.",
                "B",
                "A|Tutho|Tutho;B|Kamangyan|Kamangyan;C|Hilot|Hilot;D|Baylan|Baylan",
                "Kamangyan ang mabangong dagta o resin.",
                "Kamangyan is the fragrant resin."
            ]
        ]
    },
    "l3a3": {
        "title": [
            "Buhay, Kabilang-Buhay, o Pagpapagaling?",
            "Life, Afterlife, or Healing?"
        ],
        "instruction": [
            "Ilagay ang konsepto sa tamang dimensyon o kategorya.",
            "Place the concept in the correct dimension or category."
        ],
        "choices": [
            [
                "life",
                "Dimensyon ng Buhay",
                "Dimension of Life"
            ],
            [
                "afterlife",
                "Dimensyon ng Kabilang-Buhay",
                "Dimension of the Afterlife"
            ],
            [
                "healing",
                "Tradisyonal na Pagpapagaling",
                "Traditional Healing"
            ]
        ],
        "items": [
            [
                "Hiyas",
                "Hiyas",
                "life",
                "Kabilang ang Hiyas sa Dimensyon ng Buhay.",
                "Hiyas belongs to the Dimension of Life."
            ],
            [
                "Anting-anting",
                "Anting-anting",
                "life",
                "Kabilang ang Anting-anting sa Dimensyon ng Buhay.",
                "Anting-anting belongs to the Dimension of Life."
            ],
            [
                "Ginhawa",
                "Ginhawa",
                "life",
                "Kabilang ang Ginhawa sa Dimensyon ng Buhay.",
                "Ginhawa belongs to the Dimension of Life."
            ],
            [
                "Paniniwala na nagpapatuloy ang paglalakbay ng kaluluwa matapos ang kamatayan",
                "Belief that the soul’s journey continues after death",
                "afterlife",
                "Ito ay Paniniwala sa Kabilang-Buhay.",
                "This is a belief in the afterlife."
            ],
            [
                "Hilot",
                "Hilot",
                "healing",
                "Ang Hilot ay tradisyonal na paraan ng pagpapagaling.",
                "Hilot is a traditional healing method."
            ],
            [
                "Kamangyan",
                "Kamangyan",
                "healing",
                "Ginagamit ang Kamangyan sa tradisyonal na ritwal o pagpapagaling.",
                "Kamangyan is used in traditional ritual or healing."
            ]
        ]
    }
};

/* ==================== 2. CURRENT ACTIVITY PAGE / DOM REFERENCES ==================== */

const activityKey = document.body.dataset.page;
const A = ACTIVITY_DATA[activityKey];

const shell = document.getElementById('activityShell');
const lock = document.getElementById('activityLock');
const promptEl = document.getElementById('activityPrompt');
const optionsEl = document.getElementById('activityOptions');
const counterEl = document.getElementById('activityCounter');
const scoreEl = document.getElementById('activityScore');
const progressEl = document.getElementById('activityProgress');
const feedback = document.getElementById('activityFeedback');
const feedbackIcon = document.getElementById('feedbackIcon');
const feedbackTitle = document.getElementById('feedbackTitle');
const feedbackText = document.getElementById('feedbackText');
const nextBtn = document.getElementById('activityNext');
const result = document.getElementById('activityResult');
const finalScore = document.getElementById('activityFinalScore');
const retry = document.getElementById('activityRetry');
const numberEl = document.getElementById('activityNumber');

let idx = 0;
let score = 0;
let answered = false;
let selected = null;


/* ==================== 3. LANGUAGE / PREREQUISITE HELPERS ==================== */

function currentLang() {
    return localStorage.getItem('ehistory-language') || 'FIL';
}

/*
   Canonical progress storage format:
   l1a1 (page id) -> l1-a1 (storage id)

   This keeps activity progress consistent with lesson.html, progress.html,
   account pages, the exam prerequisite checker, and Firebase synchronization.
*/
function activityStorageId() {
    const match = activityKey.match(/l(\d)a(\d)/);

    if (!match) {
        return activityKey;
    }

    return `l${match[1]}-a${match[2]}`;
}

const storageActivityKey = activityStorageId();

function prerequisite() {
    const match = activityKey.match(/l(\d)a(\d)/);

    if (!match) {
        return true;
    }

    const lessonNumber = Number(match[1]);
    const activityNumber = Number(match[2]);

    // Activity 1 of Lesson 1 is always available.
    // Activity 1 of later lessons requires the previous assessment.
    if (activityNumber === 1) {
        if (lessonNumber === 1) {
            return true;
        }

        if (lessonNumber === 2) {
            return localStorage.getItem('ehistory-assessment-1-completed') === 'true';
        }

        if (lessonNumber === 3) {
            return localStorage.getItem('ehistory-assessment-2-completed') === 'true';
        }
    }

    // Activity 2 and 3 require the previous activity in the same lesson.
    return (
        localStorage.getItem(
            `ehistory-l${lessonNumber}-a${activityNumber - 1}-completed`
        ) === 'true'
    );
}

function parseCustom(customString, language) {
    if (!customString) {
        return null;
    }

    return customString.split(';').map((entry) => {
        const [key, fil, en] = entry.split('|');

        return {
            key,
            label: language === 'FIL' ? fil : en
        };
    });
}


/* ==================== 4. ACTIVITY RENDERING ==================== */

function render(reset = true) {
    if (!A || !shell) {
        return;
    }

    const language = currentLang();
    const item = A.items[idx];

    // Question / prompt.
    promptEl.textContent = language === 'FIL' ? item[0] : item[1];

    // Counters.
    counterEl.textContent = `${idx + 1} / ${A.items.length}`;
    scoreEl.textContent = score;
    numberEl.textContent =
        (language === 'FIL' ? 'AYTEM ' : 'ITEM ') +
        String(idx + 1).padStart(2, '0');

    progressEl.style.width = `${(idx / A.items.length) * 100}%`;

    // Some activities store custom choices inside the item itself.
    const customChoices = parseCustom(
        item[3] && String(item[3]).includes('|') ? item[3] : null,
        language
    );

    optionsEl.innerHTML = '';

    const choices =
        customChoices ||
        A.choices.map((choice) => ({
            key: choice[0],
            label: language === 'FIL' ? choice[1] : choice[2]
        }));

    choices.forEach((choice) => {
        const button = document.createElement('button');
        button.className = 'classification-option';
        button.dataset.answer = choice.key;

        const optionMark =
            choice.key.length <= 2 ? choice.key.toUpperCase() : '•';

        button.innerHTML = `
            <span class="option-letter">${optionMark}</span>
            <div>
                <strong>${choice.label}</strong>
            </div>
        `;

        button.addEventListener('click', () => answer(choice.key, button));
        optionsEl.appendChild(button);
    });

    if (reset) {
        answered = false;
        selected = null;
        feedback.className = 'activity-feedback';
        nextBtn.disabled = true;
    }
}

function correctAnswer(item) {
    return item[2];
}

function explanation(item, language) {
    const hasCustomChoices = item[3] && String(item[3]).includes('|');

    if (hasCustomChoices) {
        return language === 'FIL' ? item[4] : item[5];
    }

    return language === 'FIL' ? item[3] : item[4];
}


/* ==================== 5. ANSWER / FEEDBACK LOGIC ==================== */

function answer(key, button) {
    if (answered) {
        return;
    }

    answered = true;
    selected = key;

    const item = A.items[idx];
    const correct = correctAnswer(item);
    const isCorrect = key === correct;

    if (isCorrect) {
        score += 1;
    }

    scoreEl.textContent = score;

    // Disable choices and reveal the correct answer.
    [...optionsEl.children].forEach((optionButton) => {
        optionButton.disabled = true;

        if (optionButton.dataset.answer === correct) {
            optionButton.classList.add('correct');
        }

        if (optionButton === button && !isCorrect) {
            optionButton.classList.add('incorrect');
        }
    });

    feedback.className =
        `activity-feedback show ${isCorrect ? 'correct' : 'incorrect'}`;

    feedbackIcon.textContent = isCorrect ? '✓' : '!';

    feedbackTitle.textContent =
        currentLang() === 'FIL'
            ? isCorrect
                ? 'Tama!'
                : 'Balikan natin ito.'
            : isCorrect
              ? 'Correct!'
              : 'Review this item.';

    feedbackText.textContent = explanation(item, currentLang());
    nextBtn.disabled = false;
}


/* ==================== 6. COMPLETION / SCORE SAVING ==================== */

function finish() {
    shell.style.display = 'none';
    result.classList.add('show');

    finalScore.textContent = `${score} / ${A.items.length}`;

    // Current completion/score.
    localStorage.setItem(`ehistory-${storageActivityKey}-completed`, 'true');
    localStorage.setItem(`ehistory-${storageActivityKey}-score`, String(score));

    // Best score.
    const oldBest = Number(
        localStorage.getItem(`ehistory-${storageActivityKey}-best`) || 0
    );

    if (score > oldBest) {
        localStorage.setItem(`ehistory-${storageActivityKey}-best`, String(score));
    }

    window.dispatchEvent(new Event('ehistory:progresschange'));
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        if (!answered) {
            return;
        }

        if (idx < A.items.length - 1) {
            idx += 1;
            render();
        } else {
            finish();
        }
    });
}

if (retry) {
    retry.addEventListener('click', () => {
        idx = 0;
        score = 0;

        result.classList.remove('show');
        shell.style.display = 'block';
        render();
    });
}


/* ==================== 7. LANGUAGE RE-RENDERING ==================== */

window.addEventListener('ehistory:languagechange', () => {
    if (!A || !shell || shell.style.display === 'none') {
        return;
    }

    const item = A.items[idx];
    const language = currentLang();

    promptEl.textContent = language === 'FIL' ? item[0] : item[1];

    if (!answered) {
        // Recreate untranslated choices without resetting score/progress.
        render(false);
    } else {
        // Preserve the answered state, but translate feedback text.
        feedbackText.textContent = explanation(item, language);

        const selectedWasCorrect = selected === correctAnswer(item);

        feedbackTitle.textContent =
            language === 'FIL'
                ? selectedWasCorrect
                    ? 'Tama!'
                    : 'Balikan natin ito.'
                : selectedWasCorrect
                  ? 'Correct!'
                  : 'Review this item.';
    }
});


/* ==================== 8. INITIAL ACCESS CHECK ==================== */

if (A) {
    if (prerequisite()) {
        lock.style.display = 'none';
        shell.style.display = 'block';
        render();
    } else {
        lock.style.display = 'block';
        shell.style.display = 'none';
    }
}
