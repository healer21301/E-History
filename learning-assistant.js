/* ============================================================
   E-HISTORY — PHASE 15 LEARNING ASSISTANT
   ============================================================
   PURPOSE
   - Lesson-grounded study support for Lessons 1–3
   - Bilingual FIL / EN responses
   - Progress-aware next-step recommendations
   - Lightweight practice questions (not formal assessments)
   - No external AI service or API key required

   IMPORTANT
   - Responses are intentionally limited to the current E-HISTORY lessons.
   - Formal assessment/exam answer keys are never exposed here.

   QUICK MAP
   1. DOM references / state
   2. Language / utility helpers
   3. Lesson knowledge base
   4. Progress helpers
   5. Message rendering
   6. Core assistant responses
   7. Practice question flow
   8. User input handling
   9. Firebase-aware personalization
   10. Initialization
   ============================================================ */

/* ==================== 1. DOM REFERENCES / STATE ==================== */

const assistantMessages = document.getElementById('assistantMessages');
const assistantForm = document.getElementById('assistantForm');
const assistantInput = document.getElementById('assistantInput');
const assistantClear = document.getElementById('assistantClear');
const assistantProgressPercent = document.getElementById('assistantProgressPercent');
const assistantProgressLabel = document.getElementById('assistantProgressLabel');
const assistantProgressFill = document.getElementById('assistantProgressFill');

const TOTAL_MILESTONES = 15;

let conversation = [];
let currentProfile = null;
let pendingPractice = null;
let practiceCursor = 0;


/* ==================== 2. LANGUAGE / UTILITY HELPERS ==================== */

function assistantLanguage() {
    return localStorage.getItem('ehistory-language') || 'FIL';
}

function t(fil, en) {
    return assistantLanguage() === 'EN' ? en : fil;
}

