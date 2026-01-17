# Laravel Vue Router SPA Starter Kit

A modern, full-featured starter kit for building Single Page Applications with Laravel and Vue.js using client-side routing.

## Features

### Backend (Laravel 12)
- **Authentication** powered by [Laravel Fortify](https://laravel.com/docs/fortify)
  - Login / Registration
  - Password Reset
  - Email Verification
  - Two-Factor Authentication (2FA) with QR code setup
- **SPA Authentication** via [Laravel Sanctum](https://laravel.com/docs/sanctum)
- **API Routes** for all auth and settings operations

### Frontend (Vue 3 + Vue Router)
- **File-based Routing** with [unplugin-vue-router](https://github.com/posva/unplugin-vue-router)
- **Auto-imports** via [unplugin-auto-import](https://github.com/unplugin/unplugin-auto-import)
  - Vue Composition API (`ref`, `computed`, `watch`, etc.)
  - Vue Router (`useRouter`, `useRoute`, `definePage`)
  - Pinia stores
  - VueUse composables
- **Component Auto-registration** with [unplugin-vue-components](https://github.com/unplugin/unplugin-vue-components)
- **State Management** with [Pinia](https://pinia.vuejs.org/)
- **TypeScript** support with typed routes
- **Tailwind CSS v4** for styling
- **[shadcn-vue](https://www.shadcn-vue.com/)** UI components
- **Dark Mode** support with system preference detection

### Pages Included
- Landing page
- Dashboard (authenticated)
- Auth pages: Login, Register, Forgot Password, Reset Password, Verify Email, 2FA Challenge
- Settings pages: Profile, Password, Appearance, Two-Factor Authentication

## Requirements

- PHP 8.2+
- Node.js 18+
- Composer
- MySQL / PostgreSQL / SQLite

## Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/laravel-vue-router-starter.git
cd laravel-vue-router-starter

# Install PHP dependencies
composer install

# Install Node dependencies
npm install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# (Optional) Seed the database
php artisan db:seed

# Start the development servers
php artisan serve
npm run dev
```

## Development

```bash
# Run Laravel development server
php artisan serve

# Run Vite development server
npm run dev

# Run tests
php artisan test

# Lint and format
npm run lint
npm run format
```

## Project Structure

```
├── app/
│   ├── Actions/Fortify/      # Fortify action classes
│   ├── Http/Controllers/     # API controllers
│   ├── Models/               # Eloquent models
│   └── Providers/            # Service providers
├── resources/js/
│   ├── components/           # Vue components (auto-registered)
│   │   └── ui/               # shadcn-vue components
│   ├── composables/          # Vue composables (auto-imported)
│   ├── layouts/              # Layout components
│   ├── lib/                  # Utilities (axios, utils)
│   ├── pages/                # File-based route pages
│   ├── router/               # Vue Router configuration
│   ├── stores/               # Pinia stores
│   └── types/                # TypeScript definitions
├── routes/
│   ├── api.php               # API routes
│   └── web.php               # Web routes (SPA catch-all)
└── config/
    ├── fortify.php           # Fortify configuration
    └── sanctum.php           # Sanctum configuration
```

## Page Meta & Layouts

Define page metadata using `definePage` in your Vue files:

```vue
<script setup lang="ts">
definePage({
    meta: {
        layout: 'auth',           // 'default', 'app', or 'auth'
        title: 'Page Title',
        description: 'Page description',
        requiresAuth: true,       // Requires authentication
        requiresGuest: false,     // Only for guests
    },
});
</script>
```

## Authentication Flow

The starter kit uses Sanctum's SPA authentication:

1. Frontend calls `/sanctum/csrf-cookie` to get CSRF token
2. All subsequent requests include the CSRF token automatically
3. Session-based authentication (no tokens needed in frontend)

## License

MIT License
