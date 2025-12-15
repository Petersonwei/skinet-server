# Client

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Stripe Configuration

This application uses Stripe for payment processing. Before running the application, you need to configure your Stripe keys:

### Setup Instructions

1. **Create environment files from examples**:
   ```bash
   # Copy example files to create your environment files
   cp src/environments/environment.development.ts.example src/environments/environment.development.ts
   cp src/environments/environment.ts.example src/environments/environment.ts
   ```

2. **Get your Stripe API keys**:
   - Go to [Stripe Dashboard](https://dashboard.stripe.com/)
   - Navigate to Developers → API keys
   - Copy your publishable keys (starts with `pk_test_` for test mode or `pk_live_` for live mode)

3. **Update your environment files**:
   - **Development**: Edit `src/environments/environment.development.ts`
     ```typescript
     stripePublicKey: 'pk_test_your_actual_stripe_test_key_here'
     ```
   - **Production**: Edit `src/environments/environment.ts`
     ```typescript
     stripePublicKey: 'pk_live_your_actual_stripe_live_key_here'
     ```

4. **Important Security Notes**:
   - Environment files are excluded from Git via `.gitignore`
   - Never commit your actual Stripe keys to version control
   - Use test keys (`pk_test_`) during development
   - Use live keys (`pk_live_`) only in production
   - Only the `.example` files are tracked in Git

### Environment Files Structure

```typescript
export const environment = {
  production: boolean,
  apiUrl: string,
  stripePublicKey: string  // Replace with your actual Stripe publishable key
};
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
