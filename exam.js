/* ============================================================
   E-HISTORY — PHASE 9 TERM EXAMINATION ENGINE
   ============================================================
   SOURCE:
   - TERM-EXAM-KASAYSAYAN.docx
   - 60 source questions
   - Official answer key preserved exactly
   - Item 33 has three choices because the source document itself
     provides A–C only.

   QUICK MAP
   1. Exam question database
   2. DOM references / state
   3. Access and storage helpers
   4. Question / navigator rendering
   5. Answer handling
   6. Submission / scoring
   7. Result / retry
   8. Language synchronization
   9. Initialization
   ============================================================ */


/* ==================== 1. EXAM QUESTION DATABASE ==================== */

const TERM_EXAM_DATA = [
    {
        "number": 1,
        "fil": "Basahin ang sitwasyon:\nAng Pamayanan A ay nasa mataas na lugar malapit sa kabundukan. Ang mga residente ay nagtatanim, nangangaso, at nag-aalaga ng hayop. Ang Pamayanan B naman ay nasa baybayin at umaasa sa yamang-dagat. Ano ang pinakamainam na pagsusuri sa dalawang pamayanan?",
        "en": "Read the situation:\nCommunity A is located in a high area near the mountains. Residents farm, hunt, and raise animals. Community B is on the coast and depends on marine resources. What is the best analysis of the two communities?",
        "choices": [
            {
                "letter": "A",
                "fil": "Pareho silang Ilaya dahil pareho silang may kabuhayan.",
                "en": "Both are Ilaya because both have livelihoods."
            },
            {
                "letter": "B",
                "fil": "Ang A ay mas maituturing na Ilaya habang ang B ay mas maituturing na Ilawod.",
                "en": "A is better considered Ilaya, while B is better considered Ilawod."
            },
            {
                "letter": "C",
                "fil": "Ang A ay Ilawod dahil malapit sa kabundukan.",
                "en": "A is Ilawod because it is near the mountains."
            },
            {
                "letter": "D",
                "fil": "Ang B ay Ilaya dahil may likas na yaman.",
                "en": "B is Ilaya because it has natural resources."
            }
        ],
        "answer": "B"
    },
    {
        "number": 2,
        "fil": "Isang mag-aaral ang gumawa ng diagram na nagpapakita ng: Baybayin → Pangingisda → Paggawa ng Bangka → Pangangalakal. Anong konsepto ang pinakamalinaw na ipinakikita ng diagram?",
        "en": "A student made a diagram showing: Coast → Fishing → Boat Making → Trade. What concept is most clearly shown by the diagram?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ang lokasyon at likas na kapaligiran ay maaaring maiugnay sa kabuhayan.",
                "en": "Location and the natural environment can be related to livelihood."
            },
            {
                "letter": "B",
                "fil": "Ang lahat ng kabuhayan ay nagmumula sa kabundukan.",
                "en": "All livelihoods come from the mountains."
            },
            {
                "letter": "C",
                "fil": "Ang relihiyon ang tanging batayan ng kabuhayan.",
                "en": "Religion is the only basis of livelihood."
            },
            {
                "letter": "D",
                "fil": "Ang kultura ay hindi nagbabago.",
                "en": "Culture does not change."
            }
        ],
        "answer": "A"
    },
    {
        "number": 3,
        "fil": "Basahin ang dalawang pahayag:\nI. Ang Islam ay may malaking impluwensiya sa kultura ng Moro.\nII. Ang lahat ng etnikong grupo ng Moro ay walang sariling pagkakaiba.\nAno ang tamang pagsusuri?",
        "en": "Read the two statements:\nI. Islam has a major influence on Moro culture.\nII. All Moro ethnic groups have no differences of their own.\nWhat is the correct analysis?",
        "choices": [
            {
                "letter": "A",
                "fil": "Parehong tama ang I at II.",
                "en": "Both I and II are correct."
            },
            {
                "letter": "B",
                "fil": "Parehong mali ang I at II.",
                "en": "Both I and II are incorrect."
            },
            {
                "letter": "C",
                "fil": "Tama ang I ngunit mali ang II.",
                "en": "I is correct, but II is incorrect."
            },
            {
                "letter": "D",
                "fil": "Mali ang I ngunit tama ang II.",
                "en": "I is incorrect, but II is correct."
            }
        ],
        "answer": "C"
    },
    {
        "number": 4,
        "fil": "Ihambing ang Igorot at Badjao. Aling obserbasyon ang pinakamahusay na nagpapakita ng ugnayan ng heograpiya at kultura?",
        "en": "Compare the Igorot and Badjao. Which observation best shows the relationship between geography and culture?",
        "choices": [
            {
                "letter": "A",
                "fil": "Pareho silang may tradisyon kaya pareho rin ang kanilang kabuhayan.",
                "en": "Both have traditions, so they also have the same livelihood."
            },
            {
                "letter": "B",
                "fil": "Ang lokasyon ng kanilang pamayanan ay may kaugnayan sa uri ng kabuhayan at pamumuhay na kanilang nalinang.",
                "en": "The location of their communities is related to the type of livelihood and way of life they developed."
            },
            {
                "letter": "C",
                "fil": "Ang kanilang kultura ay hindi kailanman naiimpluwensiyahan ng kapaligiran.",
                "en": "Their cultures are never influenced by the environment."
            },
            {
                "letter": "D",
                "fil": "Ang lahat ng pangkat etniko ay dapat magkaroon ng parehong kabuhayan.",
                "en": "All ethnic groups should have the same livelihood."
            }
        ],
        "answer": "B"
    },
    {
        "number": 5,
        "fil": "Si Juan ay nagsabi, “Ang kultura ay hindi naaapektuhan ng lokasyon dahil pareho lamang ang pangangailangan ng tao.” Alin ang pinakamainam na pagsusuri?",
        "en": "Juan said, “Culture is not affected by location because people have the same needs.” What is the best analysis?",
        "choices": [
            {
                "letter": "A",
                "fil": "Tama, dahil walang epekto ang kapaligiran sa kabuhayan.",
                "en": "Correct, because the environment has no effect on livelihood."
            },
            {
                "letter": "B",
                "fil": "Mali, dahil maaaring makaapekto ang kapaligiran sa kabuhayan at paraan ng pamumuhay.",
                "en": "Incorrect, because the environment can affect livelihood and way of life."
            },
            {
                "letter": "C",
                "fil": "Tama, dahil ang kultura ay nakabatay lamang sa relihiyon.",
                "en": "Correct, because culture is based only on religion."
            },
            {
                "letter": "D",
                "fil": "Mali, dahil ang kultura ay nakabatay lamang sa teknolohiya.",
                "en": "Incorrect, because culture is based only on technology."
            }
        ],
        "answer": "B"
    },
    {
        "number": 6,
        "fil": "Bakit maaaring magkaroon ng magkakaibang kaugalian ang mga pangkat na parehong naninirahan sa Pilipinas?",
        "en": "Why can groups living in the same country, the Philippines, have different customs?",
        "choices": [
            {
                "letter": "A",
                "fil": "Dahil magkakaiba ang kanilang karanasan, kapaligiran, kasaysayan, at tradisyon.",
                "en": "Because their experiences, environments, histories, and traditions differ."
            },
            {
                "letter": "B",
                "fil": "Dahil walang pagkakatulad ang mga Pilipino.",
                "en": "Because Filipinos have nothing in common."
            },
            {
                "letter": "C",
                "fil": "Dahil hindi sila bahagi ng iisang bansa.",
                "en": "Because they are not part of one country."
            },
            {
                "letter": "D",
                "fil": "Dahil ang kultura ay hindi naipapasa sa susunod na henerasyon.",
                "en": "Because culture is not passed to the next generation."
            }
        ],
        "answer": "A"
    },
    {
        "number": 7,
        "fil": "Isang pamilya ang gumagamit ng tradisyonal na bagay bilang simbolo ng proteksiyon. Sa ibang pagkakataon naman, nagsasagawa sila ng ritwal para sa isang yumao. Ano ang ipinakikita ng dalawang gawain?",
        "en": "A family uses a traditional object as a symbol of protection. At another time, they perform a ritual for a deceased person. What do these two practices show?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ang kanilang tradisyon ay walang kaugnayan sa espirituwalidad.",
                "en": "Their tradition has no connection to spirituality."
            },
            {
                "letter": "B",
                "fil": "Ang kanilang paniniwala ay nakatuon lamang sa kabuhayan.",
                "en": "Their beliefs focus only on livelihood."
            },
            {
                "letter": "C",
                "fil": "Ang kanilang paniniwala ay maaaring sumaklaw sa buhay at kabilang-buhay.",
                "en": "Their beliefs may cover both life and the afterlife."
            },
            {
                "letter": "D",
                "fil": "Ang dalawang gawain ay parehong halimbawa ng Ilawod.",
                "en": "Both practices are examples of Ilawod."
            }
        ],
        "answer": "C"
    },
    {
        "number": 8,
        "fil": "Sinabi ng isang mag-aaral na ang ginhawa ay nangangahulugan lamang na walang pisikal na sakit. Ano ang problema sa kaniyang interpretasyon?",
        "en": "A student said that ginhawa only means being free from physical pain. What is the problem with this interpretation?",
        "choices": [
            {
                "letter": "A",
                "fil": "Hindi niya isinama ang kapayapaan ng isip at damdamin sa konsepto ng ginhawa.",
                "en": "The student did not include peace of mind and emotional well-being in the concept of ginhawa."
            },
            {
                "letter": "B",
                "fil": "Masyado niyang iniugnay ang ginhawa sa komunidad.",
                "en": "The student connected ginhawa too much to the community."
            },
            {
                "letter": "C",
                "fil": "Itinuring niyang bahagi ng kabilang-buhay ang ginhawa.",
                "en": "The student considered ginhawa part of the afterlife."
            },
            {
                "letter": "D",
                "fil": "Iniugnay niya ang ginhawa sa kabuhayan ng Ilaya.",
                "en": "The student connected ginhawa to the livelihood of Ilaya."
            }
        ],
        "answer": "A"
    },
    {
        "number": 9,
        "fil": "May dalawang tradisyonal na pamamaraan: ang una ay gumagamit ng masahe at paghaplos, samantalang ang ikalawa ay gumagamit ng sinusunog na materyales upang makalikha ng usok. Ano ang wastong pagkakaiba?",
        "en": "There are two traditional methods: the first uses massage and stroking, while the second uses burned materials to produce smoke. What is the correct distinction?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ang una ay Kamangyan at ang ikalawa ay Tawas.",
                "en": "The first is Kamangyan and the second is Tawas."
            },
            {
                "letter": "B",
                "fil": "Ang una ay Tawas at ang ikalawa ay Tutho.",
                "en": "The first is Tawas and the second is Tutho."
            },
            {
                "letter": "C",
                "fil": "Ang una ay Pausok at ang ikalawa ay Hilot.",
                "en": "The first is Pausok and the second is Hilot."
            },
            {
                "letter": "D",
                "fil": "Ang una ay Hilot at ang ikalawa ay Pausok.",
                "en": "The first is Hilot and the second is Pausok."
            }
        ],
        "answer": "D"
    },
    {
        "number": 10,
        "fil": "Isang tao ang nagsagawa ng Tawas at pagkatapos ay binigyang-kahulugan ang pagbabago sa itsura nito upang matukoy ang pinaniniwalaang sanhi ng kaniyang karamdaman. Ano ang ipinakikita ng sitwasyon?",
        "en": "A person performed Tawas and then interpreted changes in its appearance to determine the believed cause of an illness. What does the situation show?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ang Tawas ay ginagamit sa tradisyonal na paraan ng pagtukoy sa pinaniniwalaang sanhi ng karamdaman.",
                "en": "Tawas is used in a traditional way to identify the believed cause of illness."
            },
            {
                "letter": "B",
                "fil": "Ang Tawas ay pangunahing paraan ng pagmamasahe.",
                "en": "Tawas is primarily a massage method."
            },
            {
                "letter": "C",
                "fil": "Ang Tawas ay ginagamit bilang bangka.",
                "en": "Tawas is used as a boat."
            },
            {
                "letter": "D",
                "fil": "Ang Tawas ay simbolo ng pagkabansa.",
                "en": "Tawas is a symbol of nationhood."
            }
        ],
        "answer": "A"
    },
    {
        "number": 11,
        "fil": "Sinabi ng isang estudyante, “Hindi na kailangang pag-aralan ang kultura ng ibang pangkat dahil hindi naman ito bahagi ng ating sariling buhay.” Alin ang pinakamainam na pagsusuri sa pahayag?",
        "en": "A student said, “There is no need to study the culture of other groups because it is not part of our own lives.” What is the best analysis of the statement?",
        "choices": [
            {
                "letter": "A",
                "fil": "Sang-ayon, dahil walang epekto ang kultura sa pagkakakilanlan.",
                "en": "Agree, because culture has no effect on identity."
            },
            {
                "letter": "B",
                "fil": "Hindi sang-ayon, dahil ang pag-unawa sa kultura ng iba ay nakatutulong sa paggalang at pag-unawa sa pagkakaiba-iba.",
                "en": "Disagree, because understanding other cultures helps develop respect and understanding of diversity."
            },
            {
                "letter": "C",
                "fil": "Sang-ayon, dahil pareho naman ang lahat ng kultura.",
                "en": "Agree, because all cultures are the same."
            },
            {
                "letter": "D",
                "fil": "Hindi sang-ayon dahil dapat palitan ang kanilang tradisyon.",
                "en": "Disagree because their traditions should be replaced."
            }
        ],
        "answer": "B"
    },
    {
        "number": 12,
        "fil": "Nais ng isang paaralan na gumawa ng cultural exhibit tungkol sa Moro at Badjao. Aling approach ang pinakaresponsable?",
        "en": "A school wants to create a cultural exhibit about the Moro and Badjao. Which approach is the most responsible?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ipakita ang kanilang kultura bilang iisang tradisyon lamang.",
                "en": "Present their cultures as only one shared tradition."
            },
            {
                "letter": "B",
                "fil": "Ipakita ang kanilang mga katangian, kabuhayan, at kultura nang may paggalang sa kanilang pagkakaiba.",
                "en": "Present their characteristics, livelihoods, and cultures while respecting their differences."
            },
            {
                "letter": "C",
                "fil": "Ipakita lamang ang mga tradisyong kakaiba sa paningin ng ibang tao.",
                "en": "Show only the traditions that seem unusual to outsiders."
            },
            {
                "letter": "D",
                "fil": "Ituon ang exhibit sa mga stereotype upang maging kawili-wili.",
                "en": "Focus the exhibit on stereotypes to make it interesting."
            }
        ],
        "answer": "B"
    },
    {
        "number": 13,
        "fil": "Isang grupo ang nagsabing, “Ang pagkakaroon ng iba't ibang kultura ay hadlang sa pagkakaisa.” Alin ang pinakamainam na tugon?",
        "en": "A group said, “Having different cultures is an obstacle to unity.” What is the best response?",
        "choices": [
            {
                "letter": "A",
                "fil": "Tama, dahil kailangang iisa ang kultura upang maging nagkakaisa.",
                "en": "Correct, because culture must be the same for people to be united."
            },
            {
                "letter": "B",
                "fil": "Tama, dahil dapat alisin ang mga tradisyonal na kultura.",
                "en": "Correct, because traditional cultures should be removed."
            },
            {
                "letter": "C",
                "fil": "Hindi kinakailangan na pare-pareho ang kultura upang magkaroon ng paggalang at pagkakaisa.",
                "en": "Cultures do not have to be identical for respect and unity to exist."
            },
            {
                "letter": "D",
                "fil": "Hindi, dahil hindi mahalaga ang kultura sa pagkakakilanlan.",
                "en": "Incorrect, because culture is not important to identity."
            }
        ],
        "answer": "C"
    },
    {
        "number": 14,
        "fil": "May kaklase kang gumagamit ng anting-anting bilang bahagi ng paniniwala ng kaniyang pamilya. Ano ang pinakaangkop na asal?",
        "en": "You have a classmate who uses an anting-anting as part of the family's beliefs. What is the most appropriate behavior?",
        "choices": [
            {
                "letter": "A",
                "fil": "Kutiyain siya dahil hindi ito siyentipikong napatunayan.",
                "en": "Mock the classmate because it has not been scientifically proven."
            },
            {
                "letter": "B",
                "fil": "Igalang ang kaniyang paniniwala habang nauunawaan na ito ay bahagi ng isang tradisyonal na paniniwala.",
                "en": "Respect the belief while understanding that it is part of a traditional belief system."
            },
            {
                "letter": "C",
                "fil": "Pilitin siyang gumamit din nito.",
                "en": "Force the classmate to use it as well."
            },
            {
                "letter": "D",
                "fil": "Sabihing pareho dapat ang paniniwala ng lahat.",
                "en": "Say that everyone should have the same beliefs."
            }
        ],
        "answer": "B"
    },
    {
        "number": 15,
        "fil": "Isang paaralan ang nagpaplano ng talakayan tungkol sa tradisyonal na pagpapagaling. Alin ang pinakamainam na paraan upang talakayin ang mga ito?",
        "en": "A school is planning a discussion about traditional healing. What is the best way to discuss these practices?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ipakita ang mga pamamaraan bilang bahagi ng kultura at tradisyon nang hindi awtomatikong ipinapalagay na kapalit ito ng makabagong pangangalagang medikal.",
                "en": "Present them as part of culture and tradition without automatically treating them as replacements for modern medical care."
            },
            {
                "letter": "B",
                "fil": "Sabihing lahat ng tradisyonal na pamamaraan ay siguradong nakakagamot.",
                "en": "Say that all traditional methods definitely cure illnesses."
            },
            {
                "letter": "C",
                "fil": "Sabihing lahat ng tradisyonal na pamamaraan ay walang anumang kahulugan.",
                "en": "Say that all traditional methods have no meaning at all."
            },
            {
                "letter": "D",
                "fil": "Hikayatin ang lahat ng estudyante na gamitin ang mga ito sa lahat ng karamdaman.",
                "en": "Encourage all students to use them for every illness."
            }
        ],
        "answer": "A"
    },
    {
        "number": 16,
        "fil": "May isang grupo na gagawa ng poster tungkol sa Hilot, Tawas, Pausok, at Kamangyan. Alin ang pinakamahalagang prinsipyo sa paggawa nito?",
        "en": "A group will make a poster about Hilot, Tawas, Pausok, and Kamangyan. What is the most important principle in creating it?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ipakita ang mga ito bilang bahagi ng tradisyonal na kaalaman at paniniwala ng mga komunidad.",
                "en": "Present them as part of the traditional knowledge and beliefs of communities."
            },
            {
                "letter": "B",
                "fil": "Sabihing pare-pareho ang proseso ng lahat ng pamamaraan.",
                "en": "Say that all methods follow exactly the same process."
            },
            {
                "letter": "C",
                "fil": "Ipakita na ang lahat ng ito ay ginagamit para sa parehong layunin.",
                "en": "Show that all of them are used for the same purpose."
            },
            {
                "letter": "D",
                "fil": "Iwasang ipaliwanag ang pagkakaiba ng bawat pamamaraan.",
                "en": "Avoid explaining the differences among the methods."
            }
        ],
        "answer": "A"
    },
    {
        "number": 17,
        "fil": "Nais ng isang guro na matulungan ang mga mag-aaral na maunawaan ang ugnayan ng heograpiya at kultura. Aling activity ang pinakamabisang gamitin?",
        "en": "A teacher wants to help students understand the relationship between geography and culture. Which activity would be most effective?",
        "choices": [
            {
                "letter": "A",
                "fil": "Pagpapakabisado lamang ng mga pangalan ng pangkat etniko",
                "en": "Memorizing only the names of ethnic groups"
            },
            {
                "letter": "B",
                "fil": "Paghahambing ng lokasyon, kabuhayan, at kulturang nabuo sa Ilaya at Ilawod",
                "en": "Comparing the locations, livelihoods, and cultures developed in Ilaya and Ilawod"
            },
            {
                "letter": "C",
                "fil": "Pagpapakopya ng lahat ng kahulugan sa aklat",
                "en": "Copying all definitions from the book"
            },
            {
                "letter": "D",
                "fil": "Pagpapasagot lamang ng listahan ng mga termino",
                "en": "Answering only a list of terms"
            }
        ],
        "answer": "B"
    },
    {
        "number": 18,
        "fil": "Sa iyong palagay, alin ang pinakamahalagang aral na maaaring makuha mula sa pag-aaral ng ugnayan ng heograpiya, kultura, paniniwala, at tradisyon?",
        "en": "In your view, what is the most important lesson that can be learned from studying the relationship among geography, culture, beliefs, and traditions?",
        "choices": [
            {
                "letter": "A",
                "fil": "Dapat maging pare-pareho ang paraan ng pamumuhay ng lahat ng Pilipino.",
                "en": "All Filipinos should have the same way of life."
            },
            {
                "letter": "B",
                "fil": "Ang mga tradisyon ay walang kaugnayan sa pagkakakilanlan ng tao.",
                "en": "Traditions have no connection to human identity."
            },
            {
                "letter": "C",
                "fil": "Ang heograpiya lamang ang dahilan kung bakit magkakaiba ang mga Pilipino.",
                "en": "Geography alone explains why Filipinos are different."
            },
            {
                "letter": "D",
                "fil": "Ang pagkakaiba-iba ng kultura ay maaaring maunawaan sa pamamagitan ng pagtingin sa kapaligiran, kasaysayan, paniniwala, at karanasan ng mga komunidad.",
                "en": "Cultural diversity can be understood by examining the environment, history, beliefs, and experiences of communities."
            }
        ],
        "answer": "D"
    },
    {
        "number": 19,
        "fil": "Ang isang pangkat ng mag-aaral ay gagawa ng presentasyon tungkol sa pamayanang matatagpuan sa upstream ng isang ilog. Aling halimbawa ng kabuhayan ang pinakaangkop nilang isama?",
        "en": "A group of students will present about a community located upstream of a river. Which livelihood example is most appropriate to include?",
        "choices": [
            {
                "letter": "A",
                "fil": "Paggawa ng bangka at pangingisda",
                "en": "Boat making and fishing"
            },
            {
                "letter": "B",
                "fil": "Pagtatanim at pag-aalaga ng hayop",
                "en": "Farming and animal raising"
            },
            {
                "letter": "C",
                "fil": "Paglalayag sa karagatan",
                "en": "Sailing on the open sea"
            },
            {
                "letter": "D",
                "fil": "Pangangalakal sa pantalan",
                "en": "Trading at a port"
            }
        ],
        "answer": "B"
    },
    {
        "number": 20,
        "fil": "Nais ng isang guro na ipakita sa klase kung paano nakaaapekto ang lokasyon sa kabuhayan. Aling paghahambing ang pinakamainam?",
        "en": "A teacher wants to show the class how location affects livelihood. Which comparison is best?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ilaya—pagtatanim; Ilawod—pangingisda",
                "en": "Ilaya—farming; Ilawod—fishing"
            },
            {
                "letter": "B",
                "fil": "Ilaya—pangingisda lamang; Ilawod—pangangaso lamang",
                "en": "Ilaya—fishing only; Ilawod—hunting only"
            },
            {
                "letter": "C",
                "fil": "Ilaya—pangangalakal lamang; Ilawod—pagtatanim lamang",
                "en": "Ilaya—trading only; Ilawod—farming only"
            },
            {
                "letter": "D",
                "fil": "Ilaya—paglalayag; Ilawod—pangangalaga ng bundok",
                "en": "Ilaya—sailing; Ilawod—mountain care"
            }
        ],
        "answer": "A"
    },
    {
        "number": 21,
        "fil": "Si Ana ay gumagawa ng project tungkol sa kultura ng mga katutubong pangkat sa kabundukan ng Luzon. Aling pangkat ang dapat niyang pag-aralan?",
        "en": "Ana is doing a project about the culture of indigenous groups in the mountains of Luzon. Which group should she study?",
        "choices": [
            {
                "letter": "A",
                "fil": "Badjao",
                "en": "Badjao"
            },
            {
                "letter": "B",
                "fil": "Tausug",
                "en": "Tausug"
            },
            {
                "letter": "C",
                "fil": "Igorot",
                "en": "Igorot"
            },
            {
                "letter": "D",
                "fil": "Maranao",
                "en": "Maranao"
            }
        ],
        "answer": "C"
    },
    {
        "number": 22,
        "fil": "Nais ni Carlo na maunawaan kung paano naipapasa ang mga epiko, awit, at tradisyon sa ilang pamayanan sa Visayas. Aling konsepto ang dapat niyang gamitin?",
        "en": "Carlo wants to understand how epics, songs, and traditions are passed down in some communities in the Visayas. Which concept should he use?",
        "choices": [
            {
                "letter": "A",
                "fil": "Binukot",
                "en": "Binukot"
            },
            {
                "letter": "B",
                "fil": "Vinta",
                "en": "Vinta"
            },
            {
                "letter": "C",
                "fil": "Lepa-lepa",
                "en": "Lepa-lepa"
            },
            {
                "letter": "D",
                "fil": "Tawas",
                "en": "Tawas"
            }
        ],
        "answer": "A"
    },
    {
        "number": 23,
        "fil": "Nakakita si Lea ng isang makulay na tradisyonal na bangka na ginagamit bilang simbolo ng kultura ng Moro. Anong konsepto ang maaari niyang iugnay rito?",
        "en": "Lea saw a colorful traditional boat used as a symbol of Moro culture. Which concept can she connect to it?",
        "choices": [
            {
                "letter": "A",
                "fil": "Bukot",
                "en": "Bukot"
            },
            {
                "letter": "B",
                "fil": "Vinta",
                "en": "Vinta"
            },
            {
                "letter": "C",
                "fil": "Lepa-lepa",
                "en": "Lepa-lepa"
            },
            {
                "letter": "D",
                "fil": "Kamangyan",
                "en": "Kamangyan"
            }
        ],
        "answer": "B"
    },
    {
        "number": 24,
        "fil": "Sa isang community exhibit, nais ng mga mag-aaral na ipakita ang tradisyong nauugnay sa paninirahan ng Badjao sa bahay-bangka. Ano ang dapat nilang gamitin na konsepto?",
        "en": "In a community exhibit, students want to show the tradition related to Badjao living in houseboats. Which concept should they use?",
        "choices": [
            {
                "letter": "A",
                "fil": "Tutho",
                "en": "Tutho"
            },
            {
                "letter": "B",
                "fil": "Anting-anting",
                "en": "Anting-anting"
            },
            {
                "letter": "C",
                "fil": "Vinta",
                "en": "Vinta"
            },
            {
                "letter": "D",
                "fil": "Lepa-lepa",
                "en": "Lepa-lepa"
            }
        ],
        "answer": "D"
    },
    {
        "number": 25,
        "fil": "Isang mag-aaral ang nagsabing, “Pareho lamang ang kultura ng lahat ng Moro dahil Muslim sila.” Ano ang pinakamainam na tugon batay sa aralin?",
        "en": "A student said, “All Moro culture is the same because they are Muslim.” What is the best response based on the lesson?",
        "choices": [
            {
                "letter": "A",
                "fil": "Tama, dahil iisa ang lahat ng etnikong grupo ng Moro.",
                "en": "Correct, because all Moro ethnic groups are one and the same."
            },
            {
                "letter": "B",
                "fil": "Hindi, dahil binubuo ang Moro ng iba't ibang etnikong grupo na may kani-kaniyang kultura.",
                "en": "Incorrect, because the Moro consist of different ethnic groups with their own cultures."
            },
            {
                "letter": "C",
                "fil": "Tama, dahil ang relihiyon lamang ang bumubuo sa kultura.",
                "en": "Correct, because religion alone forms culture."
            },
            {
                "letter": "D",
                "fil": "Hindi, dahil walang kaugnayan ang Islam sa Moro.",
                "en": "Incorrect, because Islam has no connection to the Moro."
            }
        ],
        "answer": "B"
    },
    {
        "number": 26,
        "fil": "Sa isang talakayan, nais ng guro na ipakita ang epekto ng komunidad sa pagkakakilanlan. Alin ang pinakamainam na halimbawa?",
        "en": "During a discussion, the teacher wants to show the effect of community on identity. Which is the best example?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ang isang bata ay natututo ng wika at tradisyon mula sa kaniyang pamilya at komunidad.",
                "en": "A child learns language and traditions from the family and community."
            },
            {
                "letter": "B",
                "fil": "Ang isang bata ay bumibili ng bagong damit.",
                "en": "A child buys new clothes."
            },
            {
                "letter": "C",
                "fil": "Ang isang tao ay gumagamit ng bagong cellphone.",
                "en": "A person uses a new cellphone."
            },
            {
                "letter": "D",
                "fil": "Ang isang estudyante ay nagbabasa ng mathematics book.",
                "en": "A student reads a mathematics book."
            }
        ],
        "answer": "A"
    },
    {
        "number": 27,
        "fil": "Si Marco ay nagsusuot ng isang bagay na pinaniniwalaan ng kaniyang pamilya na nagbibigay ng proteksiyon at suwerte. Anong konsepto ang ipinakikita nito?",
        "en": "Marco wears an object that his family believes gives protection and good luck. What concept does this show?",
        "choices": [
            {
                "letter": "A",
                "fil": "Hiyas",
                "en": "Hiyas"
            },
            {
                "letter": "B",
                "fil": "Tutho",
                "en": "Tutho"
            },
            {
                "letter": "C",
                "fil": "Ginhawa",
                "en": "Ginhawa"
            },
            {
                "letter": "D",
                "fil": "Anting-anting",
                "en": "Anting-anting"
            }
        ],
        "answer": "D"
    },
    {
        "number": 28,
        "fil": "Isang pamilya ang nagsasagawa ng ritwal upang ipakita ang paggalang sa isang yumao at naniniwalang nagpapatuloy ang paglalakbay ng kaniyang kaluluwa. Aling konsepto ang naaangkop?",
        "en": "A family performs a ritual to show respect for a deceased person and believes the soul continues its journey. Which concept applies?",
        "choices": [
            {
                "letter": "A",
                "fil": "Paniniwala sa kabilang-buhay",
                "en": "Belief in the afterlife"
            },
            {
                "letter": "B",
                "fil": "Paniniwala sa Ilaya",
                "en": "Belief in Ilaya"
            },
            {
                "letter": "C",
                "fil": "Konsepto ng Bangsa",
                "en": "Concept of Bangsa"
            },
            {
                "letter": "D",
                "fil": "Tradisyon ng Binukot",
                "en": "Binukot tradition"
            }
        ],
        "answer": "A"
    },
    {
        "number": 29,
        "fil": "Nakaranas si Pedro ng pananakit ng katawan matapos mapagod sa pisikal na gawain. Nais niyang gumamit ng tradisyonal na paraan na nakatuon sa masahe at paghaplos. Alin ang tinutukoy?",
        "en": "Pedro experiences body pain after physical work. He wants to use a traditional method focused on massage and stroking. Which method is being described?",
        "choices": [
            {
                "letter": "A",
                "fil": "Tawas",
                "en": "Tawas"
            },
            {
                "letter": "B",
                "fil": "Pausok",
                "en": "Pausok"
            },
            {
                "letter": "C",
                "fil": "Hilot",
                "en": "Hilot"
            },
            {
                "letter": "D",
                "fil": "Tutho",
                "en": "Tutho"
            }
        ],
        "answer": "C"
    },
    {
        "number": 30,
        "fil": "Sa isang tradisyonal na ritwal, sinusunog ang mabangong dagta upang makalikha ng mabangong usok at lumikha ng sagradong kapaligiran. Anong pamamaraan ang inilalarawan?",
        "en": "In a traditional ritual, fragrant resin is burned to create aromatic smoke and a sacred atmosphere. Which practice is described?",
        "choices": [
            {
                "letter": "A",
                "fil": "Kamangyan",
                "en": "Kamangyan"
            },
            {
                "letter": "B",
                "fil": "Tutho",
                "en": "Tutho"
            },
            {
                "letter": "C",
                "fil": "Hilot",
                "en": "Hilot"
            },
            {
                "letter": "D",
                "fil": "Tawas",
                "en": "Tawas"
            }
        ],
        "answer": "A"
    },
    {
        "number": 31,
        "fil": "Ano ang tinutukoy ng salitang Ilaya?",
        "en": "What does the term Ilaya refer to?",
        "choices": [
            {
                "letter": "A",
                "fil": "Pamayanang nasa bukana ng dagat",
                "en": "A community at the mouth of the sea"
            },
            {
                "letter": "B",
                "fil": "Pamayanang nasa itaas o upstream ng ilog",
                "en": "A community located above or upstream along a river"
            },
            {
                "letter": "C",
                "fil": "Pamayanang nasa gitna ng lungsod",
                "en": "A community in the middle of a city"
            },
            {
                "letter": "D",
                "fil": "Pamayanang nasa malapit sa pamilihan",
                "en": "A community near a market"
            }
        ],
        "answer": "B"
    },
    {
        "number": 32,
        "fil": "Alin sa sumusunod ang karaniwang ikinabubuhay ng mga taong nananahan sa Ilaya?",
        "en": "Which is a common livelihood of people living in Ilaya?",
        "choices": [
            {
                "letter": "A",
                "fil": "Pangingisda at paggawa ng bangka",
                "en": "Fishing and boat making"
            },
            {
                "letter": "B",
                "fil": "Pangangalakal at paglalayag",
                "en": "Trading and sailing"
            },
            {
                "letter": "C",
                "fil": "Pagtatanim, pangangaso, at pag-aalaga ng hayop",
                "en": "Farming, hunting, and animal raising"
            },
            {
                "letter": "D",
                "fil": "Pagmimina at paggawa ng makinarya",
                "en": "Mining and machine manufacturing"
            }
        ],
        "answer": "C"
    },
    {
        "number": 33,
        "fil": "Saang bahagi ng Pilipinas pangunahing matatagpuan ang mga Igorot?",
        "en": "In which part of the Philippines are the Igorot primarily found?",
        "choices": [
            {
                "letter": "A",
                "fil": "Kapatagan ng Visayas",
                "en": "Plains of the Visayas"
            },
            {
                "letter": "B",
                "fil": "Kabundukan ng Luzon",
                "en": "Mountains of Luzon"
            },
            {
                "letter": "C",
                "fil": "Kapatagan ng Mindanao",
                "en": "Plains of Mindanao"
            }
        ],
        "answer": "B"
    },
    {
        "number": 34,
        "fil": "Ano ang kahulugan ng salitang “bukot” na pinagmulan ng salitang binukot?",
        "en": "What does the word “bukot,” from which the term binukot comes, mean?",
        "choices": [
            {
                "letter": "A",
                "fil": "Alagaan",
                "en": "To care for"
            },
            {
                "letter": "B",
                "fil": "Igalang",
                "en": "To honor"
            },
            {
                "letter": "C",
                "fil": "Itago",
                "en": "To hide"
            },
            {
                "letter": "D",
                "fil": "Bantayan",
                "en": "To guard"
            }
        ],
        "answer": "C"
    },
    {
        "number": 35,
        "fil": "Ano ang tawag sa makukulay na bangka na sumasalamin sa tradisyon at kultura ng mga Muslim sa Mindanao?",
        "en": "What are the colorful boats that reflect the traditions and culture of Muslims in Mindanao called?",
        "choices": [
            {
                "letter": "A",
                "fil": "Lepa-lepa",
                "en": "Lepa-lepa"
            },
            {
                "letter": "B",
                "fil": "Vinta",
                "en": "Vinta"
            },
            {
                "letter": "C",
                "fil": "Balangay",
                "en": "Balangay"
            },
            {
                "letter": "D",
                "fil": "Paraw",
                "en": "Paraw"
            }
        ],
        "answer": "B"
    },
    {
        "number": 36,
        "fil": "Ano ang pangunahing relihiyon ng Moro na may malaking impluwensiya sa kanilang pamumuhay?",
        "en": "What is the main religion of the Moro that strongly influences their way of life?",
        "choices": [
            {
                "letter": "A",
                "fil": "Kristiyanismo",
                "en": "Christianity"
            },
            {
                "letter": "B",
                "fil": "Budismo",
                "en": "Buddhism"
            },
            {
                "letter": "C",
                "fil": "Hinduismo",
                "en": "Hinduism"
            },
            {
                "letter": "D",
                "fil": "Islam",
                "en": "Islam"
            }
        ],
        "answer": "D"
    },
    {
        "number": 37,
        "fil": "Ano ang tawag sa bahay-bangka ng mga Badjao?",
        "en": "What is the houseboat of the Badjao called?",
        "choices": [
            {
                "letter": "A",
                "fil": "Vinta",
                "en": "Vinta"
            },
            {
                "letter": "B",
                "fil": "Lepa-lepa",
                "en": "Lepa-lepa"
            },
            {
                "letter": "C",
                "fil": "Bukot",
                "en": "Bukot"
            },
            {
                "letter": "D",
                "fil": "Bangsa",
                "en": "Bangsa"
            }
        ],
        "answer": "B"
    },
    {
        "number": 38,
        "fil": "Ano ang tinutukoy ng anting-anting o agimat?",
        "en": "What does anting-anting or agimat refer to?",
        "choices": [
            {
                "letter": "A",
                "fil": "Bagay na pinaniniwalaang nagbibigay ng proteksiyon o suwerte",
                "en": "An object believed to provide protection or good luck"
            },
            {
                "letter": "B",
                "fil": "Uri ng tradisyonal na pagkain",
                "en": "A type of traditional food"
            },
            {
                "letter": "C",
                "fil": "Simbolo ng pagiging pinuno ng komunidad",
                "en": "A symbol of being a community leader"
            },
            {
                "letter": "D",
                "fil": "Kagamitang ginagamit sa pangangaso",
                "en": "A tool used for hunting"
            }
        ],
        "answer": "A"
    },
    {
        "number": 39,
        "fil": "Sino ang tinutukoy bilang isang katutubong manggagamot o espiritwal na pinuno?",
        "en": "Who is described as an indigenous healer or spiritual leader?",
        "choices": [
            {
                "letter": "A",
                "fil": "Baylan",
                "en": "Baylan"
            },
            {
                "letter": "B",
                "fil": "Tutho",
                "en": "Tutho"
            },
            {
                "letter": "C",
                "fil": "Tawas",
                "en": "Tawas"
            },
            {
                "letter": "D",
                "fil": "Hilot",
                "en": "Hilot"
            }
        ],
        "answer": "A"
    },
    {
        "number": 40,
        "fil": "Alin ang gumagamit ng mabangong dagta o resin na sinusunog upang makalikha ng mabangong usok?",
        "en": "Which practice uses fragrant resin that is burned to create aromatic smoke?",
        "choices": [
            {
                "letter": "A",
                "fil": "Tutho",
                "en": "Tutho"
            },
            {
                "letter": "B",
                "fil": "Tawas",
                "en": "Tawas"
            },
            {
                "letter": "C",
                "fil": "Kamangyan",
                "en": "Kamangyan"
            },
            {
                "letter": "D",
                "fil": "Hilot",
                "en": "Hilot"
            }
        ],
        "answer": "C"
    },
    {
        "number": 41,
        "fil": "Bakit masasabing may kaugnayan ang heograpiya sa kabuhayan ng mga tao sa Ilaya?",
        "en": "Why can geography be said to be related to the livelihood of people in Ilaya?",
        "choices": [
            {
                "letter": "A",
                "fil": "Dahil pare-pareho ang hanapbuhay ng lahat ng Pilipino",
                "en": "Because all Filipinos have the same livelihood"
            },
            {
                "letter": "B",
                "fil": "Dahil ang katangian ng lugar ay nakaaapekto sa mga gawaing maaaring pagkakitaan",
                "en": "Because the characteristics of a place affect the activities that can provide income"
            },
            {
                "letter": "C",
                "fil": "Dahil ipinagbabawal sa Ilaya ang mga gawaing pangkalakalan",
                "en": "Because trade is prohibited in Ilaya"
            },
            {
                "letter": "D",
                "fil": "Dahil walang ibang uri ng kabuhayan sa Pilipinas",
                "en": "Because there are no other types of livelihood in the Philippines"
            }
        ],
        "answer": "B"
    },
    {
        "number": 42,
        "fil": "Ang isang pamayanan ay matatagpuan sa mataas na lugar na malapit sa kabundukan. Aling paglalarawan ang pinakaangkop dito?",
        "en": "A community is located in a high area near the mountains. Which description is most appropriate?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ito ay isang pamayanang Ilawod.",
                "en": "It is an Ilawod community."
            },
            {
                "letter": "B",
                "fil": "Ito ay isang pamayanang Ilaya.",
                "en": "It is an Ilaya community."
            },
            {
                "letter": "C",
                "fil": "Ito ay isang pamayanang pantalan.",
                "en": "It is a port community."
            },
            {
                "letter": "D",
                "fil": "Ito ay isang pamayanang urban.",
                "en": "It is an urban community."
            }
        ],
        "answer": "B"
    },
    {
        "number": 43,
        "fil": "Bakit naging mahalagang bahagi ng kultura ng mga Igorot ang kanilang mga tradisyon?",
        "en": "Why did traditions become an important part of Igorot culture?",
        "choices": [
            {
                "letter": "A",
                "fil": "Dahil nakatutulong ang mga ito sa pagpapanatili ng kanilang pagkakakilanlan",
                "en": "Because they help preserve their identity"
            },
            {
                "letter": "B",
                "fil": "Dahil pinipigilan nito ang pakikipag-ugnayan sa ibang grupo",
                "en": "Because they prevent interaction with other groups"
            },
            {
                "letter": "C",
                "fil": "Dahil lahat ng kanilang tradisyon ay pareho sa ibang pangkat",
                "en": "Because all their traditions are the same as those of other groups"
            },
            {
                "letter": "D",
                "fil": "Dahil ang kanilang kultura ay nakabatay lamang sa kabuhayan",
                "en": "Because their culture is based only on livelihood"
            }
        ],
        "answer": "A"
    },
    {
        "number": 44,
        "fil": "Ano ang pangunahing layunin ng tradisyon ng Binukot batay sa ibinigay na impormasyon?",
        "en": "Based on the information provided, what is the main purpose of the Binukot tradition?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ihanda ang dalaga sa pangangaso",
                "en": "To prepare a young woman for hunting"
            },
            {
                "letter": "B",
                "fil": "Panatilihin ang kagandahan, dangal, at kultura ng komunidad",
                "en": "To preserve beauty, dignity, and the culture of the community"
            },
            {
                "letter": "C",
                "fil": "Turuan ang dalaga na mangisda",
                "en": "To teach a young woman to fish"
            },
            {
                "letter": "D",
                "fil": "Ihiwalay ang dalaga sa lahat ng kapahamakan.",
                "en": "To isolate a young woman from every possible danger"
            }
        ],
        "answer": "B"
    },
    {
        "number": 45,
        "fil": "Bakit maaaring ituring na tagapag-ingat ng kultura ang isang Binukot?",
        "en": "Why can a Binukot be considered a keeper of culture?",
        "choices": [
            {
                "letter": "A",
                "fil": "Dahil siya ang namumuno sa lahat ng kalalakihan",
                "en": "Because she leads all men"
            },
            {
                "letter": "B",
                "fil": "Dahil siya ang gumagawa ng mga palamuti",
                "en": "Because she makes ornaments"
            },
            {
                "letter": "C",
                "fil": "Dahil siya ang nangangasiwa sa pangangalakal",
                "en": "Because she manages trade"
            },
            {
                "letter": "D",
                "fil": "Dahil iniuugnay siya sa pagpapanatili ng mga epiko, awit, at tradisyon",
                "en": "Because she is associated with preserving epics, songs, and traditions"
            }
        ],
        "answer": "D"
    },
    {
        "number": 46,
        "fil": "Si Lola Ishang ay inilarawan bilang huling prinsesa at isang Binukot ng Tapaz, Capiz. Ano ang ipinakikita ng kanyang pagkakakilanlan?",
        "en": "Lola Ishang is described as the last princess and a Binukot of Tapaz, Capiz. What does her identity show?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ang tradisyon ng Binukot ay bahagi ng kulturang nauugnay sa ilang pamayanan sa Visayas.",
                "en": "The Binukot tradition is part of the culture associated with some communities in the Visayas."
            },
            {
                "letter": "B",
                "fil": "Ang lahat ng babae sa Visayas ay kailangang maging Binukot.",
                "en": "All women in the Visayas must become Binukot."
            },
            {
                "letter": "C",
                "fil": "Ang Binukot ay isang uri ng hanapbuhay.",
                "en": "Binukot is a type of livelihood."
            },
            {
                "letter": "D",
                "fil": "Ang Binukot ay tumutukoy sa mga manggagamot.",
                "en": "Binukot refers to healers."
            }
        ],
        "answer": "A"
    },
    {
        "number": 47,
        "fil": "Ano ang ipinahihiwatig ng konsepto ng Ilawod?",
        "en": "What does the concept of Ilawod imply?",
        "choices": [
            {
                "letter": "A",
                "fil": "Pamayanang nakatuon sa mataas na kabundukan",
                "en": "A community focused on high mountains"
            },
            {
                "letter": "B",
                "fil": "Pamayanang nasa mababang lupa at malapit sa tubig",
                "en": "A community in lowlands and near water"
            },
            {
                "letter": "C",
                "fil": "Pamayanang malayo sa anumang anyong tubig",
                "en": "A community far from any body of water"
            },
            {
                "letter": "D",
                "fil": "Pamayanang matatagpuan lamang sa loob ng kagubatan",
                "en": "A community found only inside forests"
            }
        ],
        "answer": "B"
    },
    {
        "number": 48,
        "fil": "Bakit naging mahalagang kabuhayan ang pangingisda sa mga pamayanang Ilawod?",
        "en": "Why did fishing become an important livelihood in Ilawod communities?",
        "choices": [
            {
                "letter": "A",
                "fil": "Dahil karaniwang malapit sa tubig ang mga naturang pamayanan",
                "en": "Because such communities are usually near water"
            },
            {
                "letter": "B",
                "fil": "Dahil bawal ang pagtatanim sa buong Pilipinas",
                "en": "Because farming is prohibited throughout the Philippines"
            },
            {
                "letter": "C",
                "fil": "Dahil walang hayop na maaaring alagaan sa mga pamayanan",
                "en": "Because no animals can be raised in communities"
            },
            {
                "letter": "D",
                "fil": "Dahil lahat ng Ilawod ay nasa kabundukan",
                "en": "Because all Ilawod communities are in the mountains"
            }
        ],
        "answer": "A"
    },
    {
        "number": 49,
        "fil": "Ano ang ipinahihiwatig ng pagkakaroon ng mga bangka at pangingisda sa pamumuhay ng Moro at Badjao?",
        "en": "What does the presence of boats and fishing in the way of life of the Moro and Badjao suggest?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ang kanilang kabuhayan ay walang kaugnayan sa tubig.",
                "en": "Their livelihood has no connection to water."
            },
            {
                "letter": "B",
                "fil": "Hindi mahalaga ang heograpiya sa kanilang kultura.",
                "en": "Geography is not important to their culture."
            },
            {
                "letter": "C",
                "fil": "Iisa lamang ang kanilang tradisyon sa lahat ng lugar.",
                "en": "They have only one tradition everywhere."
            },
            {
                "letter": "D",
                "fil": "May kaugnayan ang kapaligiran sa kanilang paraan ng pamumuhay.",
                "en": "The environment is related to their way of life."
            }
        ],
        "answer": "D"
    },
    {
        "number": 50,
        "fil": "Bakit hindi sapat na sabihing iisang pangkat lamang ang Moro?",
        "en": "Why is it not sufficient to say that the Moro are only one group?",
        "choices": [
            {
                "letter": "A",
                "fil": "Dahil ang Moro ay binubuo ng iba't ibang etnikong grupo.",
                "en": "Because the Moro are made up of different ethnic groups."
            },
            {
                "letter": "B",
                "fil": "Dahil walang kaugnayan ang Moro sa Mindanao.",
                "en": "Because the Moro have no connection to Mindanao."
            },
            {
                "letter": "C",
                "fil": "Dahil ang Moro ay isang uri ng relihiyon.",
                "en": "Because Moro is a type of religion."
            },
            {
                "letter": "D",
                "fil": "Dahil ang Moro ay tumutukoy sa isang pamilya.",
                "en": "Because Moro refers to a single family."
            }
        ],
        "answer": "A"
    },
    {
        "number": 51,
        "fil": "Ano ang kahalagahan ng Islam sa kultura ng Moro?",
        "en": "What is the significance of Islam in Moro culture?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ito ay may impluwensiya sa kanilang paniniwala, kultura, batas, at edukasyon.",
                "en": "It influences their beliefs, culture, laws, and education."
            },
            {
                "letter": "B",
                "fil": "Ito ay ginagamit sa kanilang mga pagdiriwang.",
                "en": "It is used in their celebrations."
            },
            {
                "letter": "C",
                "fil": "Ito ay nakaaapekto sa kanilang kabuhayan.",
                "en": "It affects their livelihood."
            },
            {
                "letter": "D",
                "fil": "Ito ay walang kaugnayan sa kanilang pamumuhay.",
                "en": "It has no connection to their way of life."
            }
        ],
        "answer": "A"
    },
    {
        "number": 52,
        "fil": "Ano ang ipinahihiwatig ng konsepto ng Bangsa Moro?",
        "en": "What does the concept of Bangsa Moro imply?",
        "choices": [
            {
                "letter": "A",
                "fil": "Isang uri ng tradisyonal na bangka",
                "en": "A type of traditional boat"
            },
            {
                "letter": "B",
                "fil": "Isang paraan ng pagpapagaling",
                "en": "A healing method"
            },
            {
                "letter": "C",
                "fil": "Isang konsepto na may kaugnayan sa pagkabansa ng Moro",
                "en": "A concept related to Moro nationhood"
            },
            {
                "letter": "D",
                "fil": "Isang ritwal sa panahon ng kamatayan",
                "en": "A ritual during death"
            }
        ],
        "answer": "C"
    },
    {
        "number": 53,
        "fil": "Ano ang kaugnayan ng Vinta sa kultura ng Moro?",
        "en": "What is the connection of the Vinta to Moro culture?",
        "choices": [
            {
                "letter": "A",
                "fil": "Sumasalamin ito sa makulay na tradisyon ng Islam.",
                "en": "It reflects the colorful tradition of Islam."
            },
            {
                "letter": "B",
                "fil": "Ginagamit ito bilang palamuti sa bahay.",
                "en": "It is used as a house decoration."
            },
            {
                "letter": "C",
                "fil": "Ito ay isang uri ng halamang gamot.",
                "en": "It is a type of medicinal plant."
            },
            {
                "letter": "D",
                "fil": "Ito ay ginagamit sa ritwal ng Binukot.",
                "en": "It is used in a Binukot ritual."
            }
        ],
        "answer": "A"
    },
    {
        "number": 54,
        "fil": "Ano ang tinutukoy ng Guerras Peraticas o The Sulu Zone?",
        "en": "What does Guerras Peraticas or The Sulu Zone refer to?",
        "choices": [
            {
                "letter": "A",
                "fil": "Pakikipagkalakalan ng Moro at Badjao",
                "en": "Trade between the Moro and Badjao"
            },
            {
                "letter": "B",
                "fil": "Digmaan sa dagat sa pagitan ng Moro at Espanyol",
                "en": "Sea warfare between the Moro and the Spanish"
            },
            {
                "letter": "C",
                "fil": "Pakikipagpalitan ng kultura ng Igorot at Binukot",
                "en": "Cultural exchange between the Igorot and Binukot"
            },
            {
                "letter": "D",
                "fil": "Tradisyonal na paraan ng pagpapagaling",
                "en": "A traditional healing method"
            }
        ],
        "answer": "B"
    },
    {
        "number": 55,
        "fil": "Bakit tinawag na sea gypsies o nomadic people ang mga Badjao?",
        "en": "Why are the Badjao called sea gypsies or nomadic people?",
        "choices": [
            {
                "letter": "A",
                "fil": "Dahil sila ay nakatuon lamang sa pagtatanim.",
                "en": "Because they focus only on farming."
            },
            {
                "letter": "B",
                "fil": "Dahil nakatira sila sa tuktok ng mga bundok.",
                "en": "Because they live on mountain peaks."
            },
            {
                "letter": "C",
                "fil": "Dahil palipat-lipat sila at may tradisyong manirahan sa mga bahay-bangka.",
                "en": "Because they move from place to place and have a tradition of living in houseboats."
            },
            {
                "letter": "D",
                "fil": "Dahil wala silang kaugnayan sa karagatan.",
                "en": "Because they have no connection to the sea."
            }
        ],
        "answer": "C"
    },
    {
        "number": 56,
        "fil": "Ano ang ipinahihiwatig ng pahayag na “ang identidad ng isang tao ay nahuhubog ng kaniyang komunidad”?",
        "en": "What does the statement “a person's identity is shaped by their community” imply?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ang tao ay ganap na hiwalay sa kaniyang kapaligiran.",
                "en": "A person is completely separate from the environment."
            },
            {
                "letter": "B",
                "fil": "Ang mga karanasan, kultura, wika, at tradisyon ng komunidad ay maaaring makaimpluwensiya sa pagkatao.",
                "en": "The experiences, culture, language, and traditions of a community can influence a person's identity."
            },
            {
                "letter": "C",
                "fil": "Iisa ang identidad ng lahat ng tao sa isang bansa.",
                "en": "Everyone in a country has the same identity."
            },
            {
                "letter": "D",
                "fil": "Hindi nagbabago ang identidad anuman ang karanasan.",
                "en": "Identity never changes regardless of experience."
            }
        ],
        "answer": "B"
    },
    {
        "number": 57,
        "fil": "Bakit mahalagang pag-aralan ang mga paniniwala at pananampalataya ng isang komunidad?",
        "en": "Why is it important to study the beliefs and faith of a community?",
        "choices": [
            {
                "letter": "A",
                "fil": "Upang maunawaan kung paano nila binibigyang-kahulugan ang buhay at espirituwal na karanasan",
                "en": "To understand how they give meaning to life and spiritual experiences"
            },
            {
                "letter": "B",
                "fil": "Upang mapalitan ang kanilang mga paniniwala",
                "en": "To replace their beliefs"
            },
            {
                "letter": "C",
                "fil": "Upang malaman kung sino ang pinakamayaman sa komunidad",
                "en": "To find out who is richest in the community"
            },
            {
                "letter": "D",
                "fil": "Upang mapatunayan na iisa lamang ang paniniwala ng lahat",
                "en": "To prove that everyone has only one belief"
            }
        ],
        "answer": "A"
    },
    {
        "number": 58,
        "fil": "Ano ang ipinahihiwatig ng konsepto ng ginhawa?",
        "en": "What does the concept of ginhawa imply?",
        "choices": [
            {
                "letter": "A",
                "fil": "Kaginhawaan ng katawan",
                "en": "Physical comfort"
            },
            {
                "letter": "B",
                "fil": "Kayamanan at mataas na katayuan",
                "en": "Wealth and high status"
            },
            {
                "letter": "C",
                "fil": "Balanseng kalagayan ng katawan, isip, at damdamin",
                "en": "A balanced state of body, mind, and emotions"
            },
            {
                "letter": "D",
                "fil": "Kapangyarihan ng isang pinuno",
                "en": "The power of a leader"
            }
        ],
        "answer": "C"
    },
    {
        "number": 59,
        "fil": "Bakit mahalagang bahagi ng sinaunang paniniwala ang anting-anting?",
        "en": "Why was anting-anting an important part of early beliefs?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ito ay nagbibigay ng proteksiyon, lakas, o suwerte.",
                "en": "It is believed to provide protection, strength, or good luck."
            },
            {
                "letter": "B",
                "fil": "Ito ay ginagamit bilang pangunahing kwintas.",
                "en": "It is used mainly as a necklace."
            },
            {
                "letter": "C",
                "fil": "Ito ay nagsisilbing palamuti.",
                "en": "It serves only as decoration."
            },
            {
                "letter": "D",
                "fil": "Ito ay ginagamit sa pagpapaganda.",
                "en": "It is used for beautification."
            }
        ],
        "answer": "A"
    },
    {
        "number": 60,
        "fil": "Ano ang pangunahing ideya ng paniniwala sa kabilang-buhay?",
        "en": "What is the main idea of belief in the afterlife?",
        "choices": [
            {
                "letter": "A",
                "fil": "Ang kamatayan ay ganap na pagtatapos ng lahat.",
                "en": "Death is the complete end of everything."
            },
            {
                "letter": "B",
                "fil": "Ang kaluluwa ay pinaniniwalaang nagpapatuloy sa paglalakbay matapos ang kamatayan.",
                "en": "The soul is believed to continue its journey after death."
            },
            {
                "letter": "C",
                "fil": "Ang mga yumao ay bumabalik agad sa kanilang dating buhay.",
                "en": "The dead immediately return to their former life."
            },
            {
                "letter": "D",
                "fil": "Ang kamatayan ay walang kaugnayan sa paniniwala ng tao.",
                "en": "Death has no connection to human belief."
            }
        ],
        "answer": "B"
    }
];


