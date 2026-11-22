/** Questions SYMBOLIQUES du quiz : chaque affirmation alimente un critère de l'atlas (par son `id`). */
export type QuestionQuiz = { id: string; critere: string; texte: string };

/** Échelle de réponse : la valeur (0 à 5) est directement la note du critère. */
export const REPONSES_QUIZ: { valeur: number; label: string }[] = [
  { valeur: 0, label: 'Pas du tout' },
  { valeur: 1, label: 'Plutôt non' },
  { valeur: 3, label: 'Moyennement' },
  { valeur: 4, label: 'Plutôt oui' },
  { valeur: 5, label: 'Tout à fait' },
];

export const QUESTIONS_QUIZ: QuestionQuiz[] = [
  {
    id: 'q1',
    critere: 'materiel',
    texte: 'J’aime comprendre comment fonctionnent les composants électroniques et les machines.',
  },
  {
    id: 'q2',
    critere: 'code',
    texte: 'Écrire du code pour résoudre un problème me donne envie de continuer.',
  },
  {
    id: 'q3',
    critere: 'maths',
    texte:
      'Les maths (probabilités, algèbre, optimisation) m’attirent plutôt qu’elles ne me freinent.',
  },
  {
    id: 'q4',
    critere: 'equipe',
    texte: 'Je donne le meilleur de moi-même quand je travaille en équipe.',
  },
  {
    id: 'q5',
    critere: 'concret',
    texte: 'Je préfère voir un résultat tangible rapidement plutôt qu’une théorie abstraite.',
  },
  {
    id: 'q6',
    critere: 'creativite',
    texte: 'J’aime imaginer des solutions originales plutôt que suivre une méthode connue.',
  },
  {
    id: 'q7',
    critere: 'rigueur',
    texte: 'Je vérifie mon travail jusqu’au moindre détail avant de le rendre.',
  },
  {
    id: 'q8',
    critere: 'recherche',
    texte: 'Lire des articles scientifiques ou explorer un sujet en profondeur me passionne.',
  },
  {
    id: 'q9',
    critere: 'materiel',
    texte:
      'Je suis curieux·se de savoir comment un réseau, un capteur ou un processeur fonctionne.',
  },
  {
    id: 'q10',
    critere: 'code',
    texte: 'Je suis à l’aise pour passer plusieurs heures à programmer ou déboguer.',
  },
  {
    id: 'q11',
    critere: 'maths',
    texte: 'Modéliser un problème avec des équations me semble naturel.',
  },
  {
    id: 'q12',
    critere: 'equipe',
    texte: 'Coordonner un groupe et partager les tâches ne me pose aucun souci.',
  },
  {
    id: 'q13',
    critere: 'concret',
    texte: 'Je veux que mon travail ait un impact direct sur des utilisateurs réels.',
  },
  {
    id: 'q14',
    critere: 'creativite',
    texte: 'Je propose souvent de nouvelles idées dans mes projets.',
  },
  {
    id: 'q15',
    critere: 'rigueur',
    texte: 'Je suis organisé·e et je respecte les normes et les délais.',
  },
  {
    id: 'q16',
    critere: 'recherche',
    texte: 'Je peux persévérer longtemps sur un problème sans réponse évidente.',
  },
];
