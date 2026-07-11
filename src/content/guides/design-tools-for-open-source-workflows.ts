import type { Guide } from './types';

const guide: Guide = {
  title: 'Design Tools for Open-Source Workflows',
  slug: 'design-tools-for-open-source-workflows',
  description:
    'A map of tools for common creative workflows: photo editing, digital painting, vector graphics, UI/UX design, 3D production, and RAW photo processing.',
  type: 'workflow',
  updatedDate: '2025-01-15',
  tools: ['GIMP', 'Krita', 'Inkscape', 'Penpot', 'Blender'],
  relatedToolIds: ['gimp', 'krita', 'inkscape', 'penpot', 'blender', 'darktable', 'rawtherapee'],
  relatedCategorySlugs: ['design'],
  relatedTags: ['cross-platform', 'offline-capable', 'advanced-users', 'customizable'],
  toolLinks: {
    'GIMP': 'gimp',
    'Krita': 'krita',
    'Inkscape': 'inkscape',
    'Penpot': 'penpot',
    'Blender': 'blender',
    'darktable': 'darktable',
    'RawTherapee': 'rawtherapee',
  },
  body: [
    {
      type: 'paragraph',
      text: 'The design tool landscape in open source has matured significantly. The tools in this guide are not perfect substitutes for every Adobe or Figma workflow, and it is not useful to frame them that way. They each do specific things well, and knowing which tool fits which task is more valuable than a direct feature comparison.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Photo editing and retouching',
    },
    {
      type: 'paragraph',
      text: 'GIMP handles raster image editing: compositing, retouching, format conversion, and layer-based workflows. It is not a Photoshop clone in terms of interface, and the learning curve reflects that. For straightforward photo editing and batch processing, it is capable. For photo-realistic compositing and color correction at a professional level, it requires more workarounds than its commercial equivalents.',
    },
    {
      type: 'callout',
      text: 'Best for: general raster editing, image manipulation, and format conversion. Not the strongest choice for precision color work.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Digital painting and illustration',
    },
    {
      type: 'paragraph',
      text: 'Krita is built for artists. Its brush engine is extensive, and it handles pressure-sensitive tablet input well. It is used professionally for concept art, comics, and texture painting. It is not designed for photo editing or print production workflows, but for drawing and painting it is genuinely competitive.',
    },
    {
      type: 'callout',
      text: 'Best for: digital painting, concept art, illustration, and comic production.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Vector graphics',
    },
    {
      type: 'paragraph',
      text: "Inkscape creates and edits vector files including SVG, PDF, and EPS. It works well for illustrations, diagrams, icon design, and print layouts. Complex typographic workflows and advanced print prepress are areas where it shows more limitations. For most vector design tasks at small-to-medium scale, it handles the job.",
    },
    {
      type: 'callout',
      text: 'Best for: SVG creation, illustrations, diagrams, and general vector design.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'UI and UX design',
    },
    {
      type: 'paragraph',
      text: 'Penpot is a browser-based design and prototyping tool with support for real-time collaboration and self-hosted deployment. It uses SVG as its native format, which makes exports clean and standards-compliant. It has been closing the gap with Figma on core features and is the most practical self-hosted option for interface design work.',
    },
    {
      type: 'callout',
      text: 'Best for: UI design, prototyping, and team design work in a self-hosted environment.',
    },
    {
      type: 'heading',
      level: 2,
      text: '3D and visual production',
    },
    {
      type: 'paragraph',
      text: 'Blender covers modeling, rigging, animation, rendering, compositing, and video editing in a single application. It is used in professional film and game production. The interface has a steep learning curve, but for 3D work there is no comparable open tool.',
    },
    {
      type: 'callout',
      text: 'Best for: 3D modeling, animation, rendering, and motion graphics.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'RAW photo processing',
    },
    {
      type: 'paragraph',
      text: 'darktable and RawTherapee both handle RAW image processing with non-destructive workflows. darktable has a stronger module-based color pipeline and is generally considered more capable for serious photographic work. RawTherapee has a different interface approach and is also well-regarded. Both require learning time but produce professional-quality results.',
    },
    {
      type: 'callout',
      text: 'Best for darktable: color science-heavy RAW workflows. Best for RawTherapee: users who prefer its processing approach or find darktable\'s interface less intuitive.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Where to start',
    },
    {
      type: 'list',
      items: [
        'Photo editing: GIMP for general work, darktable or RawTherapee for RAW processing',
        'Digital painting: Krita',
        'Vector design: Inkscape',
        'UI/UX and prototyping: Penpot',
        '3D work: Blender',
      ],
    },
    {
      type: 'paragraph',
      text: 'Each of these tools has an active community and solid documentation. Start with the one that maps to your primary workflow rather than trying to evaluate all of them at once.',
    },
  ],
};

export default guide;