/* ==================== 2. DOM REFERENCES / STATE ==================== */

const examLock = document.getElementById('examLock');
const examStart = document.getElementById('examStart');
const examStartButton = document.getElementById('examStartButton');
const examShell = document.getElementById('examShell');
const examQuestionArea = document.getElementById('examQuestionArea');
const examCounter = document.getElementById('examCounter');
const examAnswered = document.getElementById('examAnswered');
const examProgressFill = document.getElementById('examProgressFill');
const examNavigator = document.getElementById('examNavigator');
const examPrev = document.getElementById('examPrev');
const examNext = document.getElementById('examNext');
const examSubmit = document.getElementById('examSubmit');
const examSubmitNote = document.getElementById('examSubmitNote');
const examResult = document.getElementById('examResult');
const examFinalScore = document.getElementById('examFinalScore');
const examFinalPercent = document.getElementById('examFinalPercent');
const examRetry = document.getElementById('examRetry');

const examModal = document.getElementById('examModal');
const examCancelSubmit = document.getElementById('examCancelSubmit');
const examConfirmSubmit = document.getElementById('examConfirmSubmit');

let examPosition = 0;
let examAnswers = Array(TERM_EXAM_DATA.length).fill(null);


/* ==================== 3. ACCESS / STORAGE HELPERS ==================== */

