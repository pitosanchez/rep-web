/**
 * Mock Patient Stories for REP
 * Fictional but realistic accounts representing patterns documented across communities
 */

export interface PatientStory {
  id: string;
  name: string;
  age: number;
  location: string;
  neighborhood: string;
  zip: string;
  diagnosis: string;
  diagnosisShort: string;
  accentColor: string;
  dataLayers: ('diseaseBurden' | 'careAccess' | 'environmentalExposure' | 'transit' | 'areaDeprivationIndex')[];
  profile: {
    age: number;
    ethnicity: string;
    location: string;
    diagnosis: string;
    summary: string;
  };
  narrative: string[];
  pullQuotes: string[];
  geographyContext: string[];
  reflection: {
    wishes: string;
    wouldChange: string;
    shouldKnow: string;
  };
}

export const stories: PatientStory[] = [
  {
    id: 'marcus',
    name: 'Marcus',
    age: 54,
    location: 'Mott Haven, South Bronx, New York',
    neighborhood: 'Mott Haven',
    zip: '10451',
    diagnosis: 'APOL1-Mediated Kidney Disease',
    diagnosisShort: 'APOL1-Mediated',
    accentColor: '#1B2E4B',
    dataLayers: ['diseaseBurden', 'careAccess', 'environmentalExposure', 'areaDeprivationIndex'],
    profile: {
      age: 54,
      ethnicity: 'Black / African American',
      location: 'Mott Haven, South Bronx, New York',
      diagnosis: 'APOL1-Mediated Kidney Disease — Stage 3b CKD at time of diagnosis',
      summary: 'Treated for hypertension for 11 years before a kidney function panel revealed he was in late-stage chronic kidney disease.'
    },
    narrative: [
      'I have had high blood pressure since my early forties. Nobody in the clinic ever told me that was unusual for a man my age. They handed me lisinopril and sent me home. Come back in three months. Take your blood pressure every day. That was the whole conversation, for years.',
      'I was not ignoring my health. I showed up. I took my medicine. My blood pressure readings were not perfect, but they were not alarming either. What nobody explained to me — what nobody apparently thought to look for — was that something else was happening inside my kidneys. Something that had nothing to do with whether I was taking my pill.',
      'The first sign I noticed myself was fatigue. Not tired-after-a-long-day tired. Something heavier than that. I am a facilities manager. I walk ten thousand steps before lunch. But I started coming home and sitting on the edge of the bed and not being able to move for an hour. I thought it was stress. My building had gone through three ownership changes in two years. My mother was sick. My son was between jobs. I had a lot of reasons to be exhausted that had nothing to do with my kidneys.',
      'What finally sent me to the emergency room was swelling in my legs so bad I could not get my work boots on. I had been ignoring that too, for a while, because I thought it was from being on my feet. The ER ran a basic metabolic panel and the doctor — young, seemed rushed — said my creatinine was elevated. I did not know what that meant. She referred me to nephrology. That referral sat for six weeks before anyone called me to schedule.',
      'By the time I saw the nephrologist, my GFR was thirty-one. She told me I was in Stage 3b chronic kidney disease. She mentioned something called APOL1, a gene variant that is more common in people of West African descent, that can accelerate kidney decline. She said it as almost a footnote. I had to ask her to stop and explain it. Nobody had ever mentioned this to me before. Eleven years of blood pressure treatment and nobody had ever said: this particular risk exists for you, we should be watching your kidneys more closely.',
      'I am not angry at any individual doctor. They were doing what they were trained to do. What I am angry about is a system that treats Black men with high blood pressure as a management problem, not a diagnostic puzzle. Nobody was curious about why my kidneys might be especially vulnerable. They just treated the number on the screen.',
      'I am on the transplant waitlist now. I have been for fourteen months. My daughter wants to get tested to see if she is a match. I told her to wait until the holidays are over, and then I told myself the same thing again, and then it was summer. I think part of me is still adjusting to the idea that this is real.'
    ],
    pullQuotes: [
      'Nobody told me there was a gene variant that could accelerate this. I was doing everything they told me to do. I just didn\'t know there was something else they should have been looking for.'
    ],
    geographyContext: [
      'Marcus lives in Mott Haven, a neighborhood in the South Bronx that ranks among the most economically distressed in New York City. The neighborhood has limited access to specialty care — the nearest nephrology practice with accepting new patients under his insurance is over forty-five minutes away by public transit.',
      'His primary care was delivered through a community health center that is understaffed and over-capacity. Continuity of care was fragmented — Marcus saw four different clinicians in eleven years, none of whom had visibility into his complete history.',
      'The South Bronx has some of the highest rates of environmental stressors in the state: diesel truck traffic from a major food distribution hub, persistent mold exposure in aging housing stock, chronic noise pollution.',
      'His insurance, through a Medicaid managed care plan, delayed the nephrology referral by requiring prior authorization that his primary care clinic submitted incorrectly the first time. By the time the appointment was scheduled, six weeks had passed.'
    ],
    reflection: {
      wishes: 'I wish someone had told me earlier that my blood pressure wasn\'t just a blood pressure problem. That for Black men with certain genetics, the kidneys can be in danger even when the pressure looks controlled.',
      wouldChange: 'Earlier genetic counseling or risk stratification. Annual kidney function panels starting at forty. A clinician who asked about family history of kidney disease.',
      shouldKnow: 'That fatigue and leg swelling are symptoms, not character flaws. That he had the right to ask for a specialist. That the system\'s failure to flag his risk was not the same as there being no risk.'
    }
  },
  {
    id: 'marisol',
    name: 'Marisol',
    age: 41,
    location: 'Fordham, The Bronx, New York',
    neighborhood: 'Fordham',
    zip: '10458',
    diagnosis: 'FSGS — Focal Segmental Glomerulosclerosis',
    diagnosisShort: 'FSGS',
    accentColor: '#9B3A2A',
    dataLayers: ['diseaseBurden', 'careAccess', 'areaDeprivationIndex'],
    profile: {
      age: 41,
      ethnicity: 'Latina / Mexican American (immigrant, arrived U.S. age 19)',
      location: 'Fordham neighborhood, The Bronx, New York',
      diagnosis: 'FSGS — nephrotic range proteinuria, Stage 2 CKD at diagnosis',
      summary: 'Four years of unexplained symptoms dismissed across multiple urgent care and ER visits before a Spanish-speaking nephrologist finally ordered the right test.'
    },
    narrative: [
      'The first time I noticed something was wrong with me, I was thirty-seven years old. I had just finished a double shift at the restaurant where I worked and looked down at my ankles and they were so swollen I had to take my shoes off to drive home.',
      'But it kept happening. My ankles, then my hands. Sometimes my face would be puffy in the mornings. My urine started looking foamy, which I had never seen before and did not know was a symptom of anything.',
      'I do not have a regular doctor in the United States. When I first arrived, I was not eligible for Medicaid. By the time I qualified for coverage, I had gotten used to managing things on my own or going to urgent care when something was serious.',
      'I went to urgent care three times over two years with swelling and fatigue. Each time I was seen for less than fifteen minutes. My English is functional but not strong for medical situations — I use the wrong words, I miss things, I feel embarrassed.',
      'Nobody ordered a urine test. Nobody looked at my urine. For four years.',
      'What changed was that I started going to a federally qualified health center in Fordham that had a Spanish-speaking nurse practitioner. She was the first clinician I had seen in the United States who let the appointment run long enough for me to actually explain what I was experiencing.',
      'I am on immunosuppressive therapy now. My protein levels have come down. We are watching my kidney function closely. My doctor talks about the future — not transplant yet, but monitoring carefully.'
    ],
    pullQuotes: [
      'The foamy urine had been there for four years. I mentioned it every time. Nobody ordered the test. Not because they couldn\'t — because they didn\'t listen long enough to hear what I was actually telling them.'
    ],
    geographyContext: [
      'Fordham is a dense, predominantly Latino neighborhood in the central Bronx — a community with high rates of uninsured and underinsured residents, a significant immigrant and mixed-status population.',
      'Language access in healthcare remains inconsistent across the Bronx\'s urgent care and emergency settings. Research consistently shows that language-discordant care leads to shorter visits and higher rates of missed diagnoses.',
      'Her immigration status during the early years of her symptoms meant she was outside the system most people assume is available to everyone. She had to rebuild from scratch — without a medical record that any clinician could see.',
      'The urinalysis that ultimately led to her diagnosis costs less than fifteen dollars. It is one of the most basic tests in nephrology. The barrier was not cost. The barrier was a system that did not create the conditions for a clinician to be curious enough.'
    ],
    reflection: {
      wishes: 'I wish I had known that foamy urine is not normal. That it has a name. That it means your kidneys might be losing protein and something should be done.',
      wouldChange: 'Access to a primary care relationship from the beginning. A urine test ordered at the first presentation with swelling. Language-concordant care that allowed her to describe her symptoms fully.',
      shouldKnow: 'That she had the right to ask for an interpreter. That foamy urine is a recognized symptom with a medical name — proteinuria. That FSGS, if caught earlier, responds better to treatment.'
    }
  },
  {
    id: 'jordan',
    name: 'Jordan',
    age: 29,
    location: 'Morrisania, The Bronx, New York',
    neighborhood: 'Morrisania',
    zip: '10456',
    diagnosis: 'FSGS — Focal Segmental Glomerulosclerosis',
    diagnosisShort: 'FSGS',
    accentColor: '#1F5F5B',
    dataLayers: ['careAccess', 'transit', 'areaDeprivationIndex'],
    profile: {
      age: 29,
      ethnicity: 'Biracial — Black and White',
      location: 'Morrisania neighborhood, The Bronx, New York',
      diagnosis: 'FSGS — diagnosed at 26, managed but precarious',
      summary: 'Diagnosed young through a campus health center referral, but has spent three years navigating insurance gaps, medication costs, and the structural difficulty of being sick in your twenties.'
    },
    narrative: [
      'I was the patient who did everything right, and it still almost didn\'t matter.',
      'I was twenty-six when I was diagnosed. I had been experiencing fatigue and a heaviness in my body — not pain, exactly, but a sense that something was off. I kept notes on when they happened and brought those notes to my doctor.',
      'My diagnosis happened almost by accident. I went to a campus health clinic for something unrelated and the physician\'s assistant I saw noticed my blood pressure was elevated and decided to run a full panel. The urine test showed heavy proteinuria.',
      'I aged off my parents\' insurance at twenty-six, which is also when I was diagnosed. The timing was almost cinematic in how cruel it was. My graduate stipend did not qualify me for subsidized coverage at a meaningful level.',
      'The medication itself requires regular blood-level monitoring. Every three months, labs. The clinic I see my nephrologist through operates on a schedule that does not accommodate shift work. I missed two appointments in one year because I could not find coverage for my tutoring sessions.',
      'I am in partial remission now. My protein levels are down but not gone. I think about my kidneys every day. I think about what happens if I age off my current insurance again, or if I take a job that doesn\'t offer coverage.'
    ],
    pullQuotes: [
      'I am someone who knows how to navigate systems. I have a graduate degree in public health. And I still had to take out a loan to afford the medication keeping my kidneys functional.',
      'The thing about FSGS is that it doesn\'t forgive gaps. Every month without the right medication, every missed lab — that\'s your kidneys paying a price the system decided you should bear.'
    ],
    geographyContext: [
      'The Bronx is the poorest urban county in the United States. Morrisania carries that weight with particular density — high rates of poverty and unemployment, persistent environmental exposure.',
      'Jordan\'s situation illustrates a gap that falls between the stories we typically tell about health inequity. He is not uninsured. He is not without education or health literacy. And yet the financial architecture of American healthcare functioned as a structural barrier.',
      'The age-26 insurance cliff is a documented public health problem. For a condition like FSGS, where early and consistent treatment affects long-term outcomes, a gap in care is clinical risk.',
      'New York State has expanded Medicaid, which gave Jordan more options than peers in non-expansion states. And still he took out a loan. The gap between policy and lived reality is where many young patients live indefinitely.'
    ],
    reflection: {
      wishes: 'The thing about FSGS is that it doesn\'t forgive gaps. Every month without the right medication, every missed lab — that\'s your kidneys paying a price the system decided you should bear.',
      wouldChange: 'Access to a patient navigator who understood the financial logistics of managing a chronic condition in your twenties. A care team that asked not just what he understood but what he could realistically afford.',
      shouldKnow: 'That the diagnosis was just the beginning of a negotiation — not just with his disease, but with every institution between him and the care he needed. That having information and having access are not the same thing.'
    }
  },
  {
    id: 'aisha',
    name: 'Aisha',
    age: 47,
    location: 'Hunts Point, South Bronx, New York',
    neighborhood: 'Hunts Point',
    zip: '10453',
    diagnosis: 'APOL1-Mediated Kidney Disease with Hypertensive Nephrosclerosis',
    diagnosisShort: 'APOL1 + Hypertension',
    accentColor: '#C44569',
    dataLayers: ['diseaseBurden', 'environmentalExposure', 'areaDeprivationIndex'],
    profile: {
      age: 47,
      ethnicity: 'Black / African American',
      location: 'Hunts Point, South Bronx, New York',
      diagnosis: 'Stage 3b CKD with dual etiology',
      summary: 'A nurse aide who understands kidney disease but faces barriers accessing preventive care for her own health due to work demands and insurance gaps.'
    },
    narrative: [
      'I work in a hospital. I see kidney disease every day. I see what dialysis does to people. I see transplant recipients come back for their monitoring appointments. I understand the mechanics of my own diagnosis better than most patients because I am surrounded by it.',
      'But understanding the science of kidney disease is not the same as having the time or resources to manage your own. I work double shifts as a nurse aide. I make decent money by Hunts Point standards, but my insurance has a copay structure that makes monthly visits to nephrology expensive.',
      'My blood pressure has been elevated since my thirties. Nobody told me in my thirties that I needed aggressive management. By the time I found out I was in Stage 3 kidney disease, I had probably been in the early stages for years.',
      'I take my medications. I show up to my appointments. But I am always working — the shifts, the commute, caring for my nieces who live with me. My nephrologist keeps saying I need to reduce stress. I want to ask her what she suggests I stop doing.'
    ],
    pullQuotes: [
      'I work in a hospital and still I almost missed my own kidney disease. The system is not designed to catch it unless you have time to look for it.'
    ],
    geographyContext: [
      'Hunts Point is a neighborhood defined by its food distribution infrastructure — trucks, warehouses, constant traffic. The air quality is among the worst in the city. For someone like Aisha, who works night shifts, the environmental exposure is continuous.',
      'She is employed and insured. This sometimes means she falls through gaps in the safety net programs designed for the uninsured. Her copays are affordable but not negligible when multiplied across specialist visits.',
      'Her ability to manage her kidney disease depends on a schedule and energy that her job does not provide. This is not a failure of her adherence. It is a failure of expecting chronically ill people to manage their disease on top of precarious employment.'
    ],
    reflection: {
      wishes: 'That someone had told me in my thirties that my blood pressure mattered more than I thought. That the cumulative stress of being a Black woman in America is not something you manage — it is something you survive, and surviving it accelerates kidney disease.',
      wouldChange: 'A work schedule that allows for afternoon appointments. A health system that compensated workers for time spent in medical care. An honest conversation about the fact that you cannot reduce stress when your life is stress.',
      shouldKnow: 'That I am not failing. That the system is failing me. That even people who understand kidney disease, who work in healthcare, can still end up in late-stage disease because the system is not designed to protect us.'
    }
  },
  {
    id: 'david',
    name: 'David',
    age: 52,
    location: 'Melrose, The Bronx, New York',
    neighborhood: 'Melrose',
    zip: '10459',
    diagnosis: 'APOL1-Mediated Kidney Disease with HIV',
    diagnosisShort: 'APOL1 + HIV',
    accentColor: '#8B6F47',
    dataLayers: ['careAccess', 'environmentalExposure', 'areaDeprivationIndex'],
    profile: {
      age: 52,
      ethnicity: 'Black / African American',
      location: 'Melrose, The Bronx, New York',
      diagnosis: 'Stage 4 CKD — dual diagnosis with HIV',
      summary: 'Living with both HIV and APOL1-mediated kidney disease, managing two complex conditions with one health system that is not always coordinated in his care.'
    },
    narrative: [
      'I have been living with HIV for twenty-eight years. When I was diagnosed, people thought I was going to die. I did not. I managed my disease, I took my medications, I survived when many people I knew did not.',
      'I made it to this point in my life thinking about my CD4 count and my viral load. I had learned to navigate the HIV care system. I knew the medications, I knew what the numbers meant, I knew how to advocate for myself within that system.',
      'But kidney disease is different. It is slower. It is less visible. My HIV doctor monitors my kidney function because he knows it matters, but he is not a nephrologist. My nephrologist knows kidney disease but does not specialize in patients with HIV. They do not always talk to each other.',
      'The medications that work for HIV can damage kidneys. The medications that protect kidneys can complicate HIV management. I am in the middle of these calculations, trying to find a medication regimen that does not destroy one organ while saving another.',
      'I have survived thirty years. I am not ready to die of kidney failure when I made it through the AIDS crisis. But I am also realistic about the fact that the system is not built for people like me — people with more than one serious condition, more than one vulnerability.'
    ],
    pullQuotes: [
      'I survived the AIDS crisis. I made it to the era of undetectable equals untransmittable. And now I am facing the possibility of kidney failure because the system cannot coordinate care between HIV and nephrology.'
    ],
    geographyContext: [
      'Melrose has a significant population of people living with HIV and a history of being ground zero for the AIDS crisis in the Bronx. But the infrastructure for coordinated complex care — for people managing multiple chronic conditions — remains fragmented.',
      'The HIV specialty clinics in the Bronx exist. The nephrology services exist. But they operate in parallel, not in coordination. For David, this means his care is sometimes contradictory — medications prescribed by one doctor that complicate management by another.',
      'The environmental exposures of Melrose — air pollution, food environment, transit-related stress — compound his health risks. He has not only survived HIV but also has to navigate the conditions that made him vulnerable to HIV in the first place.'
    ],
    reflection: {
      wishes: 'That my HIV doctor and my nephrologist would talk to each other. That the medications I need to survive one condition did not endanger another. That after thirty years of surviving, I could know that the system would not let me down now.',
      wouldChange: 'Integrated care. A team approach where HIV and nephrology communicate in real time. A system that sees David as a whole person, not as separate diagnoses in separate clinics.',
      shouldKnow: 'That surviving HIV is an accomplishment. That his life has value. That the system failing him is not because his conditions are too complex — it is because the system is too fragmented to care for people like him properly.'
    }
  },
  {
    id: 'regina',
    name: 'Regina',
    age: 38,
    location: 'Pelham Parkway, The Bronx, New York',
    neighborhood: 'Pelham Parkway',
    zip: '10461',
    diagnosis: 'FSGS — Secondary to Obesity',
    diagnosisShort: 'FSGS (Secondary)',
    accentColor: '#6B7280',
    dataLayers: ['environmentalExposure', 'areaDeprivationIndex'],
    profile: {
      age: 38,
      ethnicity: 'Black / African American',
      location: 'Pelham Parkway, The Bronx, New York',
      diagnosis: 'FSGS secondary to obesity, Stage 2 CKD',
      summary: 'Struggling to lose weight in a neighborhood with limited healthy food access, and facing stigma from clinicians about her body while her kidneys deteriorate.'
    },
    narrative: [
      'Everyone talks about weight and kidney disease like it is simple. Like if I just lost weight, my kidneys would stop leaking protein. Like if I just had some willpower, I would not be in this situation.',
      'I live in Pelham Parkway. There are three bodegas within walking distance and a Popeyes two blocks away. There is no grocery store that sells fresh vegetables for prices that make sense on my salary. I work full-time as a receptionist. I am tired. I eat what is available.',
      'I am not ignorant about nutrition. I know that a Popeyes meal is not the same as grilled chicken and broccoli. I cannot magic a supermarket into existence in my neighborhood. I cannot magic a salary that allows me to buy organic produce. I cannot magic hours in my day to exercise when I am working, coming home, caring for my mother.',
      'My nephrologist has been very clear that I need to lose weight. As if my kidney disease is punishment for not being thin enough. As if I have chosen this. She does not ask about my neighborhood, about my access, about what is realistic for me. She tells me what I need to do, and then she is confused when I do not do it.',
      'I am not in denial. My kidneys are leaking protein. That is real. But the weight stigma, the implication that I am failing, the lack of help with any of the actual structural barriers to weight loss — that is also real, and it makes it harder to engage with my care.'
    ],
    pullQuotes: [
      'Everyone acts like my kidney disease is a moral failing. Like if I were thinner, better, more disciplined, I would not be sick. But there is no supermarket in my neighborhood. How does willpower solve that?'
    ],
    geographyContext: [
      'Pelham Parkway is a neighborhood with high rates of food insecurity despite being in New York City. The nearest full-service supermarket requires a bus trip. The corner stores sell processed foods at prices higher than supermarkets charge in wealthier neighborhoods.',
      'The neighborhood has high rates of obesity, diabetes, and hypertension — not because of individual failures but because of structural food apartheid. For Regina, the advice to lose weight functions as victim-blaming when the system created the conditions that make healthy eating inaccessible.',
      'Exercise is complicated in neighborhoods where parks are not well-maintained, where walking at night is not safe, where time is a resource stretched thin. The clinical recommendation assumes a life Regina does not have.'
    ],
    reflection: {
      wishes: 'That my nephrologist would ask about my neighborhood before telling me to lose weight. That the system would provide support for weight loss rather than just judgment. That I could separate my body from moral judgment and just focus on keeping my kidneys working.',
      wouldChange: 'A primary care physician who understands that weight is not a behavior problem but a structural one. Referral to a nutritionist who could help with what is actually available to me. A nephrologist who treats obesity as a barrier to overcome, not a character flaw.',
      shouldKnow: 'That her kidney disease is real. That her inability to lose weight is not a failure of discipline. That the system created the conditions that made her vulnerable to both obesity and kidney disease, and it should not expect her to overcome that alone.'
    }
  }
];

export const getStoryById = (id: string): PatientStory | undefined => {
  return stories.find(story => story.id === id);
};

export const getStoriesByZip = (zip: string): PatientStory[] => {
  return stories.filter(story => story.zip === zip);
};

export const getStoriesByNeighborhood = (neighborhood: string): PatientStory[] => {
  return stories.filter(story => story.neighborhood === neighborhood);
};
