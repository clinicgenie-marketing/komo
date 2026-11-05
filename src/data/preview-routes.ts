/** Private preview routes. Generated only when the build target is preview. */
export const previewRoutes = {
  concepts: {
    title: 'KOMO homepage concepts (private preview)',
    description: 'Private comparison of three homepage concepts for KOMO Wellness.',
  },
  'concept-1': {
    title: 'Concept 1, Editorial sanctuary | KOMO preview',
    description: 'Personalised scalp and hair care in a calm, welcoming space at Wheelock Place.',
  },
  'concept-2': {
    title: 'Concept 2, The care journey | KOMO preview',
    description: 'Personalised scalp and hair care in a calm, welcoming space at Wheelock Place.',
  },
  'concept-3': {
    title: 'Concept 3, Immersive retreat | KOMO preview',
    description: 'Personalised scalp and hair care in a calm, welcoming space at Wheelock Place.',
  },
} as const;
export type PreviewRouteKey = keyof typeof previewRoutes;