function examLanguage() {
    return localStorage.getItem('ehistory-language') || 'FIL';
}

function examDone(storageKey) {
    return localStorage.getItem(storageKey) === 'true';
}

function examAccessGranted() {
    const assessmentsComplete =
        examDone('ehistory-assessment-1-completed') &&
        examDone('ehistory-assessment-2-completed');

    const lessonThreeComplete = [1, 2, 3].every((activityNumber) =>
        examDone(`ehistory-l3-a${activityNumber}-completed`)
    );

    return assessmentsComplete && lessonThreeComplete;
}

function saveExamDraft() {
    localStorage.setItem(
        'ehistory-exam-draft',
        JSON.stringify(examAnswers)
    );
}

function loadExamDraft() {
    try {
        const saved = JSON.parse(
            localStorage.getItem('ehistory-exam-draft') || 'null'
        );

        if (Array.isArray(saved) && saved.length === TERM_EXAM_DATA.length) {
            examAnswers = saved;
        }
    } catch (error) {
        examAnswers = Array(TERM_EXAM_DATA.length).fill(null);
    }
}

function clearExamDraft() {
    localStorage.removeItem('ehistory-exam-draft');
}


/* ==================== 4. QUESTION / NAVIGATOR RENDERING ==================== */

function answeredExamCount() {
    return examAnswers.filter((answer) => answer !== null).length;
}