function normalize(value = '') {
    return String(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[“”‘’'".,!?;:()\[\]{}\/\\_-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function includesAny(text, terms = []) {
    return terms.some((term) => text.includes(normalize(term)));
}

function messageText(message) {
    if (message.role === 'user') {
        return message.text;
    }

    return assistantLanguage() === 'EN'
        ? message.en
        : message.fil;
}

function sourceText(message) {
    if (!message.sourceFil && !message.sourceEn) {
        return '';
    }

    return assistantLanguage() === 'EN'
        ? message.sourceEn
        : message.sourceFil;
}

function linkText() {
    return t('Buksan ang aralin', 'Open lesson');
}

function escapeHtml(value = '') {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}


/* ==================== 3. LESSON KNOWLEDGE BASE ==================== */

const LESSONS = {
    1: {
        filTitle: 'Mga Palatandaan at Katangian ng Kamalayang Pangkasaysayan',
        enTitle: 'Indicators and Characteristics of Historical Consciousness',
        link: 'lesson-1.html',
        summaryFil:
            'Ang Aralin 1 ay tumatalakay sa kamalayang pangkasaysayan—ang pag-unawa at pagpapahalaga sa kasaysayan ng bansa at lipunan. Kabilang sa mahahalagang palatandaan nito ang Simbolismo, Tradisyon, at Kuwentong-bayan. Ang taong may kamalayang pangkasaysayan ay mapanuri, kritikal, nakakaugnay sa nakaraan, kasalukuyan, at hinaharap, nagpapahalaga sa pamanang kultural, nagmamahal sa bayan, at aktibong nakikilahok sa lipunan.',
        summaryEn:
            'Lesson 1 discusses historical consciousness—the understanding and appreciation of the history of one’s country and society. Important indicators include Symbolism, Tradition, and Folklore. A historically conscious person is analytical and critical, connects the past, present, and future, values cultural heritage, loves the country, and actively participates in society.'
    },
    2: {
        filTitle: 'Ugnayan ng Heograpiya at Kultura',
        enTitle: 'Relationship Between Geography and Culture',
        link: 'lesson-2.html',
        summaryFil:
            'Ang Aralin 2 ay nagpapakita kung paano nauugnay ang lokasyon at kapaligiran sa pamumuhay at kultura. Tinalakay rito ang Ilaya at Ilawod, Igorot, Binukot, Moro at Bangsa Moro, Vinta at Guerras Peraticas, Badjao at Lepa-lepa, at mga pagpapahalagang Lindur amdam, Akalummuh, at Asammal.',
        summaryEn:
            'Lesson 2 shows how location and environment relate to ways of life and culture. It covers Ilaya and Ilawod, Igorot, Binukot, Moro and Bangsa Moro, Vinta and Guerras Peraticas, Badjao and Lepa-lepa, and the values Lindur amdam, Akalummuh, and Asammal.'
    },
    3: {
        filTitle: 'Paniniwala at Pananampalataya',
        enTitle: 'Beliefs and Faith',
        link: 'lesson-3.html',
        summaryFil:
            'Ang Aralin 3 ay tumatalakay sa ugnayan ng identidad, komunidad, kultura, at mga tradisyunal na paniniwala. Kabilang dito ang Hiyas, Anting-anting, Ginhawa, mga paniniwala tungkol sa kamatayan at kabilang-buhay, at mga tradisyunal na paraan o katauhan sa pagpapagaling gaya ng Baylan, Tutho, Hilot, Tawas, Pausok, at Kamangyan.',
        summaryEn:
            'Lesson 3 discusses the relationship among identity, community, culture, and traditional beliefs. It includes Hiyas, Anting-anting, Ginhawa, beliefs about death and the afterlife, and traditional healing roles or practices such as Baylan, Tutho, Hilot, Tawas, Pausok, and Kamangyan.'
    }
};

const KNOWLEDGE = [
    {
        lesson: 1,
        terms: ['kamalayang pangkasaysayan', 'historical consciousness', 'kamalayan sa kasaysayan'],
        fil: 'Ang kamalayang pangkasaysayan ay pag-unawa at pagpapahalaga sa kasaysayan ng bansa at lipunan. Tinutulungan nitong makilala ang pagkakakilanlan, kultura, at mga pagpapahalagang Pilipino, at gamitin ang mga aral ng nakaraan sa matalinong pagpapasya sa kasalukuyan at hinaharap.',
        en: 'Historical consciousness is the understanding and appreciation of the history of one’s country and society. It helps people recognize identity, culture, and Filipino values and use lessons from the past to make wise decisions in the present and future.'
    },
    {
        lesson: 1,
        terms: ['palatandaan ng kamalayang pangkasaysayan', 'indicators of historical consciousness', 'palatandaan'],
        fil: 'Ang mga palatandaan ng kamalayang pangkasaysayan ay nagpapakita ng pagpapahalaga at pag-unawa sa kasaysayan. Kasama rito ang kakayahang magsuri ng mga pangyayari, kilalanin ang iba’t ibang pananaw, at pahalagahan ang mga batis ng impormasyon.',
        en: 'Indicators of historical consciousness show appreciation and understanding of history. They include the ability to analyze events, recognize different perspectives, and value sources of information.'
    },
    {
        lesson: 1,
        terms: ['simbolismo', 'symbolism', 'sagisag', 'symbol'],
        fil: 'Ang Simbolismo ay paggamit ng mga sagisag o representasyon ng mahahalagang tao, pangyayari, at ideya sa kasaysayan. Halimbawa nito ang mga bantayog, watawat, at simbolong nagpapaalala ng kabayanihan at pagkakaisa.',
        en: 'Symbolism is the use of symbols or representations of important people, events, and ideas in history. Examples include monuments, flags, and symbols that remind people of heroism and unity.'
    },
    {
        lesson: 1,
        terms: ['tradisyon', 'tradition', 'kaugalian', 'custom'],
        fil: 'Ang Tradisyon ay mga kaugalian, gawi, at paniniwalang naipapasa mula sa isang henerasyon tungo sa susunod. Sumasalamin ito sa pagkakakilanlan, pagpapahalaga, at paraan ng pamumuhay ng mga Pilipino.',
        en: 'Tradition refers to customs, practices, and beliefs passed from one generation to the next. It reflects Filipino identity, values, and ways of life.'
    },
    {
        lesson: 1,
        terms: ['kuwentong bayan', 'kuwentong-bayan', 'folklore', 'alamat', 'mitolohiya', 'epiko'],
        fil: 'Ang Kuwentong-bayan ay mga salaysay tungkol sa paniniwala, karanasan, at pinagmulan ng mga bagay sa lipunan. Kabilang dito ang alamat, mitolohiya, at epiko na naipapasa sa tradisyong pasalita at nagsisilbing batis sa pag-unawa sa kultura ng mga ninuno.',
        en: 'Folklore consists of stories about beliefs, experiences, and the origins of things in society. It includes legends, mythology, and epics passed through oral tradition and can serve as a source for understanding ancestral culture.'
    },
    {
        lesson: 1,
        terms: ['katangian ng kamalayang pangkasaysayan', 'characteristics of historical consciousness', 'mapanuri', 'kritikal'],
        fil: 'Ang taong may kamalayang pangkasaysayan ay kayang iugnay ang nakaraan, kasalukuyan, at hinaharap. Siya ay mapanuri at kritikal, gumagamit ng mga aral ng kasaysayan sa wastong pagpapasya, nagmamahal sa bayan, nagpapahalaga sa pamanang kultural, at aktibong nakikilahok sa lipunan.',
        en: 'A historically conscious person can connect the past, present, and future. They are analytical and critical, use lessons from history in sound decision-making, love the country, value cultural heritage, and actively participate in society.'
    },
    {
        lesson: 2,
        terms: ['ilaya'],
        fil: 'Ang Ilaya ay tumutukoy sa itaas o upstream ng ilog at sa mga pamayanang nasa mataas na lugar gaya ng kabundukan at burol. Karaniwang ikinabubuhay dito ang pagtatanim, pangangaso, at pag-aalaga ng hayop.',
        en: 'Ilaya refers to the upper or upstream part of a river and communities in high areas such as mountains and hills. Common livelihoods include farming, hunting, and animal raising.'
    },
    {
        lesson: 2,
        terms: ['igorot'],
        fil: 'Ang Igorot ay katutubong pangkat na naninirahan sa kabundukan ng Cordillera sa Luzon. Kilala sila sa pagpapanatili ng mayamang kultura, tradisyon, at sinaunang kaugaliang naipapasa sa bawat henerasyon.',
        en: 'The Igorot are an indigenous group living in the Cordillera highlands of Luzon. They are known for preserving rich culture, traditions, and ancient practices passed through generations.'
    },
    {
        lesson: 2,
        terms: ['binukot', 'bukot', 'lola ishang'],
        fil: 'Ang Binukot ay tradisyong pangkultura ng ilang pangkat sa Kapatagan ng Visayas kung saan ang isang dalaga ay inaalagaan at inihihiwalay upang mapanatili ang kaniyang kagandahan, dangal, at kultura ng komunidad. Ang bukot ay nangangahulugang “itago.” Binanggit sa aralin si Lola Ishang bilang huling prinsesa, isang Binukot ng Tapaz, Capiz.',
        en: 'Binukot is a cultural tradition among some groups in the Visayan plains in which a young woman is cared for and secluded to preserve her beauty, dignity, and community culture. The word bukot means “to hide.” The lesson identifies Lola Ishang as the last princess, a Binukot of Tapaz, Capiz.'
    },
    {
        lesson: 2,
        terms: ['ilawod'],
        fil: 'Ang Ilawod ay pamayanang nasa mababang lupa, baybayin, tabing-dagat, o dalampasigan. Karaniwang nakatuon ang pamumuhay sa pangingisda, paggawa ng bangka, at pangangalakal.',
        en: 'Ilawod refers to a community in lowlands, coastal areas, seashores, or beaches. Livelihood commonly centers on fishing, boat making, and trade.'
    },
    {
        lesson: 2,
        terms: ['moro', 'bangsa moro', 'bangsamoro', 'bangsa'],
        fil: 'Sa aralin, Moro ang tawag ng mga mananakop na Espanyol sa mga Muslim na kanilang natagpuan sa Mindanao. Kabilang sa mga grupong binanggit ang Tausug, Maranao, Yakan, at Maguindanao. Ang Bangsa ay konsepto ng pagkabansa; ang Bangsa Moro ay “Moro Nation” o “Moro People.”',
        en: 'In the lesson, Moro is the term used by Spanish colonizers for Muslims they encountered in Mindanao. Groups mentioned include Tausug, Maranao, Yakan, and Maguindanao. Bangsa refers to nationhood; Bangsa Moro means “Moro Nation” or “Moro People.”'
    },
    {
        lesson: 2,
        terms: ['vinta'],
        fil: 'Ang Vinta ay makulay na bangka na nagsasalarawan sa makulay na tradisyon at kulturang kaugnay ng pananampalatayang Islam.',
        en: 'The Vinta is a colorful boat that reflects colorful traditions and culture associated with Islam.'
    },
    {
        lesson: 2,
        terms: ['guerras peraticas', 'sulu zone', 'the sulu zone', 'sea wars'],
        fil: 'Ang Guerras Peraticas o The Sulu Zone ay tumutukoy sa sea wars o digmaan sa dagat ng Moro at Espanyol.',
        en: 'Guerras Peraticas or The Sulu Zone refers to the sea wars between the Moro and the Spanish.'
    },
    {
        lesson: 2,
        terms: ['badjao', 'sea gypsies', 'nomadic people'],
        fil: 'Kilala ang Badjao bilang sea gypsies at nomadic people dahil sa paninirahan sa mga bahay-bangka at palipat-lipat na pamumuhay.',
        en: 'The Badjao are known as sea gypsies and nomadic people because of their houseboat living and mobile way of life.'
    },
    {
        lesson: 2,
        terms: ['lepa lepa', 'lepa-lepa', 'bahay bangka', 'houseboat'],
        fil: 'Ang Lepa-lepa ang tawag sa bangkang bahay ng Badjao.',
        en: 'Lepa-lepa is the term for the Badjao houseboat.'
    },
    {
        lesson: 2,
        terms: ['lindur amdam'],
        fil: 'Ang Lindur amdam ay patuloy na pag-iyak ng mga kamag-anak sa pagkamatay ng mahal sa buhay.',
        en: 'Lindur amdam refers to the continued crying of relatives after the death of a loved one.'
    },
    {
        lesson: 2,
        terms: ['akalummuh'],
        fil: 'Ang Akalummuh ay pagpapahalaga sa pagiging dalisay ng babae bago ikasal.',
        en: 'Akalummuh values a woman’s purity before marriage.'
    },
    {
        lesson: 2,
        terms: ['asammal'],
        fil: 'Ang Asammal ay hindi pagsunod sa pagpapahalagang Akalummuh, gaya ng paghawak sa kamay ng babae nang hindi pa kasal.',
        en: 'Asammal refers to failing to follow the value of Akalummuh, such as holding a woman’s hand before marriage.'
    },
    {
        lesson: 3,
        terms: ['konteksto ng sariling komunidad', 'context of one s community', 'community context', 'identidad', 'identity'],
        fil: 'Ayon sa Aralin 3, ang identidad ng isang tao ay nahuhubog ng kaniyang komunidad, kultura, at mga karanasang nararanasan sa lipunan.',
        en: 'According to Lesson 3, a person’s identity is shaped by their community, culture, and experiences in society.'
    },
    {
        lesson: 3,
        terms: ['hiyas'],
        fil: 'Ang Hiyas ay tumutukoy sa mga alahas na nagsisilbing palamuti at simbolo ng katayuan sa lipunan.',
        en: 'Hiyas refers to jewelry used as adornment and as a symbol of social status.'
    },
    {
        lesson: 3,
        terms: ['anting anting', 'anting-anting', 'agimat'],
        fil: 'Ang Anting-anting o agimat ay bagay na pinaniniwalaang nagbibigay ng proteksiyon o suwerte sa may-ari nito.',
        en: 'Anting-anting, also called agimat, is an object believed to give protection or luck to its owner.'
    },
    {
        lesson: 3,
        terms: ['ginhawa', 'well being', 'well-being'],
        fil: 'Ang Ginhawa ay kaginhawaan sa balanseng kalagayan ng katawan, isip, at damdamin.',
        en: 'Ginhawa is a state of well-being involving balance of the body, mind, and emotions.'
    },
    {
        lesson: 3,
        terms: ['kamatayan', 'death', 'kabilang buhay', 'kabilang-buhay', 'afterlife'],
        fil: 'Sa aralin, ang kamatayan ay itinuturing na natural na bahagi ng buhay at tanda ng pagtatapos ng buhay sa mundo. Ang kabilang-buhay ay paniniwalang nagpapatuloy ang paglalakbay ng kaluluwa matapos ang kamatayan.',
        en: 'In the lesson, death is considered a natural part of life and marks the end of earthly life. The afterlife is the belief that the soul’s journey continues after death.'
    },
    {
        lesson: 3,
        terms: ['baylan'],
        fil: 'Ang Baylan ay katutubong manggagamot o espiritwal na pinuno na gumagamot gamit ang tradisyonal na kaalaman, halamang gamot, ritwal, at panalangin.',
        en: 'A Baylan is an indigenous healer or spiritual leader who treats illness using traditional knowledge, medicinal plants, rituals, and prayer.'
    },
    {
        lesson: 3,
        terms: ['tutho'],
        fil: 'Ang Tutho ay tradisyonal na paraan ng pagpapagaling na gumagamit ng laway.',
        en: 'Tutho is a traditional healing method that uses saliva.'
    },
    {
        lesson: 3,
        terms: ['hilot'],
        fil: 'Ang Hilot ay gumagamit ng masahe, paghaplos, at pagmamanipula ng katawan upang maibsan ang pananakit o discomfort.',
        en: 'Hilot uses massage, stroking, and body manipulation to relieve pain or discomfort.'
    },
    {
        lesson: 3,
        terms: ['tawas'],
        fil: 'Ang Tawas ay tradisyonal na paraan ng pagtukoy sa pinaniniwalaang sanhi ng karamdaman.',
        en: 'Tawas is a traditional method for identifying a believed cause of illness.'
    },
    {
        lesson: 3,
        terms: ['pausok'],
        fil: 'Ang Pausok ay gumagamit ng usok mula sa sinusunog na halaman o materyales bilang bahagi ng ritwal o pagpapagaling.',
        en: 'Pausok uses smoke from burned plants or materials as part of ritual or healing.'
    },
    {
        lesson: 3,
        terms: ['kamangyan'],
        fil: 'Ang Kamangyan ay mabangong dagta o resin na sinusunog upang makalikha ng mabangong usok para sa paglilinis ng lugar o pag-aalis ng masasamang elemento.',
        en: 'Kamangyan is fragrant resin burned to produce aromatic smoke for cleansing a place or removing harmful elements.'
    }
];

const PRACTICE_BANK = [
    {
        lesson: 1,
        qFil: 'Anong palatandaan ng kamalayang pangkasaysayan ang tumutukoy sa mga kaugaliang naipapasa sa bawat henerasyon?',
        qEn: 'Which indicator of historical consciousness refers to customs passed from one generation to the next?',
        accepted: ['tradisyon', 'tradition'],
        aFil: 'Tama: Tradisyon. Ito ang mga kaugalian, gawi, at paniniwalang naipapasa mula sa isang henerasyon tungo sa susunod.',
        aEn: 'Correct: Tradition. These are customs, practices, and beliefs passed from one generation to the next.'
    },
    {
        lesson: 1,
        qFil: 'Ano ang tawag sa mga alamat, mitolohiya, at epikong naipapasa sa tradisyong pasalita?',
        qEn: 'What do we call legends, mythology, and epics passed through oral tradition?',
        accepted: ['kuwentong bayan', 'kuwentong-bayan', 'folklore'],
        aFil: 'Tama: Kuwentong-bayan. Nagsisilbi itong mahalagang batis sa pag-unawa sa pananaw at kultura ng mga ninuno.',
        aEn: 'Correct: Folklore. It can serve as an important source for understanding ancestral perspectives and culture.'
    },
    {
        lesson: 2,
        qFil: 'Alin ang tumutukoy sa pamayanang nasa mataas na lugar o upstream ng ilog: Ilaya o Ilawod?',
        qEn: 'Which refers to communities in high areas or upstream of a river: Ilaya or Ilawod?',
        accepted: ['ilaya'],
        aFil: 'Tama: Ilaya. Karaniwang kaugnay nito ang pagtatanim, pangangaso, at pag-aalaga ng hayop.',
        aEn: 'Correct: Ilaya. Common livelihoods include farming, hunting, and animal raising.'
    },
    {
        lesson: 2,
        qFil: 'Ano ang tawag sa bangkang bahay ng Badjao?',
        qEn: 'What is the term for the Badjao houseboat?',
        accepted: ['lepa lepa', 'lepa-lepa'],
        aFil: 'Tama: Lepa-lepa.',
        aEn: 'Correct: Lepa-lepa.'
    },
    {
        lesson: 3,
        qFil: 'Ano ang tawag sa bagay na pinaniniwalaang nagbibigay ng proteksiyon o suwerte?',
        qEn: 'What is the object believed to give protection or luck called?',
        accepted: ['anting anting', 'anting-anting', 'agimat'],
        aFil: 'Tama: Anting-anting o agimat.',
        aEn: 'Correct: Anting-anting or agimat.'
    },
    {
        lesson: 3,
        qFil: 'Anong tradisyonal na paraan ng pagpapagaling ang gumagamit ng masahe, paghaplos, at pagmamanipula ng katawan?',
        qEn: 'Which traditional healing method uses massage, stroking, and body manipulation?',
        accepted: ['hilot'],
        aFil: 'Tama: Hilot.',
        aEn: 'Correct: Hilot.'
    }
];


/* ==================== 4. PROGRESS HELPERS ==================== */

function done(key) {
    return localStorage.getItem(key) === 'true';
}

function lessonDone(lesson) {
    return [1, 2, 3].every((activity) =>
        done(`ehistory-l${lesson}-a${activity}-completed`)
    );
}

function completedMilestones() {
    let total = 0;

    for (let lesson = 1; lesson <= 3; lesson += 1) {
        if (lessonDone(lesson)) {
            total += 1;
        }

        for (let activity = 1; activity <= 3; activity += 1) {
            if (done(`ehistory-l${lesson}-a${activity}-completed`)) {
                total += 1;
            }
        }
    }

    if (done('ehistory-assessment-1-completed')) total += 1;
    if (done('ehistory-assessment-2-completed')) total += 1;
    if (done('ehistory-exam-completed')) total += 1;

    return total;
}

function refreshAssistantProgress() {
    const completed = completedMilestones();
    const percent = Math.round((completed / TOTAL_MILESTONES) * 100);

    assistantProgressPercent.textContent = `${percent}%`;
    assistantProgressFill.style.width = `${percent}%`;
    assistantProgressLabel.textContent = t(
        `${completed} sa ${TOTAL_MILESTONES} milestone`,
        `${completed} of ${TOTAL_MILESTONES} milestones`
    );
}

function nextLearningStep() {
    const steps = [
        {
            check: () => done('ehistory-l1-a1-completed'),
            link: 'lesson-1.html',
            fil: 'Simulan sa Aralin 1 at Mini Gawain 1. Balikan muna ang Simbolismo, Tradisyon, at Kuwentong-bayan bago sagutan ang unang gawain.',
            en: 'Start with Lesson 1 and Mini Activity 1. Review Symbolism, Tradition, and Folklore before answering the first activity.'
        },
        {
            check: () => done('ehistory-l1-a2-completed'),
            link: 'lesson-1-activity-2.html',
            fil: 'Susunod: Mini Gawain 2 ng Aralin 1 — “May Kamalayang Pangkasaysayan o Wala?”',
            en: 'Next: Lesson 1 Mini Activity 2 — “Historically Conscious or Not?”'
        },
        {
            check: () => done('ehistory-l1-a3-completed'),
            link: 'lesson-1-activity-3.html',
            fil: 'Susunod: Mini Gawain 3 ng Aralin 1 — gamitin ang aral ng nakaraan sa pagpapasya sa kasalukuyan.',
            en: 'Next: Lesson 1 Mini Activity 3 — apply lessons from the past to decisions in the present.'
        },
        {
            check: () => done('ehistory-assessment-1-completed'),
            link: 'assessment-1.html',
            fil: 'Natapos mo na ang tatlong Mini Gawain sa Aralin 1. Susunod ang Lagumang Pagtataya 1.',
            en: 'You completed all three Lesson 1 Mini Activities. Your next step is Summative Assessment 1.'
        },
        {
            check: () => done('ehistory-l2-a1-completed'),
            link: 'lesson-2.html',
            fil: 'Magpatuloy sa Aralin 2. Unahin ang pagbalik-aral sa Ilaya at Ilawod bago Mini Gawain 1.',
            en: 'Continue to Lesson 2. Review Ilaya and Ilawod before Mini Activity 1.'
        },
        {
            check: () => done('ehistory-l2-a2-completed'),
            link: 'lesson-2-activity-2.html',
            fil: 'Susunod: Mini Gawain 2 ng Aralin 2. Balikan ang mga pangkat, tradisyon, at kulturang tinalakay sa aralin.',
            en: 'Next: Lesson 2 Mini Activity 2. Review the groups, traditions, and cultural ideas discussed in the lesson.'
        },
        {
            check: () => done('ehistory-l2-a3-completed'),
            link: 'lesson-2-activity-3.html',
            fil: 'Susunod: Mini Gawain 3 ng Aralin 2.',
            en: 'Next: Lesson 2 Mini Activity 3.'
        },
        {
            check: () => done('ehistory-assessment-2-completed'),
            link: 'assessment-2.html',
            fil: 'Natapos mo na ang mga Mini Gawain sa Aralin 2. Susunod ang Lagumang Pagtataya 2.',
            en: 'You completed the Lesson 2 Mini Activities. Your next step is Summative Assessment 2.'
        },
        {
            check: () => done('ehistory-l3-a1-completed'),
            link: 'lesson-3.html',
            fil: 'Magpatuloy sa Aralin 3. Balikan ang Hiyas, Anting-anting, at Ginhawa bago Mini Gawain 1.',
            en: 'Continue to Lesson 3. Review Hiyas, Anting-anting, and Ginhawa before Mini Activity 1.'
        },
        {
            check: () => done('ehistory-l3-a2-completed'),
            link: 'lesson-3-activity-2.html',
            fil: 'Susunod: Mini Gawain 2 ng Aralin 3.',
            en: 'Next: Lesson 3 Mini Activity 2.'
        },
        {
            check: () => done('ehistory-l3-a3-completed'),
            link: 'lesson-3-activity-3.html',
            fil: 'Susunod: Mini Gawain 3 ng Aralin 3.',
            en: 'Next: Lesson 3 Mini Activity 3.'
        },
        {
            check: () => done('ehistory-exam-completed'),
            link: 'exam.html',
            fil: 'Natapos mo na ang mga aralin, mini gawain, at lagumang pagtataya. Susunod ang Markahang Pagsusulit.',
            en: 'You completed the lessons, mini activities, and summative assessments. Your next step is the Term Examination.'
        }
    ];

    const next = steps.find((step) => !step.check());

    if (next) {
        return next;
    }

    return {
        link: 'progress.html',
        fil: 'Kumpleto na ang lahat ng kasalukuyang milestone. Maaari mong tingnan ang iyong buong Learning Journey sa pahina ng Progreso.',
        en: 'All current milestones are complete. You can review your full Learning Journey on the Progress page.'
    };
}


/* ==================== 5. MESSAGE RENDERING ==================== */

function addUserMessage(textValue) {
    conversation.push({
        role: 'user',
        text: textValue
    });

    renderConversation();
}

function addAssistantMessage({ fil, en, lesson = null, link = null, sourceFil = '', sourceEn = '' }) {
    const lessonInfo = lesson ? LESSONS[lesson] : null;

    conversation.push({
        role: 'assistant',
        fil,
        en,
        link: link || lessonInfo?.link || null,
        sourceFil: sourceFil || (lessonInfo ? `Batay sa Aralin ${lesson}: ${lessonInfo.filTitle}` : ''),
        sourceEn: sourceEn || (lessonInfo ? `Based on Lesson ${lesson}: ${lessonInfo.enTitle}` : '')
    });

    renderConversation();
}

function renderConversation() {
    assistantMessages.innerHTML = '';

    conversation.forEach((message) => {
        const wrapper = document.createElement('div');
        wrapper.className = `assistant-message ${message.role}`;

        if (message.role === 'assistant') {
            const icon = document.createElement('div');
            icon.className = 'assistant-message-icon';
            icon.textContent = 'EH';
            wrapper.appendChild(icon);
        }

        const bubble = document.createElement('div');
        bubble.className = 'assistant-bubble';

        const paragraph = document.createElement('p');
        paragraph.innerHTML = escapeHtml(messageText(message)).replaceAll('\n', '<br>');
        bubble.appendChild(paragraph);

        if (message.role === 'assistant' && (sourceText(message) || message.link)) {
            const source = document.createElement('div');
            source.className = 'assistant-response-source';

            if (sourceText(message)) {
                const sourceLabel = document.createElement('span');
                sourceLabel.textContent = sourceText(message);
                source.appendChild(sourceLabel);
            }

            if (message.link) {
                const link = document.createElement('a');
                link.href = message.link;
                link.textContent = linkText();
                source.appendChild(link);
            }

            bubble.appendChild(source);
        }

        wrapper.appendChild(bubble);
        assistantMessages.appendChild(wrapper);
    });

    requestAnimationFrame(() => {
        assistantMessages.scrollTop = assistantMessages.scrollHeight;
    });
}

function welcomeMessage() {
    const name = currentProfile?.name?.trim();
    const filName = name ? `, ${name}` : '';
    const enName = name ? `, ${name}` : '';

    return {
        fil: `Kumusta${filName}! Ako ang Katuwang sa Pag-aaral ng E-HISTORY. Maaari mo akong tanungin tungkol sa Aralin 1–3, humingi ng buod, practice question, o alamin kung ano ang susunod mong gagawin.`,
        en: `Hello${enName}! I’m the E-HISTORY Learning Assistant. You can ask me about Lessons 1–3, request a summary or practice question, or ask what you should do next.`
    };
}

function resetConversation() {
    pendingPractice = null;
    conversation = [];
    addAssistantMessage(welcomeMessage());
}


/* ==================== 6. CORE ASSISTANT RESPONSES ==================== */

function assessmentAnswerRequest(normalizedQuery) {
    const formalTerms = [
        'assessment', 'pagtataya', 'summative', 'lagumang',
        'exam', 'pagsusulit', 'test', 'answer key', 'sagot', 'answer'
    ];

    const itemTerms = ['item', 'number', 'numero', 'no ', 'choice', 'letter', 'tamang sagot', 'correct answer'];

    return includesAny(normalizedQuery, formalTerms) &&
        (includesAny(normalizedQuery, itemTerms) || /\b\d{1,2}\b/.test(normalizedQuery));
}

function summaryIntent(normalizedQuery) {
    const wantsSummary = includesAny(normalizedQuery, ['buod', 'summary', 'summarize', 'summarise', 'review lesson', 'balik aral']);

    if (!wantsSummary) {
        return null;
    }

    if (includesAny(normalizedQuery, ['aralin 1', 'lesson 1', 'kamalayang pangkasaysayan'])) return 1;
    if (includesAny(normalizedQuery, ['aralin 2', 'lesson 2', 'heograpiya', 'geography'])) return 2;
    if (includesAny(normalizedQuery, ['aralin 3', 'lesson 3', 'paniniwala', 'beliefs'])) return 3;

    return 0;
}

function nextStepIntent(normalizedQuery) {
    return includesAny(normalizedQuery, [
        'ano ang susunod', 'anong susunod', 'next step', 'what should i do next',
        'what is next', 'susunod kong gawin', 'next activity', 'next lesson'
    ]);
}

function compareIntent(normalizedQuery) {
    return includesAny(normalizedQuery, [
        'pagkakaiba', 'difference', 'compare', 'kumpara', 'versus', ' vs ', 'alin ang'
    ]);
}

function matchedKnowledge(normalizedQuery) {
    return KNOWLEDGE
        .map((item) => {
            let score = 0;

            item.terms.forEach((term) => {
                const normalizedTerm = normalize(term);

                if (normalizedQuery === normalizedTerm) {
                    score += 8;
                } else if (normalizedQuery.includes(normalizedTerm)) {
                    score += Math.max(2, normalizedTerm.split(' ').length + 1);
                }
            });

            return { item, score };
        })
        .filter((result) => result.score > 0)
        .sort((a, b) => b.score - a.score);
}

function answerKnowledgeQuestion(rawQuery) {
    const q = normalize(rawQuery);

    if (!q) {
        return;
    }

    if (assessmentAnswerRequest(q)) {
        addAssistantMessage({
            fil: 'Hindi ako nagbibigay ng direktang sagot o answer key para sa Lagumang Pagtataya o Markahang Pagsusulit. Maaari mong sabihin kung anong konsepto ang hindi malinaw, at ipaliliwanag ko ito gamit lamang ang mga aralin ng E-HISTORY.',
            en: 'I do not provide direct answers or answer keys for Summative Assessments or the Term Examination. Tell me which concept is unclear, and I can explain it using only the E-HISTORY lessons.'
        });
        return;
    }

    const summaryLesson = summaryIntent(q);

    if (summaryLesson) {
        const lesson = LESSONS[summaryLesson];
        addAssistantMessage({
            fil: lesson.summaryFil,
            en: lesson.summaryEn,
            lesson: summaryLesson
        });
        return;
    }

    if (summaryLesson === 0) {
        addAssistantMessage({
            fil: 'May tatlong kasalukuyang aralin. Sabihin kung alin ang gusto mong ibuod: Aralin 1 — Kamalayang Pangkasaysayan; Aralin 2 — Heograpiya at Kultura; o Aralin 3 — Paniniwala at Pananampalataya.',
            en: 'There are three current lessons. Tell me which one you want summarized: Lesson 1 — Historical Consciousness; Lesson 2 — Geography and Culture; or Lesson 3 — Beliefs and Faith.',
            link: 'lesson.html',
            sourceFil: 'Mga kasalukuyang aralin ng E-HISTORY',
            sourceEn: 'Current E-HISTORY lessons'
        });
        return;
    }

    if (nextStepIntent(q)) {
        respondWithNextStep();
        return;
    }

    if (includesAny(q, ['practice question', 'practice', 'tanong para mag review', 'tanong para mag-review', 'quiz me', 'mag quiz', 'mag-quiz'])) {
        startPracticeQuestion();
        return;
    }

    const matches = matchedKnowledge(q);

    if (matches.length > 0) {
        const topScore = matches[0].score;
        const strong = matches.filter((entry) => entry.score >= Math.max(2, topScore - 1));

        if (compareIntent(q) && strong.length >= 2) {
            const first = strong[0].item;
            const second = strong.find((entry) => entry.item !== first)?.item;

            if (second) {
                addAssistantMessage({
                    fil: `${first.fil}\n\nSamantala, ${second.fil.charAt(0).toLowerCase()}${second.fil.slice(1)}`,
                    en: `${first.en}\n\nIn comparison, ${second.en.charAt(0).toLowerCase()}${second.en.slice(1)}`,
                    lesson: first.lesson === second.lesson ? first.lesson : null,
                    sourceFil: first.lesson === second.lesson ? `Batay sa Aralin ${first.lesson}` : 'Batay sa mga kasalukuyang aralin ng E-HISTORY',
                    sourceEn: first.lesson === second.lesson ? `Based on Lesson ${first.lesson}` : 'Based on the current E-HISTORY lessons',
                    link: first.lesson === second.lesson ? LESSONS[first.lesson].link : 'lesson.html'
                });
                return;
            }
        }

        const best = matches[0].item;
        addAssistantMessage({
            fil: best.fil,
            en: best.en,
            lesson: best.lesson
        });
        return;
    }

    addAssistantMessage({
        fil: 'Hindi ko makita ang paksang iyan sa tatlong kasalukuyang aralin ng E-HISTORY. Maaari kang magtanong tungkol sa Kamalayang Pangkasaysayan, Heograpiya at Kultura, o Paniniwala at Pananampalataya. Maaari mo ring banggitin ang isang terminong nasa aralin, gaya ng Ilaya, Lepa-lepa, Hiyas, o Baylan.',
        en: 'I cannot find that topic in the three current E-HISTORY lessons. You can ask about Historical Consciousness, Geography and Culture, or Beliefs and Faith. You can also mention a lesson term such as Ilaya, Lepa-lepa, Hiyas, or Baylan.',
        link: 'lesson.html',
        sourceFil: 'Saklaw: Aralin 1–3 lamang',
        sourceEn: 'Coverage: Lessons 1–3 only'
    });
}

function respondWithSummary(lessonNumber) {
    const lesson = LESSONS[lessonNumber];

    addAssistantMessage({
        fil: lesson.summaryFil,
        en: lesson.summaryEn,
        lesson: lessonNumber
    });
}

function respondWithNextStep() {
    const next = nextLearningStep();

    addAssistantMessage({
        fil: next.fil,
        en: next.en,
        link: next.link,
        sourceFil: 'Batay sa naka-save mong Learning Journey',
        sourceEn: 'Based on your saved Learning Journey'
    });
}


/* ==================== 7. PRACTICE QUESTION FLOW ==================== */

function startPracticeQuestion() {
    const item = PRACTICE_BANK[practiceCursor % PRACTICE_BANK.length];
    practiceCursor += 1;
    pendingPractice = item;

    addAssistantMessage({
        fil: `Practice Question — Aralin ${item.lesson}\n${item.qFil}\n\nI-type ang iyong sagot.`,
        en: `Practice Question — Lesson ${item.lesson}\n${item.qEn}\n\nType your answer.`,
        lesson: item.lesson
    });
}

function gradePracticeAnswer(rawAnswer) {
    const answer = normalize(rawAnswer);
    const item = pendingPractice;
    pendingPractice = null;

    const correct = item.accepted.some((accepted) =>
        answer.includes(normalize(accepted))
    );

    if (correct) {
        addAssistantMessage({
            fil: `✓ ${item.aFil}\n\nGusto mo pa ng isa? Pindutin ang “Practice Question” o i-type ang “practice.”`,
            en: `✓ ${item.aEn}\n\nWant another one? Press “Practice Question” or type “practice.”`,
            lesson: item.lesson
        });
        return;
    }

    addAssistantMessage({
        fil: `Hindi pa. ${item.aFil}\n\nBalikan ang konsepto sa Aralin ${item.lesson}, pagkatapos ay maaari kang humingi ng panibagong practice question.`,
        en: `Not quite. ${item.aEn}\n\nReview the concept in Lesson ${item.lesson}, then you can request another practice question.`,
        lesson: item.lesson
    });
}


/* ==================== 8. USER INPUT HANDLING ==================== */

function submitQuestion(rawValue) {
    const value = String(rawValue || '').trim();

    if (!value) {
        return;
    }

    addUserMessage(value);

    if (pendingPractice) {
        gradePracticeAnswer(value);
    } else {
        answerKnowledgeQuestion(value);
    }

    assistantInput.value = '';
    resizeComposer();
}

function resizeComposer() {
    assistantInput.style.height = 'auto';
    assistantInput.style.height = `${Math.min(assistantInput.scrollHeight, 130)}px`;
}

assistantForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitQuestion(assistantInput.value);
});

