/* ============================================================
   E-HISTORY — SUMMATIVE ASSESSMENT ENGINE
   ============================================================
   QUICK MAP
   1. ASSESSMENT_DATA — questions and answer keys
   2. Current assessment / DOM references
   3. Language and data preparation
   4. Question rendering
   5. Scoring
   6. Submission / score saving
   7. Button and language events
   8. Initial access check

   EDITING TIP:
   Keep each correct answer synchronized with its choices.
   ============================================================ */

/* ==================== 1. ASSESSMENT CONTENT DATABASE ==================== */

const ASSESSMENT_DATA = {
    "1": {
        "title": "First Summative Examination",
        "lesson": 1,
        "type": "mc",
        "questions": [
            [
                "Ano ang pinakamahusay na paglalarawan sa kamalayang pangkasaysayan?",
                "Which best describes historical consciousness?",
                [
                    [
                        "A",
                        "Pag-aaral ng iba't ibang wika",
                        "Studying different languages"
                    ],
                    [
                        "B",
                        "Pag-unawa at pagpapahalaga sa kasaysayan ng bansa at lipunan",
                        "Understanding and appreciating the history of the country and society"
                    ],
                    [
                        "C",
                        "Pag-aaral ng mga makasaysayang pangyayari lamang",
                        "Studying historical events only"
                    ],
                    [
                        "D",
                        "Pagkilala sa iba't ibang bansa",
                        "Recognizing different countries"
                    ]
                ],
                "B"
            ],
            [
                "Ano ang pangunahing layunin ng pagkakaroon ng kamalayang pangkasaysayan?",
                "What is the main purpose of having historical consciousness?",
                [
                    [
                        "A",
                        "Magkaroon ng mataas na marka sa paaralan",
                        "To get high grades in school"
                    ],
                    [
                        "B",
                        "Maunawaan ang mahahalagang pangyayari sa nakaraan",
                        "To understand important events in the past"
                    ],
                    [
                        "C",
                        "Magamit ang mga aral ng nakaraan bilang gabay sa kasalukuyan at hinaharap",
                        "To use lessons from the past as a guide for the present and future"
                    ],
                    [
                        "D",
                        "Makapamasyal sa iba't ibang makasaysayang lugar",
                        "To visit different historical places"
                    ]
                ],
                "C"
            ],
            [
                "Ano ang pinakamahalagang naitutulong ng kamalayang pangkasaysayan sa mga mamamayan?",
                "What is the most important contribution of historical consciousness to citizens?",
                [
                    [
                        "A",
                        "Makilala ang kanilang pagkakakilanlan, kultura, at pagpapahalagang Pilipino",
                        "To recognize their identity, culture, and Filipino values"
                    ],
                    [
                        "B",
                        "Makilala ang kasaysayan ng ibang bansa",
                        "To learn the history of other countries"
                    ],
                    [
                        "C",
                        "Maunawaan ang pinagmulan ng kanilang komunidad",
                        "To understand the origin of their community"
                    ],
                    [
                        "D",
                        "Mapahusay ang kakayahan sa palakasan",
                        "To improve athletic ability"
                    ]
                ],
                "A"
            ],
            [
                "Alin sa sumusunod ang HINDI kabilang sa mga pangunahing palatandaan ng kamalayang pangkasaysayan?",
                "Which is NOT one of the main indicators of historical consciousness?",
                [
                    [
                        "A",
                        "Simbolismo",
                        "Symbolism"
                    ],
                    [
                        "B",
                        "Tradisyon",
                        "Tradition"
                    ],
                    [
                        "C",
                        "Kuwentong-bayan",
                        "Folklore"
                    ],
                    [
                        "D",
                        "Modernisasyon",
                        "Modernization"
                    ]
                ],
                "D"
            ],
            [
                "Ano ang pinakamahusay na paglalarawan sa simbolismo?",
                "Which best describes symbolism?",
                [
                    [
                        "A",
                        "Paglikha ng mga bagong batas",
                        "Creating new laws"
                    ],
                    [
                        "B",
                        "Pag-aaral ng iba't ibang relihiyon",
                        "Studying different religions"
                    ],
                    [
                        "C",
                        "Pagkilala sa mahahalagang simbolo ng bansa",
                        "Recognizing important national symbols"
                    ],
                    [
                        "D",
                        "Paggamit ng mga sagisag o representasyon ng mahahalagang tao, pangyayari, at ideya",
                        "Using symbols or representations of important people, events, and ideas"
                    ]
                ],
                "D"
            ],
            [
                "Alin sa sumusunod ang pinakamahusay na halimbawa ng simbolismo?",
                "Which is the best example of symbolism?",
                [
                    [
                        "A",
                        "Cellphone",
                        "Cellphone"
                    ],
                    [
                        "B",
                        "Bantayog ni Rizal",
                        "Rizal Monument"
                    ],
                    [
                        "C",
                        "Social media",
                        "Social media"
                    ],
                    [
                        "D",
                        "Watawat ng Pilipinas",
                        "Philippine Flag"
                    ]
                ],
                "D"
            ],
            [
                "Ano ang pangunahing layunin ng mga simbolo tulad ng watawat at bantayog?",
                "What is the main purpose of symbols such as flags and monuments?",
                [
                    [
                        "A",
                        "Panatilihin ang alaala at diwa ng mga makasaysayang pangyayari",
                        "To preserve the memory and spirit of historical events"
                    ],
                    [
                        "B",
                        "Magbigay ng impormasyon tungkol sa kasaysayan",
                        "To provide information about history"
                    ],
                    [
                        "C",
                        "Magbigay ng aliwan",
                        "To provide entertainment"
                    ],
                    [
                        "D",
                        "Magpakilala ng produkto",
                        "To advertise a product"
                    ]
                ],
                "A"
            ],
            [
                "Ano ang pinakamahusay na kahulugan ng tradisyon?",
                "Which best defines tradition?",
                [
                    [
                        "A",
                        "Mga bagong uso sa lipunan",
                        "New social trends"
                    ],
                    [
                        "B",
                        "Mga kaugalian, gawi, at paniniwalang naipapasa sa bawat henerasyon",
                        "Customs, practices, and beliefs passed through generations"
                    ],
                    [
                        "C",
                        "Mga kaugaliang sinusunod ng isang pamilya o komunidad",
                        "Customs followed by a family or community"
                    ],
                    [
                        "D",
                        "Mga batas ng pamahalaan",
                        "Government laws"
                    ]
                ],
                "B"
            ],
            [
                "Ano ang ipinakikita ng pagpapatuloy ng mga tradisyon?",
                "What does the continuation of traditions show?",
                [
                    [
                        "A",
                        "Pagbabago ng relihiyon",
                        "Changing religion"
                    ],
                    [
                        "B",
                        "Paggalang sa mga ninuno",
                        "Respect for ancestors"
                    ],
                    [
                        "C",
                        "Pagpapahalaga sa kultura at pamanang pangkasaysayan",
                        "Appreciation of culture and historical heritage"
                    ],
                    [
                        "D",
                        "Paglimot sa kasaysayan",
                        "Forgetting history"
                    ]
                ],
                "C"
            ],
            [
                "Alin ang pinakamahusay na halimbawa ng tradisyon?",
                "Which is the best example of tradition?",
                [
                    [
                        "A",
                        "Panonood ng telebisyon",
                        "Watching television"
                    ],
                    [
                        "B",
                        "Pagdiriwang ng Pasko kasama ang pamilya",
                        "Celebrating Christmas with family"
                    ],
                    [
                        "C",
                        "Paglalaro ng online games",
                        "Playing online games"
                    ],
                    [
                        "D",
                        "Pagdiriwang ng pista sa barangay",
                        "Celebrating a barangay fiesta"
                    ]
                ],
                "D"
            ],
            [
                "Ano ang pinakamahusay na paglalarawan sa kuwentong-bayan?",
                "Which best describes folklore?",
                [
                    [
                        "A",
                        "Mga salaysay tungkol sa paniniwala, karanasan, at pinagmulan ng mga bagay sa lipunan",
                        "Stories about beliefs, experiences, and origins of things in society"
                    ],
                    [
                        "B",
                        "Mga kuwentong nagpapakita ng kultura at paniniwala ng mga ninuno",
                        "Stories showing the culture and beliefs of ancestors"
                    ],
                    [
                        "C",
                        "Mga balitang napapanood sa telebisyon",
                        "News seen on television"
                    ],
                    [
                        "D",
                        "Mga artikulo sa pahayagan",
                        "Newspaper articles"
                    ]
                ],
                "A"
            ],
            [
                "Alin ang pinakamahusay na halimbawa ng kuwentong-bayan?",
                "Which is the best example of folklore?",
                [
                    [
                        "A",
                        "Epiko",
                        "Epic"
                    ],
                    [
                        "B",
                        "Alamat",
                        "Legend"
                    ],
                    [
                        "C",
                        "Talumpati",
                        "Speech"
                    ],
                    [
                        "D",
                        "Talaarawan",
                        "Diary"
                    ]
                ],
                "B"
            ],
            [
                "Paano pangunahing naipasa ang mga kuwentong-bayan noong unang panahon?",
                "How were folk stories mainly passed down in earlier times?",
                [
                    [
                        "A",
                        "Tradisyong pasalita",
                        "Oral tradition"
                    ],
                    [
                        "B",
                        "Pagsasalaysay ng mga nakatatanda",
                        "Storytelling by elders"
                    ],
                    [
                        "C",
                        "Internet",
                        "Internet"
                    ],
                    [
                        "D",
                        "Telebisyon",
                        "Television"
                    ]
                ],
                "A"
            ],
            [
                "Ano ang pinakamahalagang kahalagahan ng kuwentong-bayan?",
                "What is the most important value of folklore?",
                [
                    [
                        "A",
                        "Ginagamit lamang sa paaralan",
                        "It is used only in school"
                    ],
                    [
                        "B",
                        "Nagtuturo ng mahahalagang aral sa buhay",
                        "It teaches important life lessons"
                    ],
                    [
                        "C",
                        "Nagbibigay lamang ng libangan",
                        "It only provides entertainment"
                    ],
                    [
                        "D",
                        "Tinutulungan tayong maunawaan ang pananaw at kultura ng ating mga ninuno",
                        "It helps us understand the perspectives and culture of our ancestors"
                    ]
                ],
                "D"
            ],
            [
                "Alin ang HINDI kabilang sa kuwentong-bayan?",
                "Which does NOT belong to folklore?",
                [
                    [
                        "A",
                        "Mitolohiya",
                        "Mythology"
                    ],
                    [
                        "B",
                        "Epiko",
                        "Epic"
                    ],
                    [
                        "C",
                        "Ensiklopedya",
                        "Encyclopedia"
                    ],
                    [
                        "D",
                        "Alamat",
                        "Legend"
                    ]
                ],
                "C"
            ],
            [
                "Ano ang pinakamahalagang katangian ng taong may kamalayang pangkasaysayan?",
                "What is the most important characteristic of a historically conscious person?",
                [
                    [
                        "A",
                        "Natututo mula sa mga pangyayari sa kasaysayan",
                        "Learns from historical events"
                    ],
                    [
                        "B",
                        "Iniuugnay ang nakaraan, kasalukuyan, at hinaharap",
                        "Connects the past, present, and future"
                    ],
                    [
                        "C",
                        "Madaling makalimot sa nakaraan",
                        "Easily forgets the past"
                    ],
                    [
                        "D",
                        "Walang pakialam sa kasaysayan",
                        "Does not care about history"
                    ]
                ],
                "B"
            ],
            [
                "Ang taong may kamalayang pangkasaysayan ay ________.",
                "A historically conscious person is ________.",
                [
                    [
                        "A",
                        "Mapanuri at kritikal",
                        "Analytical and critical"
                    ],
                    [
                        "B",
                        "Tamad magsuri",
                        "Too lazy to analyze"
                    ],
                    [
                        "C",
                        "Marunong magsuri ng iba't ibang batis ng impormasyon",
                        "Able to examine different sources of information"
                    ],
                    [
                        "D",
                        "Madaling maniwala sa lahat ng impormasyon",
                        "Quick to believe all information"
                    ]
                ],
                "C"
            ],
            [
                "Ano ang pangunahing ginagamit ng taong may kamalayang pangkasaysayan sa paggawa ng wastong pagpapasya?",
                "What does a historically conscious person mainly use in making sound decisions?",
                [
                    [
                        "A",
                        "Mga aral ng kasaysayan",
                        "Lessons of history"
                    ],
                    [
                        "B",
                        "Mga karanasan ng nakaraan",
                        "Past experiences"
                    ],
                    [
                        "C",
                        "Tsamba",
                        "Luck"
                    ],
                    [
                        "D",
                        "Opinyon lamang ng kaibigan",
                        "Only a friend’s opinion"
                    ]
                ],
                "A"
            ],
            [
                "Alin ang pinakamahusay na nagpapakita ng pagmamahal sa bayan?",
                "Which best demonstrates love of country?",
                [
                    [
                        "A",
                        "Pagsira sa mga makasaysayang lugar",
                        "Damaging historical places"
                    ],
                    [
                        "B",
                        "Paggalang sa pambansang simbolo",
                        "Respecting national symbols"
                    ],
                    [
                        "C",
                        "Paglimot sa kasaysayan",
                        "Forgetting history"
                    ],
                    [
                        "D",
                        "Pagpapahalaga sa mga pamanang kultural",
                        "Valuing cultural heritage"
                    ]
                ],
                "D"
            ],
            [
                "Ano ang ipinakikita ng aktibong pakikilahok sa pagpapaunlad ng lipunan?",
                "What does active participation in improving society demonstrate?",
                [
                    [
                        "A",
                        "Pagkakaroon ng kamalayang pangkasaysayan",
                        "Having historical consciousness"
                    ],
                    [
                        "B",
                        "Pagmamahal sa bayan",
                        "Love of country"
                    ],
                    [
                        "C",
                        "Kawalan ng interes sa bansa",
                        "Lack of interest in the country"
                    ],
                    [
                        "D",
                        "Pagiging makasarili",
                        "Selfishness"
                    ]
                ],
                "B"
            ],
            [
                "Bakit mahalagang pag-aralan ang kasaysayan?",
                "Why is it important to study history?",
                [
                    [
                        "A",
                        "Upang makalimutan ang nakaraan",
                        "To forget the past"
                    ],
                    [
                        "B",
                        "Upang matuto mula sa mga pangyayari sa nakaraan",
                        "To learn from events in the past"
                    ],
                    [
                        "C",
                        "Upang magkaroon ng gabay sa pagpapasya batay sa mga aral ng nakaraan",
                        "To have guidance for decisions based on lessons from the past"
                    ],
                    [
                        "D",
                        "Upang maging sikat",
                        "To become famous"
                    ]
                ],
                "C"
            ],
            [
                "Alin sa sumusunod ang pinakamahusay na nagpapakita ng kamalayang pangkasaysayan?",
                "Which best demonstrates historical consciousness?",
                [
                    [
                        "A",
                        "Pagsira sa mga bantayog",
                        "Damaging monuments"
                    ],
                    [
                        "B",
                        "Pakikilahok sa mga pagdiriwang na nagpapahalaga sa kasaysayan at kultura",
                        "Participating in celebrations that value history and culture"
                    ],
                    [
                        "C",
                        "Pagrespeto sa pambansang watawat at iba pang pambansang simbolo",
                        "Respecting the national flag and other national symbols"
                    ],
                    [
                        "D",
                        "Pagkakalat sa mga makasaysayang lugar",
                        "Littering at historical places"
                    ]
                ],
                "C"
            ],
            [
                "Ano ang pangunahing layunin ng mga bantayog?",
                "What is the main purpose of monuments?",
                [
                    [
                        "A",
                        "Gunitain ang mahahalagang tao at pangyayari sa kasaysayan",
                        "To commemorate important people and events in history"
                    ],
                    [
                        "B",
                        "Panatilihing buhay ang alaala at aral ng kasaysayan para sa susunod na henerasyon",
                        "To keep the memory and lessons of history alive for future generations"
                    ],
                    [
                        "C",
                        "Magbigay ng aliwan",
                        "To provide entertainment"
                    ],
                    [
                        "D",
                        "Magbenta ng produkto",
                        "To sell a product"
                    ]
                ],
                "B"
            ],
            [
                "Alin sa sumusunod ang pinakamahusay na nagpapakita ng pagpapahalaga sa tradisyon?",
                "Which best demonstrates appreciation of tradition?",
                [
                    [
                        "A",
                        "Pagpapabaya sa mga nakatatanda",
                        "Neglecting elders"
                    ],
                    [
                        "B",
                        "Paglahok sa mga tradisyunal na pagdiriwang at gawain ng pamayanan",
                        "Participating in traditional community celebrations and activities"
                    ],
                    [
                        "C",
                        "Paglimot sa mga kaugalian",
                        "Forgetting customs"
                    ],
                    [
                        "D",
                        "Pagsunod at pagpapanatili ng mga makabuluhang kaugalian ng pamilya at komunidad",
                        "Following and preserving meaningful family and community customs"
                    ]
                ],
                "D"
            ],
            [
                "Ano ang pinakamahalagang natututuhan sa mga alamat at epiko?",
                "What is the most important thing learned from legends and epics?",
                [
                    [
                        "A",
                        "Mga pananaw, pagpapahalaga, at kultura ng ating mga ninuno",
                        "The perspectives, values, and culture of our ancestors"
                    ],
                    [
                        "B",
                        "Mga aral na maaaring magamit sa pang-araw-araw na buhay",
                        "Lessons that may be used in daily life"
                    ],
                    [
                        "C",
                        "Mga batas sa trapiko",
                        "Traffic laws"
                    ],
                    [
                        "D",
                        "Mga bagong imbensyon",
                        "New inventions"
                    ]
                ],
                "A"
            ],
            [
                "Ang watawat ng Pilipinas ay isang halimbawa ng ________.",
                "The Philippine flag is an example of ________.",
                [
                    [
                        "A",
                        "Pambansang simbolo na kumakatawan sa pagkakakilanlan ng bansa",
                        "A national symbol representing the country’s identity"
                    ],
                    [
                        "B",
                        "Simbolismo na nagpapakita ng kasaysayan at pagkakaisa ng mga Pilipino",
                        "Symbolism showing Filipino history and unity"
                    ],
                    [
                        "C",
                        "Kuwentong-bayan",
                        "Folklore"
                    ],
                    [
                        "D",
                        "Panitikan",
                        "Literature"
                    ]
                ],
                "A"
            ],
            [
                "Bakit mahalagang maging mapanuri sa pag-aaral ng kasaysayan?",
                "Why is it important to be critical when studying history?",
                [
                    [
                        "A",
                        "Upang masuri ang iba't ibang pananaw at batis ng impormasyon bago bumuo ng konklusyon",
                        "To examine different perspectives and information sources before forming a conclusion"
                    ],
                    [
                        "B",
                        "Upang matukoy ang pagiging mapagkakatiwalaan ng mga impormasyon tungkol sa kasaysayan",
                        "To determine the reliability of historical information"
                    ],
                    [
                        "C",
                        "Upang maniwala agad sa lahat ng impormasyon",
                        "To immediately believe all information"
                    ],
                    [
                        "D",
                        "Upang maiwasan ang pagbabasa",
                        "To avoid reading"
                    ]
                ],
                "A"
            ],
            [
                "Alin sa sumusunod ang pinakamahusay na nagpapakita ng wastong paggamit ng aral ng kasaysayan?",
                "Which best demonstrates proper use of lessons from history?",
                [
                    [
                        "A",
                        "Pagbalewala sa kasaysayan",
                        "Ignoring history"
                    ],
                    [
                        "B",
                        "Pag-iwas na maulit ang mga pagkakamaling naranasan noon",
                        "Avoiding the repetition of past mistakes"
                    ],
                    [
                        "C",
                        "Pagkatuto mula sa mga pagkakamali ng nakaraan upang makagawa ng mas mabuting desisyon",
                        "Learning from past mistakes to make better decisions"
                    ],
                    [
                        "D",
                        "Hindi pakikinig sa iba",
                        "Not listening to others"
                    ]
                ],
                "C"
            ],
            [
                "Ano ang isa sa pinakamahalagang bunga ng pagkakaroon ng kamalayang pangkasaysayan?",
                "What is one of the most important results of having historical consciousness?",
                [
                    [
                        "A",
                        "Pagiging responsableng mamamayan na nakikilahok sa pagpapaunlad ng lipunan",
                        "Becoming a responsible citizen who participates in improving society"
                    ],
                    [
                        "B",
                        "Pagpapahalaga sa sariling kultura, kasaysayan, at bansa",
                        "Valuing one’s culture, history, and country"
                    ],
                    [
                        "C",
                        "Paglimot sa mga tradisyon",
                        "Forgetting traditions"
                    ],
                    [
                        "D",
                        "Pagwawalang-bahala sa kasaysayan",
                        "Ignoring history"
                    ]
                ],
                "A"
            ],
            [
                "Alin sa sumusunod ang pinakamahusay na halimbawa ng taong may kamalayang pangkasaysayan?",
                "Which is the best example of a historically conscious person?",
                [
                    [
                        "A",
                        "Isang taong walang interes sa kultura ng bansa",
                        "A person with no interest in the country’s culture"
                    ],
                    [
                        "B",
                        "Isang mag-aaral na nirerespeto ang pambansang simbolo at nakikilahok sa mga gawaing pangkultura",
                        "A student who respects national symbols and participates in cultural activities"
                    ],
                    [
                        "C",
                        "Isang taong naninira ng mga makasaysayang pook",
                        "A person who damages historical sites"
                    ],
                    [
                        "D",
                        "Isang mag-aaral na nagpapahalaga sa pambansang simbolo, kultura, at kasaysayan ng Pilipinas at ginagamit ang mga aral nito sa pang-araw-araw na buhay.",
                        "A student who values Philippine national symbols, culture, and history and applies their lessons in daily life"
                    ]
                ],
                "D"
            ]
        ]
    },
    "2": {
        "title": "Summative Test",
        "lesson": 2,
        "type": "mixed",
        "tf": [
            [
                "Ang ilaya ay tumutukoy sa mababang lupa o tabing-dagat.",
                "Ilaya refers to lowlands or coastal areas.",
                false
            ],
            [
                "Ang Lepa-lepa ay tawag sa makukulay na bangka ng mga Moro.",
                "Lepa-lepa is the term for the colorful boats of the Moro.",
                false
            ],
            [
                "Ang Badjao ay kilala bilang nomadic people.",
                "The Badjao are known as nomadic people.",
                true
            ],
            [
                "Ang salitang bukot ay nangangahulugang “ilantad.”",
                "The word bukot means “to expose.”",
                false
            ],
            [
                "Ang pangunahing relihiyon ng Moro ay Kristiyanismo.",
                "The main religion of the Moro is Christianity.",
                false
            ]
        ],
        "id": [
            [
                "Tawag ng mga mananakop na Espanyol sa mga Muslim na kanilang natagpuang nakatira sa kapuluan ng Mindanao.",
                "Term used by Spanish colonizers for Muslims they found living in Mindanao.",
                "Moro"
            ],
            [
                "Siya ang huling prinsesa at isang binukot ng Tapaz, Capiz.",
                "She was the last princess and a Binukot of Tapaz, Capiz.",
                "Lola Ishang"
            ],
            [
                "Ang makukulay na bangka na sumasagisag sa kultura at pananampalataya ng Moro.",
                "The colorful boat symbolizing Moro culture and faith.",
                "Vinta"
            ],
            [
                "Tawag sa bangkang bahay ng mga Badjao.",
                "Term for the Badjao houseboat.",
                "Lepa-lepa"
            ],
            [
                "Tumutukoy sa pamayanang nasa mababang lupa, baybayin, tabing-dagat, o dalampasigan.",
                "Refers to a community in lowlands, coasts, seashores, or beaches.",
                "Ilawod"
            ]
        ],
        "mc": [
            [
                "Ano ang karaniwang ikinabubuhay ng mga taong naninirahan sa ilaya?",
                "What is a common livelihood of people living in Ilaya?",
                [
                    [
                        "A",
                        "Pangingisda at pangangalakal",
                        "Fishing and trading"
                    ],
                    [
                        "B",
                        "Pagtatanim, pangangaso, at pag-aalaga ng hayop",
                        "Farming, hunting, and animal raising"
                    ],
                    [
                        "C",
                        "Pagmimina at turismo",
                        "Mining and tourism"
                    ],
                    [
                        "D",
                        "Paggawa ng bangka",
                        "Boat making"
                    ]
                ],
                "B"
            ],
            [
                "Saan pangunahing naninirahan ang mga Igorot?",
                "Where do the Igorot primarily live?",
                [
                    [
                        "A",
                        "Kapatagan ng Visayas",
                        "Visayan plains"
                    ],
                    [
                        "B",
                        "Kabundukan ng Cordillera",
                        "Cordillera highlands"
                    ],
                    [
                        "C",
                        "Baybayin ng Mindanao",
                        "Mindanao coast"
                    ],
                    [
                        "D",
                        "Lambak ng Cagayan",
                        "Cagayan Valley"
                    ]
                ],
                "B"
            ],
            [
                "Ano ang pangunahing layunin ng tradisyong Binukot?",
                "What is the main purpose of the Binukot tradition?",
                [
                    [
                        "A",
                        "Sanayin ang kabataan sa pakikidigma",
                        "Train youth for warfare"
                    ],
                    [
                        "B",
                        "Mapanatili ang kagandahan, dangal, at kultura",
                        "Preserve beauty, dignity, and culture"
                    ],
                    [
                        "C",
                        "Turuan ang kabataan ng pangingisda",
                        "Teach fishing"
                    ],
                    [
                        "D",
                        "Ihanda ang kabataan sa pangangalakal",
                        "Prepare youth for trade"
                    ]
                ],
                "B"
            ],
            [
                "Alin sa sumusunod ang HINDI pangunahing kabuhayan ng mga tao sa ilawod?",
                "Which is NOT a main livelihood of people in Ilawod?",
                [
                    [
                        "A",
                        "Pangingisda",
                        "Fishing"
                    ],
                    [
                        "B",
                        "Paggawa ng bangka",
                        "Boat making"
                    ],
                    [
                        "C",
                        "Pangangalakal",
                        "Trading"
                    ],
                    [
                        "D",
                        "Pangangaso",
                        "Hunting"
                    ]
                ],
                "D"
            ],
            [
                "Ano ang kahulugan ng salitang bukot?",
                "What does the word bukot mean?",
                [
                    [
                        "A",
                        "Ilantad",
                        "Expose"
                    ],
                    [
                        "B",
                        "Itanggi",
                        "Deny"
                    ],
                    [
                        "C",
                        "Ipakita",
                        "Show"
                    ],
                    [
                        "D",
                        "Itago",
                        "Hide"
                    ]
                ],
                "D"
            ],
            [
                "Ano ang tawag sa pamayanang nasa mababang lupa, baybayin, o dalampasigan?",
                "What is the term for a community in lowlands, coastal areas, or seashores?",
                [
                    [
                        "A",
                        "Ilaya",
                        "Ilaya"
                    ],
                    [
                        "B",
                        "Ilawod",
                        "Ilawod"
                    ],
                    [
                        "C",
                        "Kabayanan",
                        "Town center"
                    ],
                    [
                        "D",
                        "Kapatagan",
                        "Plain"
                    ]
                ],
                "B"
            ],
            [
                "Ano ang pangunahing hanapbuhay ng mga taong naninirahan sa ilawod?",
                "What are the main livelihoods of people living in Ilawod?",
                [
                    [
                        "A",
                        "Pagtatanim at pangangaso",
                        "Farming and hunting"
                    ],
                    [
                        "B",
                        "Pangingisda, paggawa ng bangka, at pangangalakal",
                        "Fishing, boat making, and trading"
                    ],
                    [
                        "C",
                        "Pagmimina at paghahabi",
                        "Mining and weaving"
                    ],
                    [
                        "D",
                        "Pag-aalaga ng baka",
                        "Cattle raising"
                    ]
                ],
                "B"
            ],
            [
                "Sino ang tawag ng mga Espanyol sa mga Muslim na kanilang natagpuan sa Mindanao?",
                "What did the Spanish call the Muslims they encountered in Mindanao?",
                [
                    [
                        "A",
                        "Igorot",
                        "Igorot"
                    ],
                    [
                        "B",
                        "Badjao",
                        "Badjao"
                    ],
                    [
                        "C",
                        "Moro",
                        "Moro"
                    ],
                    [
                        "D",
                        "Tausug",
                        "Tausug"
                    ]
                ],
                "C"
            ],
            [
                "Alin sa sumusunod ang HINDI kabilang sa mga etnikong grupo ng Moro?",
                "Which is NOT among the Moro ethnic groups?",
                [
                    [
                        "A",
                        "Maranao",
                        "Maranao"
                    ],
                    [
                        "B",
                        "Yakan",
                        "Yakan"
                    ],
                    [
                        "C",
                        "Maguindanao",
                        "Maguindanao"
                    ],
                    [
                        "D",
                        "Igorot",
                        "Igorot"
                    ]
                ],
                "D"
            ],
            [
                "Ano ang may malaking impluwensiya sa kultura, batas, at edukasyon ng Moro?",
                "What has a major influence on Moro culture, law, and education?",
                [
                    [
                        "A",
                        "Budismo",
                        "Buddhism"
                    ],
                    [
                        "B",
                        "Kristiyanismo",
                        "Christianity"
                    ],
                    [
                        "C",
                        "Islam",
                        "Islam"
                    ],
                    [
                        "D",
                        "Hinduismo",
                        "Hinduism"
                    ]
                ],
                "C"
            ],
            [
                "Ano ang pangunahing paksa ng araling “Ugnayan ng Heograpiya at Kultura”?",
                "What is the main topic of the lesson “Relationship Between Geography and Culture”?",
                [
                    [
                        "A",
                        "Pag-unlad ng ekonomiya ng Pilipinas",
                        "Development of the Philippine economy"
                    ],
                    [
                        "B",
                        "Kaugnayan ng lokasyon sa pamumuhay, kabuhayan, at kultura ng mga tao",
                        "Relationship of location to people’s way of life, livelihood, and culture"
                    ],
                    [
                        "C",
                        "Kasaysayan ng pananakop ng Espanya",
                        "History of Spanish colonization"
                    ],
                    [
                        "D",
                        "Mga likas na yaman ng Asya",
                        "Natural resources of Asia"
                    ]
                ],
                "B"
            ],
            [
                "Ano ang konsepto ng pagkabansa na naging sentro ng pangarap ng Moro?",
                "What concept of nationhood became central to Moro aspirations?",
                [
                    [
                        "A",
                        "Bayanihan",
                        "Bayanihan"
                    ],
                    [
                        "B",
                        "Bangsa",
                        "Bangsa"
                    ],
                    [
                        "C",
                        "Kalayaan",
                        "Freedom"
                    ],
                    [
                        "D",
                        "Kasarinlan",
                        "Independence"
                    ]
                ],
                "B"
            ],
            [
                "Ano ang kahulugan ng Bangsa Moro?",
                "What does Bangsa Moro mean?",
                [
                    [
                        "A",
                        "Muslim Community",
                        "Muslim Community"
                    ],
                    [
                        "B",
                        "Moro Nation o Moro People",
                        "Moro Nation or Moro People"
                    ],
                    [
                        "C",
                        "Islamic Region",
                        "Islamic Region"
                    ],
                    [
                        "D",
                        "Cordillera Tribe",
                        "Cordillera Tribe"
                    ]
                ],
                "B"
            ],
            [
                "Ano ang tawag sa makukulay na bangka ng mga Moro?",
                "What is the term for the colorful boats of the Moro?",
                [
                    [
                        "A",
                        "Balangay",
                        "Balangay"
                    ],
                    [
                        "B",
                        "Lepa-lepa",
                        "Lepa-lepa"
                    ],
                    [
                        "C",
                        "Vinta",
                        "Vinta"
                    ],
                    [
                        "D",
                        "Karakoa",
                        "Karakoa"
                    ]
                ],
                "C"
            ],
            [
                "Ano ang tinutukoy ng Guerras Peraticas o The Sulu Zone?",
                "What does Guerras Peraticas or The Sulu Zone refer to?",
                [
                    [
                        "A",
                        "Digmaan sa kabundukan",
                        "Mountain warfare"
                    ],
                    [
                        "B",
                        "Digmaan sa dagat ng Moro at Espanyol",
                        "Sea wars between the Moro and Spanish"
                    ],
                    [
                        "C",
                        "Panakop ng Amerika",
                        "American colonization"
                    ],
                    [
                        "D",
                        "Labanan ng Igorot at Espanyol",
                        "Conflict between Igorot and Spanish"
                    ]
                ],
                "B"
            ],
            [
                "Bakit tinatawag na sea gypsies ang mga Badjao?",
                "Why are the Badjao called sea gypsies?",
                [
                    [
                        "A",
                        "Dahil sila ay mangangalakal",
                        "Because they are traders"
                    ],
                    [
                        "B",
                        "Dahil naninirahan sila sa bangkang bahay at palipat-lipat ng lugar",
                        "Because they live in houseboats and move from place to place"
                    ],
                    [
                        "C",
                        "Dahil mahilig silang maglakbay sa bundok",
                        "Because they like traveling in mountains"
                    ],
                    [
                        "D",
                        "Dahil sila ay mga magsasaka",
                        "Because they are farmers"
                    ]
                ],
                "B"
            ],
            [
                "Ano ang tawag sa patuloy na pag-iyak ng mga kamag-anak sa pagkamatay ng mahal sa buhay?",
                "What is the term for relatives’ continued crying after the death of a loved one?",
                [
                    [
                        "A",
                        "Akalummuh",
                        "Akalummuh"
                    ],
                    [
                        "B",
                        "Asammal",
                        "Asammal"
                    ],
                    [
                        "C",
                        "Lindur amdam",
                        "Lindur amdam"
                    ],
                    [
                        "D",
                        "Bangsa",
                        "Bangsa"
                    ]
                ],
                "C"
            ],
            [
                "Ano ang pinahahalagahan sa konseptong Akalummuh?",
                "What is valued in the concept of Akalummuh?",
                [
                    [
                        "A",
                        "Katapatan ng lalaki",
                        "Male loyalty"
                    ],
                    [
                        "B",
                        "Dalisay ng babae bago ikasal",
                        "A woman’s purity before marriage"
                    ],
                    [
                        "C",
                        "Katapangan sa digmaan",
                        "Bravery in war"
                    ],
                    [
                        "D",
                        "Pagiging mahusay sa pangingisda",
                        "Skill in fishing"
                    ]
                ],
                "B"
            ],
            [
                "Ano ang tawag sa hindi pagsunod sa pagpapahalagang pinapairal ng Akalummuh?",
                "What is the term for not following the value upheld by Akalummuh?",
                [
                    [
                        "A",
                        "Lindur amdam",
                        "Lindur amdam"
                    ],
                    [
                        "B",
                        "Bangsa",
                        "Bangsa"
                    ],
                    [
                        "C",
                        "Asammal",
                        "Asammal"
                    ],
                    [
                        "D",
                        "Bukot",
                        "Bukot"
                    ]
                ],
                "C"
            ],
            [
                "Alin sa sumusunod ang nagpapakita ng ugnayan ng heograpiya at kultura?",
                "Which shows the relationship between geography and culture?",
                [
                    [
                        "A",
                        "Ang mga taong naninirahan sa ilawod ay nakatuon sa pangingisda at paggawa ng bangka.",
                        "People living in Ilawod focus on fishing and boat making."
                    ],
                    [
                        "B",
                        "Ang lahat ng pamayanan ay may iisang paraan ng pamumuhay.",
                        "All communities have the same way of life."
                    ],
                    [
                        "C",
                        "Walang epekto ang lokasyon sa kultura ng tao.",
                        "Location has no effect on people’s culture."
                    ],
                    [
                        "D",
                        "Pare-pareho ang hanapbuhay ng mga nasa ilaya at ilawod.",
                        "People in Ilaya and Ilawod have identical livelihoods."
                    ]
                ],
                "A"
            ]
        ]
    }
};