function renderExamQuestion() {
    const question = TERM_EXAM_DATA[examPosition];
    const language = examLanguage();

    if (!question || !examQuestionArea) {
        return;
    }

    examCounter.textContent = `${examPosition + 1} / ${TERM_EXAM_DATA.length}`;

    examQuestionArea.innerHTML = `
        <span>${language === 'FIL' ? 'AYTEM' : 'ITEM'} ${question.number}</span>
        <h2>${language === 'FIL' ? question.fil : question.en}</h2>
        <div class="exam-options">
            ${question.choices
                .map(
                    (choice) => `
                        <button
                            type="button"
                            class="exam-option ${examAnswers[examPosition] === choice.letter ? 'selected' : ''}"
                            data-value="${choice.letter}"
                        >
                            <span class="exam-option-letter">${choice.letter}</span>
                            <span class="exam-option-text">${language === 'FIL' ? choice.fil : choice.en}</span>
                        </button>
                    `
                )
                .join('')}
        </div>
    `;

    examQuestionArea.querySelectorAll('.exam-option').forEach((button) => {
        button.addEventListener('click', () => {
            examAnswers[examPosition] = button.dataset.value;
            saveExamDraft();
            renderExamQuestion();
            renderExamNavigator();
            updateExamStatus();
        });
    });

    examPrev.disabled = examPosition === 0;
    examNext.disabled = examPosition === TERM_EXAM_DATA.length - 1;

    renderExamNavigator();
    updateExamStatus();
}

