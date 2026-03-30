export type Lang = "en" | "es";

export const translations: Record<Lang, Record<string, string>> = {
  en: {
    // nav
    nav_home: "Home",
    nav_projects: "Projects",
    nav_contact: "Contact",
    nav_theme: "Theme",
    nav_lang: "Lang",

    // home
    home_hero_title: "Game & Interactive Systems Developer",
    home_hero_subtitle: "with a focus on Sound Design (SFX)",
    home_hero_desc:
      'I design and develop games and interactive systems where <span class="text-[var(--sec)] shiny-sec">code, sound, and design</span> work together to create <span class="text-[var(--sec)] shiny-sec">meaningful experiences</span>.',
    home_trailer_title: "Watch my personal trailer:",
    home_trailer_title_locked: "Shoot the aliens to unlock my trailer",
    home_trailer_title_unlocked: "Congratulations, you unlocked my trailer",
    home_trailer_restart: "Restart",
    home_trailer_skip: "Skip",

    // skills (used by SkillsList.tsx)
    skills_title: "What I build.",
    skills_games: "Games",
    skills_games_desc:
      "Creation of 2D and 3D video games and playable prototypes, focused on Programming, and game design.",
    skills_interactive: "Interactive Experiences",
    skills_interactive_desc:
      "Design and development of real-time interactive systems, generative visuals, and VR and AR experiences in unity.",
    skills_music: "Music and SFX",
    skills_music_desc:
      "Sound design for games including foley recording and game OST composing and producing. Using tools as Reaper, VCV rack, and Sony Vegas/Premiere for video editing.",

    // projects
    projects_eyebrow: "My work",
    projects_title: "Projects",
    projects_category_label: "Category",
    projects_placeholder_sub: "Placeholder",
    projects_play_more: "Play more of my games",
    projects_other: "Other projects",
    cat_games: "Games",
    cat_interactive: "Interactive Stuff",
    cat_generative: "Generative Visuals",

    // contact
    contact_eyebrow: "Let's talk",
    contact_title: "Contact",
    contact_desc:
      "Have a question or a project in mind? Feel free to reach out.",
    contact_location_label: "Location:",
    contact_location_value: "Colombia, Medellin, Antioquia",
    contact_placeholder_name: "Name",
    contact_placeholder_email: "Email",
    contact_placeholder_message: "Message",
    contact_submit: "Submit",
    contact_success: "✅ Thank you for your message!",

    // footer
    footer_rights: "All rights reserved.",
  },

  es: {
    // nav
    nav_home: "Inicio",
    nav_projects: "Proyectos",
    nav_contact: "Contacto",
    nav_theme: "Tema",
    nav_lang: "Idioma",

    // home
    home_hero_title: "Desarrollador de Juegos y Sistemas Interactivos",
    home_hero_subtitle: "con énfasis en Diseño de Sonido (SFX)",
    home_hero_desc:
      'Diseño y desarrollo juegos y sistemas interactivos donde <span class="text-[var(--sec)] shiny-sec">código, sonido y diseño</span> trabajan juntos para crear <span class="text-[var(--sec)] shiny-sec">experiencias significativas</span>.',
    home_trailer_title: "Mira mi trailer personal:",
    home_trailer_title_locked: "Dispara a los aliens para desbloquear mi trailer",
    home_trailer_title_unlocked: "Felicidades, desbloqueaste mi trailer",
    home_trailer_restart: "Reiniciar",
    home_trailer_skip: "Saltar",

    // skills
    skills_title: "Lo que hago.",
    skills_games: "Juegos",
    skills_games_desc:
      "Creación de videojuegos 2D y 3D y prototipos jugables, enfocados en Programación y diseño de juegos.",
    skills_interactive: "Experiencias Interactivas",
    skills_interactive_desc:
      "Diseño y desarrollo de sistemas interactivos en tiempo real, visuales generativos y experiencias de VR y AR en Unity.",
    skills_music: "Música y SFX",
    skills_music_desc:
      "Diseño de sonido para juegos incluyendo grabación de foley y composición y producción de OSTs. Usando herramientas como Reaper, VCV rack y Sony Vegas/Premiere para edición de video.",

    // projects
    projects_eyebrow: "Mi trabajo",
    projects_title: "Proyectos",
    projects_category_label: "Categoría",
    projects_placeholder_sub: "Próximamente",
    projects_play_more: "Juega más de mis juegos",
    projects_other: "Otros proyectos",
    cat_games: "Juegos",
    cat_interactive: "Cosas Interactivas",
    cat_generative: "Visuales Generativos",

    // contact
    contact_eyebrow: "Hablemos",
    contact_title: "Contacto",
    contact_desc:
      "¿Tienes una pregunta o un proyecto en mente? No dudes en escribirme.",
    contact_location_label: "Ubicación:",
    contact_location_value: "Colombia, Medellín, Antioquia",
    contact_placeholder_name: "Nombre",
    contact_placeholder_email: "Correo",
    contact_placeholder_message: "Mensaje",
    contact_submit: "Enviar",
    contact_success: "✅ ¡Gracias por tu mensaje!",

    // footer
    footer_rights: "Todos los derechos reservados.",
  },
};