assistantInput.addEventListener('input', resizeComposer);

assistantInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        assistantForm.requestSubmit();
    }
});

assistantClear.addEventListener('click', resetConversation);

document.querySelectorAll('[data-assistant-action]').forEach((button) => {
    button.addEventListener('click', () => {
        const action = button.dataset.assistantAction;

        if (action === 'summary-1') respondWithSummary(1);
        if (action === 'summary-2') respondWithSummary(2);
        if (action === 'summary-3') respondWithSummary(3);
        if (action === 'next-step') respondWithNextStep();
        if (action === 'practice') startPracticeQuestion();
    });
});


/* ==================== 9. FIREBASE-AWARE PERSONALIZATION ==================== */

async function getFirebaseBridge(timeoutMs = 5000) {
    if (window.eHistoryFirebase) {
        return window.eHistoryFirebase;
    }

    return new Promise((resolve) => {
        let settled = false;

        const finish = (value) => {
            if (settled) return;
            settled = true;
            resolve(value);
        };

        window.addEventListener(
            'ehistory:firebase-ready',
            () => finish(window.eHistoryFirebase || null),
            { once: true }
        );

        setTimeout(() => finish(window.eHistoryFirebase || null), timeoutMs);
    });
}

async function loadCurrentProfile() {
    const firebase = await getFirebaseBridge();

    if (!firebase?.configured) {
        return;
    }

    try {
        await firebase.whenAuthReady();
        const state = await firebase.getAuthState();
        currentProfile = state?.profile || null;

        if (conversation.length === 1 && conversation[0].role === 'assistant') {
            conversation[0] = {
                role: 'assistant',
                ...welcomeMessage()
            };
            renderConversation();
        }

        refreshAssistantProgress();
    } catch (error) {
        console.warn('Learning Assistant profile personalization skipped:', error);
    }
}


/* ==================== 10. INITIALIZATION ==================== */

resetConversation();
refreshAssistantProgress();
loadCurrentProfile();

window.addEventListener('ehistory:languagechange', () => {
    renderConversation();
    refreshAssistantProgress();
});

window.addEventListener('ehistory:progresschange', refreshAssistantProgress);
window.addEventListener('storage', refreshAssistantProgress);
window.addEventListener('ehistory:authchange', (event) => {
    currentProfile = event.detail?.profile || null;
    refreshAssistantProgress();
});