function renderExamNavigator() {
    if (!examNavigator) {
        return;
    }

    examNavigator.innerHTML = TERM_EXAM_DATA
        .map((question, index) => {
            const classes = ['exam-nav-item'];

            if (examAnswers[index] !== null) {
                classes.push('answered');
            }

            if (index === examPosition) {
                classes.push('current');
            }

            return `
                <button
                    type="button"
                    class="${classes.join(' ')}"
                    data-index="${index}"
                    aria-label="${examLanguage() === 'FIL' ? 'Aytem' : 'Item'} ${question.number}"
                >
                    ${question.number}
                </button>
            `;
        })
        .join('');

    examNavigator.querySelectorAll('.exam-nav-item').forEach((button) => {
        button.addEventListener('click', () => {
            examPosition = Number(button.dataset.index);
            renderExamQuestion();

            window.scrollTo({
                top: examShell.offsetTop - 90,
                behavior: 'smooth'
            });
        });
    });
}

function updateExamStatus() {
    const answered = answeredExamCount();
    const total = TERM_EXAM_DATA.length;
    const language = examLanguage();

    examAnswered.textContent = `${answered} / ${total}`;
    examProgressFill.style.width = `${(answered / total) * 100}%`;

    const allAnswered = answered === total;
    examSubmit.disabled = !allAnswered;

    examSubmitNote.textContent = allAnswered
        ? language === 'FIL'
            ? 'Nasagutan na ang lahat ng aytem. Maaari mo nang isumite.'
            : 'All items are answered. You may now submit.'
        : language === 'FIL'
          ? `May ${total - answered} aytem pa na hindi nasasagutan.`
          : `${total - answered} item(s) are still unanswered.`;
}