/* ==================== 2. CURRENT ASSESSMENT / DOM REFERENCES ==================== */

const assessmentNo = Number(
    (document.body.dataset.page || '').replace('assessment', '')
);

const AD = ASSESSMENT_DATA[assessmentNo];

const lockA = document.getElementById('assessmentLock');
const shellA = document.getElementById('assessmentShell');
const area = document.getElementById('assessmentQuestionArea');
const counterA = document.getElementById('assessmentCounter');
const answeredCount = document.getElementById('answeredCount');
const progressA = document.getElementById('assessmentProgress');
const prevA = document.getElementById('assessmentPrev');
const nextA = document.getElementById('assessmentNext');
const submitA = document.getElementById('assessmentSubmit');
const resultA = document.getElementById('assessmentResult');
const finalA = document.getElementById('assessmentFinalScore');
const retryA = document.getElementById('assessmentRetry');

let flat = [];
let answers = [];
let pos = 0;


/* ==================== 3. LANGUAGE / DATA PREPARATION ==================== */

function L() {
    return localStorage.getItem('ehistory-language') || 'FIL';
}

function build() {
    flat = [];

    if (assessmentNo === 1) {
        AD.questions.forEach((question) => {
            flat.push({
                kind: 'mc',
                fil: question[0],
                en: question[1],
                choices: question[2],
                answer: question[3]
            });
        });
    } else {
        AD.tf.forEach((question) => {
            flat.push({
                kind: 'tf',
                fil: question[0],
                en: question[1],
                answer: question[2]
            });
        });

        AD.id.forEach((question) => {
            flat.push({
                kind: 'id',
                fil: question[0],
                en: question[1],
                answer: question[2]
            });
        });

        AD.mc.forEach((question) => {
            flat.push({
                kind: 'mc',
                fil: question[0],
                en: question[1],
                choices: question[2],
                answer: question[3]
            });
        });
    }

    answers = Array(flat.length).fill(null);
}

