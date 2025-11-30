# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Business Model

**CoreLearnly** is an online education platform for technical interview preparation and software engineering fundamentals.

### Course Overview
- **Instructor**: Single instructor (solo educator model)
- **Duration**: 6 months intensive program
- **Format**: Live online classes
- **Target Audience**:
  - Students preparing for placements
  - Working professionals preparing for interviews
  - Career switchers into tech
  - Anyone looking to strengthen DSA and system design skills

### Curriculum
The program covers four main areas:

1. **DSA (Data Structures & Algorithms)**
   - Core data structures
   - Algorithm design and analysis
   - Problem-solving techniques
   - Interview-focused practice

2. **LLD (Low Level Design)**
   - Object-oriented design principles
   - Design patterns
   - Component-level architecture
   - System design case studies

3. **HLD (High Level Design)**
   - Scalable system architecture
   - Distributed systems concepts
   - Real-world case studies (Uber, Netflix, etc.)
   - System design interviews preparation

4. **AI Fundamentals**
   - Basic AI concepts and understanding
   - How to use various AI tools effectively
   - AI-powered productivity (e.g., optimizing LinkedIn profiles)
   - Practical AI applications for developers

### Schedule
- **Weekdays**: 3 DSA classes per week
- **Weekends**: 1 AI-related class every weekend

### Important Distinctions
- **NO coding projects**: The program does NOT include building applications using programming languages
- **Design-focused projects**: All projects are system design case studies and architecture exercises
- **Theory + Design**: Focus is on conceptual understanding, problem-solving, and design thinking rather than implementation

### Content Tone & Voice
When writing content for this website:
- Use singular first-person perspective ("I teach", "Learn with me") - NOT plural ("we", "our team")
- Emphasize personalized mentorship and direct instruction
- Avoid phrases like "industry experts" or "team of instructors"
- Focus on the hands-on, practical nature of system design learning
- Highlight the live, interactive format

## Domain & Email Configuration

### Website
- **Production URL**: https://corelearnly.com
- **Hosting**: Netlify
- **DNS**: Managed by Netlify (nsone.net nameservers)

### Email Addresses
| Email | Purpose |
|-------|---------|
| `corelearnly@gmail.com` | Primary account (connected to all services) |
| `hello@corelearnly.com` | Automated emails, Brevo, website contact forms |
| `ganesh@corelearnly.com` | Personal communication, 1-on-1 with students |

### Email Provider
- **Provider**: Hostinger Email (₹25/user/month)
- **Domain**: corelearnly.com

### Usage Guidelines
- Use `hello@corelearnly.com` for: Workshop confirmations, reminders, automated sequences, marketing
- Use `ganesh@corelearnly.com` for: Personal follow-ups, student replies, direct communication
- Use `corelearnly@gmail.com` for: Service signups, account recovery, backups

## Project Overview

CoreLearnly-Frontend is a React 19 + TypeScript application built with Vite (using rolldown-vite 7.2.5 as the build tool). The project uses SWC for Fast Refresh and includes ESLint for code quality.

## Build System

- **Build Tool**: Vite (using rolldown-vite@7.2.5 override)
- **Compiler**: SWC via @vitejs/plugin-react-swc
- **React Version**: 19.2.0
- **TypeScript**: 5.9.3

Note: The project uses `rolldown-vite` instead of standard Vite. This is configured in package.json overrides and affects how the build process works.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (runs TypeScript check + Vite build)
npm run build

# Lint all files
npm run lint

# Preview production build locally
npm run preview
```

## TypeScript Configuration

The project uses a multi-config TypeScript setup:
- `tsconfig.json`: Root config that references other configs
- `tsconfig.app.json`: Application source code config (src directory)
- `tsconfig.node.json`: Node/build tooling config

Key compiler options in tsconfig.app.json:
- Strict mode enabled with additional strictness flags (noUnusedLocals, noUnusedParameters)
- Module resolution: "bundler"
- JSX: "react-jsx" (React 17+ JSX transform)
- Target: ES2022

## ESLint Configuration

Located in `eslint.config.js` using the flat config format:
- Ignores `dist` directory
- Targets `**/*.{ts,tsx}` files
- Extends:
  - @eslint/js recommended config
  - typescript-eslint recommended config
  - eslint-plugin-react-hooks flat recommended config
  - eslint-plugin-react-refresh vite config
- Browser globals enabled
- ECMAScript 2020

## Project Structure

```
src/
├── main.tsx         # Application entry point
├── App.tsx          # Root component
├── App.css          # App component styles
├── index.css        # Global styles
└── assets/          # Static assets (images, SVGs, etc.)
```

The project currently has a minimal structure typical of a fresh Vite + React template. As the application grows, expect to see additional directories for components, hooks, utilities, services, etc.

## React Configuration

- Uses React 19 with StrictMode enabled in main.tsx
- Entry point mounts to `#root` element in index.html
- SWC-based Fast Refresh for instant HMR

## Important Notes

- **React Compiler Incompatibility**: The React Compiler is currently not compatible with SWC. If the React Compiler needs to be used, the project would need to switch to @vitejs/plugin-react (Babel-based).
- **No Git Repository**: This directory is currently not a git repository. Consider initializing git if version control is needed.
- **Rolldown-Vite**: The project uses rolldown-vite instead of standard Vite. Be aware of this when troubleshooting build issues or looking up documentation.