/* ==================== 5. NAVIGATION / ANSWER FLOW ==================== */

examPrev?.addEventListener('click', () => {
    if (examPosition > 0) {
        examPosition -= 1;
        renderExamQuestion();
    }
});

examNext?.addEventListener('click', () => {
    if (examPosition < TERM_EXAM_DATA.length - 1) {
        examPosition += 1;
        renderExamQuestion();
    }
});

examStartButton?.addEventListener('click', () => {
    examStart.classList.remove('show');
    examShell.classList.add('show');

    loadExamDraft();
    renderExamQuestion();
});


/* ==================== 6. SUBMISSION / SCORING ==================== */

function calculateExamScore() {
    return TERM_EXAM_DATA.reduce((score, question, index) => {
        return score + (examAnswers[index] === question.answer ? 1 : 0);
    }, 0);
}

function openExamSubmitModal() {
    if (examSubmit.disabled) {
        return;
    }

    examModal.classList.add('show');
    examModal.setAttribute('aria-hidden', 'false');
}

function closeExamSubmitModal() {
    examModal.classList.remove('show');
    examModal.setAttribute('aria-hidden', 'true');
}

examSubmit?.addEventListener('click', openExamSubmitModal);
examCancelSubmit?.addEventListener('click', closeExamSubmitModal);

