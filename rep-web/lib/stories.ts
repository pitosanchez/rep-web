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
  diagnosis: string;
  diagnosisShort: string;
  accentColor: string;
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
    diagnosis: 'APOL1-Mediated Kidney Disease',
    diagnosisShort: 'APOL1-Mediated',
    accentColor: '#1B2E4B',
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
      'Marcus lives in Mott Haven, a neighborhood in the South Bronx that ranks among the most economically distressed in New York City. The neighborhood has limited access to specialty care — the nearest nephrology practice with accepting new patients under his insurance is over forty-five minutes away by public transit. For a man working full shifts on his feet, a mid-day specialist appointment means losing wages he cannot replace.',
      'His primary care was delivered through a community health center that, by its own accounts, is understaffed and over-capacity. Continuity of care was fragmented — Marcus saw four different clinicians in eleven years, none of whom had visibility into his complete history. The APOL1 risk conversation, which might have triggered earlier and more aggressive monitoring, requires both genetic awareness and time in the visit. Neither was available to him.',
      'The South Bronx has some of the highest rates of environmental stressors in the state: diesel truck traffic from a major food distribution hub, persistent mold exposure in aging housing stock, chronic noise pollution. Research continues to examine the relationship between environmental stressors and kidney disease progression. For Marcus, these are not abstractions — they are the conditions of his daily life.',
      'His insurance, through a Medicaid managed care plan, delayed the nephrology referral by requiring prior authorization that his primary care clinic submitted incorrectly the first time. By the time the appointment was scheduled and completed, six weeks had passed. At his GFR level, that window matters.'
    ],
    reflection: {
      wishes: 'I wish someone had told me earlier that my blood pressure wasn\'t just a blood pressure problem. That for Black men with certain genetics, the kidneys can be in danger even when the pressure looks controlled. I would have asked different questions. I would have pushed harder.',
      wouldChange: 'Earlier genetic counseling or risk stratification. Annual kidney function panels starting at forty. A clinician who asked not just about his blood pressure but about his family history of kidney disease — which, he later learned, included a grandmother who died with fluid in her lungs and an uncle on dialysis for years before he passed.',
      shouldKnow: 'That fatigue and leg swelling are symptoms, not character flaws. That he had the right to ask for a specialist. That the system\'s failure to flag his risk was not the same as there being no risk.'
    }
  },
  {
    id: 'marisol',
    name: 'Marisol',
    age: 41,
    location: 'Fordham, The Bronx, New York',
    neighborhood: 'Fordham',
    diagnosis: 'FSGS — Focal Segmental Glomerulosclerosis',
    diagnosisShort: 'FSGS',
    accentColor: '#9B3A2A',
    profile: {
      age: 41,
      ethnicity: 'Latina / Mexican American (immigrant, arrived U.S. age 19)',
      location: 'Fordham neighborhood, The Bronx, New York',
      diagnosis: 'FSGS — nephrotic range proteinuria, Stage 2 CKD at diagnosis',
      summary: 'Four years of unexplained symptoms dismissed across multiple urgent care and ER visits before a Spanish-speaking nephrologist finally ordered the right test.'
    },
    narrative: [
      'The first time I noticed something was wrong with me, I was thirty-seven years old. I had just finished a double shift at the restaurant where I worked — I was a prep cook, on my feet from six in the morning to three in the afternoon — and I looked down at my ankles and they were so swollen I had to take my shoes off to drive home. I thought maybe I had twisted something. I put ice on it. I went to sleep.',
      'But it kept happening. My ankles, then my hands. Sometimes my face would be puffy in the mornings. My urine started looking foamy, which I had never seen before and did not know was a symptom of anything. I tried to look it up online in Spanish but could not find clear information. I mentioned it to a coworker who said it was probably just stress or too much salt.',
      'I do not have a regular doctor in the United States. When I first arrived, I was not eligible for Medicaid, and the process for finding a community clinic that served uninsured patients felt impossible to navigate without help. By the time I qualified for coverage, I had gotten used to managing things on my own or going to urgent care when something was serious.',
      'I went to urgent care three times over two years with swelling and fatigue. Each time I was seen for less than fifteen minutes. My English is functional but not strong for medical situations — I use the wrong words, I miss things, I feel embarrassed to ask the clinician to repeat themselves. Twice I was told my blood pressure was slightly elevated and given pamphlets in English about a low-sodium diet. Once I was told my symptoms might be related to my weight and to try walking more.',
      'Nobody ordered a urine test. Nobody looked at my urine. For four years.',
      'What changed was that I started going to a federally qualified health center in Fordham that had a Spanish-speaking nurse practitioner. She was the first clinician I had seen in the United States who let the appointment run long enough for me to actually explain what I was experiencing. She ordered a urine protein test. The result came back flagged. She referred me to nephrology, and the nephrologist she sent me to spoke Spanish.',
      'I remember sitting in that nephrologist\'s office and hearing him say, in Spanish, that I had a condition called FSGS, that my kidneys had been leaking protein for what was probably years, that we had some options but we needed to move quickly. I cried. Not because of the diagnosis. Because someone was finally talking to me like a person who deserved to understand what was happening inside her own body.',
      'I am on immunosuppressive therapy now. My protein levels have come down. We are watching my kidney function closely. My doctor talks about the future — not transplant yet, but monitoring carefully. I am trying to stay hopeful. Some days that is easier than others.',
      'I have two daughters. The older one, who is nineteen, helps me at appointments now when she can. She translates the parts that get complicated. I should not need my daughter to interpret my medical care. But she is the reason I do not leave appointments still confused.'
    ],
    pullQuotes: [
      'The foamy urine had been there for four years. I mentioned it every time. Nobody ordered the test. Not because they couldn\'t — because they didn\'t listen long enough to hear what I was actually telling them.'
    ],
    geographyContext: [
      'Fordham is a dense, predominantly Latino neighborhood in the central Bronx — a community with high rates of uninsured and underinsured residents, a significant immigrant and mixed-status population, and chronic exposure to environmental stressors including diesel truck traffic, deteriorating housing, and one of the highest asthma rates in the country. Environmental nephrotoxins — substances that damage the kidneys — remain an active area of research in communities with Marisol\'s exposure profile.',
      'Language access in healthcare remains inconsistent across the Bronx\'s urgent care and emergency settings. Marisol\'s primary experience of the American healthcare system was through clinics that used phone translation services or had no interpretation support at all. Research consistently shows that language-discordant care leads to shorter visits, less information exchange, and higher rates of missed diagnoses.',
      'Her immigration status during the early years of her symptoms meant she was outside the system most people assume is available to everyone. She was not eligible for the insurance that would have connected her to a primary care relationship. When she did gain coverage, she had to rebuild from scratch — without a medical record that any clinician could see, without a care team that knew her history.',
      'The urinalysis that ultimately led to her diagnosis costs less than fifteen dollars. It is one of the most basic tests in nephrology. The barrier was not cost. The barrier was a system that did not create the conditions for a clinician to be curious enough, or have enough time, to order it.'
    ],
    reflection: {
      wishes: 'I wish I had known that foamy urine is not normal. That it has a name. That it means your kidneys might be losing protein and something should be done. Nobody told me this was a symptom. I thought it was just how things were for me.',
      wouldChange: 'Access to a primary care relationship from the beginning. A urine test ordered at the first presentation with edema. Language-concordant care that allowed her to describe her symptoms fully and accurately. A system that treated her urgency as real, not as an inconvenience.',
      shouldKnow: 'That she had the right to ask for an interpreter. That foamy urine is a recognized symptom with a medical name — proteinuria. That FSGS, if caught earlier, responds better to treatment. That four years of a curable delay is not inevitable. It is a choice the system made.'
    }
  },
  {
    id: 'jordan',
    name: 'Jordan',
    age: 29,
    location: 'Morrisania, The Bronx, New York',
    neighborhood: 'Morrisania',
    diagnosis: 'FSGS — Focal Segmental Glomerulosclerosis',
    diagnosisShort: 'FSGS',
    accentColor: '#1F5F5B',
    profile: {
      age: 29,
      ethnicity: 'Biracial — Black and White (self-identified as mixed-race)',
      location: 'Morrisania neighborhood, The Bronx, New York',
      diagnosis: 'FSGS — diagnosed at 26, managed but precarious',
      summary: 'Diagnosed young through a campus health center referral, but has spent three years navigating insurance gaps, medication costs, and the structural difficulty of being sick in your twenties without a safety net.'
    },
    narrative: [
      'I was the patient who did everything right, and it still almost didn\'t matter.',
      'I was twenty-six when I was diagnosed. I had been experiencing fatigue and what I can only describe as a heaviness in my body — not pain, exactly, but a sense that something was off. I had Googled my symptoms obsessively, which I know is not great medicine, but I had also kept notes on when they happened and brought those notes to my doctor. I advocate for myself. I know the language. I work in public health. I had every advantage a young patient can have, and I still had to fight.',
      'My diagnosis happened almost by accident. I went to a campus health clinic for something unrelated — I was still finishing my graduate degree at Fordham — and the physician\'s assistant I saw noticed my blood pressure was elevated for someone my age and decided to run a full panel. The urine test showed heavy proteinuria. She referred me to nephrology at Montefiore. I looked up FSGS that night and read everything I could find. By the time I had my first nephrology appointment I had already joined an online patient community and read three clinical summaries.',
      'Knowing the medical facts did not protect me from what came next.',
      'I aged off my parents\' insurance at twenty-six, which is also when I was diagnosed. The timing was almost cinematic in how cruel it was. My graduate stipend did not qualify me for subsidized coverage at a meaningful level. The ACA marketplace plan I could afford had a deductible so high that my first year of treatment — biopsies, labs, specialist visits, the initial course of immunosuppression — cost me over nine thousand dollars out of pocket. I took out a personal loan. I deferred paying back my student loans. I ate less. I am not being dramatic. I made a calculation about what I could not afford, and food was more negotiable than the drug that was keeping my kidneys from getting worse.',
      'The medication itself — a calcineurin inhibitor — requires regular blood-level monitoring. Every three months, labs. In the first year, more often. The Bronx has Montefiore and Lincoln Hospital, so I am not without options the way people in rural areas are. But the clinic I see my nephrologist through operates on a schedule that does not accommodate shift work. I was working three part-time jobs while finishing my degree. I missed two appointments in one year because I could not find coverage for the tutoring sessions I was leading. Those missed appointments reset the relationship with my care team.',
      'I am in partial remission now. My protein levels are down but not gone. My nephrologist is cautiously optimistic, which I have learned to translate as: we are managing this, but we are not out of the woods. I think about my kidneys every day. I think about what happens if I age off my current insurance again, or if I take a job that doesn\'t offer coverage, or if the drug I am on stops working and we need something newer and more expensive.',
      'Being young and sick is its own kind of isolation. Most people my age are not thinking about GFR levels or transplant waitlists. The things that occupy my mind are not things I can easily explain at a dinner table. I have a partner who is patient and tries to understand. I have learned to accept that some fear is just part of this now. I have not fully accepted that this is a permanent condition of my life, but I am getting there.'
    ],
    pullQuotes: [
      'I am someone who knows how to navigate systems. I have a graduate degree in public health. I read the literature. And I still had to take out a loan to afford the medication keeping my kidneys functional. What happens to people who don\'t have those tools?',
      'The thing about FSGS is that it doesn\'t forgive gaps. Every month without the right medication, every missed lab, every appointment that slips because you can\'t take time off work — that\'s not just inconvenience. That\'s your kidneys paying a price the system decided you should bear.'
    ],
    geographyContext: [
      'The Bronx is the poorest urban county in the United States. Morrisania carries that weight with particular density — high rates of poverty and unemployment, persistent environmental exposure from industrial corridors and highway pollution, a housing stock that combines aging infrastructure with rapid gentrification pressure. For kidney disease patients, the area\'s documented history of lead exposure, poor air quality, and flooding-related contaminants are not background noise. They are clinical context.',
      'Jordan\'s situation illustrates a gap that falls between the stories we typically tell about health inequity. He is not uninsured. He is not without education or health literacy. He is not in a care desert — the Bronx has Lincoln Hospital, Montefiore, BronxCare. And yet the financial architecture of American healthcare — the gap between diagnosis and affordability, between knowing what you need and being able to access it without going into debt — functioned as a structural barrier as real as any other.',
      'The age-26 insurance cliff is a documented public health problem. For young adults diagnosed with chronic conditions in the years just before that cutoff, the timing creates a treatment discontinuity that has measurable effects on disease progression. For a condition like FSGS, where early and consistent treatment affects long-term outcomes, a gap in care or medication is not administrative inconvenience — it is clinical risk.',
      'New York State has expanded Medicaid, which gave Jordan more options than peers in non-expansion states. And still he took out a loan. The gap between policy and lived reality — between what a system technically offers and what a person working three jobs while finishing a degree can actually access — is where Jordan lived for the first year of his diagnosis. It is where many young patients in the Bronx live indefinitely.'
    ],
    reflection: {
      wishes: 'The thing about FSGS is that it doesn\'t forgive gaps. Every month without the right medication, every missed lab, every appointment that slips because you can\'t take time off work — that\'s not just inconvenience. That\'s your kidneys paying a price the system decided you should bear.',
      wouldChange: 'Access to a patient navigator who understood the financial logistics of managing a chronic condition in your twenties. A care team that asked not just what he understood but what he could realistically afford and access. Systems within Medicaid and hospital financial assistance programs that were easier to find and faster to activate — because he qualified for help he did not know existed until the worst of the debt was already done.',
      shouldKnow: 'That the diagnosis was just the beginning of a negotiation — not just with his disease, but with every institution between him and the care he needed. That having information and having access are not the same thing. And that even for someone like him, with every tool and advantage a young patient could have, the American healthcare system was not designed to make this easy.'
    }
  }
];

export const getStoryById = (id: string): PatientStory | undefined => {
  return stories.find(story => story.id === id);
};
