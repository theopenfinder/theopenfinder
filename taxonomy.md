# OpenFinder Tagging System

This document defines the tagging system used in OpenFinder.  
It ensures listings remain consistent, searchable, and high-signal.

---

## Philosophy

- **Categories** answer → *What is this tool for?*  
- **Tags** answer → *What is it like? What capabilities does it have?*

Tags are **cross-category traits**, not classifications.

---

## Core Rules

### 1. Tags are cross-cutting traits
Tags should apply across many different kinds of tools.

- ✔ `self-hosted`, `encrypted`, `collaborative`
- ✘ Do not recreate categories as tags

---

### 2. Only tag meaningful traits
A tag should reflect a **real, notable characteristic**.

If a user filtered by that tag, they should be glad the tool appears.

---

### 3. Favor restraint
- Typical: **2–5 tags per tool**
- Too many tags reduces signal quality

---

### 4. Be consistent, not creative
Apply the same standard across similar tools.

---

### 5. When in doubt, leave it out
Precision > completeness

---

## Tag Definitions

### Platform

- **web** — primary interface is accessible via a browser  
- **desktop** — installable client for computers  
- **linux / macos / windows** — actively supported platforms  
- **android / ios** — native or serious mobile apps

---

### Hosting

- **self-hosted** — can be deployed on user-owned infrastructure (server, VPS, NAS)  
- **cloud** — primarily offered as a hosted service  
- **local-first** — local data is primary; sync is optional  
- **offline-capable** — remains meaningfully usable without internet

---

### Privacy

- **privacy-focused** — privacy is a core design goal, not incidental  
- **encrypted** — data encryption is a notable feature (not just baseline HTTPS)  
- **end-to-end-encryption** — provider cannot read user data  
- **no-tracking** — avoids analytics, tracking, or surveillance  
- **anonymous** — usable without identifying user information

---

### Technical

- **cli** — command-line interface is a core interface  
- **api** — exposes a usable or documented API  
- **extensible** — can be meaningfully extended (scripts, modules, workflows)  
- **plugin-based** — has a formal plugin/add-on system  
- **lightweight** — intentionally low resource usage / minimal footprint  
- **server-based** — runs as a service clients connect to

---

### Functional

- **real-time** — updates or collaboration happen live  
- **collaborative** — users actively work together in shared workflows  
- **automation** — supports workflows, triggers, scripting, or scheduled actions  
- **synchronization** — keeps data aligned across devices or instances  
- **cross-platform** — intentionally supports multiple platforms  
- **library-management** — managing a collection is a core purpose  
- **multi-user** — supports multiple user accounts within a system  
- **organization** — organizing/structuring content is central  
- **backup** — supports restore, versioning, or recovery

---

### UX

- **beginner-friendly** — approachable for non-technical users  
- **advanced-users** — oriented toward power users or technical workflows  
- **minimalist** — intentionally simple, low-clutter design  
- **customizable** — users can significantly alter behavior or layout

---

### Domain (use sparingly)

- **markdown** — Markdown is central to workflow    
- **llm** — large language models are core functionality  
- **speech-to-text** — transcription is a core feature  
- **text-to-speech** — speech synthesis is a core feature  
- **secure-messaging** — private messaging is the main purpose  
- **email** — email is a core function  
- **photo-management** — managing photo libraries is central  
- **knowledge-management** — focused on notes, linking, knowledge systems   

---

## Key Distinctions

### collaborative vs multi-user
- **multi-user** → multiple accounts exist  
- **collaborative** → users actively work together  

---

### synchronization vs backup
- **synchronization** → keeps state aligned  
- **backup** → restores previous state  

---

### extensible vs plugin-based
- **extensible** → broadly customizable  
- **plugin-based** → formal plugin system  

---

### organization vs library-management
- **organization** → general structuring  
- **library-management** → managing a collection is the core purpose  

---

## Tagging Workflow

When adding or editing a tool:

1. Start with **zero tags**
2. Add only what is:
   - clearly true
   - meaningful to users
3. Stop when the tool is well-described (usually 2–5 tags)

---

## Example

**Jellyfin**

- Category: Media → Streaming  
- Tags:
  - `self-hosted`
  - 'server-based'
  - `multi-user`
  - `library-management`
  - 'cross-platform'
  - 'synchronization'

---

## Contribution Guidelines

- Do not introduce new tags without discussion
- Do not duplicate categories as tags
- Apply tags consistently across similar tools
- Prefer fewer, stronger tags over many weak ones

---

## Summary

- Tags are **filters, not labels**
- Less is more
- Consistency beats completeness
- If it’s not obvious, don’t tag it