examModal?.addEventListener('click', (event) => {
    if (event.target === examModal) {
        closeExamSubmitModal();
    }
});

examConfirmSubmit?.addEventListener('click', () => {
    closeExamSubmitModal();
    finishExam();
});

function finishExam() {
    const score = calculateExamScore();
    const total = TERM_EXAM_DATA.length;
    const percentage = Math.round((score / total) * 100);

    localStorage.setItem('ehistory-exam-completed', 'true');
    localStorage.setItem('ehistory-exam-score', String(score));

    const previousBest = Number(
        localStorage.getItem('ehistory-exam-best') || 0
    );

    if (score > previousBest) {
        localStorage.setItem('ehistory-exam-best', String(score));
    }

    const attemptCount = Number(
        localStorage.getItem('ehistory-exam-attempts') || 0
    );

    localStorage.setItem(
        'ehistory-exam-attempts',
        String(attemptCount + 1)
    );

    clearExamDraft();

    examShell.classList.remove('show');
    examStart.classList.remove('show');
    examResult.classList.add('show');

    examFinalScore.textContent = `${score} / ${total}`;
    examFinalPercent.textContent = `${percentage}%`;

    window.dispatchEvent(new Event('ehistory:progresschange'));
}


/* ==================== 7. RESULT / RETRY ==================== */

