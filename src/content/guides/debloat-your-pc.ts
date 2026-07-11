import type { Guide } from './types';

const guide: Guide = {
  title: 'Debloat Your PC',
  slug: 'debloat-your-pc',
  description:
    'A careful, step-by-step approach to cleaning up a Windows PC: removing unused software, cutting startup times, and reducing background noise without risking system stability.',
  type: 'workflow',
  updatedDate: '2025-01-15',
  tools: ['BleachBit'],
  relatedToolIds: ['bleachbit', 'chris-titus-winutil'],
  relatedCategorySlugs: ['utilities'],
  relatedTags: ['cross-platform', 'offline-capable', 'privacy-focused'],
  toolLinks: {
    'BleachBit': 'bleachbit',
    'WinUtil': 'chris-titus-winutil',
  },
  body: [
    {
      type: 'paragraph',
      text: "Windows accumulates software over time: pre-installed apps, manufacturer bloatware, trial software, and background services that run whether you use them or not. This guide covers a measured approach to reducing that clutter. The goal is a cleaner, faster system, not a stripped-down installation that causes problems later.",
    },
    {
      type: 'heading',
      level: 2,
      text: 'Before anything: create a restore point',
    },
    {
      type: 'paragraph',
      text: 'Before making any system changes, create a restore point. Open the Start menu, search for "Create a restore point," and follow the prompts in the System Properties window. This gives you a fallback if something goes wrong. Do not skip this step.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Uninstall unused software',
    },
    {
      type: 'paragraph',
      text: 'Start with Settings, then Apps, then Installed apps. Work through the list and uninstall anything you do not use. For manufacturer-installed software, be selective: some of it controls hardware features. If you are unsure what something does, look it up before uninstalling.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Disable startup programs',
    },
    {
      type: 'paragraph',
      text: 'Open Task Manager with Ctrl + Shift + Esc and go to the Startup Apps tab. Review which programs are set to launch at boot and disable the ones you do not need running immediately. This does not uninstall anything; it just prevents those apps from loading when Windows starts. Antivirus software and hardware drivers should stay enabled.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Review background apps',
    },
    {
      type: 'paragraph',
      text: 'In Settings, search for "Background apps" and review which apps have permission to run in the background and send notifications when not in use. Disabling background activity for apps you rarely open reduces CPU and network usage without affecting the apps when you do run them.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Chris Titus WinUtil',
    },
    {
      type: 'paragraph',
      text: "Chris Titus Tech's WinUtil is a community-built PowerShell script that provides a graphical interface for debloating Windows, adjusting privacy settings, and tweaking system performance. It is one of the most widely used tools for this purpose and is actively maintained on GitHub. To run it, open PowerShell as administrator and paste the one-line command from the project's GitHub page. A window opens with tabbed sections covering installs, tweaks, and config.",
    },
    {
      type: 'heading',
      level: 3,
      text: 'What the Tweaks tab does',
    },
    {
      type: 'paragraph',
      text: 'The Tweaks tab is where most of the debloating happens. It lets you disable Windows telemetry, remove pre-installed Microsoft apps (Teams, Xbox, Cortana, and others), turn off Bing search in the Start menu, disable activity history and advertising ID, and adjust power plan settings. Each option is a checkbox. You select what you want and apply. Changes write to the registry and modify services in bulk.',
    },
    {
      type: 'heading',
      level: 3,
      text: 'The desktop and laptop presets',
    },
    {
      type: 'paragraph',
      text: 'WinUtil includes a Desktop and a Laptop preset. These select a curated group of tweaks suited to each use case. The Laptop preset keeps battery-related services intact. For most users, picking the appropriate preset and reviewing what it selects before applying is the right approach. Do not apply tweaks blindly.',
    },
    {
      type: 'heading',
      level: 3,
      text: 'What to leave alone',
    },
    {
      type: 'paragraph',
      text: "Some tweaks in WinUtil disable features that look optional but affect real functionality: Windows Update controls, Windows Defender settings, and some network services. If you are not sure what a specific option does, leave it unchecked. The script links to documentation for most options. Read it. WinUtil also has an Undo feature that can revert tweaks if something breaks, but it is not a substitute for having a restore point.",
    },
    {
      type: 'callout',
      text: 'Create a restore point before running WinUtil. The tool modifies system services and registry keys at scale. Most changes are reversible, but a restore point is a faster fallback than troubleshooting individual settings.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'BleachBit',
    },
    {
      type: 'paragraph',
      text: 'BleachBit clears cache files, log files, and temporary data left by applications. It is safe when used carefully. Focus on clearing browser caches and application temp files. Avoid enabling options you do not understand, and do not use it to clean the Windows registry unless you know what you are doing.',
    },
    {
      type: 'callout',
      text: 'Avoid aggressive "registry cleaners" and "PC optimizer" software that promise large speed gains. Most deliver little benefit and some cause real harm. The steps above are lower-risk and more effective.',
    },
    {
      type: 'heading',
      level: 2,
      text: 'Where to start',
    },
    {
      type: 'list',
      items: [
        'Create a restore point first — every time, before any changes',
        'Uninstall unused software via Settings → Apps → Installed apps',
        'Disable unnecessary startup programs via Task Manager → Startup Apps',
        'Review background app permissions in Settings',
        'Run WinUtil: open PowerShell as administrator, paste the command from the GitHub page, pick a preset, review selections, apply',
        'Run BleachBit afterwards for temp file and cache cleanup',
      ],
    },
  ],
};

export default guide;