function unlocked() {
    // The assessment opens only when all three activities
    // for the assessment's lesson are completed.
    return [1, 2, 3].every(
        (activityNumber) =>
            localStorage.getItem(
                `ehistory-l${AD.lesson}-a${activityNumber}-completed`
            ) === 'true'
    );
}


/* ==================== 4. QUESTION RENDERING ==================== */

function renderQ() {
    const question = flat[pos];
    const language = L();

    counterA.textContent = `${pos + 1} / ${flat.length}`;

    const completedAnswers = answers.filter(
        (value) => value !== null && value !== ''
    ).length;

    answeredCount.textContent = `${completedAnswers} / ${flat.length}`;
    progressA.style.width = `${(completedAnswers / flat.length) * 100}%`;
    submitA.disabled = completedAnswers !== flat.length;

    let html = `
        <div class="assessment-question">
            <span class="section-label">${language === 'FIL' ? 'AYTEM' : 'ITEM'} ${pos + 1}</span>
            <h2>${language === 'FIL' ? question.fil : question.en}</h2>
    `;

    if (question.kind === 'mc') {
        html += `
            <div class="assessment-options">
                ${question.choices
                    .map(
                        (choice) => `
                            <button
                                type="button"
                                class="assessment-option ${
                                    answers[pos] === choice[0] ? 'selected' : ''
                                }"
                                data-value="${choice[0]}"
                            >
                                <span>${choice[0]}</span>
                                <div>${language === 'FIL' ? choice[1] : choice[2]}</div>
                            </button>
                        `
                    )
                    .join('')}
            </div>
        `;
    } else if (question.kind === 'tf') {
        const options = [
            [true, language === 'FIL' ? 'Tama' : 'True'],
            [false, language === 'FIL' ? 'Mali' : 'False']
        ];

        html += `
            <div class="assessment-options">
                ${options
                    .map(
                        (option) => `
                            <button
                                type="button"
                                class="assessment-option ${
                                    answers[pos] === option[0] ? 'selected' : ''
                                }"
                                data-value="${option[0]}"
                            >
                                <span>${language === 'FIL' ? (option[0] ? 'T' : 'M') : (option[0] ? 'T' : 'F')}</span>
                                <div>${option[1]}</div>
                            </button>
                        `
                    )
                    .join('')}
            </div>
        `;
    } else {
        html += `
            <input
                class="assessment-input"
                id="idAnswer"
                value="${answers[pos] || ''}"
                placeholder="${
                    language === 'FIL'
                        ? 'Ilagay ang sagot...'
                        : 'Enter your answer...'
                }"
            >
        `;
    }

    html += '</div>';
    area.innerHTML = html;

    // Attach answer handlers after the question HTML is rendered.
    if (question.kind === 'mc' || question.kind === 'tf') {
        area.querySelectorAll('.assessment-option').forEach((button) => {
            button.addEventListener('click', () => {
                answers[pos] =
                    question.kind === 'tf'
                        ? button.dataset.value === 'true'
                        : button.dataset.value;

                renderQ();
            });
        });
    } else {
        area.querySelector('#idAnswer').addEventListener('input', (event) => {
            answers[pos] = event.target.value;
            updateStatus();
        });
    }

    prevA.disabled = pos === 0;
    nextA.disabled = pos === flat.length - 1;
}