function showSavedExamResult() {
    const score = Number(localStorage.getItem('ehistory-exam-score') || 0);
    const total = TERM_EXAM_DATA.length;
    const percentage = Math.round((score / total) * 100);

    examFinalScore.textContent = `${score} / ${total}`;
    examFinalPercent.textContent = `${percentage}%`;

    examLock.classList.remove('show');
    examStart.classList.remove('show');
    examShell.classList.remove('show');
    examResult.classList.add('show');
}

examRetry?.addEventListener('click', () => {
    examAnswers = Array(TERM_EXAM_DATA.length).fill(null);
    examPosition = 0;
    clearExamDraft();

    examResult.classList.remove('show');
    examStart.classList.add('show');

    window.scrollTo({
        top: examStart.offsetTop - 90,
        behavior: 'smooth'
    });
});


/* ==================== 8. LANGUAGE SYNCHRONIZATION ==================== */

window.addEventListener('ehistory:languagechange', () => {
    if (examShell.classList.contains('show')) {
        renderExamQuestion();
    }

    updateExamStatus();
});


/* ==================== 9. INITIALIZATION ==================== */

function initializeExam() {
    if (!examAccessGranted()) {
        examLock.classList.add('show');
        examStart.classList.remove('show');
        examShell.classList.remove('show');
        examResult.classList.remove('show');
        return;
    }

    examLock.classList.remove('show');

    if (examDone('ehistory-exam-completed')) {
        showSavedExamResult();
        return;
    }

    examStart.classList.add('show');
}

initializeExam();
