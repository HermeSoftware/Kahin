# Kahin - AI-Powered Fortune Telling Application

## Overview

Kahin is a mystical fortune telling web application that provides personalized fortune interpretations using AI technology. The application offers four main types of fortune telling services: Tarot readings, Coffee cup fortune telling (through image analysis), Daily horoscopes, and Dream interpretations. Each service uses Google's Gemini AI to generate unique, personalized readings for users.

The application features a modern, mystical-themed user interface built with React and styled using Tailwind CSS with shadcn/ui components. It provides an immersive experience with floating animations, gradient backgrounds, and Turkish language support for a local audience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built using React with TypeScript, featuring a component-based architecture:
- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state management and caching
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
The server follows a REST API design pattern:
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Structure**: RESTful endpoints organized by feature (tarot, coffee, horoscope, dreams)
- **File Handling**: Multer middleware for image uploads with memory storage
- **Development**: Hot module replacement via Vite integration

### Data Storage Solutions
- **Primary Storage**: In-memory storage implementation (MemStorage class) for development
- **Database Schema**: Drizzle ORM with PostgreSQL schema definitions for production
- **Data Models**: Users table with authentication fields and zodiac signs, Fortunes table storing readings with JSON metadata
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)

### AI Integration Architecture
- **Primary AI Service**: Google Gemini AI (gemini-2.5-flash model)
- **Service Layer**: Dedicated Gemini service module with specialized functions for each fortune type
- **Prompt Engineering**: Custom Turkish prompts optimized for each fortune telling method
- **Image Processing**: Base64 image analysis for coffee cup fortune telling
- **Content Generation**: Dynamic, personalized interpretations for each reading type

## External Dependencies

### Core AI Services
- **Google Gemini AI**: Primary AI service for generating fortune interpretations
- **@google/genai**: Official Google AI SDK for Node.js integration

### Database & Storage
- **PostgreSQL**: Production database (configured via Drizzle)
- **@neondatabase/serverless**: Serverless PostgreSQL client for cloud deployment
- **Drizzle ORM**: Type-safe database operations and migrations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### UI & Frontend Libraries
- **React Ecosystem**: React 18 with TypeScript support
- **Radix UI**: Accessible component primitives (@radix-ui/react-*)
- **TanStack React Query**: Server state management and data fetching
- **Wouter**: Lightweight routing library
- **Tailwind CSS**: Utility-first CSS framework with custom design system

### Development & Build Tools
- **Vite**: Fast build tool and development server
- **ESBuild**: JavaScript bundler for production builds
- **TypeScript**: Type safety and enhanced developer experience
- **Replit Integration**: Development environment optimizations (@replit/vite-plugin-*)

### Image & File Processing
- **Multer**: Multipart form data handling for image uploads
- **Sharp** (implied): Image processing capabilities for fortune telling analysis