function updateStatus() {
    const completedAnswers = answers.filter(
        (value) => value !== null && value !== ''
    ).length;

    answeredCount.textContent = `${completedAnswers} / ${flat.length}`;
    progressA.style.width = `${(completedAnswers / flat.length) * 100}%`;
    submitA.disabled = completedAnswers !== flat.length;
}


/* ==================== 5. SCORING ==================== */

function norm(value) {
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[‐‑–—]/g, '-')
        .replace(/\s+/g, ' ');
}

function score() {
    let totalScore = 0;

    flat.forEach((question, index) => {
        if (question.kind === 'id') {
            if (norm(answers[index]) === norm(question.answer)) {
                totalScore += 1;
            }
        } else if (answers[index] === question.answer) {
            totalScore += 1;
        }
    });

    return totalScore;
}


/* ==================== 6. SUBMISSION / SAVING ==================== */

function finish() {
    const finalScoreValue = score();

    shellA.style.display = 'none';
    resultA.classList.add('show');
    finalA.textContent = `${finalScoreValue} / ${flat.length}`;

    localStorage.setItem(
        `ehistory-assessment-${assessmentNo}-completed`,
        'true'
    );

    localStorage.setItem(
        `ehistory-assessment-${assessmentNo}-score`,
        String(finalScoreValue)
    );

    const oldBest = Number(
        localStorage.getItem(`ehistory-assessment-${assessmentNo}-best`) || 0
    );

    if (finalScoreValue > oldBest) {
        localStorage.setItem(
            `ehistory-assessment-${assessmentNo}-best`,
            String(finalScoreValue)
        );
    }

    window.dispatchEvent(new Event('ehistory:progresschange'));
}


/* ==================== 7. BUTTON / LANGUAGE EVENTS ==================== */

if (prevA) {
    prevA.addEventListener('click', () => {
        if (pos > 0) {
            pos -= 1;
            renderQ();
        }
    });
}

if (nextA) {
    nextA.addEventListener('click', () => {
        if (pos < flat.length - 1) {
            pos += 1;
            renderQ();
        }
    });
}

if (submitA) {
    submitA.addEventListener('click', finish);
}

if (retryA) {
    retryA.addEventListener('click', () => {
        answers = Array(flat.length).fill(null);
        pos = 0;

        resultA.classList.remove('show');
        shellA.style.display = 'block';
        renderQ();
    });
}

window.addEventListener('ehistory:languagechange', () => {
    if (shellA?.style.display !== 'none') {
        renderQ();
    }
});


/* ==================== 8. INITIAL ACCESS CHECK ==================== */

if (AD) {
    build();

    if (unlocked()) {
        lockA.style.display = 'none';
        shellA.style.display = 'block';
        renderQ();
    } else {
        lockA.style.display = 'block';
        shellA.style.display = 'none';
    }
}
